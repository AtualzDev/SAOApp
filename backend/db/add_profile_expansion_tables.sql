-- Add columns to assistidos for new modules
ALTER TABLE assistidos
ADD COLUMN IF NOT EXISTS servicos_saude text[],
ADD COLUMN IF NOT EXISTS processo_judicial_numero text,
ADD COLUMN IF NOT EXISTS processo_judicial_comprovante_url text,
ADD COLUMN IF NOT EXISTS possui_outras_doencas boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS tratamento_oncologico boolean DEFAULT false;

-- Create Timeline table for 'Histórico'
CREATE TABLE IF NOT EXISTS timeline_social (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  assistido_id uuid REFERENCES assistidos(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  conteudo text NOT NULL,
  data_evento timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Create Companions table for 'Acompanhantes'
CREATE TABLE IF NOT EXISTS acompanhantes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  assistido_id uuid REFERENCES assistidos(id) ON DELETE CASCADE,
  nome text NOT NULL,
  parentesco text,
  contato text,
  foto_url text,
  ultima_visita timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS (simplified for now but good practice)
ALTER TABLE timeline_social ENABLE ROW LEVEL SECURITY;
ALTER TABLE acompanhantes ENABLE ROW LEVEL SECURITY;

-- Policy (Allow all for anon/authenticated for this demo env)
CREATE POLICY "Enable all access for timeline_social" ON timeline_social FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for acompanhantes" ON acompanhantes FOR ALL USING (true) WITH CHECK (true);
