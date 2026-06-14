import { useEffect } from "react";
import { Question } from "../../types/game";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { vibrateError, vibrateReward, vibrateSuccess } from "../../lib/haptics";

interface QuestionResultProps {
  question: Question;
  isCorrect: boolean;
  xpGained: number;
  emblemGained?: string;
  onContinue: () => void;
  savedForReview?: boolean;
  botResult?: {
    name: string;
    avatar: string;
    correct: boolean;
  };
}

export function QuestionResult({
  question,
  isCorrect,
  xpGained,
  emblemGained,
  onContinue,
  savedForReview = false,
  botResult,
}: QuestionResultProps) {
  const correctAnswer = question.alternatives.find(
    (a) => a.id === question.correctAlternativeId
  )?.text;

  useEffect(() => {
    if (emblemGained) {
      vibrateReward();
      return;
    }

    if (isCorrect) {
      vibrateSuccess();
      return;
    }

    vibrateError();
  }, [emblemGained, isCorrect]);

  const resultIcon = emblemGained ? "🏆" : isCorrect ? "🎉" : "💡";
  const resultTitle = emblemGained
    ? "Insígnia conquistada!"
    : isCorrect
      ? "Resposta Correta!"
      : "Resposta Incorreta";

  const resultMessage = emblemGained
    ? "Excelente! Você transformou domínio em conquista dentro da Arena."
    : isCorrect
      ? "Boa! Você avançou mais um passo no domínio do conteúdo."
      : "Sem problema. Errar aqui também conta como treino.";

  const continueLabel = emblemGained
    ? "Continuar minha jornada →"
    : isCorrect
      ? "Manter sequência →"
      : "Aprender e seguir →";

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`result-reveal rounded-2xl p-5 text-center border-2 overflow-hidden relative ${
          isCorrect
            ? "bg-emerald-900/45 border-emerald-400 shadow-xl shadow-emerald-950/30"
            : "bg-red-900/45 border-red-400 shadow-xl shadow-red-950/30"
        }`}
        aria-live="polite"
      >
        <div
          className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl text-4xl ${
            isCorrect
              ? "bg-emerald-400/15 motion-safe:animate-bounce"
              : "bg-red-400/15 motion-safe:animate-pulse"
          }`}
        >
          {resultIcon}
        </div>

        <h2
          className={`text-2xl font-black mb-1 ${
            isCorrect ? "text-emerald-200" : "text-red-200"
          }`}
        >
          {resultTitle}
        </h2>

        <p className="text-sm text-slate-300 mb-3">
          {resultMessage}
        </p>

        <div className="flex flex-wrap justify-center gap-2">
          {xpGained > 0 && (
            <div className="inline-flex items-center gap-1.5 bg-amber-900/60 text-amber-200 border border-amber-600/70 rounded-full px-3 py-1.5 text-sm font-black">
              ⚡ +{xpGained} XP
            </div>
          )}

          {emblemGained && (
            <div className="inline-flex items-center gap-1.5 bg-violet-900/80 text-violet-100 border border-violet-400/80 rounded-full px-3 py-1.5 text-sm font-black shadow-lg shadow-violet-950/30">
              🏆 Nova conquista desbloqueada
            </div>
          )}

          {botResult && (
            <div
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-black ${
                botResult.correct
                  ? "border-red-600/70 bg-red-900/60 text-red-200"
                  : "border-emerald-600/50 bg-emerald-900/40 text-emerald-200"
              }`}
            >
              <span aria-hidden="true">{botResult.avatar}</span>
              <span>
                {botResult.name} {botResult.correct ? "acertou também" : "errou essa"}
              </span>
            </div>
          )}

        </div>
      </div>

      {!isCorrect && (
        <Card className="p-4 border-emerald-800/40 bg-emerald-950/20">
          <p className="text-emerald-300 text-xs mb-2 uppercase tracking-wider font-black">
            Resposta correta
          </p>
          <p className="text-emerald-100 font-semibold text-base leading-relaxed">
            {correctAnswer}
          </p>
        </Card>
      )}

      <Card className="p-4">
        <p className="text-slate-300 text-xs mb-2 uppercase tracking-wider font-black">
          📚 Explicação
        </p>
        <p className="text-slate-100 text-base leading-relaxed">
          {question.explanation}
        </p>
      </Card>

      {!isCorrect && question.trap && (
        <Card className="p-4 border-amber-800/40 bg-amber-900/20">
          <p className="text-amber-300 text-xs mb-2 uppercase tracking-wider font-black">
            ⚠️ Pegadinha
          </p>
          <p className="text-amber-100 text-base leading-relaxed">
            {question.trap}
          </p>
        </Card>
      )}

      {!isCorrect && savedForReview && (
        <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/70 rounded-xl p-3 border border-slate-700">
          <span aria-hidden="true">🔖</span>
          <span>
            Pergunta salva para{" "}
            <strong className="text-slate-100">Revisão dos Erros</strong>
          </span>
        </div>
      )}

      <Button
        onClick={onContinue}
        fullWidth
        size="lg"
        variant={isCorrect ? "success" : "secondary"}
      >
        {continueLabel}
      </Button>
    </div>
  );
}
