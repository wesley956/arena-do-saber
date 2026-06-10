import { Question } from "../../types/game";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface QuestionResultProps {
  question: Question;
  isCorrect: boolean;
  xpGained: number;
  emblemGained?: string;
  onContinue: () => void;
  savedForReview?: boolean;
}

export function QuestionResult({
  question,
  isCorrect,
  xpGained,
  emblemGained,
  onContinue,
  savedForReview = false,
}: QuestionResultProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Result Banner */}
      <div
        className={`rounded-2xl p-4 text-center border-2 ${
          isCorrect
            ? "bg-emerald-900/40 border-emerald-500 shadow-lg shadow-emerald-900/20"
            : "bg-red-900/40 border-red-500 shadow-lg shadow-red-900/20"
        }`}
      >
        <div className="text-4xl mb-2">{isCorrect ? "🎉" : "😔"}</div>
        <h2
          className={`text-xl font-bold mb-1 ${
            isCorrect ? "text-emerald-300" : "text-red-300"
          }`}
        >
          {isCorrect ? "Resposta Correta!" : "Resposta Incorreta"}
        </h2>

        {xpGained > 0 && (
          <div className="inline-flex items-center gap-1.5 bg-amber-900/60 text-amber-300 border border-amber-700 rounded-full px-3 py-1 text-sm font-bold mt-1">
            ⚡ +{xpGained} XP
          </div>
        )}

        {emblemGained && (
          <div className="mt-2 inline-flex items-center gap-1.5 bg-violet-900/60 text-violet-300 border border-violet-600 rounded-full px-3 py-1 text-sm font-bold">
            🏆 Emblema conquistado!
          </div>
        )}
      </div>

      {/* Correct Answer (when wrong) */}
      {!isCorrect && (
        <Card className="p-4">
          <p className="text-slate-400 text-xs mb-2 uppercase tracking-wider font-semibold">
            Resposta Correta
          </p>
          <p className="text-emerald-300 font-semibold text-sm">
            {question.alternatives.find(
              (a) => a.id === question.correctAlternativeId
            )?.text}
          </p>
        </Card>
      )}

      {/* Explanation */}
      <Card className="p-4">
        <p className="text-slate-400 text-xs mb-2 uppercase tracking-wider font-semibold">
          📚 Explicação
        </p>
        <p className="text-slate-200 text-sm leading-relaxed">
          {question.explanation}
        </p>
      </Card>

      {/* Trap (if exists and wrong) */}
      {!isCorrect && question.trap && (
        <Card className="p-4 border-amber-800/40 bg-amber-900/20">
          <p className="text-amber-400 text-xs mb-2 uppercase tracking-wider font-semibold">
            ⚠️ Pegadinha
          </p>
          <p className="text-amber-200 text-sm leading-relaxed">{question.trap}</p>
        </Card>
      )}

      {/* Saved for review notice */}
      {!isCorrect && savedForReview && (
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 rounded-xl p-3 border border-slate-700">
          <span>🔖</span>
          <span>
            Pergunta salva para{" "}
            <strong className="text-slate-300">Revisão dos Erros</strong>
          </span>
        </div>
      )}

      <Button
        onClick={onContinue}
        fullWidth
        size="lg"
        variant={isCorrect ? "success" : "secondary"}
      >
        {isCorrect ? "Continuar →" : "Próxima Rodada →"}
      </Button>
    </div>
  );
}
