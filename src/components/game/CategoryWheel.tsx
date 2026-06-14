import { useState, useEffect, useRef } from "react";
import { Category } from "../../types/game";
import { Button } from "../ui/Button";

interface CategoryWheelProps {
  categories: Category[];
  onSpin: (categoryId: string) => void;
  disabled?: boolean;
  selectedId?: string;
}

export function CategoryWheel({
  categories,
  onSpin,
  disabled = false,
  selectedId,
}: CategoryWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [finalIndex, setFinalIndex] = useState(-1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync finalIndex when selectedId changes externally
  useEffect(() => {
    if (selectedId) {
      const idx = categories.findIndex((c) => c.id === selectedId);
      setFinalIndex(idx);
      setHighlightedIndex(idx);
    }
  }, [selectedId, categories]);

  function handleSpin() {
    if (spinning || disabled || categories.length === 0) return;

    setSpinning(true);
    setFinalIndex(-1);

    const targetIdx = Math.floor(Math.random() * categories.length);
    let ticks = 0;
    const totalTicks = 18 + Math.floor(Math.random() * 8);
    let delay = 80;

    function tick() {
      ticks++;
      setHighlightedIndex((prev) => (prev + 1) % categories.length);

      if (ticks >= totalTicks) {
        // Land exactly on target
        if (intervalRef.current) clearInterval(intervalRef.current);
        setHighlightedIndex(targetIdx);
        setFinalIndex(targetIdx);
        setSpinning(false);

        timeoutRef.current = setTimeout(() => {
          onSpin(categories[targetIdx].id);
        }, 400);
        return;
      }

      // Ease out: slow down near end
      if (ticks > totalTicks * 0.6) {
        delay = Math.min(350, delay * 1.15);
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(tick, delay);
      }
    }

    intervalRef.current = setInterval(tick, delay);
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const finalCategory = finalIndex >= 0 ? categories[finalIndex] : null;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full rounded-3xl border border-violet-500/30 bg-violet-950/20 p-3 text-center shadow-lg shadow-violet-950/20">
        <p className="text-xs font-black uppercase tracking-wide text-violet-300">
          Roleta da Arena
        </p>
        <p className="mt-1 text-sm text-slate-300">
          {spinning
            ? "A categoria está sendo escolhida..."
            : finalCategory
              ? "Categoria definida. Prepare sua resposta!"
              : "Gire para descobrir qual matéria entra na disputa."}
        </p>
      </div>

      {/* Wheel grid */}
      <div className="grid w-full grid-cols-3 gap-2">
        {categories.map((cat, idx) => {
          const isHighlighted = highlightedIndex === idx;
          const isFinal = finalIndex === idx;

          return (
            <div
              key={cat.id}
              className={`relative flex min-h-[82px] flex-col items-center justify-center rounded-2xl border-2 p-3 transition-all duration-150 ${
                isFinal
                  ? `${cat.bgClass} scale-105 border-white/60 shadow-xl shadow-violet-950/40 ring-2 ring-amber-300/40`
                  : isHighlighted
                    ? "scale-[1.03] border-violet-300 bg-violet-900/60 shadow-lg shadow-violet-950/30"
                    : "border-slate-700 bg-slate-800/60"
              }`}
            >
              <span className={isHighlighted || isFinal ? "mb-1 text-3xl" : "mb-1 text-2xl"}>
                {cat.icon}
              </span>
              <span
                className={`text-center text-xs font-black leading-tight ${
                  isFinal ? "text-white" : "text-slate-300"
                }`}
              >
                {cat.shortName}
              </span>

              {isFinal && (
                <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-amber-300 text-xs font-black text-slate-950 shadow-lg shadow-amber-950/40">
                  ★
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Result label */}
      {finalCategory && !spinning && (
        <div className="w-full rounded-3xl border border-amber-400/40 bg-amber-950/25 p-4 text-center shadow-lg shadow-amber-950/20">
          <p className="text-xs font-black uppercase tracking-wide text-amber-300">
            Categoria sorteada
          </p>
          <p className="mt-1 text-xl font-black text-white">
            {finalCategory.icon} {finalCategory.name}
          </p>
          <p className="mt-1 text-xs text-slate-300">
            Valendo progresso de insígnia. Boa sorte!
          </p>
        </div>
      )}

      <Button
        onClick={handleSpin}
        disabled={spinning || disabled}
        fullWidth
        size="lg"
        variant="primary"
        className={spinning ? "motion-safe:animate-pulse shadow-lg shadow-violet-950/40" : "shadow-lg shadow-violet-950/40"}
      >
        {spinning ? "⟳ Roleta girando..." : finalCategory ? "🎲 Girar novamente" : "🎲 Girar Roleta"}
      </Button>
    </div>
  );
}
