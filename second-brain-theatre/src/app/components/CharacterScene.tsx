'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CHARACTER_IMAGES } from '@/lib/types'
import type { CharacterResponse } from '@/lib/types'
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

export default function CharacterScene({
  characters,
  castingTypes,
  loading,
  activeCharacter,
  playingCharacter,
  onPlayLine,
  onPlaySequence,
  onStop,
  onCharacterTap,
}: {
  characters: CharacterResponse[]
  castingTypes: string[]
  loading: boolean
  activeCharacter: string | null
  playingCharacter: string | null
  onPlayLine: (characterType: string, line: string) => Promise<void>
  onPlaySequence: (items: { type: string; line: string }[]) => Promise<void>
  onStop: () => void
  onCharacterTap: (c: { type: string; name: string; line: string }) => void
}) {
  const [visibleCount, setVisibleCount] = useState(0)
  const hasAutoPlayed = useRef(false)

  useEffect(() => {
    if (characters.length > 0 && !hasAutoPlayed.current) {
      hasAutoPlayed.current = true
      const items = characters.map((char, i) => ({
        type: castingTypes[i] ?? typeFromName(char.name),
        line: char.line,
      }))
      const timer = setTimeout(() => onPlaySequence(items), characters.length * 200 + 400)
      return () => clearTimeout(timer)
    }
  }, [characters, castingTypes, onPlaySequence])

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
            const isSpeaking = playingCharacter === charType
            const isDimmed = (activeCharacter !== null && !isActive) || (playingCharacter !== null && !isSpeaking)

            return (
              <motion.div
                key={char.name}
                initial={{ opacity: 0, y: 60, scale: 0.8 }}
                animate={{
                  opacity: isDimmed ? 0.35 : 1,
                  y: isDimmed ? 24 : 0,
                  scale: isDimmed ? 0.82 : 1,
                  filter: isDimmed ? 'blur(1px)' : 'blur(0px)',
                }}
                transition={{
                  delay: i * 0.2,
                  duration: isDimmed ? 0.25 : 0.4,
                  type: 'spring',
                  stiffness: 200,
                  damping: 22,
                }}
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
                  animate={isSpeaking
                    ? { opacity: 1, y: 0, boxShadow: [`0 0 16px ${color}33`, `0 0 28px ${color}66`, `0 0 16px ${color}33`] }
                    : { opacity: 1, y: 0 }
                  }
                  transition={isSpeaking
                    ? { boxShadow: { duration: 1.2, repeat: Infinity }, delay: i * 0.2 + 0.2, duration: 0.3 }
                    : { delay: i * 0.2 + 0.2, duration: 0.3 }
                  }
                  className="relative mb-2 px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[220px]"
                  style={{
                    background: 'rgba(26, 23, 38, 0.92)',
                    border: `2px solid ${isSpeaking ? color : color}`,
                    color: 'var(--text)',
                    boxShadow: isSpeaking ? `0 0 28px ${color}66` : `0 0 16px ${color}33`,
                  }}
                >
                  <p>&ldquo;{char.line}&rdquo;</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span
                      className="text-[10px] uppercase tracking-wider font-medium"
                      style={{ color }}
                    >
                      protecting {char.protecting}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (isSpeaking) {
                          onStop()
                        } else {
                          onPlayLine(charType, char.line)
                        }
                      }}
                      className="ml-2 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
                      title={isSpeaking ? `Stop ${char.name}` : `Play ${char.name}'s voice`}
                    >
                      {isSpeaking ? (
                        <motion.span
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill={color} stroke="none">
                            <rect x="4" y="4" width="6" height="16" rx="1" />
                            <rect x="14" y="4" width="6" height="16" rx="1" />
                          </svg>
                        </motion.span>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                        </svg>
                      )}
                    </button>
                  </div>

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
                  animate={(isActive || isSpeaking) ? { y: [0, -6, 0] } : {}}
                  transition={(isActive || isSpeaking) ? { duration: 0.6, repeat: Infinity, repeatType: 'loop' } : {}}
                  className="relative"
                >
                  {imgSrc ? (
                    <div
                      className="rounded-2xl p-1"
                      style={{
                        background: `linear-gradient(135deg, ${color}, ${color}44)`,
                        boxShadow: isSpeaking
                          ? `0 0 20px ${color}88, 0 0 40px ${color}44`
                          : `0 0 10px ${color}33`,
                      }}
                    >
                      <Image
                        src={imgSrc}
                        alt={char.name}
                        width={156}
                        height={156}
                        unoptimized
                        className="rounded-xl transition-all group-hover:brightness-125 block"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    </div>
                  ) : (
                    <span
                      className="text-7xl block w-40 h-40 flex items-center justify-center rounded-full"
                      style={{ background: `${color}22`, border: `2px solid ${color}` }}
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
        transition={{ delay: characters.length * 0.2 + 0.3 }}
        className="text-center text-xs pb-4"
        style={{ color: 'var(--text-dim)' }}
      >
        tap any character to talk to them
      </motion.p>
    </motion.div>
  )
}
