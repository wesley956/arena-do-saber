// FIX: removido import de useRef (não usado diretamente neste arquivo)
import { useState, useEffect, useCallback } from "react";
import { ClassicMatchState, PlayerProgress, World } from "../types/game";
import { AppShell } from "../components/layout/AppShell";
import { Header } from "../components/layout/Header";
import { CategoryWheel } from "../components/game/CategoryWheel";
import { QuestionCard } from "../components/game/QuestionCard";
import { QuestionResult } from "../components/game/QuestionResult";
import { EmblemGrid } from "../components/game/EmblemGrid";
import { ProgressBar } from "../components/game/ProgressBar";
import { Card } from "../components/ui/Card";
import { getCategoriesByWorld } from "../data/categories";
import { getQuestionById } from "../data/questions";
import {
  initClassicMatch,
  selectQuestion,
  processPlayerAnswer,
  simulateBotTurn,
  checkVictory,
  applyXPToProgress,
  finalizeMatch,
  EMBLEM_THRESHOLD,
} from "../lib/gameEngine";
import { getBotAvatar, getBotName } from "../lib/bot";
import { getNextQuestionForCategory } from "../lib/questionSelector";

const BADGE_CHALLENGE_SIZE = 3;
const BADGE_CHALLENGE_PASSING_SCORE = 2;
const CLASSIC_BADGE_CYCLE_OPTIONS = {
  minFreshRatio: 0.0001,
};

type BadgeChallengeState = {
  categoryId: string;
  questionIds: string[];
  currentIndex: number;
  correctCount: number;
};

type BadgeChallengeSummary = {
  categoryId: string;
  correctCount: number;
  passed: boolean;
  message: string;
};

function addUniqueId(items: string[], id: string): string[] {
  return items.includes(id) ? items : [...items, id];
}

function addUniqueIds(items: string[], ids: string[]): string[] {
  return ids.reduce((acc, id) => addUniqueId(acc, id), items);
}

function getBadgeChallengeResultMessage(correctCount: number): string {
  if (correctCount === 3) return "Desafio perfeito! Insígnia conquistada!";
  if (correctCount === 2) return "Desafio vencido! Insígnia conquistada!";
  if (correctCount === 1) {
    return "Quase! Você precisa acertar pelo menos 2. Tente novamente.";
  }

  return "A insígnia escapou desta vez. Continue tentando.";
}

const CLASSIC_BADGE_GOAL_TITLE = "Insígnias de Sabedoria";

interface ClassicGamePageProps {
  world: World;
  progress: PlayerProgress;
  onProgressUpdate: (p: PlayerProgress) => void;
  onGameEnd: (match: ClassicMatchState, totalXP: number) => void;
  onBack: () => void;
}

export function ClassicGamePage({
  world,
  progress,
  onProgressUpdate,
  onGameEnd,
  onBack,
}: ClassicGamePageProps) {
  const [match, setMatch] = useState<ClassicMatchState>(() =>
    initClassicMatch(world)
  );
  const [localProgress, setLocalProgress] = useState<PlayerProgress>(progress);
  const [_totalXPGained, setTotalXPGained] = useState(0);
  const [showBotTurnNotice, setShowBotTurnNotice] = useState(false);
  const [botThinking, setBotThinking] = useState(false);
  // FIX: estado para guardar o XP real da última resposta
  const [lastXP, setLastXP] = useState(0);
  const [lastBadgeMessage, setLastBadgeMessage] = useState<string | null>(null);
  const [badgeChallenge, setBadgeChallenge] =
    useState<BadgeChallengeState | null>(null);
  const [badgeChallengeSummary, setBadgeChallengeSummary] =
    useState<BadgeChallengeSummary | null>(null);
  const [pendingBadgeChallengeCategoryId, setPendingBadgeChallengeCategoryId] =
    useState<string | null>(null);

  const categories = getCategoriesByWorld(world);
  const currentQuestion = match.currentQuestionId
    ? getQuestionById(match.currentQuestionId)
    : null;
  const playerBadgeCount = match.playerEmblems.length;
  const allPlayerBadgesEarned =
    categories.length > 0 &&
    categories.every((category) => match.playerEmblems.includes(category.id));
  const activeBadgeChallengeCategory = badgeChallenge
    ? categories.find((category) => category.id === badgeChallenge.categoryId)
    : null;
  const currentBadgeChallengeQuestionNumber = badgeChallenge
    ? badgeChallenge.currentIndex + 1
    : 0;

  // FIX: handleMatchEnd usa useCallback com dependências corretas
  const handleMatchEnd = useCallback(
    (finishedMatch: ClassicMatchState) => {
      const { xpGained, progress: updatedProgress } = finalizeMatch(
        finishedMatch.winner!,
        finishedMatch.playerEmblems
      );
      setTotalXPGained((prev) => {
        const newTotal = prev + xpGained;
        onProgressUpdate(updatedProgress);
        setMatch(finishedMatch);
        setTimeout(() => {
          onGameEnd(finishedMatch, newTotal);
        }, 800);
        return newTotal;
      });
    },
    [onGameEnd, onProgressUpdate]
  );

  // FIX: effect com dependências corretas, não re-executa em loop
  useEffect(() => {
    if (
      match.status !== "finished" &&
      match.status !== "result" &&
      match.status !== "botTurn" &&
      match.status !== "question"
    ) {
      const checked = checkVictory(match);
      if (checked.status === "finished") {
        handleMatchEnd(checked);
      }
    }
  }, [match.playerEmblems.length, match.botEmblems.length, match.round, handleMatchEnd]);


  function getBadgeSafeAnswerMatch(
    currentMatch: ClassicMatchState,
    categoryId: string
  ): ClassicMatchState {
    if (currentMatch.playerEmblems.includes(categoryId)) return currentMatch;

    return {
      ...currentMatch,
      playerEmblems: [...currentMatch.playerEmblems, categoryId],
    };
  }

  function buildBadgeChallengeQuestionIds(categoryId: string): string[] {
    const questionIds: string[] = [];

    for (let index = 0; index < BADGE_CHALLENGE_SIZE; index += 1) {
      const question = getNextQuestionForCategory(
        categoryId,
        [...match.askedQuestionIds, ...questionIds],
        CLASSIC_BADGE_CYCLE_OPTIONS
      );

      if (!question || questionIds.includes(question.id)) break;
      questionIds.push(question.id);
    }

    return questionIds;
  }

  function startBadgeChallenge(categoryId: string) {
    const questionIds = buildBadgeChallengeQuestionIds(categoryId);

    if (questionIds.length === 0) {
      setLastBadgeMessage(
        "Não há perguntas disponíveis para iniciar o Desafio da Insígnia."
      );
      return;
    }

    setBadgeChallenge({
      categoryId,
      questionIds,
      currentIndex: 0,
      correctCount: 0,
    });
    setBadgeChallengeSummary(null);
    setPendingBadgeChallengeCategoryId(null);
    setLastBadgeMessage(null);

    setMatch((prev) => ({
      ...prev,
      status: "question",
      selectedCategoryId: categoryId,
      currentQuestionId: questionIds[0],
      askedQuestionIds: addUniqueIds(prev.askedQuestionIds, [questionIds[0]]),
      lastAnswerCorrect: undefined,
      lastXpGained: 0,
    }));
  }

  function handleSpin(categoryId: string) {
        setBadgeChallenge(null);
    setBadgeChallengeSummary(null);
setLastBadgeMessage(null);

    const readyForBadgeChallenge =
      (match.playerCategoryProgress[categoryId] ?? 0) >= EMBLEM_THRESHOLD &&
      !match.playerEmblems.includes(categoryId);

    if (readyForBadgeChallenge) {
      startBadgeChallenge(categoryId);
      return;
    }
    const questionId = selectQuestion(categoryId, match.askedQuestionIds);

    if (!questionId) {
      // FIX: fallback seguro se não houver pergunta para a categoria
      // Tenta de qualquer categoria do mundo
      const allCategoryIds = categories.map((c) => c.id);
      const fallbackCategoryId = allCategoryIds.find((cid) => {
        return selectQuestion(cid, match.askedQuestionIds) !== null;
      });
      if (!fallbackCategoryId) {
        // Sem perguntas disponíveis — avança round
        setMatch((prev) => ({
          ...prev,
          status: "idle",
          round: prev.round + 1,
        }));
        return;
      }
      const fallbackId = selectQuestion(fallbackCategoryId, match.askedQuestionIds);
      setMatch((prev) => ({
        ...prev,
        status: "question",
        selectedCategoryId: fallbackCategoryId,
        currentQuestionId: fallbackId ?? undefined,
        askedQuestionIds: fallbackId
          ? [...prev.askedQuestionIds, fallbackId]
          : prev.askedQuestionIds,
      }));
      return;
    }

    setMatch((prev) => ({
      ...prev,
      status: "question",
      selectedCategoryId: categoryId,
      currentQuestionId: questionId,
      askedQuestionIds: [...prev.askedQuestionIds, questionId],
    }));
  }


  function handleBadgeChallengeAnswer(_selectedId: string, isCorrect: boolean) {
    if (!currentQuestion || !badgeChallenge) return;

    const categoryId = badgeChallenge.categoryId;
    const baseCategoryProgress = Math.max(
      match.playerCategoryProgress[categoryId] ?? 0,
      EMBLEM_THRESHOLD
    );

    const { match: rawUpdatedMatch, xpGained } = processPlayerAnswer(
      getBadgeSafeAnswerMatch(match, categoryId),
      currentQuestion.difficulty,
      isCorrect
    );

    const updatedMatch: ClassicMatchState = {
      ...rawUpdatedMatch,
      playerEmblems: match.playerEmblems,
      playerCategoryProgress: {
        ...rawUpdatedMatch.playerCategoryProgress,
        [categoryId]: baseCategoryProgress,
      },
      selectedCategoryId: categoryId,
      currentQuestionId: currentQuestion.id,
      status: "result",
    };

    const updatedChallenge: BadgeChallengeState = {
      ...badgeChallenge,
      correctCount: badgeChallenge.correctCount + (isCorrect ? 1 : 0),
    };

    setBadgeChallenge(updatedChallenge);
    setLastXP(xpGained);

    const newProgress = applyXPToProgress(
      localProgress,
      xpGained,
      isCorrect,
      isCorrect ? undefined : currentQuestion.id,
      undefined,
      categoryId
    );

    setLocalProgress(newProgress);
    onProgressUpdate(newProgress);
    setTotalXPGained((prev) => prev + xpGained);
    setMatch(updatedMatch);
  }

  function handleAnswer(_selectedId: string, isCorrect: boolean) {
    if (!currentQuestion) return;

    if (badgeChallenge) {
      handleBadgeChallengeAnswer(_selectedId, isCorrect);
      return;
    }

      const prevEmblems = match.playerEmblems.length;
  const previousCategoryProgress =
    match.playerCategoryProgress[currentQuestion.categoryId] ?? 0;

  const { match: rawUpdatedMatch, xpGained } = processPlayerAnswer(
    getBadgeSafeAnswerMatch(match, currentQuestion.categoryId),
    currentQuestion.difficulty,
    isCorrect
  );

  const cappedCategoryProgress = Math.min(
    rawUpdatedMatch.playerCategoryProgress[currentQuestion.categoryId] ??
      previousCategoryProgress,
    EMBLEM_THRESHOLD
  );

  const updatedMatch: ClassicMatchState = {
    ...rawUpdatedMatch,
    playerEmblems: match.playerEmblems,
    playerCategoryProgress: {
      ...rawUpdatedMatch.playerCategoryProgress,
      [currentQuestion.categoryId]: cappedCategoryProgress,
    },
  };

  const newEmblems = updatedMatch.playerEmblems.length;
  const emblemGained = newEmblems > prevEmblems;
  const challengeUnlocked =
    isCorrect &&
    cappedCategoryProgress >= EMBLEM_THRESHOLD &&
    !match.playerEmblems.includes(currentQuestion.categoryId);

  setPendingBadgeChallengeCategoryId(
    challengeUnlocked ? currentQuestion.categoryId : null
  );
  const badgeCategory = categories.find(
    (category) => category.id === currentQuestion.categoryId
  );

  setLastBadgeMessage(
    challengeUnlocked
      ? "Desafio da Insígnia liberado! Você dominou o básico de " +
        (badgeCategory?.emblemName ?? badgeCategory?.name ?? "categoria") +
        ". Encare o desafio para conquistar a insígnia."
      : null
  );

    // FIX: salvar XP real no estado local
    setLastXP(xpGained);

    // Update local progress
    const newProgress = applyXPToProgress(
      localProgress,
      xpGained,
      isCorrect,
      isCorrect ? undefined : currentQuestion.id,
      emblemGained ? updatedMatch.playerEmblems : undefined,
      currentQuestion.categoryId
    );

    setLocalProgress(newProgress);
    onProgressUpdate(newProgress);
    setTotalXPGained((prev) => prev + xpGained);
    setMatch({ ...updatedMatch, status: "result" });
  }

  // FIX: useCallback com match como dependência captura o estado correto
  const handleContinueAfterResult = useCallback(() => {
        if (badgeChallenge) {
      const nextIndex = badgeChallenge.currentIndex + 1;

      if (nextIndex < badgeChallenge.questionIds.length) {
        const nextQuestionId = badgeChallenge.questionIds[nextIndex];

        setBadgeChallenge((prev) =>
          prev ? { ...prev, currentIndex: nextIndex } : prev
        );
        setMatch((prev) => ({
          ...prev,
          status: "question",
          selectedCategoryId: badgeChallenge.categoryId,
          currentQuestionId: nextQuestionId,
          askedQuestionIds: addUniqueIds(prev.askedQuestionIds, [nextQuestionId]),
          lastAnswerCorrect: undefined,
          lastXpGained: 0,
        }));
        return;
      }

      const passed = badgeChallenge.correctCount >= BADGE_CHALLENGE_PASSING_SCORE;
      const resultMessage = getBadgeChallengeResultMessage(
        badgeChallenge.correctCount
      );

      setBadgeChallengeSummary({
        categoryId: badgeChallenge.categoryId,
        correctCount: badgeChallenge.correctCount,
        passed,
        message: resultMessage,
      });
      setBadgeChallenge(null);
      setPendingBadgeChallengeCategoryId(null);
      setLastBadgeMessage(passed ? resultMessage : null);

      if (passed && !localProgress.completedEmblems.includes(badgeChallenge.categoryId)) {
        const progressWithBadge = {
          ...localProgress,
          completedEmblems: [
            ...localProgress.completedEmblems,
            badgeChallenge.categoryId,
          ],
        };
        setLocalProgress(progressWithBadge);
        onProgressUpdate(progressWithBadge);
      }

      setMatch((currentMatch) => {
        const nextMatch: ClassicMatchState = {
          ...currentMatch,
          status: "idle",
          selectedCategoryId: undefined,
          currentQuestionId: undefined,
          lastAnswerCorrect: undefined,
          lastXpGained: 0,
          playerEmblems: passed
            ? addUniqueId(currentMatch.playerEmblems, badgeChallenge.categoryId)
            : currentMatch.playerEmblems,
          playerCategoryProgress: {
            ...currentMatch.playerCategoryProgress,
            [badgeChallenge.categoryId]: EMBLEM_THRESHOLD,
          },
        };

        const checked = checkVictory(nextMatch);
        if (checked.status === "finished") {
          setTimeout(() => handleMatchEnd(checked), 0);
        }

        return checked;
      });
      return;
    }

    if (pendingBadgeChallengeCategoryId) {
      const categoryId = pendingBadgeChallengeCategoryId;
      setPendingBadgeChallengeCategoryId(null);
      startBadgeChallenge(categoryId);
      return;
    }
if (!match.lastAnswerCorrect) {
      // Player errou -> turno do bot
      setShowBotTurnNotice(true);
      setBotThinking(true);
      setMatch((prev) => ({ ...prev, status: "botTurn" }));

      setTimeout(() => {
        setBotThinking(false);
        // FIX: usar o estado mais atual do match via função de atualização
        setMatch((currentMatch) => {
          const afterBot = simulateBotTurn(currentMatch);
          const checked = checkVictory(afterBot);
          if (checked.status === "finished") {
            // Agendar fim de partida fora do setState
            setTimeout(() => handleMatchEnd(checked), 0);
            return checked;
          }
          setShowBotTurnNotice(false);
          return checked;
        });
      }, 2000);
    } else {
      // Player acertou -> mantém a vez, gira de novo
      setMatch((prev) => ({
        ...prev,
        status: "idle",
        selectedCategoryId: undefined,
        currentQuestionId: undefined,
        lastAnswerCorrect: undefined,
        lastXpGained: 0,
      }));
    }
  }, [
    match.lastAnswerCorrect,
    handleMatchEnd,
    badgeChallenge,
    pendingBadgeChallengeCategoryId,
    localProgress,
    onProgressUpdate,
  ]);

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------

  if (match.status === "finished") {
    return (
      <AppShell
        header={
          <Header progress={localProgress} title="Partida Clássica" world={world} />
        }
      >
        <div className="text-center py-12">
          <div className="text-6xl mb-4 animate-bounce">
            {match.winner === "player"
              ? "🏆"
              : match.winner === "draw"
              ? "🤝"
              : "😔"}
          </div>
          <p className="text-white font-black text-xl mb-2">
          {match.winner === "player"
            ? "Você conquistou todas as Insígnias de Sabedoria!"
            : match.winner === "draw"
              ? "Partida encerrada em empate."
              : "Partida encerrada."}
        </p>
        <p className="text-slate-400 text-sm">Finalizando partida...</p>
        </div>
      </AppShell>
    );
  }

  const readyBadgeCategories = categories.filter((category) => {
    const progressValue = Math.min(
      match.playerCategoryProgress[category.id] ?? 0,
      EMBLEM_THRESHOLD
    );
    const earned = match.playerEmblems.includes(category.id);

    return progressValue >= EMBLEM_THRESHOLD && !earned;
  });

  return (
    <AppShell
      header={
        <Header
          progress={localProgress}
          title="Partida Clássica"
          world={world}
          onBack={onBack}
        />
      }
    >
      {/* Scoreboard */}
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-4">
          {/* Player */}
          <div className="flex-1 text-center">
            <div className="text-2xl mb-1">🧑‍🎓</div>
            <div className="text-xs font-bold text-white">Você</div>
            <div className="text-lg font-black text-violet-400">
              {match.playerEmblems.length}
            </div>
            <div className="text-xs text-slate-400">emblemas</div>
          </div>

          {/* VS */}
          <div className="flex flex-col items-center">
            <div className="text-slate-400 text-xs font-bold mb-1">
              Rodada {match.round}/{match.maxRounds}
            </div>
            <div className="text-slate-400 font-black text-lg">VS</div>
            <div
              className={`text-xs font-semibold mt-1 ${
                match.currentTurn === "player"
                  ? "text-emerald-400"
                  : "text-amber-400"
              }`}
            >
              {match.currentTurn === "player" ? "Sua vez" : "Vez do Bot"}
            </div>
          </div>

          {/* Bot */}
          <div className="flex-1 text-center">
            <div className="text-2xl mb-1">{getBotAvatar()}</div>
            <div className="text-xs font-bold text-white">{getBotName()}</div>
            <div className="text-lg font-black text-red-400">
              {match.botEmblems.length}
            </div>
            <div className="text-xs text-slate-400">emblemas</div>
          </div>
        </div>

        {/* Progress bar round */}
        <div className="mt-3 pt-3 border-t border-slate-700/50">
          <ProgressBar
            value={match.round}
            max={match.maxRounds}
            colorClass="bg-indigo-500"
            height="sm"
            label="Progresso da partida"
          />
        </div>
      </Card>

      {/* Meta compacta da partida */}
      <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-violet-700/30 bg-violet-950/15 px-3 py-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-white">
            {CLASSIC_BADGE_GOAL_TITLE}
          </p>
          <p className="text-xs text-slate-400">
            3 acertos liberam desafio · vença 2 de 3
          </p>
        </div>

        <div className="shrink-0 rounded-full bg-violet-500/15 px-3 py-1 text-sm font-black text-violet-200">
          {playerBadgeCount}/{categories.length}
        </div>
      </div>

      {readyBadgeCategories.length > 0 && match.status === "idle" && (
        <Card className="mb-3 border-amber-500/40 bg-amber-950/20 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-sm font-black text-amber-100">
              🏅 Desafio de insígnia disponível
            </p>
            <p className="text-xs font-bold text-amber-200">
              {readyBadgeCategories.length}
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {readyBadgeCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => startBadgeChallenge(category.id)}
                className="rounded-2xl border border-amber-400/40 bg-amber-500/15 px-3 py-2 text-left text-xs font-black text-amber-100 transition-all hover:bg-amber-500/25 focus:outline-none focus:ring-2 focus:ring-amber-300/70 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                {category.icon} Iniciar desafio · {category.shortName}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Bot turn notice */}
      {showBotTurnNotice && (
        <Card className="p-4 mb-4 border-amber-700/50 bg-amber-900/20">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getBotAvatar()}</span>
            <div>
              <p className="font-bold text-amber-300 text-sm">
                {getBotName()} está jogando...
              </p>
              {botThinking && (
                <p className="text-xs text-amber-400/70 mt-0.5">
                  Pensando na resposta...
                </p>
              )}
            </div>
            {botThinking && (
              <div className="ml-auto flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      {(lastBadgeMessage || allPlayerBadgesEarned) && (
        <Card
          className={
            "p-4 mb-4 border shadow-lg " +
            (allPlayerBadgesEarned
              ? "border-violet-400/70 bg-violet-950/40 shadow-violet-950/30"
              : lastBadgeMessage?.startsWith("Desafio da Insígnia liberado")
                ? "border-amber-400/60 bg-amber-950/30 shadow-amber-950/20 animate-pulse"
                : "border-emerald-500/60 bg-emerald-950/30 shadow-emerald-950/20")
          }
        >
          <p
            className={
              "text-sm font-black " +
              (allPlayerBadgesEarned
                ? "text-violet-200"
                : lastBadgeMessage?.startsWith("Desafio da Insígnia liberado")
                  ? "text-amber-200"
                  : "text-emerald-300")
            }
          >
            {allPlayerBadgesEarned
              ? "Você conquistou todas as Insígnias de Sabedoria!"
              : lastBadgeMessage?.startsWith("Desafio da Insígnia liberado")
                ? "Desafio da Insígnia liberado!"
                : "Insígnia conquistada!"}
          </p>
          <p className="text-xs text-slate-300 mt-1">
            {allPlayerBadgesEarned
              ? "A Arena reconhece seu domínio neste mundo. Continue para finalizar a partida."
              : lastBadgeMessage}
          </p>
        </Card>
      )}

      {badgeChallengeSummary && (
        <Card
          className={
            "p-4 mb-4 border shadow-lg " +
            (badgeChallengeSummary.passed
              ? "border-emerald-500/60 bg-emerald-950/30 shadow-emerald-950/20"
              : "border-amber-500/60 bg-amber-950/30 shadow-amber-950/20")
          }
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">
              {badgeChallengeSummary.passed ? "🏆" : "⚔️"}
            </span>
            <div className="min-w-0">
              <p
                className={
                  "text-sm font-black " +
                  (badgeChallengeSummary.passed
                    ? "text-emerald-300"
                    : "text-amber-300")
                }
              >
                {badgeChallengeSummary.message}
              </p>
              <p className="text-xs text-slate-300 mt-1">
                Resultado do desafio: {badgeChallengeSummary.correctCount}/
                {BADGE_CHALLENGE_SIZE} acertos. Meta: {BADGE_CHALLENGE_PASSING_SCORE}/
                {BADGE_CHALLENGE_SIZE}.
              </p>
              {!badgeChallengeSummary.passed && (
                <p className="text-xs text-slate-400 mt-2">
                  O progresso 3/3 foi mantido. Quando esta categoria aparecer de novo,
                  tente o desafio novamente.
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* IDLE: Roleta */}
      {match.status === "idle" && (
        <Card className="p-4">
          <p className="text-sm font-bold text-white mb-3 text-center">
            🎲 Gire a roleta para escolher a categoria!
          </p>
          <CategoryWheel
            categories={categories}
            onSpin={handleSpin}
            disabled={match.currentTurn !== "player"}
          />
        </Card>
      )}

      {badgeChallenge && currentQuestion && (
        <Card className="p-4 mb-4 border-amber-500/60 bg-amber-950/30 shadow-lg shadow-amber-950/20">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-amber-300 font-black">
                Desafio da Insígnia
              </p>
              <h2 className="text-white font-black text-lg mt-1">
                {activeBadgeChallengeCategory?.emblemName ??
                  activeBadgeChallengeCategory?.name ??
                  "Insígnia"}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Acerte pelo menos {BADGE_CHALLENGE_PASSING_SCORE} de {BADGE_CHALLENGE_SIZE} para conquistar a insígnia.
              </p>
            </div>
            <div className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-black text-amber-200 shrink-0">
              Pergunta {currentBadgeChallengeQuestionNumber}/{BADGE_CHALLENGE_SIZE}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="rounded-xl bg-slate-950/40 border border-slate-700/60 p-2 text-center">
              <p className="text-xs uppercase font-black text-slate-400">
                Acertos do desafio
              </p>
              <p className="text-lg font-black text-emerald-300">
                {badgeChallenge.correctCount}/{BADGE_CHALLENGE_SIZE}
              </p>
            </div>
            <div className="rounded-xl bg-slate-950/40 border border-slate-700/60 p-2 text-center">
              <p className="text-xs uppercase font-black text-slate-400">
                Regra
              </p>
              <p className="text-xs font-black text-amber-200">
                2 de 3 conquista
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* QUESTION: Pergunta */}
      {match.status === "question" && currentQuestion && (
        <Card className="p-4">
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
          />
        </Card>
      )}

      {/* QUESTION: fallback se não houver pergunta */}
      {match.status === "question" && !currentQuestion && (
        <Card className="p-4 text-center">
          <p className="text-slate-400 text-sm mb-3">
            ⚠️ Nenhuma pergunta disponível para esta categoria.
          </p>
          <button
            onClick={() =>
              setMatch((prev) => ({
                ...prev,
                status: "idle",
                selectedCategoryId: undefined,
                currentQuestionId: undefined,
              }))
            }
            className="text-violet-400 text-sm font-bold hover:text-violet-300"
          >
            ← Girar novamente
          </button>
        </Card>
      )}

      {/* RESULT: Resultado */}
      {match.status === "result" && currentQuestion && (
        <div className="mt-0">
          <QuestionResult
            question={currentQuestion}
            isCorrect={match.lastAnswerCorrect ?? false}
            // FIX: usa o XP real da última resposta, não 0
            xpGained={lastXP}
            onContinue={handleContinueAfterResult}
            savedForReview={!match.lastAnswerCorrect}
          />
        </div>
      )}
      {/* Emblems: fica no final para não empurrar a roleta no mobile */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Card className="p-3">
          <p className="text-xs text-slate-400 mb-2 text-center font-semibold">
            Seus Emblemas
          </p>
          <EmblemGrid
            categories={categories}
            earnedIds={match.playerEmblems}
            progress={match.playerCategoryProgress}
            size="sm"
            threshold={EMBLEM_THRESHOLD}
          />
        </Card>
        <Card className="p-3">
          <p className="text-xs text-slate-400 mb-2 text-center font-semibold">
            Emblemas do Bot
          </p>
          <EmblemGrid
            categories={categories}
            earnedIds={match.botEmblems}
            progress={match.botCategoryProgress}
            size="sm"
            threshold={EMBLEM_THRESHOLD}
          />
        </Card>
      </div>

    </AppShell>
  );
}
