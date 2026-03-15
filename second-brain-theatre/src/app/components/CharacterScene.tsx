'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CHARACTER_IMAGES } from '@/lib/types'
import type { CharacterResponse } from '@/lib/types'
import Image from 'next/image'

const CHAR_COLORS: Record<string, string> = {
  firefighter: 'var(--char-firefighter)',
  perfectionist: 'var(--char-perfectionist)',
  avoider: 'var(--char-avoider)',
  engineer: 'var(--char-engineer)',
  future_you: 'var(--char-future-you)',
  body: 'var(--char-body)',
  people_pleaser: 'var(--char-people-pleaser)',
  critic: 'var(--char-critic)',
  dreamer: 'var(--char-dreamer)',
}

function typeFromName(name: string): string {
  const map: Record<string, string> = {
    'The Firefighter': 'firefighter',
    'The Perfectionist': 'perfectionist',
    'The Avoider': 'avoider',
    'The Engineer': 'engineer',
    'Future You': 'future_you',
    'The Body': 'body',
    'The People-Pleaser': 'people_pleaser',
    'The Critic': 'critic',
    'The Dreamer': 'dreamer',
  }
  return map[name] ?? name.toLowerCase().replace(/^the /, '').replace(/ /g, '_')
}

export default function CharacterScene({
  characters,
  castingTypes,
  loading,
  activeCharacter,
  onCharacterTap,
}: {
  characters: CharacterResponse[]
  castingTypes: string[]
  loading: boolean
  activeCharacter: string | null
  onCharacterTap: (c: { type: string; name: string; line: string }) => void
}) {
  const [visibleCount, setVisibleCount] = useState(0)

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex-1 flex items-center justify-center"
      >
        <motion.p
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-sm"
          style={{ color: 'var(--text-dim)' }}
        >
          voices appearing...
        </motion.p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full"
    >
      <div className="flex flex-wrap justify-center items-end gap-6 md:gap-10 px-4 py-8">
        <AnimatePresence>
          {characters.map((char, i) => {
            const charType = castingTypes[i] ?? typeFromName(char.name)
            const imgSrc = CHARACTER_IMAGES[charType]
            const color = CHAR_COLORS[charType] ?? 'var(--primary)'
            const isActive = activeCharacter === charType
            const isDimmed = activeCharacter !== null && !isActive

            return (
              <motion.div
                key={char.name}
                initial={{ opacity: 0, y: 60, scale: 0.8 }}
                animate={{
                  opacity: isDimmed ? 0.4 : 1,
                  y: 0,
                  scale: isDimmed ? 0.9 : 1,
                }}
                transition={{ delay: i * 0.8, duration: 0.7, type: 'spring', stiffness: 100 }}
                onAnimationComplete={() => {
                  if (i >= visibleCount) setVisibleCount(i + 1)
                }}
                onClick={() => onCharacterTap({ type: charType, name: char.name, line: char.line })}
                className="flex flex-col items-center cursor-pointer group"
                style={{ maxWidth: 200 }}
              >
                {/* Speech bubble */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.8 + 0.4, duration: 0.5 }}
                  className="relative mb-2 px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[220px]"
                  style={{
                    background: 'rgba(26, 23, 38, 0.92)',
                    border: `2px solid ${color}`,
                    color: 'var(--text)',
                    boxShadow: `0 0 16px ${color}33`,
                  }}
                >
                  <p>&ldquo;{char.line}&rdquo;</p>
                  <span
                    className="block mt-1.5 text-[10px] uppercase tracking-wider font-medium"
                    style={{ color }}
                  >
                    protecting {char.protecting}
                  </span>

                  {/* Bubble tail */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0"
                    style={{
                      borderLeft: '8px solid transparent',
                      borderRight: '8px solid transparent',
                      borderTop: `8px solid ${color}`,
                    }}
                  />
                </motion.div>

                {/* Sprite */}
                <motion.div
                  animate={isActive ? { y: [0, -6, 0] } : {}}
                  transition={isActive ? { duration: 0.6, repeat: Infinity, repeatType: 'loop' } : {}}
                  className="relative"
                >
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={char.name}
                      width={160}
                      height={160}
                      unoptimized
                      className="transition-all group-hover:brightness-125"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  ) : (
                    <span
                      className="text-7xl block w-40 h-40 flex items-center justify-center rounded-full"
                      style={{ background: `${color}22` }}
                    >
                      {char.emoji}
                    </span>
                  )}
                </motion.div>

                {/* Name */}
                <p
                  className="mt-2 text-sm font-semibold tracking-wide"
                  style={{ color, fontFamily: 'var(--font-playfair)' }}
                >
                  {char.name}
                </p>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: characters.length * 0.8 + 0.5 }}
        className="text-center text-xs pb-4"
        style={{ color: 'var(--text-dim)' }}
      >
        tap any character to talk to them
      </motion.p>
    </motion.div>
  )
}
