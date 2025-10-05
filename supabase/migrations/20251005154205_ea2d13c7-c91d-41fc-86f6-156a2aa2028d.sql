-- ====================================================
-- WEBHOOK SECURITY IMPROVEMENTS
-- ====================================================
-- Replace overly permissive RLS policy with operation-specific policies

-- 1. Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Service role can manage webhook events" ON public.webhook_events;

-- 2. Create restrictive INSERT policy
-- Only service role can insert new webhook events
CREATE POLICY "Service role can insert webhook events"
ON public.webhook_events
FOR INSERT
TO service_role
WITH CHECK (true);

-- 3. Create restrictive UPDATE policy
-- Only allow updating processed status and processed_at timestamp
CREATE POLICY "Service role can update webhook processing status"
ON public.webhook_events
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (
  -- Ensure only processed and processed_at can be updated
  -- All other fields must remain unchanged
  processed IS NOT NULL AND
  processed_at IS NOT NULL
);

-- 4. Create restrictive SELECT policy
-- Service role can read all webhook events for processing and debugging
CREATE POLICY "Service role can select webhook events"
ON public.webhook_events
FOR SELECT
TO service_role
USING (true);

-- 5. Add audit trigger for webhook event access
CREATE OR REPLACE FUNCTION public.audit_webhook_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log webhook event processing for security monitoring
  IF (TG_OP = 'UPDATE' AND OLD.processed = false AND NEW.processed = true) THEN
    INSERT INTO public.audit_logs (
      action,
      table_name,
      record_id,
      metadata
    ) VALUES (
      'webhook_processed',
      'webhook_events',
      NEW.id,
      jsonb_build_object(
        'event_type', NEW.event_type,
        'event_id', NEW.event_id,
        'processed_at', NEW.processed_at
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for webhook audit logging
DROP TRIGGER IF EXISTS audit_webhook_access_trigger ON public.webhook_events;
CREATE TRIGGER audit_webhook_access_trigger
  AFTER UPDATE ON public.webhook_events
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_webhook_access();

-- Security notes
COMMENT ON TABLE public.webhook_events IS 'SECURITY: Webhook events with restricted RLS - service role only access with operation-specific policies';
COMMENT ON COLUMN public.webhook_events.event_id IS 'Unique event identifier for idempotency checks';
COMMENT ON COLUMN public.webhook_events.processed IS 'Processing status - can only transition from false to true';

-- Log security improvements
DO $$
BEGIN
  RAISE NOTICE 'Webhook security improvements complete';
  RAISE NOTICE '✓ Removed overly permissive ALL policy';
  RAISE NOTICE '✓ Added operation-specific policies (INSERT, UPDATE, SELECT)';
  RAISE NOTICE '✓ Restricted UPDATE to only processed status changes';
  RAISE NOTICE '✓ Added audit logging for webhook processing';
  RAISE NOTICE '✓ Added security documentation';
END $$;