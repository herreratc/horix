-- ====================================================
-- MELHORIAS DE PERFORMANCE DO BANCO
-- ====================================================

-- 1. CRIAR ÍNDICES para melhorar performance das queries mais comuns
-- Índice para consultas por user_id + data (usado no Dashboard)
CREATE INDEX IF NOT EXISTS idx_agendamentos_user_data 
ON public.agendamentos(user_id, data);

-- Índice para consultas por user_id + status (usado nos filtros)
CREATE INDEX IF NOT EXISTS idx_agendamentos_user_status 
ON public.agendamentos(user_id, status);

-- Índice para consultas por data + hora (ordenação na agenda)
CREATE INDEX IF NOT EXISTS idx_agendamentos_data_hora 
ON public.agendamentos(data, hora);

-- Índice para clientes por user_id (usado em joins)
CREATE INDEX IF NOT EXISTS idx_clientes_user_id 
ON public.clientes(user_id);

-- Índice para clientes por nome (usado em buscas)
CREATE INDEX IF NOT EXISTS idx_clientes_nome 
ON public.clientes(nome text_pattern_ops);

-- Índice para webhook_events por processed status
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed 
ON public.webhook_events(processed, created_at);

-- 2. CRIAR FUNÇÃO para buscar stats do dashboard de forma otimizada
-- Reduz múltiplas queries para apenas 1 chamada
CREATE OR REPLACE FUNCTION public.get_dashboard_stats(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_stats jsonb;
  v_today date;
  v_first_day_month date;
BEGIN
  v_today := CURRENT_DATE;
  v_first_day_month := date_trunc('month', v_today)::date;
  
  SELECT jsonb_build_object(
    'total_agendamentos', (
      SELECT COUNT(*) FROM agendamentos WHERE user_id = p_user_id
    ),
    'total_clientes', (
      SELECT COUNT(*) FROM clientes WHERE user_id = p_user_id
    ),
    'agendamentos_mes', (
      SELECT COUNT(*) FROM agendamentos 
      WHERE user_id = p_user_id AND data >= v_first_day_month
    ),
    'agendamentos_hoje', (
      SELECT COUNT(*) FROM agendamentos 
      WHERE user_id = p_user_id AND data = v_today
    ),
    'taxa_presenca', (
      SELECT CASE 
        WHEN COUNT(*) = 0 THEN 0
        ELSE ROUND((COUNT(*) FILTER (WHERE status IN ('confirmado', 'concluido'))::numeric / COUNT(*) * 100))
      END
      FROM agendamentos WHERE user_id = p_user_id
    ),
    'faturamento_mes', (
      SELECT COALESCE(SUM(valor), 0)
      FROM agendamentos 
      WHERE user_id = p_user_id AND data >= v_first_day_month
    )
  ) INTO v_stats;
  
  RETURN v_stats;
END;
$$;

-- 3. ATUALIZAR estatísticas das tabelas para otimizador de queries
ANALYZE public.agendamentos;
ANALYZE public.clientes;
ANALYZE public.profiles;
ANALYZE public.webhook_events;
ANALYZE public.audit_logs;

-- Log das melhorias
DO $$
BEGIN
  RAISE NOTICE 'Performance improvements applied';
  RAISE NOTICE '✓ Created 6 performance indexes on frequently queried columns';
  RAISE NOTICE '✓ Created get_dashboard_stats() function to reduce query overhead';
  RAISE NOTICE '✓ Updated table statistics for query optimizer';
  RAISE NOTICE '✓ Database performance should be significantly improved';
END $$;