-- Migration: Add Sector Relationship to Stock Exits
-- Description: Adds a foreign key to link stock exits directly to a Sector (Setor).

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'saidas_estoque' AND column_name = 'setor_id') THEN
        ALTER TABLE saidas_estoque ADD COLUMN setor_id UUID REFERENCES setores(id) ON DELETE SET NULL;
        CREATE INDEX idx_saidas_estoque_setor_id ON saidas_estoque(setor_id);
    END IF;
END $$;
