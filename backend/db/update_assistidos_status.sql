ALTER TABLE assistidos DROP CONSTRAINT assistidos_status_check;

ALTER TABLE assistidos ADD CONSTRAINT assistidos_status_check 
CHECK (status IN ('Ativo', 'Assistido', 'Em Triagem', 'Desativado', 'Suspenso', 'Pre-Cadastro'));
