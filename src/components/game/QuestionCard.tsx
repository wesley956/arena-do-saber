import { useState, useEffect } from "react";
import { Question } from "../../types/game";
import { getCategoryById } from "../../data/categories";
import { AnswerOption } from "./AnswerOption";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

interface QuestionCardProps {
  question: Question;
  onAnswer: (selectedId: string, isCorrect: boolean) => void;
  showTimer?: boolean;
  timerSeconds?: number;
}

export function QuestionCard({
  question,
  onAnswer,
  showTimer = false,
  timerSeconds = 30,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timerSeconds);

  const category = getCategoryById(question.categoryId);

  // Reset when question changes
  useEffect(() => {
    setSelected(null);
    setConfirmed(false);
    setTimeLeft(timerSeconds);
  }, [question.id, timerSeconds]);

  // Timer
  useEffect(() => {
    if (!showTimer || confirmed) return;
    if (timeLeft <= 0) {
      handleConfirm();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, showTimer, confirmed]);

  function handleConfirm() {
    if (confirmed) return;
    const answerId = selected ?? "";
    const isCorrect = answerId === question.correctAlternativeId;
    setConfirmed(true);
    setTimeout(() => {
      onAnswer(answerId, isCorrect);
    }, 900);
  }

  const difficultyVariant: Record<string, "success" | "warning" | "danger"> = {
    easy: "success",
    medium: "warning",
    hard: "danger",
  };

  const difficultyLabel = {
    easy: "Fácil",
    medium: "Médio",
    hard: "Difícil",
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {category && (
            <span className="text-lg">{category.icon}</span>
          )}
          <div>
            <div className="text-xs text-slate-400 font-semibold">
              {question.subject}
            </div>
            <div className="text-xs text-slate-500">{question.topic}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={difficultyVariant[question.difficulty]}>
            {difficultyLabel[question.difficulty]}
          </Badge>
          {showTimer && (
            <div
              className={`text-sm font-bold px-2.5 py-1 rounded-lg ${
                timeLeft <= 10
                  ? "bg-red-900/60 text-red-300 border border-red-700"
                  : "bg-slate-700 text-slate-200"
              }`}
            >
              ⏱ {timeLeft}s
            </div>
          )}
        </div>
      </div>

      {/* Statement */}
      <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
        <p className="text-slate-100 text-base leading-relaxed font-medium">
          {question.statement}
        </p>
      </div>

      {/* Alternatives */}
      <div className="flex flex-col gap-2">
        {question.alternatives.map((alt, idx) => {
          const isSelected = selected === alt.id;
          const showResult = confirmed;
          const isCorrect = showResult && alt.id === question.correctAlternativeId;
          const isWrong =
            showResult && alt.id !== question.correctAlternativeId;

          return (
            <AnswerOption
              key={alt.id}
              alternative={alt}
              index={idx}
              selected={isSelected}
              correct={isCorrect}
              wrong={isWrong && (isSelected || (showResult && !selected))}
              disabled={confirmed}
              onClick={() => {
                if (!confirmed) setSelected(alt.id);
              }}
            />
          );
        })}
      </div>

      {/* Confirm button */}
      {!confirmed && (
        <Button
          onClick={handleConfirm}
          disabled={!selected}
          fullWidth
          size="lg"
          variant="primary"
        >
          Confirmar Resposta
        </Button>
      )}
    </div>
  );
}
