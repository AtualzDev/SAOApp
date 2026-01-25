-- ============================================
-- Script para OTIMIZAR campo 'deletado' para BOOLEAN
-- Melhor performance e uso de memória
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- IMPORTANTE: Este script altera o tipo de dado de VARCHAR para BOOLEAN
-- Isso melhora significativamente a performance e reduz o uso de memória

-- ============================================
-- 1. PRODUTOS
-- ============================================

-- Remover coluna antiga se existir
ALTER TABLE produtos DROP COLUMN IF EXISTS deletado;

-- Adicionar coluna BOOLEAN com default FALSE
ALTER TABLE produtos 
ADD COLUMN deletado BOOLEAN NOT NULL DEFAULT FALSE;

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_produtos_deletado ON produtos(deletado) WHERE deletado = FALSE;

COMMENT ON COLUMN produtos.deletado IS 'Soft delete: FALSE = ativo, TRUE = deletado';

-- ============================================
-- 2. CATEGORIAS
-- ============================================

ALTER TABLE categorias DROP COLUMN IF EXISTS deletado;

ALTER TABLE categorias 
ADD COLUMN deletado BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_categorias_deletado ON categorias(deletado) WHERE deletado = FALSE;

COMMENT ON COLUMN categorias.deletado IS 'Soft delete: FALSE = ativo, TRUE = deletado';

-- ============================================
-- 3. SETORES
-- ============================================

-- Se a tabela já existe, alterar
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'setores') THEN
        ALTER TABLE setores DROP COLUMN IF EXISTS deletado;
        ALTER TABLE setores ADD COLUMN deletado BOOLEAN NOT NULL DEFAULT FALSE;
    END IF;
END $$;

-- Criar tabela setores se não existir (com BOOLEAN)
CREATE TABLE IF NOT EXISTS setores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    deletado BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_setores_deletado ON setores(deletado) WHERE deletado = FALSE;

COMMENT ON TABLE setores IS 'Tabela de setores para organização de produtos';
COMMENT ON COLUMN setores.deletado IS 'Soft delete: FALSE = ativo, TRUE = deletado';

-- Inserir setores padrão (se não existirem)
INSERT INTO setores (nome, descricao, deletado) 
SELECT 'Alimentação', 'Produtos alimentícios e bebidas', FALSE
WHERE NOT EXISTS (SELECT 1 FROM setores WHERE nome = 'Alimentação');

INSERT INTO setores (nome, descricao, deletado) 
SELECT 'Limpeza', 'Produtos de limpeza e higienização', FALSE
WHERE NOT EXISTS (SELECT 1 FROM setores WHERE nome = 'Limpeza');

INSERT INTO setores (nome, descricao, deletado) 
SELECT 'Escritório', 'Material de escritório e papelaria', FALSE
WHERE NOT EXISTS (SELECT 1 FROM setores WHERE nome = 'Escritório');

INSERT INTO setores (nome, descricao, deletado) 
SELECT 'Higiene', 'Produtos de higiene pessoal', FALSE
WHERE NOT EXISTS (SELECT 1 FROM setores WHERE nome = 'Higiene');

INSERT INTO setores (nome, descricao, deletado) 
SELECT 'Vestuário', 'Roupas e acessórios', FALSE
WHERE NOT EXISTS (SELECT 1 FROM setores WHERE nome = 'Vestuário');

INSERT INTO setores (nome, descricao, deletado) 
SELECT 'Outros', 'Produtos diversos', FALSE
WHERE NOT EXISTS (SELECT 1 FROM setores WHERE nome = 'Outros');

-- ============================================
-- 4. FORNECEDORES
-- ============================================

ALTER TABLE fornecedores DROP COLUMN IF EXISTS deletado;

ALTER TABLE fornecedores 
ADD COLUMN deletado BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_fornecedores_deletado ON fornecedores(deletado) WHERE deletado = FALSE;

COMMENT ON COLUMN fornecedores.deletado IS 'Soft delete: FALSE = ativo, TRUE = deletado';

-- ============================================
-- 5. UNIDADES
-- ============================================

ALTER TABLE unidades DROP COLUMN IF EXISTS deletado;

ALTER TABLE unidades 
ADD COLUMN deletado BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_unidades_deletado ON unidades(deletado) WHERE deletado = FALSE;

COMMENT ON COLUMN unidades.deletado IS 'Soft delete: FALSE = ativo, TRUE = deletado';

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================

SELECT 
    'produtos' as tabela,
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'produtos'
  AND column_name IN ('deletado', 'setor')

UNION ALL

SELECT 
    'categorias' as tabela,
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'categorias'
  AND column_name = 'deletado'

UNION ALL

SELECT 
    'setores' as tabela,
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'setores'
  AND column_name = 'deletado'

UNION ALL

SELECT 
    'fornecedores' as tabela,
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'fornecedores'
  AND column_name = 'deletado'

UNION ALL

SELECT 
    'unidades' as tabela,
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'unidades'
  AND column_name = 'deletado'

ORDER BY tabela, column_name;

-- ============================================
-- RESULTADO ESPERADO:
-- ============================================
-- Todas as tabelas devem ter:
-- deletado | boolean | false | NO
-- 
-- Benefícios do BOOLEAN:
-- ✅ Ocupa apenas 1 byte (vs 3+ bytes do VARCHAR)
-- ✅ Queries mais rápidas (comparação binária)
-- ✅ Índices menores e mais eficientes
-- ✅ Validação automática de tipo
-- ✅ Mais claro semanticamente
-- ============================================
