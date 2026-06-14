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
import { getXPForEvent, calcLevel } from "../lib/xp";

interface ReviewErrorsPageProps {
  progress: PlayerProgress;
  onProgressUpdate: (p: PlayerProgress) => void;
  onBack: () => void;
}

type Phase = "list" | "question" | "result" | "done";

const MAX_PREVIEW_QUESTIONS = 5;

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
        .filter((question): question is NonNullable<typeof question> =>
          Boolean(question)
        ),
    [progress.wrongQuestionIds, progress.masteredQuestionIds]
  );

  const categorySummaries = useMemo(() => {
    const summaryMap = new Map<
      string,
      {
        id: string;
        icon: string;
        name: string;
        worldLabel: string;
        count: number;
      }
    >();

    for (const question of reviewQuestions) {
      const category = getCategoryById(question.categoryId);
      const existing = summaryMap.get(question.categoryId);

      if (existing) {
        existing.count += 1;
        continue;
      }

      summaryMap.set(question.categoryId, {
        id: question.categoryId,
        icon: category?.icon ?? "📌",
        name: category?.name ?? question.categoryId,
        worldLabel: category?.world === "contest" ? "Concurso" : "Escola",
        count: 1,
      });
    }

    return Array.from(summaryMap.values()).sort((a, b) => b.count - a.count);
  }, [reviewQuestions]);

  const [phase, setPhase] = useState<Phase>("list");
  const [index, setIndex] = useState(0);
  const [sessionQuestions, setSessionQuestions] = useState<typeof reviewQuestions>(
    []
  );
  const [lastQuestion, setLastQuestion] = useState<
    (typeof reviewQuestions)[number] | null
  >(null);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [lastXP, setLastXP] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionWrong, setSessionWrong] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);

  const currentQuestion = sessionQuestions[index] ?? null;
  const totalSavedErrors = progress.wrongQuestionIds.length;
  const pendingReviewCount = reviewQuestions.length;
  const reviewedCount = sessionCorrect + sessionWrong;
  const sessionTotal = sessionQuestions.length;
  const sessionAccuracy =
    reviewedCount > 0 ? Math.round((sessionCorrect / reviewedCount) * 100) : 0;

  function startReview() {
    setIndex(0);
    setSessionQuestions(reviewQuestions);
    setSessionCorrect(0);
    setSessionWrong(0);
    setSessionXP(0);
    setLastQuestion(null);
    setLastCorrect(false);
    setLastXP(0);
    setPhase(reviewQuestions.length > 0 ? "question" : "list");
  }

  function handleAnswer(_selectedId: string, isCorrect: boolean) {
    if (!currentQuestion) return;

    const xpGained = isCorrect ? getXPForEvent("review_correct") : 0;

    setLastQuestion(currentQuestion);
    setLastCorrect(isCorrect);
    setLastXP(xpGained);
    setSessionXP((value) => value + xpGained);

    if (isCorrect) {
      setSessionCorrect((value) => value + 1);
    } else {
      setSessionWrong((value) => value + 1);
    }

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
      masteredQuestionIds:
        isCorrect && !progress.masteredQuestionIds.includes(currentQuestion.id)
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
    const category = getCategoryById(currentQuestion.categoryId);
    const questionNumber = index + 1;
    const progressPercent =
      sessionTotal > 0 ? Math.round((questionNumber / sessionTotal) * 100) : 0;

    return (
      <AppShell
        header={
          <Header progress={progress} title="Revisão dos Erros" onBack={onBack} />
        }
      >
        <Card className="mb-4 overflow-hidden p-0">
          <div className="border-b border-violet-500/20 bg-violet-950/25 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-violet-300">
              Refaça até dominar
            </p>
            <h2 className="mt-1 text-lg font-black text-white">
              {category?.icon ?? "📌"} {category?.name ?? "Questão salva"}
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              Questão {questionNumber}/{sessionTotal}. Acerte para remover da
              fila de revisão e ganhar XP.
            </p>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-950/70">
              <div
                className="h-full rounded-full bg-violet-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 p-3 text-center">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-2">
              <p className="text-lg font-black text-emerald-300">
                {sessionCorrect}
              </p>
              <p className="text-[11px] font-bold text-slate-400">corrigidas</p>
            </div>

            <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-2">
              <p className="text-lg font-black text-red-300">{sessionWrong}</p>
              <p className="text-[11px] font-bold text-slate-400">persistem</p>
            </div>

            <div className="rounded-2xl border border-violet-500/30 bg-violet-950/20 p-2">
              <p className="text-lg font-black text-violet-300">{sessionXP}</p>
              <p className="text-[11px] font-bold text-slate-400">XP</p>
            </div>
          </div>
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
        header={
          <Header progress={progress} title="Revisão dos Erros" onBack={onBack} />
        }
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
        header={
          <Header progress={progress} title="Revisão dos Erros" onBack={onBack} />
        }
      >
        <Card className="overflow-hidden p-0 text-center" glow>
          <div className="border-b border-emerald-500/20 bg-emerald-950/25 p-6">
            <div className="mb-3 text-6xl">
              {sessionWrong === 0 ? "🏆" : "✅"}
            </div>
            <p className="text-xs font-black uppercase tracking-wide text-emerald-300">
              Sessão concluída
            </p>
            <h2 className="mt-1 text-2xl font-black text-white">
              {sessionWrong === 0
                ? "Você limpou todos os erros desta rodada"
                : "Você avançou na revisão"}
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-300">
              As questões acertadas foram marcadas como dominadas. As que ainda
              deram trabalho continuam salvas para outra rodada.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 p-4">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-3">
              <p className="text-2xl font-black text-emerald-300">
                {sessionCorrect}
              </p>
              <p className="text-[11px] font-bold text-slate-400">dominadas</p>
            </div>

            <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-3">
              <p className="text-2xl font-black text-red-300">{sessionWrong}</p>
              <p className="text-[11px] font-bold text-slate-400">a revisar</p>
            </div>

            <div className="rounded-2xl border border-violet-500/30 bg-violet-950/20 p-3">
              <p className="text-2xl font-black text-violet-300">
                {sessionXP}
              </p>
              <p className="text-[11px] font-bold text-slate-400">XP ganho</p>
            </div>
          </div>

          <div className="space-y-3 p-4 pt-0">
            <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-3 text-sm text-slate-300">
              Precisão da revisão:{" "}
              <strong className="text-white">{sessionAccuracy}%</strong>
            </div>

            <Button onClick={onBack} fullWidth size="lg">
              Voltar
            </Button>
          </div>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell
      header={
        <Header progress={progress} title="Revisão dos Erros" onBack={onBack} />
      }
    >
      <div className="space-y-4">
        <Card className="overflow-hidden p-0" glow>
          <div className="border-b border-red-500/20 bg-red-950/20 p-5 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-3xl border border-red-400/30 bg-red-500/15 text-4xl shadow-lg shadow-red-950/30">
              🔖
            </div>

            <p className="text-xs font-black uppercase tracking-wide text-red-300">
              Aprenda com seus erros
            </p>
            <h1 className="mt-1 text-2xl font-black text-white">
              Revisão dos Erros
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-300">
              O jogo transforma respostas erradas em treino guiado. Acerte uma
              questão aqui para removê-la da fila e marcar como dominada.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 p-4 text-center">
            <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-3">
              <div className="text-2xl font-black text-red-300">
                {totalSavedErrors}
              </div>
              <div className="text-[11px] font-bold text-slate-400">
                erros salvos
              </div>
            </div>

            <div className="rounded-2xl border border-violet-500/30 bg-violet-950/20 p-3">
              <div className="text-2xl font-black text-violet-300">
                {pendingReviewCount}
              </div>
              <div className="text-[11px] font-bold text-slate-400">
                pendentes
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-3">
              <div className="text-2xl font-black text-emerald-300">
                {progress.masteredQuestionIds.length}
              </div>
              <div className="text-[11px] font-bold text-slate-400">
                dominadas
              </div>
            </div>
          </div>
        </Card>

        {pendingReviewCount === 0 ? (
          <Card className="p-6 text-center">
            <div className="mb-3 text-6xl">🎯</div>
            <h3 className="mb-2 text-xl font-black text-white">
              Nada pendente agora
            </h3>
            <p className="mb-5 text-sm leading-relaxed text-slate-400">
              Quando você errar questões, elas aparecerão aqui para revisão.
              Continue jogando para gerar um treino personalizado.
            </p>
            <Button onClick={onBack} fullWidth variant="secondary">
              Voltar
            </Button>
          </Card>
        ) : (
          <>
            <Card className="p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                    Erros por matéria
                  </p>
                  <h2 className="mt-1 text-lg font-black text-white">
                    Onde focar agora
                  </h2>
                </div>
                <span className="rounded-full border border-violet-500/30 bg-violet-950/30 px-3 py-1 text-xs font-black text-violet-200">
                  {categorySummaries.length} matéria
                  {categorySummaries.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="space-y-2">
                {categorySummaries.map((summary) => (
                  <div
                    key={summary.id}
                    className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="text-2xl">{summary.icon}</span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-white">
                            {summary.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {summary.worldLabel}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-black text-red-200">
                        {summary.count} erro{summary.count === 1 ? "" : "s"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <p className="mb-3 text-xs font-black uppercase tracking-wide text-slate-400">
                Próximas questões da revisão
              </p>

              <div className="space-y-3">
                {reviewQuestions
                  .slice(0, MAX_PREVIEW_QUESTIONS)
                  .map((question) => {
                    const category = getCategoryById(question.categoryId);

                    return (
                      <article
                        key={question.id}
                        className="rounded-2xl border border-slate-700 bg-slate-900/70 p-3"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">
                            {category?.icon ?? "📌"}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-black text-white">
                              {question.subject}
                            </p>
                            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">
                              {question.statement}
                            </p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
              </div>

              {reviewQuestions.length > MAX_PREVIEW_QUESTIONS && (
                <p className="mt-3 text-center text-xs text-slate-500">
                  +{reviewQuestions.length - MAX_PREVIEW_QUESTIONS} questão
                  {reviewQuestions.length - MAX_PREVIEW_QUESTIONS === 1
                    ? ""
                    : "ões"}{" "}
                  na fila
                </p>
              )}

              <Button
                onClick={startReview}
                fullWidth
                size="lg"
                variant="success"
                className="mt-4"
              >
                Iniciar Revisão Guiada
              </Button>
            </Card>
          </>
        )}
      </div>
    </AppShell>
  );
}
