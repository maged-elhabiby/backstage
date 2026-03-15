'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CHARACTER_IMAGES } from '@/lib/types'
import type { FollowUpMessage } from '@/lib/types'
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

const HARDCODED_REPLIES: Record<string, string> = {
  firefighter: "I hear you, but can we at least send the one email? Just the one. Then we can breathe.",
  perfectionist: "I know it feels rushed, but done is better than perfect when the alternative is nothing.",
  avoider: "Maybe you're right. But can we agree on one small thing before we 'rest'?",
  engineer: "Interesting. So you see the pattern too. What's one thing we could change about the system?",
  future_you: "Tomorrow-you is listening. What would make them grateful?",
  body: "I'm not going anywhere. Eat something. Then we'll figure out the rest.",
  people_pleaser: "They'll understand. People are more forgiving than we give them credit for.",
  critic: "Fair point. Maybe I'm being too hard on us. But the observation stands.",
  dreamer: "I'm not saying burn it all down. I'm saying... notice what lights up and what drains.",
}

export default function FollowUpChat({
  character,
  sceneId,
  onClose,
}: {
  character: { type: string; name: string; line: string }
  sceneId: string | null
  onClose: () => void
}) {
  const [messages, setMessages] = useState<FollowUpMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const img = CHARACTER_IMAGES[character.type]
  const color = CHAR_COLORS[character.type] ?? 'var(--primary)'

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading || messages.length >= 20) return
    const userMsg: FollowUpMessage = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sceneId,
          characterType: character.type,
          originalLine: character.line,
          messages: newMessages,
        }),
      })
      const data = res.ok ? await res.json() : null
      const reply = data?.reply ?? HARDCODED_REPLIES[character.type] ?? "I've said my piece."
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'character', content: reply }])
        setLoading(false)
      }, 300)
    } catch {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'character', content: HARDCODED_REPLIES[character.type] ?? "I've said my piece." }])
        setLoading(false)
      }, 300)
    }
  }

  const atLimit = messages.length >= 20

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="w-full max-w-2xl mx-auto overflow-hidden"
    >
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'var(--card)',
          border: `2px solid ${color}`,
          boxShadow: `0 0 24px ${color}22`,
        }}
      >
        {/* Header */}
        <div className="px-5 py-3 flex items-center gap-3" style={{ borderBottom: `1px solid ${color}33` }}>
          <div className="flex-shrink-0">
            {img ? (
              <Image src={img} alt={character.name} width={48} height={48} unoptimized style={{ imageRendering: 'pixelated' }} />
            ) : (
              <span className="text-3xl">🎭</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm" style={{ fontFamily: 'var(--font-playfair)', color }}>
              Talking to {character.name}
            </p>
            <p className="text-xs italic truncate" style={{ color: 'var(--text-dim)' }}>
              &ldquo;{character.line}&rdquo;
            </p>
          </div>
          <button onClick={onClose} className="text-lg cursor-pointer hover:opacity-70 transition-opacity" style={{ color: 'var(--text-secondary)' }}>
            ×
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="max-h-64 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <p className="text-center text-xs italic py-4" style={{ color: 'var(--text-dim)' }}>
              Say something to {character.name}...
            </p>
          )}
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                style={{
                  background: m.role === 'user' ? 'rgba(192,132,252,0.15)' : 'var(--surface)',
                  color: 'var(--text)',
                  border: m.role === 'character' ? `1px solid ${color}44` : undefined,
                  borderTopRightRadius: m.role === 'user' ? '4px' : undefined,
                  borderTopLeftRadius: m.role === 'character' ? '4px' : undefined,
                }}
              >
                {m.content}
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="rounded-2xl px-4 py-2.5 text-sm" style={{ background: 'var(--surface)', color: 'var(--text-dim)' }}>
                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity }}>
                  thinking...
                </motion.span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="px-4 py-3" style={{ borderTop: `1px solid ${color}22` }}>
          {atLimit ? (
            <p className="text-center text-xs italic" style={{ color: 'var(--text-dim)' }}>
              I&apos;ve said my piece. Talk to another voice, or trust the Moderator.
            </p>
          ) : (
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder={`Say something to ${character.name}...`}
                className="flex-1 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                style={{
                  background: 'var(--surface)',
                  border: `1px solid ${color}33`,
                  color: 'var(--text)',
                }}
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-40 transition-all"
                style={{ background: color, color: '#0c0b14' }}
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
