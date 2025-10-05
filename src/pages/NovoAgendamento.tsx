import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Repeat } from "lucide-react";
import { toast } from "sonner";
import PaywallModal from "@/components/PaywallModal";
import { RecorrenciaDialog } from "@/components/RecorrenciaDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { addDays, addWeeks, addMonths, isBefore } from "date-fns";
import { sanitizeForWhatsApp, formatBrazilianPhone, agendamentoSchema } from "@/lib/validation";

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
  const [showRecorrencia, setShowRecorrencia] = useState(false);

  const [clienteId, setClienteId] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [duracao, setDuracao] = useState("60");
  const [servico, setServico] = useState("");
  const [valor, setValor] = useState("");
  const [canalLembrete, setCanalLembrete] = useState("email");
  const [isRecorrente, setIsRecorrente] = useState(false);
  const [frequenciaRecorrencia, setFrequenciaRecorrencia] = useState("");
  const [dataFimRecorrencia, setDataFimRecorrencia] = useState<Date>();

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

  const criarAgendamentosRecorrentes = async (
    agendamentoBase: any,
    frequencia: string,
    dataFim: Date,
    agendamentoPaiId: string
  ) => {
    const agendamentosRecorrentes = [];
    let dataAtual = new Date(data);
    
    while (isBefore(dataAtual, dataFim)) {
      if (frequencia === "semanal") {
        dataAtual = addWeeks(dataAtual, 1);
      } else if (frequencia === "quinzenal") {
        dataAtual = addWeeks(dataAtual, 2);
      } else if (frequencia === "mensal") {
        dataAtual = addMonths(dataAtual, 1);
      }
      
      if (isBefore(dataAtual, dataFim)) {
        agendamentosRecorrentes.push({
          ...agendamentoBase,
          data: dataAtual.toISOString().split('T')[0],
          recorrente: true,
          frequencia_recorrencia: frequencia,
          data_fim_recorrencia: dataFim.toISOString().split('T')[0],
          agendamento_pai_id: agendamentoPaiId,
        });
      }
    }
    
    if (agendamentosRecorrentes.length > 0) {
      const { error } = await supabase
        .from("agendamentos")
        .insert(agendamentosRecorrentes);
        
      if (error) throw error;
    }
    
    return agendamentosRecorrentes.length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check limit again before submitting
    if (profile?.plano === "free" && profile.agendamentos_mes >= 30) {
      setShowPaywall(true);
      return;
    }

    // SECURITY: Validate input data
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
        recorrente: isRecorrente,
        frequencia_recorrencia: isRecorrente ? frequenciaRecorrencia : null,
        data_fim_recorrencia: isRecorrente && dataFimRecorrencia ? dataFimRecorrencia.toISOString().split('T')[0] : null,
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

      // Criar agendamentos recorrentes se configurado
      let totalRecorrentes = 0;
      if (isRecorrente && dataFimRecorrencia && novoAgendamento) {
        totalRecorrentes = await criarAgendamentosRecorrentes(
          agendamentoData,
          frequenciaRecorrencia,
          dataFimRecorrencia,
          novoAgendamento.id
        );
      }

      // Update monthly counter
      const totalAgendamentos = 1 + totalRecorrentes;
      if (profile) {
        await supabase
          .from("profiles")
          .update({ agendamentos_mes: profile.agendamentos_mes + 1 })
          .eq("id", user.id);
      }

      toast.success("Agendamento criado com sucesso! ✅");
      
      // Abrir WhatsApp automaticamente se cliente tiver WhatsApp
      if (novoAgendamento?.clientes?.whatsapp) {
        try {
          // SECURITY: Validate and format phone number
          const telefone = formatBrazilianPhone(novoAgendamento.clientes.whatsapp);
          
          const dataFormatada = new Date(data + 'T00:00:00').toLocaleDateString("pt-BR", {
            weekday: 'long',
            day: '2-digit',
            month: 'long'
          });
          
          // SECURITY: Sanitize all user inputs
          const nomeSeguro = sanitizeForWhatsApp(novoAgendamento.clientes.nome);
          const servicoSeguro = servico ? sanitizeForWhatsApp(servico) : '';
          
          const mensagem = `Olá, ${nomeSeguro}! 👋

📅 *Confirmação de Agendamento*

${servicoSeguro ? `🔹 Serviço: *${servicoSeguro}*\n` : ''}🔹 Data: *${dataFormatada}*
🔹 Horário: *${hora}*

Seu agendamento foi confirmado! Te espero no horário marcado.

Qualquer dúvida, estou à disposição! 😊`;
          
          const mensagemEncoded = encodeURIComponent(mensagem);
          
          // Tentar protocolo whatsapp:// primeiro (abre app direto no mobile)
          const deepLink = `whatsapp://send?phone=55${telefone}&text=${mensagemEncoded}`;
          // Fallback para wa.me (funciona em desktop e mobile)
          const webLink = `https://wa.me/55${telefone}?text=${mensagemEncoded}`;
          
          // Detectar se é mobile
          const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
          
          if (isMobile) {
            // No mobile, tenta abrir o app direto
            window.location.href = deepLink;
            toast.success("WhatsApp aberto! Envie a confirmação para o cliente 💬", { 
              duration: 3000 
            });
          } else {
            // No desktop, abre em nova aba
            const whatsappWindow = window.open(webLink, "_blank");
            
            if (!whatsappWindow || whatsappWindow.closed || typeof whatsappWindow.closed === 'undefined') {
              toast.error("Pop-up bloqueado! Clique no botão para abrir o WhatsApp", { 
                duration: 6000,
                action: {
                  label: "Abrir WhatsApp",
                  onClick: () => window.open(webLink, "_blank")
                }
              });
            } else {
              toast.success("WhatsApp Web aberto! Envie a confirmação em 1 clique 💬", { 
                duration: 3000 
              });
            }
          }
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Erro ao abrir WhatsApp");
        }
      } else {
        toast.info("Cliente não tem WhatsApp cadastrado. Adicione nas configurações do cliente.");
      }
      
      // Aguardar 2 segundos antes de navegar para dar tempo do usuário ver as mensagens
      setTimeout(() => {
        navigate("/agenda");
      }, 2000);
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

      <RecorrenciaDialog
        open={showRecorrencia}
        onOpenChange={setShowRecorrencia}
        onConfirm={(freq, dataFim) => {
          setFrequenciaRecorrencia(freq);
          setDataFimRecorrencia(dataFim);
          setIsRecorrente(true);
        }}
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
                    min="0"
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

                <div className="flex items-center space-x-2 pt-4 border-t">
                  <Checkbox
                    id="recorrente"
                    checked={isRecorrente}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setShowRecorrencia(true);
                      } else {
                        setIsRecorrente(false);
                        setFrequenciaRecorrencia("");
                        setDataFimRecorrencia(undefined);
                      }
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <Label htmlFor="recorrente" className="cursor-pointer">
                      Agendamento Recorrente
                    </Label>
                    <Repeat className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                {isRecorrente && frequenciaRecorrencia && (
                  <p className="text-sm text-muted-foreground">
                    📅 {frequenciaRecorrencia.charAt(0).toUpperCase() + frequenciaRecorrencia.slice(1)} até{" "}
                    {dataFimRecorrencia?.toLocaleDateString("pt-BR")}
                  </p>
                )}

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
