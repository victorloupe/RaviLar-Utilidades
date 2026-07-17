-- =============================================================================
-- ENTREGA GRÁTIS PARA SÃO JOSÉ DO RIO PRETO
--
-- Cria as regras de frete por CEP com preço 0 cobrindo toda a cidade:
--   150  -> CEPs 15000-000 a 15099-999
--   1510 -> CEPs 15100-000 a 15109-999
--
-- No checkout, CEPs que casarem com essas regras veem uma única opção
-- "Entrega Grátis - Rio Preto" (Grátis) no lugar das transportadoras.
--
-- COMO APLICAR: cole este arquivo inteiro no SQL Editor do Supabase e execute.
-- Para desfazer no futuro: exclua as regras na aba Configurações do admin.
-- =============================================================================

INSERT INTO public.shipping_rules (name, cep_prefix, price)
VALUES
    ('Entrega Grátis - Rio Preto', '150', 0),
    ('Entrega Grátis - Rio Preto', '1510', 0)
ON CONFLICT (cep_prefix) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price;

-- Conferência
SELECT * FROM public.shipping_rules ORDER BY cep_prefix;
