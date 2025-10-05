import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, CheckCircle, Sparkles, User, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { format, addDays, startOfDay, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import logo from "@/assets/logo.png";

const agendamentoPublicoSchema = z.object({
  nomeCliente: z.string().trim().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  emailCliente: z.string().trim().email("Email inválido").max(255, "Email muito longo"),
  whatsappCliente: z.string().trim().regex(/^[\d\s\(\)\-\+]*$/, "WhatsApp contém caracteres inválidos").min(10, "WhatsApp deve ter pelo menos 10 dígitos").max(20, "WhatsApp muito longo"),
});

interface Profile {
  profissao: string;
  horario_inicio: string;
  horario_fim: string;
}

interface HorarioDisponivel {
  data: string;
  horarios: string[];
}

export default function AgendamentoPublico() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<HorarioDisponivel[]>([]);
  
  // Form state
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [horaSelecionada, setHoraSelecionada] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    if (!userId) {
      toast.error("Link inválido");
      return;
    }

    setLoading(true);

    // Load professional profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("profissao, horario_inicio, horario_fim")
      .eq("id", userId)
      .single();

    if (profileError || !profileData) {
      toast.error("Profissional não encontrado");
      setLoading(false);
      return;
    }

    setProfile(profileData);

    // Load available times for next 7 days
    const proximos7Dias: HorarioDisponivel[] = [];
    const hoje = startOfDay(new Date());

    for (let i = 0; i < 7; i++) {
      const dia = addDays(hoje, i);
      const dataStr = format(dia, "yyyy-MM-dd");

      // Get existing appointments for this day
      const { data: agendamentos } = await supabase
        .from("agendamentos")
        .select("hora")
        .eq("user_id", userId)
        .eq("data", dataStr)
        .neq("status", "cancelado");

      const horariosOcupados = agendamentos?.map(a => a.hora) || [];
      
      // Generate available times
      const horarios = gerarHorarios(
        profileData.horario_inicio,
        profileData.horario_fim,
        horariosOcupados
      );

      if (horarios.length > 0) {
        proximos7Dias.push({ data: dataStr, horarios });
      }
    }

    setHorariosDisponiveis(proximos7Dias);
    setLoading(false);
  };

  const gerarHorarios = (inicio: string, fim: string, ocupados: string[]): string[] => {
    const horarios: string[] = [];
    const [inicioHora, inicioMin] = inicio.split(":").map(Number);
    const [fimHora, fimMin] = fim.split(":").map(Number);

    let hora = inicioHora;
    let minuto = inicioMin;

    while (hora < fimHora || (hora === fimHora && minuto < fimMin)) {
      const horarioStr = `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`;
      
      if (!ocupados.includes(horarioStr)) {
        horarios.push(horarioStr);
      }

      minuto += 60; // 1 hour intervals
      if (minuto >= 60) {
        hora += Math.floor(minuto / 60);
        minuto = minuto % 60;
      }
    }

    return horarios;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dataSelecionada || !horaSelecionada) {
      toast.error("Selecione uma data e horário");
      return;
    }

    // Validate input
    try {
      agendamentoPublicoSchema.parse({
        nomeCliente: nome,
        emailCliente: email,
        whatsappCliente: whatsapp,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    setSubmitting(true);

    try {
      if (!userId) {
        throw new Error("Link inválido");
      }

      // Create client
      const { data: clienteData, error: clienteError } = await supabase
        .from("clientes")
        .insert([{
          user_id: userId,
          nome,
          email: email || null,
          whatsapp: whatsapp || null,
        }])
        .select()
        .single();

      if (clienteError) throw clienteError;

      // Create appointment
      const { error: agendError } = await supabase
        .from("agendamentos")
        .insert([{
          user_id: userId,
          cliente_id: clienteData.id,
          data: dataSelecionada,
          hora: horaSelecionada,
          duracao: 60,
          status: "agendado",
          canal_lembrete: "email"
        }]);

      if (agendError) throw agendError;

      setSuccess(true);
      toast.success("Agendamento realizado com sucesso!");
    } catch (error: any) {
      const errorMessage = error?.message?.includes("duplicate") 
        ? "Já existe um agendamento para este horário"
        : "Erro ao criar agendamento. Tente novamente.";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Profissional não encontrado</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-2xl w-full space-y-6 animate-scale-in">
          {/* Logo Header */}
          <div className="text-center">
            <img src={logo} alt="HOrix" className="h-16 mx-auto mb-4" />
          </div>

          <Card className="border-2 border-primary/20 shadow-2xl overflow-hidden">
            {/* Success Banner */}
            <div className="bg-gradient-primary p-8 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm mb-4 animate-scale-in">
                <CheckCircle className="h-14 w-14 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Agendamento Confirmado!</h2>
              <div className="flex items-center justify-center gap-2 text-white/90">
                <Sparkles className="h-5 w-5" />
                <span className="text-lg">Tudo certo para o seu atendimento</span>
              </div>
            </div>

            <CardContent className="p-8 space-y-6">
              {/* Appointment Details */}
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-6 space-y-4 border border-primary/10">
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Data do Agendamento
                  </p>
                  <p className="text-2xl font-bold text-foreground capitalize">
                    {format(new Date(dataSelecionada), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Clock className="h-6 w-6 text-primary" />
                    <p className="text-3xl font-bold text-primary">{horaSelecionada}</p>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Próximos Passos
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>Você receberá um lembrete antes do horário marcado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>Em caso de imprevistos, entre em contato com antecedência</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>Aguarde a confirmação por email ou WhatsApp</span>
                  </li>
                </ul>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t text-center">
                <p className="text-sm text-muted-foreground">
                  Obrigado por agendar com <span className="font-bold text-primary">HOrix</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Powered by HOrix */}
          <p className="text-center text-sm text-muted-foreground">
            Powered by <span className="font-bold text-primary">HOrix</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        {/* Header with Logo */}
        <div className="text-center space-y-4">
          <img src={logo} alt="HOrix" className="h-20 mx-auto animate-scale-in" />
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Agende seu <span className="text-primary">Horário</span>
            </h1>
            <p className="text-lg text-muted-foreground">{profile.profissao}</p>
          </div>
        </div>

        {/* Decorative Line */}
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-primary/30" />
          <Sparkles className="h-5 w-5 text-primary" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-primary/30 to-primary/30" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <Card className="border-2 border-border hover:border-primary/30 transition-colors shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-md">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Suas Informações</CardTitle>
                  <CardDescription>Como podemos te identificar?</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="nome" className="flex items-center gap-2 text-base font-medium">
                  <User className="h-4 w-4 text-primary" />
                  Nome Completo *
                </Label>
                <Input
                  id="nome"
                  placeholder="Digite seu nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="h-12 text-base"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-base font-medium">
                    <Mail className="h-4 w-4 text-primary" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="flex items-center gap-2 text-base font-medium">
                    <Phone className="h-4 w-4 text-primary" />
                    WhatsApp
                  </Label>
                  <Input
                    id="whatsapp"
                    placeholder="(11) 99999-9999"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date & Time Selection */}
          <Card className="border-2 border-border hover:border-primary/30 transition-colors shadow-lg">
            <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-accent flex items-center justify-center shadow-md">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Escolha Data e Horário</CardTitle>
                  <CardDescription>Selecione o melhor horário para você</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {horariosDisponiveis.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-lg">
                    Não há horários disponíveis no momento
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Entre em contato para mais informações
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {horariosDisponiveis.map((dia) => (
                    <div key={dia.data} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
                        <h4 className="font-semibold text-lg capitalize px-3 py-1.5 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full border border-primary/20">
                          {format(new Date(dia.data), "EEEE, d 'de' MMMM", { locale: ptBR })}
                        </h4>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {dia.horarios.map((hora) => {
                          const isSelected = dataSelecionada === dia.data && horaSelecionada === hora;
                          return (
                            <Button
                              key={hora}
                              type="button"
                              variant={isSelected ? "default" : "outline"}
                              onClick={() => {
                                setDataSelecionada(dia.data);
                                setHoraSelecionada(hora);
                              }}
                              className={`h-14 gap-2 font-semibold text-base transition-all ${
                                isSelected 
                                  ? "scale-105 shadow-lg" 
                                  : "hover:scale-105 hover:border-primary/50"
                              }`}
                            >
                              <Clock className="h-4 w-4" />
                              {hora}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-lg font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] bg-gradient-primary"
              disabled={submitting || !dataSelecionada || !horaSelecionada}
            >
              {submitting ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Agendando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Confirmar Agendamento
                </>
              )}
            </Button>

            {dataSelecionada && horaSelecionada && (
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 border border-primary/20 animate-scale-in">
                <p className="text-sm text-center text-muted-foreground">
                  <span className="font-semibold text-foreground">Horário selecionado:</span>{" "}
                  {format(new Date(dataSelecionada), "dd/MM/yyyy", { locale: ptBR })} às {horaSelecionada}
                </p>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="text-center pt-8 space-y-2">
          <p className="text-sm text-muted-foreground">
            Powered by <span className="font-bold text-primary">HOrix</span>
          </p>
        </div>
      </div>
    </div>
  );
}
