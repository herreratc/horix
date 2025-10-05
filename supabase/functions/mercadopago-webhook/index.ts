import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Verify Mercado Pago webhook signature
async function verifySignature(req: Request, body: any): Promise<boolean> {
  const xSignature = req.headers.get('x-signature');
  const xRequestId = req.headers.get('x-request-id');
  
  if (!xSignature || !xRequestId) {
    console.error('Missing signature headers');
    return false;
  }
  
  // Extract ts and hash from x-signature header (format: "ts=123456,v1=hash")
  const parts = xSignature.split(',');
  const ts = parts.find(p => p.startsWith('ts='))?.split('=')[1];
  const hash = parts.find(p => p.startsWith('v1='))?.split('=')[1];
  
  if (!ts || !hash) {
    console.error('Invalid signature format');
    return false;
  }
  
  // Get webhook secret from environment
  const webhookSecret = Deno.env.get('MERCADO_PAGO_WEBHOOK_SECRET');
  if (!webhookSecret) {
    console.error('Missing MERCADO_PAGO_WEBHOOK_SECRET');
    return false;
  }
  
  // Construct manifest (template): id;request-id;ts
  const dataId = body?.data?.id || '';
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  
  // Generate HMAC-SHA256
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(webhookSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(manifest)
  );
  
  const computedHash = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return computedHash === hash;
}

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
    
    // Log webhook received (without sensitive data)
    console.log('Webhook received:', {
      type: body.type,
      hasDataId: !!body.data?.id,
      timestamp: new Date().toISOString()
    });

    // CRITICAL SECURITY: Verify webhook signature
    const isValid = await verifySignature(req, body);
    if (!isValid) {
      console.error('Invalid webhook signature');
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check for idempotency - prevent duplicate processing
    const eventId = `${body.type}_${body.data?.id}_${body.action || 'default'}`;
    const { data: existingEvent } = await supabase
      .from('webhook_events')
      .select('id, processed')
      .eq('event_id', eventId)
      .single();
    
    if (existingEvent?.processed) {
      console.log('Event already processed:', eventId);
      return new Response(
        JSON.stringify({ received: true, message: 'Already processed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Store webhook event
    await supabase
      .from('webhook_events')
      .upsert({
        event_id: eventId,
        event_type: body.type,
        payload: body,
        processed: false
      });

    // Mercado Pago envia notificações de pagamento
    if (body.type === 'payment') {
      const paymentId = body.data?.id;
      
      if (!paymentId) {
        console.error('Missing payment ID in webhook');
        throw new Error('Invalid payment notification');
      }
      
      console.log('Processing payment ID (length):', String(paymentId).length);

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
      
      // Log payment status (without sensitive data)
      console.log('Payment verified:', {
        status: payment.status,
        hasReference: !!payment.external_reference
      });

      // Se pagamento aprovado, atualizar plano do usuário
      if (payment.status === 'approved') {
        const userId = payment.external_reference;
        
        if (!userId || typeof userId !== 'string') {
          console.error('Invalid external_reference type');
          throw new Error('Invalid user reference');
        }

        // CRITICAL SECURITY: Verify user exists before upgrading
        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('id, plano')
          .eq('id', userId)
          .single();
        
        if (profileError || !userProfile) {
          console.error('User profile not found for payment');
          throw new Error('Invalid user reference');
        }
        
        // CRITICAL SECURITY: Verify payment amount matches expected price
        const expectedAmount = 29.90; // Your premium plan price
        if (Math.abs(payment.transaction_amount - expectedAmount) > 0.01) {
          console.error('Payment amount mismatch');
          throw new Error('Invalid payment amount');
        }
        
        console.log('Upgrading user to premium (user exists, amount verified)');
          
        const { error } = await supabase
          .from('profiles')
          .update({ plano: 'premium' })
          .eq('id', userId);

        if (error) {
          console.error('Error updating user plan');
          throw error;
        }

        console.log('User upgraded successfully');
      }
    }

    // Mark webhook as processed
    await supabase
      .from('webhook_events')
      .update({ processed: true, processed_at: new Date().toISOString() })
      .eq('event_id', eventId);

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Webhook processing error:', {
      hasError: !!error,
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
