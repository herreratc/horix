-- Adicionar foreign key para clientes na lista_espera
ALTER TABLE public.lista_espera
ADD CONSTRAINT lista_espera_cliente_id_fkey
FOREIGN KEY (cliente_id)
REFERENCES public.clientes(id)
ON DELETE CASCADE;