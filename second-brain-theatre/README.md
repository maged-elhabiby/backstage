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
