export const CHARACTER_VOICES: Record<string, {
  voiceId: string;
  stability: number;
  similarity_boost: number;
  style: number;
  speaking_rate: number;
}> = {
  firefighter:    { voiceId: "ErXwobaYiN019PkySvjV", stability: 0.3, similarity_boost: 0.7, style: 0.8, speaking_rate: 1.2 },
  perfectionist:  { voiceId: "VR6AewLTigWG4xSOukaG", stability: 0.8, similarity_boost: 0.8, style: 0.3, speaking_rate: 0.9 },
  avoider:        { voiceId: "pNInz6obpgDQGcFmaJgB", stability: 0.5, similarity_boost: 0.6, style: 0.4, speaking_rate: 0.85 },
  engineer:       { voiceId: "TxGEqnHWrfWFTfGW9XjX", stability: 0.7, similarity_boost: 0.8, style: 0.3, speaking_rate: 1.0 },
  future_you:     { voiceId: "yoZ06aMxZJJ28mfd3POQ", stability: 0.7, similarity_boost: 0.8, style: 0.5, speaking_rate: 1.0 },
  body:           { voiceId: "21m00Tcm4TlvDq8ikWAM", stability: 0.9, similarity_boost: 0.7, style: 0.2, speaking_rate: 0.75 },
  people_pleaser: { voiceId: "MF3mGyEYCl7XYWbV9V6O", stability: 0.4, similarity_boost: 0.7, style: 0.6, speaking_rate: 1.1 },
  critic:         { voiceId: "N2lVS1w4EtoT3dr4eOWO", stability: 0.8, similarity_boost: 0.8, style: 0.5, speaking_rate: 0.95 },
  dreamer:        { voiceId: "XB0fDUnXU5powFXDhCwa", stability: 0.6, similarity_boost: 0.6, style: 0.7, speaking_rate: 0.85 },
};

export const MODERATOR_VOICE = {
  voiceId: "D38z5RcWu1voky8WS1ja", stability: 0.85, similarity_boost: 0.75, style: 0.3, speaking_rate: 0.95,
};

export const DEFAULT_VOICE = {
  voiceId: "21m00Tcm4TlvDq8ikWAM", stability: 0.6, similarity_boost: 0.75, style: 0.4, speaking_rate: 1.0,
};

export function getVoiceConfig(characterType: string) {
  if (characterType === "moderator" || characterType === "Moderator") {
    return MODERATOR_VOICE;
  }
  return CHARACTER_VOICES[characterType] ?? DEFAULT_VOICE;
}
