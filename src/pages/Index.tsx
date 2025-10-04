import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Bell, BarChart3, CheckCircle2, Zap, Shield, Star, Sparkles, ArrowRight, TrendingUp, Users, MessageSquare, CalendarCheck, ChevronDown, Quote } from "lucide-react";
import logo from "@/assets/logo.png";
import dashboardReal from "@/assets/dashboard-real.png";
import horariosReal from "@/assets/horarios-real.png";
import onboardingReal from "@/assets/onboarding-real.png";
import relatoriosReal from "@/assets/relatorios-real.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-background">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-primary-glow/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "3s" }} />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="px-4 py-20 md:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-fade-in text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Novo: Agendamento Público</span>
                </div>
                
                <div className="flex justify-center lg:justify-start mb-8 lg:hidden">
                  <img 
                    src={logo} 
                    alt="Horix" 
                    className="h-32 w-auto hover:scale-110 transition-transform duration-500 cursor-pointer drop-shadow-2xl"
                  />
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight text-foreground">
                  Transforme Seu Negócio com o{" "}
                  <span className="bg-gradient-primary bg-clip-text text-transparent dark:bg-gradient-primary dark:bg-clip-text dark:text-transparent text-foreground inline-block font-black">
                    Horix
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                  Gerencie clientes, envie lembretes automáticos via WhatsApp e acompanhe seus resultados. 
                  <span className="block mt-2 font-semibold text-foreground">Reduza faltas em até 80% e conquiste mais tempo para focar no que importa.</span>
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center pt-4">
                  <Button 
                    size="lg" 
                    onClick={() => navigate("/auth")} 
                    className="text-lg h-14 px-8 bg-gradient-primary hover:opacity-90 transition-opacity shadow-lg gap-2 group"
                  >
                    Começar Grátis
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground pt-4">
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

              <div className="relative animate-fade-in hidden lg:block" style={{ animationDelay: "0.2s" }}>
                <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20" />
                <div className="relative rounded-3xl overflow-hidden border-2 border-border/50 shadow-2xl">
                  <img 
                    src={dashboardReal} 
                    alt="Dashboard do Horix mostrando estatísticas e agendamentos" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-4 py-16 bg-gradient-to-br from-primary/5 to-accent/5 border-y border-border/50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "500+", label: "Profissionais Ativos" },
                { number: "10.000+", label: "Agendamentos Realizados" },
                { number: "80%", label: "Redução em Faltas" },
                { number: "4.8/5", label: "Avaliação Média" }
              ].map((stat, i) => (
                <div key={i} className="text-center animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground text-sm md:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/5 backdrop-blur-sm">
                <Zap className="h-3 w-3 text-accent" />
                <span className="text-xs font-medium text-foreground">Recursos</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">Como o Horix Funciona</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Três recursos essenciais que vão revolucionar a forma como você gerencia seu tempo
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: CalendarCheck,
                  title: "Agendamento Simplificado",
                  description: "Crie e gerencie agendamentos em segundos. Seus clientes também podem agendar diretamente pelo link público.",
                  image: dashboardReal,
                  color: "primary",
                  features: ["Interface intuitiva", "Link público de agendamento", "Visualização em calendário"]
                },
                {
                  icon: Clock,
                  title: "Horários Flexíveis",
                  description: "Configure seus horários de atendimento por dia da semana. Total controle sobre sua disponibilidade.",
                  image: horariosReal,
                  color: "accent",
                  features: ["Configuração por dia", "Horários personalizados", "Gestão de disponibilidade"]
                },
                {
                  icon: BarChart3,
                  title: "Relatórios e Análises",
                  description: "Acompanhe métricas importantes como taxa de comparecimento, faturamento e desempenho mensal.",
                  image: relatoriosReal,
                  color: "primary",
                  features: ["Dashboards completos", "Métricas em tempo real", "Insights inteligentes"]
                }
              ].map((feature, i) => (
                <Card 
                  key={i}
                  className="border-2 border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group overflow-hidden"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
                    <div className={`absolute top-4 right-4 h-14 w-14 rounded-2xl bg-gradient-${feature.color} flex items-center justify-center shadow-lg`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <CardHeader className="space-y-4">
                    <CardTitle className="text-2xl text-foreground">{feature.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                    <ul className="space-y-2 pt-2">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                          <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
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
                  <h2 className="text-4xl md:text-5xl font-bold leading-tight text-foreground">
                    Construído para{" "}
                    <span className="bg-gradient-primary bg-clip-text text-transparent">
                      Crescer com Você
                    </span>
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Do primeiro cliente ao sucesso consolidado. Horix evolui com seu negócio.
                  </p>
                </div>
                
                <div className="space-y-6">
                  {[
                    {
                      icon: Zap,
                      title: "Configure em Minutos",
                      description: "Interface intuitiva que não requer treinamento. Comece a agendar em menos de 5 minutos.",
                      color: "accent"
                    },
                    {
                      icon: Shield,
                      title: "100% Seguro",
                      description: "Seus dados e dos seus clientes protegidos com tecnologia de ponta e criptografia avançada.",
                      color: "primary"
                    },
                    {
                      icon: Users,
                      title: "Gestão Completa de Clientes",
                      description: "Cadastro detalhado, histórico de agendamentos e análise de comportamento em um só lugar.",
                      color: "accent"
                    }
                  ].map((benefit, i) => (
                    <div key={i} className="flex gap-4 group">
                      <div className={`h-12 w-12 rounded-xl bg-${benefit.color}/10 border border-${benefit.color}/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <benefit.icon className={`h-6 w-6 text-${benefit.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1 text-foreground">{benefit.title}</h3>
                        <p className="text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-2xl opacity-20" />
                <div className="relative rounded-3xl overflow-hidden border-2 border-border/50 shadow-2xl">
                  <img 
                    src={onboardingReal} 
                    alt="Primeiros passos no Horix - Configure em 3 passos simples" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Target Audience Section */}
        <section className="px-4 py-20 bg-gradient-to-br from-accent/5 to-primary/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">Quem Usa o Horix?</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Profissionais de diversas áreas confiam no Horix para gerenciar seus agendamentos
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                { icon: "💇", title: "Barbeiros", subtitle: "Salões & Barbearias" },
                { icon: "🏥", title: "Médicos", subtitle: "Clínicas & Consultórios" },
                { icon: "💆", title: "Terapeutas", subtitle: "Massagem & Estética" },
                { icon: "💪", title: "Personal Trainers", subtitle: "Fitness & Saúde" },
                { icon: "🎓", title: "Professores", subtitle: "Aulas Particulares" }
              ].map((audience, i) => (
                <Card 
                  key={i}
                  className="border-2 border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-center"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <CardHeader className="space-y-3">
                    <div className="text-5xl mx-auto">{audience.icon}</div>
                    <CardTitle className="text-lg text-foreground">{audience.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {audience.subtitle}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/5 backdrop-blur-sm">
                <TrendingUp className="h-3 w-3 text-accent" />
                <span className="text-xs font-medium text-foreground">Preços</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">Planos para Cada Necessidade</h2>
              <p className="text-muted-foreground text-lg">Comece grátis. Cresça com o Premium. Cancele quando quiser.</p>
            </div>
            
            {/* Comparison Table */}
            <div className="mb-12">
              <Card className="border-2 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left p-4 md:p-6 text-foreground font-semibold">Recursos</th>
                          <th className="text-center p-4 md:p-6 text-foreground font-semibold">Free</th>
                          <th className="text-center p-4 md:p-6 bg-primary/5">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-foreground font-semibold">Premium</span>
                              <span className="text-xs text-accent">Mais Popular</span>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { feature: "Agendamentos mensais", free: "30", premium: "Ilimitados" },
                          { feature: "Gerenciamento de clientes", free: "✓", premium: "✓" },
                          { feature: "Link público de agendamento", free: "✓", premium: "✓" },
                          { feature: "Calendário completo", free: "✓", premium: "✓" },
                          { feature: "Lembretes via WhatsApp", free: "✗", premium: "✓" },
                          { feature: "Relatórios avançados", free: "Básico", premium: "Completo" },
                          { feature: "Suporte", free: "Comunidade", premium: "Prioritário" },
                          { feature: "Exportação de dados", free: "✗", premium: "✓" }
                        ].map((row, i) => (
                          <tr key={i} className="border-b border-border/50 last:border-0">
                            <td className="p-4 md:p-6 text-muted-foreground">{row.feature}</td>
                            <td className="p-4 md:p-6 text-center text-foreground">{row.free}</td>
                            <td className="p-4 md:p-6 text-center text-foreground bg-primary/5 font-semibold">{row.premium}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border-2 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardHeader className="space-y-4">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl text-foreground">Free</CardTitle>
                    <CardDescription className="text-muted-foreground">Perfeito para começar</CardDescription>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-foreground">R$ 0</span>
                    <span className="text-muted-foreground text-lg">/mês</span>
                  </div>
                  <p className="text-sm text-accent font-semibold">Grátis para sempre</p>
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
                        <span className="text-foreground">{feature}</span>
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
                    <CardTitle className="text-2xl text-foreground">Premium</CardTitle>
                    <CardDescription className="text-muted-foreground">Para profissionais sérios</CardDescription>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-foreground">R$ 29</span>
                    <span className="text-muted-foreground text-lg">/mês</span>
                  </div>
                  <p className="text-sm text-accent font-semibold">Cancele quando quiser</p>
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
                        <span className={feature.bold ? "font-semibold text-foreground" : "text-foreground"}>{feature.text}</span>
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

        {/* Testimonials Section */}
        <section className="px-4 py-20 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/5 backdrop-blur-sm">
                <Star className="h-3 w-3 text-accent fill-accent" />
                <span className="text-xs font-medium text-foreground">Depoimentos</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">O Que Nossos Clientes Dizem</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Histórias reais de profissionais que transformaram seus negócios
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Carlos Silva",
                  role: "Barbeiro - São Paulo",
                  content: "Reduzi em 70% as faltas dos meus clientes com os lembretes automáticos. Minha agenda nunca esteve tão organizada!",
                  rating: 5
                },
                {
                  name: "Dra. Ana Costa",
                  role: "Psicóloga - Rio de Janeiro",
                  content: "O Horix me deu mais tempo para focar nos meus pacientes. A gestão de agendamentos ficou 100% automatizada.",
                  rating: 5
                },
                {
                  name: "Pedro Martins",
                  role: "Personal Trainer - Brasília",
                  content: "Aumentei meu faturamento em 40% porque consigo gerenciar muito mais alunos sem perder controle.",
                  rating: 5
                }
              ].map((testimonial, i) => (
                <Card 
                  key={i}
                  className="border-2 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <CardHeader className="space-y-4">
                    <Quote className="h-10 w-10 text-primary/30" />
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-accent fill-accent" />
                      ))}
                    </div>
                    <CardDescription className="text-base leading-relaxed text-foreground italic">
                      "{testimonial.content}"
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">Perguntas Frequentes</h2>
              <p className="text-muted-foreground text-lg">
                Tire suas dúvidas sobre o Horix
              </p>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  question: "Como funciona o plano gratuito?",
                  answer: "O plano Free permite até 30 agendamentos por mês, com acesso ao calendário, gerenciamento de clientes e link público de agendamento. É grátis para sempre, sem necessidade de cartão de crédito."
                },
                {
                  question: "Preciso de conhecimento técnico para usar?",
                  answer: "Não! O Horix foi desenvolvido para ser extremamente intuitivo. Você configura tudo em menos de 5 minutos e começa a agendar imediatamente."
                },
                {
                  question: "Como funcionam os lembretes automáticos?",
                  answer: "Com o plano Premium, você pode enviar lembretes automáticos via WhatsApp para seus clientes antes dos agendamentos. Isso reduz faltas em até 80% e economiza seu tempo."
                },
                {
                  question: "Posso cancelar o Premium a qualquer momento?",
                  answer: "Sim! Não há fidelidade. Você pode cancelar quando quiser e continuar usando o plano Free normalmente."
                },
                {
                  question: "Meus dados estão seguros?",
                  answer: "Absolutamente. Utilizamos criptografia de ponta e seguimos as melhores práticas de segurança para proteger seus dados e os de seus clientes."
                },
                {
                  question: "Como funciona o link público de agendamento?",
                  answer: "Você recebe um link único que pode compartilhar com seus clientes. Eles acessam, escolhem o serviço, data e horário disponível, e pronto! O agendamento cai direto na sua agenda."
                }
              ].map((faq, i) => (
                <Card 
                  key={i}
                  className="border-2 border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300"
                >
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground flex items-start justify-between gap-4">
                      <span>{faq.question}</span>
                      <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
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
                  <h2 className="text-4xl md:text-5xl font-bold leading-tight text-foreground">
                    Comece Grátis Hoje Mesmo
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Cadastre-se em menos de 2 minutos e transforme a gestão do seu negócio
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30">
                    <Shield className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium text-foreground">Grátis para sempre • Sem cartão de crédito</span>
                  </div>
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
            <div className="flex items-center justify-center gap-4">
              <a 
                href="https://www.instagram.com/horixapp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                @horixapp
              </a>
            </div>
            <p className="text-muted-foreground text-sm">© 2025 Horix. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
