import { Question, World } from "../types/game";
import { QUESTIONS } from "../data/questions";

// ============================================================
// QUESTION SELECTOR — Arena do Saber
// ============================================================

export function getRandomQuestion(
  categoryId: string,
  excludeIds: string[] = []
): Question | null {
  const pool = QUESTIONS.filter(
    (q) => q.categoryId === categoryId && !excludeIds.includes(q.id)
  );
  if (pool.length === 0) {
    // Fallback: allow repeated questions if all have been asked
    const fallback = QUESTIONS.filter((q) => q.categoryId === categoryId);
    if (fallback.length === 0) return null;
    return fallback[Math.floor(Math.random() * fallback.length)];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getRandomQuestionFromWorld(
  world: World,
  excludeIds: string[] = []
): Question | null {
  const pool = QUESTIONS.filter(
    (q) => q.world === world && !excludeIds.includes(q.id)
  );
  if (pool.length === 0) {
    const fallback = QUESTIONS.filter((q) => q.world === world);
    if (fallback.length === 0) return null;
    return fallback[Math.floor(Math.random() * fallback.length)];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getRandomQuestionsFromWorld(
  world: World,
  count: number
): Question[] {
  const pool = QUESTIONS.filter((q) => q.world === world);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getRandomQuestionsFromIds(
  ids: string[],
  count?: number
): Question[] {
  const pool = QUESTIONS.filter((q) => ids.includes(q.id));
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return count ? shuffled.slice(0, count) : shuffled;
}
