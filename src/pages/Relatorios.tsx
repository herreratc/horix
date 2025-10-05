import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, DollarSign, Users, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ExportRelatorio } from "@/components/ExportRelatorio";

interface Stats {
  totalAgendamentos: number;
  confirmados: number;
  cancelados: number;
  pendentes: number;
  totalClientes: number;
  receitaTotal: number;
}

export default function Relatorios() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allAgendamentos, setAllAgendamentos] = useState<any[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalAgendamentos: 0,
    confirmados: 0,
    cancelados: 0,
    pendentes: 0,
    totalClientes: 0,
    receitaTotal: 0,
  });
  const [currentMonth] = useState(new Date());

  useEffect(() => {
    checkAuth();
    loadStats();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    }
  };

  const loadStats = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const monthStart = format(startOfMonth(currentMonth), "yyyy-MM-dd");
    const monthEnd = format(endOfMonth(currentMonth), "yyyy-MM-dd");

    // Load all agendamentos for export
    const { data: agendamentos } = await supabase
      .from("agendamentos")
      .select(`
        *,
        clientes (nome)
      `)
      .eq("user_id", user.id)
      .gte("data", monthStart)
      .lte("data", monthEnd);

    setAllAgendamentos(agendamentos || []);

    // Total agendamentos do mês
    const { count: total } = await supabase
      .from("agendamentos")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("data", monthStart)
      .lte("data", monthEnd);

    // Agendamentos confirmados
    const { count: confirmados } = await supabase
      .from("agendamentos")
      .select("*", { count: "exact", head: true })
      .eq("status", "confirmado")
      .gte("data", monthStart)
      .lte("data", monthEnd);

    // Agendamentos cancelados
    const { count: cancelados } = await supabase
      .from("agendamentos")
      .select("*", { count: "exact", head: true })
      .eq("status", "cancelado")
      .gte("data", monthStart)
      .lte("data", monthEnd);

    // Agendamentos pendentes
    const { count: pendentes } = await supabase
      .from("agendamentos")
      .select("*", { count: "exact", head: true })
      .eq("status", "agendado")
      .gte("data", monthStart)
      .lte("data", monthEnd);

    // Total de clientes
    const { count: clientes } = await supabase
      .from("clientes")
      .select("*", { count: "exact", head: true });

    // Receita total (apenas confirmados)
    const { data: agendamentosComValor } = await supabase
      .from("agendamentos")
      .select("valor")
      .eq("status", "confirmado")
      .gte("data", monthStart)
      .lte("data", monthEnd)
      .not("valor", "is", null);

    const receita = agendamentosComValor?.reduce((sum, a) => sum + (Number(a.valor) || 0), 0) || 0;

    setStats({
      totalAgendamentos: total || 0,
      confirmados: confirmados || 0,
      cancelados: cancelados || 0,
      pendentes: pendentes || 0,
      totalClientes: clientes || 0,
      receitaTotal: receita,
    });

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  const taxaConfirmacao = stats.totalAgendamentos > 0
    ? ((stats.confirmados / stats.totalAgendamentos) * 100).toFixed(1)
    : "0";

  const taxaCancelamento = stats.totalAgendamentos > 0
    ? ((stats.cancelados / stats.totalAgendamentos) * 100).toFixed(1)
    : "0";

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Relatórios</h1>
              <p className="text-muted-foreground capitalize">
                {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>
          <ExportRelatorio 
            data={allAgendamentos}
            filename={`relatorio-${format(currentMonth, "yyyy-MM")}`}
            type="agendamentos"
          />
        </div>

        {/* Main Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAgendamentos}</div>
              <p className="text-xs text-muted-foreground">Total do mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Receita</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {stats.receitaTotal.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Apenas confirmados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClientes}</div>
              <p className="text-xs text-muted-foreground">Total cadastrados</p>
            </CardContent>
          </Card>
        </div>

        {/* Status Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
              <CheckCircle className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{stats.confirmados}</div>
              <p className="text-xs text-muted-foreground">
                Taxa: {taxaConfirmacao}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.pendentes}</div>
              <p className="text-xs text-muted-foreground">Aguardando confirmação</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cancelados</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.cancelados}</div>
              <p className="text-xs text-muted-foreground">
                Taxa: {taxaCancelamento}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Insights
            </CardTitle>
            <CardDescription>Análise do seu desempenho</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.totalAgendamentos === 0 && (
              <p className="text-muted-foreground">
                Nenhum agendamento registrado neste mês. Comece criando seus primeiros agendamentos!
              </p>
            )}

            {stats.totalAgendamentos > 0 && (
              <>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/10">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Taxa de Confirmação</p>
                    <p className="text-sm text-muted-foreground">
                      {taxaConfirmacao}% dos seus agendamentos foram confirmados.
                      {parseFloat(taxaConfirmacao) > 80 ? " Excelente!" : parseFloat(taxaConfirmacao) > 60 ? " Bom desempenho!" : " Pode melhorar!"}
                    </p>
                  </div>
                </div>

                {stats.receitaTotal > 0 && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10">
                    <DollarSign className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Receita Média</p>
                      <p className="text-sm text-muted-foreground">
                        R$ {(stats.receitaTotal / stats.confirmados).toFixed(2)} por agendamento confirmado
                      </p>
                    </div>
                  </div>
                )}

                {stats.cancelados > 0 && parseFloat(taxaCancelamento) > 20 && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10">
                    <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Alta Taxa de Cancelamento</p>
                      <p className="text-sm text-muted-foreground">
                        Considere implementar lembretes automáticos para reduzir cancelamentos.
                        Upgrade para Premium para ativar lembretes por WhatsApp.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
