
-- 0. Garantir que as extensões necessárias existam
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Unidades (Instituições)
CREATE TABLE IF NOT EXISTS "unidades" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "localizacao" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Tabela de Categorias
CREATE TABLE IF NOT EXISTS "categorias" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "setor" TEXT,
    "descricao" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Tabela de Fornecedores
CREATE TABLE IF NOT EXISTS "fornecedores" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "cnpj_cpf" TEXT,
    "observacao" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Tabela de Produtos (Catálogo)
CREATE TABLE IF NOT EXISTS "produtos" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "codigo" TEXT,
    "categoria" TEXT,
    "unidade_medida" TEXT,
    "estoque_minimo" INTEGER DEFAULT 0,
    "estoque_atual" INTEGER DEFAULT 0,
    "valor_referencia" DECIMAL(10,2),
    "descricao" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Tabela de Lançamentos (Cabeçalho - Header)
CREATE TABLE IF NOT EXISTS "lancamentos" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "tipo" TEXT CHECK (tipo IN ('Doação', 'Compra')),
    "status" TEXT DEFAULT 'Com nota',
    "data_emissao" DATE,
    "data_recebimento" DATE,
    "fornecedor" TEXT,
    "instituicao_beneficiada" TEXT,
    "numero_nota" TEXT,
    "observacoes" TEXT,
    "valor_total" DECIMAL(10,2) DEFAULT 0,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Tabela de Itens do Lançamento (Detalhes - Lines)
CREATE TABLE IF NOT EXISTS "lancamentos_itens" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "lancamento_id" UUID REFERENCES "lancamentos"(id) ON DELETE CASCADE,
    "produto_id" UUID REFERENCES "produtos"(id),
    "quantidade" INTEGER NOT NULL,
    "valor_unitario" DECIMAL(10,2),
    "validade" DATE,
    "setor" TEXT,
    "categoria" TEXT,
    "unidade_medida" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
