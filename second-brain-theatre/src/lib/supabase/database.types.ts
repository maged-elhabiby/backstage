export interface Scene {
  id: string
  user_id: string
  brain_dump: string
  freeze_frame: string | null
  scene_label: string | null
  main_conflict: string | null
  best_move: string | null
  can_wait: string | null
  why_this_works: string | null
  do_not_do: string | null
  scene_insight: string | null
  overreacting_voice: string | null
  overwhelm_before: number | null
  overwhelm_after: number | null
  created_at: string
}

export interface SceneCharacter {
  id: string
  scene_id: string
  character_type: string
  character_name: string
  emoji: string | null
  original_line: string
  protecting_value: string | null
  intensity: number | null
  created_at: string
}

export interface FollowUpMessageRow {
  id: string
  scene_id: string
  character_type: string
  role: 'user' | 'character'
  content: string
  created_at: string
}

export interface CharacterStat {
  user_id: string
  character_type: string
  character_name: string
  emoji: string | null
  appearance_count: number
  avg_intensity: number | null
  most_common_protecting: string | null
}
