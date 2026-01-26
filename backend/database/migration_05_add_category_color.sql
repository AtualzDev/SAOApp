-- ============================================================================
-- MIGRATION: Adicionar campo COR em categorias
-- ============================================================================
-- Descrição: Adiciona coluna 'cor' para personalização visual das categorias
-- Autor: Sistema SAO
-- Data: 2026-01-25
-- Versão: 1.0
-- ============================================================================

-- Verificar se a coluna já existe antes de adicionar
DO $$
BEGIN
    -- Tentar adicionar a coluna apenas se ela não existir
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'categorias' 
        AND column_name = 'cor'
    ) THEN
        ALTER TABLE categorias ADD COLUMN cor VARCHAR(7) DEFAULT '#3B82F6';
        RAISE NOTICE 'Coluna cor adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna cor já existe - pulando criação';
    END IF;
END $$;

-- Atualizar categorias existentes que não têm cor definida
UPDATE categorias 
SET cor = '#3B82F6' 
WHERE cor IS NULL OR cor = '';

-- Comentário na coluna (se não existir)
COMMENT ON COLUMN categorias.cor IS 'Cor hexadecimal para identificação visual da categoria (ex: #3B82F6)';

-- Verificação final
SELECT 
    'MIGRATION CONCLUÍDA' as status,
    COUNT(*) as total_categorias,
    COUNT(CASE WHEN cor IS NOT NULL AND cor != '' THEN 1 END) as categorias_com_cor,
    COUNT(CASE WHEN cor IS NULL OR cor = '' THEN 1 END) as categorias_sem_cor
FROM categorias;
