-- Adicionar política para permitir leitura pública dos perfis
-- Isso é necessário para a página de agendamento público funcionar
CREATE POLICY "Perfis públicos para agendamento"
ON public.profiles
FOR SELECT
TO anon, authenticated
USING (true);