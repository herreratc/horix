import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PaywallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agendamentosUsados: number;
  limite: number;
}

export default function PaywallModal({ open, onOpenChange, agendamentosUsados, limite }: PaywallModalProps) {
  const navigate = useNavigate();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>
          <AlertDialogTitle className="text-2xl text-center">
            Você atingiu o limite do plano gratuito! 🎯
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base">
            Você já usou <strong>{agendamentosUsados}/{limite}</strong> agendamentos este mês.
            Faça upgrade para Premium e tenha acesso ilimitado!
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">Plano Premium - R$ 29/mês</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm"><strong>Agendamentos ilimitados</strong> - Sem limites mensais</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm"><strong>Lembretes automáticos</strong> - Envie lembretes via WhatsApp</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm"><strong>Relatórios avançados</strong> - Análises detalhadas do seu negócio</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm"><strong>Suporte prioritário</strong> - Atendimento exclusivo</span>
              </div>
            </div>
          </div>

          <div className="bg-accent/10 rounded-lg p-4 text-center border border-accent/20">
            <p className="text-sm font-medium">💡 Oferta Especial</p>
            <p className="text-xs text-muted-foreground mt-1">
              Faça upgrade agora e ganhe 30 dias de teste grátis!
            </p>
          </div>
        </div>

        <AlertDialogFooter className="flex-col sm:flex-col gap-2">
          <Button
            size="lg"
            className="w-full gap-2"
            onClick={() => navigate("/assinatura")}
          >
            <Sparkles className="h-4 w-4" />
            Fazer Upgrade Agora
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Continuar no Plano Free
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
