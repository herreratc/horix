import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface HistoricoClienteProps {
  clienteId: string;
}

interface Agendamento {
  id: string;
  data: string;
  hora: string;
  servico?: string;
  valor?: number;
  status: string;
  duracao: number;
}

export const HistoricoCliente = ({ clienteId }: HistoricoClienteProps) => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistorico();
  }, [clienteId]);

  const loadHistorico = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("agendamentos")
      .select("*")
      .eq("cliente_id", clienteId)
      .order("data", { ascending: false })
      .order("hora", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar histórico");
    } else {
      setAgendamentos(data || []);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluído":
        return "bg-green-500/20 text-green-500";
      case "agendado":
        return "bg-blue-500/20 text-blue-500";
      case "cancelado":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const totalGasto = agendamentos
    .filter((a) => a.status === "concluído")
    .reduce((acc, a) => acc + (a.valor || 0), 0);

  const totalAgendamentos = agendamentos.length;
  const agendamentosConcluidos = agendamentos.filter((a) => a.status === "concluído").length;

  if (loading) {
    return <div className="text-center py-4">Carregando histórico...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Agendamentos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-4 pb-4 border-b">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{totalAgendamentos}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{agendamentosConcluidos}</div>
            <div className="text-xs text-muted-foreground">Concluídos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(totalGasto)}
            </div>
            <div className="text-xs text-muted-foreground">Gasto Total</div>
          </div>
        </div>

        {/* Lista de agendamentos */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {agendamentos.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum agendamento encontrado
            </p>
          ) : (
            agendamentos.map((agend) => (
              <div
                key={agend.id}
                className="p-3 border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">
                      {format(new Date(agend.data), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                    </span>
                  </div>
                  <Badge className={getStatusColor(agend.status)}>{agend.status}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    {agend.hora} ({agend.duracao}min)
                  </div>
                  {agend.valor && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-3 w-3" />
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(agend.valor)}
                    </div>
                  )}
                </div>
                
                {agend.servico && (
                  <div className="mt-2 text-sm">
                    <span className="text-muted-foreground">Serviço:</span>{" "}
                    <span className="text-foreground">{agend.servico}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};