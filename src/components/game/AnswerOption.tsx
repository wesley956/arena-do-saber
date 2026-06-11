import { Alternative } from "../../types/game";

interface AnswerOptionProps {
  alternative: Alternative;
  selected: boolean;
  correct?: boolean;
  wrong?: boolean;
  disabled: boolean;
  onClick: () => void;
  index: number;
}

const LABELS = ["A", "B", "C", "D"];

export function AnswerOption({
  alternative,
  selected,
  correct,
  wrong,
  disabled,
  onClick,
  index,
}: AnswerOptionProps) {
  let stateClass =
    "bg-slate-800/80 border-slate-600 hover:border-violet-500 hover:bg-slate-700/80 text-slate-200";

  if (selected && !correct && !wrong) {
    stateClass = "bg-violet-900/60 border-violet-400 text-white";
  } else if (correct) {
    stateClass =
      "bg-emerald-900/70 border-emerald-400 text-emerald-100 shadow-lg shadow-emerald-900/30";
  } else if (wrong && selected) {
    stateClass =
      "bg-red-900/70 border-red-400 text-red-100 shadow-lg shadow-red-900/30";
  } else if (wrong && !selected) {
    stateClass = "bg-slate-800/40 border-slate-700 text-slate-400 opacity-60";
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150 ${stateClass} ${
        disabled ? "cursor-default" : "cursor-pointer active:scale-[0.98]"
      }`}
    >
      {/* Label */}
      <span className="w-7 h-7 rounded-lg bg-slate-700/60 border border-slate-600 flex items-center justify-center text-xs font-black flex-shrink-0">
        {LABELS[index]}
      </span>

      {/* Text */}
      <span className="text-sm leading-relaxed flex-1">{alternative.text}</span>

      {/* Indicator */}
      {correct && (
        <span className="text-emerald-400 font-bold flex-shrink-0">✓</span>
      )}
      {wrong && selected && (
        <span className="text-red-400 font-bold flex-shrink-0">✗</span>
      )}
    </button>
  );
}
