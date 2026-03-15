export const CHARACTER_VOICES: Record<string, {
  voiceId: string;
  stability: number;
  similarity_boost: number;
  style: number;
  speaking_rate: number;
}> = {
  firefighter:   { voiceId: "ErXwobaYiN019PkySvjV", stability: 0.3, similarity_boost: 0.7, style: 0.8, speaking_rate: 1.3 },
  alien:         { voiceId: "TxGEqnHWrfWFTfGW9XjX", stability: 0.4, similarity_boost: 0.5, style: 0.7, speaking_rate: 0.9 },
  astronaut:     { voiceId: "yoZ06aMxZJJ28mfd3POQ", stability: 0.9, similarity_boost: 0.7, style: 0.2, speaking_rate: 0.8 },
  chef:          { voiceId: "VR6AewLTigWG4xSOukaG", stability: 0.6, similarity_boost: 0.7, style: 0.5, speaking_rate: 1.05 },
  director:      { voiceId: "N2lVS1w4EtoT3dr4eOWO", stability: 0.5, similarity_boost: 0.8, style: 0.7, speaking_rate: 1.1 },
  doctor:        { voiceId: "21m00Tcm4TlvDq8ikWAM", stability: 0.85, similarity_boost: 0.75, style: 0.2, speaking_rate: 0.85 },
  hazmat:        { voiceId: "pNInz6obpgDQGcFmaJgB", stability: 0.7, similarity_boost: 0.7, style: 0.5, speaking_rate: 1.1 },
  judge:         { voiceId: "XB0fDUnXU5powFXDhCwa", stability: 0.85, similarity_boost: 0.8, style: 0.4, speaking_rate: 0.9 },
  nerd:          { voiceId: "MF3mGyEYCl7XYWbV9V6O", stability: 0.7, similarity_boost: 0.7, style: 0.3, speaking_rate: 1.15 },
  referee:       { voiceId: "ErXwobaYiN019PkySvjV", stability: 0.4, similarity_boost: 0.7, style: 0.6, speaking_rate: 1.2 },
  soccer_player: { voiceId: "VR6AewLTigWG4xSOukaG", stability: 0.35, similarity_boost: 0.7, style: 0.7, speaking_rate: 1.25 },
  spy:           { voiceId: "N2lVS1w4EtoT3dr4eOWO", stability: 0.8, similarity_boost: 0.8, style: 0.4, speaking_rate: 0.85 },
  superhero:     { voiceId: "TxGEqnHWrfWFTfGW9XjX", stability: 0.5, similarity_boost: 0.8, style: 0.8, speaking_rate: 1.1 },
  therapist:     { voiceId: "TxGEqnHWrfWFTfGW9XjX", stability: 0.95, similarity_boost: 0.75, style: 0.1, speaking_rate: 0.75 },
  wizard:        { voiceId: "pNInz6obpgDQGcFmaJgB", stability: 0.75, similarity_boost: 0.65, style: 0.6, speaking_rate: 0.8 },
};

export const MODERATOR_VOICE = {
  voiceId: "N2lVS1w4EtoT3dr4eOWO", stability: 0.5, similarity_boost: 0.8, style: 0.7, speaking_rate: 1.05,
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
