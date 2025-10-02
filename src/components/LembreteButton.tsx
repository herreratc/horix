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
    const dataFormatada = new Date(data).toLocaleDateString("pt-BR");
    
    // Create message
    const mensagem = `Olá ${clienteNome}! 👋\n\nEste é um lembrete do seu agendamento:\n\n📅 Data: ${dataFormatada}\n🕐 Horário: ${hora}${servico ? `\n📋 Serviço: ${servico}` : ""}\n\nNos vemos em breve! Caso precise remarcar, entre em contato.`;
    
    // Open WhatsApp Web
    const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
    
    toast.success("WhatsApp aberto! Envie a mensagem.");
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
