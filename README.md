# Second Brain Theatre

When your brain is overwhelmed, it's not a sorting problem — it's a conflict problem. Different parts of you are fighting for control. This app lets them argue it out.

**Live:** [backstage-lovat.vercel.app](https://backstage-lovat.vercel.app)

## What it does

You hit **"My brain is loud"** and dump everything on your mind. The app turns your overwhelm into a cast of animated characters — each representing a different inner voice (The Firefighter, The Perfectionist, The Body, Future You…). They argue on a tiny stage, then a Moderator AI steps in and resolves the conflict with one clear next move.

## How it works

1. **Brain dump** — type or speak everything that's loud in your head
2. **Casting** — AI reads your dump and picks which inner voices are active
3. **Characters argue** — each character delivers their take as animated pixel-art sprites on stage
4. **Chat** — tap any character to have a one-on-one follow-up conversation
5. **Moderator resolves** — an AI moderator identifies the real conflict, who's overreacting, and gives one stabilizing move with a timer
6. **Clarity check** — rate your clarity before and after to track progress

Over time, the app learns your recurring cast and spots patterns ("Your Perfectionist shows up most before public-facing work").

## Tech stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router, React 19, TypeScript) |
| Styling | Tailwind CSS 4, Framer Motion |
| AI Agents | LangChain.js + Anthropic Claude (Sonnet for casting/characters/moderator, Haiku for follow-ups) |
| Voice Input | OpenAI Whisper (speech-to-text) |
| Voice Output | ElevenLabs (text-to-speech with per-character voices) |
| Auth | Supabase Auth (Google OAuth, magic link) |
| Database | Supabase Postgres with Row Level Security |
| Characters | PixelLab animated pixel-art sprites |
| Deployment | Vercel |

## Project structure

```
src/
├── app/
│   ├── api/
│   │   ├── cast/          # AI casting — picks which characters appear
│   │   ├── characters/    # Parallel character agent responses
│   │   ├── moderator/     # Moderator resolution
│   │   ├── followup/      # One-on-one character chat
│   │   ├── insights/      # Recurring cast pattern analysis
│   │   ├── voice/         # ElevenLabs TTS
│   │   ├── transcribe/    # Whisper STT
│   │   ├── save-scene/    # Scene persistence
│   │   └── rate/          # Clarity rating
│   ├── auth/callback/     # OAuth/magic link redirect handler
│   ├── login/             # Login page
│   └── components/        # Theatre UI components
├── lib/
│   ├── langchain/         # LangChain chains and output schemas
│   ├── prompts/           # System prompts for each agent
│   ├── elevenlabs/        # Voice configuration per character
│   ├── supabase/          # Client, server, middleware, queries
│   └── types.ts           # Shared types and constants
public/
└── characters/            # PixelLab animated GIF sprites
```

## Setup

```bash
git clone https://github.com/aboudyattia/backstage.git
cd backstage/second-brain-theatre
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
ELEVENLABS_API_KEY=xi-...
OPENAI_API_KEY=sk-...
```

Run the dev server:

```bash
npm run dev
```

## Supabase setup

Run the following SQL in the Supabase SQL editor:

```sql
-- Users table (synced from auth.users)
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz default now()
);

alter table public.users enable row level security;
create policy "Users can read own row" on public.users for select using (auth.uid() = id);

-- Auto-create public.users row on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email) values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Scenes table
create table public.scenes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  brain_dump text not null,
  scene_label text,
  overwhelm_before smallint,
  overwhelm_after smallint,
  characters jsonb,
  moderator jsonb,
  created_at timestamptz default now()
);

alter table public.scenes enable row level security;
create policy "Users own their scenes" on public.scenes for all using (auth.uid() = user_id);
create index idx_scenes_user on public.scenes(user_id);

-- Follow-up messages
create table public.followups (
  id uuid primary key default gen_random_uuid(),
  scene_id uuid references public.scenes(id) on delete cascade not null,
  character_type text not null,
  role text not null check (role in ('user','character')),
  content text not null,
  created_at timestamptz default now()
);

alter table public.followups enable row level security;
create policy "Users own their followups" on public.followups for all
  using (scene_id in (select id from public.scenes where user_id = auth.uid()));

-- Character stats view
create or replace view public.character_stats as
  select s.user_id, c->>'type' as character_type, count(*) as appearances
  from public.scenes s, jsonb_array_elements(s.characters) c
  where s.user_id = auth.uid()
  group by s.user_id, c->>'type';
```

## Deployment

Deployed on Vercel with root directory set to `second-brain-theatre`.

After deploying, update **Supabase > Authentication > URL Configuration**:
- **Site URL:** `https://your-app.vercel.app`
- **Redirect URLs:** `https://your-app.vercel.app/auth/callback`

## Team

Built during a hackathon by a 3-person team:
- **Person A** — Frontend / Theatre UI
- **Person B** — Agents / AI Backend
- **Person C** — Supabase / Infra / Integration
