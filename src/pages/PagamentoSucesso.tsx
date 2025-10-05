import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, ArrowRight, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function PagamentoSucesso() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isPremium = profile?.plano === 'premium';
  const isInTrial = profile?.plano === 'trial';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 -z-10" />
      
      <Card className="max-w-2xl w-full p-8 md:p-12 border-2 border-primary/20">
        <div className="text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">
              {isInTrial ? "Trial Ativado! 🎉" : "Pagamento Confirmado! 🎉"}
            </h1>
            <p className="text-muted-foreground text-lg">
              {isInTrial 
                ? "Aproveite 14 dias de acesso Premium gratuito"
                : "Bem-vindo ao Horix Premium"
              }
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 space-y-4 border border-primary/20">
            <div className="flex items-center gap-2 justify-center mb-4">
              <Crown className="h-6 w-6 text-primary" />
              <h2 className="font-bold text-xl">Recursos Desbloqueados</h2>
            </div>
            
            <div className="grid gap-3 text-left">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Agendamentos Ilimitados</p>
                  <p className="text-sm text-muted-foreground">Crie quantos agendamentos precisar</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Lembretes Automáticos via WhatsApp</p>
                  <p className="text-sm text-muted-foreground">Reduza faltas com lembretes inteligentes</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Relatórios Avançados</p>
                  <p className="text-sm text-muted-foreground">Analytics completo do seu negócio</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Suporte Prioritário</p>
                  <p className="text-sm text-muted-foreground">Atendimento exclusivo quando precisar</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trial Info */}
          {isInTrial && profile?.trial_ends_at && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                ℹ️ Seu trial termina em{" "}
                <strong>
                  {new Date(profile.trial_ends_at).toLocaleDateString("pt-BR")}
                </strong>
                . Após isso, será cobrado R$ 29,90/mês.
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="pt-6 space-y-3">
            <Button 
              size="lg" 
              className="w-full gap-2"
              onClick={() => navigate("/dashboard")}
            >
              Ir para o Dashboard
              <ArrowRight className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full"
              onClick={() => navigate("/novo-agendamento")}
            >
              Criar Primeiro Agendamento
            </Button>
          </div>

          {/* Footer */}
          <p className="text-xs text-muted-foreground pt-4 border-t">
            Obrigado por confiar no Horix! Estamos aqui para ajudar seu negócio a crescer.
          </p>
        </div>
      </Card>
    </div>
  );
}
