import { PlayerProgress } from "../types/game";
import { LEGACY_KEYS, STORAGE_KEYS } from "./storageKeys";

// ============================================================
// STORAGE — LocalStorage adapter
// Pronto para substituir por Supabase/Firebase futuramente
// ============================================================

const PROGRESS_SCHEMA_VERSION = 2;
const MAX_WRONG_QUESTION_IDS = 100;

export const DEFAULT_PROGRESS: PlayerProgress = {
  _version: PROGRESS_SCHEMA_VERSION,
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

function migrateProgressStorage(): void {
  try {
    const legacyProgress = localStorage.getItem(LEGACY_KEYS.PLAYER_PROGRESS);
    const currentProgress = localStorage.getItem(STORAGE_KEYS.PLAYER_PROGRESS);

    if (legacyProgress && !currentProgress) {
      localStorage.setItem(STORAGE_KEYS.PLAYER_PROGRESS, legacyProgress);
    }

    if (legacyProgress) {
      localStorage.removeItem(LEGACY_KEYS.PLAYER_PROGRESS);
    }
  } catch {
    // Se a migração falhar, o app continua usando o fallback padrão.
  }
}

function normalizeStringArray(value: unknown, limit?: number): string[] {
  if (!Array.isArray(value)) return [];

  const uniqueIds = new Set<string>();

  value.forEach((item) => {
    if (typeof item === "string" && item.trim().length > 0) {
      uniqueIds.add(item);
    }
  });

  const normalized = Array.from(uniqueIds);
  return typeof limit === "number" ? normalized.slice(-limit) : normalized;
}

function normalizeCategoryProgress(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.entries(value as Record<string, unknown>).reduce<Record<string, number>>(
    (acc, [categoryId, progress]) => {
      if (
        typeof categoryId === "string" &&
        categoryId.trim().length > 0 &&
        typeof progress === "number" &&
        Number.isFinite(progress)
      ) {
        acc[categoryId] = progress;
      }

      return acc;
    },
    {}
  );
}

function normalizeProgress(value: Partial<PlayerProgress>): PlayerProgress {
  return {
    ...DEFAULT_PROGRESS,
    ...value,
    _version: PROGRESS_SCHEMA_VERSION,
    completedEmblems: normalizeStringArray(value.completedEmblems),
    wrongQuestionIds: normalizeStringArray(
      value.wrongQuestionIds,
      MAX_WRONG_QUESTION_IDS
    ),
    masteredQuestionIds: normalizeStringArray(value.masteredQuestionIds),
    categoryProgress: normalizeCategoryProgress(value.categoryProgress),
  };
}

export function loadProgress(): PlayerProgress {
  try {
    migrateProgressStorage();

    const raw = localStorage.getItem(STORAGE_KEYS.PLAYER_PROGRESS);
    if (!raw) return { ...DEFAULT_PROGRESS };

    const parsed = JSON.parse(raw) as Partial<PlayerProgress>;
    return normalizeProgress(parsed);
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress: PlayerProgress): void {
  try {
    localStorage.setItem(
      STORAGE_KEYS.PLAYER_PROGRESS,
      JSON.stringify(normalizeProgress(progress))
    );
  } catch (e) {
    console.error("Erro ao salvar progresso:", e);
  }
}

export function resetProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.PLAYER_PROGRESS);
    localStorage.removeItem(LEGACY_KEYS.PLAYER_PROGRESS);
  } catch {
    // Reset não deve travar o app se o localStorage estiver indisponível.
  }
}

export function addWrongQuestion(questionId: string): void {
  const progress = loadProgress();

  if (!progress.wrongQuestionIds.includes(questionId)) {
    progress.wrongQuestionIds = [
      ...progress.wrongQuestionIds,
      questionId,
    ].slice(-MAX_WRONG_QUESTION_IDS);

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
