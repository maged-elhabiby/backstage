'use client'

import { createClient } from '@/lib/supabase/client'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import { useState } from 'react'

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700'] })
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500'] })

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const supabase = createClient()

  async function signInWithGoogle() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  async function signInWithEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    setMessage('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })
    if (error) {
      setError(error.message)
    } else {
      setMessage('Check your email for the magic link.')
    }
    setLoading(false)
  }

  return (
    <div className={`${dmSans.className} min-h-screen flex items-center justify-center px-4`}
      style={{ background: '#0a0a0f' }}>
      <div className="w-full max-w-md rounded-2xl border border-amber-900/30 p-8"
        style={{ background: 'linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%)' }}>

        <h1 className={`${playfair.className} text-4xl font-bold text-center mb-2`}
          style={{ color: '#d97706' }}>
          Second Brain Theatre
        </h1>
        <p className="text-center text-gray-400 text-sm mb-8">
          a conflict-resolution interface for overwhelmed minds
        </p>

        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full py-3 px-4 rounded-lg font-medium text-sm transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          style={{ background: '#7f1d1d', color: '#fbbf24' }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-700" />
          <span className="text-gray-500 text-xs">or</span>
          <div className="flex-1 h-px bg-gray-700" />
        </div>

        <form onSubmit={signInWithEmail} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full py-3 px-4 rounded-lg text-sm bg-white/5 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-700 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full py-3 px-4 rounded-lg font-medium text-sm transition-all disabled:opacity-50 cursor-pointer"
            style={{ background: '#d97706', color: '#0a0a0f' }}
          >
            {loading ? 'Sending...' : 'Send magic link'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-green-400">{message}</p>
        )}
        {error && (
          <p className="mt-4 text-center text-sm text-red-400">{error}</p>
        )}
      </div>
    </div>
  )
}
