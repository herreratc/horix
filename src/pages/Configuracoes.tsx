import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, LogOut } from "lucide-react";
import { toast } from "sonner";

export default function Configuracoes() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [profissao, setProfissao] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [horarioInicio, setHorarioInicio] = useState("09:00");
  const [horarioFim, setHorarioFim] = useState("18:00");

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
      setHorarioInicio(profile.horario_inicio);
      setHorarioFim(profile.horario_fim);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          profissao,
          whatsapp: whatsapp || null,
          horario_inicio: horarioInicio,
          horario_fim: horarioFim,
        })
        .eq("id", user.id);

      if (error) throw error;
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

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
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
        <Card>
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
        <Card>
          <CardHeader>
            <CardTitle>Perfil Profissional</CardTitle>
            <CardDescription>Atualize suas informações profissionais</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inicio">Horário Início</Label>
                  <Input
                    id="inicio"
                    type="time"
                    value={horarioInicio}
                    onChange={(e) => setHorarioInicio(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fim">Horário Fim</Label>
                  <Input
                    id="fim"
                    type="time"
                    value={horarioFim}
                    onChange={(e) => setHorarioFim(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full gap-2">
                <Save className="h-4 w-4" />
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Plan Info */}
        <Card>
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
              <Button onClick={() => navigate("/assinatura")}>
                Fazer Upgrade
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
