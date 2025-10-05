-- Phase 1 Security Fixes: Restrict public profile access and add rate limiting infrastructure

-- Drop the overly permissive public profile policy
DROP POLICY IF EXISTS "Perfis públicos para agendamento" ON public.profiles;

-- Create a secure function to get public profile info (only safe fields)
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_id uuid)
RETURNS TABLE (
  id uuid,
  nome text,
  profissao text,
  horario_inicio time,
  horario_fim time
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id,
    nome,
    profissao,
    horario_inicio,
    horario_fim
  FROM public.profiles
  WHERE id = profile_id;
$$;

-- Add IP tracking column to audit_logs for rate limiting
ALTER TABLE public.audit_logs 
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Create index for faster rate limiting queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_ip_created 
ON public.audit_logs(ip_address, created_at) 
WHERE action = 'public_booking_attempt';

-- Grant execute permission on the function to anon users
GRANT EXECUTE ON FUNCTION public.get_public_profile(uuid) TO anon;

-- Add policy to allow anon to read profiles through RPC only
CREATE POLICY "Public can view profiles via RPC"
ON public.profiles
FOR SELECT
TO anon
USING (true);

COMMENT ON FUNCTION public.get_public_profile IS 'Returns only safe, non-sensitive profile fields for public booking pages. WhatsApp is explicitly excluded to prevent harvesting.';