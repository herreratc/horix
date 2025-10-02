import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Assinatura() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const pixKey = "suachavepix@email.com";
  const monthlyPrice = "R$ 29,90";

  const copyPixKey = () => {
    navigator.clipboard.writeText(pixKey);
    toast({
      title: "Chave Pix copiada!",
      description: "Cole no seu app de pagamentos",
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Plano Premium</h1>
          <p className="text-xl text-muted-foreground">
            Agendamentos ilimitados e recursos avançados
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Plano Free */}
          <Card>
            <CardHeader>
              <CardTitle>Plano Free</CardTitle>
              <CardDescription>Grátis para sempre</CardDescription>
              <div className="text-3xl font-bold">R$ 0</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <span>30 agendamentos por mês</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <span>Gestão básica de clientes</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <span>Lembretes por email</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Plano Premium */}
          <Card className="border-primary">
            <CardHeader>
              <CardTitle>Plano Premium</CardTitle>
              <CardDescription>Para profissionais</CardDescription>
              <div className="text-3xl font-bold">{monthlyPrice}<span className="text-sm text-muted-foreground">/mês</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <span className="font-medium">Agendamentos ilimitados</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <span>Lembretes por WhatsApp</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <span>Relatórios avançados</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                  <span>Suporte prioritário</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Pagamento Pix */}
        <Card>
          <CardHeader>
            <CardTitle>Pagamento via Pix</CardTitle>
            <CardDescription>
              Faça o pagamento de {monthlyPrice} usando a chave Pix abaixo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
              <code className="flex-1 text-sm">{pixKey}</code>
              <Button size="sm" variant="outline" onClick={copyPixKey}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Instruções:</strong></p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Copie a chave Pix acima</li>
                <li>Abra o app do seu banco</li>
                <li>Escolha a opção Pix</li>
                <li>Cole a chave e faça o pagamento de {monthlyPrice}</li>
                <li>Após o pagamento, entre em contato pelo WhatsApp para ativar sua assinatura</li>
              </ol>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground text-center">
                Dúvidas? Entre em contato pelo WhatsApp: <strong>(11) 99999-9999</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
