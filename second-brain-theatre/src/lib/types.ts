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
  "Urgency Spiral":    "🌀",
  "Preparation Gap":   "🧪",
  "Energy Crash":      "🪫",
  "Toxic Spillover":   "☣️",
  "Solo Run":          "⚽",
  "Escape Fantasy":    "🚪",
  "System Failure":    "⚙️",
  "Conflict Freeze":   "🧊",
  "Blind Spot":        "🕵️",
  "Savior Trap":       "🦸",
  "Perfection Jam":    "🔒",
  "People-Pleasing Overload": "🤹",
  "Avoidance Fog":     "🌫️",
};

export const CHARACTER_IMAGES: Record<string, string> = {
  firefighter:   "/characters/firefighter/Firefighter_breathing-idle_south.gif",
  alien:         "/characters/alien/alien_breathing-idle_south.gif",
  astronaut:     "/characters/astronaut/Astronaut_breathing-idle_south.gif",
  chef:          "/characters/chef/chef_breathing-idle_south.gif",
  director:      "/characters/director/Director_breathing-idle_south.gif",
  doctor:        "/characters/doctor/Doctor_breathing-idle_south.gif",
  hazmat:        "/characters/hazmat/hazmat_breathing-idle_south.gif",
  judge:         "/characters/judge/judge_breathing-idle_south.gif",
  nerd:          "/characters/nerd/nerd_breathing-idle_south.gif",
  referee:       "/characters/referee/referee_breathing-idle_south.gif",
  soccer_player: "/characters/soccer_player/Soccer_Player_breathing-idle_south.gif",
  spy:           "/characters/spy/spy_breathing-idle_south.gif",
  superhero:     "/characters/superhero/Superhero_breathing-idle_south.gif",
  therapist:     "/characters/therapist/therapist_breathing-idle_south.gif",
  wizard:        "/characters/wizard/wizard_breathing-idle_south.gif",
};

export const FALLBACK_LINES: Record<string, CharacterResponse> = {
  firefighter:   { name: "The Firefighter",   emoji: "🚒", line: "Something here needs to happen NOW — I can feel it.", protecting: "urgency", intensity: 7 },
  alien:         { name: "The Alien",          emoji: "👽", line: "I've been observing these humans and I still don't understand why they do things this way. Do you?", protecting: "authenticity", intensity: 5 },
  astronaut:     { name: "The Astronaut",      emoji: "🧑‍🚀", line: "Zoom out. From orbit, this thing you're panicking about is a single pixel on an entire planet.", protecting: "perspective", intensity: 4 },
  chef:          { name: "The Chef",           emoji: "👨‍🍳", line: "Stop. We don't have all the ingredients yet. You can't cook a meal with half a recipe.", protecting: "preparation", intensity: 6 },
  director:      { name: "The Director",       emoji: "🎬", line: "Cut! This scene isn't working. We need to rewrite the script before we keep shooting.", protecting: "narrative control", intensity: 6 },
  doctor:        { name: "The Doctor",         emoji: "🩺", line: "These are symptoms, not the disease. Let me run some diagnostics before we prescribe anything.", protecting: "proper diagnosis", intensity: 6 },
  hazmat:        { name: "The Hazmat",         emoji: "☣️", line: "This is contaminated. We need to seal this off before it poisons everything else in our life.", protecting: "containment", intensity: 8 },
  judge:         { name: "The Judge",          emoji: "⚖️", line: "The evidence is in. Stop deliberating — it's time to make a ruling and live with it.", protecting: "moral clarity", intensity: 7 },
  nerd:          { name: "The Nerd",           emoji: "🤓", line: "Wait — have we actually researched this? Let me pull up the data before we commit to anything.", protecting: "informed decisions", intensity: 5 },
  referee:       { name: "The Referee",        emoji: "🏁", line: "Foul. That's a foul. We agreed on the rules and they just changed them mid-game.", protecting: "fairness", intensity: 7 },
  soccer_player: { name: "The Soccer Player",  emoji: "⚽", line: "Stop dribbling solo — pass the ball. We have teammates for a reason.", protecting: "team momentum", intensity: 6 },
  spy:           { name: "The Spy",            emoji: "🕵️", line: "Something doesn't add up. Read between the lines — what aren't they telling us?", protecting: "situational awareness", intensity: 7 },
  superhero:     { name: "The Superhero",      emoji: "🦸", line: "There are people counting on us. We can rest when everyone's safe — which is never, by the way.", protecting: "being needed", intensity: 8 },
  therapist:     { name: "The Therapist",      emoji: "🛋️", line: "Before we solve anything — what are you actually feeling right now? Not thinking. Feeling.", protecting: "emotional processing", intensity: 4 },
  wizard:        { name: "The Wizard",         emoji: "🧙", line: "You're pushing a boulder uphill when there's a spell for this. Let me show you the shortcut.", protecting: "creative solutions", intensity: 5 },
};
