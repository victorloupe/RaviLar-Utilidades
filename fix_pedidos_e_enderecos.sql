-- =============================================================================
-- FIX 1: Mostrar no portal do cliente também os pedidos feitos com o mesmo
--        e-mail da conta (ex: pedidos feitos como convidado ou antes do login).
-- FIX 2: Preencher na tabela customers o endereço padrão já cadastrado
--        no portal (client_addresses), para aparecer na aba Clientes do admin.
--
-- COMO APLICAR: cole este arquivo inteiro no SQL Editor do Supabase e execute.
-- =============================================================================

-- 1a. Política de leitura de pedidos: dono OU mesmo e-mail OU admin
DROP POLICY IF EXISTS "orders_select_owner_or_admin" ON public.orders;
CREATE POLICY "orders_select_owner_or_admin" ON public.orders
FOR SELECT USING (
    public.is_admin()
    OR user_id = auth.uid()
    OR (client_email IS NOT NULL AND client_email = auth.email())
);

-- 1b. Mesmo critério para os itens do pedido
DROP POLICY IF EXISTS "order_items_select_owner_or_admin" ON public.order_items;
CREATE POLICY "order_items_select_owner_or_admin" ON public.order_items
FOR SELECT USING (
    public.is_admin()
    OR EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = order_items.order_id
          AND (
              orders.user_id = auth.uid()
              OR (orders.client_email IS NOT NULL AND orders.client_email = auth.email())
          )
    )
);

-- 2. Backfill: copiar o endereço padrão do portal para a tabela customers
--    (vincula pelo telefone do cadastro do usuário)
UPDATE public.customers c
SET street       = a.street,
    number       = a.number,
    neighborhood = a.neighborhood,
    city         = a.city || ' - ' || a.uf
FROM public.client_addresses a
JOIN auth.users u ON u.id = a.user_id
WHERE a.is_default = true
  AND regexp_replace(COALESCE(u.raw_user_meta_data->>'phone', ''), '\D', '', 'g') = c.phone;
