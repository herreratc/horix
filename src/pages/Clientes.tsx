import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Search, Mail, Phone, MessageSquare, Trash2, Edit } from "lucide-react";
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

interface Cliente {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  whatsapp?: string;
  notas?: string;
}

export default function Clientes() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    loadClientes();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    }
  };

  const loadClientes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .order("nome");

    if (error) {
      toast.error("Erro ao carregar clientes");
      console.error(error);
    } else {
      setClientes(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const { error } = await supabase
      .from("clientes")
      .delete()
      .eq("id", deleteId);

    if (error) {
      toast.error("Erro ao deletar cliente");
    } else {
      toast.success("Cliente deletado com sucesso");
      loadClientes();
    }
    setDeleteId(null);
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(search.toLowerCase()) ||
    cliente.email?.toLowerCase().includes(search.toLowerCase()) ||
    cliente.telefone?.includes(search) ||
    cliente.whatsapp?.includes(search)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Clientes</h1>
              <p className="text-muted-foreground">Gerencie sua base de clientes</p>
            </div>
          </div>
          <Button onClick={() => navigate("/clientes/novo")} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Cliente
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email, telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientes.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Com WhatsApp</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {clientes.filter(c => c.whatsapp).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Com Email</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {clientes.filter(c => c.email).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clientes List */}
        {filteredClientes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {search ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
              </p>
              {!search && (
                <Button onClick={() => navigate("/clientes/novo")} className="mt-4">
                  Cadastrar Primeiro Cliente
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredClientes.map((cliente) => (
              <Card key={cliente.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{cliente.nome}</h3>
                        {cliente.notas && (
                          <p className="text-sm text-muted-foreground mt-1">{cliente.notas}</p>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-4">
                        {cliente.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{cliente.email}</span>
                          </div>
                        )}
                        {cliente.telefone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{cliente.telefone}</span>
                          </div>
                        )}
                        {cliente.whatsapp && (
                          <div className="flex items-center gap-2 text-sm">
                            <MessageSquare className="h-4 w-4 text-accent" />
                            <span>{cliente.whatsapp}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDeleteId(cliente.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
