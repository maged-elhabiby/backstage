import type { SupabaseClient } from '@supabase/supabase-js'
import type { CharacterStat } from './database.types'

interface CharacterInput {
  type?: string
  name: string
  emoji?: string
  line: string
  protecting?: string
  intensity?: number
}

export async function saveScene(
  supabase: SupabaseClient,
  data: {
    brain_dump: string
    freeze_frame?: string
    scene_label?: string
    main_conflict?: string
    best_move?: string
    can_wait?: string
    why_this_works?: string
    do_not_do?: string
    scene_insight?: string
    overreacting_voice?: string
    overwhelm_before?: number
  }
) {
  const { data: user } = await supabase.auth.getUser()
  const { data: scene, error } = await supabase
    .from('scenes')
    .insert({ ...data, user_id: user.user!.id })
    .select('id')
    .single()

  if (error) throw error
  return scene.id as string
}

export async function saveCharacters(
  supabase: SupabaseClient,
  sceneId: string,
  characters: CharacterInput[]
) {
  const rows = characters.map((c) => ({
    scene_id: sceneId,
    character_type: c.type ?? c.name,
    character_name: c.name,
    emoji: c.emoji ?? null,
    original_line: c.line,
    protecting_value: c.protecting ?? null,
    intensity: c.intensity ?? null,
  }))

  const { error } = await supabase.from('scene_characters').insert(rows)
  if (error) throw error
}

export async function saveFollowUpMessage(
  supabase: SupabaseClient,
  sceneId: string,
  characterType: string,
  role: 'user' | 'character',
  content: string
) {
  const { error } = await supabase.from('followup_messages').insert({
    scene_id: sceneId,
    character_type: characterType,
    role,
    content,
  })
  if (error) throw error
}

export async function updateOverwhelmAfter(
  supabase: SupabaseClient,
  sceneId: string,
  rating: number
) {
  const { error } = await supabase
    .from('scenes')
    .update({ overwhelm_after: rating })
    .eq('id', sceneId)

  if (error) throw error
}

export async function getCharacterStats(
  supabase: SupabaseClient
): Promise<CharacterStat[]> {
  const { data, error } = await supabase.from('character_stats').select('*')
  if (error) throw error
  return (data ?? []) as CharacterStat[]
}

export async function getRecentScenes(
  supabase: SupabaseClient,
  limit = 10
) {
  const { data, error } = await supabase
    .from('scenes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data ?? []
}

export async function getSceneCount(supabase: SupabaseClient): Promise<number> {
  const { count, error } = await supabase
    .from('scenes')
    .select('*', { count: 'exact', head: true })

  if (error) throw error
  return count ?? 0
}

export async function getAverageImprovement(
  supabase: SupabaseClient
): Promise<number | null> {
  const { data, error } = await supabase
    .from('scenes')
    .select('overwhelm_before, overwhelm_after')
    .not('overwhelm_after', 'is', null)

  if (error) throw error
  if (!data || data.length === 0) return null

  const total = data.reduce(
    (sum, s) => sum + ((s.overwhelm_before ?? 0) - (s.overwhelm_after ?? 0)),
    0
  )
  return Math.round((total / data.length) * 10) / 10
}
