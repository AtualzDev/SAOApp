ALTER TABLE assistidos 
ADD COLUMN IF NOT EXISTS rg text,
ADD COLUMN IF NOT EXISTS sexo text,
ADD COLUMN IF NOT EXISTS estado_civil text,
ADD COLUMN IF NOT EXISTS naturalidade text,
ADD COLUMN IF NOT EXISTS nome_mae text,
ADD COLUMN IF NOT EXISTS nome_pai text,
ADD COLUMN IF NOT EXISTS telefone_2 text, -- Already checked, didn't see it in list, adding just in case or skip if exists
ADD COLUMN IF NOT EXISTS telefone_comercial text,
ADD COLUMN IF NOT EXISTS empresa text,
ADD COLUMN IF NOT EXISTS profissao text,
ADD COLUMN IF NOT EXISTS moradores jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS recebe_beneficios boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS lista_beneficios text[],
ADD COLUMN IF NOT EXISTS fumante boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS usa_entorpecentes text,
ADD COLUMN IF NOT EXISTS possui_deficiencia boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS deficiencia_descricao text;
