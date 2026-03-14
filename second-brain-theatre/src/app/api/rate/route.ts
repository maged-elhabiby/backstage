import { createClient } from '@/lib/supabase/server'
import { updateOverwhelmAfter } from '@/lib/supabase/queries'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { sceneId, overwhelm_after } = await request.json()

  try {
    await updateOverwhelmAfter(supabase, sceneId, overwhelm_after)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('rate error:', err)
    return NextResponse.json({ error: 'Failed to save rating' }, { status: 500 })
  }
}
