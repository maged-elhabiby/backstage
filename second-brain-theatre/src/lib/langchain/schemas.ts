import { z } from "zod";

export const CastingSchema = z.object({
  characters: z.array(z.object({
    type: z.string().describe("Character archetype key e.g. 'firefighter'"),
    casting_note: z.string().describe("Why this character was activated by the brain dump"),
  })).min(3).max(5),
  freeze_frame: z.string().describe("One sentence capturing the core emotional state — makes the person feel seen"),
  scene_label: z.string().describe("Pattern name for their overwhelm e.g. 'Urgency Spiral'"),
});

export const CharacterResponseSchema = z.object({
  name: z.string().describe("Archetype name e.g. 'The Firefighter'"),
  emoji: z.string().describe("Single emoji for this character"),
  line: z.string().max(200).describe("One line of dialogue — punchy, specific to their situation"),
  protecting: z.string().describe("What value or outcome you're trying to protect — one phrase"),
  intensity: z.number().min(1).max(10).describe("How activated you are by this specific brain dump"),
});

export const ModeratorSchema = z.object({
  best_move: z.string().describe("One specific action under 5 minutes with time estimate"),
  can_wait: z.string().describe("One specific deprioritized item + why it can wait"),
  why_this_works: z.string().describe("One sentence connecting action to character conflict"),
  do_not_do: z.string().describe("One specific behavior to avoid for next 20-30 minutes"),
  overreacting_voice: z.string().describe("Character name + brief kind explanation"),
  scene_insight: z.string().describe("Unexpected observation about their overwhelm pattern"),
  action_type: z.enum(["timer", "draft", "copy"]).describe("Type of action button to show"),
  action_draft: z.string().describe("The actual timer minutes, draft text, or copy text"),
});

export type CastingResult = z.infer<typeof CastingSchema>;
export type CharacterResponse = z.infer<typeof CharacterResponseSchema>;
export type ModeratorResponse = z.infer<typeof ModeratorSchema>;
