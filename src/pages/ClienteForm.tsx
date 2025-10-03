import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const clienteSchema = z.object({
  nome: z.string().trim().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  email: z.string().trim().email("Email inválido").max(255, "Email muito longo").optional().or(z.literal("")),
  telefone: z.string().trim().regex(/^[\d\s\(\)\-\+]*$/, "Telefone contém caracteres inválidos").max(20, "Telefone muito longo").optional().or(z.literal("")),
  whatsapp: z.string().trim().regex(/^[\d\s\(\)\-\+]*$/, "WhatsApp contém caracteres inválidos").max(20, "WhatsApp muito longo").optional().or(z.literal("")),
  cpf: z.string().trim().regex(/^[\d\.\-]*$/, "CPF contém caracteres inválidos").max(14, "CPF inválido").optional().or(z.literal("")),
  dataNascimento: z.string().optional().or(z.literal("")),
  endereco: z.string().trim().max(500, "Endereço muito longo").optional().or(z.literal("")),
  notas: z.string().trim().max(1000, "Notas muito longas").optional().or(z.literal("")),
});

export default function ClienteForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [notas, setNotas] = useState("");

  useEffect(() => {
    checkAuth();
    if (isEdit) {
      loadCliente();
    }
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    }
  };

  const loadCliente = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      toast.error("Erro ao carregar cliente");
      navigate("/clientes");
    } else if (data) {
      setNome(data.nome);
      setEmail(data.email || "");
      setTelefone(data.telefone || "");
      setWhatsapp(data.whatsapp || "");
      setCpf(data.cpf || "");
      setEndereco(data.endereco || "");
      setDataNascimento(data.data_nascimento || "");
      setNotas(data.notas || "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    try {
      clienteSchema.parse({
        nome,
        email: email || "",
        telefone: telefone || "",
        whatsapp: whatsapp || "",
        cpf: cpf || "",
        dataNascimento: dataNascimento || "",
        endereco: endereco || "",
        notas: notas || "",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }
    
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const clienteData = {
        nome,
        email: email || null,
        telefone: telefone || null,
        whatsapp: whatsapp || null,
        cpf: cpf || null,
        endereco: endereco || null,
        data_nascimento: dataNascimento || null,
        notas: notas || null,
        user_id: user.id,
      };

      if (isEdit) {
        const { error } = await supabase
          .from("clientes")
          .update(clienteData)
          .eq("id", id);

        if (error) throw error;
        toast.success("Cliente atualizado com sucesso");
      } else {
        const { error } = await supabase
          .from("clientes")
          .insert([clienteData]);

        if (error) throw error;
        toast.success("Cliente cadastrado com sucesso");
      }

      navigate("/clientes");
    } catch (error: any) {
      const errorMessage = error?.message?.includes("duplicate") 
        ? "Já existe um cliente com esses dados"
        : "Erro ao salvar cliente. Tente novamente.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/clientes")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEdit ? "Editar Cliente" : "Novo Cliente"}
            </h1>
            <p className="text-muted-foreground">
              {isEdit ? "Atualize os dados do cliente" : "Cadastre um novo cliente"}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados do Cliente</CardTitle>
            <CardDescription>
              Preencha as informações do cliente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  placeholder="Nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="cliente@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    placeholder="(11) 9999-9999"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  placeholder="Rua, número, bairro, cidade - UF"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notas">Notas</Label>
                <Textarea
                  id="notas"
                  placeholder="Observações sobre o cliente..."
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/clientes")}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Salvando..." : isEdit ? "Atualizar" : "Cadastrar"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
