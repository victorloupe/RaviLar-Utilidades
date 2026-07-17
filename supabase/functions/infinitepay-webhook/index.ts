// =============================================================================
// WEBHOOK DA INFINITEPAY
// Recebe o aviso de pagamento aprovado e:
//   1. Marca o pedido como Pago (payment_status e status)
//   2. Baixa o estoque das variações dos itens do pedido
//
// CONFIGURAÇÃO (no painel do Supabase -> Edge Functions -> Secrets):
//   WEBHOOK_SECRET  -> um código secreto seu (ex: gerado aleatório)
//
// A URL do webhook fica:
//   https://<projeto>.supabase.co/functions/v1/infinitepay-webhook?token=SEU_SEGREDO
// Configure essa URL na env INFINITEPAY_WEBHOOK_URL da função create-infinitepay-link
// (ela é enviada à InfinitePay a cada link criado).
// =============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Validar o segredo do webhook (query string ?token=...)
    const url = new URL(req.url);
    const token = url.searchParams.get("token") || "";
    const expected = Deno.env.get("WEBHOOK_SECRET") || "";
    if (!expected || token !== expected) {
      return json({ error: "Token inválido." }, 401);
    }

    const payload = await req.json();
    console.log("Webhook InfinitePay recebido:", JSON.stringify(payload));

    // 2. Extrair o número do pedido (order_nsu = id do pedido no site)
    const orderNsu = payload.order_nsu || payload.data?.order_nsu || payload.invoice?.order_nsu;
    if (!orderNsu) {
      return json({ error: "order_nsu ausente no payload." }, 400);
    }
    const orderId = parseInt(String(orderNsu));
    if (isNaN(orderId)) {
      return json({ error: "order_nsu inválido." }, 400);
    }

    // 3. Cliente com service role (ignora RLS — só roda no servidor)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 4. Buscar o pedido e evitar processamento duplicado
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();

    if (orderErr) throw orderErr;
    if (!order) return json({ error: `Pedido ${orderId} não encontrado.` }, 404);
    if (order.payment_status === "Pago") {
      return json({ ok: true, message: "Pedido já estava pago." });
    }

    // 5. Marcar como pago
    const { error: updErr } = await supabase
      .from("orders")
      .update({ payment_status: "Pago", status: "Pago" })
      .eq("id", orderId);
    if (updErr) throw updErr;

    // 6. Baixar estoque das variações dos itens
    //    (o nome do item carrega a variação: "Produto (Cor: Azul)")
    const { data: items } = await supabase
      .from("order_items")
      .select("product_id, product_name, quantity")
      .eq("order_id", orderId);

    for (const item of items || []) {
      if (!item.product_id) continue;

      const match = /\(([^:()]+):\s*([^)]+)\)\s*$/.exec(item.product_name || "");
      if (!match) continue; // item sem variação — nada a baixar

      const optionLabel = match[2].trim();

      const { data: product } = await supabase
        .from("products")
        .select("id, variations")
        .eq("id", item.product_id)
        .maybeSingle();

      if (!product || !product.variations) continue;

      let variations = product.variations;
      if (typeof variations === "string") {
        try { variations = JSON.parse(variations); } catch { continue; }
      }
      if (!variations || !Array.isArray(variations.options)) continue;

      let changed = false;
      variations.options = variations.options.map((opt: any) => {
        if (opt.label === optionLabel && typeof opt.stock === "number") {
          changed = true;
          return { ...opt, stock: Math.max(0, opt.stock - item.quantity) };
        }
        return opt;
      });

      if (changed) {
        await supabase
          .from("products")
          .update({ variations })
          .eq("id", product.id);
      }
    }

    // 7. Enviar e-mails de confirmação via Resend (se configurado)
    //    Falha no e-mail nunca derruba o webhook.
    try {
      await sendConfirmationEmails(order, items || []);
    } catch (e) {
      console.error("Falha ao enviar e-mails de confirmação:", e);
    }

    return json({ ok: true, order_id: orderId });
  } catch (error: any) {
    console.error("Erro no webhook InfinitePay:", error);
    return json({ error: error.message || "Erro interno" }, 500);
  }
});

// =============================================================================
// E-MAILS DE CONFIRMAÇÃO (Resend — https://resend.com)
// Secrets usados:
//   RESEND_API_KEY  -> chave da API (começa com re_)
//   RESEND_FROM     -> remetente (ex: "RaviLar <pedidos@seudominio.com.br>")
//                      sem domínio verificado use: "RaviLar <onboarding@resend.dev>"
//   STORE_EMAIL     -> e-mail da loja para receber o aviso de venda
// =============================================================================

function money(v: number) {
  return `R$ ${Number(v || 0).toFixed(2).replace(".", ",")}`;
}

async function sendResendEmail(to: string, subject: string, html: string) {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) return; // Resend não configurado — sai em silêncio

  const from = Deno.env.get("RESEND_FROM") || "RaviLar Utilidades <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });

  if (!res.ok) {
    console.error("Erro Resend:", res.status, await res.text());
  }
}

async function sendConfirmationEmails(order: any, items: any[]) {
  const itemsRows = items.map((it) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">${it.quantity}x ${it.product_name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${money(it.price * it.quantity)}</td>
    </tr>`).join("");

  const baseHtml = (titulo: string, intro: string) => `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#2d3748;">
    <div style="background:#ffffff;padding:18px;border-radius:8px 8px 0 0;text-align:center;border:1px solid #e2e8f0;border-bottom:3px solid #D4A75C;">
      <img src="https://ravilarutilidades.com.br/LogoSite.png" alt="RaviLar Utilidades" style="max-height:60px;">
    </div>
    <div style="border:1px solid #e2e8f0;border-top:none;padding:24px;border-radius:0 0 8px 8px;">
      <h2 style="margin:0 0 6px;font-size:1.1rem;">${titulo}</h2>
      <p style="margin:0 0 18px;font-size:0.92rem;color:#4a5568;">${intro}</p>
      <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
        ${itemsRows}
        <tr>
          <td style="padding:8px 12px;">Frete (${order.shipping_method || "Envio"})</td>
          <td style="padding:8px 12px;text-align:right;">${Number(order.shipping_fee) === 0 ? "Grátis" : money(order.shipping_fee)}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;font-weight:bold;border-top:2px solid #1A365D;">Total</td>
          <td style="padding:10px 12px;font-weight:bold;border-top:2px solid #1A365D;text-align:right;">${money(order.total_amount)}</td>
        </tr>
      </table>
      <div style="margin-top:18px;padding:12px 16px;background:#f7fafc;border-radius:6px;font-size:0.85rem;line-height:1.5;">
        <strong>Entrega:</strong> ${order.street}, nº ${order.number}${order.complement ? " - " + order.complement : ""}<br>
        ${order.neighborhood} - ${order.city}/${order.uf}${order.cep ? " - CEP " + order.cep : ""}
      </div>
      <p style="margin:18px 0 0;font-size:0.8rem;color:#718096;">Dúvidas? Fale com a gente no WhatsApp: (17) 99637-1743</p>
    </div>
  </div>`;

  // 1. E-mail para o CLIENTE (se informou e-mail no pedido)
  if (order.client_email) {
    await sendResendEmail(
      order.client_email,
      `Pagamento confirmado - Pedido #RL-${order.id} - RaviLar Utilidades`,
      baseHtml(
        `Pagamento confirmado! 🎉`,
        `Olá, ${order.client_name}! Recebemos o pagamento do seu pedido <strong>#RL-${order.id}</strong>. Já estamos preparando tudo para o envio — você pode acompanhar o andamento na área "Meus Pedidos" do site.`
      )
    );
  }

  // 2. Aviso de venda para a LOJA
  const storeEmail = Deno.env.get("STORE_EMAIL");
  if (storeEmail) {
    await sendResendEmail(
      storeEmail,
      `💰 Venda paga! Pedido #RL-${order.id} - ${order.client_name}`,
      baseHtml(
        `Novo pedido pago: #RL-${order.id}`,
        `Cliente: <strong>${order.client_name}</strong> — WhatsApp: ${order.client_phone}${order.client_email ? " — " + order.client_email : ""}. Hora de separar e enviar!`
      )
    );
  }
}
