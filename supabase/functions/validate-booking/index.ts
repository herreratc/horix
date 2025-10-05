import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BookingRequest {
  userId: string;
  clientName: string;
  clientEmail: string;
  clientWhatsApp: string;
  selectedDate: string;
  selectedTime: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const bookingData: BookingRequest = await req.json();

    console.log('[validate-booking] Request from IP:', clientIP);

    // Rate limiting: Check booking attempts from this IP in last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    const { data: recentAttempts, error: auditError } = await supabase
      .from('audit_logs')
      .select('id')
      .eq('action', 'public_booking_attempt')
      .eq('ip_address', clientIP)
      .gte('created_at', oneHourAgo);

    if (auditError) {
      console.error('[validate-booking] Error checking rate limit:', auditError);
    }

    if (recentAttempts && recentAttempts.length >= 5) {
      console.warn('[validate-booking] Rate limit exceeded for IP:', clientIP);
      
      await supabase.from('audit_logs').insert({
        action: 'public_booking_blocked',
        table_name: 'agendamentos',
        ip_address: clientIP,
        metadata: { reason: 'rate_limit_exceeded', attempts: recentAttempts.length }
      });

      return new Response(
        JSON.stringify({ 
          error: 'Muitas tentativas de agendamento. Por favor, aguarde 1 hora antes de tentar novamente.' 
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log this attempt
    await supabase.from('audit_logs').insert({
      action: 'public_booking_attempt',
      table_name: 'agendamentos',
      ip_address: clientIP,
      metadata: {
        user_id: bookingData.userId,
        date: bookingData.selectedDate,
        time: bookingData.selectedTime
      }
    });

    // Normalize phone number
    const normalizedWhatsApp = bookingData.clientWhatsApp
      .replace(/\D/g, '')
      .replace(/^55/, '');

    // SECURITY: Improved client deduplication with better normalization
    const normalizedEmail = bookingData.clientEmail.toLowerCase().trim();
    const normalizedName = bookingData.clientName.toLowerCase().trim();
    
    // Fetch all clients for this professional to do smart matching
    const { data: allClients } = await supabase
      .from('clientes')
      .select('id, nome, whatsapp, email')
      .eq('user_id', bookingData.userId);

    let existingClient = null;

    if (allClients && allClients.length > 0) {
      // Priority 1: Match by normalized WhatsApp (most reliable)
      existingClient = allClients.find(c => 
        c.whatsapp && c.whatsapp.replace(/\D/g, '') === normalizedWhatsApp
      );
      
      // Priority 2: Match by normalized email
      if (!existingClient && normalizedEmail) {
        existingClient = allClients.find(c => 
          c.email && c.email.toLowerCase().trim() === normalizedEmail
        );
      }
      
      // Priority 3: Match by name similarity (for cases with minimal contact info)
      if (!existingClient && normalizedName) {
        existingClient = allClients.find(c => 
          c.nome && c.nome.toLowerCase().trim() === normalizedName
        );
      }
    }

    let clientId: string;

    if (existingClient) {
      console.log('[validate-booking] Found existing client:', existingClient.id);
      clientId = existingClient.id;
      
      // Always update with latest info to keep records fresh
      await supabase
        .from('clientes')
        .update({
          nome: bookingData.clientName,
          email: normalizedEmail,
          whatsapp: normalizedWhatsApp,
          updated_at: new Date().toISOString()
        })
        .eq('id', clientId);
      console.log('[validate-booking] Updated existing client with latest info');
    } else {
      console.log('[validate-booking] Creating new client');
      const { data: newClient, error: clientError } = await supabase
        .from('clientes')
        .insert({
          user_id: bookingData.userId,
          nome: bookingData.clientName,
          email: normalizedEmail,
          whatsapp: normalizedWhatsApp
        })
        .select()
        .single();

      if (clientError) {
        console.error('[validate-booking] Error creating client:', clientError);
        throw clientError;
      }

      clientId = newClient.id;
    }

    // Check for time slot conflicts
    const { data: conflicts } = await supabase
      .from('agendamentos')
      .select('id')
      .eq('user_id', bookingData.userId)
      .eq('data', bookingData.selectedDate)
      .eq('hora', bookingData.selectedTime)
      .eq('status', 'agendado');

    if (conflicts && conflicts.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Este horário não está mais disponível. Por favor, escolha outro horário.' 
        }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create the appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from('agendamentos')
      .insert({
        user_id: bookingData.userId,
        cliente_id: clientId,
        data: bookingData.selectedDate,
        hora: bookingData.selectedTime,
        status: 'agendado',
        canal_lembrete: 'whatsapp'
      })
      .select()
      .single();

    if (appointmentError) {
      console.error('[validate-booking] Error creating appointment:', appointmentError);
      throw appointmentError;
    }

    console.log('[validate-booking] Appointment created successfully:', appointment.id);

    // Get professional's WhatsApp for confirmation message
    const { data: profile } = await supabase
      .from('profiles')
      .select('whatsapp, nome')
      .eq('id', bookingData.userId)
      .single();

    return new Response(
      JSON.stringify({ 
        success: true,
        appointmentId: appointment.id,
        professionalWhatsApp: profile?.whatsapp,
        professionalName: profile?.nome,
        clientId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[validate-booking] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Erro ao processar agendamento. Tente novamente.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
