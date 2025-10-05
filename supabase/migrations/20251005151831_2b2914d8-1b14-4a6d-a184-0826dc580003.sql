-- Add subscription management fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS trial_ends_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS subscription_id text,
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'none',
ADD COLUMN IF NOT EXISTS subscription_current_period_end timestamp with time zone;

-- Create index for faster subscription lookups
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_id ON public.profiles(subscription_id);

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.trial_ends_at IS 'End date of the 14-day trial period';
COMMENT ON COLUMN public.profiles.subscription_id IS 'Mercado Pago subscription ID';
COMMENT ON COLUMN public.profiles.subscription_status IS 'Subscription status: none, active, cancelled, paused';
COMMENT ON COLUMN public.profiles.subscription_current_period_end IS 'End date of current billing period';

-- Function to initialize trial for new users
CREATE OR REPLACE FUNCTION public.initialize_user_trial()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Set trial end date to 14 days from now
  NEW.trial_ends_at = now() + interval '14 days';
  NEW.plano = 'trial';
  NEW.subscription_status = 'none';
  RETURN NEW;
END;
$$;

-- Create trigger to initialize trial on profile creation
DROP TRIGGER IF EXISTS initialize_trial_trigger ON public.profiles;
CREATE TRIGGER initialize_trial_trigger
BEFORE INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.initialize_user_trial();

-- Function to check if user has premium access (trial or paid)
CREATE OR REPLACE FUNCTION public.has_premium_access(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profile RECORD;
BEGIN
  SELECT plano, trial_ends_at, subscription_status
  INTO v_profile
  FROM public.profiles
  WHERE id = p_user_id;
  
  -- Check if user has active paid subscription
  IF v_profile.plano = 'premium' AND v_profile.subscription_status = 'active' THEN
    RETURN true;
  END IF;
  
  -- Check if user is still in trial period
  IF v_profile.plano = 'trial' AND v_profile.trial_ends_at > now() THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;