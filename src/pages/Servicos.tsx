import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Clock, DollarSign } from "lucide-react";
import { toast } from "sonner";

export default function Servicos() {
  const navigate = useNavigate();
  const [servicos, setServicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingServico, setEditingServico] = useState<any>(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    duracao: "60",
    valor: ""
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    loadServicos();
  };

  const loadServicos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("servicos")
      .select("*")
      .eq("ativo", true)
      .order("nome");

    if (error) {
      toast.error("Erro ao carregar serviços");
      console.error(error);
    } else {
      setServicos(data || []);
    }
    setLoading(false);
  };

  const openDialog = (servico?: any) => {
    if (servico) {
      setEditingServico(servico);
      setFormData({
        nome: servico.nome,
        descricao: servico.descricao || "",
        duracao: servico.duracao.toString(),
        valor: servico.valor || ""
      });
    } else {
      setEditingServico(null);
      setFormData({
        nome: "",
        descricao: "",
        duracao: "60",
        valor: ""
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.nome) {
      toast.error("Nome do serviço é obrigatório");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const servicoData = {
      nome: formData.nome,
      descricao: formData.descricao || null,
      duracao: parseInt(formData.duracao),
      valor: formData.valor ? parseFloat(formData.valor) : null,
      user_id: user.id
    };

    let error;
    if (editingServico) {
      ({ error } = await supabase
        .from("servicos")
        .update(servicoData)
        .eq("id", editingServico.id));
    } else {
      ({ error } = await supabase
        .from("servicos")
        .insert([servicoData]));
    }

    if (error) {
      toast.error("Erro ao salvar serviço");
      console.error(error);
    } else {
      toast.success(editingServico ? "Serviço atualizado!" : "Serviço criado!");
      setDialogOpen(false);
      loadServicos();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir este serviço?")) return;

    const { error } = await supabase
      .from("servicos")
      .update({ ativo: false })
      .eq("id", id);

    if (error) {
      toast.error("Erro ao excluir serviço");
      console.error(error);
    } else {
      toast.success("Serviço excluído!");
      loadServicos();
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Serviços</h1>
              <p className="text-muted-foreground">Gerencie os serviços oferecidos</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Voltar
              </Button>
              <Button onClick={() => openDialog()} className="gap-2 bg-gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4" />
                Novo Serviço
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : servicos.length === 0 ? (
            <Card className="border-2 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground mb-4">Nenhum serviço cadastrado</p>
                <Button onClick={() => openDialog()} className="bg-gradient-primary hover:opacity-90">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Serviço
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {servicos.map((servico) => (
                <Card key={servico.id} className="border-2 border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-xl group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{servico.nome}</CardTitle>
                        {servico.descricao && (
                          <CardDescription className="mt-2">{servico.descricao}</CardDescription>
                        )}
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openDialog(servico)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(servico.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{servico.duracao} minutos</span>
                      </div>
                      {servico.valor && (
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-accent" />
                          <span className="font-semibold text-accent">
                            R$ {parseFloat(servico.valor).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingServico ? "Editar Serviço" : "Novo Serviço"}</DialogTitle>
                <DialogDescription>
                  {editingServico ? "Atualize as informações do serviço" : "Adicione um novo serviço ao seu catálogo"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Corte de Cabelo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Detalhes sobre o serviço"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duracao">Duração (min) *</Label>
                    <Input
                      id="duracao"
                      type="number"
                      value={formData.duracao}
                      onChange={(e) => setFormData({ ...formData, duracao: e.target.value })}
                      placeholder="60"
                      min="15"
                      step="15"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="valor">Valor (R$)</Label>
                    <Input
                      id="valor"
                      type="number"
                      value={formData.valor}
                      onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit} className="bg-gradient-primary hover:opacity-90">
                  {editingServico ? "Atualizar" : "Criar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
