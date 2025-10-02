import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar, Users, BarChart3, LogOut, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  const isFreePlan = profile.plano === "free";
  const limitReached = isFreePlan && profile.agendamentos_mes >= 30;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Agenda Inteligente</h1>
            <p className="text-muted-foreground">{profile.profissao}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        {/* Plano Free Alert */}
        {isFreePlan && (
          <Card className="border-accent">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Plano Free</p>
                  <p className="text-sm text-muted-foreground">
                    {profile.agendamentos_mes}/30 agendamentos este mês
                  </p>
                </div>
                <Button onClick={() => navigate("/assinatura")}>
                  Fazer Upgrade
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.agendamentos}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.clientes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.agendamentos_mes}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Button 
            size="lg" 
            className="h-24 text-lg"
            disabled={limitReached}
            onClick={() => limitReached ? navigate("/assinatura") : navigate("/novo-agendamento")}
          >
            <Plus className="mr-2 h-6 w-6" />
            {limitReached ? "Limite Atingido - Upgrade" : "Novo Agendamento"}
          </Button>

          <Button variant="outline" size="lg" className="h-24 text-lg" onClick={() => navigate("/clientes")}>
            <Users className="mr-2 h-6 w-6" />
            Gerenciar Clientes
          </Button>
        </div>

        {/* Navigation */}
        <div className="grid gap-4 md:grid-cols-3">
          <Button variant="secondary" onClick={() => navigate("/agenda")}>
            <Calendar className="mr-2 h-4 w-4" />
            Ver Agenda
          </Button>

          <Button variant="secondary" onClick={() => navigate("/relatorios")}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Relatórios
          </Button>

          <Button variant="secondary" onClick={() => navigate("/configuracoes")}>
            Configurações
          </Button>
        </div>
      </div>
    </div>
  );
}
