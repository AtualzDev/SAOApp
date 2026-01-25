-- ============================================
-- Script para adicionar campo 'deletado' em todas as tabelas
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- 1. PRODUTOS (já deve ter sido criado, mas garantindo)
ALTER TABLE produtos 
ADD COLUMN IF NOT EXISTS deletado VARCHAR(3) DEFAULT 'no';

UPDATE produtos
SET deletado = 'no'
WHERE deletado IS NULL;

CREATE INDEX IF NOT EXISTS idx_produtos_deletado ON produtos(deletado);

COMMENT ON COLUMN produtos.deletado IS 'Soft delete: yes ou no';

-- 2. CATEGORIAS
ALTER TABLE categorias 
ADD COLUMN IF NOT EXISTS deletado VARCHAR(3) DEFAULT 'no';

UPDATE categorias
SET deletado = 'no'
WHERE deletado IS NULL;

CREATE INDEX IF NOT EXISTS idx_categorias_deletado ON categorias(deletado);

COMMENT ON COLUMN categorias.deletado IS 'Soft delete: yes ou no';

-- 3. SETORES (criar tabela se não existir + campo deletado)
CREATE TABLE IF NOT EXISTS setores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    deletado VARCHAR(3) DEFAULT 'no',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_setores_deletado ON setores(deletado);

COMMENT ON TABLE setores IS 'Tabela de setores para organização de produtos';
COMMENT ON COLUMN setores.nome IS 'Nome do setor (ex: Alimentação, Limpeza, etc.)';
COMMENT ON COLUMN setores.descricao IS 'Descrição detalhada do setor';
COMMENT ON COLUMN setores.deletado IS 'Soft delete: yes ou no';

-- Inserir setores padrão (se não existirem)
INSERT INTO setores (nome, descricao) 
SELECT 'Alimentação', 'Produtos alimentícios e bebidas'
WHERE NOT EXISTS (SELECT 1 FROM setores WHERE nome = 'Alimentação');

INSERT INTO setores (nome, descricao) 
SELECT 'Limpeza', 'Produtos de limpeza e higienização'
WHERE NOT EXISTS (SELECT 1 FROM setores WHERE nome = 'Limpeza');

INSERT INTO setores (nome, descricao) 
SELECT 'Escritório', 'Material de escritório e papelaria'
WHERE NOT EXISTS (SELECT 1 FROM setores WHERE nome = 'Escritório');

INSERT INTO setores (nome, descricao) 
SELECT 'Higiene', 'Produtos de higiene pessoal'
WHERE NOT EXISTS (SELECT 1 FROM setores WHERE nome = 'Higiene');

INSERT INTO setores (nome, descricao) 
SELECT 'Vestuário', 'Roupas e acessórios'
WHERE NOT EXISTS (SELECT 1 FROM setores WHERE nome = 'Vestuário');

INSERT INTO setores (nome, descricao) 
SELECT 'Outros', 'Produtos diversos'
WHERE NOT EXISTS (SELECT 1 FROM setores WHERE nome = 'Outros');

-- 4. FORNECEDORES (se existir)
ALTER TABLE fornecedores 
ADD COLUMN IF NOT EXISTS deletado VARCHAR(3) DEFAULT 'no';

UPDATE fornecedores
SET deletado = 'no'
WHERE deletado IS NULL;

CREATE INDEX IF NOT EXISTS idx_fornecedores_deletado ON fornecedores(deletado);

COMMENT ON COLUMN fornecedores.deletado IS 'Soft delete: yes ou no';

-- 5. UNIDADES (se existir)
ALTER TABLE unidades 
ADD COLUMN IF NOT EXISTS deletado VARCHAR(3) DEFAULT 'no';

UPDATE unidades
SET deletado = 'no'
WHERE deletado IS NULL;

CREATE INDEX IF NOT EXISTS idx_unidades_deletado ON unidades(deletado);

COMMENT ON COLUMN unidades.deletado IS 'Soft delete: yes ou no';

-- 6. Adicionar campo SETOR na tabela PRODUTOS (se não existir)
ALTER TABLE produtos 
ADD COLUMN IF NOT EXISTS setor VARCHAR(100);

COMMENT ON COLUMN produtos.setor IS 'Setor ao qual o produto pertence (ex: Alimentação, Limpeza, etc.)';

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================

-- Verificar estrutura de todas as tabelas
SELECT 
    'produtos' as tabela,
    column_name,
    data_type,
    character_maximum_length,
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
    character_maximum_length,
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
    character_maximum_length,
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
    character_maximum_length,
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
    character_maximum_length,
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
-- - deletado | character varying | 3 | 'no' | YES
-- 
-- Tabela produtos deve ter também:
-- - setor | character varying | 100 | NULL | YES
-- ============================================
