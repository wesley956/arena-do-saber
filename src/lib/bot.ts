import { Difficulty } from "../types/game";

// ============================================================
// BOT — Arena do Saber
// Simula o comportamento de oponentes locais com personalidade.
// ============================================================

export type BotDifficulty = "easy" | "normal" | "hard";

interface BotPersonality {
  name: string;
  avatar: string;
  difficulty: BotDifficulty;
}

// Probabilidade de acerto do bot por nível
const BOT_HIT_RATES: Record<BotDifficulty, Record<Difficulty, number>> = {
  easy: { easy: 0.4, medium: 0.3, hard: 0.2 },
  normal: { easy: 0.65, medium: 0.5, hard: 0.35 },
  hard: { easy: 0.85, medium: 0.7, hard: 0.55 },
};

const BOT_ROSTER: BotPersonality[] = [
  {
    name: "Prof. Leandro",
    avatar: "🧑‍🏫",
    difficulty: "normal",
  },
  {
    name: "Bete Estudante",
    avatar: "📚",
    difficulty: "easy",
  },
  {
    name: "Robo Alpha",
    avatar: "🤖",
    difficulty: "hard",
  },
  {
    name: "Fantini",
    avatar: "🦊",
    difficulty: "normal",
  },
  {
    name: "Mestre Silvano",
    avatar: "🧙",
    difficulty: "hard",
  },
];

let currentBotIndex = 0;

function getCurrentBot(): BotPersonality {
  return BOT_ROSTER[currentBotIndex] ?? BOT_ROSTER[0];
}

export function initBot(): void {
  currentBotIndex = Math.floor(Math.random() * BOT_ROSTER.length);
}

export function botAnswersCorrectly(questionDifficulty: Difficulty): boolean {
  const bot = getCurrentBot();
  const rate = BOT_HIT_RATES[bot.difficulty][questionDifficulty];

  return Math.random() < rate;
}

export function botChooseCategory(categoryIds: string[]): string {
  return categoryIds[Math.floor(Math.random() * categoryIds.length)];
}

export function getBotName(): string {
  return getCurrentBot().name;
}

export function getBotAvatar(): string {
  return getCurrentBot().avatar;
}
