import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Target, Users, Lightbulb, Heart, TrendingUp, Shield, Zap } from "lucide-react";
import logo from "@/assets/logo.png";

const Sobre = () => {
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
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              Sobre o{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Horix
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Criado por profissionais autônomos, para profissionais autônomos. Nossa missão é simplificar a gestão do seu negócio.
            </p>
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Nossa História</h2>
            <div className="space-y-4 text-lg text-muted-foreground text-left">
              <p>
                O Horix nasceu da frustração de lidar com planilhas desorganizadas, mensagens perdidas no WhatsApp e clientes faltando sem avisar. Conhecemos essa dor porque vivemos ela.
              </p>
              <p>
                Criamos uma solução simples, eficiente e acessível para profissionais que querem focar no que fazem de melhor: atender seus clientes com excelência.
              </p>
              <p>
                Hoje, ajudamos centenas de profissionais a economizarem tempo, reduzirem faltas e aumentarem sua receita através de automação inteligente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Nossos Valores</h2>
            <p className="text-xl text-muted-foreground">O que nos guia todos os dias</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Heart,
                title: "Simplicidade",
                desc: "Software deve ser fácil de usar, não complicado",
                color: "from-red-500/20 to-pink-500/20"
              },
              {
                icon: Users,
                title: "Foco no Cliente",
                desc: "Ouvimos e implementamos sugestões reais",
                color: "from-blue-500/20 to-cyan-500/20"
              },
              {
                icon: Lightbulb,
                title: "Inovação",
                desc: "Sempre buscando formas de melhorar",
                color: "from-yellow-500/20 to-orange-500/20"
              },
              {
                icon: Shield,
                title: "Transparência",
                desc: "Sem taxas escondidas ou surpresas",
                color: "from-green-500/20 to-emerald-500/20"
              }
            ].map((value, idx) => (
              <Card key={idx} className="text-center border-2 hover:border-primary/50 transition-all">
                <CardHeader>
                  <div className={`h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4`}>
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                  <CardDescription className="text-base">{value.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Missão, Visão */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2">
              <CardHeader>
                <div className="h-14 w-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4">
                  <Target className="h-7 w-7 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">Nossa Missão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Empoderar profissionais autônomos com tecnologia simples e acessível, permitindo que foquem no que realmente importa: seus clientes e seu crescimento.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-4">
                  <TrendingUp className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-2xl">Nossa Visão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Ser a plataforma de gestão número 1 para profissionais autônomos no Brasil, reconhecida pela simplicidade, eficiência e impacto real nos negócios.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Números */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Nosso Impacto</h2>
            <p className="text-xl text-muted-foreground">Números que refletem nossa dedicação</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { value: "500+", label: "Profissionais ativos", icon: Users },
              { value: "10k+", label: "Agendamentos gerenciados", icon: Zap },
              { value: "80%", label: "Redução em faltas", icon: TrendingUp }
            ].map((stat, idx) => (
              <Card key={idx} className="text-center border-2">
                <CardHeader>
                  <stat.icon className="h-12 w-12 mx-auto text-primary mb-4" />
                  <div className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <CardDescription className="text-base mt-2">{stat.label}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">O Que Dizem Sobre Nós</h2>
            <p className="text-xl text-muted-foreground">Histórias reais de quem usa o Horix</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Maria Silva",
                role: "Manicure",
                text: "Reduzi minhas faltas em 70%! Os lembretes automáticos são perfeitos."
              },
              {
                name: "João Santos",
                role: "Personal Trainer",
                text: "Economizo 2 horas por dia que gastava organizando planilhas. Agora foco nos treinos."
              },
              {
                name: "Ana Costa",
                role: "Psicóloga",
                text: "Interface simples e intuitiva. Não precisei de treinamento para usar."
              }
            ].map((testimonial, idx) => (
              <Card key={idx} className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Heart key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <CardDescription className="text-base leading-relaxed text-foreground">
                    "{testimonial.text}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold">
            Faça Parte da Nossa História
          </h2>
          <p className="text-xl text-muted-foreground">
            Junte-se a centenas de profissionais que transformaram sua gestão
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="text-lg h-14 px-12 bg-gradient-primary"
          >
            Começar Gratuitamente
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

export default Sobre;