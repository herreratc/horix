import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Privacidade() {
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
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl">Política de Privacidade</CardTitle>
                <p className="text-muted-foreground">Última atualização: 05 de outubro de 2025</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Esta política está em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)
            </p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <h2>1. Informações que Coletamos</h2>
            
            <h3>1.1 Dados de Cadastro</h3>
            <ul>
              <li>Nome e email (obrigatório para criar conta)</li>
              <li>Profissão (para personalização)</li>
              <li>WhatsApp (opcional, para lembretes)</li>
            </ul>

            <h3>1.2 Dados dos Seus Clientes</h3>
            <ul>
              <li>Nome do cliente</li>
              <li>Email e telefone do cliente</li>
              <li>Histórico de agendamentos</li>
              <li>Dados sensíveis que você optar por armazenar (CPF, endereço, data de nascimento)</li>
            </ul>

            <h3>1.3 Dados de Uso</h3>
            <ul>
              <li>Logs de acesso e ações na plataforma</li>
              <li>Endereço IP</li>
              <li>Informações do navegador</li>
              <li>Dados de pagamento (processados pelo Mercado Pago)</li>
            </ul>

            <h2>2. Como Usamos Seus Dados</h2>
            <ul>
              <li>Fornecer e manter o serviço de agendamentos</li>
              <li>Processar pagamentos (através do Mercado Pago)</li>
              <li>Enviar lembretes de agendamentos (com seu consentimento)</li>
              <li>Melhorar e personalizar sua experiência</li>
              <li>Comunicar atualizações importantes do serviço</li>
              <li>Prevenir fraudes e abusos</li>
              <li>Cumprir obrigações legais</li>
            </ul>

            <h2>3. Base Legal (LGPD)</h2>
            <p>Processamos seus dados com base em:</p>
            <ul>
              <li><strong>Execução de contrato:</strong> Para fornecer o serviço que você contratou</li>
              <li><strong>Consentimento:</strong> Para envio de lembretes via WhatsApp</li>
              <li><strong>Legítimo interesse:</strong> Para melhorias do serviço e segurança</li>
              <li><strong>Obrigação legal:</strong> Para cumprimento de leis fiscais e tributárias</li>
            </ul>

            <h2>4. Compartilhamento de Dados</h2>
            <p>Seus dados podem ser compartilhados com:</p>
            <ul>
              <li><strong>Mercado Pago:</strong> Para processamento de pagamentos</li>
              <li><strong>Supabase:</strong> Provedor de infraestrutura (armazenamento seguro)</li>
              <li><strong>Autoridades:</strong> Quando exigido por lei</li>
            </ul>
            <p><strong>NÃO</strong> vendemos ou compartilhamos seus dados com terceiros para fins de marketing.</p>

            <h2>5. Segurança dos Dados</h2>
            <p>Implementamos medidas de segurança técnicas e organizacionais:</p>
            <ul>
              <li>Criptografia de dados em trânsito (HTTPS/TLS)</li>
              <li>Criptografia de dados em repouso</li>
              <li>Autenticação segura</li>
              <li>Row Level Security (RLS) no banco de dados</li>
              <li>Logs de auditoria para ações sensíveis</li>
              <li>Backups regulares</li>
            </ul>

            <h2>6. Seus Direitos (LGPD)</h2>
            <p>Você tem direito a:</p>
            <ul>
              <li><strong>Confirmação:</strong> Saber se processamos seus dados</li>
              <li><strong>Acesso:</strong> Obter cópia dos seus dados</li>
              <li><strong>Correção:</strong> Corrigir dados incompletos ou desatualizados</li>
              <li><strong>Eliminação:</strong> Solicitar exclusão dos dados</li>
              <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
              <li><strong>Revogação:</strong> Retirar consentimento a qualquer momento</li>
              <li><strong>Oposição:</strong> Opor-se ao tratamento dos dados</li>
            </ul>

            <h2>7. Retenção de Dados</h2>
            <ul>
              <li>Dados de cadastro: Enquanto sua conta estiver ativa</li>
              <li>Dados de clientes: Enquanto sua conta estiver ativa</li>
              <li>Dados de pagamento: 5 anos (obrigação fiscal)</li>
              <li>Logs de segurança: 6 meses</li>
            </ul>
            <p>Após o cancelamento da conta, seus dados serão excluídos em até 30 dias, exceto aqueles que devemos manter por obrigação legal.</p>

            <h2>8. Cookies e Rastreamento</h2>
            <p>Usamos cookies essenciais para:</p>
            <ul>
              <li>Manter você logado</li>
              <li>Salvar suas preferências</li>
              <li>Garantir a segurança da sessão</li>
            </ul>
            <p>Não usamos cookies de rastreamento ou publicidade de terceiros.</p>

            <h2>9. Transferência Internacional</h2>
            <p>
              Seus dados são armazenados em servidores na nuvem que podem estar localizados fora do
              Brasil. Garantimos que todos os provedores respeitam padrões adequados de proteção de
              dados.
            </p>

            <h2>10. Menores de Idade</h2>
            <p>
              Nosso serviço não é destinado a menores de 18 anos. Não coletamos intencionalmente
              dados de menores. Se você é pai/mãe e descobrir que seu filho forneceu dados, entre em
              contato conosco.
            </p>

            <h2>11. Alterações nesta Política</h2>
            <p>
              Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças
              significativas por email ou através de aviso na plataforma.
            </p>

            <h2>12. Encarregado de Dados (DPO)</h2>
            <p>
              Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento de dados, entre em
              contato com nosso Encarregado de Dados através do email de suporte disponível na
              plataforma.
            </p>

            <h2>13. Contato</h2>
            <p>
              Para questões sobre esta política de privacidade ou para exercer seus direitos LGPD,
              entre em contato através das configurações da plataforma.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
