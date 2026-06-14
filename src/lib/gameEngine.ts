import { v4 as uuid } from "../utils/uuid";
import {
  ClassicMatchState,
  PlayerProgress,
  World,
  Difficulty,
} from "../types/game";
import { getCategoriesByWorld } from "../data/categories";
import { getRandomQuestion } from "./questionSelector";
import { getXPForAnswer, getXPForEvent, calcLevel } from "./xp";
import { botAnswersCorrectly, botChooseCategory, initBot } from "./bot";
import { loadProgress, saveProgress } from "./storage";

// ============================================================
// GAME ENGINE — Arena do Saber
// Funções puras de controle de jogo
// ============================================================

// Quantos acertos por categoria para ganhar emblema
export const EMBLEM_THRESHOLD = 3;
export const MAX_ROUNDS = 20;

// ------------------------------------------------------------
// Iniciar partida
// ------------------------------------------------------------
export function initClassicMatch(world: World): ClassicMatchState {
  initBot();
  return {
    id: uuid(),
    world,
    round: 1,
    maxRounds: MAX_ROUNDS,
    currentTurn: "player",
    selectedCategoryId: undefined,
    currentQuestionId: undefined,
    playerEmblems: [],
    botEmblems: [],
    playerCategoryProgress: {},
    botCategoryProgress: {},
    playerScore: 0,
    botScore: 0,
    status: "idle",
    winner: undefined,
    lastAnswerCorrect: undefined,
    lastAnsweredQuestionId: undefined,
    lastXpGained: 0, // FIX: campo inicializado corretamente
    askedQuestionIds: [],
  };
}

// ------------------------------------------------------------
// Girar roleta — escolhe categoria aleatória
// ------------------------------------------------------------
export function spinWheel(world: World): string {
  const categories = getCategoriesByWorld(world);
  const idx = Math.floor(Math.random() * categories.length);
  return categories[idx].id;
}

// ------------------------------------------------------------
// Selecionar pergunta para uma categoria
// ------------------------------------------------------------
export function selectQuestion(
  categoryId: string,
  askedIds: string[]
): string | null {
  const question = getRandomQuestion(categoryId, askedIds);
  return question?.id ?? null;
}

// ------------------------------------------------------------
// Processar resposta do jogador
// FIX: agora retorna xpGained e armazena em lastXpGained no match
// ------------------------------------------------------------
export function processPlayerAnswer(
  match: ClassicMatchState,
  questionDifficulty: Difficulty,
  isCorrect: boolean
): { match: ClassicMatchState; xpGained: number } {
  let newMatch = { ...match };
  let xpGained = 0;

  if (!newMatch.selectedCategoryId) return { match: newMatch, xpGained };

  const catId = newMatch.selectedCategoryId;

  if (isCorrect) {
    xpGained = getXPForAnswer(questionDifficulty);

    // Atualizar progresso da categoria
    const prev = newMatch.playerCategoryProgress[catId] ?? 0;
    newMatch.playerCategoryProgress = {
      ...newMatch.playerCategoryProgress,
      [catId]: prev + 1,
    };

    newMatch.playerScore += 1;

    // Verificar conquista de emblema
    if (
      newMatch.playerCategoryProgress[catId] >= EMBLEM_THRESHOLD &&
      !newMatch.playerEmblems.includes(catId)
    ) {
      newMatch.playerEmblems = [...newMatch.playerEmblems, catId];
      xpGained += getXPForEvent("emblem_gained");
    }
  } else {
    // Salvar questão errada
    if (
      newMatch.currentQuestionId &&
      !newMatch.askedQuestionIds.includes(newMatch.currentQuestionId)
    ) {
      newMatch.askedQuestionIds = [
        ...newMatch.askedQuestionIds,
        newMatch.currentQuestionId,
      ];
    }
  }

  newMatch.lastAnswerCorrect = isCorrect;
  newMatch.lastXpGained = xpGained; // FIX: armazenar XP real no estado
  newMatch.status = "result";

  return { match: newMatch, xpGained };
}

// ------------------------------------------------------------
// Simular turno do bot
// FIX: incremento de round acontece aqui, não trava loop
// ------------------------------------------------------------
export function simulateBotTurn(
  match: ClassicMatchState
): ClassicMatchState {
  const categories = getCategoriesByWorld(match.world);
  const catId = botChooseCategory(categories.map((c) => c.id));

  // Bot tenta responder
  const question = getRandomQuestion(catId, match.askedQuestionIds);

  let newMatch = { ...match };

  if (question) {
    const botCorrect = botAnswersCorrectly(question.difficulty);

    if (botCorrect) {
      const prev = newMatch.botCategoryProgress[catId] ?? 0;
      newMatch.botCategoryProgress = {
        ...newMatch.botCategoryProgress,
        [catId]: prev + 1,
      };
      newMatch.botScore += 1;

      if (
        newMatch.botCategoryProgress[catId] >= EMBLEM_THRESHOLD &&
        !newMatch.botEmblems.includes(catId)
      ) {
        newMatch.botEmblems = [...newMatch.botEmblems, catId];
      }
    }

    // FIX: só adiciona ao askedQuestionIds se não estiver já lá
    if (!newMatch.askedQuestionIds.includes(question.id)) {
      newMatch.askedQuestionIds = [
        ...newMatch.askedQuestionIds,
        question.id,
      ];
    }
  }

  // Verificar vitória do bot antes de passar a vez
  const totalCategories = getCategoriesByWorld(match.world).length;
  if (newMatch.botEmblems.length >= totalCategories) {
    newMatch.status = "finished";
    newMatch.winner = "bot";
    return newMatch;
  }

  // FIX: incremento de round e devolução de turno ao jogador
  newMatch.currentTurn = "player";
  newMatch.round = newMatch.round + 1;
  newMatch.status = "idle";
  newMatch.selectedCategoryId = undefined;
  newMatch.currentQuestionId = undefined;

  return newMatch;
}

// ------------------------------------------------------------
// Verificar vitória
// ------------------------------------------------------------
export function checkVictory(match: ClassicMatchState): ClassicMatchState {
  const totalCategories = getCategoriesByWorld(match.world).length;

  if (match.playerEmblems.length >= totalCategories) {
    return { ...match, status: "finished", winner: "player" };
  }
  if (match.botEmblems.length >= totalCategories) {
    return { ...match, status: "finished", winner: "bot" };
  }
  if (match.round >= match.maxRounds) {
    const winner =
      match.playerEmblems.length > match.botEmblems.length
        ? "player"
        : match.botEmblems.length > match.playerEmblems.length
        ? "bot"
        : "draw";
    return { ...match, status: "finished", winner };
  }

  return match;
}

// ------------------------------------------------------------
// Aplicar XP ao progresso do jogador
// ------------------------------------------------------------
export function applyXPToProgress(
  progress: PlayerProgress,
  xp: number,
  isCorrect: boolean,
  questionId?: string,
  emblemIds?: string[],
  categoryId?: string
): PlayerProgress {
  const newProgress = { ...progress };
  newProgress.xp += xp;
  newProgress.level = calcLevel(newProgress.xp);

  if (isCorrect) {
    newProgress.totalCorrect += 1;
    newProgress.streak += 1;
    if (categoryId) {
      newProgress.categoryProgress = {
        ...newProgress.categoryProgress,
        [categoryId]: (newProgress.categoryProgress[categoryId] ?? 0) + 1,
      };
    }
  } else {
    newProgress.totalWrong += 1;
    newProgress.streak = 0;
    // FIX: evitar duplicação de IDs na lista de erros
    if (questionId && !newProgress.wrongQuestionIds.includes(questionId)) {
      newProgress.wrongQuestionIds = [...newProgress.wrongQuestionIds, questionId];
    }
  }

  if (emblemIds && emblemIds.length > 0) {
    for (const id of emblemIds) {
      if (!newProgress.completedEmblems.includes(id)) {
        newProgress.completedEmblems = [...newProgress.completedEmblems, id];
      }
    }
  }

  saveProgress(newProgress);
  return newProgress;
}

// ------------------------------------------------------------
// Finalizar partida e salvar progresso global
// ------------------------------------------------------------
export function finalizeMatch(
  winner: "player" | "bot" | "draw",
  playerEmblems: string[]
): { xpGained: number; progress: PlayerProgress } {
  const progress = loadProgress();
  let xpGained = 0;

  if (winner === "player") {
    xpGained += getXPForEvent("classic_win");
    progress.totalWins += 1;
  }

  for (const id of playerEmblems) {
    if (!progress.completedEmblems.includes(id)) {
      progress.completedEmblems.push(id);
    }
  }

  progress.xp += xpGained;
  progress.level = calcLevel(progress.xp);
  progress.totalGamesPlayed += 1;

  saveProgress(progress);
  return { xpGained, progress };
}
