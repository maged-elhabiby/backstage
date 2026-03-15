'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CHARACTER_IMAGES, SCENE_LABEL_EMOJIS } from '@/lib/types'
import type { CharacterResponse, ModeratorResponse } from '@/lib/types'
import Image from 'next/image'

function typeFromName(name: string): string {
  const map: Record<string, string> = {
    'The Firefighter': 'firefighter', 'The Perfectionist': 'perfectionist',
    'The Avoider': 'avoider', 'The Engineer': 'engineer', 'Future You': 'future_you',
    'The Body': 'body', 'The People-Pleaser': 'people_pleaser',
    'The Critic': 'critic', 'The Dreamer': 'dreamer',
  }
  return map[name] ?? name.toLowerCase().replace(/^the /, '').replace(/ /g, '_')
}

export default function ModeratorCard({
  moderator,
  sceneLabel,
  characters,
  onCharacterTap,
  onReset,
  onShowRating,
  dimmed,
}: {
  moderator: ModeratorResponse
  sceneLabel: string
  characters: CharacterResponse[]
  onCharacterTap: (c: { type: string; name: string; line: string }) => void
  onReset: () => void
  onShowRating: () => void
  dimmed: boolean
}) {
  const [copied, setCopied] = useState(false)
  const emoji = SCENE_LABEL_EMOJIS[sceneLabel] ?? '🌀'

  const handleAction = () => {
    if (moderator.action_type === 'draft' || moderator.action_type === 'copy') {
      navigator.clipboard.writeText(moderator.action_draft)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
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
        <Image
          src="/characters/moderator/moderator.gif"
          alt="Moderator"
          width={80}
          height={80}
          unoptimized
          style={{ imageRendering: 'pixelated' }}
        />
        <div>
          <p className="text-xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--accent-warm)' }}>
            The Moderator
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
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--primary)' }}>
            Best stabilizing move
          </p>
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
        {copied ? '✓ Copied' : moderator.action_type === 'timer' ? `Start ${moderator.action_draft}-min focus` : moderator.action_type === 'draft' ? 'Copy draft to clipboard' : 'Copy action'}
      </button>

      <p className="text-xs italic text-center" style={{ color: 'var(--text-dim)' }}>
        {moderator.scene_insight}
      </p>

      {/* Character row */}
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        {characters.map((c, i) => {
          const t = typeFromName(c.name)
          const img = CHARACTER_IMAGES[t]
          return (
            <button
              key={i}
              onClick={() => onCharacterTap({ type: t, name: c.name, line: c.line })}
              className="rounded-full p-1.5 transition-all hover:scale-110 cursor-pointer"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              title={`Talk to ${c.name}`}
            >
              {img ? (
                <Image src={img} alt={c.name} width={44} height={44} unoptimized style={{ imageRendering: 'pixelated' }} />
              ) : (
                <span className="text-xl w-11 h-11 flex items-center justify-center">{c.emoji}</span>
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
