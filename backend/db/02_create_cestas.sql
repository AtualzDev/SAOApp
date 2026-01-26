-- Create cestas table
create table if not exists public.cestas (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  descricao text,
  deletado boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.cestas enable row level security;

-- Policies for cestas (Allow all authenticated users for now)
create policy "Authenticated users can select cestas" on public.cestas for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert cestas" on public.cestas for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update cestas" on public.cestas for update using (auth.role() = 'authenticated');
create policy "Authenticated users can delete cestas" on public.cestas for delete using (auth.role() = 'authenticated');


-- Create cestas_itens table
create table if not exists public.cestas_itens (
  id uuid default gen_random_uuid() primary key,
  cesta_id uuid references public.cestas(id) on delete cascade not null,
  produto_id uuid references public.produtos(id) on delete cascade not null,
  quantidade numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.cestas_itens enable row level security;

-- Policies for cestas_itens
create policy "Authenticated users can select cestas_itens" on public.cestas_itens for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert cestas_itens" on public.cestas_itens for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update cestas_itens" on public.cestas_itens for update using (auth.role() = 'authenticated');
create policy "Authenticated users can delete cestas_itens" on public.cestas_itens for delete using (auth.role() = 'authenticated');
