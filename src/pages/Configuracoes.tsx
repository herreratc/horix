import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, LogOut, Calendar } from "lucide-react";
import { toast } from "sonner";

const DIAS_SEMANA = [
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
];

interface Disponibilidade {
  dia_semana: number;
  horario_inicio: string;
  horario_fim: string;
  ativo: boolean;
}

export default function Configuracoes() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [profissao, setProfissao] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [disponibilidades, setDisponibilidades] = useState<Record<number, Disponibilidade>>({
    1: { dia_semana: 1, horario_inicio: "09:00", horario_fim: "18:00", ativo: true },
    2: { dia_semana: 2, horario_inicio: "09:00", horario_fim: "18:00", ativo: true },
    3: { dia_semana: 3, horario_inicio: "09:00", horario_fim: "18:00", ativo: true },
    4: { dia_semana: 4, horario_inicio: "09:00", horario_fim: "18:00", ativo: true },
    5: { dia_semana: 5, horario_inicio: "09:00", horario_fim: "18:00", ativo: true },
    6: { dia_semana: 6, horario_inicio: "09:00", horario_fim: "13:00", ativo: false },
    0: { dia_semana: 0, horario_inicio: "09:00", horario_fim: "13:00", ativo: false },
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    setUser(user);

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profile) {
      setProfissao(profile.profissao);
      setWhatsapp(profile.whatsapp || "");
    }

    // Carregar disponibilidades
    const { data: dispData } = await supabase
      .from("disponibilidade")
      .select("*")
      .eq("user_id", user.id);

    if (dispData && dispData.length > 0) {
      const dispMap: Record<number, Disponibilidade> = { ...disponibilidades };
      dispData.forEach((disp) => {
        dispMap[disp.dia_semana] = {
          dia_semana: disp.dia_semana,
          horario_inicio: disp.horario_inicio,
          horario_fim: disp.horario_fim,
          ativo: disp.ativo
        };
      });
      setDisponibilidades(dispMap);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Atualizar perfil
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          profissao,
          whatsapp: whatsapp || null,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Atualizar disponibilidades
      for (const disp of Object.values(disponibilidades)) {
        const { error } = await supabase
          .from("disponibilidade")
          .upsert({
            user_id: user.id,
            dia_semana: disp.dia_semana,
            horario_inicio: disp.horario_inicio,
            horario_fim: disp.horario_fim,
            ativo: disp.ativo
          }, {
            onConflict: 'user_id,dia_semana'
          });

        if (error) throw error;
      }

      toast.success("Configurações salvas com sucesso");
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar configurações");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const updateDisponibilidade = (dia: number, field: string, value: any) => {
    setDisponibilidades({
      ...disponibilidades,
      [dia]: {
        ...disponibilidades[dia],
        [field]: value
      }
    });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Configurações</h1>
              <p className="text-muted-foreground">Gerencie suas preferências</p>
            </div>
          </div>

          {/* Account Info */}
          <Card className="border-2 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Conta</CardTitle>
              <CardDescription>Informações da sua conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user?.email || ""} disabled />
                <p className="text-xs text-muted-foreground">
                  O email não pode ser alterado
                </p>
              </div>

              <Button variant="destructive" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sair da Conta
              </Button>
            </CardContent>
          </Card>

          {/* Profile Settings */}
          <Card className="border-2 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Perfil Profissional</CardTitle>
              <CardDescription>Atualize suas informações profissionais</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="profissao">Profissão *</Label>
                  <Input
                    id="profissao"
                    placeholder="Ex: Psicólogo, Advogado, Personal..."
                    value={profissao}
                    onChange={(e) => setProfissao(e.target.value)}
                    required
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
                  <p className="text-xs text-muted-foreground">
                    Usado para enviar lembretes (Premium)
                  </p>
                </div>

                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/servicos")}
                    className="w-full gap-2 border-2 hover:border-primary/50"
                  >
                    <Calendar className="h-4 w-4" />
                    Gerenciar Serviços
                  </Button>
                </div>

                <Button type="submit" disabled={loading} className="w-full gap-2 bg-gradient-primary hover:opacity-90">
                  <Save className="h-4 w-4" />
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Disponibilidade */}
          <Card className="border-2 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Horários de Atendimento</CardTitle>
              <CardDescription>Configure sua disponibilidade por dia da semana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DIAS_SEMANA.map((dia) => (
                  <div key={dia.value} className="flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                    <div className="flex items-center space-x-3 min-w-[150px]">
                      <Switch
                        checked={disponibilidades[dia.value]?.ativo}
                        onCheckedChange={(checked) => updateDisponibilidade(dia.value, 'ativo', checked)}
                      />
                      <Label className="cursor-pointer">{dia.label}</Label>
                    </div>
                    
                    {disponibilidades[dia.value]?.ativo && (
                      <div className="flex gap-3 flex-1">
                        <div className="flex-1">
                          <Input
                            type="time"
                            value={disponibilidades[dia.value]?.horario_inicio}
                            onChange={(e) => updateDisponibilidade(dia.value, 'horario_inicio', e.target.value)}
                            className="bg-background/50"
                          />
                        </div>
                        <span className="self-center text-muted-foreground">até</span>
                        <div className="flex-1">
                          <Input
                            type="time"
                            value={disponibilidades[dia.value]?.horario_fim}
                            onChange={(e) => updateDisponibilidade(dia.value, 'horario_fim', e.target.value)}
                            className="bg-background/50"
                          />
                        </div>
                      </div>
                    )}
                    
                    {!disponibilidades[dia.value]?.ativo && (
                      <span className="text-muted-foreground text-sm flex-1">Indisponível</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Plan Info */}
          <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-primary/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Plano Atual</CardTitle>
              <CardDescription>Gerencie sua assinatura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Plano Free</p>
                  <p className="text-sm text-muted-foreground">
                    Limite de 30 agendamentos por mês
                  </p>
                </div>
                <Button onClick={() => navigate("/assinatura")} className="bg-gradient-primary hover:opacity-90">
                  Fazer Upgrade
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
