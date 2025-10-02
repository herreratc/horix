import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Cliente {
  id: string;
  nome: string;
}

export default function NovoAgendamento() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [profile, setProfile] = useState<any>(null);

  const [clienteId, setClienteId] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [duracao, setDuracao] = useState("60");
  const [servico, setServico] = useState("");
  const [valor, setValor] = useState("");
  const [canalLembrete, setCanalLembrete] = useState("email");

  useEffect(() => {
    checkAuth();
    loadClientes();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    // Load profile to check plan limits
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(profileData);

    // Check if user has reached limit
    if (profileData?.plano === "free" && profileData.agendamentos_mes >= 30) {
      toast.error("Limite de agendamentos atingido. Faça upgrade para continuar.");
      navigate("/assinatura");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const agendamentoData = {
        user_id: user.id,
        cliente_id: clienteId,
        data,
        hora,
        duracao: parseInt(duracao),
        servico: servico || null,
        valor: valor ? parseFloat(valor) : null,
        canal_lembrete: canalLembrete,
        status: "agendado",
      };

      const { error } = await supabase
        .from("agendamentos")
        .insert([agendamentoData]);

      if (error) throw error;

      // Update monthly counter
      if (profile) {
        await supabase
          .from("profiles")
          .update({ agendamentos_mes: profile.agendamentos_mes + 1 })
          .eq("id", user.id);
      }

      toast.success("Agendamento criado com sucesso");
      navigate("/agenda");
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar agendamento");
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
            <h1 className="text-3xl font-bold">Novo Agendamento</h1>
            <p className="text-muted-foreground">Agende um novo horário</p>
          </div>
        </div>

        {profile?.plano === "free" && (
          <Card className="border-accent">
            <CardContent className="pt-6">
              <p className="text-sm">
                <strong>Plano Free:</strong> {profile.agendamentos_mes}/30 agendamentos este mês
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Dados do Agendamento</CardTitle>
            <CardDescription>Preencha as informações do agendamento</CardDescription>
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
                {clientes.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Nenhum cliente cadastrado.{" "}
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto"
                      onClick={() => navigate("/clientes/novo")}
                    >
                      Cadastrar cliente
                    </Button>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data">Data *</Label>
                  <Input
                    id="data"
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
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
                <Label htmlFor="servico">Serviço</Label>
                <Input
                  id="servico"
                  placeholder="Ex: Consulta, Sessão, Atendimento..."
                  value={servico}
                  onChange={(e) => setServico(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor">Valor (R$)</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lembrete">Canal de Lembrete</Label>
                <Select value={canalLembrete} onValueChange={setCanalLembrete}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp (Premium)</SelectItem>
                    <SelectItem value="ambos">Ambos (Premium)</SelectItem>
                  </SelectContent>
                </Select>
                {profile?.plano === "free" && canalLembrete !== "email" && (
                  <p className="text-sm text-muted-foreground">
                    Lembretes por WhatsApp disponíveis apenas no plano Premium
                  </p>
                )}
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
                <Button type="submit" disabled={loading || clientes.length === 0} className="flex-1">
                  {loading ? "Criando..." : "Criar Agendamento"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
