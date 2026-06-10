import { Question, World } from "../types/game";
import { QUESTIONS } from "../data/questions";

// ============================================================
// QUESTION SELECTOR — Arena do Saber
// ============================================================

export function shuffleQuestions<T>(items: T[]): T[] {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function pickRandomQuestion(pool: Question[]): Question | null {
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)] ?? null;
}

export function getRandomQuestion(
  categoryId: string,
  excludeIds: string[] = []
): Question | null {
  const excluded = new Set(excludeIds);
  const categoryQuestions = QUESTIONS.filter((q) => q.categoryId === categoryId);

  if (categoryQuestions.length === 0) return null;

  const freshPool = categoryQuestions.filter((q) => !excluded.has(q.id));

  if (freshPool.length > 0) {
    return pickRandomQuestion(freshPool);
  }

  // Fallback: when all questions from the category have already been asked,
  // reshuffle the full pool before returning one. This avoids always repeating
  // the same first question after a cycle is exhausted.
  return shuffleQuestions(categoryQuestions)[0] ?? null;
}

export function getRandomQuestionFromWorld(
  world: World,
  excludeIds: string[] = []
): Question | null {
  const excluded = new Set(excludeIds);
  const worldQuestions = QUESTIONS.filter((q) => q.world === world);

  if (worldQuestions.length === 0) return null;

  const freshPool = worldQuestions.filter((q) => !excluded.has(q.id));

  if (freshPool.length > 0) {
    return pickRandomQuestion(freshPool);
  }

  return shuffleQuestions(worldQuestions)[0] ?? null;
}

export function getRandomQuestionsFromWorld(
  world: World,
  count: number
): Question[] {
  const pool = QUESTIONS.filter((q) => q.world === world);
  return shuffleQuestions(pool).slice(0, count);
}

export function getRandomQuestionsFromIds(ids: string[], count?: number): Question[] {
  const idSet = new Set(ids);
  const pool = QUESTIONS.filter((q) => idSet.has(q.id));
  const shuffled = shuffleQuestions(pool);
  return typeof count === "number" ? shuffled.slice(0, count) : shuffled;
}

type NextQuestionOptions = {
  minFreshRatio?: number;
};

export function getNextQuestionForCategory(
  categoryId: string,
  seenIds: string[] = [],
  options: NextQuestionOptions = {}
): Question | null {
  const categoryQuestions = QUESTIONS.filter((q) => q.categoryId === categoryId);

  if (categoryQuestions.length === 0) return null;

  const seen = new Set(seenIds);
  const freshQuestions = categoryQuestions.filter((q) => !seen.has(q.id));
  const minFreshRatio = options.minFreshRatio ?? 0.5;
  const minFreshCount = Math.ceil(categoryQuestions.length * minFreshRatio);

  const pool = freshQuestions.length >= minFreshCount ? freshQuestions : categoryQuestions;

  return shuffleQuestions(pool)[0] ?? null;
}
