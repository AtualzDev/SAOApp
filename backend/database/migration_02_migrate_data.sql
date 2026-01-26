-- ============================================================================
-- MIGRATION 02: Migrar Dados para Colunas UUID
-- ============================================================================
-- Descrição: Copia dados das colunas TEXT/VARCHAR para as novas colunas UUID
-- Autor: Sistema SAO
-- Data: 2026-01-25
-- Versão: 1.0
-- ============================================================================

-- IMPORTANTE: Execute migration_01_add_uuid_columns.sql ANTES deste script!
-- Faça backup do banco de dados antes de executar!

BEGIN;

-- ============================================================================
-- ANÁLISE PRÉVIA: Verificar dados existentes
-- ============================================================================

-- Verificar categorias.setor (dados atuais)
SELECT 
    'categorias.setor' as campo,
    COUNT(*) as total_registros,
    COUNT(setor) as com_valor,
    COUNT(DISTINCT setor) as valores_unicos
FROM categorias;

-- Verificar produtos
SELECT 
    'produtos' as tabela,
    COUNT(*) as total_registros,
    COUNT(categoria) as com_categoria,
    COUNT(setor) as com_setor
FROM produtos;

-- Verificar lancamentos_itens
SELECT 
    'lancamentos_itens' as tabela,
    COUNT(*) as total_registros,
    COUNT(setor) as com_setor,
    COUNT(categoria) as com_categoria
FROM lancamentos_itens;

-- ============================================================================
-- VALIDAÇÃO: Identificar dados inválidos ANTES da migração
-- ============================================================================

-- Categorias com setor inválido (não existe em setores)
SELECT 
    'CATEGORIAS COM SETOR INVÁLIDO' as problema,
    c.id,
    c.nome,
    c.setor as setor_invalido
FROM categorias c
WHERE c.setor IS NOT NULL
AND c.setor != ''
AND NOT EXISTS (
    SELECT 1 FROM setores s 
    WHERE s.id::text = c.setor
);

-- Produtos com categoria inválida
SELECT 
    'PRODUTOS COM CATEGORIA INVÁLIDA' as problema,
    p.id,
    p.nome,
    p.categoria as categoria_invalida
FROM produtos p
WHERE p.categoria IS NOT NULL
AND p.categoria != ''
AND NOT EXISTS (
    SELECT 1 FROM categorias c 
    WHERE c.id::text = p.categoria
);

-- Produtos com setor inválido
SELECT 
    'PRODUTOS COM SETOR INVÁLIDO' as problema,
    p.id,
    p.nome,
    p.setor as setor_invalido
FROM produtos p
WHERE p.setor IS NOT NULL
AND p.setor != ''
AND NOT EXISTS (
    SELECT 1 FROM setores s 
    WHERE s.id::text = p.setor
);

-- ============================================================================
-- MIGRAÇÃO DE DADOS
-- ============================================================================

-- 1. Migrar categorias.setor → categorias.setor_id
UPDATE categorias
SET setor_id = s.id
FROM setores s
WHERE categorias.setor = s.id::text
AND categorias.setor IS NOT NULL
AND categorias.setor != ''
AND categorias.setor_id IS NULL;

-- Verificar resultado
SELECT 
    'Migração categorias.setor_id' as etapa,
    COUNT(*) as total,
    COUNT(setor) as com_setor_antigo,
    COUNT(setor_id) as com_setor_novo,
    COUNT(*) FILTER (WHERE setor IS NOT NULL AND setor_id IS NULL) as nao_migrados
FROM categorias;

-- 2. Migrar produtos.categoria → produtos.categoria_id
UPDATE produtos
SET categoria_id = c.id
FROM categorias c
WHERE produtos.categoria = c.id::text
AND produtos.categoria IS NOT NULL
AND produtos.categoria != ''
AND produtos.categoria_id IS NULL;

-- Verificar resultado
SELECT 
    'Migração produtos.categoria_id' as etapa,
    COUNT(*) as total,
    COUNT(categoria) as com_categoria_antiga,
    COUNT(categoria_id) as com_categoria_nova,
    COUNT(*) FILTER (WHERE categoria IS NOT NULL AND categoria_id IS NULL) as nao_migrados
FROM produtos;

-- 3. Migrar produtos.setor → produtos.setor_id
UPDATE produtos
SET setor_id = s.id
FROM setores s
WHERE produtos.setor = s.id::text
AND produtos.setor IS NOT NULL
AND produtos.setor != ''
AND produtos.setor_id IS NULL;

-- Verificar resultado
SELECT 
    'Migração produtos.setor_id' as etapa,
    COUNT(*) as total,
    COUNT(setor) as com_setor_antigo,
    COUNT(setor_id) as com_setor_novo,
    COUNT(*) FILTER (WHERE setor IS NOT NULL AND setor_id IS NULL) as nao_migrados
FROM produtos;

-- 4. Migrar lancamentos_itens.setor → lancamentos_itens.setor_id
UPDATE lancamentos_itens
SET setor_id = s.id
FROM setores s
WHERE lancamentos_itens.setor = s.id::text
AND lancamentos_itens.setor IS NOT NULL
AND lancamentos_itens.setor != ''
AND lancamentos_itens.setor_id IS NULL;

-- Verificar resultado
SELECT 
    'Migração lancamentos_itens.setor_id' as etapa,
    COUNT(*) as total,
    COUNT(setor) as com_setor_antigo,
    COUNT(setor_id) as com_setor_novo,
    COUNT(*) FILTER (WHERE setor IS NOT NULL AND setor_id IS NULL) as nao_migrados
FROM lancamentos_itens;

-- 5. Migrar lancamentos_itens.categoria → lancamentos_itens.categoria_id
UPDATE lancamentos_itens
SET categoria_id = c.id
FROM categorias c
WHERE lancamentos_itens.categoria = c.id::text
AND lancamentos_itens.categoria IS NOT NULL
AND lancamentos_itens.categoria != ''
AND lancamentos_itens.categoria_id IS NULL;

-- Verificar resultado
SELECT 
    'Migração lancamentos_itens.categoria_id' as etapa,
    COUNT(*) as total,
    COUNT(categoria) as com_categoria_antiga,
    COUNT(categoria_id) as com_categoria_nova,
    COUNT(*) FILTER (WHERE categoria IS NOT NULL AND categoria_id IS NULL) as nao_migrados
FROM lancamentos_itens;

-- ============================================================================
-- VERIFICAÇÃO FINAL: Resumo da migração
-- ============================================================================

SELECT 
    'RESUMO DA MIGRAÇÃO' as titulo,
    (SELECT COUNT(*) FROM categorias WHERE setor_id IS NOT NULL) as categorias_migradas,
    (SELECT COUNT(*) FROM produtos WHERE categoria_id IS NOT NULL) as produtos_categoria_migrados,
    (SELECT COUNT(*) FROM produtos WHERE setor_id IS NOT NULL) as produtos_setor_migrados,
    (SELECT COUNT(*) FROM lancamentos_itens WHERE setor_id IS NOT NULL) as itens_setor_migrados,
    (SELECT COUNT(*) FROM lancamentos_itens WHERE categoria_id IS NOT NULL) as itens_categoria_migrados;

COMMIT;

-- ============================================================================
-- RESULTADO ESPERADO:
-- - Dados migrados das colunas antigas para as novas
-- - Colunas antigas ainda existem (não foram removidas)
-- - Nenhum dado foi perdido
-- - Registros com valores inválidos não foram migrados (ficam NULL)
-- ============================================================================

-- Próximo passo: Execute migration_03_add_foreign_keys.sql
