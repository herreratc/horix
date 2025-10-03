import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    if (!accessToken) {
      console.error('Missing MERCADO_PAGO_ACCESS_TOKEN');
      throw new Error('Configuration error');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    
    // Validate webhook payload structure
    if (!body || typeof body !== 'object') {
      console.error('Invalid webhook payload structure');
      throw new Error('Invalid payload');
    }
    
    console.log('Webhook received:', {
      type: body.type,
      id: body.data?.id,
      timestamp: new Date().toISOString()
    });

    // Mercado Pago envia notificações de pagamento
    if (body.type === 'payment') {
      const paymentId = body.data?.id;
      
      if (!paymentId) {
        console.error('Missing payment ID in webhook');
        throw new Error('Invalid payment notification');
      }
      
      console.log('Processing payment:', paymentId);

      // Buscar detalhes do pagamento
      const paymentResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!paymentResponse.ok) {
        console.error('Failed to fetch payment details:', paymentResponse.status);
        throw new Error('Payment verification failed');
      }

      const payment = await paymentResponse.json();
      
      // Validate payment response
      if (!payment || typeof payment !== 'object') {
        console.error('Invalid payment response structure');
        throw new Error('Invalid payment data');
      }
      
      console.log('Payment details:', {
        id: payment.id,
        status: payment.status,
        external_reference: payment.external_reference,
        amount: payment.transaction_amount
      });

      // Se pagamento aprovado, atualizar plano do usuário
      if (payment.status === 'approved') {
        const userId = payment.external_reference;
        
        if (!userId || typeof userId !== 'string') {
          console.error('Invalid or missing external_reference:', userId);
          throw new Error('Invalid user reference');
        }
        
        console.log('Upgrading user to premium:', userId);
          
          const { error } = await supabase
            .from('profiles')
            .update({ plano: 'premium' })
            .eq('id', userId);

        if (error) {
          console.error('Error updating user plan:', error);
          throw error;
        }

        console.log('User upgraded successfully');
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in mercadopago-webhook:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
    
    // Don't expose internal error details to external callers
    const errorMessage = error instanceof Error && error.message.includes('Configuration')
      ? 'Service temporarily unavailable'
      : 'Processing error';
      
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
