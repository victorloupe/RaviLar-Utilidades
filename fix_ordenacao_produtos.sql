-- =============================================================================
-- ORDENAÇÃO DA TABELA DE PRODUTOS NO ADMIN: último editado primeiro
--
-- Cria a coluna updated_at nos produtos + trigger que a atualiza sozinha
-- a cada edição. O admin passa a ordenar por ela (mais recente no topo).
--
-- COMO APLICAR: cole este arquivo inteiro no SQL Editor do Supabase e execute.
-- =============================================================================

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Trigger: atualiza updated_at automaticamente em todo UPDATE
CREATE OR REPLACE FUNCTION public.set_products_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.set_products_updated_at();
