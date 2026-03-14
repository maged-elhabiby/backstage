import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: '#0a0a0f' }}>
      <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)', color: '#d97706' }}>
        Second Brain Theatre
      </h1>
      <p className="text-gray-400 text-sm mb-8">
        Logged in as {user.email}
      </p>
      <p className="text-gray-500 text-sm">
        Waiting for Person A&apos;s UI and Person B&apos;s agents...
      </p>
    </div>
  )
}
