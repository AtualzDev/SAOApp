-- Migration: Adicionar campos necessários para setores
-- Adiciona campos de responsável, localização e status aos setores

-- Adicionar novos campos à tabela setores
ALTER TABLE setores 
ADD COLUMN IF NOT EXISTS responsavel VARCHAR(100),
ADD COLUMN IF NOT EXISTS localizacao TEXT,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo', 'Em Manutenção'));

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_setores_status ON setores(status);

-- Atualizar setores existentes com dados padrão
UPDATE setores
SET 
    responsavel = CASE 
        WHEN nome = 'Alimentação' THEN 'Maria Silva'
        WHEN nome = 'Limpeza' THEN 'Carlos Souza'
        WHEN nome = 'Escritório' THEN 'Ana Oliveira'
        WHEN nome = 'Higiene' THEN 'Ricardo Santos'
        WHEN nome = 'Vestuário' THEN 'Fernanda Costa'
        ELSE 'Não atribuído'
    END,
    localizacao = CASE 
        WHEN nome = 'Alimentação' THEN 'Bloco A - Térreo'
        WHEN nome = 'Limpeza' THEN 'Bloco A - Subsolo'
        WHEN nome = 'Escritório' THEN 'Bloco B - Sala 3'
        WHEN nome = 'Higiene' THEN 'Bloco C - Sala 1'
        WHEN nome = 'Vestuário' THEN 'Unidade Centro'
        ELSE 'A definir'
    END,
    status = 'Ativo'
WHERE responsavel IS NULL;

-- Comentários explicativos
COMMENT ON COLUMN setores.responsavel IS 'Nome do responsável pelo setor';
COMMENT ON COLUMN setores.localizacao IS 'Localização física do setor';
COMMENT ON COLUMN setores.status IS 'Status do setor: Ativo, Inativo ou Em Manutenção';

-- Verificar estrutura atualizada
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'setores'
ORDER BY ordinal_position;
