import { Category } from "../../types/game";

interface EmblemGridProps {
  categories: Category[];
  earnedIds: string[];
  progress?: Record<string, number>;
  size?: "sm" | "md" | "lg";
  threshold?: number;
}

export function EmblemGrid({
  categories,
  earnedIds,
  progress = {},
  size = "md",
  threshold = 3,
}: EmblemGridProps) {
  const sizes = {
    sm: { outer: "w-10 h-10", icon: "text-lg", label: "hidden" },
    md: { outer: "w-14 h-14", icon: "text-2xl", label: "text-xs mt-1 max-w-[56px]" },
    lg: { outer: "w-16 h-16", icon: "text-3xl", label: "text-xs mt-1 max-w-[64px]" },
  };

  const s = sizes[size];

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {categories.map((cat) => {
        const earned = earnedIds.includes(cat.id);
        const prog = progress[cat.id] ?? 0;
        const pct = threshold > 0 ? Math.min(100, (prog / threshold) * 100) : 0;

        return (
          <div key={cat.id} className="flex flex-col items-center">
            <div className="relative">
              {/* Progress ring */}
              <svg
                className="absolute inset-0"
                viewBox="0 0 56 56"
                width="100%"
                height="100%"
              >
                <circle
                  cx="28"
                  cy="28"
                  r="25"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="3"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="25"
                  fill="none"
                  stroke={earned ? cat.colorToken : "rgba(255,255,255,0.25)"}
                  strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * 25}`}
                  strokeDashoffset={`${2 * Math.PI * 25 * (1 - pct / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 28 28)"
                  style={{ transition: "stroke-dashoffset 0.5s" }}
                />
              </svg>

              <div
                className={`${s.outer} rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  earned
                    ? `${cat.bgClass} border-transparent shadow-lg`
                    : "bg-slate-800 border-slate-600"
                }`}
                title={earned ? cat.emblemName : `${cat.name}: ${prog}/${threshold}`}
              >
                <span
                  className={`${s.icon} ${earned ? "" : "grayscale opacity-40"} transition-all duration-300`}
                >
                  {cat.icon}
                </span>
              </div>

              {earned && (
                <span className="absolute -top-1 -right-1 text-xs bg-amber-400 text-slate-900 rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  ✓
                </span>
              )}
            </div>

            {s.label !== "hidden" && (
              <span
                className={`${s.label} text-center leading-tight truncate ${
                  earned ? "text-slate-200 font-semibold" : "text-slate-500"
                }`}
              >
                {cat.shortName}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
