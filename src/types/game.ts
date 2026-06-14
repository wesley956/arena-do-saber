// ============================================================
// TYPES — Arena do Saber
// ============================================================

export type World = "school" | "contest";
export type Difficulty = "easy" | "medium" | "hard";
export type GameMode = "classic" | "solo" | "review" | "duel";
export type MatchStatus =
  | "idle"
  | "spinning"
  | "question"
  | "result"
  | "botTurn"
  | "finished";

// ------------------------------------------------------------
// Category
// ------------------------------------------------------------
export interface Category {
  id: string;
  world: World;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  colorToken: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  emblemName: string;
  emblemDescription: string;
}

// ------------------------------------------------------------
// Question
// ------------------------------------------------------------
export interface Alternative {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  world: World;
  categoryId: string;
  subject: string;
  topic: string;
  difficulty: Difficulty;
  statement: string;
  alternatives: Alternative[];
  correctAlternativeId: string;
  explanation: string;
  trap?: string;
  tags: string[];
  // Future fields (optional, for content expansion)
  subtopic?: string;
  banca?: string;
  year?: number;
  schoolLevel?: string;
  examType?: string;
  reference?: string;
}

// ------------------------------------------------------------
// Player Progress
// ------------------------------------------------------------
export interface PlayerProgress {
  _version: number;
  xp: number;
  level: number;
  streak: number;
  totalCorrect: number;
  totalWrong: number;
  completedEmblems: string[];
  categoryProgress: Record<string, number>;
  wrongQuestionIds: string[];
  masteredQuestionIds: string[];
  totalGamesPlayed: number;
  totalWins: number;
}

// ------------------------------------------------------------
// Classic Match State
// ------------------------------------------------------------
export interface ClassicMatchState {
  id: string;
  world: World;
  round: number;
  maxRounds: number;
  currentTurn: "player" | "bot";
  selectedCategoryId?: string;
  currentQuestionId?: string;
  playerEmblems: string[];
  botEmblems: string[];
  playerCategoryProgress: Record<string, number>;
  botCategoryProgress: Record<string, number>;
  playerScore: number;
  botScore: number;
  status: MatchStatus;
  winner?: "player" | "bot" | "draw";
  lastAnswerCorrect?: boolean;
  lastAnsweredQuestionId?: string;
  lastXpGained: number; // FIX: campo adicionado para rastrear XP da última resposta
  askedQuestionIds: string[];
}

// ------------------------------------------------------------
// Solo Training Session
// ------------------------------------------------------------
export interface SoloSession {
  world: World;
  categoryId: string;
  correct: number;
  wrong: number;
  askedQuestionIds: string[];
  currentQuestionId?: string;
  status: "active" | "finished";
}

// ------------------------------------------------------------
// Duel Quick Match
// ------------------------------------------------------------
export interface DuelQuestion {
  questionId: string;
  playerAnswered?: string;
  botAnswered?: string;
  playerCorrect?: boolean;
  botCorrect?: boolean;
}

export interface DuelMatchState {
  world: World;
  questions: DuelQuestion[];
  currentIndex: number;
  status: "active" | "result" | "finished";
  playerScore: number;
  botScore: number;
}

// ------------------------------------------------------------
// Review Session
// ------------------------------------------------------------
export interface ReviewSession {
  questionIds: string[];
  currentIndex: number;
  dominated: string[];
  status: "active" | "finished";
}

// ------------------------------------------------------------
// XP Events
// ------------------------------------------------------------
export type XPEvent =
  | "correct_easy"
  | "correct_medium"
  | "correct_hard"
  | "review_correct"
  | "emblem_gained"
  | "classic_win"
  | "duel_win";
