'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { CHARACTER_IMAGES, SCENE_LABEL_EMOJIS } from '@/lib/types'
import type { CharacterResponse, ModeratorResponse } from '@/lib/types'
import Image from 'next/image'

const CHAR_COLORS: Record<string, string> = {
  firefighter:   'var(--char-firefighter)',
  alien:         'var(--char-alien)',
  astronaut:     'var(--char-astronaut)',
  chef:          'var(--char-chef)',
  director:      'var(--char-director)',
  doctor:        'var(--char-doctor)',
  hazmat:        'var(--char-hazmat)',
  judge:         'var(--char-judge)',
  nerd:          'var(--char-nerd)',
  referee:       'var(--char-referee)',
  soccer_player: 'var(--char-soccer_player)',
  spy:           'var(--char-spy)',
  superhero:     'var(--char-superhero)',
  therapist:     'var(--char-therapist)',
  wizard:        'var(--char-wizard)',
}

function typeFromName(name: string): string {
  const map: Record<string, string> = {
    'The Firefighter':   'firefighter',
    'The Alien':         'alien',
    'The Astronaut':     'astronaut',
    'The Chef':          'chef',
    'The Director':      'director',
    'The Doctor':        'doctor',
    'The Hazmat':        'hazmat',
    'The Judge':         'judge',
    'The Nerd':          'nerd',
    'The Referee':       'referee',
    'The Soccer Player': 'soccer_player',
    'The Spy':           'spy',
    'The Superhero':     'superhero',
    'The Therapist':     'therapist',
    'The Wizard':        'wizard',
  }
  return map[name] ?? name.toLowerCase().replace(/^the /, '').replace(/ /g, '_')
}

export default function ModeratorCard({
  moderator,
  sceneLabel,
  characters,
  onPlayLine,
  onCharacterTap,
  onReset,
  onShowRating,
  dimmed,
}: {
  moderator: ModeratorResponse
  sceneLabel: string
  characters: CharacterResponse[]
  onPlayLine: (characterType: string, line: string) => Promise<void>
  onCharacterTap: (c: { type: string; name: string; line: string }) => void
  onReset: () => void
  onShowRating: () => void
  dimmed: boolean
}) {
  const [copied, setCopied] = useState(false)
  const [timerActive, setTimerActive] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const emoji = SCENE_LABEL_EMOJIS[sceneLabel] ?? '🌀'
  const hasAutoPlayed = useRef(false)

  useEffect(() => {
    if (!hasAutoPlayed.current) {
      hasAutoPlayed.current = true
      const timer = setTimeout(() => onPlayLine('moderator', moderator.best_move), 800)
      return () => clearTimeout(timer)
    }
  }, [onPlayLine, moderator.best_move])

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const handleAction = () => {
    if (moderator.action_type === 'draft' || moderator.action_type === 'copy') {
      navigator.clipboard.writeText(moderator.action_draft)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } else if (moderator.action_type === 'timer') {
      if (timerActive) {
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = null
        setTimerActive(false)
        setTimerSeconds(0)
      } else {
        const mins = parseInt(moderator.action_draft) || 25
        setTimerSeconds(mins * 60)
        setTimerActive(true)
        timerRef.current = setInterval(() => {
          setTimerSeconds(prev => {
            if (prev <= 1) {
              if (timerRef.current) clearInterval(timerRef.current)
              timerRef.current = null
              setTimerActive(false)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: dimmed ? 0.4 : 1, y: 0, scale: dimmed ? 0.97 : 1 }}
      transition={{ duration: 0.6, type: 'spring' }}
      className="w-full max-w-2xl rounded-2xl p-8 space-y-6"
      style={{
        background: 'var(--card)',
        border: '2px solid rgba(251, 191, 36, 0.3)',
        boxShadow: '0 0 50px rgba(251, 191, 36, 0.08)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className="rounded-2xl p-1 flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, var(--accent-warm), rgba(251,191,36,0.3))',
            boxShadow: '0 0 16px rgba(251,191,36,0.3)',
          }}
        >
          <Image
            src="/characters/director/Director_breathing-idle_south.gif"
            alt="The Director"
            width={76}
            height={76}
            unoptimized
            className="rounded-xl block"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
        <div>
          <p className="text-xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--accent-warm)' }}>
            The Director
          </p>
          <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(251,191,36,0.12)', color: 'var(--accent-warm)' }}>
            {emoji} {sceneLabel}
          </span>
        </div>
      </div>

      {/* Pitch-style format: Main conflict + Best move + Time needed */}
      <div className="space-y-5">
        <div className="rounded-xl p-4" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--accent-warm)' }}>
            Main conflict
          </p>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text)' }}>
            {moderator.overreacting_voice}
          </p>
        </div>

        <div className="rounded-xl p-4" style={{ background: 'rgba(192,132,252,0.06)', border: '1px solid rgba(192,132,252,0.15)' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
              Best stabilizing move
            </p>
            <button
              onClick={() => onPlayLine('moderator', moderator.best_move)}
              className="opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
              title="Play moderator voice"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-warm)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            </button>
          </div>
          <p className="text-base font-medium leading-relaxed" style={{ color: 'var(--text)' }}>
            {moderator.best_move}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl p-4" style={{ background: 'var(--surface)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-dim)' }}>
              Can wait
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {moderator.can_wait}
            </p>
          </div>
          <div className="rounded-xl p-4" style={{ background: 'var(--surface)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--danger)' }}>
              Do not do
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {moderator.do_not_do}
            </p>
          </div>
        </div>

        <p className="text-sm italic text-center px-4" style={{ color: 'var(--text-dim)' }}>
          {moderator.why_this_works}
        </p>
      </div>

      {/* Action button */}
      <button
        onClick={handleAction}
        className="w-full py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer"
        style={{
          background: moderator.action_type === 'draft' ? 'var(--accent-warm)' : 'transparent',
          color: moderator.action_type === 'draft' ? '#0c0b14' : 'var(--accent-warm)',
          border: moderator.action_type === 'draft' ? 'none' : '2px solid var(--accent-warm)',
        }}
      >
        {copied
          ? '✓ Copied'
          : moderator.action_type === 'timer'
            ? timerActive
              ? `⏱ ${Math.floor(timerSeconds / 60)}:${(timerSeconds % 60).toString().padStart(2, '0')} — tap to stop`
              : `Start ${moderator.action_draft}-min focus`
            : moderator.action_type === 'draft'
              ? 'Copy draft to clipboard'
              : 'Copy action'}
      </button>

      <p className="text-xs italic text-center" style={{ color: 'var(--text-dim)' }}>
        {moderator.scene_insight}
      </p>

      {/* Character row */}
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        {characters.map((c, i) => {
          const t = typeFromName(c.name)
          const img = CHARACTER_IMAGES[t]
          const charColor = CHAR_COLORS[t] ?? 'var(--border)'
          return (
            <button
              key={i}
              onClick={() => onCharacterTap({ type: t, name: c.name, line: c.line })}
              className="rounded-xl p-0.5 transition-all hover:scale-110 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${charColor}, ${charColor}55)`,
                boxShadow: `0 0 8px ${charColor}44`,
              }}
              title={`Talk to ${c.name}`}
            >
              {img ? (
                <Image src={img} alt={c.name} width={44} height={44} unoptimized className="rounded-lg block" style={{ imageRendering: 'pixelated' }} />
              ) : (
                <span className="text-xl w-11 h-11 flex items-center justify-center rounded-lg" style={{ background: 'var(--surface)' }}>{c.emoji}</span>
              )}
            </button>
          )
        })}
      </div>
      <p className="text-xs text-center" style={{ color: 'var(--text-dim)' }}>
        tap any character to continue the conversation
      </p>

      {!dimmed && (
        <div className="flex gap-3 pt-2">
          <button onClick={onShowRating} className="flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer transition-all" style={{ background: 'var(--primary)', color: '#0c0b14' }}>
            Rate your clarity
          </button>
          <button onClick={onReset} className="py-3 px-5 rounded-xl text-sm cursor-pointer transition-all" style={{ color: 'var(--text-dim)', border: '1px solid var(--border)' }}>
            Start fresh
          </button>
        </div>
      )}
    </motion.div>
  )
}
