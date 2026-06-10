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

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Wheel grid */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {categories.map((cat, idx) => {
          const isHighlighted = highlightedIndex === idx;
          const isFinal = finalIndex === idx;

          return (
            <div
              key={cat.id}
              className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-100 ${
                isFinal
                  ? `${cat.bgClass} border-white/40 shadow-lg scale-105`
                  : isHighlighted
                  ? "bg-slate-700 border-violet-400 scale-[1.02]"
                  : "bg-slate-800/60 border-slate-700"
              }`}
            >
              <span className="text-2xl mb-1">{cat.icon}</span>
              <span
                className={`text-xs font-bold text-center leading-tight ${
                  isFinal ? "text-white" : "text-slate-300"
                }`}
              >
                {cat.shortName}
              </span>

              {isFinal && (
                <span className="absolute -top-1.5 -right-1.5 text-xs bg-amber-400 text-slate-900 rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  ★
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Result label */}
      {finalIndex >= 0 && !spinning && (
        <div className="text-center">
          <p className="text-xs text-slate-400 mb-1">Categoria sorteada</p>
          <p className="font-bold text-white">
            {categories[finalIndex]?.icon} {categories[finalIndex]?.name}
          </p>
        </div>
      )}

      <Button
        onClick={handleSpin}
        disabled={spinning || disabled}
        fullWidth
        size="lg"
        variant="primary"
        className={spinning ? "animate-pulse" : ""}
      >
        {spinning ? "⟳ Girando..." : "🎲 Girar Roleta"}
      </Button>
    </div>
  );
}
