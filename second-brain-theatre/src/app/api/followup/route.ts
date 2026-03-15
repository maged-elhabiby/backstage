import { NextRequest, NextResponse } from "next/server";
import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { CHARACTER_PROMPTS } from "@/lib/prompts/characters";
import { FOLLOWUP_PROMPT_TEMPLATE } from "@/lib/prompts/followup";
import { createClient } from "@/lib/supabase/server";
import { saveFollowUpMessage } from "@/lib/supabase/queries";
import type { FollowUpMessage } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

const followupModel = new ChatAnthropic({
  model: "claude-haiku-4-5-20251001",
  temperature: 0.8,
  maxTokens: 300,
});

export async function POST(request: NextRequest) {
  try {
    const { sceneId, characterType, originalLine, brainDump, messages } = (await request.json()) as {
      sceneId: string | null;
      characterType: string;
      originalLine: string;
      brainDump: string;
      messages: FollowUpMessage[];
    };

    const characterPrompt = CHARACTER_PROMPTS[characterType];
    if (!characterPrompt) {
      return NextResponse.json({ error: "Unknown character type" }, { status: 400 });
    }

    const systemPrompt = FOLLOWUP_PROMPT_TEMPLATE(characterPrompt, originalLine, brainDump ?? '');

    const langchainMessages = [
      new SystemMessage(systemPrompt),
      ...messages.map((m) =>
        m.role === "user" ? new HumanMessage(m.content) : new AIMessage(m.content)
      ),
    ];

    const response = await followupModel.invoke(langchainMessages);
    const reply = typeof response.content === "string"
      ? response.content
      : response.content.map((c) => ("text" in c ? c.text : "")).join("");

    if (sceneId && sceneId !== "mock") {
      const supabase = await createClient();
      const lastUserMsg = messages[messages.length - 1];
      if (lastUserMsg?.role === "user") {
        saveFollowUpMessage(supabase, sceneId, characterType, "user", lastUserMsg.content).catch(() => {});
      }
      saveFollowUpMessage(supabase, sceneId, characterType, "character", reply).catch(() => {});
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Followup route error:", error);
    return NextResponse.json({ error: "Follow-up failed" }, { status: 500 });
  }
}
