import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface LembretesAutomaticosProps {
  agendamentos: Array<{
    id: string;
    data: string;
    hora: string;
    servico?: string;
    clientes?: {
      nome: string;
      whatsapp?: string;
    };
  }>;
}

export default function LembretesAutomaticos({ agendamentos }: LembretesAutomaticosProps) {
  const [enviando, setEnviando] = useState(false);

  const agendamentosAmanha = agendamentos.filter((agendamento) => {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    const dataAgendamento = new Date(agendamento.data + 'T00:00:00');
    
    return (
      dataAgendamento.toDateString() === amanha.toDateString() &&
      agendamento.clientes?.whatsapp
    );
  });

  const enviarLembretesEmMassa = async () => {
    setEnviando(true);
    
    let sucessos = 0;
    const total = agendamentosAmanha.length;

    for (const agendamento of agendamentosAmanha) {
      if (!agendamento.clientes?.whatsapp) continue;

      const telefone = agendamento.clientes.whatsapp.replace(/\D/g, "");
      const dataFormatada = new Date(agendamento.data + 'T00:00:00').toLocaleDateString("pt-BR", {
        weekday: 'long',
        day: '2-digit',
        month: 'long'
      });

      const mensagem = `Olá, ${agendamento.clientes.nome}! 👋

📅 *Lembrete de Agendamento para AMANHÃ*

${agendamento.servico ? `🔹 Serviço: *${agendamento.servico}*\n` : ''}🔹 Data: *${dataFormatada}*
🔹 Horário: *${agendamento.hora}*

Estou te esperando! Caso precise remarcar ou cancelar, me avise com antecedência.

Até amanhã! 😊`;

      const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
      
      // Open WhatsApp in new tab with a small delay between each
      await new Promise(resolve => setTimeout(resolve, 1000));
      window.open(url, "_blank");
      sucessos++;
    }

    setEnviando(false);
    
    if (sucessos > 0) {
      toast.success(`${sucessos} aba(s) do WhatsApp aberta(s)! Envie as mensagens.`, {
        duration: 5000
      });
    } else {
      toast.info("Nenhum agendamento para amanhã com WhatsApp cadastrado.");
    }
  };

  if (agendamentosAmanha.length === 0) {
    return null;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="gap-2 bg-gradient-accent hover:opacity-90">
          <Send className="h-4 w-4" />
          Enviar Lembretes de Amanhã ({agendamentosAmanha.length})
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-accent" />
            Enviar Lembretes Automáticos
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Você está prestes a enviar lembretes via WhatsApp para{" "}
              <strong>{agendamentosAmanha.length} agendamento(s)</strong> de amanhã.
            </p>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium text-foreground">Como funciona:</p>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Uma aba do WhatsApp será aberta para cada cliente</li>
                <li>A mensagem já estará pré-preenchida</li>
                <li>Você só precisa clicar em "Enviar" em cada aba</li>
              </ol>
            </div>
            <p className="text-xs text-muted-foreground">
              💡 Dica: Permita pop-ups no navegador para melhor experiência
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={enviarLembretesEmMassa}
            disabled={enviando}
            className="bg-gradient-accent gap-2"
          >
            {enviando ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Abrindo WhatsApp...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Enviar Lembretes
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
