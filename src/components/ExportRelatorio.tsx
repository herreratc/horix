import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ExportRelatorioProps {
  data: any[];
  filename: string;
  type: "agendamentos" | "financeiro" | "clientes";
}

export const ExportRelatorio = ({ data, filename, type }: ExportRelatorioProps) => {
  const exportToCSV = () => {
    if (!data || data.length === 0) {
      toast({
        title: "Sem dados",
        description: "Não há dados para exportar",
        variant: "destructive",
      });
      return;
    }

    let headers: string[] = [];
    let rows: string[][] = [];

    if (type === "agendamentos") {
      headers = ["Data", "Hora", "Cliente", "Serviço", "Status", "Valor"];
      rows = data.map((item) => [
        new Date(item.data).toLocaleDateString("pt-BR"),
        item.hora || "",
        item.clientes?.nome || "",
        item.servico || "",
        item.status || "",
        item.valor ? `R$ ${parseFloat(item.valor).toFixed(2)}` : "R$ 0,00",
      ]);
    } else if (type === "financeiro") {
      headers = ["Mês", "Receita", "Agendamentos", "Ticket Médio"];
      rows = data.map((item) => [
        item.mes || "",
        `R$ ${item.receita?.toFixed(2) || "0,00"}`,
        item.agendamentos?.toString() || "0",
        `R$ ${item.ticketMedio?.toFixed(2) || "0,00"}`,
      ]);
    } else if (type === "clientes") {
      headers = ["Nome", "Email", "Telefone", "WhatsApp", "Total Agendamentos"];
      rows = data.map((item) => [
        item.nome || "",
        item.email || "",
        item.telefone || "",
        item.whatsapp || "",
        item.total_agendamentos?.toString() || "0",
      ]);
    }

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();

    toast({
      title: "Exportado!",
      description: "Relatório exportado com sucesso",
    });
  };

  const exportToPDF = () => {
    toast({
      title: "Em breve",
      description: "Exportação para PDF estará disponível em breve",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Excel / CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF} className="cursor-pointer gap-2">
          <FileText className="h-4 w-4" />
          PDF (em breve)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
