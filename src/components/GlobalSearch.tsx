import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search, Calendar, Users, FileText } from "lucide-react";
import { Button } from "./ui/button";

export const GlobalSearch = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any>({
    clientes: [],
    agendamentos: [],
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (search.length < 2) {
      setResults({ clientes: [], agendamentos: [] });
      return;
    }

    const searchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Search clients
      const { data: clientes } = await supabase
        .from("clientes")
        .select("id, nome, email, telefone")
        .eq("user_id", user.id)
        .or(`nome.ilike.%${search}%,email.ilike.%${search}%,telefone.ilike.%${search}%`)
        .limit(5);

      // Search appointments
      const { data: agendamentos } = await supabase
        .from("agendamentos")
        .select(`
          id,
          data,
          hora,
          servico,
          status,
          clientes (nome)
        `)
        .eq("user_id", user.id)
        .or(`servico.ilike.%${search}%`)
        .limit(5);

      setResults({
        clientes: clientes || [],
        agendamentos: agendamentos || [],
      });
    };

    const debounce = setTimeout(searchData, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  const handleSelectClient = (id: string) => {
    setOpen(false);
    navigate(`/clientes/editar/${id}`);
  };

  const handleSelectAppointment = (data: string) => {
    setOpen(false);
    navigate(`/agenda?date=${data}`);
  };

  return (
    <>
      <Button
        variant="outline"
        className="gap-2 text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span className="hidden md:inline">Buscar...</span>
        <kbd className="hidden md:inline pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Buscar clientes, agendamentos..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

          {results.clientes.length > 0 && (
            <CommandGroup heading="Clientes">
              {results.clientes.map((cliente: any) => (
                <CommandItem
                  key={cliente.id}
                  onSelect={() => handleSelectClient(cliente.id)}
                  className="cursor-pointer"
                >
                  <Users className="mr-2 h-4 w-4" />
                  <div>
                    <p className="font-medium">{cliente.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      {cliente.email || cliente.telefone}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {results.agendamentos.length > 0 && (
            <CommandGroup heading="Agendamentos">
              {results.agendamentos.map((agendamento: any) => (
                <CommandItem
                  key={agendamento.id}
                  onSelect={() => handleSelectAppointment(agendamento.data)}
                  className="cursor-pointer"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  <div>
                    <p className="font-medium">
                      {agendamento.clientes?.nome} - {agendamento.servico || "Agendamento"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(agendamento.data).toLocaleDateString("pt-BR")} às{" "}
                      {agendamento.hora}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};
