import { Difficulty } from "../types/game";

// ============================================================
// BOT — Arena do Saber
// Simula o comportamento de um oponente simples
// ============================================================

export type BotDifficulty = "easy" | "normal" | "hard";

// Probabilidade de acerto do bot por nível
const BOT_HIT_RATES: Record<BotDifficulty, Record<Difficulty, number>> = {
  easy:   { easy: 0.4,  medium: 0.3,  hard: 0.2 },
  normal: { easy: 0.65, medium: 0.5,  hard: 0.35 },
  hard:   { easy: 0.85, medium: 0.7,  hard: 0.55 },
};

const BOT_DIFFICULTY: BotDifficulty = "normal";

export function botAnswersCorrectly(questionDifficulty: Difficulty): boolean {
  const rate = BOT_HIT_RATES[BOT_DIFFICULTY][questionDifficulty];
  return Math.random() < rate;
}

export function botChooseCategory(categoryIds: string[]): string {
  // Bot escolhe categoria aleatoriamente
  return categoryIds[Math.floor(Math.random() * categoryIds.length)];
}

export function getBotName(): string {
  return "Rival Bot";
}

export function getBotAvatar(): string {
  return "🤖";
}
