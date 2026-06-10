const SOLO_TRAINING_HISTORY_STORAGE_KEY = "arena-do-saber:solo-training-history";
const MAX_HISTORY_IDS_PER_CATEGORY = 50;

type SoloTrainingHistory = Record<string, string[]>;

function getStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

function normalizeQuestionIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  const uniqueIds = new Set<string>();

  value.forEach((item) => {
    if (typeof item === "string" && item.trim().length > 0) {
      uniqueIds.add(item);
    }
  });

  return Array.from(uniqueIds).slice(-MAX_HISTORY_IDS_PER_CATEGORY);
}

function normalizeHistory(value: unknown): SoloTrainingHistory {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.entries(value as Record<string, unknown>).reduce<SoloTrainingHistory>(
    (history, [categoryId, questionIds]) => {
      if (typeof categoryId !== "string" || categoryId.trim().length === 0) {
        return history;
      }

      const normalizedIds = normalizeQuestionIds(questionIds);
      if (normalizedIds.length > 0) {
        history[categoryId] = normalizedIds;
      }

      return history;
    },
    {}
  );
}

function readSoloTrainingHistory(): SoloTrainingHistory {
  const storage = getStorage();
  if (!storage) return {};

  try {
    const rawHistory = storage.getItem(SOLO_TRAINING_HISTORY_STORAGE_KEY);
    if (!rawHistory) return {};

    return normalizeHistory(JSON.parse(rawHistory));
  } catch {
    return {};
  }
}

function writeSoloTrainingHistory(history: SoloTrainingHistory): void {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(
      SOLO_TRAINING_HISTORY_STORAGE_KEY,
      JSON.stringify(normalizeHistory(history))
    );
  } catch {
    // localStorage pode estar indisponível, cheio ou bloqueado pelo navegador.
    // O Treino Solo continua funcionando com histórico apenas em memória.
  }
}

export function getSoloTrainingSeenQuestionIds(categoryId: string): string[] {
  return readSoloTrainingHistory()[categoryId] ?? [];
}

export function mergeSoloTrainingSeenQuestionIds(
  categoryId: string,
  questionIds: string[]
): string[] {
  const history = readSoloTrainingHistory();
  const mergedIds = normalizeQuestionIds([
    ...(history[categoryId] ?? []),
    ...questionIds,
  ]);

  history[categoryId] = mergedIds;
  writeSoloTrainingHistory(history);

  return mergedIds;
}

export function addSoloTrainingSeenQuestion(
  categoryId: string,
  questionId: string
): string[] {
  return mergeSoloTrainingSeenQuestionIds(categoryId, [questionId]);
}

export const SOLO_TRAINING_HISTORY_KEY = SOLO_TRAINING_HISTORY_STORAGE_KEY;
