-- Criar tabela de serviços
CREATE TABLE public.servicos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  duracao INTEGER NOT NULL DEFAULT 60, -- em minutos
  valor NUMERIC,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;

-- RLS Policies para servicos
CREATE POLICY "Usuários podem ver seus próprios serviços"
  ON public.servicos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios serviços"
  ON public.servicos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios serviços"
  ON public.servicos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios serviços"
  ON public.servicos FOR DELETE
  USING (auth.uid() = user_id);

-- Criar tabela de disponibilidade por dia da semana
CREATE TABLE public.disponibilidade (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  dia_semana INTEGER NOT NULL CHECK (dia_semana >= 0 AND dia_semana <= 6), -- 0=Domingo, 1=Segunda, etc
  horario_inicio TIME NOT NULL,
  horario_fim TIME NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, dia_semana)
);

-- Enable RLS
ALTER TABLE public.disponibilidade ENABLE ROW LEVEL SECURITY;

-- RLS Policies para disponibilidade
CREATE POLICY "Usuários podem ver sua própria disponibilidade"
  ON public.disponibilidade FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar sua própria disponibilidade"
  ON public.disponibilidade FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar sua própria disponibilidade"
  ON public.disponibilidade FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar sua própria disponibilidade"
  ON public.disponibilidade FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at em servicos
CREATE TRIGGER update_servicos_updated_at
  BEFORE UPDATE ON public.servicos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para atualizar updated_at em disponibilidade
CREATE TRIGGER update_disponibilidade_updated_at
  BEFORE UPDATE ON public.disponibilidade
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();