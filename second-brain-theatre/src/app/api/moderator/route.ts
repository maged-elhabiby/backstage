import { NextRequest, NextResponse } from "next/server";
import { runModerator } from "@/lib/langchain/chain";
import type { CharacterResponse } from "@/lib/langchain/schemas";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const { brainDump, characters, sceneLabel } = (await request.json()) as {
      brainDump: string;
      characters: CharacterResponse[];
      sceneLabel: string;
    };

    const result = await runModerator(brainDump, characters, sceneLabel);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Moderator route error:", error);
    return NextResponse.json({ error: "Moderator failed" }, { status: 500 });
  }
}
