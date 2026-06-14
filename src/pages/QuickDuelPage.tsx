import { useRef, useState } from "react";
import { PlayerProgress, Question, World } from "../types/game";
import { AppShell } from "../components/layout/AppShell";
import { Header } from "../components/layout/Header";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { QuestionCard } from "../components/game/QuestionCard";
import { QuestionResult } from "../components/game/QuestionResult";
import { SessionSummary } from "../components/game/SessionSummary";
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

type Phase = "intro" | "question" | "botThinking" | "result" | "finished";

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
  const [lastBotCorrect, setLastBotCorrect] = useState(false);
  const [duelXP, setDuelXP] = useState(0);
  const [localProgress, setLocalProgress] = useState(progress);
  // Refs to always read the latest scores inside finishDuel (avoids stale closure)
  const playerScoreRef = useRef(0);
  const botScoreRef = useRef(0);

  const currentQuestion = questions[index] ?? null;

  function startDuel() {
    const selected = getRandomQuestionsFromWorld(world, 5);
    setQuestions(selected);
    setIndex(0);
    setPlayerScore(0);
    setBotScore(0);
    setDuelXP(0);
    playerScoreRef.current = 0;
    botScoreRef.current = 0;
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
    setLastBotCorrect(botCorrect);
    setLastXP(xpGained);
    setDuelXP((value) => value + xpGained);
    setLocalProgress(nextProgress);
    onProgressUpdate(nextProgress);
    if (isCorrect) {
      playerScoreRef.current += 1;
      setPlayerScore((value) => value + 1);
    }
    if (botCorrect) {
      botScoreRef.current += 1;
      setBotScore((value) => value + 1);
    }
    setPhase("botThinking");

    window.setTimeout(() => {
      setPhase("result");
    }, 1250);
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
    // Use refs to read the definitive scores (avoids stale closure from async setState)
    const finalPlayerScore = playerScoreRef.current;
    const finalBotScore = botScoreRef.current;
    const winBonus = finalPlayerScore > finalBotScore ? getXPForEvent("duel_win") : 0;

    if (winBonus > 0) {
      setDuelXP((value) => value + winBonus);
    }

    setLocalProgress((current) => {
      if (winBonus > 0) {
        const next = {
          ...current,
          xp: current.xp + winBonus,
          level: calcLevel(current.xp + winBonus),
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
          <QuestionCard question={currentQuestion} onAnswer={handleAnswer} showTimer timerSeconds={30} hideScratchpad />
        </Card>
      </AppShell>
    );
  }

  if (phase === "botThinking" && currentQuestion) {
    return (
      <AppShell header={<Header progress={localProgress} title="Duelo Rápido" world={world} onBack={onBack} />}>
        <Card className="p-5 text-center border-amber-700/50 bg-amber-900/20">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-400/15 text-4xl motion-safe:animate-pulse">
            {getBotAvatar()}
          </div>

          <h2 className="mt-3 text-xl font-black text-amber-100">
            {getBotName()} está respondendo...
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            Sua resposta já foi registrada. Agora o bot está escolhendo a alternativa dele.
          </p>

          <div className="mt-4 flex justify-center gap-1" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-2 w-2 rounded-full bg-amber-300 motion-safe:animate-bounce"
                style={{ animationDelay: `${i * 0.16}s` }}
              />
            ))}
          </div>
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
          botResult={{
            name: getBotName(),
            avatar: getBotAvatar(),
            correct: lastBotCorrect,
          }}
        />
      </AppShell>
    );
  }

  const won = playerScore > botScore;
  const drew = playerScore === botScore;
  const duelAccuracy =
    questions.length > 0 ? Math.round((playerScore / questions.length) * 100) : 0;

  return (
    <AppShell header={<Header progress={localProgress} title="Duelo Rápido" world={world} onBack={onBack} />}>
      <SessionSummary
        icon={won ? "🏆" : drew ? "🤝" : "🥈"}
        title={won ? "Você venceu!" : drew ? "Empate!" : `${getBotName()} venceu`}
        message={
          won
            ? "Vitória no duelo! Você respondeu melhor que o rival e ganhou bônus."
            : drew
              ? "Duelo equilibrado. Mais uma rodada pode virar o placar."
              : "O rival levou essa, mas os erros viraram treino para a próxima."
        }
        metrics={[
          {
            icon: "🧑‍🎓",
            label: "Você",
            value: playerScore,
            tone: won ? "success" : drew ? "info" : "neutral",
          },
          {
            icon: getBotAvatar(),
            label: getBotName(),
            value: botScore,
            tone: won ? "neutral" : drew ? "info" : "danger",
          },
          {
            icon: "🎯",
            label: "Precisão",
            value: `${duelAccuracy}%`,
            tone: duelAccuracy >= 60 ? "success" : "warning",
          },
          {
            icon: "⚡",
            label: "XP do duelo",
            value: `+${duelXP}`,
            tone: won ? "warning" : "neutral",
          },
        ]}
        tip={
          won
            ? "Tente manter a sequência no próximo duelo."
            : "Jogue de novo ou revise os erros salvos para virar esse placar."
        }
      >
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={startDuel} fullWidth variant="secondary">
            Jogar de novo
          </Button>
          <Button onClick={onBack} fullWidth>
            Voltar
          </Button>
        </div>
      </SessionSummary>
    </AppShell>
  );
}
