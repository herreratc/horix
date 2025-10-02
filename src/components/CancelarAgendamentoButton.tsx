import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CancelarAgendamentoButtonProps {
  agendamentoId: string;
  clienteNome: string;
  data: string;
  hora: string;
  onCanceled?: () => void;
}

export default function CancelarAgendamentoButton({ 
  agendamentoId, 
  clienteNome,
  data,
  hora,
  onCanceled 
}: CancelarAgendamentoButtonProps) {
  const [cancelando, setCancelando] = useState(false);

  const handleCancelar = async () => {
    setCancelando(true);
    
    try {
      const { error } = await supabase
        .from("agendamentos")
        .update({ status: "cancelado" })
        .eq("id", agendamentoId);

      if (error) throw error;

      toast.success("Agendamento cancelado com sucesso");
      
      if (onCanceled) {
        onCanceled();
      }
    } catch (error: any) {
      toast.error("Erro ao cancelar agendamento");
      console.error(error);
    } finally {
      setCancelando(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <X className="h-4 w-4" />
          Cancelar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancelar Agendamento</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Tem certeza que deseja cancelar este agendamento?</p>
            <div className="bg-muted p-3 rounded-lg mt-3">
              <p className="text-sm font-medium text-foreground">
                <strong>Cliente:</strong> {clienteNome}
              </p>
              <p className="text-sm text-foreground">
                <strong>Data:</strong> {new Date(data + 'T00:00:00').toLocaleDateString("pt-BR")}
              </p>
              <p className="text-sm text-foreground">
                <strong>Horário:</strong> {hora}
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Esta ação não pode ser desfeita. O agendamento será marcado como cancelado.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Voltar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancelar}
            disabled={cancelando}
            className="bg-destructive hover:bg-destructive/90"
          >
            {cancelando ? "Cancelando..." : "Sim, Cancelar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
