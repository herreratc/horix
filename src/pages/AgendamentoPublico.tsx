import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { format, addDays, startOfDay, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

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
    setSubmitting(true);

    try {
      if (!userId || !dataSelecionada || !horaSelecionada) {
        throw new Error("Por favor, selecione uma data e horário");
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
      toast.error(error.message || "Erro ao criar agendamento");
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <Card className="max-w-md w-full">
          <CardContent className="pt-12 pb-12 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-4">
              <CheckCircle className="h-10 w-10 text-accent" />
            </div>
            <h2 className="text-2xl font-bold">Agendamento Confirmado! 🎉</h2>
            <p className="text-muted-foreground">
              Seu agendamento foi realizado com sucesso.
              Você receberá um lembrete antes da data marcada.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="font-medium">
                {format(new Date(dataSelecionada), "EEEE, d 'de' MMMM", { locale: ptBR })}
              </p>
              <p className="text-lg font-bold text-primary">{horaSelecionada}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 mx-auto">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Agende seu Horário</CardTitle>
            <CardDescription className="text-base">
              {profile.profissao}
            </CardDescription>
          </CardHeader>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle>Suas Informações</CardTitle>
              <CardDescription>Como podemos te identificar?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  placeholder="Seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    placeholder="(11) 99999-9999"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date & Time Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Escolha Data e Horário</CardTitle>
              <CardDescription>Selecione o melhor horário para você</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {horariosDisponiveis.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Não há horários disponíveis no momento
                </p>
              ) : (
                <div className="space-y-4">
                  {horariosDisponiveis.map((dia) => (
                    <div key={dia.data}>
                      <h4 className="font-medium mb-3 capitalize">
                        {format(new Date(dia.data), "EEEE, d 'de' MMMM", { locale: ptBR })}
                      </h4>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                        {dia.horarios.map((hora) => (
                          <Button
                            key={hora}
                            type="button"
                            variant={
                              dataSelecionada === dia.data && horaSelecionada === hora
                                ? "default"
                                : "outline"
                            }
                            onClick={() => {
                              setDataSelecionada(dia.data);
                              setHoraSelecionada(hora);
                            }}
                            className="gap-2"
                          >
                            <Clock className="h-3 w-3" />
                            {hora}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={submitting || !dataSelecionada || !horaSelecionada}
          >
            {submitting ? "Agendando..." : "Confirmar Agendamento"}
          </Button>
        </form>
      </div>
    </div>
  );
}
