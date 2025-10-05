import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { sanitizeForWhatsApp, formatBrazilianPhone, agendamentoSchema } from "@/lib/validation";

interface Cliente {
  id: string;
  nome: string;
}

export default function EditarAgendamento() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const [clienteId, setClienteId] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [duracao, setDuracao] = useState("60");
  const [servico, setServico] = useState("");
  const [valor, setValor] = useState("");
  const [status, setStatus] = useState("agendado");
  const [canalLembrete, setCanalLembrete] = useState("email");

  useEffect(() => {
    checkAuth();
    loadClientes();
    loadAgendamento();
  }, [id]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    }
  };

  const loadClientes = async () => {
    const { data, error } = await supabase
      .from("clientes")
      .select("id, nome")
      .order("nome");

    if (error) {
      toast.error("Erro ao carregar clientes");
    } else {
      setClientes(data || []);
    }
  };

  const loadAgendamento = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from("agendamentos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      toast.error("Erro ao carregar agendamento");
      navigate("/agenda");
      return;
    }

    setClienteId(data.cliente_id);
    setData(data.data);
    setHora(data.hora);
    setDuracao(data.duracao.toString());
    setServico(data.servico || "");
    setValor(data.valor ? data.valor.toString() : "");
    setStatus(data.status);
    setCanalLembrete(data.canal_lembrete);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // SECURITY: Validate input data
    if (!servico || servico.trim() === "") {
      toast.error("O serviço é obrigatório");
      return;
    }

    try {
      agendamentoSchema.parse({
        servico,
        valor: valor ? parseFloat(valor) : undefined,
        data,
        hora,
        cliente_id: clienteId,
      });
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || "Dados inválidos");
      return;
    }

    // Validar data (não pode ser no passado)
    const dataAgendamento = new Date(data + 'T00:00:00');
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    if (dataAgendamento < hoje) {
      toast.error("A data do agendamento não pode ser no passado!");
      return;
    }

    // Se for hoje, validar hora
    const agora = new Date();
    if (dataAgendamento.toDateString() === agora.toDateString()) {
      const [h, m] = hora.split(':').map(Number);
      const horaAgendamento = new Date();
      horaAgendamento.setHours(h, m, 0, 0);
      
      if (horaAgendamento <= agora) {
        toast.error("O horário do agendamento já passou!");
        return;
      }
    }
    
    setLoading(true);

    try {
      const { error } = await supabase
        .from("agendamentos")
        .update({
          cliente_id: clienteId,
          data,
          hora,
          duracao: parseInt(duracao),
          servico: servico,
          valor: valor ? parseFloat(valor) : null,
          canal_lembrete: canalLembrete,
          status,
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("Agendamento atualizado com sucesso! ✅");
      navigate("/agenda");
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar agendamento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/agenda")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Editar Agendamento</h1>
            <p className="text-muted-foreground">Atualize as informações do agendamento</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados do Agendamento</CardTitle>
            <CardDescription>Edite as informações do agendamento</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente *</Label>
                <Select value={clienteId} onValueChange={setClienteId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map(cliente => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data">Data *</Label>
                  <Input
                    id="data"
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hora">Hora *</Label>
                  <Input
                    id="hora"
                    type="time"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duracao">Duração (minutos) *</Label>
                <Select value={duracao} onValueChange={setDuracao}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="60">60 minutos</SelectItem>
                    <SelectItem value="90">90 minutos</SelectItem>
                    <SelectItem value="120">120 minutos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="servico">Serviço *</Label>
                <Input
                  id="servico"
                  placeholder="Ex: Consulta, Sessão, Atendimento..."
                  value={servico}
                  onChange={(e) => setServico(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor">Valor (R$)</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agendado">Agendado</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lembrete">Canal de Lembrete</Label>
                <Select value={canalLembrete} onValueChange={setCanalLembrete}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="ambos">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/agenda")}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-primary"
                >
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
