-- =============================================================================
-- FIX: endereço do cliente não aparece na aba Clientes do admin
--
-- 1. Backfill: copia o endereço padrão do portal (client_addresses) para a
--    tabela customers, casando por telefone limpo OU por e-mail da conta.
-- 2. Políticas da tabela customers: o cliente passa a poder ler/atualizar
--    suas linhas também pelo e-mail (antes era só pelo telefone exato,
--    o que falhava com telefone formatado ou ausente nos metadados).
--
-- COMO APLICAR: cole este arquivo inteiro no SQL Editor do Supabase e execute.
-- =============================================================================

-- 1. Backfill dos endereços padrão já cadastrados no portal
UPDATE public.customers c
SET street       = a.street,
    number       = a.number,
    neighborhood = a.neighborhood,
    city         = a.city || ' - ' || a.uf
FROM public.client_addresses a
JOIN auth.users u ON u.id = a.user_id
WHERE a.is_default = true
  AND (
      (
        regexp_replace(COALESCE(u.raw_user_meta_data->>'phone', ''), '\D', '', 'g') <> ''
        AND regexp_replace(COALESCE(c.phone, ''), '\D', '', 'g')
            = regexp_replace(COALESCE(u.raw_user_meta_data->>'phone', ''), '\D', '', 'g')
      )
      OR (c.email IS NOT NULL AND c.email = u.email)
  );

-- 2. Políticas de leitura/atualização por telefone limpo OU e-mail
DROP POLICY IF EXISTS "Permitir leitura admin ou próprio" ON public.customers;
CREATE POLICY "Permitir leitura admin ou próprio" ON public.customers FOR SELECT USING (
    public.is_admin()
    OR regexp_replace(COALESCE(phone, ''), '\D', '', 'g')
       = regexp_replace(COALESCE(auth.jwt() -> 'user_metadata' ->> 'phone', auth.jwt() ->> 'phone', ''), '\D', '', 'g')
    OR (email IS NOT NULL AND email = auth.email())
);

DROP POLICY IF EXISTS "Permitir atualização admin ou próprio" ON public.customers;
CREATE POLICY "Permitir atualização admin ou próprio" ON public.customers FOR UPDATE USING (
    public.is_admin()
    OR regexp_replace(COALESCE(phone, ''), '\D', '', 'g')
       = regexp_replace(COALESCE(auth.jwt() -> 'user_metadata' ->> 'phone', auth.jwt() ->> 'phone', ''), '\D', '', 'g')
    OR (email IS NOT NULL AND email = auth.email())
) WITH CHECK (
    public.is_admin()
    OR regexp_replace(COALESCE(phone, ''), '\D', '', 'g')
       = regexp_replace(COALESCE(auth.jwt() -> 'user_metadata' ->> 'phone', auth.jwt() ->> 'phone', ''), '\D', '', 'g')
    OR (email IS NOT NULL AND email = auth.email())
);

-- Conferência: ver como ficaram os clientes
SELECT id, phone, email, name, street, number, neighborhood, city
FROM public.customers ORDER BY created_at DESC;
