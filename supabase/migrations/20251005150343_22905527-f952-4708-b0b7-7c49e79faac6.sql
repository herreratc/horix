-- Phase 1 Critical Security Fixes

-- 1.1 Fix Public Profile Exposure - Remove overly permissive policy
DROP POLICY IF EXISTS "Public can view profiles via RPC" ON public.profiles;

-- Note: The get_public_profile() RPC function is already secure and only exposes safe fields
-- Anon users can ONLY access profiles through the RPC function, not direct table queries

-- 1.2 Clean Up Duplicate Client Records
-- First, update agendamentos to point to the oldest client record for each duplicate set
WITH duplicates AS (
  SELECT 
    user_id,
    REGEXP_REPLACE(LOWER(TRIM(whatsapp)), '[^0-9]', '', 'g') as normalized_phone,
    (ARRAY_AGG(id ORDER BY created_at))[1] as keep_id,
    ARRAY_AGG(id ORDER BY created_at) as all_ids
  FROM clientes
  WHERE whatsapp IS NOT NULL AND whatsapp != ''
  GROUP BY user_id, REGEXP_REPLACE(LOWER(TRIM(whatsapp)), '[^0-9]', '', 'g')
  HAVING COUNT(*) > 1
)
UPDATE agendamentos a
SET cliente_id = d.keep_id
FROM duplicates d
WHERE a.cliente_id = ANY(d.all_ids) 
  AND a.cliente_id != d.keep_id
  AND a.user_id = d.user_id;

-- Now delete the duplicate client records
WITH duplicates AS (
  SELECT 
    user_id,
    REGEXP_REPLACE(LOWER(TRIM(whatsapp)), '[^0-9]', '', 'g') as normalized_phone,
    (ARRAY_AGG(id ORDER BY created_at))[1] as keep_id,
    ARRAY_AGG(id ORDER BY created_at) as all_ids
  FROM clientes
  WHERE whatsapp IS NOT NULL AND whatsapp != ''
  GROUP BY user_id, REGEXP_REPLACE(LOWER(TRIM(whatsapp)), '[^0-9]', '', 'g')
  HAVING COUNT(*) > 1
)
DELETE FROM clientes
WHERE id IN (
  SELECT UNNEST(all_ids[2:]) FROM duplicates
);

-- Also handle email-based duplicates
WITH email_duplicates AS (
  SELECT 
    user_id,
    LOWER(TRIM(email)) as normalized_email,
    (ARRAY_AGG(id ORDER BY created_at))[1] as keep_id,
    ARRAY_AGG(id ORDER BY created_at) as all_ids
  FROM clientes
  WHERE email IS NOT NULL AND email != ''
  GROUP BY user_id, LOWER(TRIM(email))
  HAVING COUNT(*) > 1
)
UPDATE agendamentos a
SET cliente_id = d.keep_id
FROM email_duplicates d
WHERE a.cliente_id = ANY(d.all_ids)
  AND a.cliente_id != d.keep_id
  AND a.user_id = d.user_id;

WITH email_duplicates AS (
  SELECT 
    user_id,
    LOWER(TRIM(email)) as normalized_email,
    (ARRAY_AGG(id ORDER BY created_at))[1] as keep_id,
    ARRAY_AGG(id ORDER BY created_at) as all_ids
  FROM clientes
  WHERE email IS NOT NULL AND email != ''
  GROUP BY user_id, LOWER(TRIM(email))
  HAVING COUNT(*) > 1
)
DELETE FROM clientes
WHERE id IN (
  SELECT UNNEST(all_ids[2:]) FROM email_duplicates
);

COMMENT ON FUNCTION public.get_public_profile IS 'SECURITY: This is the ONLY way anonymous users can access profile data. Returns only safe fields (nome, profissao, horario_inicio, horario_fim). WhatsApp is explicitly excluded.';