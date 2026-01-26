-- Create table for Baskets (Cestas)
create table if not exists public.cestas (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  descricao text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create table for Basket Items (Itens da Cesta)
create table if not exists public.cestas_itens (
  id uuid default gen_random_uuid() primary key,
  cesta_id uuid references public.cestas(id) on delete cascade not null,
  produto_id uuid references public.produtos(id) on delete cascade not null, -- Assuming 'produtos' table exists
  quantidade numeric not null default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Optional, but good practice if used elsewhere)
alter table public.cestas enable row level security;
alter table public.cestas_itens enable row level security;

-- Policies (Simplified for internal tool use)
create policy "Enable all access for authenticated users" on public.cestas for all using (true);
create policy "Enable all access for authenticated users" on public.cestas_itens for all using (true);

-- Insert a test basket if none exists
insert into public.cestas (nome, descricao)
select 'Cesta Básica Tipo 1', 'Cesta padrão para doação'
where not exists (select 1 from public.cestas where nome = 'Cesta Básica Tipo 1');

-- Insert items for the test basket (assuming some products exist, this might fail if no products, so we'll wrap or just leave it)
-- Note: We can't easily know product IDs here without querying. 
-- The user will likely need to populate this via UI or I can add a dummy insert if I knew a product ID.
