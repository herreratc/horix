import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface LembreteButtonProps {
  clienteNome: string;
  clienteWhatsapp?: string;
  data: string;
  hora: string;
  servico?: string;
}

export default function LembreteButton({ 
  clienteNome, 
  clienteWhatsapp, 
  data, 
  hora,
  servico 
}: LembreteButtonProps) {
  const enviarLembrete = () => {
    if (!clienteWhatsapp) {
      toast.error("Cliente não tem WhatsApp cadastrado");
      return;
    }

    // Remove all non-numeric characters from phone
    const telefone = clienteWhatsapp.replace(/\D/g, "");
    
    // Format date
    const dataFormatada = new Date(data + 'T00:00:00').toLocaleDateString("pt-BR", {
      weekday: 'long',
      day: '2-digit',
      month: 'long'
    });
    
    // Create message - Professional and friendly
    const mensagem = `Olá, ${clienteNome}! 👋

📅 *Lembrete de Agendamento*

${servico ? `🔹 Serviço: *${servico}*\n` : ''}🔹 Data: *${dataFormatada}*
🔹 Horário: *${hora}*

Estou te esperando! Caso precise remarcar ou cancelar, me avise com antecedência.

Até breve! 😊`;
    
    // Open WhatsApp Web
    const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
    
    toast.success("WhatsApp aberto! Envie a mensagem 💬");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={enviarLembrete}
      disabled={!clienteWhatsapp}
      className="gap-2"
    >
      <MessageSquare className="h-4 w-4" />
      Enviar Lembrete
    </Button>
  );
}
