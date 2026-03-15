'use client'

import { motion } from 'framer-motion'

export default function BrainDumpInput({
  onSubmit,
  loading,
  error,
  value,
  onChange,
  onDemo,
}: {
  onSubmit: (brainDump: string, overwhelmBefore: number) => void
  loading: boolean
  error: string | null
  value: string
  onChange: (v: string) => void
  onDemo: () => void
}) {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex flex-col items-center justify-center px-4"
      >
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-center space-y-3"
        >
          <p className="text-2xl" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary)' }}>
            Casting your inner voices...
          </p>
          <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
            listening to the noise
          </p>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
    >
      <div className="w-full max-w-2xl space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--accent-warm)' }}>
            Second Brain Theatre
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Your brain isn&apos;t broken — it&apos;s in conflict.
          </p>
        </div>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Dump everything here. The messy, panicked, honest version. Every task, every worry, every nagging thought..."
          rows={6}
          className="w-full rounded-2xl px-6 py-5 text-base leading-relaxed resize-none focus:outline-none transition-all"
          style={{
            background: 'var(--surface)',
            border: '2px solid var(--border)',
            color: 'var(--text)',
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
        />

        <motion.button
          onClick={() => value.trim().length >= 10 && onSubmit(value, 7)}
          disabled={value.trim().length < 10}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-2xl font-semibold text-lg transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, #a855f7 100%)',
            color: '#0c0b14',
            boxShadow: value.trim().length >= 10 ? '0 0 30px rgba(192,132,252,0.3)' : 'none',
          }}
        >
          My brain is loud
        </motion.button>

        {error && (
          <p className="text-center text-sm" style={{ color: 'var(--danger)' }}>
            {error}
          </p>
        )}

        <button
          onClick={onDemo}
          className="fixed top-4 right-16 flex items-center gap-1.5 text-xs opacity-30 hover:opacity-80 transition-opacity cursor-pointer"
          style={{ color: 'var(--accent-warm)' }}
        >
          ▶ Demo
        </button>
      </div>
    </motion.div>
  )
}
