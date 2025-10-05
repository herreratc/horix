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
    
    console.log('Enviando WhatsApp para:', telefone);

    const evolutionApiUrl = Deno.env.get('EVOLUTION_API_URL');
    if (!evolutionApiUrl) {
      throw new Error('EVOLUTION_API_URL não configurada');
    }

    // Limpar telefone (remover caracteres especiais)
    const telefoneLimpo = telefone.replace(/\D/g, "");
    
    // Garantir código do país (Brasil)
    const telefoneCompleto = telefoneLimpo.startsWith("55") 
      ? telefoneLimpo 
      : `55${telefoneLimpo}`;

    // Enviar mensagem via Evolution API
    const response = await fetch(`${evolutionApiUrl}/message/sendText`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': Deno.env.get('EVOLUTION_API_KEY') || '',
      },
      body: JSON.stringify({
        number: telefoneCompleto,
        text: mensagem,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Erro Evolution API:', data);
      throw new Error(data.message || 'Falha ao enviar mensagem');
    }

    console.log('Mensagem enviada com sucesso:', data);

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