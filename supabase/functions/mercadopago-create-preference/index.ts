import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, price, userId } = await req.json();
    
    // Log request (without sensitive data)
    console.log('Creating Mercado Pago preference:', { hasTitle: !!title, hasPrice: !!price, hasUserId: !!userId });

    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
    if (!accessToken) {
      throw new Error('Mercado Pago access token not configured');
    }

    const preference = {
      items: [
        {
          title: title || 'Plano Premium - Horix',
          quantity: 1,
          unit_price: parseFloat(price) || 29.90,
          currency_id: 'BRL',
        }
      ],
      back_urls: {
        success: `${req.headers.get('origin')}/pagamento-sucesso?status=approved&preference_id={{preference_id}}`,
        failure: `${req.headers.get('origin')}/assinatura?payment=failure`,
        pending: `${req.headers.get('origin')}/dashboard?payment=pending`,
      },
      auto_return: 'approved',
      external_reference: userId,
      notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mercadopago-webhook`,
      payment_methods: {
        excluded_payment_types: [],
        installments: 12,
      }
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Mercado Pago API error - status:', response.status);
      throw new Error(data.message || 'Failed to create preference');
    }

    console.log('Preference created successfully');

    return new Response(
      JSON.stringify({ 
        preferenceId: data.id,
        init_point: data.init_point,
        sandbox_init_point: data.sandbox_init_point 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in mercadopago-create-preference:', error);
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
