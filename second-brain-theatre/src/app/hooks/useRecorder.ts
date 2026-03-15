'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

const SILENCE_THRESHOLD = 10
const SILENCE_DURATION_MS = 1800
const MAX_RECORDING_MS = 30000
const CHECK_INTERVAL_MS = 150

export function useRecorder({ onAutoStop }: { onAutoStop?: (text: string) => void } = {}) {
  const [recording, setRecording] = useState(false)
  const [transcribing, setTranscribing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const silenceTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const maxTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasSpokenRef = useRef(false)
  const silenceStartRef = useRef<number | null>(null)
  const stoppingRef = useRef(false)
  const onAutoStopRef = useRef(onAutoStop)

  useEffect(() => {
    onAutoStopRef.current = onAutoStop
  }, [onAutoStop])

  const transcribe = useCallback(async (chunks: Blob[], mimeType: string): Promise<string> => {
    setTranscribing(true)
    try {
      const blob = new Blob(chunks, { type: mimeType })
      if (blob.size < 1000) {
        setTranscribing(false)
        return ''
      }
      const formData = new FormData()
      formData.append('audio', blob)

      const res = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Transcription failed')
      const { text } = await res.json()
      setTranscribing(false)
      return text ?? ''
    } catch {
      setTranscribing(false)
      setError('Transcription failed')
      return ''
    }
  }, [])

  const cleanup = useCallback(() => {
    if (silenceTimerRef.current) {
      clearInterval(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
    if (maxTimerRef.current) {
      clearTimeout(maxTimerRef.current)
      maxTimerRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {})
      audioContextRef.current = null
    }
    analyserRef.current = null
    silenceStartRef.current = null
    hasSpokenRef.current = false
    stoppingRef.current = false
  }, [])

  const doAutoStop = useCallback(async () => {
    if (stoppingRef.current) return
    stoppingRef.current = true

    const recorder = recorderRef.current
    const stream = recorder?.stream

    cleanup()

    if (!recorder || recorder.state === 'inactive') {
      setRecording(false)
      return
    }

    const mimeType = recorder.mimeType

    await new Promise<void>((resolve) => {
      recorder.onstop = () => resolve()
      recorder.stop()
    })

    stream?.getTracks().forEach((t) => t.stop())
    setRecording(false)

    const text = await transcribe([...chunksRef.current], mimeType)
    if (text && onAutoStopRef.current) {
      onAutoStopRef.current(text)
    }
  }, [cleanup, transcribe])

  const startRecording = useCallback(async () => {
    setError(null)
    stoppingRef.current = false

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4',
      })
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.5
      source.connect(analyser)

      audioContextRef.current = audioContext
      analyserRef.current = analyser
      silenceStartRef.current = null
      hasSpokenRef.current = false

      recorderRef.current = recorder
      recorder.start(250)
      setRecording(true)

      const dataArray = new Uint8Array(analyser.frequencyBinCount)

      silenceTimerRef.current = setInterval(() => {
        if (!analyserRef.current || stoppingRef.current) return

        analyserRef.current.getByteTimeDomainData(dataArray)

        let maxDeviation = 0
        for (let i = 0; i < dataArray.length; i++) {
          const deviation = Math.abs(dataArray[i] - 128)
          if (deviation > maxDeviation) maxDeviation = deviation
        }

        if (maxDeviation > SILENCE_THRESHOLD) {
          hasSpokenRef.current = true
          silenceStartRef.current = null
        } else if (hasSpokenRef.current) {
          if (silenceStartRef.current === null) {
            silenceStartRef.current = Date.now()
          } else if (Date.now() - silenceStartRef.current >= SILENCE_DURATION_MS) {
            doAutoStop()
          }
        }
      }, CHECK_INTERVAL_MS)

      maxTimerRef.current = setTimeout(() => {
        doAutoStop()
      }, MAX_RECORDING_MS)

    } catch {
      setError('Microphone access denied')
    }
  }, [cleanup, doAutoStop, transcribe])

  const stopRecording = useCallback(async (): Promise<string> => {
    if (stoppingRef.current) return ''
    stoppingRef.current = true

    const recorder = recorderRef.current
    const stream = recorder?.stream

    cleanup()

    if (!recorder || recorder.state === 'inactive') {
      setRecording(false)
      return ''
    }

    const mimeType = recorder.mimeType

    await new Promise<void>((resolve) => {
      recorder.onstop = () => resolve()
      recorder.stop()
    })

    stream?.getTracks().forEach((t) => t.stop())
    setRecording(false)

    return transcribe([...chunksRef.current], mimeType)
  }, [cleanup, transcribe])

  useEffect(() => () => {
    cleanup()
    const recorder = recorderRef.current
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop()
      recorder.stream.getTracks().forEach((t) => t.stop())
    }
  }, [cleanup])

  return { recording, transcribing, error, startRecording, stopRecording }
}
