'use client'

import { motion } from 'framer-motion'
import { SCENE_LABEL_EMOJIS } from '@/lib/types'

export default function FreezeFrame({
  freezeFrame,
  sceneLabel,
}: {
  freezeFrame: string
  sceneLabel: string
}) {
  const emoji = SCENE_LABEL_EMOJIS[sceneLabel] ?? '🌀'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-lg text-center space-y-6"
      >
        <motion.div
          animate={{ scale: [1, 1.01, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="rounded-2xl p-8 space-y-5"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs tracking-widest uppercase"
            style={{ background: 'rgba(167,139,250,0.1)', color: 'var(--primary)' }}
          >
            {emoji} {sceneLabel}
          </span>

          <p className="text-xl leading-relaxed italic" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}>
            &ldquo;{freezeFrame}&rdquo;
          </p>
        </motion.div>

        <motion.p
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-sm"
          style={{ color: 'var(--text-dim)' }}
        >
          listening for the loudest voices...
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
