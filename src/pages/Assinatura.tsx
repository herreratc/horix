import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, ArrowLeft, CheckCircle2, QrCode, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function Assinatura() {
  const navigate = useNavigate();
  const pixKey = "agendainteligente@pix.com";
  const monthlyPrice = "R$ 29,00";

  const copyPixKey = () => {
    navigator.clipboard.writeText(pixKey);
    toast.success("Chave Pix copiada!");
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
      
      <div className="max-w-5xl mx-auto space-y-8">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Button>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Upgrade para Premium</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Desbloqueie todo o potencial da sua agenda com recursos avançados
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-2xl">Plano Free</CardTitle>
              <CardDescription>Perfeito para começar</CardDescription>
              <div className="mt-6">
                <span className="text-4xl font-bold">R$ 0</span>
                <span className="text-muted-foreground text-lg">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">30 agendamentos/mês</p>
                  <p className="text-sm text-muted-foreground">Limite mensal</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Gerenciamento básico</p>
                  <p className="text-sm text-muted-foreground">Clientes e agenda</p>
                </div>
              </div>
              <div className="flex items-start gap-3 opacity-50">
                <div className="h-5 w-5 rounded-full border-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Sem lembretes automáticos</p>
                  <p className="text-sm text-muted-foreground">Não disponível</p>
                </div>
              </div>
              <div className="flex items-start gap-3 opacity-50">
                <div className="h-5 w-5 rounded-full border-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Relatórios limitados</p>
                  <p className="text-sm text-muted-foreground">Apenas básicos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="border-2 border-primary relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-medium">
              Mais Popular
            </div>
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl flex items-center gap-2">
                Plano Premium
                <Sparkles className="h-5 w-5 text-primary" />
              </CardTitle>
              <CardDescription>Para profissionais sérios</CardDescription>
              <div className="mt-6">
                <span className="text-4xl font-bold text-primary">{monthlyPrice}</span>
                <span className="text-muted-foreground text-lg">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Agendamentos ilimitados</p>
                  <p className="text-sm text-muted-foreground">Sem limite mensal</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Lembretes WhatsApp</p>
                  <p className="text-sm text-muted-foreground">Automáticos e personalizados</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Relatórios avançados</p>
                  <p className="text-sm text-muted-foreground">Insights detalhados</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Suporte prioritário</p>
                  <p className="text-sm text-muted-foreground">Atendimento exclusivo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Section */}
        <Card className="border-2 border-primary shadow-lg">
          <CardHeader className="border-b bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <QrCode className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Pagamento via Pix</CardTitle>
                <CardDescription className="text-base">
                  Rápido, seguro e prático
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Pix Info */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-6 rounded-xl space-y-4 border border-primary/20">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Chave Pix</p>
                <div className="flex items-center gap-3">
                  <code className="flex-1 bg-background px-4 py-3 rounded-lg font-mono text-sm border">
                    {pixKey}
                  </code>
                  <Button size="lg" variant="default" onClick={copyPixKey} className="gap-2">
                    <Copy className="h-4 w-4" />
                    Copiar
                  </Button>
                </div>
              </div>
              <div className="pt-4 border-t border-border/50">
                <p className="text-sm font-medium text-muted-foreground mb-2">Valor da Assinatura</p>
                <p className="text-3xl font-bold text-primary">{monthlyPrice}</p>
                <p className="text-sm text-muted-foreground mt-1">Pagamento mensal recorrente</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <span className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm">
                  1
                </span>
                Como ativar seu plano Premium
              </h3>
              <ol className="space-y-3 ml-10">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                    1
                  </span>
                  <span className="text-sm pt-0.5">Copie a chave Pix usando o botão acima</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                    2
                  </span>
                  <span className="text-sm pt-0.5">Abra o aplicativo do seu banco</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                    3
                  </span>
                  <span className="text-sm pt-0.5">Faça um Pix no valor de <strong>{monthlyPrice}</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                    4
                  </span>
                  <span className="text-sm pt-0.5">Tire uma captura de tela do comprovante</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                    5
                  </span>
                  <span className="text-sm pt-0.5">
                    Envie o comprovante para nosso WhatsApp: <strong className="text-primary">(11) 99999-9999</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                    6
                  </span>
                  <span className="text-sm pt-0.5">Aguarde a confirmação em até 24 horas</span>
                </li>
              </ol>
            </div>

            {/* Info boxes */}
            <div className="grid md:grid-cols-2 gap-4 pt-4">
              <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm mb-1">Ativação Rápida</p>
                    <p className="text-xs text-muted-foreground">
                      Seu plano Premium será ativado em até 24 horas após a confirmação do pagamento
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm mb-1">Suporte Dedicado</p>
                    <p className="text-xs text-muted-foreground">
                      Dúvidas? Entre em contato pelo WhatsApp para suporte prioritário
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
