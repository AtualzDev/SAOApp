-- ============================================================================
-- MIGRATION 03: Adicionar Foreign Keys e Índices
-- ============================================================================
-- Descrição: Cria constraints de Foreign Key e índices para performance
-- Autor: Sistema SAO
-- Data: 2026-01-25
-- Versão: 1.0
-- ============================================================================

-- IMPORTANTE: Execute migration_02_migrate_data.sql ANTES deste script!
-- Certifique-se de que a migração de dados foi bem-sucedida!

BEGIN;

-- ============================================================================
-- 1. ADICIONAR FOREIGN KEY CONSTRAINTS
-- ============================================================================

-- 1.1 Categorias → Setores
ALTER TABLE categorias
ADD CONSTRAINT fk_categorias_setor
FOREIGN KEY (setor_id) 
REFERENCES setores(id)
ON DELETE SET NULL
ON UPDATE CASCADE;

COMMENT ON CONSTRAINT fk_categorias_setor ON categorias IS 
'Foreign Key: categoria pertence a um setor';

-- 1.2 Produtos → Categorias
ALTER TABLE produtos
ADD CONSTRAINT fk_produtos_categoria
FOREIGN KEY (categoria_id) 
REFERENCES categorias(id)
ON DELETE SET NULL
ON UPDATE CASCADE;

COMMENT ON CONSTRAINT fk_produtos_categoria ON produtos IS 
'Foreign Key: produto pertence a uma categoria';

-- 1.3 Produtos → Setores
ALTER TABLE produtos
ADD CONSTRAINT fk_produtos_setor
FOREIGN KEY (setor_id) 
REFERENCES setores(id)
ON DELETE SET NULL
ON UPDATE CASCADE;

COMMENT ON CONSTRAINT fk_produtos_setor ON produtos IS 
'Foreign Key: produto pertence a um setor';

-- 1.4 Lancamentos_itens → Setores
ALTER TABLE lancamentos_itens
ADD CONSTRAINT fk_lancamentos_itens_setor
FOREIGN KEY (setor_id) 
REFERENCES setores(id)
ON DELETE SET NULL
ON UPDATE CASCADE;

COMMENT ON CONSTRAINT fk_lancamentos_itens_setor ON lancamentos_itens IS 
'Foreign Key: item de lançamento associado a um setor';

-- 1.5 Lancamentos_itens → Categorias
ALTER TABLE lancamentos_itens
ADD CONSTRAINT fk_lancamentos_itens_categoria
FOREIGN KEY (categoria_id) 
REFERENCES categorias(id)
ON DELETE SET NULL
ON UPDATE CASCADE;

COMMENT ON CONSTRAINT fk_lancamentos_itens_categoria ON lancamentos_itens IS 
'Foreign Key: item de lançamento associado a uma categoria';

-- ============================================================================
-- 2. CRIAR ÍNDICES PARA PERFORMANCE
-- ============================================================================

-- 2.1 Índices para categorias
CREATE INDEX IF NOT EXISTS idx_categorias_setor_id 
ON categorias(setor_id)
WHERE setor_id IS NOT NULL;

-- 2.2 Índices para produtos
CREATE INDEX IF NOT EXISTS idx_produtos_categoria_id 
ON produtos(categoria_id)
WHERE categoria_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_produtos_setor_id 
ON produtos(setor_id)
WHERE setor_id IS NOT NULL;

-- 2.3 Índices para lancamentos_itens
CREATE INDEX IF NOT EXISTS idx_lancamentos_itens_setor_id 
ON lancamentos_itens(setor_id)
WHERE setor_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_lancamentos_itens_categoria_id 
ON lancamentos_itens(categoria_id)
WHERE categoria_id IS NOT NULL;

-- ============================================================================
-- 3. VERIFICAÇÃO: Listar Foreign Keys criadas
-- ============================================================================

SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.update_rule,
    rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
    ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name IN ('categorias', 'produtos', 'lancamentos_itens')
AND tc.constraint_name LIKE 'fk_%'
ORDER BY tc.table_name, tc.constraint_name;

-- ============================================================================
-- 4. VERIFICAÇÃO: Listar Índices criados
-- ============================================================================

SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename IN ('categorias', 'produtos', 'lancamentos_itens')
AND indexname LIKE 'idx_%_id'
ORDER BY tablename, indexname;

-- ============================================================================
-- 5. TESTE DE INTEGRIDADE: Verificar se Foreign Keys estão funcionando
-- ============================================================================

-- Tentar inserir categoria com setor inválido (deve falhar)
DO $$
BEGIN
    INSERT INTO categorias (nome, setor_id) 
    VALUES ('Teste FK', '00000000-0000-0000-0000-000000000000');
    RAISE EXCEPTION 'ERRO: Foreign Key não está funcionando!';
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'OK: Foreign Key categorias.setor_id está funcionando corretamente';
END $$;

-- Tentar inserir produto com categoria inválida (deve falhar)
DO $$
BEGIN
    INSERT INTO produtos (nome, categoria_id) 
    VALUES ('Teste FK', '00000000-0000-0000-0000-000000000000');
    RAISE EXCEPTION 'ERRO: Foreign Key não está funcionando!';
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'OK: Foreign Key produtos.categoria_id está funcionando corretamente';
END $$;

-- ============================================================================
-- 6. ESTATÍSTICAS: Performance dos índices
-- ============================================================================

SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as numero_de_scans,
    idx_tup_read as tuplas_lidas,
    idx_tup_fetch as tuplas_buscadas
FROM pg_stat_user_indexes
WHERE tablename IN ('categorias', 'produtos', 'lancamentos_itens')
AND indexname LIKE 'idx_%_id'
ORDER BY tablename, indexname;

COMMIT;

-- ============================================================================
-- RESULTADO ESPERADO:
-- - 5 Foreign Keys criadas
-- - 5 Índices criados
-- - Integridade referencial garantida
-- - Performance otimizada para JOINs
-- ============================================================================

-- Próximo passo: Atualizar código backend e frontend
-- Depois: Execute migration_04_cleanup.sql (somente após testes completos!)
