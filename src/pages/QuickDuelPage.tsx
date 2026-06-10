import { useState } from "react";
import { PlayerProgress, Question, World } from "../types/game";
import { AppShell } from "../components/layout/AppShell";
import { Header } from "../components/layout/Header";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { QuestionCard } from "../components/game/QuestionCard";
import { QuestionResult } from "../components/game/QuestionResult";
import { getRandomQuestionsFromWorld } from "../lib/questionSelector";
import { botAnswersCorrectly, getBotAvatar, getBotName } from "../lib/bot";
import { applyXPToProgress } from "../lib/gameEngine";
import { getXPForAnswer, getXPForEvent, calcLevel } from "../lib/xp";

interface QuickDuelPageProps {
  world: World;
  progress: PlayerProgress;
  onProgressUpdate: (p: PlayerProgress) => void;
  onBack: () => void;
}

type Phase = "intro" | "question" | "result" | "finished";

export function QuickDuelPage({
  world,
  progress,
  onProgressUpdate,
  onBack,
}: QuickDuelPageProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [lastXP, setLastXP] = useState(0);
  const [localProgress, setLocalProgress] = useState(progress);

  const currentQuestion = questions[index] ?? null;

  function startDuel() {
    const selected = getRandomQuestionsFromWorld(world, 5);
    setQuestions(selected);
    setIndex(0);
    setPlayerScore(0);
    setBotScore(0);
    setPhase(selected.length > 0 ? "question" : "finished");
  }

  function handleAnswer(_selectedId: string, isCorrect: boolean) {
    if (!currentQuestion) return;

    const botCorrect = botAnswersCorrectly(currentQuestion.difficulty);
    const xpGained = isCorrect ? getXPForAnswer(currentQuestion.difficulty) : 0;
    const nextProgress = applyXPToProgress(
      localProgress,
      xpGained,
      isCorrect,
      isCorrect ? undefined : currentQuestion.id,
      undefined,
      currentQuestion.categoryId
    );

    setLastCorrect(isCorrect);
    setLastXP(xpGained);
    setLocalProgress(nextProgress);
    onProgressUpdate(nextProgress);
    if (isCorrect) setPlayerScore((value) => value + 1);
    if (botCorrect) setBotScore((value) => value + 1);
    setPhase("result");
  }

  function continueDuel() {
    if (index + 1 >= questions.length) {
      finishDuel();
      return;
    }
    setIndex((value) => value + 1);
    setPhase("question");
  }

  function finishDuel() {
    setPhase("finished");
    setLocalProgress((current) => {
      if (playerScore > botScore) {
        const bonus = getXPForEvent("duel_win");
        const next = {
          ...current,
          xp: current.xp + bonus,
          level: calcLevel(current.xp + bonus),
        };
        onProgressUpdate(next);
        return next;
      }
      onProgressUpdate(current);
      return current;
    });
  }

  if (phase === "intro") {
    return (
      <AppShell header={<Header progress={localProgress} title="Duelo Rápido" world={world} onBack={onBack} />}>
        <Card className="p-6 text-center" glow>
          <div className="mb-3 text-6xl">⚡</div>
          <h2 className="mb-2 text-2xl font-black text-white">Duelo Rápido Local</h2>
          <p className="mb-5 text-sm text-slate-400">
            Responda 5 perguntas contra um bot. Ideal para uma sessão curta.
          </p>
          <Button onClick={startDuel} fullWidth size="lg">
            Começar duelo
          </Button>
        </Card>
      </AppShell>
    );
  }

  if (phase === "question" && currentQuestion) {
    return (
      <AppShell header={<Header progress={localProgress} title="Duelo Rápido" world={world} onBack={onBack} />}>
        <Card className="mb-4 p-4">
          <div className="flex items-center justify-between text-center">
            <div>
              <div className="text-2xl">🧑‍🎓</div>
              <div className="text-lg font-black text-violet-300">{playerScore}</div>
            </div>
            <div className="text-xs font-bold text-slate-400">Pergunta {index + 1}/{questions.length}</div>
            <div>
              <div className="text-2xl">{getBotAvatar()}</div>
              <div className="text-lg font-black text-red-300">{botScore}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <QuestionCard question={currentQuestion} onAnswer={handleAnswer} showTimer timerSeconds={30} />
        </Card>
      </AppShell>
    );
  }

  if (phase === "result" && currentQuestion) {
    return (
      <AppShell header={<Header progress={localProgress} title="Duelo Rápido" world={world} onBack={onBack} />}>
        <QuestionResult
          question={currentQuestion}
          isCorrect={lastCorrect}
          xpGained={lastXP}
          onContinue={continueDuel}
          savedForReview={!lastCorrect}
        />
      </AppShell>
    );
  }

  const won = playerScore > botScore;
  const drew = playerScore === botScore;

  return (
    <AppShell header={<Header progress={localProgress} title="Duelo Rápido" world={world} onBack={onBack} />}>
      <Card className="p-6 text-center" glow>
        <div className="mb-3 text-6xl">{won ? "🏆" : drew ? "🤝" : "🥈"}</div>
        <h2 className="mb-2 text-2xl font-black text-white">
          {won ? "Você venceu!" : drew ? "Empate!" : `${getBotName()} venceu`}
        </h2>
        <p className="mb-5 text-sm text-slate-400">
          Placar final: Você {playerScore} x {botScore} {getBotName()}
        </p>
        {won && (
          <p className="mb-4 rounded-xl border border-amber-700 bg-amber-900/30 p-3 text-sm font-bold text-amber-300">
            ⚡ Bônus de vitória: +{getXPForEvent("duel_win")} XP
          </p>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={startDuel} fullWidth variant="secondary">
            Jogar de novo
          </Button>
          <Button onClick={onBack} fullWidth>
            Voltar
          </Button>
        </div>
      </Card>
    </AppShell>
  );
}
