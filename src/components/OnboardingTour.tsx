import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Settings, Briefcase, Calendar, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingTour = ({ isOpen, onClose }: OnboardingTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    {
      title: "Bem-vindo ao Horix! 🎉",
      description: "Vamos te guiar em 3 passos simples para começar a usar seu sistema de agendamentos",
      icon: Sparkles,
      action: null
    },
    {
      title: "1. Configure seu Perfil",
      description: "Defina seu nome, profissão e horários de atendimento para que seus clientes saibam quando você está disponível",
      icon: Settings,
      action: () => navigate("/configuracoes")
    },
    {
      title: "2. Crie seus Serviços",
      description: "Cadastre os serviços que você oferece com valores e duração. Isso facilita o agendamento dos seus clientes",
      icon: Briefcase,
      action: () => navigate("/servicos")
    },
    {
      title: "3. Comece a Agendar",
      description: "Tudo pronto! Agora você pode criar seu primeiro agendamento ou compartilhar seu link público para que clientes agendem sozinhos",
      icon: Calendar,
      action: () => navigate("/novo-agendamento")
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      if (steps[currentStep].action) {
        steps[currentStep].action!();
      }
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Primeiros Passos</DialogTitle>
          <DialogDescription>
            Passo {currentStep + 1} de {steps.length}
          </DialogDescription>
        </DialogHeader>

        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-6 space-y-6">
            <div className="h-20 w-20 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto shadow-lg">
              <Icon className="h-10 w-10 text-white" />
            </div>

            <div className="text-center space-y-3">
              <h3 className="text-xl font-bold text-foreground">
                {currentStepData.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {currentStepData.description}
              </p>
            </div>

            <div className="flex gap-2 justify-center pt-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'w-8 bg-primary'
                      : index < currentStep
                      ? 'w-2 bg-accent'
                      : 'w-2 bg-muted'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1"
            >
              Pular Tutorial
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1 bg-gradient-primary hover:opacity-90 gap-2"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Começar
              </>
            ) : (
              <>
                Próximo
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};