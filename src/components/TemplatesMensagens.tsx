import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Template {
  id: string;
  nome: string;
  tipo: string;
  mensagem: string;
  ativo: boolean;
}

export const TemplatesMensagens = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("confirmacao");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    loadTemplates();
    createDefaultTemplates();
  }, []);

  const createDefaultTemplates = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Verificar se já existem templates
    const { count } = await supabase
      .from("templates_mensagens")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (count && count > 0) return;

    // Criar templates padrão
    const defaultTemplates = [
      {
        user_id: user.id,
        nome: "Confirmação de Agendamento",
        tipo: "confirmacao",
        mensagem: "Olá {CLIENTE}! 👋\n\n📅 *Confirmação de Agendamento*\n\n{SERVICO}🔹 Data: *{DATA}*\n🔹 Horário: *{HORA}*\n\nSeu agendamento foi confirmado! Te espero no horário marcado.\n\nQualquer dúvida, estou à disposição! 😊",
        ativo: true,
      },
      {
        user_id: user.id,
        nome: "Lembrete 24h Antes",
        tipo: "lembrete",
        mensagem: "Olá {CLIENTE}! 👋\n\n⏰ *Lembrete de Agendamento*\n\nSeu agendamento é amanhã:\n{SERVICO}🔹 Data: *{DATA}*\n🔹 Horário: *{HORA}*\n\nNos vemos em breve! 😊",
        ativo: true,
      },
      {
        user_id: user.id,
        nome: "Cancelamento",
        tipo: "cancelamento",
        mensagem: "Olá {CLIENTE}! 👋\n\n❌ *Agendamento Cancelado*\n\nSeu agendamento do dia *{DATA}* às *{HORA}* foi cancelado.\n\nSe desejar reagendar, entre em contato! 😊",
        ativo: true,
      },
    ];

    await supabase.from("templates_mensagens").insert(defaultTemplates);
  };

  const loadTemplates = async () => {
    const { data, error } = await supabase
      .from("templates_mensagens")
      .select("*")
      .order("tipo")
      .order("nome");

    if (error) {
      toast.error("Erro ao carregar templates");
    } else {
      setTemplates(data || []);
    }
  };

  const handleSave = async () => {
    if (!nome || !mensagem) {
      toast.error("Preencha todos os campos");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const templateData = {
      user_id: user.id,
      nome,
      tipo,
      mensagem,
      ativo: true,
    };

    if (editingTemplate) {
      const { error } = await supabase
        .from("templates_mensagens")
        .update(templateData)
        .eq("id", editingTemplate.id);

      if (error) {
        toast.error("Erro ao atualizar template");
      } else {
        toast.success("Template atualizado!");
        loadTemplates();
        handleClose();
      }
    } else {
      const { error } = await supabase
        .from("templates_mensagens")
        .insert([templateData]);

      if (error) {
        toast.error("Erro ao criar template");
      } else {
        toast.success("Template criado!");
        loadTemplates();
        handleClose();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este template?")) return;

    const { error } = await supabase
      .from("templates_mensagens")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erro ao excluir template");
    } else {
      toast.success("Template excluído!");
      loadTemplates();
    }
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setNome(template.nome);
    setTipo(template.tipo);
    setMensagem(template.mensagem);
    setShowDialog(true);
  };

  const handleClose = () => {
    setShowDialog(false);
    setEditingTemplate(null);
    setNome("");
    setTipo("confirmacao");
    setMensagem("");
  };

  const getTipoBadge = (tipo: string) => {
    const colors: Record<string, string> = {
      confirmacao: "bg-green-500/20 text-green-500",
      lembrete: "bg-blue-500/20 text-blue-500",
      cancelamento: "bg-red-500/20 text-red-500",
      personalizado: "bg-purple-500/20 text-purple-500",
    };
    return colors[tipo] || "bg-gray-500/20 text-gray-500";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Templates de Mensagens</h2>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Template
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{template.nome}</CardTitle>
              <Badge className={getTipoBadge(template.tipo)}>{template.tipo}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">
                {template.mensagem}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(template)}>
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(template.id)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Editar Template" : "Novo Template"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Template</Label>
              <Input
                placeholder="Ex: Confirmação de Agendamento"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmacao">Confirmação</SelectItem>
                  <SelectItem value="lembrete">Lembrete</SelectItem>
                  <SelectItem value="cancelamento">Cancelamento</SelectItem>
                  <SelectItem value="personalizado">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Mensagem</Label>
              <Textarea
                placeholder="Digite a mensagem... Use {CLIENTE}, {DATA}, {HORA}, {SERVICO}"
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                rows={8}
              />
              <p className="text-xs text-muted-foreground">
                Variáveis disponíveis: {"{CLIENTE}"}, {"{DATA}"}, {"{HORA}"}, {"{SERVICO}"}
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>Salvar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};