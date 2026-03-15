import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Theatre from './components/Theatre'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return <Theatre userEmail={user.email ?? ''} />
}
