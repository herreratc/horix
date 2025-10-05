import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Crown, Calendar, CreditCard, AlertCircle, ArrowLeft, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PremiumBadge } from "@/components/PremiumBadge";
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

export default function GerenciarAssinatura() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [premiumAccess, setPremiumAccess] = useState<any>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Check premium access
      const { data: accessData, error: accessError } = await supabase.functions.invoke(
        'check-premium-access'
      );

      if (accessError) throw accessError;
      setPremiumAccess(accessData);

    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    navigate("/assinatura");
  };

  const handleCancelSubscription = async () => {
    setCanceling(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update subscription status to cancelled
      const { error } = await supabase
        .from("profiles")
        .update({
          subscription_status: 'cancelled',
          plano: 'free'
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Assinatura cancelada",
        description: "Sua assinatura foi cancelada com sucesso. Você ainda terá acesso até o final do período pago.",
      });

      // Reload data
      await loadProfileData();
      setShowCancelDialog(false);
    } catch (error) {
      console.error("Error canceling subscription:", error);
      toast({
        title: "Erro ao cancelar",
        description: "Não foi possível cancelar a assinatura. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setCanceling(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const isTrialActive = premiumAccess?.isInTrial && premiumAccess?.trialDaysLeft > 0;
  const isPremiumActive = profile?.plano === 'premium' && profile?.subscription_status === 'active';

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Gerenciar Assinatura</h1>
            <p className="text-muted-foreground">Gerencie seu plano e assinatura</p>
          </div>
        </div>

        {/* Status do Plano */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Plano Atual</h2>
                <PremiumBadge 
                  plano={profile?.plano} 
                  isInTrial={isTrialActive}
                  trialDaysLeft={premiumAccess?.trialDaysLeft}
                />
              </div>
            </div>
            {!isPremiumActive && (
              <Button onClick={handleUpgrade} className="gap-2">
                <Crown className="w-4 h-4" />
                Assinar Premium
              </Button>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Agendamentos Este Mês</p>
              <p className="text-2xl font-bold">
                {premiumAccess?.agendamentosUsados || 0}
                <span className="text-sm text-muted-foreground font-normal">
                  {" "}/ {premiumAccess?.limite === 999999 ? "∞" : premiumAccess?.limite}
                </span>
              </p>
            </div>

            {isTrialActive && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Trial Termina Em</p>
                <p className="text-2xl font-bold">{premiumAccess?.trialDaysLeft} dias</p>
              </div>
            )}

            {isPremiumActive && profile?.subscription_current_period_end && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Próximo Pagamento</p>
                <p className="text-lg font-semibold">
                  {formatDate(profile.subscription_current_period_end)}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Trial Alert */}
        {isTrialActive && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Você está no período de teste gratuito de 14 dias. Aproveite todos os recursos premium! 
              Após o término, você terá acesso a {premiumAccess?.limite} agendamentos por mês no plano gratuito.
            </AlertDescription>
          </Alert>
        )}

        {/* Detalhes da Assinatura */}
        {isPremiumActive && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Detalhes da Assinatura
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={profile.subscription_status === 'active' ? 'default' : 'secondary'}>
                  {profile.subscription_status === 'active' ? 'Ativa' : 'Inativa'}
                </Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Valor Mensal</span>
                <span className="font-semibold">R$ 29,90</span>
              </div>
              {profile.subscription_current_period_end && (
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Próxima Renovação</span>
                  <span className="font-semibold">
                    {formatDate(profile.subscription_current_period_end)}
                  </span>
                </div>
              )}
              {profile.subscription_id && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">ID da Assinatura</span>
                  <span className="text-xs font-mono">{profile.subscription_id.slice(0, 12)}...</span>
                </div>
              )}
            </div>

            {isPremiumActive && (
              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:bg-destructive/10 gap-2"
                  onClick={() => setShowCancelDialog(true)}
                >
                  <XCircle className="w-4 h-4" />
                  Cancelar Assinatura
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* Benefícios */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {isPremiumActive || isTrialActive ? 'Seus Benefícios Premium' : 'Benefícios do Plano Premium'}
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <span>Agendamentos ilimitados</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <span>Lembretes automáticos via WhatsApp</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <span>Relatórios avançados e analytics</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <span>Suporte prioritário</span>
            </li>
          </ul>
        </Card>

        {/* Cancel Dialog */}
        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancelar Assinatura Premium?</AlertDialogTitle>
              <AlertDialogDescription>
                Você perderá acesso aos seguintes recursos:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Agendamentos ilimitados</li>
                  <li>Lembretes automáticos via WhatsApp</li>
                  <li>Relatórios avançados</li>
                  <li>Suporte prioritário</li>
                </ul>
                <p className="mt-4 font-semibold">
                  Você ainda terá acesso até {formatDate(profile?.subscription_current_period_end)}
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Manter Premium</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancelSubscription}
                disabled={canceling}
                className="bg-destructive hover:bg-destructive/90"
              >
                {canceling ? "Cancelando..." : "Sim, Cancelar"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
