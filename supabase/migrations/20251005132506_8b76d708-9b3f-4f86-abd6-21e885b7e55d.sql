-- 1. Create webhook_events table for idempotency
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text UNIQUE NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  processed boolean DEFAULT false,
  processed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on webhook_events
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Only service role can manage webhook events (this is for system use)
CREATE POLICY "Service role can manage webhook events"
ON public.webhook_events
FOR ALL
TO service_role
USING (true);

-- 2. Add INSERT, UPDATE, DELETE policies to log_notificacoes
-- Create security definer function for inserting notification logs
CREATE OR REPLACE FUNCTION public.insert_notification_log(
  p_agendamento_id uuid,
  p_tipo text,
  p_canal text,
  p_status text,
  p_erro_mensagem text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_log_id uuid;
BEGIN
  INSERT INTO public.log_notificacoes (
    agendamento_id,
    tipo,
    canal,
    status,
    erro_mensagem,
    enviado_em
  ) VALUES (
    p_agendamento_id,
    p_tipo,
    p_canal,
    p_status,
    p_erro_mensagem,
    CASE WHEN p_status = 'sucesso' THEN now() ELSE NULL END
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- 3. Create audit log table for sensitive data access
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  changed_data jsonb,
  ip_address inet,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can only view their own audit logs
CREATE POLICY "Users can view their own audit logs"
ON public.audit_logs
FOR SELECT
USING (auth.uid() = user_id);

-- Only system can insert audit logs
CREATE POLICY "Service role can insert audit logs"
ON public.audit_logs
FOR INSERT
TO service_role
WITH CHECK (true);

-- 4. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON public.webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created_at ON public.webhook_events(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);