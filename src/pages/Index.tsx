import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Bell, BarChart3, CheckCircle2, Zap, Shield, Star, Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import logo from "@/assets/logo.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-background">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-primary-glow/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "3s" }} />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="px-4 py-20 md:py-32">
          <div className="max-w-6xl mx-auto text-center space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Novo: Agendamento Público</span>
            </div>
            
            <div className="flex justify-center mb-10">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-primary rounded-[3rem] blur-[60px] opacity-90 animate-pulse group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-accent rounded-[3rem] blur-[40px] opacity-70 animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="relative bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl p-10 rounded-[3rem] border-4 border-primary shadow-[0_0_120px_rgba(255,107,0,0.7),0_0_60px_rgba(255,20,147,0.5)] transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 float-animation">
                  <div className="absolute inset-0 bg-gradient-primary opacity-15 rounded-[3rem] animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-accent opacity-10 rounded-[3rem] animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <img 
                    src={logo} 
                    alt="Horix" 
                    className="relative h-40 w-auto drop-shadow-[0_0_50px_rgba(255,107,0,1)]"
                  />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight drop-shadow-[0_0_30px_rgba(255,107,0,0.5)]">
              Sistema de Agendamentos{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent animate-pulse inline-block drop-shadow-[0_0_40px_rgba(255,107,0,0.8)]">
                Inteligente
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Simplifique seus agendamentos com automação inteligente. 
              Mais tempo para você, menos tempo gerenciando agenda.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")} 
                className="text-lg h-14 px-8 bg-gradient-primary hover:opacity-90 transition-opacity shadow-lg gap-2 group"
              >
                Começar Grátis
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                <span>Grátis para sempre</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                <span>Pronto em 2 minutos</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/5 backdrop-blur-sm">
                <Zap className="h-3 w-3 text-accent" />
                <span className="text-xs font-medium text-accent">Recursos</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">Tudo que você precisa</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Ferramentas profissionais para gerenciar sua agenda com eficiência
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Clock,
                  title: "Agendamento Rápido",
                  description: "Crie agendamentos em segundos com interface otimizada e intuitiva.",
                  color: "primary"
                },
                {
                  icon: Bell,
                  title: "Lembretes Automáticos",
                  description: "Envie lembretes via WhatsApp e reduza faltas em até 80%.",
                  color: "accent"
                },
                {
                  icon: BarChart3,
                  title: "Relatórios Inteligentes",
                  description: "Análises e métricas para decisões baseadas em dados reais.",
                  color: "primary"
                }
              ].map((feature, i) => (
                <Card 
                  key={i}
                  className="border-2 border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <CardHeader className="space-y-4">
                    <div className={`h-14 w-14 rounded-2xl bg-gradient-${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                    Feito para{" "}
                    <span className="bg-gradient-primary bg-clip-text text-transparent">
                      Profissionais
                    </span>
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Ferramentas que crescem com você, desde o primeiro cliente até centenas
                  </p>
                </div>
                
                <div className="space-y-6">
                  {[
                    {
                      icon: Zap,
                      title: "Rápido e Simples",
                      description: "Configure em minutos e comece a usar imediatamente",
                      color: "accent"
                    },
                    {
                      icon: Shield,
                      title: "Seguro e Confiável",
                      description: "Seus dados protegidos com criptografia de ponta",
                      color: "primary"
                    },
                    {
                      icon: Star,
                      title: "Suporte Dedicado",
                      description: "Estamos aqui para ajudar você a ter sucesso",
                      color: "accent"
                    }
                  ].map((benefit, i) => (
                    <div key={i} className="flex gap-4 group">
                      <div className={`h-12 w-12 rounded-xl bg-${benefit.color}/10 border border-${benefit.color}/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <benefit.icon className={`h-6 w-6 text-${benefit.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                        <p className="text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-2xl opacity-20" />
                <div className="relative rounded-3xl border-2 border-border/50 bg-card/50 backdrop-blur-xl p-12 aspect-square flex flex-col items-center justify-center text-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-xl opacity-50" />
                    <Calendar className="relative h-32 w-32 text-primary float-animation" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">Sua Agenda Profissional</p>
                    <p className="text-muted-foreground">Sempre organizada e acessível</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/5 backdrop-blur-sm">
                <TrendingUp className="h-3 w-3 text-accent" />
                <span className="text-xs font-medium text-accent">Preços</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">Planos Transparentes</h2>
              <p className="text-muted-foreground text-lg">Comece grátis. Escale quando precisar.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border-2 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardHeader className="space-y-4">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">Free</CardTitle>
                    <CardDescription>Perfeito para começar</CardDescription>
                  </div>
                  <div>
                    <span className="text-5xl font-bold">R$ 0</span>
                    <span className="text-muted-foreground text-lg">/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {[
                      "Até 30 agendamentos/mês",
                      "Gerenciamento de clientes",
                      "Calendário básico",
                      "Link público de agendamento"
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-base border-2 hover:border-primary/50" 
                    onClick={() => navigate("/auth")}
                  >
                    Começar Grátis
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm shadow-2xl relative hover:shadow-3xl transition-all duration-300 scale-105">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-primary text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Mais Popular
                  </span>
                </div>
                <CardHeader className="space-y-4 pt-8">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">Premium</CardTitle>
                    <CardDescription>Para profissionais sérios</CardDescription>
                  </div>
                  <div>
                    <span className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">R$ 29</span>
                    <span className="text-muted-foreground text-lg">/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {[
                      { text: "Agendamentos ilimitados", bold: true },
                      { text: "Lembretes automáticos WhatsApp", bold: false },
                      { text: "Relatórios avançados", bold: false },
                      { text: "Suporte prioritário", bold: false }
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                        <span className={feature.bold ? "font-semibold" : ""}>{feature.text}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full h-12 text-base bg-gradient-primary hover:opacity-90 shadow-lg gap-2" 
                    onClick={() => navigate("/auth")}
                  >
                    Começar Agora
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-2xl opacity-20" />
              <div className="relative rounded-3xl border-2 border-primary/30 bg-card/50 backdrop-blur-xl p-12 text-center space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                    Pronto para Transformar<br />sua Agenda?
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Junte-se a centenas de profissionais que já otimizaram seu tempo
                  </p>
                </div>
                <Button 
                  size="lg" 
                  onClick={() => navigate("/auth")} 
                  className="text-lg h-14 px-12 bg-gradient-primary hover:opacity-90 shadow-lg gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  Criar Conta Grátis
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 px-4 py-12 backdrop-blur-sm bg-card/30">
          <div className="max-w-6xl mx-auto text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <img src={logo} alt="Horix" className="h-8 w-auto" />
            </div>
            <p className="text-muted-foreground">© 2025 Horix. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
