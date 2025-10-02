import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar, Users, TrendingUp, CheckCircle2, Plus, AlertCircle, Sparkles, Share2, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";

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
    toast.success("Link copiado! 🎉");
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
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-8">
        {/* Welcome Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">
            Olá, <span className="bg-gradient-primary bg-clip-text text-transparent">{profile.nome || profile.profissao}</span> 👋
          </h1>
          <p className="text-muted-foreground">Aqui está um resumo do seu dia</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Total Agendamentos",
              value: stats.agendamentos,
              icon: Calendar,
              gradient: "from-primary to-primary-glow",
              change: "+12%"
            },
            {
              title: "Clientes Ativos",
              value: stats.clientes,
              icon: Users,
              gradient: "from-accent to-orange-500",
              change: "+5%"
            },
            {
              title: "Este Mês",
              value: profile.agendamentos_mes,
              icon: TrendingUp,
              gradient: "from-purple-500 to-pink-500",
              change: `${Math.round(usagePercentage)}%`
            },
            {
              title: "Taxa de Presença",
              value: "94%",
              icon: CheckCircle2,
              gradient: "from-green-500 to-emerald-500",
              change: "+3%"
            }
          ].map((stat, i) => (
            <Card key={i} className="border-2 border-border hover:border-primary/50 transition-all hover:shadow-xl group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-xs text-accent font-medium">
                  ↑ {stat.change} vs mês anterior
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Plano Info & Link Público */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Plano Status */}
          {isFreePlan && (
            <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/10 to-primary/10">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-gradient-accent flex items-center justify-center shadow-lg">
                        <Sparkles className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">Plano Free</p>
                        <p className="text-sm text-muted-foreground">
                          {profile.agendamentos_mes}/30 agendamentos
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => navigate("/assinatura")}
                      size="sm"
                      className="bg-gradient-primary hover:opacity-90"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Upgrade
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Uso mensal</span>
                      <span>{Math.round(usagePercentage)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
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

          {/* Link Público */}
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-accent/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg flex-shrink-0">
                  <Share2 className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold mb-1">Link de Agendamento</h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {window.location.origin}/p/{user.id}
                  </p>
                </div>
                <Button 
                  onClick={copyLinkPublico} 
                  size="sm"
                  className="gap-2 bg-gradient-primary hover:opacity-90 shadow-lg"
                >
                  <Copy className="h-4 w-4" />
                  Copiar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Ações Rápidas</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Button 
              size="lg" 
              className="h-40 text-lg bg-gradient-primary hover:opacity-90 shadow-xl group relative overflow-hidden"
              disabled={limitReached}
              onClick={() => limitReached ? navigate("/assinatura") : navigate("/novo-agendamento")}
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex flex-col items-center gap-4">
                <Plus className="h-10 w-10 group-hover:scale-110 transition-transform" />
                <span className="font-bold">{limitReached ? "Limite Atingido" : "Novo Agendamento"}</span>
              </div>
            </Button>

            <Button 
              variant="outline" 
              size="lg" 
              className="h-40 text-lg border-2 hover:border-primary hover:bg-primary/5 transition-all group"
              onClick={() => navigate("/clientes")}
            >
              <div className="flex flex-col items-center gap-4">
                <Users className="h-10 w-10 group-hover:scale-110 transition-transform" />
                <span className="font-bold">Clientes</span>
              </div>
            </Button>

            <Button 
              variant="outline" 
              size="lg" 
              className="h-40 text-lg border-2 hover:border-accent hover:bg-accent/5 transition-all group"
              onClick={() => navigate("/agenda")}
            >
              <div className="flex flex-col items-center gap-4">
                <Calendar className="h-10 w-10 group-hover:scale-110 transition-transform" />
                <span className="font-bold">Ver Agenda</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Próximos Agendamentos</h2>
          <Card className="border-2 border-border">
            <CardContent className="p-6">
              {recentAppointments.length > 0 ? (
                <div className="space-y-3">
                  {recentAppointments.map((apt, i) => (
                    <div 
                      key={i} 
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer border border-border"
                      onClick={() => navigate("/agenda")}
                    >
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold">{apt.clientes?.nome || 'Cliente'}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(apt.data)} • {apt.hora}
                        </p>
                      </div>
                      <div className={`text-sm font-bold px-3 py-1 rounded-full ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 space-y-4">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto">
                    <AlertCircle className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Nenhum agendamento</p>
                    <p className="text-muted-foreground">Crie seu primeiro agendamento</p>
                  </div>
                  <Button 
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
        </div>

        {/* Tip Card */}
        <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/10 to-primary/10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-accent" />
              <CardTitle className="text-xl">Dica do Dia</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Compartilhe seu link público de agendamento nas redes sociais para que seus clientes possam agendar diretamente! 🚀
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
