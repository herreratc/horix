import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, CreditCard, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export default function Assinatura() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const monthlyPrice = "R$ 49,90";

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  const handlePayment = async () => {
    if (!userId) {
      toast.error("Você precisa estar logado para assinar");
      navigate("/auth");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('mercadopago-create-preference', {
        body: {
          title: 'Plano Premium - Horix',
          price: 49.90,
          userId: userId,
        }
      });

      if (error) throw error;

      console.log('Preference created:', data);
      
      // Redirecionar para checkout do Mercado Pago
      window.location.href = data.initPoint;

    } catch (error) {
      console.error('Error creating preference:', error);
      toast.error("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
      
      <div className="max-w-5xl mx-auto space-y-8">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Button>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Upgrade para Premium</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Desbloqueie todo o potencial da sua agenda com recursos avançados
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-2xl">Plano Free</CardTitle>
              <CardDescription>Perfeito para começar</CardDescription>
              <div className="mt-6">
                <span className="text-4xl font-bold">R$ 0</span>
                <span className="text-muted-foreground text-lg">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">30 agendamentos/mês</p>
                  <p className="text-sm text-muted-foreground">Limite mensal</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Gerenciamento básico</p>
                  <p className="text-sm text-muted-foreground">Clientes e agenda</p>
                </div>
              </div>
              <div className="flex items-start gap-3 opacity-50">
                <div className="h-5 w-5 rounded-full border-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Sem lembretes automáticos</p>
                  <p className="text-sm text-muted-foreground">Não disponível</p>
                </div>
              </div>
              <div className="flex items-start gap-3 opacity-50">
                <div className="h-5 w-5 rounded-full border-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Relatórios limitados</p>
                  <p className="text-sm text-muted-foreground">Apenas básicos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="border-2 border-primary relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-medium">
              Mais Popular
            </div>
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl flex items-center gap-2">
                Plano Premium
                <Sparkles className="h-5 w-5 text-primary" />
              </CardTitle>
              <CardDescription>Para profissionais sérios</CardDescription>
              <div className="mt-6">
                <span className="text-4xl font-bold text-primary">{monthlyPrice}</span>
                <span className="text-muted-foreground text-lg">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Agendamentos ilimitados</p>
                  <p className="text-sm text-muted-foreground">Sem limite mensal</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Lembretes WhatsApp</p>
                  <p className="text-sm text-muted-foreground">Automáticos e personalizados</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Relatórios avançados</p>
                  <p className="text-sm text-muted-foreground">Insights detalhados</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Suporte prioritário</p>
                  <p className="text-sm text-muted-foreground">Atendimento exclusivo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Section */}
        <Card className="border-2 border-primary shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Pagamento Seguro</CardTitle>
                <CardDescription className="text-base">
                  PIX ou cartão de crédito em até 12x
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Price Display */}
            <div className="text-center py-8 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 rounded-2xl border-2 border-primary/20">
              <p className="text-sm text-muted-foreground mb-2 font-medium">Assinatura mensal</p>
              <p className="text-6xl font-bold text-primary mb-2">{monthlyPrice}</p>
              <p className="text-lg text-muted-foreground">ou <span className="font-semibold text-foreground">12x de R$ 4,99</span></p>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border border-primary/20">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-base mb-1">PIX à vista</p>
                  <p className="text-sm text-muted-foreground">
                    Pagamento instantâneo com aprovação automática
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-accent/5 to-transparent rounded-lg border border-accent/20">
                <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-base mb-1">Cartão de crédito</p>
                  <p className="text-sm text-muted-foreground">
                    Parcele em até 12x sem juros no cartão
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-primary/10 to-accent/5 rounded-lg border border-primary/30">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-base mb-1">100% Seguro</p>
                  <p className="text-sm text-muted-foreground">
                    Pagamento processado pelo Mercado Pago com criptografia de ponta a ponta
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Button 
                onClick={handlePayment}
                disabled={loading}
                className="w-full h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-5 w-5 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                    Processando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Assinar Plano Premium
                  </span>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-3">
                Ao clicar em "Assinar", você será redirecionado para o checkout seguro do Mercado Pago
              </p>
            </div>

            {/* Benefits Reminder */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">∞</p>
                <p className="text-xs text-muted-foreground mt-1">Agendamentos ilimitados</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">24h</p>
                <p className="text-xs text-muted-foreground mt-1">Ativação rápida</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
