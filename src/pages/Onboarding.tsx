import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";

export default function Onboarding() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [nome, setNome] = useState("");
  const [profissao, setProfissao] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [horarioInicio, setHorarioInicio] = useState("09:00");
  const [horarioFim, setHorarioFim] = useState("18:00");

  useEffect(() => {
    checkProfile();
  }, []);

  const checkProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profile && profile.profissao !== "Profissional") {
      navigate("/dashboard");
    }
  };

  const handleNext = () => {
    if (step === 1 && !nome.trim()) {
      toast.error("Por favor, informe seu nome ou nome da empresa");
      return;
    }
    if (step === 2 && !profissao.trim()) {
      toast.error("Por favor, informe sua profissão");
      return;
    }
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = async () => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("profiles")
        .update({
          nome,
          profissao,
          whatsapp: whatsapp || null,
          horario_inicio: horarioInicio,
          horario_fim: horarioFim
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Perfil configurado com sucesso! 🎉");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar perfil");
    } finally {
      setLoading(false);
    }
  };

  const progress = (step / 4) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="space-y-2">
            <CardTitle className="text-2xl">Bem-vindo! 🎉</CardTitle>
            <CardDescription>
              Vamos configurar seu perfil em 4 passos simples
            </CardDescription>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        <CardContent>
          {/* Step 1: Nome */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Como devemos te chamar?</h3>
                <p className="text-sm text-muted-foreground">
                  Seu nome ou nome da sua empresa
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  placeholder="Ex: João Silva ou Clínica Saúde"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  autoFocus
                />
              </div>

              <Button 
                onClick={handleNext} 
                className="w-full gap-2"
                size="lg"
              >
                Próximo
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 2: Profissão */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <span className="text-2xl">👤</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Qual é sua profissão?</h3>
                <p className="text-sm text-muted-foreground">
                  Isso nos ajuda a personalizar sua experiência
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="profissao">Profissão *</Label>
                <Input
                  id="profissao"
                  placeholder="Ex: Psicólogo, Advogado, Personal Trainer..."
                  value={profissao}
                  onChange={(e) => setProfissao(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleBack} 
                  variant="outline"
                  className="flex-1 gap-2"
                  size="lg"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Voltar
                </Button>
                <Button 
                  onClick={handleNext} 
                  className="flex-1 gap-2"
                  size="lg"
                >
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Horários */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <span className="text-2xl">🕐</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Quais seus horários de atendimento?</h3>
                <p className="text-sm text-muted-foreground">
                  Defina seu horário padrão de trabalho
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inicio">Horário de Início</Label>
                  <Input
                    id="inicio"
                    type="time"
                    value={horarioInicio}
                    onChange={(e) => setHorarioInicio(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fim">Horário de Término</Label>
                  <Input
                    id="fim"
                    type="time"
                    value={horarioFim}
                    onChange={(e) => setHorarioFim(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleBack} 
                  variant="outline"
                  className="flex-1 gap-2"
                  size="lg"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Voltar
                </Button>
                <Button 
                  onClick={handleNext} 
                  className="flex-1 gap-2"
                  size="lg"
                >
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: WhatsApp */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Qual seu WhatsApp?</h3>
                <p className="text-sm text-muted-foreground">
                  Para enviar lembretes aos seus clientes (opcional)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp (opcional)</Label>
                <Input
                  id="whatsapp"
                  placeholder="(11) 99999-9999"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Você poderá adicionar depois nas configurações
                </p>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Tudo pronto!</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Você está a um clique de começar a usar sua agenda inteligente
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleBack} 
                  variant="outline"
                  className="flex-1 gap-2"
                  size="lg"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Voltar
                </Button>
                <Button 
                  onClick={handleComplete} 
                  disabled={loading}
                  className="flex-1 gap-2"
                  size="lg"
                >
                  {loading ? "Configurando..." : "Começar a Usar"}
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
