import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import PaywallModal from "@/components/PaywallModal";

interface Cliente {
  id: string;
  nome: string;
}

export default function NovoAgendamento() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [showPaywall, setShowPaywall] = useState(false);

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

    // Check if user has reached limit - show paywall instead of redirect
    if (profileData?.plano === "free" && profileData.agendamentos_mes >= 30) {
      setShowPaywall(true);
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
    
    // Check limit again before submitting
    if (profile?.plano === "free" && profile.agendamentos_mes >= 30) {
      setShowPaywall(true);
      return;
    }
    
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

      const { data: novoAgendamento, error } = await supabase
        .from("agendamentos")
        .insert([agendamentoData])
        .select(`
          *,
          clientes (
            nome,
            whatsapp
          )
        `)
        .single();

      if (error) throw error;

      // Update monthly counter
      if (profile) {
        await supabase
          .from("profiles")
          .update({ agendamentos_mes: profile.agendamentos_mes + 1 })
          .eq("id", user.id);
      }

      toast.success("Agendamento criado com sucesso");
      
      // Abrir WhatsApp automaticamente se cliente tiver WhatsApp
      if (novoAgendamento?.clientes?.whatsapp) {
        const telefone = novoAgendamento.clientes.whatsapp.replace(/\D/g, "");
        const dataFormatada = new Date(data + 'T00:00:00').toLocaleDateString("pt-BR", {
          weekday: 'long',
          day: '2-digit',
          month: 'long'
        });
        
        const mensagem = `Olá, ${novoAgendamento.clientes.nome}! 👋

📅 *Confirmação de Agendamento*

${servico ? `🔹 Serviço: *${servico}*\n` : ''}🔹 Data: *${dataFormatada}*
🔹 Horário: *${hora}*

Seu agendamento foi confirmado! Te espero no horário marcado.

Qualquer dúvida, estou à disposição! 😊`;
        
        const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, "_blank");
        
        toast.success("WhatsApp aberto! Envie a confirmação 💬", { duration: 4000 });
      }
      
      navigate("/agenda");
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar agendamento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PaywallModal
        open={showPaywall}
        onOpenChange={setShowPaywall}
        agendamentosUsados={profile?.agendamentos_mes || 0}
        limite={30}
      />

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
    </>
  );
}
