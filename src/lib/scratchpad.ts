import { LEGACY_KEYS, STORAGE_KEYS } from "./storageKeys";

// ============================================================
// SCRATCHPAD — Caderno de Resolução
// Persiste rascunhos por questão no LocalStorage.
// ============================================================

function migrateScratchpads(): void {
  try {
    const legacyScratchpads = localStorage.getItem(LEGACY_KEYS.SCRATCHPADS);
    const currentScratchpads = localStorage.getItem(STORAGE_KEYS.SCRATCHPADS);

    if (legacyScratchpads && !currentScratchpads) {
      localStorage.setItem(STORAGE_KEYS.SCRATCHPADS, legacyScratchpads);
    }

    if (legacyScratchpads) {
      localStorage.removeItem(LEGACY_KEYS.SCRATCHPADS);
    }
  } catch {
    // Caderno é recurso auxiliar. Se falhar, o app continua normal.
  }
}

/** Carrega o mapa completo de rascunhos do storage. */
function loadAll(): Record<string, string> {
  try {
    migrateScratchpads();

    const raw = localStorage.getItem(STORAGE_KEYS.SCRATCHPADS);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return {};
    }

    return parsed as Record<string, string>;
  } catch {
    return {};
  }
}

/** Persiste o mapa completo no storage. */
function saveAll(map: Record<string, string>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SCRATCHPADS, JSON.stringify(map));
    localStorage.removeItem(LEGACY_KEYS.SCRATCHPADS);
  } catch {
    // Storage cheio ou indisponível — falha silenciosa
  }
}

/** Lê o rascunho de uma questão específica. Retorna "" se não existir. */
export function loadScratchpad(questionId: string): string {
  if (!questionId) return "";

  const all = loadAll();
  return all[questionId] ?? "";
}

/** Salva o rascunho de uma questão. String vazia remove a entrada. */
export function saveScratchpad(questionId: string, text: string): void {
  if (!questionId) return;

  const all = loadAll();

  if (text.trim() === "") {
    delete all[questionId];
  } else {
    all[questionId] = text;
  }

  saveAll(all);
}

/** Remove o rascunho de uma questão específica. */
export function clearScratchpad(questionId: string): void {
  if (!questionId) return;

  const all = loadAll();
  delete all[questionId];
  saveAll(all);
}

/** Quantas questões têm rascunho salvo. Útil para debug/info. */
export function getScratchpadCount(): number {
  return Object.keys(loadAll()).length;
}
