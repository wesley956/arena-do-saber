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

const CLASSIC_BADGE_GOAL_TITLE = "Insígnias de Sabedoria";

function getClassicBadgeProgressLabel(progress: number): string {
  const safeProgress = Math.min(Math.max(progress, 0), EMBLEM_THRESHOLD);

  return safeProgress >= EMBLEM_THRESHOLD
    ? "Conquistada"
    : `${safeProgress}/${EMBLEM_THRESHOLD}`;
}

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

  const categories = getCategoriesByWorld(world);
  const currentQuestion = match.currentQuestionId
    ? getQuestionById(match.currentQuestionId)
    : null;
  const playerBadgeCount = match.playerEmblems.length;
  const allPlayerBadgesEarned =
    categories.length > 0 &&
    categories.every((category) => match.playerEmblems.includes(category.id));

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

  function handleSpin(categoryId: string) {
    setLastBadgeMessage(null);
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

  function handleAnswer(_selectedId: string, isCorrect: boolean) {
    if (!currentQuestion) return;

      const prevEmblems = match.playerEmblems.length;
  const previousCategoryProgress =
    match.playerCategoryProgress[currentQuestion.categoryId] ?? 0;

  const { match: rawUpdatedMatch, xpGained } = processPlayerAnswer(
    match,
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
    playerCategoryProgress: {
      ...rawUpdatedMatch.playerCategoryProgress,
      [currentQuestion.categoryId]: cappedCategoryProgress,
    },
  };

  const newEmblems = updatedMatch.playerEmblems.length;
  const emblemGained = newEmblems > prevEmblems;
  const badgeCategory = categories.find(
    (category) => category.id === currentQuestion.categoryId
  );

  setLastBadgeMessage(
    isCorrect && emblemGained
      ? `Insígnia conquistada: ${badgeCategory?.emblemName ?? badgeCategory?.name ?? "categoria"}!`
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
  }, [match.lastAnswerCorrect, handleMatchEnd]);

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
            <div className="text-xs text-slate-500">emblemas</div>
          </div>

          {/* VS */}
          <div className="flex flex-col items-center">
            <div className="text-slate-500 text-xs font-bold mb-1">
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
            <div className="text-xs text-slate-500">emblemas</div>
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

      {/* Objetivo: Insígnias de Sabedoria */}
      <Card className="p-4 mb-4 border-violet-700/40 bg-violet-950/20">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-violet-300 font-black">
              Objetivo da partida
            </p>
            <h2 className="text-white font-black text-lg">
              {CLASSIC_BADGE_GOAL_TITLE}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Acerte 3 perguntas em cada categoria para conquistar as 6 insígnias.
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="text-2xl font-black text-violet-300">
              {playerBadgeCount}/{categories.length}
            </div>
            <div className="text-[10px] text-slate-500 font-bold uppercase">
              conquistadas
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categories.map((category) => {
            const progressValue = Math.min(
              match.playerCategoryProgress[category.id] ?? 0,
              EMBLEM_THRESHOLD
            );
            const earned = match.playerEmblems.includes(category.id);

            return (
              <div
                key={category.id}
                className={`rounded-xl border p-3 ${
                  earned
                    ? "border-emerald-500/60 bg-emerald-950/30"
                    : "border-slate-700/60 bg-slate-900/50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{earned ? "✅" : category.icon || "🏅"}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-white truncate">
                      {category.emblemName}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {category.name}
                    </p>
                  </div>
                </div>

                <div
                  className={`text-[11px] font-black rounded-full px-2 py-1 text-center ${
                    earned
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {getClassicBadgeProgressLabel(progressValue)}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Emblems */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className="p-3">
          <p className="text-xs text-slate-500 mb-2 text-center font-semibold">
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
          <p className="text-xs text-slate-500 mb-2 text-center font-semibold">
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
          className={`p-4 mb-4 border-emerald-700/50 ${
            allPlayerBadgesEarned ? "bg-violet-900/30" : "bg-emerald-900/20"
          }`}
        >
          <p className="text-sm font-black text-emerald-300">
            {allPlayerBadgesEarned
              ? "Você conquistou todas as Insígnias de Sabedoria!"
              : "Insígnia conquistada!"}
          </p>
          <p className="text-xs text-slate-300 mt-1">
            {allPlayerBadgesEarned
              ? "As 6 categorias do mundo foram dominadas. Continue para finalizar a partida."
              : lastBadgeMessage}
          </p>
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
    </AppShell>
  );
}
