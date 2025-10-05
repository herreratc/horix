import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowLeft, Star, Zap, Shield, Crown } from "lucide-react";
import logo from "@/assets/logo.png";

const Planos = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <img 
            src={logo} 
            alt="Horix" 
            className="h-10 md:h-12 cursor-pointer" 
            onClick={() => navigate("/")}
          />
          <div className="flex gap-3">
            <Button onClick={() => navigate("/")} variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button onClick={() => navigate("/auth")} variant="outline" size="sm">
              Entrar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        <div className="relative z-10 px-4 py-16 md:py-24">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Star className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Planos sem pegadinhas</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              Escolha o Plano{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Perfeito Para Você
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Comece grátis e faça upgrade quando seu negócio crescer. Sem taxas escondidas, sem contratos longos.
            </p>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Plano Free */}
            <Card className="border-2 hover:border-primary/30 transition-all">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-foreground" />
                </div>
                <CardTitle className="text-3xl">Free</CardTitle>
                <div>
                  <div className="text-5xl font-bold">R$ 0</div>
                  <CardDescription className="mt-2 text-base">Para sempre</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    "Até 30 agendamentos por mês",
                    "Gestão completa de clientes",
                    "Link público de agendamento",
                    "Calendário interativo",
                    "Visualização de horários",
                    "Notificações básicas"
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/auth")}
                >
                  Começar Grátis
                </Button>
              </CardContent>
            </Card>

            {/* Plano Premium */}
            <Card className="relative border-primary shadow-2xl md:scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-primary text-primary-foreground text-sm font-bold rounded-full shadow-lg">
                MAIS POPULAR
              </div>
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
                  <Crown className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-3xl">Premium</CardTitle>
                <div>
                  <div className="text-5xl font-bold">R$ 29,90</div>
                  <CardDescription className="mt-2 text-base">Por mês</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    "Agendamentos ilimitados",
                    "WhatsApp automático (confirmações e lembretes)",
                    "Templates de mensagens personalizáveis",
                    "Recorrência de agendamentos",
                    "Dashboard financeiro completo",
                    "Relatórios de receita",
                    "Lista de espera",
                    "Histórico completo de clientes",
                    "Suporte prioritário",
                    "Acesso antecipado a novidades"
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full bg-gradient-primary"
                  size="lg"
                  onClick={() => navigate("/auth")}
                >
                  Começar Premium
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Comparação de Recursos */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-12">Comparação Completa</h2>
            
            <div className="bg-card border rounded-xl overflow-hidden">
              <div className="grid grid-cols-3 gap-4 p-6 bg-muted/50 border-b font-semibold">
                <div>Recurso</div>
                <div className="text-center">Free</div>
                <div className="text-center">Premium</div>
              </div>

              {[
                { feature: "Agendamentos por mês", free: "30", premium: "Ilimitado" },
                { feature: "Gestão de clientes", free: "✓", premium: "✓" },
                { feature: "Link público", free: "✓", premium: "✓" },
                { feature: "Calendário", free: "✓", premium: "✓" },
                { feature: "WhatsApp automático", free: "✗", premium: "✓" },
                { feature: "Templates de mensagens", free: "✗", premium: "✓" },
                { feature: "Recorrência", free: "✗", premium: "✓" },
                { feature: "Dashboard financeiro", free: "✗", premium: "✓" },
                { feature: "Relatórios", free: "✗", premium: "✓" },
                { feature: "Lista de espera", free: "✗", premium: "✓" },
                { feature: "Suporte prioritário", free: "✗", premium: "✓" }
              ].map((row, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-4 p-6 border-b last:border-b-0">
                  <div className="font-medium">{row.feature}</div>
                  <div className="text-center text-muted-foreground">{row.free}</div>
                  <div className="text-center font-semibold text-primary">{row.premium}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
          
          <div className="space-y-6">
            {[
              {
                q: "Posso cancelar a qualquer momento?",
                a: "Sim! Não há contratos ou fidelidade. Você pode cancelar quando quiser e continuar usando até o final do período pago."
              },
              {
                q: "Como funciona o WhatsApp automático?",
                a: "O sistema envia automaticamente confirmações e lembretes via WhatsApp para seus clientes, reduzindo faltas e melhorando a comunicação."
              },
              {
                q: "O plano Free é limitado para sempre?",
                a: "Sim, você pode usar o plano Free indefinidamente com até 30 agendamentos por mês. Faça upgrade quando precisar de mais recursos."
              },
              {
                q: "Posso testar o Premium antes de pagar?",
                a: "Sim! Oferecemos garantia de 7 dias. Se não gostar, devolvemos seu dinheiro sem perguntas."
              }
            ].map((faq, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <Shield className="h-16 w-16 mx-auto text-primary" />
          <h2 className="text-4xl font-bold">
            Comece Hoje, Sem Riscos
          </h2>
          <p className="text-xl text-muted-foreground">
            Teste grátis ou experimente o Premium com garantia de 7 dias
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="text-lg h-14 px-12 bg-gradient-primary"
          >
            Criar Conta Grátis
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>© 2025 Horix. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Planos;