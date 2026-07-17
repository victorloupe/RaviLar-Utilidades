-- =============================================================================
-- AJUSTES CONFORME EXPORTAÇÃO SHOPEE DE 16/07/2026
--
-- 1. Dispenser Sabão 2x1: preço R$ 8,99 -> R$ 20,50 (estava desatualizado).
-- 2. Saca-Rolhas/Abridor: estoque voltou (1 Un: 5, 2 Un: 2).
-- 3. Kit Fue: estoque do Preto 3 -> 2.
--
-- COMO APLICAR: cole este arquivo inteiro no SQL Editor do Supabase e execute.
-- =============================================================================

-- 1. Dispenser Sabão 2x1 Detergente (preço Shopee: R$ 20,50)
UPDATE public.products SET price = 20.50 WHERE name ILIKE '%dispenser%';

-- 2. Saca-Rolhas: estoques atualizados
UPDATE public.products SET variations = '{
  "name": "Unidades por pacote",
  "options": [
    {"label": "1 Unidade", "price": 26.90, "stock": 5, "image": null},
    {"label": "2 Unidades", "price": 47.00, "stock": 2, "image": null}
  ]
}'::jsonb
WHERE name ILIKE '%saca rolha%' OR name ILIKE '%saca-rolha%';

-- 3. Kit Utensílios Fue c/5: estoque do Preto 3 -> 2
UPDATE public.products SET variations = '{
  "name": "Cor",
  "options": [
    {"label": "Azul", "price": 30.20, "stock": 1, "image": "https://cf.shopee.com.my/file/sg-11134201-8257s-mqniwlbaptkz"},
    {"label": "Preto", "price": 30.20, "stock": 2, "image": "https://cf.shopee.com.my/file/sg-11134201-82590-mqniwkqemvpn"},
    {"label": "Rosa", "price": 30.20, "stock": 1, "image": "https://cf.shopee.com.my/file/sg-11134201-825b3-mqniwkujq3nz"}
  ]
}'::jsonb
WHERE name ILIKE '%fue%';

-- Conferência
SELECT id, name, price, variations->'options' AS opcoes
FROM public.products
WHERE name ILIKE '%dispenser%' OR name ILIKE '%saca%rolha%' OR name ILIKE '%fue%';
