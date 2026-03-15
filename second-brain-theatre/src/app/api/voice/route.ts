import { NextRequest } from "next/server";
import { createHash } from "crypto";
import { getVoiceConfig } from "@/lib/elevenlabs/voices";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const audioCache = new Map<string, Buffer>();

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const character = searchParams.get("character");
    const line = searchParams.get("line");

    if (!character || !line) {
      return new Response(JSON.stringify({ error: "character and line are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const cacheKey = createHash("md5").update(`${character}:${line}`).digest("hex");

    const cached = audioCache.get(cacheKey);
    if (cached) {
      return new Response(cached, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    const { voiceId, stability, similarity_boost, style, speaking_rate } = getVoiceConfig(character);

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: line,
        model_id: "eleven_turbo_v2_5",
        voice_settings: { stability, similarity_boost, style, speaking_rate },
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs returned ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    audioCache.set(cacheKey, buffer);

    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Voice route error:", error);
    return new Response(JSON.stringify({ error: "Voice gen failed" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}
