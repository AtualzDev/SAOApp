-- Migration: Create Beneficiaries (Assistidos) Tables
-- Description: Creates tables for managing beneficiaries and their family composition, and links them to stock exits.

-- 1. Tabela Principal de Assistidos (Beneficiaries)
CREATE TABLE IF NOT EXISTS assistidos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE, -- 000.000.000-00
    data_nascimento DATE,
    telefone VARCHAR(20),
    email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Assistido', 'Em Triagem', 'Desativado', 'Suspenso')),
    
    -- Endereço
    cep VARCHAR(10),
    endereco TEXT,
    numero VARCHAR(20),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    complemento VARCHAR(100),
    
    -- Dados Sociais e Médicos
    tipo_doenca VARCHAR(255),
    renda_mensal DECIMAL(10, 2), -- Renda familiar
    diagnostico TEXT,
    data_diagnostico DATE,
    cadastro_unico VARCHAR(50), -- Sim, Não, Pendente (Text allows flexibility)
    numero_nis VARCHAR(50),
    hospital VARCHAR(255),
    patologia_descricao TEXT,
    
    foto_url TEXT,
    
    organization_id UUID, -- Multi-tenant support if needed
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Composição Familiar (Family Members)
-- É fundamental para o cálculo de renda per capita e análise social
CREATE TABLE IF NOT EXISTS assistidos_familiares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assistido_id UUID NOT NULL REFERENCES assistidos(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    parentesco VARCHAR(50), -- Pai, Mãe, Filho, Cônjuge, Avó, etc.
    data_nascimento DATE,
    ocupacao VARCHAR(100),
    renda DECIMAL(10, 2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Vincular Saídas de Estoque aos Assistidos
-- Adiciona a coluna assistido_id na tabela saidas_estoque criada anteriormente
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'saidas_estoque' AND column_name = 'assistido_id') THEN
        ALTER TABLE saidas_estoque ADD COLUMN assistido_id UUID REFERENCES assistidos(id) ON DELETE SET NULL;
        -- Cria índice para facilitar buscas de: "doações que este assistido recebeu"
        CREATE INDEX idx_saidas_estoque_assistido_id ON saidas_estoque(assistido_id);
    END IF;
END $$;

-- Trigger para updated_at em assistidos
CREATE TRIGGER update_assistidos_updated_at
    BEFORE UPDATE ON assistidos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comentários
COMMENT ON TABLE assistidos IS 'Cadastro principal de beneficiários/assistidos da instituição';
COMMENT ON TABLE assistidos_familiares IS 'Membros da família do assistido para composição de renda e análise';
