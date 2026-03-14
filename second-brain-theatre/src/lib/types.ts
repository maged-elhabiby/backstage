export type CastingResult = {
  characters: Array<{ type: string; casting_note: string }>;
  freeze_frame: string;
  scene_label: string;
};

export type CharacterResponse = {
  name: string;
  emoji: string;
  line: string;
  protecting: string;
  intensity: number;
};

export type ModeratorResponse = {
  best_move: string;
  can_wait: string;
  why_this_works: string;
  do_not_do: string;
  overreacting_voice: string;
  scene_insight: string;
  action_type: "timer" | "draft" | "copy";
  action_draft: string;
};

export type TheatreScene = {
  casting: CastingResult;
  characters: CharacterResponse[];
  moderator: ModeratorResponse;
};

export type FollowUpMessage = {
  role: "user" | "character";
  content: string;
};

export type SceneRecord = {
  id: string;
  user_id: string;
  brain_dump: string;
  freeze_frame: string;
  scene_label: string;
  main_conflict: string;
  best_move: string;
  can_wait: string;
  why_this_works: string;
  do_not_do: string;
  scene_insight: string;
  overreacting_voice: string;
  overwhelm_before: number;
  overwhelm_after: number | null;
  created_at: string;
};

export type CharacterRecord = {
  id: string;
  scene_id: string;
  character_type: string;
  character_name: string;
  emoji: string;
  original_line: string;
  protecting_value: string;
  intensity: number;
};

export const SCENE_LABEL_EMOJIS: Record<string, string> = {
  "Urgency Spiral": "🌀",
  "Perfection Jam": "🔒",
  "Energy Crash": "🪫",
  "People-Pleasing Overload": "🤹",
  "Avoidance Fog": "🌫️",
  "Escape Fantasy": "🚪",
  "System Failure": "⚙️",
  "Conflict Freeze": "🧊",
};

export const CHARACTER_IMAGES: Record<string, string> = {
  firefighter: "/characters/firefighter.png",
  perfectionist: "/characters/perfectionist.png",
  avoider: "/characters/avoider.png",
  engineer: "/characters/engineer.png",
  future_you: "/characters/future_you.png",
  body: "/characters/body.png",
  people_pleaser: "/characters/people_pleaser.png",
  critic: "/characters/critic.png",
  dreamer: "/characters/dreamer.png",
};

export const FALLBACK_LINES: Record<string, CharacterResponse> = {
  firefighter: { name: "The Firefighter", emoji: "🚒", line: "Something here needs to happen now — I can feel it.", protecting: "urgency", intensity: 7 },
  perfectionist: { name: "The Perfectionist", emoji: "👁", line: "We're not ready. We should prepare more before acting.", protecting: "quality", intensity: 6 },
  avoider: { name: "The Avoider", emoji: "🛋", line: "Maybe we should organize our desktop first. Just to clear our head.", protecting: "comfort", intensity: 5 },
  engineer: { name: "The Engineer", emoji: "🛠", line: "This keeps happening. The system is broken, not you.", protecting: "root cause fix", intensity: 6 },
  future_you: { name: "Future You", emoji: "🔮", line: "Tomorrow-you is watching. What do they wish we did right now?", protecting: "future stability", intensity: 6 },
  body: { name: "The Body", emoji: "🧍", line: "When did we last eat? Sleep? Move? That matters more than you think.", protecting: "physical health", intensity: 7 },
  people_pleaser: { name: "The People-Pleaser", emoji: "🤝", line: "Someone is waiting on us. Several someones, actually.", protecting: "relationships", intensity: 7 },
  critic: { name: "The Critic", emoji: "🪞", line: "We should have handled this yesterday. Why are we like this?", protecting: "standards", intensity: 5 },
  dreamer: { name: "The Dreamer", emoji: "🌅", line: "What if none of this is what we're supposed to be doing?", protecting: "life purpose", intensity: 4 },
};
