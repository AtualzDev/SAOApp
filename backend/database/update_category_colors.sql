-- ============================================================================
-- SCRIPT: Atualizar cores das categorias existentes
-- ============================================================================
-- Descrição: Define cores padrão para categorias que não têm cor
-- ============================================================================

-- Atualizar todas as categorias sem cor com a cor padrão azul
UPDATE categorias 
SET cor = '#3B82F6' 
WHERE cor IS NULL OR cor = '';

-- Verificar resultado
SELECT 
    id,
    nome,
    cor,
    CASE 
        WHEN cor IS NULL OR cor = '' THEN '❌ SEM COR'
        ELSE '✅ COM COR'
    END as status_cor
FROM categorias
ORDER BY nome;
