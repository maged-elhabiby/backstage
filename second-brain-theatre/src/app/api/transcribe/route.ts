import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const maxDuration = 30;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioBlob = formData.get("audio") as File | null;

    if (!audioBlob) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const file = new File([audioBlob], "recording.webm", {
      type: audioBlob.type || "audio/webm",
    });

    const result = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
      language: "en",
      prompt: "Brain dump, stream of consciousness, tasks, feelings, overwhelm, exhausted",
    });

    return NextResponse.json({ text: result.text });
  } catch (error) {
    console.error("Transcribe route error:", error);
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
  }
}
