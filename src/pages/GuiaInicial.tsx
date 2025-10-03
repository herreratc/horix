import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  ChevronRight, 
  ChevronLeft, 
  Calendar, 
  Users, 
  Settings, 
  CheckCircle,
  PlayCircle,
  Briefcase,
  Bell,
  BarChart
} from "lucide-react";

export default function GuiaInicial() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      await supabase
        .from("profiles")
        .update({ profissao: "completed_onboarding" })
        .eq("id", user.id);

      toast.success("Guia concluído! Vamos começar! 🎉");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error("Erro ao finalizar guia");
      navigate("/dashboard");
    }
  };

  const handleSkip = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({ profissao: "completed_onboarding" })
          .eq("id", user.id);
      }
    } catch (error) {
      console.error("Erro ao pular guia:", error);
    }
    navigate("/dashboard");
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Guia de Uso Rápido</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleSkip}>
                Pular
              </Button>
            </div>
            <CardDescription>
              Aprenda a usar sua agenda em 5 passos simples
            </CardDescription>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Passo {step} de {totalSteps}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {/* Step 1: Criar Cliente */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">1. Cadastre seus Clientes</h3>
                <p className="text-muted-foreground">
                  O primeiro passo é adicionar seus clientes ao sistema
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Acesse "Clientes" no menu lateral</p>
                      <p className="text-sm text-muted-foreground">Você encontrará a lista de todos os seus clientes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Clique em "+ Novo Cliente"</p>
                      <p className="text-sm text-muted-foreground">Preencha nome, contato e outras informações</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Adicione WhatsApp (opcional mas recomendado)</p>
                      <p className="text-sm text-muted-foreground">Permite enviar confirmações automáticas</p>
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handleNext} className="w-full gap-2" size="lg">
                Próximo
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 2: Criar Agendamento */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                  <Calendar className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">2. Crie Agendamentos</h3>
                <p className="text-muted-foreground">
                  Agende consultas e compromissos com seus clientes
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Vá para "Agenda"</p>
                      <p className="text-sm text-muted-foreground">Visualize todos os seus compromissos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Clique em "+ Novo Agendamento"</p>
                      <p className="text-sm text-muted-foreground">Escolha cliente, data, hora e serviço</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Confirmação automática por WhatsApp!</p>
                      <p className="text-sm text-muted-foreground">O sistema abre o WhatsApp com a mensagem pronta</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleBack} variant="outline" className="flex-1 gap-2" size="lg">
                  <ChevronLeft className="h-4 w-4" />
                  Voltar
                </Button>
                <Button onClick={handleNext} className="flex-1 gap-2" size="lg">
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Configurar Serviços */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                  <Briefcase className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">3. Configure seus Serviços</h3>
                <p className="text-muted-foreground">
                  Cadastre os serviços que você oferece
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Acesse "Serviços" no menu</p>
                      <p className="text-sm text-muted-foreground">Gerencie todos os seus serviços</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Adicione nome, duração e valor</p>
                      <p className="text-sm text-muted-foreground">Ex: Consulta (60 min) - R$ 150,00</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Use nos agendamentos</p>
                      <p className="text-sm text-muted-foreground">Facilita o registro e o controle financeiro</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleBack} variant="outline" className="flex-1 gap-2" size="lg">
                  <ChevronLeft className="h-4 w-4" />
                  Voltar
                </Button>
                <Button onClick={handleNext} className="flex-1 gap-2" size="lg">
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Lembretes Automáticos */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                  <Bell className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">4. Lembretes Automáticos</h3>
                <p className="text-muted-foreground">
                  Envie lembretes para seus clientes automaticamente
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Dashboard - Lembretes Hoje</p>
                      <p className="text-sm text-muted-foreground">Veja os agendamentos do dia e envie lembretes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Um clique para enviar</p>
                      <p className="text-sm text-muted-foreground">Sistema abre WhatsApp com mensagem personalizada</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Reduza faltas</p>
                      <p className="text-sm text-muted-foreground">Clientes lembrados comparecem mais</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleBack} variant="outline" className="flex-1 gap-2" size="lg">
                  <ChevronLeft className="h-4 w-4" />
                  Voltar
                </Button>
                <Button onClick={handleNext} className="flex-1 gap-2" size="lg">
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Relatórios e Configurações */}
          {step === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                  <BarChart className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">5. Relatórios e Configurações</h3>
                <p className="text-muted-foreground">
                  Acompanhe seu desempenho e personalize o sistema
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Settings className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Configurações</p>
                      <p className="text-sm text-muted-foreground">
                        Ajuste horários, dados pessoais e preferências
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <BarChart className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Relatórios</p>
                      <p className="text-sm text-muted-foreground">
                        Visualize estatísticas e análises do seu negócio
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <PlayCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Manual Completo</p>
                      <p className="text-sm text-muted-foreground">
                        Acesse o guia detalhado sempre que precisar
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Parabéns! Você está pronto! 🎉</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Comece a usar sua agenda inteligente agora mesmo
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleBack} variant="outline" className="flex-1 gap-2" size="lg">
                  <ChevronLeft className="h-4 w-4" />
                  Voltar
                </Button>
                <Button onClick={handleComplete} className="flex-1 gap-2" size="lg">
                  Começar a Usar
                  <CheckCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
