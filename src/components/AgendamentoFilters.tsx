import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface AgendamentoFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  servicoFilter: string;
  onServicoChange: (value: string) => void;
  servicos: Array<{ id: string; nome: string }>;
}

export const AgendamentoFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  servicoFilter,
  onServicoChange,
  servicos,
}: AgendamentoFiltersProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por cliente..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos os status</SelectItem>
          <SelectItem value="agendado">Agendado</SelectItem>
          <SelectItem value="concluído">Concluído</SelectItem>
          <SelectItem value="cancelado">Cancelado</SelectItem>
        </SelectContent>
      </Select>

      <Select value={servicoFilter} onValueChange={onServicoChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filtrar por serviço" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos os serviços</SelectItem>
          {servicos.map((servico) => (
            <SelectItem key={servico.id} value={servico.id}>
              {servico.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};