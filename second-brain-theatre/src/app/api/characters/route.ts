import { NextRequest, NextResponse } from "next/server";
import { runCharacter } from "@/lib/langchain/chain";
import { CHARACTER_PROMPTS } from "@/lib/prompts/characters";
import { FALLBACK_LINES } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { brainDump, characters } = await request.json();

    const eligible: { type: string; casting_note: string }[] = characters.filter(
      (c: { type: string }) => CHARACTER_PROMPTS[c.type]
    );

    const results = await Promise.allSettled(
      eligible.map((c) => runCharacter(brainDump, c.casting_note, CHARACTER_PROMPTS[c.type]))
    );

    const responses = results.map((result, i) => {
      const charType = eligible[i].type;
      if (result.status === "fulfilled") {
        return result.value;
      }
      console.warn(`Character agent failed for ${charType}:`, result.reason);
      return FALLBACK_LINES[charType] ?? FALLBACK_LINES.firefighter;
    });

    return NextResponse.json(responses);
  } catch (error) {
    console.error("Characters route error:", error);
    return NextResponse.json({ error: "Characters failed" }, { status: 500 });
  }
}
