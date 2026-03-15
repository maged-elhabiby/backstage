'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CHARACTER_IMAGES } from '@/lib/types'
import type { CharacterResponse } from '@/lib/types'
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

export default function OverwhelmRating({
  overwhelmBefore,
  onRate,
  overwhelmAfter,
  characters,
  castingTypes,
  onReset,
}: {
  overwhelmBefore: number
  onRate: (n: number) => void
  overwhelmAfter: number | null
  characters: CharacterResponse[]
  castingTypes: string[]
  onReset: () => void
}) {
  const [selected, setSelected] = useState(3)

  if (overwhelmAfter !== null) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl mt-6 rounded-2xl p-6 text-center space-y-6"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div className="space-y-2">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Your shift</p>
          <div className="flex items-center justify-center gap-4 text-3xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
            <span style={{ color: 'var(--danger)' }}>{overwhelmBefore}</span>
            <span className="text-lg" style={{ color: 'var(--text-dim)' }}>→</span>
            <span style={{ color: 'var(--success)' }}>{overwhelmAfter}</span>
          </div>
          <p className="text-sm italic" style={{ color: 'var(--text-dim)' }}>
            Brain noise {overwhelmBefore} → Clarity {overwhelmAfter}. That shift is the product.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Your voices today</p>
          <div className="flex justify-center gap-2">
            {characters.map((c, i) => {
              const t = castingTypes[i] ?? typeFromName(c.name)
              const img = CHARACTER_IMAGES[t]
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  {img ? (
                    <Image src={img} alt={c.name} width={40} height={40} unoptimized style={{ imageRendering: 'pixelated' }} />
                  ) : (
                    <span className="text-2xl">{c.emoji}</span>
                  )}
                  <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>{c.name.replace('The ', '')}</span>
                </div>
              )
            })}
          </div>
        </div>

        <button
          onClick={onReset}
          className="py-2.5 px-6 rounded-xl text-sm font-medium cursor-pointer transition-all"
          style={{ border: '1px solid var(--primary)', color: 'var(--primary)' }}
        >
          Start fresh
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xl mt-6 rounded-2xl p-6 space-y-4"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
        How clear is your next step now?
      </p>

      <div className="flex items-center justify-between gap-1.5">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
          const isSelected = n === selected
          const hue = n <= 3 ? 'var(--success)' : n <= 6 ? 'var(--primary)' : 'var(--danger)'
          return (
            <button
              key={n}
              onClick={() => setSelected(n)}
              className="w-9 h-9 rounded-full text-xs font-medium transition-all cursor-pointer"
              style={{
                background: isSelected ? hue : 'var(--surface)',
                color: isSelected ? '#0c0b14' : 'var(--text-dim)',
                boxShadow: isSelected ? `0 0 16px ${hue === 'var(--success)' ? '#86efac' : hue === 'var(--primary)' ? '#a78bfa' : '#fca5a5'}40` : 'none',
                transform: isSelected ? 'scale(1.15)' : 'scale(1)',
              }}
            >
              {n}
            </button>
          )
        })}
      </div>

      <button
        onClick={() => onRate(selected)}
        className="w-full py-3 rounded-xl text-sm font-medium cursor-pointer transition-all"
        style={{ background: 'var(--primary)', color: '#0c0b14' }}
      >
        Submit
      </button>
    </motion.div>
  )
}
