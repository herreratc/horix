import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Trash2, Edit2, DollarSign, Clock } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Servicos() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [servicos, setServicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    duracao: 60,
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
    setUser(user);
    loadServicos(user.id);
  };

  const loadServicos = async (userId: string) => {
    const { data, error } = await supabase
      .from("servicos")
      .select("*")
      .eq("user_id", userId)
      .eq("ativo", true)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar serviços");
      return;
    }

    setServicos(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const servicoData = {
      ...formData,
      user_id: user.id,
      valor: formData.valor ? parseFloat(formData.valor) : null
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from("servicos")
          .update(servicoData)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Serviço atualizado com sucesso!");
      } else {
        const { error } = await supabase
          .from("servicos")
          .insert(servicoData);

        if (error) throw error;
        toast.success("Serviço criado com sucesso!");
      }

      resetForm();
      loadServicos(user.id);
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar serviço");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (servico: any) => {
    setFormData({
      nome: servico.nome,
      descricao: servico.descricao || "",
      duracao: servico.duracao,
      valor: servico.valor ? servico.valor.toString() : ""
    });
    setEditingId(servico.id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const { error } = await supabase
      .from("servicos")
      .delete()
      .eq("id", deleteId);

    if (error) {
      toast.error("Erro ao deletar serviço");
      return;
    }

    toast.success("Serviço deletado com sucesso!");
    setDeleteId(null);
    loadServicos(user.id);
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      descricao: "",
      duracao: 60,
      valor: ""
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Serviços</h1>
            <p className="text-muted-foreground">Gerencie os serviços que você oferece</p>
          </div>
          <Button onClick={() => navigate("/dashboard")} variant="outline">
            Voltar
          </Button>
        </div>

        {/* Add/Edit Form */}
        {!showForm ? (
          <Card className="border-2 border-dashed hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => setShowForm(true)}>
            <CardContent className="p-12 text-center">
              <Plus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Adicionar Novo Serviço</h3>
              <p className="text-sm text-muted-foreground">
                Clique para criar um novo serviço
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-primary/30 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>{editingId ? "Editar Serviço" : "Novo Serviço"}</CardTitle>
              <CardDescription>
                Preencha as informações do serviço
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Serviço *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Corte de Cabelo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descreva o serviço..."
                    rows={3}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="duracao">Duração (minutos) *</Label>
                    <Input
                      id="duracao"
                      type="number"
                      value={formData.duracao}
                      onChange={(e) => setFormData({ ...formData, duracao: parseInt(e.target.value) })}
                      min="5"
                      step="5"
                      required
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

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading} className="bg-gradient-primary">
                    {loading ? "Salvando..." : editingId ? "Atualizar" : "Criar Serviço"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Services List */}
        {servicos.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Seus Serviços</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {servicos.map((servico) => (
                <Card key={servico.id} className="border-2 border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{servico.nome}</span>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(servico)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setDeleteId(servico.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardTitle>
                    {servico.descricao && (
                      <CardDescription>{servico.descricao}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{servico.duracao} minutos</span>
                    </div>
                    {servico.valor && (
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>R$ {parseFloat(servico.valor).toFixed(2)}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja deletar este serviço? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive">
                Deletar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
