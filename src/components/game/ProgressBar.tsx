interface ProgressBarProps {
  value: number;
  max: number;
  colorClass?: string;
  height?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
  className?: string;
  animated?: boolean;
}

export function ProgressBar({
  value,
  max,
  colorClass = "bg-violet-500",
  height = "md",
  showLabel = false,
  label,
  className = "",
  animated = true,
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  const heights = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          {label && <span>{label}</span>}
          {showLabel && (
            <span>
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-700/60 rounded-full overflow-hidden ${heights[height]}`}>
        <div
          className={`${heights[height]} ${colorClass} rounded-full ${animated ? "transition-all duration-500" : ""}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
