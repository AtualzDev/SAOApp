-- 1. Create a table for public profiles provided it doesn't exist
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  email text, -- It's often useful to replicate email here for easy display
  cargo text,
  role text, -- Duplicate of cargo or use for logic
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Create policies
-- Allow everyone (logged in) to read profiles
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

-- Allow users to insert their own profile
create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

-- Allow users to update their own profile
create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- 4. Sync existing users (This populates the list with users already in Auth!)
insert into public.profiles (id, email, full_name, cargo, created_at)
select 
  id, 
  email, 
  raw_user_meta_data->>'full_name', 
  raw_user_meta_data->>'role',
  created_at
from auth.users
where id not in (select id from public.profiles);

-- 5. Create a function to handle new user signups automatically
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, cargo, user_metadata)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'role',
    new.raw_user_meta_data
  );
  return new;
end;
$$ language plpgsql security definer;

-- 6. Trigger the function every time a user is created
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
