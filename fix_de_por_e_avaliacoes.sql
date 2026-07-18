-- =============================================================================
-- DUAS NOVIDADES:
--  1. Preço "De / Por": coluna old_price nos produtos (preço antigo riscado)
--  2. Avaliações de clientes reais: quem teve pedido ENTREGUE pode avaliar
--     o produto no portal; a nota e o total de avaliações dos produtos
--     passam a ser calculados automaticamente.
--
-- COMO APLICAR: cole este arquivo inteiro no SQL Editor do Supabase e execute.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. PREÇO "DE / POR"
-- ---------------------------------------------------------------------------
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS old_price NUMERIC;

-- ---------------------------------------------------------------------------
-- 2. AVALIAÇÕES DE CLIENTES
-- ---------------------------------------------------------------------------

-- 2a. Vincular avaliação ao usuário (avaliações do admin ficam com user_id nulo)
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Um cliente só pode avaliar cada produto uma vez
CREATE UNIQUE INDEX IF NOT EXISTS reviews_user_product_unique
ON public.reviews (user_id, product_id)
WHERE user_id IS NOT NULL;

-- 2b. Política: cliente logado pode avaliar produto de pedido ENTREGUE dele
DROP POLICY IF EXISTS "reviews_insert_buyer" ON public.reviews;
CREATE POLICY "reviews_insert_buyer" ON public.reviews
FOR INSERT WITH CHECK (
    public.is_admin()
    OR (
        auth.uid() IS NOT NULL
        AND user_id = auth.uid()
        AND EXISTS (
            SELECT 1
            FROM public.orders o
            JOIN public.order_items oi ON oi.order_id = o.id
            WHERE oi.product_id = reviews.product_id
              AND o.status = 'Entregue'
              AND (
                  o.user_id = auth.uid()
                  OR (o.client_email IS NOT NULL AND o.client_email = auth.email())
              )
        )
    )
);

-- Cliente pode editar/excluir a própria avaliação (admin continua podendo tudo)
DROP POLICY IF EXISTS "Permitir atualização admin" ON public.reviews;
CREATE POLICY "Permitir atualização admin" ON public.reviews
FOR UPDATE USING (public.is_admin() OR user_id = auth.uid())
WITH CHECK (public.is_admin() OR user_id = auth.uid());

DROP POLICY IF EXISTS "Permitir exclusão admin" ON public.reviews;
CREATE POLICY "Permitir exclusão admin" ON public.reviews
FOR DELETE USING (public.is_admin() OR user_id = auth.uid());

-- 2c. Nota e contagem dos produtos recalculadas automaticamente
CREATE OR REPLACE FUNCTION public.refresh_product_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    pid BIGINT;
BEGIN
    pid := COALESCE(NEW.product_id, OLD.product_id);
    IF pid IS NOT NULL THEN
        UPDATE public.products p SET
            rating = COALESCE((SELECT ROUND(AVG(r.rating)::NUMERIC, 1) FROM public.reviews r WHERE r.product_id = pid), 5.0),
            reviews = (SELECT COUNT(*) FROM public.reviews r WHERE r.product_id = pid)
        WHERE p.id = pid;
    END IF;
    -- Se a avaliação mudou de produto, atualiza o antigo também
    IF TG_OP = 'UPDATE' AND OLD.product_id IS DISTINCT FROM NEW.product_id AND OLD.product_id IS NOT NULL THEN
        UPDATE public.products p SET
            rating = COALESCE((SELECT ROUND(AVG(r.rating)::NUMERIC, 1) FROM public.reviews r WHERE r.product_id = OLD.product_id), 5.0),
            reviews = (SELECT COUNT(*) FROM public.reviews r WHERE r.product_id = OLD.product_id)
        WHERE p.id = OLD.product_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_reviews_refresh_rating ON public.reviews;
CREATE TRIGGER trg_reviews_refresh_rating
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.refresh_product_rating();

-- 2d. Recalcular tudo agora (zera notas fictícias: produto sem avaliação
--     fica com 5.0 estrelas e contador 0, que é o comportamento da loja)
UPDATE public.products p SET
    rating = COALESCE((SELECT ROUND(AVG(r.rating)::NUMERIC, 1) FROM public.reviews r WHERE r.product_id = p.id), 5.0),
    reviews = (SELECT COUNT(*) FROM public.reviews r WHERE r.product_id = p.id);

-- Conferência
SELECT id, name, price, old_price, rating, reviews FROM public.products ORDER BY id;
