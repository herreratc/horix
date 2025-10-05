import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Bell, BarChart3, CheckCircle2, Zap, Shield, Star, Sparkles, ArrowRight, TrendingUp, Users, MessageSquare, CalendarCheck, ChevronDown } from "lucide-react";
import logo from "@/assets/logo.png";
import dashboardReal from "@/assets/dashboard-real.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section com Background Animado */}
      <div className="relative overflow-hidden">
        {/* Background gradiente animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        <div className="relative z-10 px-4 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <nav className="flex justify-between items-center mb-16 animate-fade-in">
              <img src={logo} alt="Horix" className="h-12 md:h-16" />
              <div className="flex items-center gap-6">
                <Button onClick={() => navigate("/planos")} variant="ghost">
                  Planos
                </Button>
                <Button onClick={() => navigate("/sobre")} variant="ghost">
                  Sobre
                </Button>
                <Button onClick={() => navigate("/auth")} variant="outline" size="lg">
                  Entrar
                </Button>
              </div>
            </nav>

            {/* Hero Content */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 text-center lg:text-left animate-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Lançamento: Lembretes WhatsApp</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black leading-tight">
                  Gerencie Agendamentos{" "}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Com Inteligência
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground">
                  Sistema completo para profissionais autônomos. Dashboard financeiro, lembretes automáticos e muito mais.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button
                    size="lg"
                    onClick={() => navigate("/auth")}
                    className="text-lg h-14 px-8 bg-gradient-primary hover:opacity-90 group"
                  >
                    Começar Grátis
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/manual")}
                    className="text-lg h-14 px-8"
                  >
                    Ver Demo
                  </Button>
                </div>

                <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm">
                  {["✓ Grátis para sempre", "✓ Sem cartão", "✓ 2min setup"].map((item) => (
                    <span key={item} className="text-muted-foreground">{item}</span>
                  ))}
                </div>
              </div>

              {/* Screenshot */}
              <div className="relative animate-fade-in lg:block hidden" style={{ animationDelay: "0.2s" }}>
                <div className="absolute inset-0 bg-gradient-primary blur-3xl opacity-30 rounded-3xl" />
                <div className="relative rounded-3xl overflow-hidden border-2 border-border shadow-2xl">
                  <img
                    src={dashboardReal}
                    alt="Dashboard Horix"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <section className="py-16 bg-muted/50 border-y">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "500+", label: "Profissionais" },
              { value: "10k+", label: "Agendamentos" },
              { value: "80%", label: "↓ Faltas" },
              { value: "4.8★", label: "Avaliação" }
            ].map((stat, i) => (
              <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Tudo Que Você Precisa
            </h2>
            <p className="text-xl text-muted-foreground">
              Funcionalidades poderosas em uma interface simples
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: CalendarCheck,
                title: "Agenda Inteligente",
                desc: "Visualize e gerencie todos agendamentos em um calendário interativo. Filtros avançados e busca rápida.",
                color: "primary"
              },
              {
                icon: MessageSquare,
                title: "WhatsApp Automático",
                desc: "Confirmações e lembretes enviados automaticamente. Templates personalizáveis para cada situação.",
                color: "accent"
              },
              {
                icon: BarChart3,
                title: "Dashboard Financeiro",
                desc: "Acompanhe receitas diárias, semanais e mensais. Métricas de desempenho em tempo real.",
                color: "primary"
              }
            ].map((feature, i) => (
              <Card
                key={i}
                className="border-2 hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1 group bg-card"
              >
                <CardHeader>
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl text-card-foreground">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed text-muted-foreground">
                    {feature.desc}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Planos Simples e Transparentes</h2>
            <p className="text-xl text-muted-foreground">Comece grátis, faça upgrade quando quiser</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: "Free",
                price: "R$ 0",
                desc: "Para começar",
                features: [
                  "30 agendamentos/mês",
                  "Gestão de clientes",
                  "Link público",
                  "Calendário completo"
                ]
              },
              {
                name: "Premium",
                price: "R$ 29,90",
                desc: "Recursos ilimitados",
                popular: true,
                features: [
                  "Agendamentos ilimitados",
                  "WhatsApp automático",
                  "Recorrência de agendamentos",
                  "Templates personalizados",
                  "Dashboard financeiro",
                  "Suporte prioritário"
                ]
              }
            ].map((plan, i) => (
              <Card
                key={i}
                className={`relative ${plan.popular ? "border-primary shadow-2xl scale-105" : "border-2"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-primary text-white text-sm font-medium rounded-full">
                    Mais Popular
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-5xl font-bold my-4">{plan.price}</div>
                  <CardDescription>{plan.desc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  <Button
                    className="w-full mt-6"
                    size="lg"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => navigate("/auth")}
                  >
                    {plan.popular ? "Começar Premium" : "Começar Grátis"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            Pronto para Transformar Seu Negócio?
          </h2>
          <p className="text-xl text-muted-foreground">
            Junte-se a centenas de profissionais que já otimizaram sua gestão
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="text-lg h-14 px-12 bg-gradient-primary"
          >
            Começar Agora - É Grátis
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

export default Index;