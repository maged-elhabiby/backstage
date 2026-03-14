import { createClient } from '@/lib/supabase/server'
import { saveScene, saveCharacters } from '@/lib/supabase/queries'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { brain_dump, freeze_frame, scene_label, characters, moderator, overwhelm_before } = body

  try {
    const sceneId = await saveScene(supabase, {
      brain_dump,
      freeze_frame,
      scene_label,
      best_move: moderator?.best_move,
      can_wait: moderator?.can_wait,
      why_this_works: moderator?.why_this_works,
      do_not_do: moderator?.do_not_do,
      scene_insight: moderator?.scene_insight,
      overreacting_voice: moderator?.overreacting_voice,
      main_conflict: moderator?.overreacting_voice ?? scene_label,
      overwhelm_before,
    })

    if (characters?.length) {
      await saveCharacters(supabase, sceneId, characters)
    }

    return NextResponse.json({ sceneId })
  } catch (err) {
    console.error('save-scene error:', err)
    return NextResponse.json({ error: 'Failed to save scene' }, { status: 500 })
  }
}
