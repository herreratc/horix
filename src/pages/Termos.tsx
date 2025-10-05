import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Termos() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Termos de Uso</CardTitle>
            <p className="text-muted-foreground">Última atualização: 05 de outubro de 2025</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <h2>1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar o Horix, você concorda em cumprir estes Termos de Uso. Se você não
              concordar com qualquer parte destes termos, não utilize nosso serviço.
            </p>

            <h2>2. Descrição do Serviço</h2>
            <p>
              O Horix é uma plataforma de gestão de agendamentos que permite aos profissionais
              organizar sua agenda, gerenciar clientes e enviar lembretes automáticos.
            </p>

            <h2>3. Conta de Usuário</h2>
            <p>
              Para usar o Horix, você deve criar uma conta fornecendo informações precisas e
              completas. Você é responsável por manter a confidencialidade de sua conta e senha.
            </p>

            <h2>4. Planos e Pagamentos</h2>
            <ul>
              <li><strong>Plano Free:</strong> 30 agendamentos por mês, recursos básicos</li>
              <li><strong>Plano Premium:</strong> R$ 29,90/mês, agendamentos ilimitados e recursos avançados</li>
              <li><strong>Trial:</strong> 14 dias grátis para novos usuários testarem o Premium</li>
              <li>Os pagamentos são processados via Mercado Pago</li>
              <li>Você pode cancelar sua assinatura a qualquer momento</li>
            </ul>

            <h2>5. Uso Aceitável</h2>
            <p>Você concorda em NÃO:</p>
            <ul>
              <li>Usar o serviço para fins ilegais ou não autorizados</li>
              <li>Tentar acessar contas de outros usuários</li>
              <li>Enviar spam ou conteúdo malicioso</li>
              <li>Fazer engenharia reversa do software</li>
              <li>Sobrecarregar nossa infraestrutura</li>
            </ul>

            <h2>6. Propriedade Intelectual</h2>
            <p>
              O Horix e todo seu conteúdo, recursos e funcionalidades são propriedade exclusiva da
              empresa e protegidos por leis de direitos autorais.
            </p>

            <h2>7. Dados do Usuário</h2>
            <p>
              Você mantém todos os direitos sobre seus dados. Nós armazenamos seus dados de forma
              segura e não os compartilhamos com terceiros, exceto conforme descrito em nossa
              Política de Privacidade.
            </p>

            <h2>8. Cancelamento e Suspensão</h2>
            <p>
              Reservamos o direito de suspender ou encerrar sua conta se você violar estes termos.
              Você pode cancelar sua conta a qualquer momento através das configurações.
            </p>

            <h2>9. Limitação de Responsabilidade</h2>
            <p>
              O Horix é fornecido "como está". Não garantimos que o serviço será ininterrupto ou
              livre de erros. Não nos responsabilizamos por perdas ou danos decorrentes do uso do
              serviço.
            </p>

            <h2>10. Modificações</h2>
            <p>
              Podemos modificar estes termos a qualquer momento. Notificaremos você sobre mudanças
              significativas por email ou através da plataforma.
            </p>

            <h2>11. Lei Aplicável</h2>
            <p>
              Estes termos são regidos pelas leis brasileiras. Qualquer disputa será resolvida nos
              tribunais do Brasil.
            </p>

            <h2>12. Contato</h2>
            <p>
              Para questões sobre estes termos, entre em contato conosco através do email de suporte
              disponível na plataforma.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
