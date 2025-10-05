-- Adicionar campos para agendamentos recorrentes
ALTER TABLE agendamentos 
ADD COLUMN recorrente boolean DEFAULT false,
ADD COLUMN frequencia_recorrencia text,
ADD COLUMN data_fim_recorrencia date,
ADD COLUMN agendamento_pai_id uuid REFERENCES agendamentos(id) ON DELETE CASCADE;

-- Criar índice para melhor performance em buscas
CREATE INDEX idx_agendamentos_data ON agendamentos(data);
CREATE INDEX idx_agendamentos_status ON agendamentos(status);
CREATE INDEX idx_agendamentos_cliente_id ON agendamentos(cliente_id);
CREATE INDEX idx_clientes_nome ON clientes(nome);
CREATE INDEX idx_servicos_nome ON servicos(nome);