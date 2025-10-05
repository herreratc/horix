import { ArrowLeft, Calendar, Users, Briefcase, Settings, CheckCircle2, Link2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Manual() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Manual de Uso</h1>
            <p className="text-muted-foreground text-lg">Aprenda a usar todas as funcionalidades do Horix</p>
          </div>
        </div>

        {/* Welcome Card */}
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-accent/10">
          <CardHeader>
            <CardTitle className="text-2xl">Bem-vindo ao Horix! 🎉</CardTitle>
            <CardDescription className="text-base">
              Este guia vai te ajudar a aproveitar ao máximo o sistema de agendamentos. 
              Siga os passos abaixo para começar a organizar seus atendimentos de forma profissional.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Quick Start Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              Primeiros Passos
            </CardTitle>
            <CardDescription>Configure seu sistema em 3 passos simples</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-2">
                <CardContent className="pt-6 space-y-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto">
                    <Settings className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-center">1. Configure seu Perfil</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Acesse Configurações e defina seu nome, profissão e horários de atendimento
                  </p>
                  <Button onClick={() => navigate("/configuracoes")} className="w-full" variant="outline">
                    Ir para Configurações
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-6 space-y-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-accent flex items-center justify-center mx-auto">
                    <Briefcase className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-center">2. Crie seus Serviços</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Cadastre os serviços que você oferece com valores e duração
                  </p>
                  <Button onClick={() => navigate("/servicos")} className="w-full" variant="outline">
                    Gerenciar Serviços
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-6 space-y-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto">
                    <Calendar className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-center">3. Comece a Agendar</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Crie seu primeiro agendamento e organize sua agenda
                  </p>
                  <Button onClick={() => navigate("/novo-agendamento")} className="w-full" variant="outline">
                    Novo Agendamento
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Guia Completo de Funcionalidades</CardTitle>
            <CardDescription>Explore cada recurso em detalhes</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {/* Agendamentos */}
              <AccordionItem value="agendamentos">
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    Como Criar Agendamentos
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-base">Passo a passo:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                      <li>Clique em "Novo Agendamento" no dashboard ou no menu lateral</li>
                      <li>Selecione ou cadastre um cliente</li>
                      <li>Escolha o serviço que será realizado</li>
                      <li>Defina a data e horário do atendimento</li>
                      <li>Adicione observações se necessário</li>
                      <li>Clique em "Criar Agendamento"</li>
                    </ol>
                    
                    <div className="bg-accent/10 p-4 rounded-lg border border-accent/30 mt-4">
                      <p className="font-semibold text-sm flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Dica:
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Os horários disponíveis são baseados na sua configuração de horário de trabalho.
                        Ajuste seus horários em Configurações.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Clientes */}
              <AccordionItem value="clientes">
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-accent" />
                    Gerenciar Clientes
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-base">Cadastrando um cliente:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                      <li>Acesse o menu "Clientes"</li>
                      <li>Clique em "Adicionar Cliente"</li>
                      <li>Preencha o nome (obrigatório)</li>
                      <li>Adicione informações de contato: email, telefone, WhatsApp</li>
                      <li>Campos opcionais: CPF, endereço, data de nascimento</li>
                      <li>Use o campo "Notas" para observações importantes</li>
                      <li>Clique em "Cadastrar"</li>
                    </ol>
                    
                    <div className="bg-primary/10 p-4 rounded-lg border border-primary/30 mt-4">
                      <p className="font-semibold text-sm">Recursos:</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 space-y-1">
                        <li>Edite informações a qualquer momento</li>
                        <li>Visualize o histórico de agendamentos de cada cliente</li>
                        <li>Todos os dados ficam salvos com segurança</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Serviços */}
              <AccordionItem value="servicos">
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-accent" />
                    Cadastrar Serviços
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-base">Como criar um serviço:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                      <li>Vá em "Serviços" no menu lateral</li>
                      <li>Clique no card "Adicionar Novo Serviço"</li>
                      <li>Digite o nome do serviço (ex: Corte de Cabelo, Consulta)</li>
                      <li>Defina a duração em minutos (ex: 60 minutos)</li>
                      <li>Adicione o valor do serviço (opcional)</li>
                      <li>Escreva uma descrição se desejar</li>
                      <li>Clique em "Salvar"</li>
                    </ol>
                    
                    <div className="bg-accent/10 p-4 rounded-lg border border-accent/30 mt-4">
                      <p className="font-semibold text-sm">Exemplos de serviços:</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 space-y-1">
                        <li>Salões: Corte, Coloração, Manicure, Pedicure</li>
                        <li>Saúde: Consulta, Avaliação, Tratamento</li>
                        <li>Estética: Limpeza de pele, Massagem, Depilação</li>
                        <li>Outros: Aula, Atendimento, Sessão</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Configurações */}
              <AccordionItem value="configuracoes">
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-primary" />
                    Configurações do Sistema
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-base">Configurações importantes:</h4>
                    
                    <div className="space-y-3">
                      <div className="border-l-4 border-primary pl-4">
                        <p className="font-semibold">Dados do Profissional</p>
                        <p className="text-sm text-muted-foreground">
                          Configure seu nome e profissão. Essas informações aparecem no link público de agendamento.
                        </p>
                      </div>

                      <div className="border-l-4 border-accent pl-4">
                        <p className="font-semibold">Horário de Trabalho</p>
                        <p className="text-sm text-muted-foreground">
                          Defina seu horário de início e fim. O sistema só permite agendamentos dentro desse período.
                          Exemplo: 09:00 às 18:00
                        </p>
                      </div>

                      <div className="border-l-4 border-green-500 pl-4">
                        <p className="font-semibold">WhatsApp para Contato</p>
                        <p className="text-sm text-muted-foreground">
                          Adicione seu número para facilitar o contato com clientes.
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Link Público */}
              <AccordionItem value="link-publico">
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center gap-3">
                    <Link2 className="h-5 w-5 text-accent" />
                    Link Público de Agendamento
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-3">
                    <p className="text-muted-foreground">
                      No Dashboard, você encontra seu link personalizado de agendamento. 
                      Este link permite que seus clientes agendem horários diretamente, sem precisar de cadastro.
                    </p>
                    
                    <h4 className="font-semibold text-base">Como usar:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                      <li>Copie o link clicando no botão "Copiar" no Dashboard</li>
                      <li>Compartilhe nas suas redes sociais (Instagram, Facebook, WhatsApp)</li>
                      <li>Adicione no seu site ou blog</li>
                      <li>Envie diretamente para clientes via mensagem</li>
                    </ol>

                    <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-4 rounded-lg border-2 border-primary/30 mt-4">
                      <p className="font-semibold text-sm flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Vantagens:
                      </p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 space-y-1">
                        <li>Clientes podem agendar 24/7</li>
                        <li>Só mostra horários disponíveis</li>
                        <li>Cadastro automático de novos clientes</li>
                        <li>Reduz mensagens e ligações</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Support Card */}
        <Card className="border-2 border-accent/30">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <h3 className="text-xl font-bold">Precisa de Ajuda?</h3>
              <p className="text-muted-foreground">
                Se tiver dúvidas ou precisar de suporte, entre em contato conosco.
              </p>
              <Button className="bg-gradient-primary hover:opacity-90">
                Falar com Suporte
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}