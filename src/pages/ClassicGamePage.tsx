// FIX: removido import de useRef (não usado diretamente neste arquivo)
import { useState, useEffect, useCallback } from "react";
import { ClassicMatchState, PlayerProgress, World } from "../types/game";
import { AppShell } from "../components/layout/AppShell";
import { Header } from "../components/layout/Header";
import { CategoryWheel } from "../components/game/CategoryWheel";
import { QuestionCard } from "../components/game/QuestionCard";
import { QuestionResult } from "../components/game/QuestionResult";
import { SessionSummary } from "../components/game/SessionSummary";
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
import { vibrateReward } from "../lib/haptics";

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
  if (correctCount === 3) {
    return "Desafio perfeito! Você provou domínio total e conquistou a insígnia!";
  }

  if (correctCount === 2) {
    return "Desafio vencido! Você acertou o necessário e conquistou a insígnia!";
  }

  if (correctCount === 1) {
    return "Quase! Faltou só mais um acerto para conquistar a insígnia.";
  }

  return "A insígnia escapou desta vez. Revise a categoria e tente novamente.";
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
  const [totalXPGained, setTotalXPGained] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
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
  const badgeGoalCount = categories.length;
  const allPlayerBadgesEarned =
    categories.length > 0 &&
    categories.every((category) => match.playerEmblems.includes(category.id));
  const activeBadgeChallengeCategory = badgeChallenge
    ? categories.find((category) => category.id === badgeChallenge.categoryId)
    : null;
  const currentBadgeChallengeQuestionNumber = badgeChallenge
    ? badgeChallenge.currentIndex + 1
    : 0;
  const badgeChallengeSummaryCategory = badgeChallengeSummary
    ? categories.find((category) => category.id === badgeChallengeSummary.categoryId)
    : null;

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

    if (updatedChallenge.correctCount >= BADGE_CHALLENGE_PASSING_SCORE) {
      vibrateReward();
    }

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

  if (emblemGained || challengeUnlocked) {
    vibrateReward();
  }

  setPendingBadgeChallengeCategoryId(
    challengeUnlocked ? currentQuestion.categoryId : null
  );
  const badgeCategory = categories.find(
    (category) => category.id === currentQuestion.categoryId
  );

  setLastBadgeMessage(
    challengeUnlocked
      ? "Você acumulou 3 acertos em " +
        (badgeCategory?.emblemName ?? badgeCategory?.name ?? "categoria") +
        ". Agora vem a prova final: acerte 2 de 3 para conquistar a insígnia."
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
      }, 1200);
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

  function handleFinishedMatchExit() {
    onGameEnd(match, totalXPGained);
  }

  function handleFinishedMatchRestart() {
    setHasStarted(true);
    setMatch(initClassicMatch(world));
    setTotalXPGained(0);
    setShowBotTurnNotice(false);
    setBotThinking(false);
    setLastXP(0);
    setLastBadgeMessage(null);
    setBadgeChallenge(null);
    setBadgeChallengeSummary(null);
    setPendingBadgeChallengeCategoryId(null);
  }

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------

  if (!hasStarted) {
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
        <Card className="overflow-hidden p-0" glow>
          <div className="border-b border-violet-500/20 bg-violet-950/30 p-5 text-center">
            <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-3xl border border-violet-400/30 bg-violet-500/15 text-5xl shadow-xl shadow-violet-950/30">
              🎲
            </div>
            <p className="text-xs font-black uppercase tracking-wide text-violet-300">
              Modo principal
            </p>
            <h1 className="mt-1 text-2xl font-black text-white">
              Partida Clássica
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-300">
              Gire a roleta, responda perguntas e conquiste todas as Insígnias de Sabedoria antes do {getBotName()}.
            </p>
          </div>

          <div className="space-y-4 p-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-violet-500/30 bg-violet-950/20 p-3 text-center">
                <div className="text-2xl">🏅</div>
                <div className="mt-1 text-2xl font-black text-violet-200">
                  {badgeGoalCount}
                </div>
                <div className="text-xs font-bold text-slate-400">
                  insígnias
                </div>
              </div>

              <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-3 text-center">
                <div className="text-2xl">{getBotAvatar()}</div>
                <div className="mt-1 text-sm font-black text-red-200">
                  {getBotName()}
                </div>
                <div className="text-xs font-bold text-slate-400">
                  rival local
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
              <p className="mb-3 text-sm font-black text-white">
                Como vencer
              </p>

              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex gap-3">
                  <span className="shrink-0">🎲</span>
                  <p>Gire a roleta para sortear uma matéria.</p>
                </div>
                <div className="flex gap-3">
                  <span className="shrink-0">✅</span>
                  <p>Acertos acumulam progresso na categoria.</p>
                </div>
                <div className="flex gap-3">
                  <span className="shrink-0">⚔️</span>
                  <p>Com 3 acertos, você libera o Desafio da Insígnia.</p>
                </div>
                <div className="flex gap-3">
                  <span className="shrink-0">🏆</span>
                  <p>Acerte 2 de 3 no desafio para conquistar a insígnia.</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setHasStarted(true)}
              className="w-full rounded-2xl bg-violet-500 px-4 py-4 text-base font-black text-white shadow-xl shadow-violet-950/40 transition hover:bg-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200"
            >
              Começar Partida →
            </button>

            <button
              type="button"
              onClick={onBack}
              className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm font-black text-slate-200 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              ← Voltar
            </button>
          </div>
        </Card>
      </AppShell>
    );
  }

  if (match.status === "finished") {
    const playerWon = match.winner === "player";
    const draw = match.winner === "draw";
    const playerScore = match.playerEmblems.length;
    const botScore = match.botEmblems.length;

    return (
      <AppShell
        header={
          <Header progress={localProgress} title="Partida Clássica" world={world} />
        }
      >
        <SessionSummary
          icon={playerWon ? "🏆" : draw ? "🤝" : "🥈"}
          title={
            playerWon
              ? "Você dominou a Arena!"
              : draw
                ? "Partida empatada!"
                : `${getBotName()} venceu a partida`
          }
          message={
            playerWon
              ? "Excelente! Você conquistou as Insígnias de Sabedoria antes do Rival Bot."
              : draw
                ? "A disputa ficou equilibrada. Mais uma partida pode decidir o domínio."
                : "O Rival Bot levou essa, mas seu progresso e aprendizado continuam salvos."
          }
          metrics={[
            {
              icon: "🧑‍🎓",
              label: "Suas insígnias",
              value: playerScore,
              tone: playerWon ? "success" : draw ? "info" : "neutral",
            },
            {
              icon: getBotAvatar(),
              label: `${getBotName()}`,
              value: botScore,
              tone: playerWon ? "neutral" : draw ? "info" : "danger",
            },
            {
              icon: "⚡",
              label: "XP da partida",
              value: `+${totalXPGained}`,
              tone: "warning",
            },
            {
              icon: "🎲",
              label: "Rodadas",
              value: `${match.round}/${match.maxRounds}`,
              tone: "info",
            },
          ]}
          tip={
            playerWon
              ? "Jogue novamente em outro mundo ou revise os erros para manter a sequência."
              : "Tente novamente e foque nas categorias em que faltam insígnias."
          }
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleFinishedMatchRestart}
              className="rounded-2xl border border-violet-400/40 bg-violet-500/15 px-4 py-3 text-sm font-black text-violet-100 transition hover:bg-violet-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
            >
              🔄 Jogar de novo
            </button>

            <button
              type="button"
              onClick={handleFinishedMatchExit}
              className="rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm font-black text-slate-100 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              ← Voltar à Home
            </button>
          </div>
        </SessionSummary>
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
                    className="w-1.5 h-1.5 bg-amber-400 rounded-full motion-safe:animate-bounce"
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
                ? "border-amber-400/60 bg-amber-950/30 shadow-amber-950/20 motion-safe:animate-pulse"
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
            "p-4 mb-4 border shadow-xl " +
            (badgeChallengeSummary.passed
              ? "border-emerald-400/70 bg-emerald-950/35 shadow-emerald-950/30"
              : "border-amber-400/70 bg-amber-950/30 shadow-amber-950/25")
          }
        >
          <div className="flex items-start gap-3">
            <div
              className={
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-3xl " +
                (badgeChallengeSummary.passed
                  ? "border-emerald-300/50 bg-emerald-500/15"
                  : "border-amber-300/50 bg-amber-500/15")
              }
            >
              {badgeChallengeSummary.passed ? "🏆" : "⚔️"}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Resultado do Desafio da Insígnia
              </p>

              <h3
                className={
                  "mt-1 text-base font-black " +
                  (badgeChallengeSummary.passed
                    ? "text-emerald-200"
                    : "text-amber-200")
                }
              >
                {badgeChallengeSummary.message}
              </h3>

              <p className="mt-1 text-xs text-slate-300">
                {badgeChallengeSummaryCategory?.icon}{" "}
                {badgeChallengeSummaryCategory?.emblemName ??
                  badgeChallengeSummaryCategory?.name ??
                  "Categoria"}{" "}
                · {badgeChallengeSummary.correctCount}/{BADGE_CHALLENGE_SIZE} acertos
              </p>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {Array.from({ length: BADGE_CHALLENGE_SIZE }).map((_, index) => {
                  const wonPoint = index < badgeChallengeSummary.correctCount;
                  return (
                    <div
                      key={index}
                      className={
                        "rounded-xl border px-2 py-2 text-center text-xs font-black " +
                        (wonPoint
                          ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-200"
                          : "border-slate-700 bg-slate-950/40 text-slate-500")
                      }
                    >
                      {wonPoint ? "✓" : "·"} P{index + 1}
                    </div>
                  );
                })}
              </div>

              {!badgeChallengeSummary.passed && (
                <p className="mt-3 rounded-2xl border border-slate-700 bg-slate-950/40 p-3 text-xs leading-relaxed text-slate-300">
                  O progresso 3/3 foi mantido. Quando esta categoria aparecer novamente,
                  você pode tentar o desafio outra vez.
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* IDLE: Roleta */}
      {match.status === "idle" && (
        <Card className="p-4">
          <div className="mb-4 text-center">
            <p className="text-xs font-black uppercase tracking-wide text-violet-300">
              Sua vez de jogar
            </p>
            <h2 className="mt-1 text-xl font-black text-white">
              Gire a roleta e encare a categoria
            </h2>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-400">
              Cada acerto aproxima você de uma insígnia. Se errar, o {getBotName()} ganha a chance de jogar.
            </p>
          </div>

          <CategoryWheel
            categories={categories}
            onSpin={handleSpin}
            disabled={match.currentTurn !== "player"}
          />
        </Card>
      )}

      {badgeChallenge && currentQuestion && (
        <Card className="mb-4 overflow-hidden border-amber-400/70 bg-amber-950/30 p-0 shadow-xl shadow-amber-950/25">
          <div className="border-b border-amber-400/20 bg-amber-500/10 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-wide text-amber-300">
                  Desafio da Insígnia
                </p>

                <h2 className="mt-1 text-xl font-black text-white">
                  {activeBadgeChallengeCategory?.icon}{" "}
                  {activeBadgeChallengeCategory?.emblemName ??
                    activeBadgeChallengeCategory?.name ??
                    "Insígnia"}
                </h2>

                <p className="mt-1 text-xs leading-relaxed text-slate-300">
                  Prove domínio: são {BADGE_CHALLENGE_SIZE} perguntas. Acerte pelo menos{" "}
                  {BADGE_CHALLENGE_PASSING_SCORE} para conquistar a insígnia.
                </p>
              </div>

              <div className="shrink-0 rounded-full border border-amber-300/40 bg-amber-500/20 px-3 py-1 text-xs font-black text-amber-100">
                {currentBadgeChallengeQuestionNumber}/{BADGE_CHALLENGE_SIZE}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {Array.from({ length: BADGE_CHALLENGE_SIZE }).map((_, index) => {
                const completed = index < badgeChallenge.currentIndex;
                const current = index === badgeChallenge.currentIndex;

                return (
                  <div
                    key={index}
                    className={
                      "rounded-2xl border px-2 py-2 text-center text-xs font-black " +
                      (current
                        ? "border-amber-300 bg-amber-400/20 text-amber-100 ring-2 ring-amber-300/20"
                        : completed
                          ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-200"
                          : "border-slate-700 bg-slate-950/40 text-slate-500")
                    }
                  >
                    {completed ? "✓" : current ? "⚔️" : "·"} Perg. {index + 1}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-center">
              <p className="text-xs font-black uppercase tracking-wide text-emerald-300">
                Acertos
              </p>
              <p className="mt-1 text-2xl font-black text-emerald-200">
                {badgeChallenge.correctCount}/{BADGE_CHALLENGE_SIZE}
              </p>
            </div>

            <div className="rounded-2xl border border-violet-500/30 bg-violet-950/20 p-3 text-center">
              <p className="text-xs font-black uppercase tracking-wide text-violet-300">
                Meta
              </p>
              <p className="mt-1 text-sm font-black text-violet-100">
                {BADGE_CHALLENGE_PASSING_SCORE} acertos conquista
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
