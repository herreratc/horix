import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar, Users, BarChart3, Settings, Plus, Share2, Sparkles, TrendingUp, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ agendamentos: 0, clientes: 0 });
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    setUser(user);
    loadProfile(user.id);
    loadStats(user.id);
    loadRecentAppointments(user.id);
  };

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    setProfile(data);
  };

  const loadStats = async (userId: string) => {
    const { count: agendamentos } = await supabase
      .from("agendamentos")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    const { count: clientes } = await supabase
      .from("clientes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    setStats({
      agendamentos: agendamentos || 0,
      clientes: clientes || 0
    });
  };

  const loadRecentAppointments = async (userId: string) => {
    const { data } = await supabase
      .from("agendamentos")
      .select(`
        *,
        clientes (nome)
      `)
      .eq("user_id", userId)
      .order("data", { ascending: false })
      .limit(5);

    setRecentAppointments(data || []);
  };

  const copyLinkPublico = () => {
    const link = `${window.location.origin}/p/${user.id}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copiado! Compartilhe com seus clientes 🎉");
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  const isFreePlan = profile.plano === "free";
  const limitReached = isFreePlan && profile.agendamentos_mes >= 30;
  const usagePercentage = isFreePlan ? (profile.agendamentos_mes / 30) * 100 : 0;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado': return 'text-accent';
      case 'confirmado': return 'text-green-500';
      case 'cancelado': return 'text-destructive';
      case 'concluido': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <img src={logo} alt="Horix" className="relative h-14 w-auto" />
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Olá, <span className="bg-gradient-primary bg-clip-text text-transparent">{profile.profissao}</span> 👋
                </h1>
                <p className="text-muted-foreground">Aqui está um resumo do seu dia</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate("/configuracoes")}
              className="gap-2 border-2 hover:border-primary/50 transition-colors"
            >
              <Settings className="h-4 w-4" />
              Configurações
            </Button>
          </div>

          {/* Plano Status & Quick Actions Row */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Plano Status */}
            {isFreePlan && (
              <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-primary/5 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-accent flex items-center justify-center shadow-md">
                          <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-lg">Plano Free</p>
                          <p className="text-sm text-muted-foreground">
                            {profile.agendamentos_mes}/30 agendamentos
                          </p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => navigate("/assinatura")}
                        size="sm"
                        className="bg-gradient-primary hover:opacity-90 gap-2 shadow-md"
                      >
                        <Sparkles className="h-3 w-3" />
                        Upgrade
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Uso mensal</span>
                        <span>{Math.round(usagePercentage)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            usagePercentage > 80 ? 'bg-gradient-to-r from-destructive to-accent' : 'bg-gradient-accent'
                          }`}
                          style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Link Público - Compacto */}
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-md">
                    <Share2 className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1">Link de Agendamento</h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {window.location.origin}/p/{user.id}
                    </p>
                  </div>
                  <Button 
                    onClick={copyLinkPublico} 
                    size="sm"
                    className="gap-2 bg-gradient-primary hover:opacity-90 shadow-md flex-shrink-0"
                  >
                    Copiar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-4">
            {[
              {
                title: "Total Agendamentos",
                value: stats.agendamentos,
                icon: Calendar,
                color: "primary",
                change: "+12%",
                description: "desde o início"
              },
              {
                title: "Clientes Ativos",
                value: stats.clientes,
                icon: Users,
                color: "accent",
                change: "+5%",
                description: "total cadastrado"
              },
              {
                title: "Este Mês",
                value: profile.agendamentos_mes,
                icon: TrendingUp,
                color: "primary",
                change: `${isFreePlan ? Math.round(usagePercentage) : 100}%`,
                description: "do limite"
              },
              {
                title: "Taxa de Presença",
                value: "94%",
                icon: CheckCircle2,
                color: "accent",
                change: "+3%",
                description: "vs mês anterior"
              }
            ].map((stat, i) => (
              <Card 
                key={i} 
                className="border-2 border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-xl group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                  </div>
                  <div className={`h-10 w-10 rounded-xl bg-gradient-${stat.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-accent font-medium">↑ {stat.change}</span>
                    <span className="text-muted-foreground">{stat.description}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Quick Actions - 2 columns */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-semibold">Ações Rápidas</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Button 
                  size="lg" 
                  className="h-32 text-lg bg-gradient-primary hover:opacity-90 shadow-xl group relative overflow-hidden"
                  disabled={limitReached}
                  onClick={() => limitReached ? navigate("/assinatura") : navigate("/novo-agendamento")}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex flex-col items-center gap-3">
                    <Plus className="h-8 w-8 group-hover:scale-110 transition-transform" />
                    <span>{limitReached ? "Limite Atingido" : "Novo Agendamento"}</span>
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-32 text-lg border-2 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                  onClick={() => navigate("/clientes")}
                >
                  <div className="flex flex-col items-center gap-3">
                    <Users className="h-8 w-8 group-hover:scale-110 transition-transform" />
                    <span>Gerenciar Clientes</span>
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-32 text-lg border-2 hover:border-accent/50 hover:bg-accent/5 transition-all group"
                  onClick={() => navigate("/agenda")}
                >
                  <div className="flex flex-col items-center gap-3">
                    <Calendar className="h-8 w-8 group-hover:scale-110 transition-transform" />
                    <span>Ver Agenda</span>
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-32 text-lg border-2 hover:border-accent/50 hover:bg-accent/5 transition-all group"
                  onClick={() => navigate("/relatorios")}
                >
                  <div className="flex flex-col items-center gap-3">
                    <BarChart3 className="h-8 w-8 group-hover:scale-110 transition-transform" />
                    <span>Relatórios</span>
                  </div>
                </Button>
              </div>
            </div>

            {/* Recent Activity - 1 column */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Próximos Agendamentos</h2>
              <Card className="border-2 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4">
                  {recentAppointments.length > 0 ? (
                    <div className="space-y-3">
                      {recentAppointments.slice(0, 5).map((apt, i) => (
                        <div 
                          key={i} 
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => navigate("/agenda")}
                        >
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {apt.clientes?.nome || 'Cliente'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(apt.data)} • {apt.hora}
                            </p>
                          </div>
                          <div className={`text-xs font-medium ${getStatusColor(apt.status)}`}>
                            {apt.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 space-y-3">
                      <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
                        <AlertCircle className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">Nenhum agendamento</p>
                        <p className="text-sm text-muted-foreground">Crie seu primeiro agendamento</p>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => navigate("/novo-agendamento")}
                        className="bg-gradient-primary hover:opacity-90"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Agendamento
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tips Card */}
              <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-primary/5 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-accent" />
                    <CardTitle className="text-base">Dica do Dia</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Compartilhe seu link público de agendamento nas redes sociais para que seus clientes possam agendar diretamente!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
