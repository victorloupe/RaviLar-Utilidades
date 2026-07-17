import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { items, order_nsu, customer, address, redirect_url } = await req.json();

    // 1. Obter credenciais das variáveis de ambiente da Edge Function no Supabase
    const client_id = Deno.env.get("INFINITEPAY_CLIENT_ID");
    const client_secret = Deno.env.get("INFINITEPAY_CLIENT_SECRET");
    const handle = Deno.env.get("INFINITEPAY_HANDLE") || "victorlpereira";

    if (!items || items.length === 0) {
      return new Response(
        JSON.stringify({ error: "O carrinho precisa ter pelo menos 1 item." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Formatar os itens para centavos (InfinitePay exige preço inteiro em centavos)
    const formattedItems = items.map((item: any) => ({
      quantity: item.quantity,
      price: Math.round(Number(item.price) * 100), // Ex: 10.99 -> 1099
      description: item.description || item.name,
    }));

    // 3. Montar o payload conforme a especificação da InfinitePay
    const payload: any = {
      handle: handle,
      items: formattedItems,
    };

    if (order_nsu) payload.order_nsu = String(order_nsu);
    if (redirect_url) payload.redirect_url = redirect_url;
    
    // Webhook opcional se configurado
    const webhook_url = Deno.env.get("INFINITEPAY_WEBHOOK_URL");
    if (webhook_url) payload.webhook_url = webhook_url;

    if (customer) {
      // Enviar apenas os campos preenchidos — a InfinitePay rejeita
      // campos presentes porém vazios (ex: convidado sem e-mail)
      const cust: Record<string, string> = {};
      if (customer.name && String(customer.name).trim()) cust.name = customer.name;
      if (customer.email && String(customer.email).trim()) cust.email = customer.email;
      if (customer.phone_number && String(customer.phone_number).replace(/\D/g, "").length > 4) {
        cust.phone_number = customer.phone_number;
      }
      if (Object.keys(cust).length > 0) {
        payload.customer = cust;
      }
    }

    if (address) {
      payload.address = {
        cep: address.cep?.replace(/\D/g, ""),
        street: address.street,
        neighborhood: address.neighborhood,
        number: address.number,
        complement: address.complement || "",
      };
    }

    // 4. Se tivermos client_id e client_secret, montamos a chamada autenticada.
    // Caso contrário, enviamos uma chamada padrão de teste.
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (client_id && client_secret) {
      // Adicionar cabeçalhos de autenticação baseados nas credenciais
      // Dependendo da versão da API, pode ser um Bearer token ou autenticação básica:
      const token = btoa(`${client_id}:${client_secret}`);
      headers["Authorization"] = `Basic ${token}`;
    }

    const response = await fetch("https://api.checkout.infinitepay.io/links", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Erro retornado pela API da InfinitePay:", responseData);
      return new Response(
        JSON.stringify({ error: "Erro na API da InfinitePay ao criar o link", details: responseData }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Retorna a URL gerada com sucesso pela InfinitePay
    return new Response(
      JSON.stringify({ url: responseData.url, invoice_slug: responseData.slug || responseData.invoice_slug }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Erro interno no processamento da Edge Function:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno no servidor", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
