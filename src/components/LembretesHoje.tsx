import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AgendamentoHoje {
  id: string;
  data: string;
  hora: string;
  servico?: string;
  clientes?: {
    nome: string;
    whatsapp?: string;
  };
}

export default function LembretesHoje() {
  const [agendamentosHoje, setAgendamentosHoje] = useState<AgendamentoHoje[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgendamentosHoje();
  }, []);

  const loadAgendamentosHoje = async () => {
    try {
      const hoje = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from("agendamentos")
        .select(`
          *,
          clientes (
            nome,
            whatsapp
          )
        `)
        .eq("data", hoje)
        .neq("status", "cancelado")
        .order("hora");

      if (error) throw error;

      // Filtrar apenas agendamentos com WhatsApp e que ainda não passaram
      const agora = new Date();
      const horaAtual = agora.getHours() * 60 + agora.getMinutes();
      
      const pendentes = (data || []).filter(agend => {
        if (!agend.clientes?.whatsapp) return false;
        
        const [h, m] = agend.hora.split(':').map(Number);
        const horaAgend = h * 60 + m;
        
        // Mostrar apenas agendamentos que começam em mais de 30 minutos
        return horaAgend > horaAtual + 30;
      });

      setAgendamentosHoje(pendentes);
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const enviarLembrete = (agend: AgendamentoHoje) => {
    if (!agend.clientes?.whatsapp) return;

    const telefone = agend.clientes.whatsapp.replace(/\D/g, "");
    const mensagem = `Olá, ${agend.clientes.nome}! 👋

🔔 *Lembrete de Agendamento HOJE*

${agend.servico ? `🔹 Serviço: *${agend.servico}*\n` : ''}🔹 Horário: *${agend.hora}*

Te espero no horário marcado! Estou à disposição para qualquer dúvida.

Até logo! 😊`;

    const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
    toast.success("WhatsApp aberto! Envie o lembrete 💬");
  };

  if (loading) {
    return null;
  }

  if (agendamentosHoje.length === 0) {
    return null;
  }

  return (
    <Card className="border-accent/30 bg-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="h-5 w-5 text-accent" />
          Lembretes Pendentes Hoje
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {agendamentosHoje.map(agend => (
          <div
            key={agend.id}
            className="flex items-center justify-between p-3 bg-card rounded-lg border border-border/50"
          >
            <div className="flex-1">
              <p className="font-medium">{agend.clientes?.nome}</p>
              <p className="text-sm text-muted-foreground">
                {agend.hora} {agend.servico && `• ${agend.servico}`}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => enviarLembrete(agend)}
              className="gap-2 border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground"
            >
              <MessageSquare className="h-4 w-4" />
              Enviar
            </Button>
          </div>
        ))}
        <p className="text-xs text-muted-foreground text-center pt-2">
          💡 Envie lembretes algumas horas antes do agendamento
        </p>
      </CardContent>
    </Card>
  );
}
