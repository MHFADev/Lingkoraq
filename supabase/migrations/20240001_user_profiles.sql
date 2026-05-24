-- ============================================================
-- user_profiles table — cross-device sync for editor state
-- Run this once in Supabase SQL Editor
-- ============================================================

create table if not exists public.user_profiles (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  profile_data jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (user_id)
);

alter table public.user_profiles enable row level security;

-- SELECT
create policy "user_profiles_select"
  on public.user_profiles for select
  to authenticated
  using (auth.uid() = user_id);

-- INSERT
create policy "user_profiles_insert"
  on public.user_profiles for insert
  to authenticated
  with check (auth.uid() = user_id);

-- UPDATE
create policy "user_profiles_update"
  on public.user_profiles for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- DELETE
create policy "user_profiles_delete"
  on public.user_profiles for delete
  to authenticated
  using (auth.uid() = user_id);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_user_profiles_updated on public.user_profiles;
create trigger on_user_profiles_updated
  before update on public.user_profiles
  for each row execute function public.handle_updated_at();
