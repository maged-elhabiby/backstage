'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

type QueueItem = { type: string; line: string }

export function useVoice() {
  const [playingCharacter, setPlayingCharacter] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const queueRef = useRef<QueueItem[]>([])
  const playingRef = useRef(false)

  const stop = useCallback(() => {
    queueRef.current = []
    playingRef.current = false
    abortRef.current?.abort()
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setPlayingCharacter(null)
  }, [])

  const playLine = useCallback(async (characterType: string, line: string): Promise<void> => {
    stop()

    setPlayingCharacter(characterType)
    abortRef.current = new AbortController()

    try {
      const params = new URLSearchParams({ character: characterType, line })
      const res = await fetch(`/api/voice?${params}`, {
        signal: abortRef.current.signal,
      })
      if (!res.ok) throw new Error('Voice fetch failed')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)

      return new Promise<void>((resolve) => {
        const audio = new Audio(url)
        audioRef.current = audio

        audio.onended = () => {
          URL.revokeObjectURL(url)
          audioRef.current = null
          setPlayingCharacter(null)
          resolve()
        }

        audio.onerror = () => {
          URL.revokeObjectURL(url)
          audioRef.current = null
          setPlayingCharacter(null)
          resolve()
        }

        audio.play().catch(() => {
          URL.revokeObjectURL(url)
          setPlayingCharacter(null)
          resolve()
        })
      })
    } catch {
      setPlayingCharacter(null)
    }
  }, [stop])

  const playSequence = useCallback(async (items: QueueItem[]) => {
    queueRef.current = [...items]
    playingRef.current = true

    for (const item of items) {
      if (!playingRef.current) break
      queueRef.current = queueRef.current.slice(1)

      setPlayingCharacter(item.type)
      abortRef.current = new AbortController()

      try {
        const params = new URLSearchParams({ character: item.type, line: item.line })
        const res = await fetch(`/api/voice?${params}`, {
          signal: abortRef.current.signal,
        })
        if (!res.ok) continue

        const blob = await res.blob()
        const url = URL.createObjectURL(blob)

        await new Promise<void>((resolve) => {
          const audio = new Audio(url)
          audioRef.current = audio

          audio.onended = () => {
            URL.revokeObjectURL(url)
            audioRef.current = null
            resolve()
          }
          audio.onerror = () => {
            URL.revokeObjectURL(url)
            audioRef.current = null
            resolve()
          }
          audio.play().catch(() => {
            URL.revokeObjectURL(url)
            resolve()
          })
        })
      } catch {
        continue
      }
    }

    playingRef.current = false
    setPlayingCharacter(null)
  }, [])

  useEffect(() => () => stop(), [stop])

  return { playLine, playSequence, playingCharacter, stop }
}
