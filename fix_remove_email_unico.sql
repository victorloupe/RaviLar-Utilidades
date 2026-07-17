-- =============================================================================
-- Remove a restrição de e-mail ÚNICO da tabela customers.
-- A chave da tabela é o TELEFONE; a mesma pessoa pode ter mais de um e-mail
-- (ex: contas diferentes com o mesmo WhatsApp). Essa restrição estava
-- causando o erro "duplicate key value violates unique constraint
-- customers_email_key" na sincronização de clientes.
--
-- COMO APLICAR: cole no SQL Editor do Supabase e execute.
-- =============================================================================

ALTER TABLE public.customers DROP CONSTRAINT IF EXISTS customers_email_key;
DROP INDEX IF EXISTS public.customers_email_key;
DROP INDEX IF EXISTS public.customers_email_idx;

-- Conferência: lista as restrições únicas restantes (deve sobrar só phone/pkey)
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'public.customers'::regclass;
