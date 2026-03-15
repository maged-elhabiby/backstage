'use client'

import { useRef, useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { useRecorder } from '@/app/hooks/useRecorder'

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
  const valueRef = useRef(value)
  valueRef.current = value

  const handleAutoStop = useCallback((text: string) => {
    if (text) onChange(valueRef.current + (valueRef.current ? ' ' : '') + text)
  }, [onChange])

  const { recording, transcribing, error: micError, startRecording, stopRecording } = useRecorder({ onAutoStop: handleAutoStop })
  const [overwhelm, setOverwhelm] = useState(5)

  const handleMicToggle = async () => {
    if (recording) {
      const text = await stopRecording()
      if (text) onChange(value + (value ? ' ' : '') + text)
    } else {
      await startRecording()
    }
  }

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

        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={transcribing ? 'Transcribing...' : 'Dump everything here. The messy, panicked, honest version. Every task, every worry, every nagging thought...'}
            rows={6}
            className="w-full rounded-2xl px-6 py-5 pr-14 text-base leading-relaxed resize-none focus:outline-none transition-all"
            style={{
              background: 'var(--surface)',
              border: `2px solid ${recording ? 'var(--danger, #ef4444)' : 'var(--border)'}`,
              color: 'var(--text)',
            }}
            onFocus={(e) => { if (!recording) e.target.style.borderColor = 'var(--primary)' }}
            onBlur={(e) => { if (!recording) e.target.style.borderColor = 'var(--border)' }}
          />

          <motion.button
            type="button"
            onClick={handleMicToggle}
            disabled={transcribing}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-3 top-3 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all disabled:opacity-40"
            style={{
              background: recording
                ? 'var(--danger, #ef4444)'
                : 'rgba(192,132,252,0.15)',
              color: recording ? '#fff' : 'var(--primary)',
            }}
            title={transcribing ? 'Transcribing...' : 'Record voice'}
          >
            {transcribing ? (
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="text-sm"
              >
                ···
              </motion.span>
            ) : recording ? (
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="3" y="3" width="10" height="10" rx="2" />
                </svg>
              </motion.span>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="1" width="6" height="12" rx="3" />
                <path d="M5 10a7 7 0 0 0 14 0" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            )}
          </motion.button>

        </div>

        {value.trim().length >= 10 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                How overwhelmed do you feel?
              </p>
              <span className="text-2xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary)' }}>
                {overwhelm}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={overwhelm}
              onChange={(e) => setOverwhelm(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
              style={{ accentColor: 'var(--primary)' }}
            />
            <div className="flex justify-between text-xs" style={{ color: 'var(--text-dim)' }}>
              <span>a little noisy</span>
              <span>completely drowning</span>
            </div>
          </motion.div>
        )}

        <motion.button
          onClick={() => value.trim().length >= 10 && onSubmit(value, overwhelm)}
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

        {(error || micError) && (
          <p className="text-center text-sm" style={{ color: 'var(--danger)' }}>
            {error || micError}
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
