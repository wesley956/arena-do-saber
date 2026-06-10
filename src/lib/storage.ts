import { PlayerProgress } from "../types/game";

// ============================================================
// STORAGE — LocalStorage adapter
// Pronto para substituir por Supabase/Firebase futuramente
// ============================================================

const KEYS = {
  PLAYER_PROGRESS: "arena_saber_progress",
};

export const DEFAULT_PROGRESS: PlayerProgress = {
  xp: 0,
  level: 1,
  streak: 0,
  totalCorrect: 0,
  totalWrong: 0,
  completedEmblems: [],
  categoryProgress: {},
  wrongQuestionIds: [],
  masteredQuestionIds: [],
  totalGamesPlayed: 0,
  totalWins: 0,
};

export function loadProgress(): PlayerProgress {
  try {
    const raw = localStorage.getItem(KEYS.PLAYER_PROGRESS);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw) as Partial<PlayerProgress>;
    // Merge with defaults for forward compatibility (protects against old/corrupt data)
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      // Ensure arrays are always arrays
      completedEmblems: Array.isArray(parsed.completedEmblems) ? parsed.completedEmblems : [],
      wrongQuestionIds: Array.isArray(parsed.wrongQuestionIds) ? parsed.wrongQuestionIds : [],
      masteredQuestionIds: Array.isArray(parsed.masteredQuestionIds) ? parsed.masteredQuestionIds : [],
      // Ensure objects are always objects
      categoryProgress: (parsed.categoryProgress && typeof parsed.categoryProgress === "object") ? parsed.categoryProgress : {},
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress: PlayerProgress): void {
  try {
    localStorage.setItem(KEYS.PLAYER_PROGRESS, JSON.stringify(progress));
  } catch (e) {
    console.error("Erro ao salvar progresso:", e);
  }
}

export function resetProgress(): void {
  localStorage.removeItem(KEYS.PLAYER_PROGRESS);
}

export function addWrongQuestion(questionId: string): void {
  const progress = loadProgress();
  if (!progress.wrongQuestionIds.includes(questionId)) {
    progress.wrongQuestionIds.push(questionId);
    saveProgress(progress);
  }
}

export function markQuestionMastered(questionId: string): void {
  const progress = loadProgress();
  if (!progress.masteredQuestionIds.includes(questionId)) {
    progress.masteredQuestionIds.push(questionId);
  }
  progress.wrongQuestionIds = progress.wrongQuestionIds.filter(
    (id) => id !== questionId
  );
  saveProgress(progress);
}
