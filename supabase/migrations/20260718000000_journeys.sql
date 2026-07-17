-- Noesis journeys: one active learning journey per user (JSONB layers).
create table public.journeys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  topic text not null,
  created_at timestamptz not null,
  updated_at timestamptz not null default now(),
  current_index int not null default 0,
  used_placement boolean not null default false,
  layers jsonb not null default '[]'::jsonb
);

create index journeys_user_updated_idx on public.journeys (user_id, updated_at desc);

alter table public.journeys enable row level security;

create policy "journeys_select_own" on public.journeys
  for select using (auth.uid() = user_id);

create policy "journeys_insert_own" on public.journeys
  for insert with check (auth.uid() = user_id);

create policy "journeys_update_own" on public.journeys
  for update using (auth.uid() = user_id);

create policy "journeys_delete_own" on public.journeys
  for delete using (auth.uid() = user_id);
