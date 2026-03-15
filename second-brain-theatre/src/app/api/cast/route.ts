import { NextRequest, NextResponse } from "next/server";
import { runCasting } from "@/lib/langchain/chain";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { brainDump } = await request.json();

    if (!brainDump || typeof brainDump !== "string" || brainDump.length < 10) {
      return NextResponse.json(
        { error: "brainDump must be a string with at least 10 characters" },
        { status: 400 }
      );
    }

    const result = await runCasting(brainDump);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Cast route error:", error);
    return NextResponse.json({ error: "Casting failed" }, { status: 500 });
  }
}
