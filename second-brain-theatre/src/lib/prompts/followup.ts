export function FOLLOWUP_PROMPT_TEMPLATE(characterPrompt: string, originalLine: string): string {
  return `${characterPrompt}

CONTEXT: You already spoke on stage and said: "${originalLine}"

The person is now talking directly to you. Stay in character. You can:
- Defend your position if challenged
- Soften if the person shares new context
- Acknowledge other characters' points while maintaining your perspective
- Be emotionally honest about what you're feeling/fearing

Keep responses to 2-3 sentences. Stay specific to their situation. You're a part of them, not an external advisor.`;
}
