-- Script para adicionar a coluna 'deletado' na tabela 'produtos'
-- Execute este script no SQL Editor do Supabase

-- Adicionar a coluna deletado na tabela produtos
ALTER TABLE produtos 
ADD COLUMN IF NOT EXISTS deletado VARCHAR(3) DEFAULT 'no';

-- Comentário explicativo da coluna
COMMENT ON COLUMN produtos.deletado IS 'Indica se o produto foi deletado (soft delete): yes ou no';

-- Atualizar produtos existentes para garantir que todos tenham deletado = 'no'
UPDATE produtos
SET deletado = 'no'
WHERE deletado IS NULL;

-- Criar índice para melhorar performance nas consultas
CREATE INDEX IF NOT EXISTS idx_produtos_deletado ON produtos(deletado);

-- Verificar a estrutura da tabela após a alteração
SELECT column_name, data_type, character_maximum_length, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'produtos'
ORDER BY ordinal_position;
