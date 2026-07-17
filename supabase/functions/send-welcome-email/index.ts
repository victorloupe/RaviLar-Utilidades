// =============================================================================
// E-MAIL DE BOAS-VINDAS (Resend)
// Chamada pelo portal do cliente logo após o cadastro/primeiro login.
//
// Segurança:
//  - Deploy com "Verify JWT" LIGADO (padrão): só usuários logados chamam.
//  - O e-mail de destino sai do próprio token do usuário (não dá para
//    mandar e-mail para terceiros).
//  - Marca welcome_sent nos metadados para nunca enviar duplicado.
//
// Secrets usados (já configurados): RESEND_API_KEY, RESEND_FROM
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
    // 1. Identificar o usuário logado pelo token da requisição
    const authHeader = req.headers.get("Authorization") || "";
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user || !user.email) {
      return json({ error: "Usuário não autenticado." }, 401);
    }

    // 2. Já recebeu? Não envia de novo.
    if (user.user_metadata?.welcome_sent) {
      return json({ ok: true, message: "Boas-vindas já enviadas." });
    }

    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      return json({ error: "Resend não configurado." }, 500);
    }

    const from = Deno.env.get("RESEND_FROM") || "RaviLar Utilidades <onboarding@resend.dev>";
    const firstName = (user.user_metadata?.name || user.email.split("@")[0]).split(" ")[0];

    // 3. Enviar o e-mail de boas-vindas
    const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#2d3748;">
      <div style="background:#ffffff;padding:18px;border-radius:8px 8px 0 0;text-align:center;border:1px solid #e2e8f0;border-bottom:3px solid #D4A75C;">
        <img src="https://ravilarutilidades.com.br/LogoSite.png" alt="RaviLar Utilidades" style="max-height:64px;">
      </div>
      <div style="border:1px solid #e2e8f0;border-top:none;padding:28px;border-radius:0 0 8px 8px;">
        <h2 style="margin:0 0 10px;font-size:1.15rem;">Bem-vindo(a), ${firstName}! 🏡</h2>
        <p style="font-size:0.95rem;line-height:1.6;color:#4a5568;">
          Que bom ter você na RaviLar! Sua conta está pronta e agora você pode:
        </p>
        <ul style="font-size:0.92rem;line-height:1.9;color:#4a5568;padding-left:20px;">
          <li>❤️ Salvar seus produtos favoritos</li>
          <li>📦 Acompanhar seus pedidos e rastreio em tempo real</li>
          <li>📍 Guardar endereços para comprar mais rápido</li>
          <li>🎟️ Usar cupons de desconto exclusivos</li>
        </ul>
        <div style="text-align:center;margin:24px 0 8px;">
          <a href="https://ravilarutilidades.com.br/#produtos"
             style="background:#1A365D;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:bold;font-size:0.95rem;display:inline-block;">
            Ver os produtos
          </a>
        </div>
        <p style="margin:20px 0 0;font-size:0.8rem;color:#718096;text-align:center;">
          Dúvidas? Fale com a gente no WhatsApp: (17) 99637-1743
        </p>
      </div>
    </div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [user.email],
        subject: `Bem-vindo(a) à RaviLar Utilidades, ${firstName}! 🏡`,
        html,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Erro Resend:", res.status, errText);
      return json({ error: "Falha ao enviar e-mail." }, 500);
    }

    // 4. Marcar como enviado (client admin, ignora RLS)
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    await adminClient.auth.admin.updateUserById(user.id, {
      user_metadata: { ...user.user_metadata, welcome_sent: true },
    });

    return json({ ok: true });
  } catch (error: any) {
    console.error("Erro no envio de boas-vindas:", error);
    return json({ error: error.message || "Erro interno" }, 500);
  }
});
