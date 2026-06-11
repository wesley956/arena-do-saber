import { useMemo, useState } from "react";
import { PlayerProgress } from "../types/game";
import { AppShell } from "../components/layout/AppShell";
import { Header } from "../components/layout/Header";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { QuestionCard } from "../components/game/QuestionCard";
import { QuestionResult } from "../components/game/QuestionResult";
import { getQuestionById } from "../data/questions";
import { getCategoryById } from "../data/categories";
import { getErrorsByCategory } from "../lib/stats";
import { getXPForEvent, calcLevel } from "../lib/xp";

interface ReviewErrorsPageProps {
  progress: PlayerProgress;
  onProgressUpdate: (p: PlayerProgress) => void;
  onBack: () => void;
}

type Phase = "list" | "question" | "result" | "done";

export function ReviewErrorsPage({
  progress,
  onProgressUpdate,
  onBack,
}: ReviewErrorsPageProps) {
  const reviewQuestions = useMemo(
    () =>
      progress.wrongQuestionIds
        .filter((id) => !progress.masteredQuestionIds.includes(id))
        .map((id) => getQuestionById(id))
        .filter((question): question is NonNullable<typeof question> => Boolean(question)),
    [progress.wrongQuestionIds, progress.masteredQuestionIds]
  );

  const [phase, setPhase] = useState<Phase>("list");
  const [index, setIndex] = useState(0);
  const [sessionQuestions, setSessionQuestions] = useState<typeof reviewQuestions>([]);
  const [lastQuestion, setLastQuestion] = useState<typeof reviewQuestions[number] | null>(null);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [lastXP, setLastXP] = useState(0);
  const currentQuestion = sessionQuestions[index] ?? null;
  const errorsByCategory = getErrorsByCategory(progress);

  function startReview() {
    setIndex(0);
    setSessionQuestions(reviewQuestions);
    setPhase(reviewQuestions.length > 0 ? "question" : "list");
  }

  function handleAnswer(_selectedId: string, isCorrect: boolean) {
    if (!currentQuestion) return;

    const xpGained = isCorrect ? getXPForEvent("review_correct") : 0;
    setLastQuestion(currentQuestion);
    setLastCorrect(isCorrect);
    setLastXP(xpGained);

    const nextProgress: PlayerProgress = {
      ...progress,
      xp: progress.xp + xpGained,
      level: calcLevel(progress.xp + xpGained),
      streak: isCorrect ? progress.streak + 1 : 0,
      totalCorrect: isCorrect ? progress.totalCorrect + 1 : progress.totalCorrect,
      totalWrong: isCorrect ? progress.totalWrong : progress.totalWrong + 1,
      wrongQuestionIds: isCorrect
        ? progress.wrongQuestionIds.filter((id) => id !== currentQuestion.id)
        : progress.wrongQuestionIds,
      masteredQuestionIds: isCorrect && !progress.masteredQuestionIds.includes(currentQuestion.id)
        ? [...progress.masteredQuestionIds, currentQuestion.id]
        : progress.masteredQuestionIds,
      categoryProgress: isCorrect
        ? {
            ...progress.categoryProgress,
            [currentQuestion.categoryId]:
              (progress.categoryProgress[currentQuestion.categoryId] ?? 0) + 1,
          }
        : progress.categoryProgress,
    };

    onProgressUpdate(nextProgress);
    setPhase("result");
  }

  function continueReview() {
    if (index + 1 >= sessionQuestions.length) {
      setPhase("done");
      return;
    }
    setIndex((value) => value + 1);
    setPhase("question");
  }

  if (phase === "question" && currentQuestion) {
    return (
      <AppShell
        header={<Header progress={progress} title="Revisão dos Erros" onBack={onBack} />}
      >
        <Card className="mb-4 p-3 text-center text-sm font-bold text-slate-300">
          Questão {index + 1}/{reviewQuestions.length} · refazendo erro salvo
        </Card>
        <Card className="p-4">
          <QuestionCard question={currentQuestion} onAnswer={handleAnswer} />
        </Card>
      </AppShell>
    );
  }

  if (phase === "result" && lastQuestion) {
    return (
      <AppShell
        header={<Header progress={progress} title="Revisão dos Erros" onBack={onBack} />}
      >
        <QuestionResult
          question={lastQuestion}
          isCorrect={lastCorrect}
          xpGained={lastXP}
          onContinue={continueReview}
          savedForReview={!lastCorrect}
        />
      </AppShell>
    );
  }

  if (phase === "done") {
    return (
      <AppShell
        header={<Header progress={progress} title="Revisão dos Erros" onBack={onBack} />}
      >
        <Card className="p-6 text-center" glow>
          <div className="mb-3 text-5xl">✅</div>
          <h2 className="mb-2 text-xl font-black text-white">Revisão concluída</h2>
          <p className="mb-5 text-sm text-slate-400">
            Você passou pelas questões salvas. As acertadas foram marcadas como dominadas.
          </p>
          <Button onClick={onBack} fullWidth size="lg">
            Voltar
          </Button>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell
      header={<Header progress={progress} title="Revisão dos Erros" onBack={onBack} />}
    >
      <div className="mb-6 text-center">
        <h2 className="mb-1 text-xl font-black text-white">Refaça suas pegadinhas</h2>
        <p className="text-sm text-slate-400">
          O jogo transforma seus erros em treino guiado.
        </p>
      </div>

      <Card className="mb-4 p-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-2xl font-black text-red-400">{progress.wrongQuestionIds.length}</div>
            <div className="text-xs text-slate-400">Erros</div>
          </div>
          <div className="border-x border-slate-700/60">
            <div className="text-2xl font-black text-emerald-400">{progress.masteredQuestionIds.length}</div>
            <div className="text-xs text-slate-400">Dominadas</div>
          </div>
          <div>
            <div className="text-2xl font-black text-violet-400">{reviewQuestions.length}</div>
            <div className="text-xs text-slate-400">Pendentes</div>
          </div>
        </div>
      </Card>

      {Object.keys(errorsByCategory).length > 0 && (
        <Card className="mb-4 p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Erros por matéria
          </p>
          <div className="space-y-2">
            {Object.entries(errorsByCategory).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between rounded-lg bg-slate-800/60 px-3 py-2 text-sm">
                <span className="text-slate-200">{category}</span>
                <span className="font-black text-red-300">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {reviewQuestions.length === 0 ? (
        <Card className="p-6 text-center">
          <div className="mb-3 text-5xl">🎯</div>
          <h3 className="mb-2 text-lg font-black text-white">Nada pendente agora</h3>
          <p className="mb-4 text-sm text-slate-400">
            Quando você errar questões, elas aparecerão aqui para revisão.
          </p>
          <Button onClick={onBack} fullWidth variant="secondary">
            Voltar
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {reviewQuestions.slice(0, 5).map((question) => {
            const category = getCategoryById(question.categoryId);
            return (
              <Card key={question.id} className="p-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{category?.icon ?? "📌"}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white">{question.subject}</p>
                    <p className="line-clamp-2 text-xs text-slate-400">{question.statement}</p>
                  </div>
                </div>
              </Card>
            );
          })}
          <Button onClick={startReview} fullWidth size="lg" variant="success">
            Iniciar Revisão
          </Button>
        </div>
      )}
    </AppShell>
  );
}
