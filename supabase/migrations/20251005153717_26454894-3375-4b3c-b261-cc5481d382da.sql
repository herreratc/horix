-- ====================================================
-- LIMPEZA COMPLETA DO BANCO PARA PRODUÇÃO
-- ====================================================
-- Esta migration remove TODOS OS DADOS mas mantém a estrutura
-- (tabelas, colunas, RLS policies, triggers, funções, etc)

-- Desabilitar triggers temporariamente para evitar problemas
SET session_replication_role = replica;

-- Limpar todas as tabelas na ordem correta
TRUNCATE TABLE public.webhook_events CASCADE;
TRUNCATE TABLE public.log_notificacoes CASCADE;
TRUNCATE TABLE public.lista_espera CASCADE;
TRUNCATE TABLE public.agendamentos CASCADE;
TRUNCATE TABLE public.templates_mensagens CASCADE;
TRUNCATE TABLE public.servicos CASCADE;
TRUNCATE TABLE public.disponibilidade CASCADE;
TRUNCATE TABLE public.clientes CASCADE;
TRUNCATE TABLE public.audit_logs CASCADE;
TRUNCATE TABLE public.profiles CASCADE;

-- Reabilitar triggers
SET session_replication_role = DEFAULT;

-- Log da limpeza
DO $$
BEGIN
  RAISE NOTICE 'Database cleaned successfully. All data removed, structure preserved.';
  RAISE NOTICE 'System ready for production use.';
END $$;