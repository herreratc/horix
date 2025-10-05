-- Criar tabela de templates de mensagens
CREATE TABLE public.templates_mensagens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL, -- 'confirmacao', 'lembrete', 'cancelamento', 'personalizado'
  mensagem TEXT NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de lista de espera
CREATE TABLE public.lista_espera (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  cliente_id UUID NOT NULL,
  data DATE NOT NULL,
  hora_preferencia TIME WITHOUT TIME ZONE,
  servico TEXT,
  observacoes TEXT,
  status TEXT NOT NULL DEFAULT 'aguardando', -- 'aguardando', 'notificado', 'agendado', 'cancelado'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.templates_mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lista_espera ENABLE ROW LEVEL SECURITY;

-- RLS Policies para templates_mensagens
CREATE POLICY "Usuários podem ver seus próprios templates"
ON public.templates_mensagens
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios templates"
ON public.templates_mensagens
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios templates"
ON public.templates_mensagens
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios templates"
ON public.templates_mensagens
FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies para lista_espera
CREATE POLICY "Usuários podem ver sua própria lista de espera"
ON public.lista_espera
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar itens na lista de espera"
ON public.lista_espera
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar sua lista de espera"
ON public.lista_espera
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar da lista de espera"
ON public.lista_espera
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE TRIGGER update_templates_mensagens_updated_at
BEFORE UPDATE ON public.templates_mensagens
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lista_espera_updated_at
BEFORE UPDATE ON public.lista_espera
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir templates padrão (será feito via código quando usuário criar conta)
-- Índices para performance
CREATE INDEX idx_templates_user_id ON public.templates_mensagens(user_id);
CREATE INDEX idx_lista_espera_user_id ON public.lista_espera(user_id);
CREATE INDEX idx_lista_espera_data ON public.lista_espera(data);
CREATE INDEX idx_lista_espera_status ON public.lista_espera(status);