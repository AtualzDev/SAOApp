
-- CRIAR O BUCKET 'avatars' (Se não existir)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- POLÍTICA PARA PERMITIR SELECT PUBLICO (Ver imagens)
DROP POLICY IF EXISTS "Public Profile Pictures" ON storage.objects;
CREATE POLICY "Public Profile Pictures" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'avatars' );

-- POLÍTICA PARA PERMITIR UPLOAD AUTENTICADO
DROP POLICY IF EXISTS "Users can upload their own profile pictures" ON storage.objects;
CREATE POLICY "Users can upload their own profile pictures" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

-- POLÍTICA PARA PERMITIR UPDATE (Sobrescrever)
DROP POLICY IF EXISTS "Users can update their own profile pictures" ON storage.objects;
CREATE POLICY "Users can update their own profile pictures" 
ON storage.objects FOR UPDATE
USING ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

