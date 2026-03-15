-- Second Brain Theatre — Supabase schema
-- Run this in Supabase Dashboard → SQL Editor

-- 1. Scenes table
create table if not exists public.scenes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  brain_dump text not null,
  freeze_frame text,
  scene_label text,
  main_conflict text,
  best_move text,
  can_wait text,
  why_this_works text,
  do_not_do text,
  scene_insight text,
  overreacting_voice text,
  overwhelm_before smallint,
  overwhelm_after smallint,
  created_at timestamptz default now() not null
);

alter table public.scenes enable row level security;

create policy "Users can insert their own scenes"
  on public.scenes for insert
  with check (auth.uid() = user_id);

create policy "Users can read their own scenes"
  on public.scenes for select
  using (auth.uid() = user_id);

create policy "Users can update their own scenes"
  on public.scenes for update
  using (auth.uid() = user_id);

-- 2. Scene characters table
create table if not exists public.scene_characters (
  id uuid default gen_random_uuid() primary key,
  scene_id uuid references public.scenes(id) on delete cascade not null,
  character_type text not null,
  character_name text not null,
  emoji text,
  original_line text not null,
  protecting_value text,
  intensity smallint,
  created_at timestamptz default now() not null
);

alter table public.scene_characters enable row level security;

create policy "Users can insert characters for their scenes"
  on public.scene_characters for insert
  with check (
    exists (select 1 from public.scenes where id = scene_id and user_id = auth.uid())
  );

create policy "Users can read characters for their scenes"
  on public.scene_characters for select
  using (
    exists (select 1 from public.scenes where id = scene_id and user_id = auth.uid())
  );

-- 3. Follow-up messages table
create table if not exists public.followup_messages (
  id uuid default gen_random_uuid() primary key,
  scene_id uuid references public.scenes(id) on delete cascade not null,
  character_type text not null,
  role text not null check (role in ('user', 'character')),
  content text not null,
  created_at timestamptz default now() not null
);

alter table public.followup_messages enable row level security;

create policy "Users can insert followup messages for their scenes"
  on public.followup_messages for insert
  with check (
    exists (select 1 from public.scenes where id = scene_id and user_id = auth.uid())
  );

create policy "Users can read followup messages for their scenes"
  on public.followup_messages for select
  using (
    exists (select 1 from public.scenes where id = scene_id and user_id = auth.uid())
  );

-- 4. Character stats view (aggregates scene_characters per user)
create or replace view public.character_stats as
select
  s.user_id,
  sc.character_type,
  sc.character_name,
  max(sc.emoji) as emoji,
  count(*)::int as appearance_count,
  round(avg(sc.intensity), 1) as avg_intensity,
  mode() within group (order by sc.protecting_value) as most_common_protecting
from public.scene_characters sc
join public.scenes s on s.id = sc.scene_id
group by s.user_id, sc.character_type, sc.character_name;

-- 5. Indexes for performance
create index if not exists idx_scenes_user_id on public.scenes(user_id);
create index if not exists idx_scenes_created_at on public.scenes(created_at desc);
create index if not exists idx_scene_characters_scene_id on public.scene_characters(scene_id);
create index if not exists idx_followup_messages_scene_id on public.followup_messages(scene_id);
