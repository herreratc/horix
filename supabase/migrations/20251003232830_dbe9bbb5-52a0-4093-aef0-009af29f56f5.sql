-- Adicionar novos campos à tabela clientes
ALTER TABLE public.clientes 
ADD COLUMN cpf text,
ADD COLUMN endereco text,
ADD COLUMN data_nascimento date;