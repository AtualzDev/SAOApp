-- Script para criar a tabela 'setores'
-- Execute este script no SQL Editor do Supabase

-- Criar a tabela setores
CREATE TABLE IF NOT EXISTS setores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    deletado VARCHAR(3) DEFAULT 'no',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comentários explicativos
COMMENT ON TABLE setores IS 'Tabela de setores para organização de produtos';
COMMENT ON COLUMN setores.nome IS 'Nome do setor (ex: Alimentação, Limpeza, etc.)';
COMMENT ON COLUMN setores.descricao IS 'Descrição detalhada do setor';
COMMENT ON COLUMN setores.deletado IS 'Soft delete: yes ou no';

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_setores_deletado ON setores(deletado);

-- Inserir setores padrão
INSERT INTO setores (nome, descricao) VALUES
    ('Alimentação', 'Produtos alimentícios e bebidas'),
    ('Limpeza', 'Produtos de limpeza e higienização'),
    ('Escritório', 'Material de escritório e papelaria'),
    ('Higiene', 'Produtos de higiene pessoal'),
    ('Vestuário', 'Roupas e acessórios'),
    ('Outros', 'Produtos diversos')
ON CONFLICT DO NOTHING;

-- Adicionar campo deletado na tabela categorias se não existir
ALTER TABLE categorias 
ADD COLUMN IF NOT EXISTS deletado VARCHAR(3) DEFAULT 'no';

-- Criar índice para categorias
CREATE INDEX IF NOT EXISTS idx_categorias_deletado ON categorias(deletado);

-- Atualizar categorias existentes
UPDATE categorias
SET deletado = 'no'
WHERE deletado IS NULL;

-- Verificar estrutura
SELECT 'Setores:' as tabela, column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'setores'
UNION ALL
SELECT 'Categorias:' as tabela, column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'categorias'
ORDER BY tabela, ordinal_position;
