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
    "bg-slate-800/80 border-slate-600 hover:border-violet-500 hover:bg-slate-700/80 text-slate-100";

  let labelClass =
    "bg-slate-700/70 border-slate-500 text-slate-100";

  let indicator = null;

  if (selected && !correct && !wrong) {
    stateClass =
      "bg-violet-900/80 border-violet-300 text-white shadow-xl shadow-violet-950/40 ring-2 ring-violet-300/25";
    labelClass =
      "bg-violet-400 border-violet-200 text-violet-950 shadow-sm shadow-violet-950/30";
    indicator = (
      <span className="rounded-full bg-violet-400/20 px-2.5 py-1 text-xs font-black text-violet-100 border border-violet-300/40">
        Selecionada
      </span>
    );
  } else if (correct) {
    stateClass =
      "bg-emerald-900/75 border-emerald-400 text-emerald-50 shadow-lg shadow-emerald-900/30";
    labelClass =
      "bg-emerald-400 border-emerald-200 text-emerald-950 shadow-sm shadow-emerald-950/30";
    indicator = (
      <span className="text-emerald-300 text-xl font-black flex-shrink-0 animate-bounce">
        ✓
      </span>
    );
  } else if (wrong && selected) {
    stateClass =
      "bg-red-900/75 border-red-400 text-red-50 shadow-lg shadow-red-900/30";
    labelClass =
      "bg-red-500 border-red-300 text-white shadow-sm shadow-red-950/30";
    indicator = (
      <span className="text-red-300 text-xl font-black flex-shrink-0 animate-pulse">
        ✗
      </span>
    );
  } else if (wrong && !selected) {
    stateClass = "bg-slate-800/40 border-slate-700 text-slate-400 opacity-65";
    labelClass = "bg-slate-800 border-slate-700 text-slate-400";
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-violet-400/70 focus:ring-offset-2 focus:ring-offset-slate-950 ${stateClass} ${
        disabled ? "cursor-default" : "cursor-pointer active:scale-[0.98]"
      }`}
    >
      <span
        className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm font-black flex-shrink-0 transition-all duration-150 ${labelClass}`}
      >
        {LABELS[index]}
      </span>

      <span className="text-base leading-relaxed flex-1 break-words">
        {alternative.text}
      </span>

      {indicator}
    </button>
  );
}
