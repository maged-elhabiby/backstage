import { createClient } from '@/lib/supabase/server'
import { getCharacterStats, getSceneCount, getAverageImprovement } from '@/lib/supabase/queries'
import { INSIGHTS_PROMPT } from '@/lib/prompts/insights'
import { ChatAnthropic } from '@langchain/anthropic'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 30

const insightsModel = new ChatAnthropic({
  model: "claude-haiku-4-5-20251001",
  temperature: 0.7,
  maxTokens: 500,
})

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

    let insights: string[] = []
    try {
      const statsContext = stats
        .map(s => `${s.character_name} (${s.character_type}): appeared ${s.appearance_count}x, avg intensity ${s.avg_intensity ?? 'N/A'}, most commonly protecting "${s.most_common_protecting ?? 'unknown'}"`)
        .join('\n')

      const response = await insightsModel.invoke([
        ["system", INSIGHTS_PROMPT],
        ["human", `User stats:\n- Total sessions: ${totalScenes}\n- Average overwhelm improvement: ${avgImprovement ?? 'N/A'}\n- Most common scene label: ${mostCommonLabel ?? 'N/A'}\n\nCharacter history:\n${statsContext}`],
      ])

      const text = typeof response.content === "string"
        ? response.content
        : response.content.map((c) => ("text" in c ? c.text : "")).join("")

      insights = text
        .split('\n')
        .map(l => l.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '').trim())
        .filter(l => l.length > 10)
        .slice(0, 3)
    } catch (err) {
      console.error('Insights AI call failed:', err)
    }

    return NextResponse.json({
      stats,
      total_scenes: totalScenes,
      avg_improvement: avgImprovement,
      most_common_label: mostCommonLabel,
      insights,
    })
  } catch (err) {
    console.error('insights error:', err)
    return NextResponse.json({ error: 'Failed to load insights' }, { status: 500 })
  }
}
