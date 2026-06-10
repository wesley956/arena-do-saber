import { useState, useEffect } from "react";
import { PlayerProgress, World, SoloSession } from "../types/game";
import { AppShell } from "../components/layout/AppShell";
import { Header } from "../components/layout/Header";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { QuestionCard } from "../components/game/QuestionCard";
import { QuestionResult } from "../components/game/QuestionResult";
import { getCategoriesByWorld, getCategoryById } from "../data/categories";
import { getQuestionById } from "../data/questions";
import { getRandomQuestion } from "../lib/questionSelector";
import { applyXPToProgress } from "../lib/gameEngine";
import { getXPForAnswer } from "../lib/xp";

interface SoloTrainingPageProps {
  world: World;
  progress: PlayerProgress;
  onProgressUpdate: (p: PlayerProgress) => void;
  onBack: () => void;
  /** Quando vem do Mapa de Estudos, pula a seleção e inicia direto na categoria */
  preselectedCategoryId?: string;
}

type Phase = "select" | "question" | "result" | "done";

export function SoloTrainingPage({
  world,
  progress,
  onProgressUpdate,
  onBack,
  preselectedCategoryId,
}: SoloTrainingPageProps) {
  const categories = getCategoriesByWorld(world);

  const [phase, setPhase] = useState<Phase>("select");
  const [session, setSession] = useState<SoloSession | null>(null);
  const [localProgress, setLocalProgress] = useState<PlayerProgress>(progress);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [lastXP, setLastXP] = useState(0);

  // Se veio do Mapa de Estudos com categoria pré-selecionada, auto-inicia
  useEffect(() => {
    if (preselectedCategoryId && phase === "select") {
      startSession(preselectedCategoryId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentCategory = session?.categoryId
    ? getCategoryById(session.categoryId)
    : null;
  const currentQuestion =
    session?.currentQuestionId
      ? getQuestionById(session.currentQuestionId)
      : null;

  function startSession(categoryId: string) {
    const question = getRandomQuestion(categoryId, []);
    if (!question) {
      return;
    }
    setSession({
      world,
      categoryId,
      correct: 0,
      wrong: 0,
      askedQuestionIds: [question.id],
      currentQuestionId: question.id,
      status: "active",
    });
    setPhase("question");
  }

  function handleAnswer(_selectedId: string, isCorrect: boolean) {
    if (!session || !currentQuestion) return;

    const xpGained = isCorrect ? getXPForAnswer(currentQuestion.difficulty) : 0;
    setLastXP(xpGained);
    setLastCorrect(isCorrect);

    const newProgress = applyXPToProgress(
      localProgress,
      xpGained,
      isCorrect,
      isCorrect ? undefined : currentQuestion.id,
      undefined,
      currentQuestion.categoryId
    );
    setLocalProgress(newProgress);
    onProgressUpdate(newProgress);

    setSession((prev) =>
      prev
        ? {
            ...prev,
            correct: isCorrect ? prev.correct + 1 : prev.correct,
            wrong: isCorrect ? prev.wrong : prev.wrong + 1,
          }
        : prev
    );

    setPhase("result");
  }

  function handleContinue() {
    if (!session) return;

    const total = session.correct + session.wrong;
    if (total >= 10) {
      setPhase("done");
      return;
    }

    const nextQuestion = getRandomQuestion(
      session.categoryId,
      session.askedQuestionIds
    );

    if (!nextQuestion) {
      setPhase("done");
      return;
    }

    setSession((prev) =>
      prev
        ? {
            ...prev,
            currentQuestionId: nextQuestion.id,
            askedQuestionIds: [...prev.askedQuestionIds, nextQuestion.id],
          }
        : prev
    );
    setPhase("question");
  }

  function handleRestart() {
    setSession(null);
    setPhase("select");
  }

  // PHASE: select category
  if (phase === "select") {
    return (
      <AppShell
        header={
          <Header
            progress={localProgress}
            title="Treino Solo"
            world={world}
            onBack={onBack}
          />
        }
      >
        <div className="text-center mb-6">
          <h2 className="text-xl font-black text-white mb-1">
            Escolha a matéria
          </h2>
          <p className="text-slate-400 text-sm">
            Estude no seu ritmo, sem pressão.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => startSession(cat.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 ${cat.borderClass} bg-slate-800/60 hover:bg-slate-700/60 text-left transition-all active:scale-[0.98]`}
            >
              <span
                className={`w-12 h-12 rounded-xl ${cat.bgClass} flex items-center justify-center text-2xl flex-shrink-0`}
              >
                {cat.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className={`font-bold text-base ${cat.textClass}`}>
                  {cat.name}
                </div>
                <div className="text-xs text-slate-400">{cat.description}</div>
              </div>
              <span className="text-slate-500">›</span>
            </button>
          ))}
        </div>
      </AppShell>
    );
  }

  // PHASE: done
  if (phase === "done" && session) {
    const total = session.correct + session.wrong;
    const accuracy = total > 0 ? Math.round((session.correct / total) * 100) : 0;

    return (
      <AppShell
        header={
          <Header
            progress={localProgress}
            title="Treino Solo"
            world={world}
            onBack={onBack}
          />
        }
      >
        <Card className="p-6 text-center mb-4" glow>
          <div className="text-5xl mb-3">📚</div>
          <h2 className="text-xl font-black text-white mb-1">Treino Concluído!</h2>
          <p className="text-slate-400 text-sm mb-4">
            Ótimo trabalho! Continue praticando para evoluir.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-700/40 rounded-xl p-3">
              <div className="text-2xl font-black text-emerald-400">
                {session.correct}
              </div>
              <div className="text-xs text-slate-400">Acertos</div>
            </div>
            <div className="bg-slate-700/40 rounded-xl p-3">
              <div className="text-2xl font-black text-red-400">
                {session.wrong}
              </div>
              <div className="text-xs text-slate-400">Erros</div>
            </div>
          </div>

          {total > 0 && (
            <p className="text-sm text-slate-300">
              Taxa de acerto:{" "}
              <strong className="text-violet-300">{accuracy}%</strong>
            </p>
          )}
        </Card>

        <div className="flex flex-col gap-3">
          <Button onClick={handleRestart} fullWidth size="lg" variant="primary">
            🔄 Estudar outra matéria
          </Button>
          <Button onClick={onBack} fullWidth size="md" variant="ghost">
            ← Voltar
          </Button>
        </div>
      </AppShell>
    );
  }

  // PHASE: question
  if (phase === "question" && currentQuestion && session) {
    const total = session.correct + session.wrong;
    return (
      <AppShell
        header={
          <Header
            progress={localProgress}
            title={currentCategory?.name ?? "Treino Solo"}
            subtitle="Treino Solo"
            world={world}
            onBack={onBack}
          />
        }
      >
        <div className="flex items-center justify-between mb-4 text-xs text-slate-400">
          <span>
            {currentCategory?.icon} {currentCategory?.name}
          </span>
          <span>
            Questão {total + 1}/10
          </span>
        </div>

        <Card className="p-4">
          <QuestionCard question={currentQuestion} onAnswer={handleAnswer} />
        </Card>
      </AppShell>
    );
  }

  // PHASE: result
  if (phase === "result" && currentQuestion && session) {
    return (
      <AppShell
        header={
          <Header
            progress={localProgress}
            title={currentCategory?.name ?? "Treino Solo"}
            subtitle="Treino Solo"
            world={world}
            onBack={onBack}
          />
        }
      >
        <QuestionResult
          question={currentQuestion}
          isCorrect={lastCorrect}
          xpGained={lastXP}
          onContinue={handleContinue}
          savedForReview={!lastCorrect}
        />
      </AppShell>
    );
  }

  // Fallback / loading (enquanto o useEffect dispara o startSession)
  return (
    <AppShell
      header={
        <Header progress={localProgress} title="Treino Solo" world={world} onBack={onBack} />
      }
    >
      <div className="text-center py-12">
        <p className="text-slate-400">Carregando...</p>
      </div>
    </AppShell>
  );
}
