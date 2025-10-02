-- Adicionar campo nome na tabela profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nome TEXT;