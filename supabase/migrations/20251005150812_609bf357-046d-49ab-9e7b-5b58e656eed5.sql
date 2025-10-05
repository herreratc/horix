-- Enhanced Security for clientes table - Defense in Depth

-- First, verify RLS is enabled (it already is, but being explicit)
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate with better security
DROP POLICY IF EXISTS "Usuários podem ver seus próprios clientes" ON public.clientes;
DROP POLICY IF EXISTS "Usuários podem criar seus próprios clientes" ON public.clientes;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios clientes" ON public.clientes;
DROP POLICY IF EXISTS "Usuários podem deletar seus próprios clientes" ON public.clientes;

-- SECURITY: Explicitly deny all access to anonymous users
CREATE POLICY "Deny anonymous access to clientes"
ON public.clientes
FOR ALL
TO anon
USING (false);

-- SECURITY: Authenticated users can only SELECT their own clients
CREATE POLICY "Authenticated users can view their own clients"
ON public.clientes
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- SECURITY: Authenticated users can only INSERT clients with their own user_id
CREATE POLICY "Authenticated users can create their own clients"
ON public.clientes
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- SECURITY: Authenticated users can only UPDATE their own clients
CREATE POLICY "Authenticated users can update their own clients"
ON public.clientes
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- SECURITY: Authenticated users can only DELETE their own clients
CREATE POLICY "Authenticated users can delete their own clients"
ON public.clientes
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Add trigger to audit sensitive client data deletions and updates
CREATE OR REPLACE FUNCTION public.audit_cliente_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    -- Log all deletions of client records with sensitive data presence flags
    INSERT INTO public.audit_logs (
      action,
      table_name,
      user_id,
      record_id,
      changed_data,
      metadata
    ) VALUES (
      'cliente_deleted',
      'clientes',
      auth.uid(),
      OLD.id,
      jsonb_build_object(
        'nome', OLD.nome,
        'deleted_at', now()
      ),
      jsonb_build_object(
        'had_cpf', (OLD.cpf IS NOT NULL),
        'had_address', (OLD.endereco IS NOT NULL),
        'had_birth_date', (OLD.data_nascimento IS NOT NULL)
      )
    );
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
    -- Log updates to highly sensitive fields only (CPF, address, birth date)
    IF (OLD.cpf IS DISTINCT FROM NEW.cpf OR 
        OLD.endereco IS DISTINCT FROM NEW.endereco OR
        OLD.data_nascimento IS DISTINCT FROM NEW.data_nascimento) THEN
      INSERT INTO public.audit_logs (
        action,
        table_name,
        user_id,
        record_id,
        metadata
      ) VALUES (
        'cliente_sensitive_update',
        'clientes',
        auth.uid(),
        NEW.id,
        jsonb_build_object(
          'cpf_changed', (OLD.cpf IS DISTINCT FROM NEW.cpf),
          'address_changed', (OLD.endereco IS DISTINCT FROM NEW.endereco),
          'birth_date_changed', (OLD.data_nascimento IS DISTINCT FROM NEW.data_nascimento),
          'timestamp', now()
        )
      );
    END IF;
    RETURN NEW;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for audit logging
DROP TRIGGER IF EXISTS audit_cliente_changes_trigger ON public.clientes;
CREATE TRIGGER audit_cliente_changes_trigger
AFTER UPDATE OR DELETE ON public.clientes
FOR EACH ROW
EXECUTE FUNCTION public.audit_cliente_changes();

-- Add security comments to document the protection
COMMENT ON TABLE public.clientes IS 'SECURITY: Contains highly sensitive PII (CPF, addresses, birth dates, contact info). Access strictly limited to authenticated users for their own data only. Anonymous access explicitly denied. All sensitive modifications are audited.';
COMMENT ON COLUMN public.clientes.cpf IS 'SECURITY: Brazilian tax ID - highly sensitive, modifications logged';
COMMENT ON COLUMN public.clientes.endereco IS 'SECURITY: Physical address - sensitive PII, modifications logged';
COMMENT ON COLUMN public.clientes.data_nascimento IS 'SECURITY: Birth date - sensitive PII, modifications logged';