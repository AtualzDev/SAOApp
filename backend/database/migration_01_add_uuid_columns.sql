-- ============================================================================
-- MIGRATION 01: Adicionar Colunas UUID para Foreign Keys
-- ============================================================================
-- Descrição: Cria novas colunas UUID para substituir campos TEXT/VARCHAR
-- Autor: Sistema SAO
-- Data: 2026-01-25
-- Versão: 1.0
-- ============================================================================

-- IMPORTANTE: Execute este script em ambiente de DESENVOLVIMENTO primeiro!
-- Faça backup do banco de dados antes de executar em PRODUÇÃO!

BEGIN;

-- ============================================================================
-- 1. CATEGORIAS: Adicionar setor_id
-- ============================================================================

ALTER TABLE categorias 
ADD COLUMN IF NOT EXISTS setor_id UUID;

COMMENT ON COLUMN categorias.setor_id IS 'Foreign Key para setores.id (substitui campo setor TEXT)';

-- ============================================================================
-- 2. PRODUTOS: Adicionar categoria_id e setor_id
-- ============================================================================

ALTER TABLE produtos 
ADD COLUMN IF NOT EXISTS categoria_id UUID,
ADD COLUMN IF NOT EXISTS setor_id UUID;

COMMENT ON COLUMN produtos.categoria_id IS 'Foreign Key para categorias.id (substitui campo categoria TEXT)';
COMMENT ON COLUMN produtos.setor_id IS 'Foreign Key para setores.id (substitui campo setor VARCHAR)';

-- ============================================================================
-- 3. LANCAMENTOS_ITENS: Adicionar setor_id e categoria_id
-- ============================================================================

ALTER TABLE lancamentos_itens 
ADD COLUMN IF NOT EXISTS setor_id UUID,
ADD COLUMN IF NOT EXISTS categoria_id UUID;

COMMENT ON COLUMN lancamentos_itens.setor_id IS 'Foreign Key para setores.id (substitui campo setor TEXT)';
COMMENT ON COLUMN lancamentos_itens.categoria_id IS 'Foreign Key para categorias.id (substitui campo categoria TEXT)';

-- ============================================================================
-- VERIFICAÇÃO: Listar estrutura das tabelas após alteração
-- ============================================================================

-- Verificar categorias
SELECT 
    'categorias' as tabela,
    column_name, 
    data_type, 
    udt_name,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'categorias'
AND column_name IN ('setor', 'setor_id')
ORDER BY ordinal_position;

-- Verificar produtos
SELECT 
    'produtos' as tabela,
    column_name, 
    data_type, 
    udt_name,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'produtos'
AND column_name IN ('categoria', 'categoria_id', 'setor', 'setor_id')
ORDER BY ordinal_position;

-- Verificar lancamentos_itens
SELECT 
    'lancamentos_itens' as tabela,
    column_name, 
    data_type, 
    udt_name,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'lancamentos_itens'
AND column_name IN ('setor', 'setor_id', 'categoria', 'categoria_id')
ORDER BY ordinal_position;

COMMIT;

-- ============================================================================
-- RESULTADO ESPERADO:
-- - Novas colunas UUID criadas em todas as tabelas
-- - Colunas antigas (TEXT/VARCHAR) ainda existem
-- - Nenhum dado foi alterado ainda
-- ============================================================================

-- Próximo passo: Execute migration_02_migrate_data.sql
