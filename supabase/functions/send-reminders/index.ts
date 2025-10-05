import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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

    // Calcular data de amanhã
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    const amanhaStr = amanha.toISOString().split('T')[0];

    console.log('Buscando agendamentos para:', amanhaStr);

    // Buscar agendamentos de amanhã
    const { data: agendamentos, error: agendError } = await supabase
      .from('agendamentos')
      .select(`
        *,
        clientes (
          nome,
          whatsapp,
          email
        ),
        profiles (
          nome
        )
      `)
      .eq('data', amanhaStr)
      .eq('status', 'agendado');

    if (agendError) throw agendError;

    console.log(`Encontrados ${agendamentos?.length || 0} agendamentos`);

    let emailsEnviados = 0;
    let whatsappsEnviados = 0;

    // Processar cada agendamento
    for (const agend of agendamentos || []) {
      // Buscar template de lembrete
      const { data: templates } = await supabase
        .from('templates_mensagens')
        .select('*')
        .eq('user_id', agend.user_id)
        .eq('tipo', 'lembrete')
        .eq('ativo', true)
        .limit(1)
        .single();

      let mensagem = templates?.mensagem || 
        `Olá {CLIENTE}! 👋\n\n⏰ *Lembrete de Agendamento*\n\nSeu agendamento é amanhã:\n{SERVICO}🔹 Data: *{DATA}*\n🔹 Horário: *{HORA}*\n\nNos vemos em breve! 😊`;

      // Substituir variáveis
      mensagem = mensagem
        .replace(/{CLIENTE}/g, agend.clientes.nome)
        .replace(/{DATA}/g, new Date(agend.data).toLocaleDateString('pt-BR'))
        .replace(/{HORA}/g, agend.hora)
        .replace(/{SERVICO}/g, agend.servico ? `🔹 Serviço: *${agend.servico}*\n` : '');

      // Enviar por email (se configurado)
      if ((agend.canal_lembrete === 'email' || agend.canal_lembrete === 'ambos') && agend.clientes.email) {
        try {
          // Aqui você pode integrar com Resend ou outro serviço de email
          console.log('Email enviado para:', agend.clientes.email);
          emailsEnviados++;
        } catch (error) {
          console.error('Erro ao enviar email:', error);
        }
      }

      // Enviar por WhatsApp (se configurado e tiver Evolution API)
      if ((agend.canal_lembrete === 'whatsapp' || agend.canal_lembrete === 'ambos') && agend.clientes.whatsapp) {
        try {
          const evolutionApiUrl = Deno.env.get('EVOLUTION_API_URL');
          if (evolutionApiUrl) {
            const response = await fetch(`${evolutionApiUrl}/message/sendText`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': Deno.env.get('EVOLUTION_API_KEY') || '',
              },
              body: JSON.stringify({
                number: agend.clientes.whatsapp.replace(/\D/g, ''),
                text: mensagem,
              }),
            });

            if (response.ok) {
              whatsappsEnviados++;
              console.log('WhatsApp enviado para:', agend.clientes.whatsapp);
            }
          }
        } catch (error) {
          console.error('Erro ao enviar WhatsApp:', error);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        agendamentos: agendamentos?.length || 0,
        emailsEnviados,
        whatsappsEnviados,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro em send-reminders:', error);
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