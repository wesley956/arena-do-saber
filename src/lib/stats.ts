import { PlayerProgress } from "../types/game";
import { ALL_CATEGORIES } from "../data/categories";
import { getQuestionById } from "../data/questions";

// ============================================================
// STATS — Arena do Saber
// ============================================================

export function getAccuracyRate(progress: PlayerProgress): number {
  const total = progress.totalCorrect + progress.totalWrong;
  if (total === 0) return 0;
  return Math.round((progress.totalCorrect / total) * 100);
}

export function getStrongestCategory(
  progress: PlayerProgress
): string | null {
  const entries = Object.entries(progress.categoryProgress);
  if (entries.length === 0) return null;
  const [id] = entries.sort(([, a], [, b]) => b - a)[0];
  return ALL_CATEGORIES.find((c) => c.id === id)?.name ?? null;
}

export function getWeakestCategory(
  progress: PlayerProgress
): string | null {
  // Categoria com mais erros
  const errorMap: Record<string, number> = {};
  for (const id of progress.wrongQuestionIds) {
    const q = getQuestionById(id);
    if (q) {
      errorMap[q.categoryId] = (errorMap[q.categoryId] ?? 0) + 1;
    }
  }
  const entries = Object.entries(errorMap);
  if (entries.length === 0) return null;
  const [catId] = entries.sort(([, a], [, b]) => b - a)[0];
  return ALL_CATEGORIES.find((c) => c.id === catId)?.name ?? null;
}

export function getErrorsByCategory(
  progress: PlayerProgress
): Record<string, number> {
  const map: Record<string, number> = {};
  for (const id of progress.wrongQuestionIds) {
    const q = getQuestionById(id);
    if (q) {
      const cat = ALL_CATEGORIES.find((c) => c.id === q.categoryId);
      const name = cat?.name ?? q.categoryId;
      map[name] = (map[name] ?? 0) + 1;
    }
  }
  return map;
}
