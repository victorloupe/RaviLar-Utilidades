-- =============================================================================
-- ATUALIZAÇÃO DE PRODUTOS: preços da Shopee + variações (cor, kit, unidades)
--
-- 1. Cria a coluna "variations" (JSONB) na tabela products.
-- 2. Atualiza os preços conforme a exportação da Shopee (14/07/2026).
-- 3. Adiciona as variações nos 8 produtos que têm mais de uma opção.
--    Estrutura: {"name": "Cor", "options": [{"label", "price", "stock", "image"}]}
--
-- COMO APLICAR: cole este arquivo inteiro no SQL Editor do Supabase e execute.
-- =============================================================================

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS variations JSONB;

-- ---------------------------------------------------------------------------
-- PRODUTOS COM VARIAÇÕES
-- ---------------------------------------------------------------------------

-- Forma Para Air Fryer (Cinza / Vermelho)
UPDATE public.products SET price = 13.99, variations = '{
  "name": "Cor",
  "options": [
    {"label": "Cinza", "price": 13.99, "stock": 5, "image": "https://cf.shopee.com.br/file/sg-11134201-8259o-mqm5cfjhze9u"},
    {"label": "Vermelho", "price": 13.99, "stock": 5, "image": "https://cf.shopee.com.br/file/sg-11134201-8257x-mqm5cfts2mtn"}
  ]
}'::jsonb
WHERE name ILIKE '%air fryer%';

-- Utensílios De Cozinha Silicone com Fue - Kit c/ 5 (Azul / Preto / Rosa)
UPDATE public.products SET price = 30.20, variations = '{
  "name": "Cor",
  "options": [
    {"label": "Azul", "price": 30.20, "stock": 1, "image": "https://cf.shopee.com.my/file/sg-11134201-8257s-mqniwlbaptkz"},
    {"label": "Preto", "price": 30.20, "stock": 3, "image": "https://cf.shopee.com.my/file/sg-11134201-82590-mqniwkqemvpn"},
    {"label": "Rosa", "price": 30.20, "stock": 1, "image": "https://cf.shopee.com.my/file/sg-11134201-825b3-mqniwkujq3nz"}
  ]
}'::jsonb
WHERE name ILIKE '%fue%';

-- Kit C/12 Utensílios Silicone Cabo Madeira (Branco / Preto)
UPDATE public.products SET price = 52.99, variations = '{
  "name": "Cor",
  "options": [
    {"label": "Branco", "price": 52.99, "stock": 1, "image": "https://cf.shopee.com.my/file/sg-11134201-825ap-mqneutdhnggd"},
    {"label": "Preto", "price": 52.99, "stock": 2, "image": "https://cf.shopee.com.my/file/sg-11134201-825af-mqneute9gxs1"}
  ]
}'::jsonb
WHERE name ILIKE '%12 utensílios%';

-- Processador Alimentos Manual 3 Lâminas (Branco / Verde)
UPDATE public.products SET price = 26.99, variations = '{
  "name": "Cor",
  "options": [
    {"label": "Branco", "price": 26.99, "stock": 3, "image": "https://cf.shopee.com.my/file/sg-11134201-82588-mqndmrmbnlkz"},
    {"label": "Verde", "price": 26.99, "stock": 2, "image": "https://cf.shopee.com.my/file/sg-11134201-8258r-mqndmqt6kg03"}
  ]
}'::jsonb
WHERE name ILIKE '%processador%';

-- Saca Rolha / Abridor 2 em 1 (1 Unidade / 2 Unidades)
UPDATE public.products SET price = 26.90, variations = '{
  "name": "Unidades por pacote",
  "options": [
    {"label": "1 Unidade", "price": 26.90, "stock": 0, "image": null},
    {"label": "2 Unidades", "price": 47.00, "stock": 0, "image": null}
  ]
}'::jsonb
WHERE name ILIKE '%saca rolha%' OR name ILIKE '%saca-rolha%';

-- Adesivo Régua de Crescimento Infantil (Elefante / Floresta)
UPDATE public.products SET price = 15.99, variations = '{
  "name": "Cor",
  "options": [
    {"label": "Elefante", "price": 15.99, "stock": 5, "image": "https://cf.shopee.com.my/file/sg-11134201-825ah-mqnjpngzmjnv"},
    {"label": "Floresta", "price": 15.99, "stock": 5, "image": "https://cf.shopee.com.my/file/sg-11134201-82584-mqnjpnj63dal"}
  ]
}'::jsonb
WHERE name ILIKE '%crescimento%';

-- Manta Cobertor Mágico Brilha no Escuro (Azul Dinossauro / Rosa Unicórnio)
UPDATE public.products SET price = 62.70, variations = '{
  "name": "Cor",
  "options": [
    {"label": "Azul Dinossauro", "price": 62.70, "stock": 1, "image": "https://cf.shopee.com.my/file/sg-11134201-825b2-mqnbe8nanw26"},
    {"label": "Rosa Unicórnio", "price": 62.70, "stock": 1, "image": "https://cf.shopee.com.my/file/sg-11134201-825a3-mqnbe8shr959"}
  ]
}'::jsonb
WHERE name ILIKE '%brilha%';

-- Pistola de Bolhas Bubble Gun (Rosa / Verde)
UPDATE public.products SET price = 36.70, variations = '{
  "name": "Cor",
  "options": [
    {"label": "Rosa", "price": 36.70, "stock": 1, "image": "https://cf.shopee.com.br/file/sg-11134201-8259q-mqm53na66jv0"},
    {"label": "Verde", "price": 36.70, "stock": 1, "image": "https://cf.shopee.com.br/file/sg-11134201-8259z-mqm53nckri17"}
  ]
}'::jsonb
WHERE name ILIKE '%bubble%';

-- ---------------------------------------------------------------------------
-- PRODUTOS SEM VARIAÇÃO (só atualização de preço, conforme Shopee)
-- ---------------------------------------------------------------------------

UPDATE public.products SET price = 25.30 WHERE name ILIKE '%moldar hamb%';
UPDATE public.products SET price = 28.60 WHERE name ILIKE '%balança%';
UPDATE public.products SET price = 22.00 WHERE name ILIKE '%pratos de sobremesa%';
UPDATE public.products SET price = 25.30 WHERE name ILIKE '%30 ovos%';
UPDATE public.products SET price = 23.70 WHERE name ILIKE '%pote%' AND name ILIKE '%150ml%';
UPDATE public.products SET price = 35.90 WHERE name ILIKE '%defletor%';
UPDATE public.products SET price = 31.80 WHERE name ILIKE '%medidor culin%';
UPDATE public.products SET price = 59.40 WHERE name ILIKE '%nicer%';
UPDATE public.products SET price = 33.40 WHERE name ILIKE '%tigelas%';
UPDATE public.products SET price = 38.30 WHERE name ILIKE '%cristal%';
UPDATE public.products SET price = 15.60 WHERE name ILIKE '%luva microfibra%';
UPDATE public.products SET price = 13.20 WHERE name ILIKE '%descascador%';
UPDATE public.products SET price = 18.80 WHERE name ILIKE '%tampas de silicone%';
UPDATE public.products SET price = 17.20 WHERE name ILIKE '%cook easy%';
UPDATE public.products SET price = 11.50 WHERE name ILIKE '%repelente%';
UPDATE public.products SET price = 30.20 WHERE name ILIKE '%mixer%';
UPDATE public.products SET price = 18.80 WHERE name ILIKE '%sabonete%';
UPDATE public.products SET price = 49.99 WHERE name ILIKE '%capivara%';
UPDATE public.products SET price = 18.80 WHERE name ILIKE '%chave de fenda%';
UPDATE public.products SET price = 23.99 WHERE name ILIKE '%galheteiro%';
UPDATE public.products SET price = 46.40 WHERE name ILIKE '%pato%';
-- Dispenser Detergente 2 em 1: não está na exportação da Shopee — preço mantido.

-- Conferência: listar produtos e variações após a atualização
SELECT id, name, price, (variations IS NOT NULL) AS tem_variacao
FROM public.products ORDER BY id;
