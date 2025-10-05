import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Invalid token');
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('plano, trial_ends_at, subscription_status, agendamentos_mes')
      .eq('id', user.id)
      .maybeSingle();

    // If profile doesn't exist, create it
    if (!profile) {
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          plano: 'trial',
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          subscription_status: 'none',
          agendamentos_mes: 0,
          profissao: 'pending'
        })
        .select('plano, trial_ends_at, subscription_status, agendamentos_mes')
        .single();

      if (createError || !newProfile) {
        throw new Error('Failed to create profile');
      }

      const now = new Date();
      const trialEndsAt = new Date(newProfile.trial_ends_at);

      return new Response(
        JSON.stringify({
          hasPremiumAccess: true,
          canCreate: true,
          plano: 'trial',
          subscriptionStatus: 'none',
          agendamentosUsados: 0,
          limite: 999999,
          isInTrial: true,
          trialDaysLeft: 14,
          trialEndsAt: trialEndsAt.toISOString(),
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (profileError) {
      throw profileError;
    }

    const now = new Date();
    const trialEndsAt = profile.trial_ends_at ? new Date(profile.trial_ends_at) : null;

    // Check if user has premium access
    const hasPremiumAccess = 
      (profile.plano === 'premium' && profile.subscription_status === 'active') ||
      (profile.plano === 'trial' && trialEndsAt && trialEndsAt > now);

    // Calculate limits
    const limite = hasPremiumAccess ? 999999 : 30;
    const canCreate = profile.agendamentos_mes < limite;
    const isInTrial = profile.plano === 'trial' && trialEndsAt && trialEndsAt > now;
    const trialDaysLeft = isInTrial && trialEndsAt 
      ? Math.ceil((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    return new Response(
      JSON.stringify({
        hasPremiumAccess,
        canCreate,
        plano: profile.plano,
        subscriptionStatus: profile.subscription_status,
        agendamentosUsados: profile.agendamentos_mes,
        limite,
        isInTrial,
        trialDaysLeft,
        trialEndsAt: trialEndsAt?.toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in check-premium-access:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
