-- =============================================================================
-- VERSÃO DEFINITIVA da função create_checkout_order (rode esta, é a mais nova)
--
-- Mescla as duas versões que existiam:
--  • Validação de cupom no servidor (compra mínima + limite de uso por cliente)
--    e gravação de coupon_code / discount_amount / subtotal no pedido
--    (do setup_coupons.sql — tinha se perdido no fix anterior)
--  • Sync de cliente por TELEFONE com bloco de exceção
--    (do fix_create_checkout_order.sql — corrige o erro de ON CONFLICT)
--
-- COMO APLICAR: cole este arquivo inteiro no SQL Editor do Supabase e execute.
-- Este arquivo substitui o fix_create_checkout_order.sql anterior.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.create_checkout_order(order_data JSONB, items_data JSONB)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_order_id BIGINT;
    item JSONB;
    requested_user_id UUID;
    clean_phone TEXT;
    cust_email TEXT;
BEGIN
    IF jsonb_typeof(items_data) != 'array' OR jsonb_array_length(items_data) = 0 THEN
        RAISE EXCEPTION 'O pedido precisa ter pelo menos um item.';
    END IF;

    requested_user_id := NULLIF(order_data->>'user_id', '')::UUID;

    IF auth.uid() IS NULL THEN
        requested_user_id := NULL;
    ELSIF requested_user_id IS DISTINCT FROM auth.uid() THEN
        requested_user_id := auth.uid();
    END IF;

    -- Validar cupom no servidor (se aplicável)
    IF order_data->>'coupon_code' IS NOT NULL AND (order_data->>'coupon_code') != '' THEN
        DECLARE
            coupon_rec RECORD;
            existing_uses INT;
            coupon_phone TEXT;
        BEGIN
            SELECT * INTO coupon_rec FROM public.coupons
            WHERE code = order_data->>'coupon_code' AND is_active = true;

            IF NOT FOUND THEN
                RAISE EXCEPTION 'Cupom inválido ou inativo.';
            END IF;

            IF (order_data->>'subtotal')::NUMERIC < coupon_rec.min_purchase THEN
                RAISE EXCEPTION 'O valor mínimo de produtos para este cupom não foi atingido.';
            END IF;

            IF coupon_rec.max_uses_per_client IS NOT NULL AND coupon_rec.max_uses_per_client > 0 THEN
                coupon_phone := regexp_replace(order_data->>'client_phone', '\D', '', 'g');

                SELECT COUNT(*) INTO existing_uses FROM public.orders
                WHERE coupon_code = coupon_rec.code
                  AND (
                      regexp_replace(client_phone, '\D', '', 'g') = coupon_phone
                      OR (requested_user_id IS NOT NULL AND user_id = requested_user_id)
                  );

                IF existing_uses >= coupon_rec.max_uses_per_client THEN
                    RAISE EXCEPTION 'Este cupom já atingiu o limite de uso permitido para seu cadastro (% vez/vezes).', coupon_rec.max_uses_per_client;
                END IF;
            END IF;
        END;
    END IF;

    INSERT INTO public.orders (
        user_id,
        status,
        payment_method,
        payment_status,
        total_amount,
        shipping_fee,
        shipping_method,
        client_name,
        client_phone,
        client_email,
        cep,
        street,
        number,
        neighborhood,
        city,
        uf,
        complement,
        coupon_code,
        discount_amount,
        subtotal
    ) VALUES (
        requested_user_id,
        'Pendente',
        order_data->>'payment_method',
        'Pendente',
        (order_data->>'total_amount')::NUMERIC,
        COALESCE((order_data->>'shipping_fee')::NUMERIC, 0),
        COALESCE(order_data->>'shipping_method', 'Envio'),
        order_data->>'client_name',
        order_data->>'client_phone',
        NULLIF(order_data->>'client_email', ''),
        order_data->>'cep',
        order_data->>'street',
        order_data->>'number',
        order_data->>'neighborhood',
        order_data->>'city',
        order_data->>'uf',
        NULLIF(order_data->>'complement', ''),
        NULLIF(order_data->>'coupon_code', ''),
        COALESCE((order_data->>'discount_amount')::NUMERIC, 0.00),
        COALESCE((order_data->>'subtotal')::NUMERIC, 0.00)
    )
    RETURNING id INTO new_order_id;

    FOR item IN SELECT * FROM jsonb_array_elements(items_data)
    LOOP
        INSERT INTO public.order_items (
            order_id,
            product_id,
            product_name,
            quantity,
            price
        ) VALUES (
            new_order_id,
            NULLIF(item->>'product_id', '')::BIGINT,
            item->>'product_name',
            (item->>'quantity')::INT,
            (item->>'price')::NUMERIC
        );
    END LOOP;

    -- Sincronizar/Upsert na tabela de clientes.
    -- A chave única da tabela customers é o TELEFONE (phone), não o e-mail.
    -- Bloco de exceção: falha no sync do cliente nunca cancela o pedido.
    BEGIN
        clean_phone := regexp_replace(order_data->>'client_phone', '\D', '', 'g');
        cust_email := NULLIF(order_data->>'client_email', '');

        IF clean_phone IS NOT NULL AND clean_phone != '' THEN
            INSERT INTO public.customers (
                phone,
                email,
                name,
                street,
                number,
                neighborhood,
                city
            ) VALUES (
                clean_phone,
                cust_email,
                order_data->>'client_name',
                order_data->>'street',
                order_data->>'number',
                order_data->>'neighborhood',
                (order_data->>'city') || ' - ' || (order_data->>'uf')
            )
            ON CONFLICT (phone) DO UPDATE SET
                email = COALESCE(EXCLUDED.email, public.customers.email),
                name = EXCLUDED.name,
                street = EXCLUDED.street,
                number = EXCLUDED.number,
                neighborhood = EXCLUDED.neighborhood,
                city = EXCLUDED.city;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Falha ao sincronizar cliente no checkout: %', SQLERRM;
    END;

    RETURN new_order_id;
END;
$$;

-- Backfill: pedidos criados enquanto a versão anterior estava ativa
-- ficaram com subtotal = 0; recalcular a partir do total - frete.
UPDATE public.orders
SET subtotal = total_amount - shipping_fee
WHERE subtotal = 0.00 AND total_amount > 0;
