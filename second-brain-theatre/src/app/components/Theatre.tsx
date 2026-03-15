'use client'

import { useReducer, useCallback, useRef, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { CastingResult, CharacterResponse, ModeratorResponse } from '@/lib/types'
import { useVoice } from '@/app/hooks/useVoice'
import BrainDumpInput from './BrainDumpInput'
import FreezeFrame from './FreezeFrame'
import CharacterScene from './CharacterScene'
import ModeratorCard from './ModeratorCard'
import OverwhelmRating from './OverwhelmRating'
import FollowUpChat from './FollowUpChat'
import CastHistory from './CastHistory'

type State = {
  phase: 'input' | 'loading_cast' | 'freeze' | 'loading_characters' | 'stage' | 'loading_moderator' | 'resolution' | 'after_rating'
  brainDump: string
  overwhelmBefore: number
  casting: CastingResult | null
  characters: CharacterResponse[]
  moderator: ModeratorResponse | null
  sceneId: string | null
  overwhelmAfter: number | null
  chatCharacter: { type: string; name: string; line: string } | null
  error: string | null
}

type Action =
  | { type: 'SUBMIT'; brainDump: string; overwhelmBefore: number }
  | { type: 'CAST_RECEIVED'; casting: CastingResult }
  | { type: 'CHARACTERS_READY' }
  | { type: 'CHARACTERS_RECEIVED'; characters: CharacterResponse[] }
  | { type: 'MODERATOR_PREFETCHED'; moderator: ModeratorResponse }
  | { type: 'CALL_MODERATOR' }
  | { type: 'OPEN_CHAT'; character: { type: string; name: string; line: string } }
  | { type: 'CLOSE_CHAT' }
  | { type: 'SHOW_RATING' }
  | { type: 'RATE'; overwhelmAfter: number; sceneId: string }
  | { type: 'RESET' }
  | { type: 'ERROR'; error: string }
  | { type: 'SET_BRAIN_DUMP'; value: string }

const initial: State = {
  phase: 'input',
  brainDump: '',
  overwhelmBefore: 7,
  casting: null,
  characters: [],
  moderator: null,
  sceneId: null,
  overwhelmAfter: null,
  chatCharacter: null,
  error: null,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SUBMIT':
      return { ...state, phase: 'loading_cast', brainDump: action.brainDump, overwhelmBefore: action.overwhelmBefore, error: null }
    case 'CAST_RECEIVED':
      return { ...state, phase: 'freeze', casting: action.casting }
    case 'CHARACTERS_READY':
      return { ...state, phase: 'loading_characters' }
    case 'CHARACTERS_RECEIVED':
      return { ...state, phase: 'stage', characters: action.characters }
    case 'MODERATOR_PREFETCHED':
      return { ...state, moderator: action.moderator }
    case 'CALL_MODERATOR':
      if (state.moderator) return { ...state, phase: 'resolution', chatCharacter: null }
      return { ...state, phase: 'loading_moderator', chatCharacter: null }
    case 'OPEN_CHAT':
      return { ...state, chatCharacter: action.character }
    case 'CLOSE_CHAT':
      return { ...state, chatCharacter: null }
    case 'SHOW_RATING':
      return { ...state, phase: 'after_rating' }
    case 'RATE':
      return { ...state, overwhelmAfter: action.overwhelmAfter, sceneId: action.sceneId }
    case 'RESET':
      return { ...initial }
    case 'ERROR':
      return { ...state, phase: 'input', error: action.error }
    case 'SET_BRAIN_DUMP':
      return { ...state, brainDump: action.value }
    default:
      return state
  }
}

const MOCK_CASTING: CastingResult = {
  characters: [
    { type: 'firefighter',   casting_note: 'Client email urgency' },
    { type: 'doctor',        casting_note: 'Skipped meals, ignoring warning signs' },
    { type: 'superhero',     casting_note: 'Multiple people counting on you' },
    { type: 'wizard',        casting_note: 'Recurring pattern — there may be a smarter path' },
    { type: 'astronaut',     casting_note: 'Losing perspective on what actually matters' },
  ],
  freeze_frame: "You're caught between urgency, exhaustion, and fear of disappointing three different people at once.",
  scene_label: 'Urgency Spiral',
}

const MOCK_CHARACTERS: CharacterResponse[] = [
  { name: 'The Firefighter',  emoji: '🚒', line: "The client email has to go out NOW — they've been waiting since yesterday.", protecting: 'professional trust', intensity: 9 },
  { name: 'The Doctor',       emoji: '🩺', line: "You haven't eaten in 8 hours. These are symptoms of a system under serious strain.", protecting: 'proper diagnosis', intensity: 8 },
  { name: 'The Superhero',    emoji: '🦸', line: "Your partner is expecting you home by 6. Your manager needs the report. Someone will be let down and it cannot be us.", protecting: 'being needed', intensity: 7 },
  { name: 'The Wizard',       emoji: '🧙', line: "This is the third time this month. The brute-force approach isn't working. There's a spell for this pattern.", protecting: 'creative solutions', intensity: 6 },
  { name: 'The Astronaut',    emoji: '🧑‍🚀', line: "Houston... from up here, the client email is one pixel. The exhaustion is the whole continent.", protecting: 'perspective', intensity: 4 },
]

const MOCK_MODERATOR: ModeratorResponse = {
  best_move: "Open Gmail. Reply to the client: 'Got it — reviewing the deck now, will send final version by tomorrow 10am.' Send. Close Gmail. (3 minutes)",
  can_wait: "The Q3 report. Your manager has survived this long — 14 more hours won't change anything.",
  why_this_works: "This satisfies the Firefighter's need for responsiveness and the Superhero's fear of silence, without forcing deep work on the Doctor's empty tank.",
  do_not_do: "Do not open Slack for the next 25 minutes. The 47 unread messages will still be there.",
  overreacting_voice: "The Firefighter — treating everything as equally urgent when only the client reply actually needs to happen today.",
  scene_insight: "The Astronaut only showed up at intensity 4, but the fact that it showed up at all means part of you knows this isn't actually as catastrophic as it feels.",
  action_type: 'draft',
  action_draft: "Hi — thanks for your patience. I'm reviewing the deck now and will have the final version to you by tomorrow at 10am.",
}

export default function Theatre({ userEmail }: { userEmail: string }) {
  const [state, dispatch] = useReducer(reducer, initial)
  const [castOpen, setCastOpen] = useState(false)
  const { playLine, playSequence, playingCharacter, stop: stopVoice } = useVoice()

  const handleSubmit = useCallback(async (brainDump: string, overwhelmBefore: number) => {
    dispatch({ type: 'SUBMIT', brainDump, overwhelmBefore })

    try {
      const castRes = await fetch('/api/cast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brainDump }),
      })

      const casting = castRes.ok ? await castRes.json() : MOCK_CASTING
      dispatch({ type: 'CAST_RECEIVED', casting })

      setTimeout(async () => {
        dispatch({ type: 'CHARACTERS_READY' })

        try {
          const charRes = await fetch('/api/characters', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ brainDump, characters: casting.characters }),
          })
          const characters = charRes.ok ? await charRes.json() : MOCK_CHARACTERS
          dispatch({ type: 'CHARACTERS_RECEIVED', characters })

          // Prefetch moderator in background — user decides when to call them in
          fetch('/api/moderator', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ brainDump, characters, sceneLabel: casting.scene_label }),
          })
            .then(r => r.ok ? r.json() : MOCK_MODERATOR)
            .then(moderator => dispatch({ type: 'MODERATOR_PREFETCHED', moderator }))
            .catch(() => dispatch({ type: 'MODERATOR_PREFETCHED', moderator: MOCK_MODERATOR }))
        } catch {
          dispatch({ type: 'CHARACTERS_RECEIVED', characters: MOCK_CHARACTERS })
          dispatch({ type: 'MODERATOR_PREFETCHED', moderator: MOCK_MODERATOR })
        }
      }, 2500)
    } catch {
      dispatch({ type: 'CAST_RECEIVED', casting: MOCK_CASTING })
      setTimeout(() => {
        dispatch({ type: 'CHARACTERS_READY' })
        setTimeout(() => {
          dispatch({ type: 'CHARACTERS_RECEIVED', characters: MOCK_CHARACTERS })
          dispatch({ type: 'MODERATOR_PREFETCHED', moderator: MOCK_MODERATOR })
        }, 800)
      }, 2500)
    }
  }, [])

  const demoRef = useRef(false)
  const handleDemo = useCallback(() => {
    if (demoRef.current) return
    demoRef.current = true
    dispatch({ type: 'RESET' })

    const demoText = "I have a client presentation tomorrow and the deck isn't done. My manager keeps pinging me about the Q3 report that was due yesterday. I haven't eaten since breakfast and it's 4pm. I also promised my partner I'd be home by 6 but there's no way. And I keep thinking maybe I should just quit and start that side project. My inbox has 47 unread messages and I just realized I forgot to reply to the CEO's email from Monday."

    let i = 0
    const type = () => {
      if (i < demoText.length) {
        dispatch({ type: 'SET_BRAIN_DUMP', value: demoText.slice(0, i + 1) })
        i++
        const char = demoText[i - 1]
        const delay = char === '.' || char === ',' ? 80 : char === ' ' ? 30 : 25
        setTimeout(type, delay)
      } else {
        setTimeout(() => {
          demoRef.current = false
          handleSubmit(demoText, 8)
        }, 500)
      }
    }
    setTimeout(type, 300)
  }, [handleSubmit])

  const handleRate = useCallback(async (overwhelmAfter: number) => {
    try {
      const saveRes = await fetch('/api/save-scene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brain_dump: state.brainDump,
          freeze_frame: state.casting?.freeze_frame,
          scene_label: state.casting?.scene_label,
          characters: state.characters,
          moderator: state.moderator,
          overwhelm_before: state.overwhelmBefore,
        }),
      })
      const { sceneId } = saveRes.ok ? await saveRes.json() : { sceneId: 'mock' }

      await fetch('/api/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sceneId, overwhelm_after: overwhelmAfter }),
      }).catch(() => {})

      dispatch({ type: 'RATE', overwhelmAfter, sceneId })
    } catch {
      dispatch({ type: 'RATE', overwhelmAfter, sceneId: 'mock' })
    }
  }, [state.brainDump, state.casting, state.characters, state.moderator, state.overwhelmBefore])

  useEffect(() => {
    if (state.phase === 'loading_moderator' && state.moderator) {
      dispatch({ type: 'CALL_MODERATOR' })
    }
  }, [state.phase, state.moderator])

  useEffect(() => {
    if (state.phase === 'input') stopVoice()
  }, [state.phase, stopVoice])

  const isStagePhase = state.phase === 'loading_characters' || state.phase === 'stage' || state.phase === 'loading_moderator'
  const isResolutionPhase = state.phase === 'resolution' || state.phase === 'after_rating'

  return (
    <div className="min-h-screen relative" style={{ background: 'radial-gradient(ellipse at center, rgba(192,132,252,0.08) 0%, #0c0b14 70%)' }}>
      <AnimatePresence mode="wait">
        {(state.phase === 'input' || state.phase === 'loading_cast') && (
          <BrainDumpInput
            key="input"
            onSubmit={handleSubmit}
            loading={state.phase === 'loading_cast'}
            error={state.error}
            value={state.brainDump}
            onChange={(v) => dispatch({ type: 'SET_BRAIN_DUMP', value: v })}
            onDemo={handleDemo}
          />
        )}

        {state.phase === 'freeze' && state.casting && (
          <FreezeFrame
            key="freeze"
            freezeFrame={state.casting.freeze_frame}
            sceneLabel={state.casting.scene_label}
          />
        )}

        {isStagePhase && (
          <div key="stage" className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
            <CharacterScene
              characters={state.characters}
              castingTypes={state.casting?.characters.map(c => c.type) ?? []}
              loading={state.phase === 'loading_characters'}
              activeCharacter={state.chatCharacter?.type ?? null}
              playingCharacter={playingCharacter}
              onPlayLine={playLine}
              onPlaySequence={playSequence}
              onCharacterTap={(c) => {
                if (state.chatCharacter?.type === c.type) {
                  dispatch({ type: 'CLOSE_CHAT' })
                } else {
                  dispatch({ type: 'OPEN_CHAT', character: c })
                }
              }}
            />

            <AnimatePresence>
              {state.chatCharacter && (
                <FollowUpChat
                  key={state.chatCharacter.type}
                  character={state.chatCharacter}
                  sceneId={state.sceneId}
                  brainDump={state.brainDump}
                  onPlayLine={playLine}
                  onClose={() => dispatch({ type: 'CLOSE_CHAT' })}
                />
              )}
            </AnimatePresence>

            {/* "Bring in the Moderator" button — only show after characters are loaded */}
            {state.phase === 'stage' && state.characters.length > 0 && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: state.characters.length * 0.8 + 1, duration: 0.5 }}
                onClick={() => dispatch({ type: 'CALL_MODERATOR' })}
                className="mt-6 px-8 py-3.5 rounded-2xl text-sm font-bold cursor-pointer transition-all"
                style={{
                  background: state.moderator ? 'var(--accent-warm)' : 'var(--surface)',
                  color: state.moderator ? '#0c0b14' : 'var(--text-dim)',
                  border: '2px solid var(--accent-warm)',
                  boxShadow: state.moderator ? '0 0 30px rgba(251,191,36,0.2)' : 'none',
                }}
              >
                {state.moderator ? '🎭 Bring in the Moderator' : '⏳ Moderator is listening...'}
              </motion.button>
            )}

            {state.phase === 'loading_moderator' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mt-6 text-sm"
                style={{ color: 'var(--accent-warm)' }}
              >
                The Moderator is stepping in...
              </motion.p>
            )}
          </div>
        )}

        {isResolutionPhase && state.moderator && (
          <div key="resolution" className="min-h-screen flex flex-col items-center px-4 py-12 gap-6">
            <ModeratorCard
              moderator={state.moderator}
              sceneLabel={state.casting?.scene_label ?? ''}
              characters={state.characters}
              onPlayLine={playLine}
              onCharacterTap={(c) => dispatch({ type: 'OPEN_CHAT', character: c })}
              onReset={() => dispatch({ type: 'RESET' })}
              onShowRating={() => dispatch({ type: 'SHOW_RATING' })}
              dimmed={state.phase === 'after_rating'}
            />

            <AnimatePresence>
              {state.chatCharacter && (
                <FollowUpChat
                  key={state.chatCharacter.type}
                  character={state.chatCharacter}
                  sceneId={state.sceneId}
                  brainDump={state.brainDump}
                  onPlayLine={playLine}
                  onClose={() => dispatch({ type: 'CLOSE_CHAT' })}
                />
              )}
            </AnimatePresence>

            {state.phase === 'after_rating' && (
              <OverwhelmRating
                overwhelmBefore={state.overwhelmBefore}
                onRate={handleRate}
                overwhelmAfter={state.overwhelmAfter}
                characters={state.characters}
                castingTypes={state.casting?.characters.map(c => c.type) ?? []}
                onReset={() => dispatch({ type: 'RESET' })}
              />
            )}
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {castOpen && <CastHistory onClose={() => setCastOpen(false)} />}
      </AnimatePresence>

      <button
        onClick={() => setCastOpen(true)}
        className="fixed top-4 left-4 flex items-center gap-1.5 text-xs opacity-30 hover:opacity-70 transition-opacity cursor-pointer"
        style={{ color: 'var(--primary)' }}
      >
        🎭 Your Cast
      </button>

      <button
        onClick={async () => {
          const { createClient } = await import('@/lib/supabase/client')
          const supabase = createClient()
          await supabase.auth.signOut()
          window.location.href = '/'
        }}
        className="fixed top-4 right-4 text-xs opacity-30 hover:opacity-70 transition-opacity cursor-pointer"
        style={{ color: 'var(--text-dim)' }}
      >
        Sign out
      </button>

    </div>
  )
}
