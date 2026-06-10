import { PlayerProgress, World } from "../types/game";
import { ALL_CATEGORIES, getCategoriesByWorld } from "../data/categories";
import { QUESTIONS, getQuestionById } from "../data/questions";
import { EMBLEM_THRESHOLD } from "./gameEngine";

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

// ============================================================
// POR MATÉRIA — Mapa de Estudos
// ============================================================

/** Total de perguntas disponíveis para uma categoria */
export function getTotalQuestionsByCategory(categoryId: string): number {
  return QUESTIONS.filter((q) => q.categoryId === categoryId).length;
}

/** Progresso atual do jogador em uma categoria (acertos que contam para emblema) */
export function getCategoryProgress(
  progress: PlayerProgress,
  categoryId: string
): number {
  return progress.categoryProgress[categoryId] ?? 0;
}

/** Se o emblema da categoria já foi conquistado */
export function hasCategoryEmblem(
  progress: PlayerProgress,
  categoryId: string
): boolean {
  return progress.completedEmblems.includes(categoryId);
}

/** Número de erros numa categoria (questões ainda na fila de revisão) */
export function getErrorCountByCategory(
  progress: PlayerProgress,
  categoryId: string
): number {
  let count = 0;
  for (const id of progress.wrongQuestionIds) {
    const q = getQuestionById(id);
    if (q && q.categoryId === categoryId) count++;
  }
  return count;
}

/** Número de questões dominadas (removidas da revisão) numa categoria */
export function getMasteredCountByCategory(
  progress: PlayerProgress,
  categoryId: string
): number {
  let count = 0;
  for (const id of progress.masteredQuestionIds) {
    const q = getQuestionById(id);
    if (q && q.categoryId === categoryId) count++;
  }
  return count;
}

/** Porcentagem de domínio (0–100) baseada em acertos / total disponível */
export function getDominancePercent(
  progress: PlayerProgress,
  categoryId: string
): number {
  const total = getTotalQuestionsByCategory(categoryId);
  if (total === 0) return 0;
  const correct = getCategoryProgress(progress, categoryId);
  return Math.min(100, Math.round((correct / total) * 100));
}

/** Status textual da categoria para o jogador */
export type CategoryStatus =
  | "notStarted"
  | "inProgress"
  | "emblemReady"
  | "conquered";

export function getCategoryStatus(
  progress: PlayerProgress,
  categoryId: string
): CategoryStatus {
  if (hasCategoryEmblem(progress, categoryId)) return "conquered";
  const current = getCategoryProgress(progress, categoryId);
  if (current === 0) return "notStarted";
  if (current >= EMBLEM_THRESHOLD) return "emblemReady";
  return "inProgress";
}

/** IDs de questões erradas de uma categoria (para revisão filtrada) */
export function getWrongQuestionIdsByCategory(
  progress: PlayerProgress,
  categoryId: string
): string[] {
  return progress.wrongQuestionIds.filter((id) => {
    const q = getQuestionById(id);
    return q?.categoryId === categoryId;
  });
}

/** Resumo completo por categoria — usado pelo Mapa de Estudos */
export interface CategoryStats {
  categoryId: string;
  total: number;
  correct: number;
  errors: number;
  mastered: number;
  dominancePercent: number;
  emblemThreshold: number;
  hasEmblem: boolean;
  status: CategoryStatus;
  wrongIds: string[];
}

export function getCategoryStats(
  progress: PlayerProgress,
  categoryId: string
): CategoryStats {
  return {
    categoryId,
    total: getTotalQuestionsByCategory(categoryId),
    correct: getCategoryProgress(progress, categoryId),
    errors: getErrorCountByCategory(progress, categoryId),
    mastered: getMasteredCountByCategory(progress, categoryId),
    dominancePercent: getDominancePercent(progress, categoryId),
    emblemThreshold: EMBLEM_THRESHOLD,
    hasEmblem: hasCategoryEmblem(progress, categoryId),
    status: getCategoryStatus(progress, categoryId),
    wrongIds: getWrongQuestionIdsByCategory(progress, categoryId),
  };
}

/** Resumo por mundo — agrega todas as categorias */
export interface WorldStats {
  world: World;
  totalCategories: number;
  conqueredEmblems: number;
  totalQuestions: number;
  totalCorrect: number;
  totalErrors: number;
  overallDominance: number;
}

export function getWorldStats(
  progress: PlayerProgress,
  world: World
): WorldStats {
  const categories = getCategoriesByWorld(world);
  let totalQ = 0;
  let totalCorrect = 0;
  let totalErrors = 0;
  let conqueredEmblems = 0;

  for (const cat of categories) {
    const stats = getCategoryStats(progress, cat.id);
    totalQ += stats.total;
    totalCorrect += stats.correct;
    totalErrors += stats.errors;
    if (stats.hasEmblem) conqueredEmblems++;
  }

  return {
    world,
    totalCategories: categories.length,
    conqueredEmblems,
    totalQuestions: totalQ,
    totalCorrect,
    totalErrors,
    overallDominance: totalQ === 0 ? 0 : Math.round((totalCorrect / totalQ) * 100),
  };
}
