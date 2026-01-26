-- ============================================================================
-- SCRIPT DE VERIFICAÇÃO: Validar Estado do Banco de Dados
-- ============================================================================
-- Descrição: Verifica o estado atual do banco e identifica problemas
-- Autor: Sistema SAO
-- Data: 2026-01-25
-- Versão: 1.0
-- ============================================================================

-- Este script pode ser executado a qualquer momento para verificar o estado
-- do banco de dados durante o processo de migração.

-- ============================================================================
-- 1. VERIFICAR ESTRUTURA DAS TABELAS
-- ============================================================================

\echo '============================================================================'
\echo '1. ESTRUTURA DAS TABELAS'
\echo '============================================================================'

-- Categorias
SELECT 
    '=== CATEGORIAS ===' as info,
    column_name, 
    data_type,
    udt_name,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'categorias'
AND (column_name LIKE '%setor%' OR column_name = 'id')
ORDER BY ordinal_position;

-- Produtos
SELECT 
    '=== PRODUTOS ===' as info,
    column_name, 
    data_type,
    udt_name,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'produtos'
AND (column_name LIKE '%categoria%' OR column_name LIKE '%setor%' OR column_name = 'id')
ORDER BY ordinal_position;

-- Lancamentos_itens
SELECT 
    '=== LANCAMENTOS_ITENS ===' as info,
    column_name, 
    data_type,
    udt_name,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'lancamentos_itens'
AND (column_name LIKE '%setor%' OR column_name LIKE '%categoria%' OR column_name = 'id')
ORDER BY ordinal_position;

-- ============================================================================
-- 2. VERIFICAR FOREIGN KEYS
-- ============================================================================

\echo ''
\echo '============================================================================'
\echo '2. FOREIGN KEYS'
\echo '============================================================================'

SELECT 
    tc.table_name as tabela,
    tc.constraint_name as constraint,
    kcu.column_name as coluna,
    ccu.table_name AS tabela_referenciada,
    ccu.column_name AS coluna_referenciada,
    rc.update_rule as on_update,
    rc.delete_rule as on_delete
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
    ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name IN ('categorias', 'produtos', 'lancamentos_itens')
ORDER BY tc.table_name, tc.constraint_name;

-- ============================================================================
-- 3. VERIFICAR ÍNDICES
-- ============================================================================

\echo ''
\echo '============================================================================'
\echo '3. ÍNDICES'
\echo '============================================================================'

SELECT 
    tablename as tabela,
    indexname as indice,
    indexdef as definicao
FROM pg_indexes
WHERE tablename IN ('categorias', 'produtos', 'lancamentos_itens', 'setores')
AND (indexname LIKE 'idx_%' OR indexname LIKE 'fk_%')
ORDER BY tablename, indexname;

-- ============================================================================
-- 4. ESTATÍSTICAS DE DADOS
-- ============================================================================

\echo ''
\echo '============================================================================'
\echo '4. ESTATÍSTICAS DE DADOS'
\echo '============================================================================'

-- Setores
SELECT 
    'SETORES' as tabela,
    COUNT(*) as total_registros,
    COUNT(*) FILTER (WHERE deletado = false) as ativos,
    COUNT(*) FILTER (WHERE deletado = true) as deletados
FROM setores;

-- Categorias
SELECT 
    'CATEGORIAS' as tabela,
    COUNT(*) as total_registros,
    COUNT(setor) as com_setor_antigo,
    COUNT(setor_id) as com_setor_novo,
    COUNT(*) FILTER (WHERE setor IS NOT NULL AND setor_id IS NULL) as nao_migrados
FROM categorias;

-- Produtos
SELECT 
    'PRODUTOS' as tabela,
    COUNT(*) as total_registros,
    COUNT(categoria) as com_categoria_antiga,
    COUNT(categoria_id) as com_categoria_nova,
    COUNT(setor) as com_setor_antigo,
    COUNT(setor_id) as com_setor_novo
FROM produtos;

-- Lancamentos_itens
SELECT 
    'LANCAMENTOS_ITENS' as tabela,
    COUNT(*) as total_registros,
    COUNT(setor) as com_setor_antigo,
    COUNT(setor_id) as com_setor_novo,
    COUNT(categoria) as com_categoria_antiga,
    COUNT(categoria_id) as com_categoria_nova
FROM lancamentos_itens;

-- ============================================================================
-- 5. IDENTIFICAR DADOS INVÁLIDOS
-- ============================================================================

\echo ''
\echo '============================================================================'
\echo '5. DADOS INVÁLIDOS (ÓRFÃOS)'
\echo '============================================================================'

-- Categorias com setor inválido
SELECT 
    'CATEGORIAS COM SETOR INVÁLIDO' as problema,
    COUNT(*) as quantidade
FROM categorias c
WHERE c.setor IS NOT NULL
AND c.setor != ''
AND NOT EXISTS (
    SELECT 1 FROM setores s WHERE s.id::text = c.setor
);

-- Produtos com categoria inválida
SELECT 
    'PRODUTOS COM CATEGORIA INVÁLIDA' as problema,
    COUNT(*) as quantidade
FROM produtos p
WHERE p.categoria IS NOT NULL
AND p.categoria != ''
AND NOT EXISTS (
    SELECT 1 FROM categorias c WHERE c.id::text = p.categoria
);

-- Produtos com setor inválido
SELECT 
    'PRODUTOS COM SETOR INVÁLIDO' as problema,
    COUNT(*) as quantidade
FROM produtos p
WHERE p.setor IS NOT NULL
AND p.setor != ''
AND NOT EXISTS (
    SELECT 1 FROM setores s WHERE s.id::text = p.setor
);

-- ============================================================================
-- 6. VERIFICAR INTEGRIDADE REFERENCIAL
-- ============================================================================

\echo ''
\echo '============================================================================'
\echo '6. INTEGRIDADE REFERENCIAL'
\echo '============================================================================'

-- Produtos órfãos (categoria_id não existe)
SELECT 
    'PRODUTOS COM CATEGORIA_ID ÓRFÃ' as problema,
    COUNT(*) as quantidade
FROM produtos p
WHERE p.categoria_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM categorias c WHERE c.id = p.categoria_id
);

-- Produtos órfãos (setor_id não existe)
SELECT 
    'PRODUTOS COM SETOR_ID ÓRFÃO' as problema,
    COUNT(*) as quantidade
FROM produtos p
WHERE p.setor_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM setores s WHERE s.id = p.setor_id
);

-- Categorias órfãs (setor_id não existe)
SELECT 
    'CATEGORIAS COM SETOR_ID ÓRFÃO' as problema,
    COUNT(*) as quantidade
FROM categorias c
WHERE c.setor_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM setores s WHERE s.id = c.setor_id
);

-- ============================================================================
-- 7. RESUMO GERAL
-- ============================================================================

\echo ''
\echo '============================================================================'
\echo '7. RESUMO GERAL'
\echo '============================================================================'

SELECT 
    'RESUMO DA MIGRAÇÃO' as titulo,
    (SELECT COUNT(*) FROM setores) as total_setores,
    (SELECT COUNT(*) FROM categorias) as total_categorias,
    (SELECT COUNT(*) FROM produtos) as total_produtos,
    (SELECT COUNT(*) FROM lancamentos_itens) as total_itens_lancamento,
    (SELECT COUNT(*) FROM categorias WHERE setor_id IS NOT NULL) as categorias_migradas,
    (SELECT COUNT(*) FROM produtos WHERE categoria_id IS NOT NULL) as produtos_categoria_migrados,
    (SELECT COUNT(*) FROM produtos WHERE setor_id IS NOT NULL) as produtos_setor_migrados;

-- ============================================================================
-- 8. DIAGNÓSTICO
-- ============================================================================

\echo ''
\echo '============================================================================'
\echo '8. DIAGNÓSTICO'
\echo '============================================================================'

DO $$
DECLARE
    v_categorias_nao_migradas INTEGER;
    v_produtos_cat_nao_migrados INTEGER;
    v_produtos_set_nao_migrados INTEGER;
    v_fks_criadas INTEGER;
BEGIN
    -- Contar registros não migrados
    SELECT COUNT(*) INTO v_categorias_nao_migradas
    FROM categorias 
    WHERE setor IS NOT NULL AND setor_id IS NULL;
    
    SELECT COUNT(*) INTO v_produtos_cat_nao_migrados
    FROM produtos 
    WHERE categoria IS NOT NULL AND categoria_id IS NULL;
    
    SELECT COUNT(*) INTO v_produtos_set_nao_migrados
    FROM produtos 
    WHERE setor IS NOT NULL AND setor_id IS NULL;
    
    -- Contar Foreign Keys
    SELECT COUNT(*) INTO v_fks_criadas
    FROM information_schema.table_constraints
    WHERE constraint_type = 'FOREIGN KEY'
    AND table_name IN ('categorias', 'produtos', 'lancamentos_itens')
    AND constraint_name LIKE 'fk_%';
    
    -- Diagnóstico
    RAISE NOTICE '';
    RAISE NOTICE '=== DIAGNÓSTICO ===';
    RAISE NOTICE '';
    
    IF v_categorias_nao_migradas > 0 THEN
        RAISE WARNING 'Existem % categorias não migradas!', v_categorias_nao_migradas;
    ELSE
        RAISE NOTICE '✓ Todas as categorias foram migradas';
    END IF;
    
    IF v_produtos_cat_nao_migrados > 0 THEN
        RAISE WARNING 'Existem % produtos (categoria) não migrados!', v_produtos_cat_nao_migrados;
    ELSE
        RAISE NOTICE '✓ Todos os produtos (categoria) foram migrados';
    END IF;
    
    IF v_produtos_set_nao_migrados > 0 THEN
        RAISE WARNING 'Existem % produtos (setor) não migrados!', v_produtos_set_nao_migrados;
    ELSE
        RAISE NOTICE '✓ Todos os produtos (setor) foram migrados';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE 'Foreign Keys criadas: %', v_fks_criadas;
    
    IF v_fks_criadas = 5 THEN
        RAISE NOTICE '✓ Todas as 5 Foreign Keys foram criadas';
    ELSIF v_fks_criadas = 0 THEN
        RAISE WARNING 'Nenhuma Foreign Key foi criada ainda';
    ELSE
        RAISE WARNING 'Apenas % de 5 Foreign Keys foram criadas', v_fks_criadas;
    END IF;
END $$;

\echo ''
\echo '============================================================================'
\echo 'VERIFICAÇÃO CONCLUÍDA'
\echo '============================================================================'
