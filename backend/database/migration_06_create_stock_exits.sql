-- Migration: Create Stock Exits Tables
-- Description: Creates dedicated tables for managing stock exits (saidas_estoque) and their items (saidas_estoque_itens).

-- 1. Tabela de Cabeçalho de Saídas (Header)
CREATE TABLE IF NOT EXISTS saidas_estoque (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo SERIAL, -- Auto-incrementing human readable code (e.g. 1001, 1002). Frontend shows as #OUT-1001
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('Uso Interno', 'Perda', 'Troca', 'Doação', 'Venda', 'Outro')),
    
    -- Se for Doação, este campo armazena o nome do Assistido. 
    -- Se for Uso Interno/Outros, armazena o nome do Solicitante (Funcionário/Setor).
    solicitante_ou_assistido VARCHAR(255) NOT NULL, 
    
    -- Local de destino (Ex: Cozinha, Bazar, Setor Administrativo)
    destino_local VARCHAR(255),
    
    data_saida TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    observacoes TEXT,
    
    -- Status da saída
    status VARCHAR(20) DEFAULT 'Concluído' CHECK (status IN ('Pendente', 'Concluído', 'Cancelado')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Itens da Saída (Items)
CREATE TABLE IF NOT EXISTS saidas_estoque_itens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    saida_id UUID NOT NULL REFERENCES saidas_estoque(id) ON DELETE CASCADE,
    produto_id UUID NOT NULL REFERENCES produtos(id),
    
    quantidade DECIMAL(10, 3) NOT NULL CHECK (quantidade > 0),
    unidade_medida VARCHAR(20), -- Snapshot da unidade no momento da saída
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Índices para performance
CREATE INDEX IF NOT EXISTS idx_saidas_estoque_data ON saidas_estoque(data_saida);
CREATE INDEX IF NOT EXISTS idx_saidas_estoque_tipo ON saidas_estoque(tipo);
CREATE INDEX IF NOT EXISTS idx_saidas_itens_saida_id ON saidas_estoque_itens(saida_id);
CREATE INDEX IF NOT EXISTS idx_saidas_itens_produto_id ON saidas_estoque_itens(produto_id);

-- 4. Trigger para atualizar o 'updated_at'
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_saidas_estoque_updated_at
    BEFORE UPDATE ON saidas_estoque
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comentários para documentação
COMMENT ON TABLE saidas_estoque IS 'Tabela principal de saídas de estoque (baixas)';
COMMENT ON COLUMN saidas_estoque.solicitante_ou_assistido IS 'Nome do solicitante ou do assistido (se for doação)';
COMMENT ON TABLE saidas_estoque_itens IS 'Itens individuais vinculados a uma saída de estoque';
