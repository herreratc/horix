import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CheckoutButtonProps {
  planId: string;
  planName: string;
  price: number;
  planType?: 'monthly' | 'yearly';
}

export const CheckoutButton = ({ planId, planName, price, planType = 'monthly' }: CheckoutButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Você precisa estar logado");
        return;
      }

      // Buscar dados do perfil
      const { data: profile } = await supabase
        .from("profiles")
        .select("nome")
        .eq("id", user.id)
        .single();

      // Chamar edge function para criar preferência
      const { data, error } = await supabase.functions.invoke('mercadopago-create-preference', {
        body: {
          title: `Plano ${planName} - Horix`,
          price: price,
          userId: user.id,
          planType: planType
        }
      });

      if (error) {
        console.error("Erro ao criar preferência:", error);
        toast.error("Erro ao processar pagamento");
        return;
      }

      // Track Google Ads conversion
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'conversion', {
          'send_to': 'AW-17627024311/inicio_checkout',
          'value': price,
          'currency': 'BRL',
          'transaction_id': data.preferenceId
        });
      }

      if (data?.init_point) {
        // Redirecionar para o checkout do Mercado Pago
        window.location.href = data.init_point;
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao processar pagamento");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading}
      className="w-full h-12 text-base bg-gradient-primary hover:opacity-90 shadow-lg gap-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Processando...
        </>
      ) : (
        "Assinar Agora"
      )}
    </Button>
  );
};