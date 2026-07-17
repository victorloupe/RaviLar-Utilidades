-- =============================================================================
-- ABA CLIENTES DO ADMIN: mostrar também as CONTAS DE LOGIN do site
--
-- Cria uma função segura que lista os usuários cadastrados (auth.users).
-- Só retorna dados se quem chama for o administrador — para qualquer outra
-- pessoa retorna vazio.
--
-- COMO APLICAR: cole este arquivo inteiro no SQL Editor do Supabase e execute.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.admin_list_auth_users()
RETURNS TABLE (
    id UUID,
    email TEXT,
    name TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT
        u.id,
        u.email::TEXT,
        COALESCE(u.raw_user_meta_data->>'name', '') AS name,
        COALESCE(u.raw_user_meta_data->>'phone', '') AS phone,
        u.created_at
    FROM auth.users u
    WHERE public.is_admin();
$$;

REVOKE ALL ON FUNCTION public.admin_list_auth_users() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_list_auth_users() TO authenticated;

-- =============================================================================
-- Excluir uma conta de login pelo admin (usada pelo botão de lixeira da aba
-- Clientes). Só o administrador consegue executar; apaga a conta e os dados
-- ligados a ela (favoritos e endereços caem junto; pedidos são mantidos).
-- =============================================================================

CREATE OR REPLACE FUNCTION public.admin_delete_auth_user(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Apenas o administrador pode excluir contas.';
    END IF;

    -- Proteção: não deixa excluir a própria conta do admin
    IF user_uuid = auth.uid() THEN
        RAISE EXCEPTION 'Você não pode excluir sua própria conta de administrador.';
    END IF;

    DELETE FROM auth.users WHERE id = user_uuid;
    RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_delete_auth_user(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_delete_auth_user(UUID) TO authenticated;
