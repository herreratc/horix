import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { sanitizeForWhatsApp, formatBrazilianPhone } from "@/lib/validation";

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

    try {
      // Validate and format phone number
      const telefone = formatBrazilianPhone(clienteWhatsapp);
      
      // Format date
      const dataFormatada = new Date(data + 'T00:00:00').toLocaleDateString("pt-BR", {
        weekday: 'long',
        day: '2-digit',
        month: 'long'
      });
      
      // SECURITY: Sanitize all user inputs
      const nomeSeguro = sanitizeForWhatsApp(clienteNome);
      const servicoSeguro = servico ? sanitizeForWhatsApp(servico) : '';
      
      // Create message - Professional and friendly
      const mensagem = `Olá, ${nomeSeguro}! 👋

📅 *Lembrete de Agendamento*

${servicoSeguro ? `🔹 Serviço: *${servicoSeguro}*\n` : ''}🔹 Data: *${dataFormatada}*
🔹 Horário: *${hora}*

Estou te esperando! Caso precise remarcar ou cancelar, me avise com antecedência.

Até breve! 😊`;
      
      // Open WhatsApp Web
      const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, "_blank");
      
      toast.success("WhatsApp aberto! Envie a mensagem 💬");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao abrir WhatsApp");
    }
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
