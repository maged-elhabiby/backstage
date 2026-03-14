import { createClient } from '@/lib/supabase/server'
import { getCharacterStats, getSceneCount, getAverageImprovement } from '@/lib/supabase/queries'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const [stats, totalScenes, avgImprovement] = await Promise.all([
      getCharacterStats(supabase),
      getSceneCount(supabase),
      getAverageImprovement(supabase),
    ])

    const { data: labelData } = await supabase
      .from('scenes')
      .select('scene_label')
      .eq('user_id', user.id)
      .not('scene_label', 'is', null)

    let mostCommonLabel: string | null = null
    if (labelData?.length) {
      const counts: Record<string, number> = {}
      for (const row of labelData) {
        const label = row.scene_label as string
        counts[label] = (counts[label] ?? 0) + 1
      }
      mostCommonLabel = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
    }

    if (totalScenes < 5) {
      return NextResponse.json({
        stats,
        total_scenes: totalScenes,
        avg_improvement: avgImprovement,
        most_common_label: mostCommonLabel,
        insights: [],
        message: 'Complete 5+ scenes to unlock pattern insights',
      })
    }

    // TODO: call Person B's insights prompt when lib/prompts/insights.ts is available
    return NextResponse.json({
      stats,
      total_scenes: totalScenes,
      avg_improvement: avgImprovement,
      most_common_label: mostCommonLabel,
      insights: [],
    })
  } catch (err) {
    console.error('insights error:', err)
    return NextResponse.json({ error: 'Failed to load insights' }, { status: 500 })
  }
}
