'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CHARACTER_IMAGES } from '@/lib/types'
import Image from 'next/image'

type Stats = {
  character_type: string
  character_name: string
  emoji: string | null
  appearance_count: number
  avg_intensity: number | null
  most_common_protecting: string | null
}

type InsightsData = {
  stats: Stats[]
  total_scenes: number
  avg_improvement: number | null
  most_common_label: string | null
  insights: string[]
  message?: string
}

export default function CastHistory({ onClose }: { onClose: () => void }) {
  const [data, setData] = useState<InsightsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/insights')
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const maxCount = data?.stats?.length ? Math.max(...data.stats.map(s => s.appearance_count)) : 1

  return (
    <motion.div
      initial={{ x: -420 }}
      animate={{ x: 0 }}
      exit={{ x: -420 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 h-full w-full max-w-[420px] flex flex-col z-50 overflow-y-auto"
      style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}
    >
      <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
        <p className="font-medium" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary)' }}>
          Your Recurring Cast
        </p>
        <button onClick={onClose} className="text-lg cursor-pointer" style={{ color: 'var(--text-secondary)' }}>×</button>
      </div>

      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <motion.p animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity }}
            className="text-sm" style={{ color: 'var(--text-dim)' }}>Loading your cast...</motion.p>
        </div>
      )}

      {!loading && data && (
        <div className="p-4 space-y-6">
          {data.stats.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>Characters</p>
              {data.stats
                .sort((a, b) => b.appearance_count - a.appearance_count)
                .map((s) => {
                  const img = CHARACTER_IMAGES[s.character_type]
                  return (
                    <div key={s.character_type} className="rounded-xl p-3 flex items-center gap-3" style={{ background: 'var(--card)' }}>
                      {img ? (
                        <Image src={img} alt={s.character_name} width={36} height={36} unoptimized style={{ imageRendering: 'pixelated' }} />
                      ) : (
                        <span className="text-xl w-9 h-9 flex items-center justify-center">{s.emoji}</span>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{s.character_name}</p>
                          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>×{s.appearance_count}</span>
                        </div>
                        {s.most_common_protecting && (
                          <p className="text-xs italic" style={{ color: 'var(--text-dim)' }}>protecting {s.most_common_protecting}</p>
                        )}
                        <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg)' }}>
                          <div className="h-full rounded-full transition-all" style={{
                            width: `${(s.appearance_count / maxCount) * 100}%`,
                            background: 'var(--primary)',
                          }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3 text-center" style={{ background: 'var(--card)' }}>
              <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary)' }}>
                {data.total_scenes}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>sessions</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: 'var(--card)' }}>
              <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--success)' }}>
                {data.avg_improvement !== null ? `${data.avg_improvement > 0 ? '+' : ''}${data.avg_improvement}` : '—'}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>avg clarity shift</p>
            </div>
          </div>

          {data.most_common_label && (
            <div className="rounded-xl p-3 text-center" style={{ background: 'var(--card)' }}>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Most common pattern</p>
              <p className="text-lg font-medium" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}>
                {data.most_common_label}
              </p>
            </div>
          )}

          {data.insights.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>Patterns</p>
              {data.insights.map((insight, i) => (
                <p key={i} className="text-sm italic rounded-xl p-3" style={{ background: 'var(--card)', color: 'var(--text-secondary)' }}>
                  {insight}
                </p>
              ))}
            </div>
          )}

          {data.message && (
            <p className="text-sm text-center italic" style={{ color: 'var(--text-dim)' }}>
              {data.message}
            </p>
          )}
        </div>
      )}

      {!loading && !data && (
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-sm text-center" style={{ color: 'var(--text-dim)' }}>
            Complete your first session to start building your cast.
          </p>
        </div>
      )}
    </motion.div>
  )
}
