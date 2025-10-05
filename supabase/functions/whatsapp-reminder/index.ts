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
    const { telefone, mensagem } = await req.json();
    
    // SECURITY: Validate inputs
    if (!telefone || !mensagem) {
      throw new Error('Missing required parameters');
    }
    
    console.log('Sending WhatsApp message');

    const evolutionApiUrl = Deno.env.get('EVOLUTION_API_URL');
    const evolutionApiKey = Deno.env.get('EVOLUTION_API_KEY');
    
    if (!evolutionApiUrl) {
      throw new Error('EVOLUTION_API_URL não configurada');
    }
    
    if (!evolutionApiKey) {
      throw new Error('EVOLUTION_API_KEY não configurada');
    }

    // SECURITY: Sanitize and validate phone number
    const telefoneLimpo = telefone.replace(/\D/g, "");
    
    // Validate phone number length (10-11 digits for Brazil)
    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
      throw new Error('Invalid phone number format');
    }
    
    // Garantir código do país (Brasil)
    const telefoneCompleto = telefoneLimpo.startsWith("55") 
      ? telefoneLimpo 
      : `55${telefoneLimpo}`;
    
    // SECURITY: Limit message length
    const mensagemSegura = mensagem.slice(0, 4096);

    // Enviar mensagem via Evolution API
    const response = await fetch(`${evolutionApiUrl}/message/sendText`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': evolutionApiKey,
      },
      body: JSON.stringify({
        number: telefoneCompleto,
        text: mensagemSegura,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Evolution API error - status:', response.status);
      throw new Error(data.message || 'Falha ao enviar mensagem');
    }

    console.log('Message sent successfully');

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro em whatsapp-reminder:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});