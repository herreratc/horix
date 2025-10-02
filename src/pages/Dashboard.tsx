import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar, Users, BarChart3, Settings, Plus, Copy, Share2, Sparkles, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ agendamentos: 0, clientes: 0 });

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

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Olá, <span className="bg-gradient-primary bg-clip-text text-transparent">{profile.profissao}</span> 👋
              </h1>
              <p className="text-muted-foreground">Bem-vindo ao seu painel de controle</p>
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

          {/* Plano Status */}
          {isFreePlan && (
            <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-primary/5 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-gradient-accent flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Plano Free</p>
                        <p className="text-sm text-muted-foreground">
                          {profile.agendamentos_mes}/30 agendamentos este mês
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-accent transition-all duration-500"
                        style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate("/assinatura")}
                    className="bg-gradient-primary hover:opacity-90 gap-2 shadow-lg"
                  >
                    <Sparkles className="h-4 w-4" />
                    Fazer Upgrade
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Link Público */}
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Share2 className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">Link Público de Agendamento</h3>
                    <p className="text-sm text-muted-foreground">
                      Compartilhe este link para seus clientes agendarem diretamente
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <code className="flex-1 text-xs sm:text-sm bg-background/80 px-4 py-3 rounded-lg border border-border/50 font-mono">
                      {window.location.origin}/p/{user.id}
                    </code>
                    <Button 
                      onClick={copyLinkPublico} 
                      className="gap-2 bg-gradient-primary hover:opacity-90 shadow-md"
                    >
                      <Copy className="h-4 w-4" />
                      Copiar Link
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Total Agendamentos",
                value: stats.agendamentos,
                icon: Calendar,
                color: "primary",
                change: "+12%"
              },
              {
                title: "Total Clientes",
                value: stats.clientes,
                icon: Users,
                color: "accent",
                change: "+5%"
              },
              {
                title: "Este Mês",
                value: profile.agendamentos_mes,
                icon: TrendingUp,
                color: "primary",
                change: `${isFreePlan ? Math.round(usagePercentage) : 0}%`
              }
            ].map((stat, i) => (
              <Card 
                key={i} 
                className="border-2 border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-xl group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`h-10 w-10 rounded-xl bg-gradient-${stat.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-accent">↑ {stat.change}</span> vs mês anterior
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2">
            <Button 
              size="lg" 
              className="h-32 text-lg bg-gradient-primary hover:opacity-90 shadow-xl group relative overflow-hidden"
              disabled={limitReached}
              onClick={() => limitReached ? navigate("/assinatura") : navigate("/novo-agendamento")}
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex flex-col items-center gap-3">
                <Plus className="h-8 w-8 group-hover:scale-110 transition-transform" />
                <span>{limitReached ? "Limite Atingido - Faça Upgrade" : "Novo Agendamento"}</span>
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
          </div>

          {/* Navigation Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Calendar, label: "Ver Agenda", route: "/agenda", color: "primary" },
              { icon: BarChart3, label: "Relatórios", route: "/relatorios", color: "accent" },
              { icon: Clock, label: "Histórico", route: "/agenda", color: "primary" }
            ].map((nav, i) => (
              <Card
                key={i}
                className="border-2 border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 cursor-pointer group hover:shadow-xl"
                onClick={() => navigate(nav.route)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-${nav.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <nav.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-medium text-lg">{nav.label}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
