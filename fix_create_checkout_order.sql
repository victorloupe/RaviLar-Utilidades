-- =============================================================================
-- FIX: create_checkout_order — corrige "there is no unique or exclusion
-- constraint matching the ON CONFLICT specification"
--
-- Causa: a função fazia ON CONFLICT (email), mas a tabela customers só tem
-- UNIQUE em phone. Todo pedido de usuário logado falhava.
--
-- COMO APLICAR: cole este arquivo inteiro no SQL Editor do Supabase e execute.
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
    existing_cust_id BIGINT;
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
        complement
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
        NULLIF(order_data->>'complement', '')
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
    -- Envolvido em bloco de exceção para que uma falha no sync do cliente
    -- nunca cancele a criação do pedido.
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
