-- ====================================================
-- CORREÇÃO DE SEGURANÇA: Proteção de Dados Sensíveis
-- ====================================================
-- Remove política redundante e adiciona proteções extras

-- 1. Remover a política redundante "Deny anonymous access"
-- Esta política é desnecessária pois as outras já garantem acesso apenas a usuários autenticados
DROP POLICY IF EXISTS "Deny anonymous access to clientes" ON public.clientes;

-- 2. Adicionar comentários de segurança na tabela e colunas sensíveis
COMMENT ON TABLE public.clientes IS 'SENSITIVE DATA: Contains PII including CPF, addresses, and contact information. Access strictly controlled by RLS.';
COMMENT ON COLUMN public.clientes.cpf IS 'SENSITIVE: Brazilian tax ID - handle with extreme care';
COMMENT ON COLUMN public.clientes.endereco IS 'SENSITIVE: Home address - PII protected';
COMMENT ON COLUMN public.clientes.email IS 'SENSITIVE: Email address - PII protected';
COMMENT ON COLUMN public.clientes.telefone IS 'SENSITIVE: Phone number - PII protected';
COMMENT ON COLUMN public.clientes.whatsapp IS 'SENSITIVE: WhatsApp number - PII protected';

-- 3. Verificar e reforçar as políticas RLS existentes
-- Garantir que APENAS usuários autenticados podem acessar APENAS seus próprios dados

-- Política de SELECT (já existe, mas vamos garantir que está correta)
DROP POLICY IF EXISTS "Authenticated users can view their own clients" ON public.clientes;
CREATE POLICY "Authenticated users can view their own clients"
ON public.clientes
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Política de INSERT (reforçar)
DROP POLICY IF EXISTS "Authenticated users can create their own clients" ON public.clientes;
CREATE POLICY "Authenticated users can create their own clients"
ON public.clientes
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Política de UPDATE (reforçar)
DROP POLICY IF EXISTS "Authenticated users can update their own clients" ON public.clientes;
CREATE POLICY "Authenticated users can update their own clients"
ON public.clientes
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política de DELETE (reforçar)
DROP POLICY IF EXISTS "Authenticated users can delete their own clients" ON public.clientes;
CREATE POLICY "Authenticated users can delete their own clients"
ON public.clientes
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 4. Garantir que o trigger de auditoria está ativo para monitorar acessos suspeitos
-- (O trigger audit_cliente_changes já existe e monitora mudanças sensíveis)

-- 5. Adicionar função de segurança para validar que user_id nunca é null
CREATE OR REPLACE FUNCTION public.validate_cliente_user_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Garantir que user_id sempre está presente
  IF NEW.user_id IS NULL THEN
    RAISE EXCEPTION 'Security violation: user_id cannot be null in clientes table';
  END IF;
  
  -- Garantir que user_id corresponde ao usuário autenticado
  IF NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Security violation: user_id must match authenticated user';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger para validação
DROP TRIGGER IF EXISTS validate_cliente_user_id_trigger ON public.clientes;
CREATE TRIGGER validate_cliente_user_id_trigger
  BEFORE INSERT OR UPDATE ON public.clientes
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_cliente_user_id();

-- Log de segurança
DO $$
BEGIN
  RAISE NOTICE 'Security hardening complete for clientes table';
  RAISE NOTICE '✓ Removed redundant deny policy';
  RAISE NOTICE '✓ Added security documentation';
  RAISE NOTICE '✓ Reinforced RLS policies to authenticated users only';
  RAISE NOTICE '✓ Added user_id validation trigger';
  RAISE NOTICE '✓ Existing audit logging remains active';
END $$;