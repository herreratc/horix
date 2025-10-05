import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Calendar, TrendingDown, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Agendamento {
  id: string;
  data: string;
  valor: number;
  status: string;
}

interface DashboardFinanceiroProps {
  agendamentos: Agendamento[];
}

export const DashboardFinanceiro = ({ agendamentos }: DashboardFinanceiroProps) => {
  const [mostrarValores, setMostrarValores] = useState(true);
  
  const hoje = new Date();
  const inicioMes = startOfMonth(hoje);
  const fimMes = endOfMonth(hoje);
  const inicioSemana = startOfWeek(hoje, { locale: ptBR });
  const fimSemana = endOfWeek(hoje, { locale: ptBR });

  const calcularReceita = (inicio: Date, fim: Date) => {
    return agendamentos
      .filter((ag) => {
        const dataAg = new Date(ag.data);
        return (
          dataAg >= inicio &&
          dataAg <= fim &&
          (ag.status === "concluído" || ag.status === "agendado")
        );
      })
      .reduce((total, ag) => total + (ag.valor || 0), 0);
  };

  const receitaMensal = calcularReceita(inicioMes, fimMes);
  const receitaSemanal = calcularReceita(inicioSemana, fimSemana);
  const receitaHoje = agendamentos
    .filter((ag) => {
      const dataAg = format(new Date(ag.data), "yyyy-MM-dd");
      const dataHoje = format(hoje, "yyyy-MM-dd");
      return dataAg === dataHoje && (ag.status === "concluído" || ag.status === "agendado");
    })
    .reduce((total, ag) => total + (ag.valor || 0), 0);

  const totalAgendamentos = agendamentos.filter(
    (ag) => ag.status === "agendado" || ag.status === "concluído"
  ).length;

  const formatarMoeda = (valor: number) => {
    if (!mostrarValores) {
      return "R$ ••••••";
    }
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Resumo Financeiro</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMostrarValores(!mostrarValores)}
          className="gap-2"
        >
          {mostrarValores ? (
            <>
              <EyeOff className="h-4 w-4" />
              Ocultar valores
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Mostrar valores
            </>
          )}
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(receitaMensal)}</div>
            <p className="text-xs text-muted-foreground">
              {format(inicioMes, "MMM yyyy", { locale: ptBR })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Semanal</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(receitaSemanal)}</div>
            <p className="text-xs text-muted-foreground">Esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(receitaHoje)}</div>
            <p className="text-xs text-muted-foreground">
              {format(hoje, "dd/MM/yyyy")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agendamentos</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAgendamentos}</div>
            <p className="text-xs text-muted-foreground">Todos os períodos</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
