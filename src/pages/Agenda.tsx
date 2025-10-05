import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Crown, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isSameMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import LembreteButton from "@/components/LembreteButton";
import LembretesAutomaticos from "@/components/LembretesAutomaticos";
import CancelarAgendamentoButton from "@/components/CancelarAgendamentoButton";
import LembretesHoje from "@/components/LembretesHoje";
import { AgendamentoFilters } from "@/components/AgendamentoFilters";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Agendamento {
  id: string;
  data: string;
  hora: string;
  servico?: string;
  status: string;
  cliente_id: string;
  clientes?: {
    nome: string;
    whatsapp?: string;
  };
}

interface Cliente {
  id: string;
  nome: string;
}

interface Servico {
  id: string;
  nome: string;
}

export default function Agenda() {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [premiumAccess, setPremiumAccess] = useState<any>(null);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [servicoFilter, setServicoFilter] = useState("todos");

  useEffect(() => {
    checkAuth();
    loadData();
    checkPremiumAccess();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    }
  };

  const checkPremiumAccess = async () => {
    try {
      const { data } = await supabase.functions.invoke('check-premium-access');
      setPremiumAccess(data);
    } catch (error) {
      console.error('Error checking premium access:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    
    // Load agendamentos with cliente data
    const { data: agendData, error: agendError } = await supabase
      .from("agendamentos")
      .select(`
        *,
        clientes (
          nome,
          whatsapp
        )
      `)
      .order("data")
      .order("hora");

    if (agendError) {
      toast.error("Erro ao carregar agendamentos");
    } else {
      setAgendamentos(agendData || []);
    }

    // Load clientes
    const { data: clientData, error: clientError } = await supabase
      .from("clientes")
      .select("id, nome");

    if (clientError) {
      toast.error("Erro ao carregar clientes");
    } else {
      setClientes(clientData || []);
    }

    // Load servicos
    const { data: servicoData, error: servicoError } = await supabase
      .from("servicos")
      .select("id, nome");

    if (servicoError) {
      toast.error("Erro ao carregar serviços");
    } else {
      setServicos(servicoData || []);
    }

    setLoading(false);
  };

  const getClienteName = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nome || "Cliente não encontrado";
  };

  const getAgendamentosForDate = (date: Date) => {
    let filtered = agendamentos.filter(a => isSameDay(new Date(a.data), date));
    
    // Aplicar filtros
    if (searchTerm) {
      filtered = filtered.filter(a => 
        a.clientes?.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "todos") {
      filtered = filtered.filter(a => a.status === statusFilter);
    }
    
    if (servicoFilter !== "todos") {
      filtered = filtered.filter(a => a.servico === servicos.find(s => s.id === servicoFilter)?.nome);
    }
    
    return filtered;
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const selectedDateAgendamentos = selectedDate ? getAgendamentosForDate(selectedDate) : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Agenda</h1>
              <p className="text-muted-foreground">Visualize e gerencie seus agendamentos</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {premiumAccess && !premiumAccess.hasPremiumAccess && premiumAccess.agendamentosUsados >= premiumAccess.limite * 0.8 && (
              <Button 
                variant="outline" 
                onClick={() => navigate("/assinatura")}
                className="gap-2 border-primary/50 text-primary hover:bg-primary/10"
              >
                <Crown className="h-4 w-4" />
                Upgrade Premium
              </Button>
            )}
            <LembretesAutomaticos agendamentos={agendamentos} />
            <Button onClick={() => navigate("/novo-agendamento")} className="gap-2 bg-gradient-primary">
              <Plus className="h-4 w-4" />
              Novo Agendamento
            </Button>
          </div>
        </div>

        {/* Premium CTA */}
        {premiumAccess && !premiumAccess.hasPremiumAccess && (
          <Alert className="border-primary/50 bg-gradient-to-r from-primary/10 to-accent/10">
            <Sparkles className="h-4 w-4 text-primary" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                {premiumAccess.isInTrial 
                  ? `Trial Premium - ${premiumAccess.trialDaysLeft} dias restantes` 
                  : `${premiumAccess.agendamentosUsados}/${premiumAccess.limite} agendamentos usados este mês`
                }
              </span>
              <Button 
                size="sm"
                onClick={() => navigate("/assinatura")}
                className="ml-4"
              >
                {premiumAccess.isInTrial ? 'Assinar Agora' : 'Upgrade para Ilimitado'}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Lembretes Pendentes */}
        <LembretesHoje />

        {/* Filtros */}
        <AgendamentoFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          servicoFilter={servicoFilter}
          onServicoChange={setServicoFilter}
          servicos={servicos}
        />

        <div className="grid md:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold capitalize text-foreground">
                  {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentMonth(new Date())}
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map(day => {
                  const dayAgendamentos = getAgendamentosForDate(day);
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isToday = isSameDay(day, new Date());

                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => setSelectedDate(day)}
                      className={`
                        min-h-[80px] p-2 rounded-lg border-2 transition-all text-left
                        ${isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}
                        ${!isCurrentMonth ? "opacity-40" : ""}
                        ${isToday ? "ring-2 ring-accent" : ""}
                      `}
                    >
                      <div className="font-medium text-sm mb-1 text-foreground">{format(day, "d")}</div>
                      {dayAgendamentos.length > 0 && (
                        <div className="space-y-1">
                          {dayAgendamentos.slice(0, 2).map(agend => (
                            <div
                              key={agend.id}
                              className={`text-xs px-1 py-0.5 rounded truncate ${
                                agend.status === "confirmado"
                                  ? "bg-accent/20 text-accent"
                                  : agend.status === "cancelado"
                                  ? "bg-destructive/20 text-destructive"
                                  : "bg-primary/20 text-primary"
                              }`}
                            >
                              {agend.hora}
                            </div>
                          ))}
                          {dayAgendamentos.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{dayAgendamentos.length - 2} mais
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Day Details */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4 text-foreground">
                {selectedDate
                  ? format(selectedDate, "d 'de' MMMM", { locale: ptBR })
                  : "Selecione um dia"}
              </h3>

              {selectedDate && selectedDateAgendamentos.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhum agendamento para este dia
                </p>
              )}

              <div className="space-y-3">
                {selectedDateAgendamentos.map(agend => (
                  <div
                    key={agend.id}
                    className="p-3 border rounded-lg hover:border-primary/50 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{agend.hora}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          agend.status === "confirmado"
                            ? "bg-accent/20 text-accent"
                            : agend.status === "cancelado"
                            ? "bg-destructive/20 text-destructive"
                            : "bg-primary/20 text-primary"
                        }`}
                      >
                        {agend.status}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground">{getClienteName(agend.cliente_id)}</p>
                    {agend.servico && (
                      <p className="text-xs text-muted-foreground">{agend.servico}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/editar-agendamento/${agend.id}`)}
                      >
                        Editar
                      </Button>
                      {agend.status !== "cancelado" && agend.clientes && (
                        <>
                          <LembreteButton
                            clienteNome={agend.clientes.nome}
                            clienteWhatsapp={agend.clientes.whatsapp}
                            data={agend.data}
                            hora={agend.hora}
                            servico={agend.servico}
                          />
                          <CancelarAgendamentoButton
                            agendamentoId={agend.id}
                            clienteNome={agend.clientes.nome}
                            data={agend.data}
                            hora={agend.hora}
                            onCanceled={loadData}
                          />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
