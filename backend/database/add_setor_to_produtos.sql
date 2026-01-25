-- Script para adicionar as colunas 'setor' e 'deletado' na tabela 'produtos'
-- Execute este script no SQL Editor do Supabase

-- 1. Adicionar a coluna setor na tabela produtos
ALTER TABLE produtos 
ADD COLUMN IF NOT EXISTS setor VARCHAR(100);

-- Comentário explicativo da coluna setor
COMMENT ON COLUMN produtos.setor IS 'Setor ao qual o produto pertence (ex: Alimentação, Limpeza, Higiene, etc.)';

-- 2. Adicionar a coluna deletado na tabela produtos (soft delete)
ALTER TABLE produtos 
ADD COLUMN IF NOT EXISTS deletado VARCHAR(3) DEFAULT 'no';

-- Comentário explicativo da coluna deletado
COMMENT ON COLUMN produtos.deletado IS 'Indica se o produto foi deletado (soft delete): yes ou no';

-- 3. Atualizar produtos existentes para garantir que todos tenham deletado = 'no'
UPDATE produtos
SET deletado = 'no'
WHERE deletado IS NULL;

-- 4. Criar índice para melhorar performance nas consultas de produtos não deletados
CREATE INDEX IF NOT EXISTS idx_produtos_deletado ON produtos(deletado);

-- Opcional: Atualizar produtos existentes com setor baseado na categoria
-- Descomente as linhas abaixo se quiser popular automaticamente
/*
UPDATE produtos p
SET setor = c.setor
FROM categorias c
WHERE p.categoria = c.id
AND p.setor IS NULL;
*/

-- Verificar a estrutura da tabela após a alteração
SELECT column_name, data_type, character_maximum_length, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'produtos'
ORDER BY ordinal_position;
