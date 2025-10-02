import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Bell, BarChart3, CheckCircle2, Zap, Shield, Star } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10 -z-10" />
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <Calendar className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Agenda Inteligente
            <span className="block text-primary mt-2">para Profissionais</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simplifique seus agendamentos com automação inteligente. Mais tempo para você, menos tempo gerenciando agenda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")} className="text-lg h-14 px-8">
              Começar Grátis
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")} className="text-lg h-14 px-8">
              Ver Demonstração
            </Button>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-accent" />
            <span>Grátis para sempre • Sem cartão de crédito</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Recursos Poderosos</h2>
            <p className="text-muted-foreground text-lg">Tudo que você precisa para gerenciar sua agenda profissionalmente</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Agendamento Rápido</CardTitle>
                <CardDescription>
                  Crie agendamentos em segundos. Interface intuitiva e otimizada para agilidade.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Bell className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Lembretes Automáticos</CardTitle>
                <CardDescription>
                  Envie lembretes via WhatsApp automaticamente. Reduza faltas em até 80%.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Relatórios Inteligentes</CardTitle>
                <CardDescription>
                  Acompanhe métricas importantes. Decisões baseadas em dados reais.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Feito para <span className="text-primary">Profissionais</span>
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Rápido e Simples</h3>
                    <p className="text-muted-foreground">Configure em minutos e comece a usar imediatamente</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Seguro e Confiável</h3>
                    <p className="text-muted-foreground">Seus dados protegidos com criptografia de ponta</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Star className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Suporte Dedicado</h3>
                    <p className="text-muted-foreground">Estamos aqui para ajudar você a ter sucesso</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8 aspect-square flex items-center justify-center">
              <div className="text-center space-y-4">
                <Calendar className="h-32 w-32 text-primary mx-auto" />
                <p className="text-lg font-medium">Sua Agenda Profissional</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 py-20 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Planos Transparentes</h2>
            <p className="text-muted-foreground text-lg">Comece grátis. Escale quando precisar.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <CardDescription>Perfeito para começar</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 0</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>Até 30 agendamentos/mês</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>Gerenciamento de clientes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>Calendário básico</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={() => navigate("/auth")}>
                  Começar Grátis
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Mais Popular
                </span>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Premium</CardTitle>
                <CardDescription>Para profissionais sérios</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 29</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span className="font-medium">Agendamentos ilimitados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>Lembretes automáticos WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>Relatórios avançados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>Suporte prioritário</span>
                  </div>
                </div>
                <Button className="w-full" onClick={() => navigate("/auth")}>
                  Começar Agora
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Pronto para Transformar sua Agenda?
          </h2>
          <p className="text-xl text-muted-foreground">
            Junte-se a centenas de profissionais que já otimizaram seu tempo
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="text-lg h-14 px-12">
            Criar Conta Grátis
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-8">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>© 2025 Agenda Inteligente. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
