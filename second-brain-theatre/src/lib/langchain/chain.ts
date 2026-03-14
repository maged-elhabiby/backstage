import { ChatAnthropic } from "@langchain/anthropic";
import { CastingSchema, CharacterResponseSchema, ModeratorSchema } from "./schemas";
import type { CastingResult, CharacterResponse, ModeratorResponse } from "./schemas";
import { CASTING_DIRECTOR_PROMPT } from "../prompts/castingDirector";
import { MODERATOR_PROMPT } from "../prompts/moderator";

const model = new ChatAnthropic({
  model: "claude-sonnet-4-6-20250514",
  temperature: 0.8,
  maxTokens: 1000,
});

const castingModel = model.withStructuredOutput(CastingSchema);
const characterModel = model.withStructuredOutput(CharacterResponseSchema);
const moderatorModel = model.withStructuredOutput(ModeratorSchema);

export async function runCasting(brainDump: string, patterns: string = "No prior patterns."): Promise<CastingResult> {
  const start = Date.now();
  const result = await Promise.race([
    castingModel.invoke([
      ["system", CASTING_DIRECTOR_PROMPT],
      ["human", `Past patterns for this user:\n${patterns}\n\nBrain dump:\n${brainDump}`],
    ]),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Casting timed out")), 15000)
    ),
  ]);
  console.log(`runCasting: ${Date.now() - start}ms`);
  return result;
}

export async function runCharacter(brainDump: string, castingNote: string, characterPrompt: string): Promise<CharacterResponse> {
  const start = Date.now();
  const result = await Promise.race([
    characterModel.invoke([
      ["system", characterPrompt],
      ["human", `Brain dump:\n${brainDump}\n\nCasting note:\n${castingNote}`],
    ]),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Character timed out")), 15000)
    ),
  ]);
  console.log(`runCharacter: ${Date.now() - start}ms`);
  return result;
}

export async function runModerator(brainDump: string, characters: CharacterResponse[], sceneLabel: string): Promise<ModeratorResponse> {
  const start = Date.now();
  const characterContext = characters
    .map(c => `${c.name} (${c.emoji}): "${c.line}" — protecting: ${c.protecting}, intensity: ${c.intensity}/10`)
    .join("\n");

  const result = await Promise.race([
    moderatorModel.invoke([
      ["system", MODERATOR_PROMPT],
      ["human", `Brain dump:\n${brainDump}\n\nScene label: ${sceneLabel}\n\nCharacters on stage:\n${characterContext}`],
    ]),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Moderator timed out")), 20000)
    ),
  ]);
  console.log(`runModerator: ${Date.now() - start}ms`);
  return result;
}
