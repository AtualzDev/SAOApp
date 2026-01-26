-- ============================================================================
-- ROLLBACK PLAN: Reverter Migrations
-- ============================================================================
-- Descrição: Script para reverter as migrations em caso de problemas
-- Autor: Sistema SAO
-- Data: 2026-01-25
-- Versão: 1.0
-- ============================================================================

-- ⚠️ USE ESTE SCRIPT APENAS SE ALGO DEU ERRADO!
-- ⚠️ Faça backup antes de executar qualquer rollback!

-- ============================================================================
-- CENÁRIO 1: Reverter MIGRATION 03 (Foreign Keys)
-- ============================================================================

-- Se você executou migration_03 e precisa reverter:

/*
BEGIN;

-- Remover Foreign Keys
ALTER TABLE categorias DROP CONSTRAINT IF EXISTS fk_categorias_setor;
ALTER TABLE produtos DROP CONSTRAINT IF EXISTS fk_produtos_categoria;
ALTER TABLE produtos DROP CONSTRAINT IF EXISTS fk_produtos_setor;
ALTER TABLE lancamentos_itens DROP CONSTRAINT IF EXISTS fk_lancamentos_itens_setor;
ALTER TABLE lancamentos_itens DROP CONSTRAINT IF EXISTS fk_lancamentos_itens_categoria;

-- Remover Índices
DROP INDEX IF EXISTS idx_categorias_setor_id;
DROP INDEX IF EXISTS idx_produtos_categoria_id;
DROP INDEX IF EXISTS idx_produtos_setor_id;
DROP INDEX IF EXISTS idx_lancamentos_itens_setor_id;
DROP INDEX IF EXISTS idx_lancamentos_itens_categoria_id;

COMMIT;

SELECT 'ROLLBACK 03 CONCLUÍDO: Foreign Keys e índices removidos' as status;
*/

-- ============================================================================
-- CENÁRIO 2: Reverter MIGRATION 02 (Migração de Dados)
-- ============================================================================

-- Se você executou migration_02 e precisa reverter:

/*
BEGIN;

-- Limpar dados migrados
UPDATE categorias SET setor_id = NULL;
UPDATE produtos SET categoria_id = NULL, setor_id = NULL;
UPDATE lancamentos_itens SET setor_id = NULL, categoria_id = NULL;

COMMIT;

SELECT 'ROLLBACK 02 CONCLUÍDO: Dados migrados foram limpos' as status;
*/

-- ============================================================================
-- CENÁRIO 3: Reverter MIGRATION 01 (Colunas UUID)
-- ============================================================================

-- Se você executou migration_01 e precisa reverter:

/*
BEGIN;

-- Remover colunas UUID
ALTER TABLE categorias DROP COLUMN IF EXISTS setor_id;
ALTER TABLE produtos DROP COLUMN IF EXISTS categoria_id, DROP COLUMN IF EXISTS setor_id;
ALTER TABLE lancamentos_itens DROP COLUMN IF EXISTS setor_id, DROP COLUMN IF EXISTS categoria_id;

COMMIT;

SELECT 'ROLLBACK 01 CONCLUÍDO: Colunas UUID removidas' as status;
*/

-- ============================================================================
-- CENÁRIO 4: Rollback Completo (Todas as Migrations)
-- ============================================================================

-- Para reverter TUDO de uma vez:

/*
BEGIN;

-- 1. Remover Foreign Keys
ALTER TABLE categorias DROP CONSTRAINT IF EXISTS fk_categorias_setor;
ALTER TABLE produtos DROP CONSTRAINT IF EXISTS fk_produtos_categoria;
ALTER TABLE produtos DROP CONSTRAINT IF EXISTS fk_produtos_setor;
ALTER TABLE lancamentos_itens DROP CONSTRAINT IF EXISTS fk_lancamentos_itens_setor;
ALTER TABLE lancamentos_itens DROP CONSTRAINT IF EXISTS fk_lancamentos_itens_categoria;

-- 2. Remover Índices
DROP INDEX IF EXISTS idx_categorias_setor_id;
DROP INDEX IF EXISTS idx_produtos_categoria_id;
DROP INDEX IF EXISTS idx_produtos_setor_id;
DROP INDEX IF EXISTS idx_lancamentos_itens_setor_id;
DROP INDEX IF EXISTS idx_lancamentos_itens_categoria_id;

-- 3. Remover colunas UUID
ALTER TABLE categorias DROP COLUMN IF EXISTS setor_id;
ALTER TABLE produtos DROP COLUMN IF EXISTS categoria_id, DROP COLUMN IF EXISTS setor_id;
ALTER TABLE lancamentos_itens DROP COLUMN IF EXISTS setor_id, DROP COLUMN IF EXISTS categoria_id;

COMMIT;

SELECT 
    'ROLLBACK COMPLETO CONCLUÍDO' as status,
    'Todas as migrations foram revertidas' as mensagem,
    'Banco de dados voltou ao estado anterior' as resultado;
*/

-- ============================================================================
-- CENÁRIO 5: Restaurar do Backup
-- ============================================================================

-- Se o rollback via SQL não for suficiente:

-- 1. Acesse o Supabase Dashboard
-- 2. Vá em Settings → Database → Backups
-- 3. Selecione o backup anterior às migrations
-- 4. Clique em "Restore"
-- 5. Aguarde a restauração completar

-- ⚠️ ATENÇÃO: Restaurar do backup irá PERDER TODOS OS DADOS
-- criados após o backup!

-- ============================================================================
-- VERIFICAÇÃO PÓS-ROLLBACK
-- ============================================================================

-- Após executar o rollback, verifique o estado do banco:

/*
-- Verificar se colunas UUID foram removidas
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name IN ('categorias', 'produtos', 'lancamentos_itens')
AND column_name LIKE '%_id'
AND column_name IN ('setor_id', 'categoria_id')
ORDER BY table_name, column_name;

-- Resultado esperado: Nenhuma linha retornada

-- Verificar se Foreign Keys foram removidas
SELECT 
    constraint_name,
    table_name
FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY'
AND table_name IN ('categorias', 'produtos', 'lancamentos_itens')
AND constraint_name LIKE 'fk_%'
ORDER BY table_name, constraint_name;

-- Resultado esperado: Nenhuma linha retornada (ou apenas FKs antigas)

-- Verificar se índices foram removidos
SELECT 
    indexname,
    tablename
FROM pg_indexes
WHERE tablename IN ('categorias', 'produtos', 'lancamentos_itens')
AND indexname LIKE 'idx_%_id'
ORDER BY tablename, indexname;

-- Resultado esperado: Nenhuma linha retornada
*/

-- ============================================================================
-- OBSERVAÇÕES IMPORTANTES
-- ============================================================================

-- 1. Sempre faça backup antes de qualquer operação
-- 2. Teste o rollback em ambiente de desenvolvimento primeiro
-- 3. Documente o motivo do rollback
-- 4. Investigue a causa do problema antes de tentar novamente
-- 5. Comunique a equipe sobre o rollback

-- ============================================================================
-- PRÓXIMOS PASSOS APÓS ROLLBACK
-- ============================================================================

-- 1. Identificar o que causou o problema
-- 2. Corrigir o problema (dados inválidos, código, etc.)
-- 3. Testar a solução em ambiente de desenvolvimento
-- 4. Executar as migrations novamente
-- 5. Monitorar de perto durante a nova tentativa
