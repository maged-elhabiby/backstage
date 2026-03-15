import { createClient } from '@/lib/supabase/server'
import Theatre from './components/Theatre'
import Landing from './components/Landing'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return <Landing />
  return <Theatre userEmail={user.email ?? ''} />
}
