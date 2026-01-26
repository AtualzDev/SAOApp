-- ============================================================================
-- MIGRATION 04: Limpeza - Remover Colunas Antigas
-- ============================================================================
-- Descrição: Remove colunas TEXT/VARCHAR antigas após migração completa
-- Autor: Sistema SAO
-- Data: 2026-01-25
-- Versão: 1.0
-- ============================================================================

-- ⚠️ ATENÇÃO: SÓ EXECUTE ESTE SCRIPT APÓS:
-- 1. Executar migrations 01, 02 e 03
-- 2. Atualizar TODO o código backend e frontend
-- 3. Testar EXTENSIVAMENTE em ambiente de desenvolvimento
-- 4. Testar em ambiente de staging/homologação
-- 5. Ter certeza ABSOLUTA de que tudo está funcionando

-- ⚠️ ESTA AÇÃO É IRREVERSÍVEL!
-- ⚠️ FAÇA BACKUP COMPLETO DO BANCO ANTES DE EXECUTAR!

-- Descomente as linhas abaixo SOMENTE quando estiver 100% seguro:

/*
BEGIN;

-- ============================================================================
-- VERIFICAÇÃO FINAL ANTES DA LIMPEZA
-- ============================================================================

-- Verificar se todas as novas colunas estão populadas
SELECT 
    'VERIFICAÇÃO ANTES DA LIMPEZA' as etapa,
    (SELECT COUNT(*) FROM categorias WHERE setor IS NOT NULL AND setor_id IS NULL) as categorias_nao_migradas,
    (SELECT COUNT(*) FROM produtos WHERE categoria IS NOT NULL AND categoria_id IS NULL) as produtos_categoria_nao_migrados,
    (SELECT COUNT(*) FROM produtos WHERE setor IS NOT NULL AND setor_id IS NULL) as produtos_setor_nao_migrados,
    (SELECT COUNT(*) FROM lancamentos_itens WHERE setor IS NOT NULL AND setor_id IS NULL) as itens_setor_nao_migrados,
    (SELECT COUNT(*) FROM lancamentos_itens WHERE categoria IS NOT NULL AND categoria_id IS NULL) as itens_categoria_nao_migrados;

-- Se QUALQUER valor acima for > 0, NÃO PROSSIGA!

-- ============================================================================
-- 1. REMOVER COLUNAS ANTIGAS DE CATEGORIAS
-- ============================================================================

ALTER TABLE categorias 
DROP COLUMN IF EXISTS setor CASCADE;

-- ============================================================================
-- 2. REMOVER COLUNAS ANTIGAS DE PRODUTOS
-- ============================================================================

ALTER TABLE produtos 
DROP COLUMN IF EXISTS categoria CASCADE,
DROP COLUMN IF EXISTS setor CASCADE;

-- ============================================================================
-- 3. REMOVER COLUNAS ANTIGAS DE LANCAMENTOS_ITENS
-- ============================================================================

ALTER TABLE lancamentos_itens 
DROP COLUMN IF EXISTS setor CASCADE,
DROP COLUMN IF EXISTS categoria CASCADE;

-- ============================================================================
-- VERIFICAÇÃO: Confirmar que colunas foram removidas
-- ============================================================================

-- Verificar categorias
SELECT 
    'categorias' as tabela,
    column_name, 
    data_type
FROM information_schema.columns
WHERE table_name = 'categorias'
AND column_name LIKE '%setor%'
ORDER BY column_name;

-- Verificar produtos
SELECT 
    'produtos' as tabela,
    column_name, 
    data_type
FROM information_schema.columns
WHERE table_name = 'produtos'
AND (column_name LIKE '%categoria%' OR column_name LIKE '%setor%')
ORDER BY column_name;

-- Verificar lancamentos_itens
SELECT 
    'lancamentos_itens' as tabela,
    column_name, 
    data_type
FROM information_schema.columns
WHERE table_name = 'lancamentos_itens'
AND (column_name LIKE '%setor%' OR column_name LIKE '%categoria%')
ORDER BY column_name;

-- ============================================================================
-- RESULTADO ESPERADO:
-- - Apenas colunas *_id devem aparecer
-- - Colunas antigas (TEXT/VARCHAR) foram removidas
-- - Espaço em disco foi liberado
-- ============================================================================

COMMIT;

-- Registrar no log que a limpeza foi concluída
SELECT 
    'LIMPEZA CONCLUÍDA' as status,
    NOW() as data_hora,
    'Colunas antigas removidas com sucesso' as mensagem;

*/

-- ============================================================================
-- ROLLBACK PLAN
-- ============================================================================

-- Se você executou este script e precisa reverter:
-- 1. Restaure o backup do banco de dados
-- 2. Execute as migrations novamente
-- 3. Investigue o problema antes de tentar novamente

-- ============================================================================
-- OBSERVAÇÕES FINAIS
-- ============================================================================

-- Este script está comentado por segurança.
-- Descomente SOMENTE quando:
-- ✅ Todas as migrations anteriores foram executadas
-- ✅ Todo o código foi atualizado
-- ✅ Testes completos foram realizados
-- ✅ Sistema está em produção há pelo menos 2 semanas sem problemas
-- ✅ Backup completo foi realizado
-- ✅ Você tem autorização para fazer esta mudança irreversível
