-- Trackly: run this entire script in Supabase Dashboard → SQL Editor.
-- It creates private, real-time user workspaces and a profile record for each account.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'Student' check (role in ('Student','Self-learner','Teacher','Parent')),
  avatar_url text,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.trackly_workspaces (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{"tasks":[],"habits":[],"schedule":[]}'::jsonb,
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;
alter table public.trackly_workspaces enable row level security;

drop policy if exists "Profiles are private to their owner" on public.profiles;
create policy "Profiles are private to their owner" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Users manage their own Trackly workspace" on public.trackly_workspaces;
create policy "Users manage their own Trackly workspace" on public.trackly_workspaces
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Safely creates a profile when a person signs up through email or Google.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'role', 'Student')
  ) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute procedure public.handle_new_user();

-- Enables cross-device updates for the workspace table.
do $$ begin
  alter publication supabase_realtime add table public.trackly_workspaces;
exception when duplicate_object then null;
end $$;
