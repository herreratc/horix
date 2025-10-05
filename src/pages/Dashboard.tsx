import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar, Users, TrendingUp, CheckCircle2, Plus, AlertCircle, Sparkles, Share2, Copy, Clock, DollarSign, AlertTriangle, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DashboardFinanceiro } from "@/components/DashboardFinanceiro";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    agendamentos: 0,
    clientes: 0,
    taxaPresenca: 0,
    faturamentoMes: 0,
    agendamentosHoje: 0
  });
  const [comparisons, setComparisons] = useState({
    agendamentos: 0,
    clientes: 0,
    faturamento: 0
  });
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [allAgendamentos, setAllAgendamentos] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [insights, setInsights] = useState<string[]>([]);

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
    loadTodayAppointments(user.id);
    loadAllAgendamentos(user.id);
    loadWeeklyData(user.id);
    loadStatusData(user.id);
    generateInsights(user.id);
  };

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    console.log("Profile carregado:", data);
    setProfile(data);
  };

  const loadStats = async (userId: string) => {
    const today = new Date();
    const firstDayThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    // Total agendamentos
    const { count: totalAgendamentos } = await supabase
      .from("agendamentos")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    // Agendamentos este mês
    const { data: agendamentosThisMonth } = await supabase
      .from("agendamentos")
      .select("*")
      .eq("user_id", userId)
      .gte("data", firstDayThisMonth.toISOString().split('T')[0]);

    // Agendamentos mês passado
    const { count: agendamentosLastMonth } = await supabase
      .from("agendamentos")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("data", firstDayLastMonth.toISOString().split('T')[0])
      .lte("data", lastDayLastMonth.toISOString().split('T')[0]);

    // Total clientes
    const { count: totalClientes } = await supabase
      .from("clientes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    // Clientes mês passado
    const { count: clientesLastMonth } = await supabase
      .from("clientes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .lte("created_at", lastDayLastMonth.toISOString());

    // Taxa de presença (confirmados + concluídos vs cancelados)
    const { count: confirmados } = await supabase
      .from("agendamentos")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .in("status", ["confirmado", "concluido"]);

    const { count: total } = await supabase
      .from("agendamentos")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    const taxaPresenca = total ? Math.round((confirmados || 0) / total * 100) : 0;

    // Faturamento este mês
    const faturamentoMes = agendamentosThisMonth?.reduce((acc, apt) => 
      acc + (apt.valor ? parseFloat(String(apt.valor)) : 0), 0) || 0;

    // Faturamento mês passado
    const { data: agendamentosLastMonthData } = await supabase
      .from("agendamentos")
      .select("valor")
      .eq("user_id", userId)
      .gte("data", firstDayLastMonth.toISOString().split('T')[0])
      .lte("data", lastDayLastMonth.toISOString().split('T')[0]);

    const faturamentoLastMonth = agendamentosLastMonthData?.reduce((acc, apt) => 
      acc + (apt.valor ? parseFloat(String(apt.valor)) : 0), 0) || 0;

    // Agendamentos hoje
    const todayStr = today.toISOString().split('T')[0];
    const { count: agendamentosHoje } = await supabase
      .from("agendamentos")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("data", todayStr);

    setStats({
      agendamentos: totalAgendamentos || 0,
      clientes: totalClientes || 0,
      taxaPresenca,
      faturamentoMes,
      agendamentosHoje: agendamentosHoje || 0
    });

    // Calcular comparações
    const agendamentosChange = agendamentosLastMonth ? 
      Math.round(((agendamentosThisMonth?.length || 0) - agendamentosLastMonth) / agendamentosLastMonth * 100) : 0;
    
    const clientesChange = clientesLastMonth ? 
      Math.round(((totalClientes || 0) - clientesLastMonth) / clientesLastMonth * 100) : 0;
    
    const faturamentoChange = faturamentoLastMonth ? 
      Math.round((faturamentoMes - faturamentoLastMonth) / faturamentoLastMonth * 100) : 0;

    setComparisons({
      agendamentos: agendamentosChange,
      clientes: clientesChange,
      faturamento: faturamentoChange
    });
  };

  const loadTodayAppointments = async (userId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    const { data } = await supabase
      .from("agendamentos")
      .select(`
        *,
        clientes (nome, whatsapp)
      `)
      .eq("user_id", userId)
      .eq("data", today)
      .order("hora", { ascending: true });

    setTodayAppointments(data || []);
  };

  const loadAllAgendamentos = async (userId: string) => {
    const { data } = await supabase
      .from("agendamentos")
      .select("id, data, valor, status")
      .eq("user_id", userId);

    setAllAgendamentos(data || []);
  };

  const loadWeeklyData = async (userId: string) => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const weekData = await Promise.all(
      last7Days.map(async (date) => {
        const { count } = await supabase
          .from("agendamentos")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("data", date);

        return {
          data: new Date(date).toLocaleDateString('pt-BR', { weekday: 'short' }),
          agendamentos: count || 0
        };
      })
    );

    setWeeklyData(weekData);
  };

  const loadStatusData = async (userId: string) => {
    const statuses = ['agendado', 'confirmado', 'concluido', 'cancelado'];
    
    const statusCounts = await Promise.all(
      statuses.map(async (status) => {
        const { count } = await supabase
          .from("agendamentos")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("status", status);

        return {
          name: status.charAt(0).toUpperCase() + status.slice(1),
          value: count || 0,
          color: getStatusChartColor(status)
        };
      })
    );

    setStatusData(statusCounts.filter(s => s.value > 0));
  };

  const generateInsights = async (userId: string) => {
    const newInsights: string[] = [];
    const today = new Date().toISOString().split('T')[0];

    // Agendamentos hoje
    const { count: todayCount } = await supabase
      .from("agendamentos")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("data", today);

    if (todayCount && todayCount > 0) {
      newInsights.push(`📅 Você tem ${todayCount} agendamento${todayCount > 1 ? 's' : ''} hoje`);
    }

    // Agendamentos sem confirmação
    const { count: pendingCount } = await supabase
      .from("agendamentos")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "agendado")
      .gte("data", today);

    if (pendingCount && pendingCount > 0) {
      newInsights.push(`⏳ ${pendingCount} agendamento${pendingCount > 1 ? 's' : ''} aguardando confirmação`);
    }

    // Melhor dia da semana
    const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const { data: recentData } = await supabase
      .from("agendamentos")
      .select("data")
      .eq("user_id", userId)
      .gte("data", lastMonth.toISOString().split('T')[0]);

    if (recentData && recentData.length > 0) {
      const dayCounts = recentData.reduce((acc: any, apt) => {
        const day = new Date(apt.data).getDay();
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {});

      const bestDay = Object.entries(dayCounts).sort((a: any, b: any) => b[1] - a[1])[0];
      if (bestDay) {
        newInsights.push(`⭐ Seu melhor dia: ${daysOfWeek[Number(bestDay[0])]}`);
      }
    }

    // Taxa de presença
    if (stats.taxaPresenca > 0) {
      if (stats.taxaPresenca >= 90) {
        newInsights.push(`🎉 Excelente! Taxa de presença de ${stats.taxaPresenca}%`);
      } else if (stats.taxaPresenca < 70) {
        newInsights.push(`📲 Considere usar lembretes para aumentar a taxa de presença`);
      }
    }

    setInsights(newInsights);
  };

  const getStatusChartColor = (status: string) => {
    switch (status) {
      case 'agendado': return 'hsl(var(--accent))';
      case 'confirmado': return '#10b981';
      case 'concluido': return '#6366f1';
      case 'cancelado': return 'hsl(var(--destructive))';
      default: return 'hsl(var(--muted))';
    }
  };

  const copyLinkPublico = () => {
    const link = `${window.location.origin}/agendamento/${user.id}`;
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getChangeIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-3 w-3" />;
    if (value < 0) return <TrendingDown className="h-3 w-3" />;
    return null;
  };

  const getChangeColor = (value: number) => {
    if (value > 0) return "text-green-500";
    if (value < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-8">
        {/* Welcome Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Olá, <span className="text-primary font-black">{profile?.nome || profile?.profissao || "Usuário"}</span> 👋
          </h1>
          <p className="text-muted-foreground text-lg">Aqui está um resumo do seu dia</p>
          {!profile?.nome && (
            <p className="text-sm text-destructive">
              ⚠️ Configure seu nome nas <button onClick={() => navigate("/configuracoes")} className="underline font-medium">configurações</button>
            </p>
          )}
        </div>

        {/* Insights Banner */}
        {insights.length > 0 && (
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-accent/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-bold text-lg text-foreground">Insights do Dia</h3>
                  <ul className="space-y-1">
                    {insights.map((insight, i) => (
                      <li key={i} className="text-sm text-foreground">{insight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Financeiro */}
        <DashboardFinanceiro agendamentos={allAgendamentos} />

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Total Agendamentos",
              value: stats.agendamentos,
              icon: Calendar,
              gradient: "from-primary to-primary-glow",
              change: comparisons.agendamentos
            },
            {
              title: "Clientes Ativos",
              value: stats.clientes,
              icon: Users,
              gradient: "from-accent to-orange-500",
              change: comparisons.clientes
            },
            {
              title: "Faturamento Mês",
              value: formatCurrency(stats.faturamentoMes),
              icon: DollarSign,
              gradient: "from-green-500 to-emerald-500",
              change: comparisons.faturamento,
              isValue: true
            },
            {
              title: "Taxa de Presença",
              value: `${stats.taxaPresenca}%`,
              icon: CheckCircle2,
              gradient: "from-purple-500 to-pink-500",
              change: null,
              isValue: true
            }
          ].map((stat, i) => (
            <Card key={i} className="border-2 border-border hover:border-primary/50 transition-all hover:shadow-xl group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-6 w-6 text-primary-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                {stat.change !== null && (
                  <div className={`text-xs font-medium flex items-center gap-1 ${getChangeColor(stat.change)}`}>
                    {getChangeIcon(stat.change)}
                    {stat.change > 0 && '+'}{stat.change}% vs mês anterior
                  </div>
                )}
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
                        <Sparkles className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-bold text-lg text-foreground">Plano Free</p>
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
                  <Share2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold mb-1 text-foreground">Link de Agendamento</h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {window.location.origin}/agendamento/{user.id}
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

        
        {/* Charts Section */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Weekly Chart */}
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Últimos 7 Dias</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="data" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="agendamentos" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Chart */}
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Status dos Agendamentos</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-foreground">{stats.agendamentos}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Ações Rápidas</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

        {/* Today's Appointments */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            Agendamentos de Hoje
          </h2>
          <Card className="border-2 border-border">
            <CardContent className="p-6">
              {todayAppointments.length > 0 ? (
                <div className="space-y-3">
                  {todayAppointments.map((apt, i) => (
                    <div 
                      key={i} 
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer border border-border group"
                      onClick={() => navigate("/agenda")}
                    >
                      <div className="h-14 w-14 rounded-xl bg-primary/10 flex flex-col items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <span className="text-xs text-muted-foreground">Hoje</span>
                        <span className="text-lg font-bold text-primary">{apt.hora}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-foreground text-lg">{apt.clientes?.nome || 'Cliente'}</p>
                        <p className="text-sm text-muted-foreground">
                          {apt.servico || 'Serviço não especificado'}
                        </p>
                        {apt.clientes?.whatsapp && (
                          <p className="text-xs text-muted-foreground mt-1">
                            📱 {apt.clientes.whatsapp}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className={`text-sm font-bold px-3 py-1 rounded-full border-2 ${
                          apt.status === 'confirmado' ? 'border-green-500 text-green-500 bg-green-500/10' :
                          apt.status === 'agendado' ? 'border-accent text-accent bg-accent/10' :
                          apt.status === 'cancelado' ? 'border-destructive text-destructive bg-destructive/10' :
                          'border-muted text-muted-foreground bg-muted/10'
                        }`}>
                          {apt.status}
                        </div>
                        {apt.valor && (
                          <span className="text-sm font-semibold text-green-600">
                            {formatCurrency(parseFloat(apt.valor))}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 space-y-4">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto">
                    <Clock className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-foreground">Nenhum agendamento hoje</p>
                    <p className="text-muted-foreground">Aproveite para relaxar ou criar novos agendamentos</p>
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
              <CardTitle className="text-xl text-foreground">Dica do Dia</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/80">
              Compartilhe seu link público de agendamento nas redes sociais para que seus clientes possam agendar diretamente! 🚀
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
