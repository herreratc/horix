-- ====================================================
-- FIX: Allow 'trial' plan type in profiles check constraint
-- ====================================================
-- The initialize_user_trial trigger sets plano to 'trial' but the check constraint doesn't allow it

-- Drop the existing check constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_plano_check;

-- Recreate the check constraint to include 'trial', 'free', and 'premium'
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_plano_check 
CHECK (plano IN ('free', 'trial', 'premium'));

-- Log fix
DO $$
BEGIN
  RAISE NOTICE 'Fixed profiles_plano_check constraint';
  RAISE NOTICE '✓ Now allows: free, trial, premium';
  RAISE NOTICE '✓ User signups will now work correctly with trial period';
END $$;