import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle, X } from "lucide-react";
import { toast } from "sonner";

interface ItemListaEspera {
  id: string;
  data: string;
  hora_preferencia?: string;
  servico?: string;
  observacoes?: string;
  status: string;
  clientes: {
    nome: string;
    whatsapp?: string;
  };
}

export const ListaEspera = () => {
  const [itens, setItens] = useState<ItemListaEspera[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListaEspera();
  }, []);

  const loadListaEspera = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("lista_espera")
      .select(`
        *,
        clientes (
          nome,
          whatsapp
        )
      `)
      .eq("status", "aguardando")
      .order("data")
      .order("hora_preferencia");

    if (error) {
      toast.error("Erro ao carregar lista de espera");
    } else {
      setItens(data || []);
    }
    setLoading(false);
  };

  const marcarComoNotificado = async (id: string) => {
    const { error } = await supabase
      .from("lista_espera")
      .update({ status: "notificado" })
      .eq("id", id);

    if (error) {
      toast.error("Erro ao atualizar status");
    } else {
      toast.success("Marcado como notificado!");
      loadListaEspera();
    }
  };

  const removerDaLista = async (id: string) => {
    if (!confirm("Remover este item da lista de espera?")) return;

    const { error } = await supabase
      .from("lista_espera")
      .update({ status: "cancelado" })
      .eq("id", id);

    if (error) {
      toast.error("Erro ao remover da lista");
    } else {
      toast.success("Removido da lista de espera");
      loadListaEspera();
    }
  };

  if (loading) {
    return <div className="text-center py-4">Carregando...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Espera ({itens.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {itens.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhum cliente na lista de espera
          </p>
        ) : (
          itens.map((item) => (
            <div
              key={item.id}
              className="p-4 border rounded-lg hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-foreground">{item.clientes.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(item.data), "dd 'de' MMMM", { locale: ptBR })}
                    {item.hora_preferencia && ` às ${item.hora_preferencia}`}
                  </p>
                </div>
                <Badge>Aguardando</Badge>
              </div>

              {item.servico && (
                <p className="text-sm text-muted-foreground mb-2">
                  Serviço: {item.servico}
                </p>
              )}

              {item.observacoes && (
                <p className="text-sm text-muted-foreground mb-3">
                  Obs: {item.observacoes}
                </p>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => marcarComoNotificado(item.id)}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Notificar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removerDaLista(item.id)}
                >
                  <X className="h-3 w-3 mr-1" />
                  Remover
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};