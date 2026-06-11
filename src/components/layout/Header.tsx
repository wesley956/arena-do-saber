import { PlayerProgress, World } from "../../types/game";

interface HeaderProps {
  progress: PlayerProgress;
  title?: string;
  subtitle?: string;
  world?: World;
  onBack?: () => void;
}

const WORLD_LABELS: Record<
  World,
  {
    label: string;
    pillClass: string;
    stripClass: string;
    headerTint: string;
  }
> = {
  school: {
    label: "🏫 Mundo Escola",
    pillClass: "border-blue-400/50 bg-blue-500/15 text-blue-200",
    stripClass: "from-blue-500 via-cyan-400 to-blue-500",
    headerTint: "bg-blue-950/10",
  },
  contest: {
    label: "🎯 Mundo Concurso",
    pillClass: "border-amber-400/50 bg-amber-500/15 text-amber-200",
    stripClass: "from-amber-500 via-yellow-300 to-amber-500",
    headerTint: "bg-amber-950/10",
  },
};

export function Header({
  progress,
  title,
  subtitle,
  world,
  onBack,
}: HeaderProps) {
  const worldStyle = world ? WORLD_LABELS[world] : null;

  return (
    <div className={`w-full ${worldStyle ? worldStyle.headerTint : ""}`}>
      {worldStyle && (
        <div
          className={`h-1 w-full bg-gradient-to-r ${worldStyle.stripClass}`}
          aria-hidden="true"
        />
      )}

      <div className="flex items-center gap-3 px-4 py-3 w-full max-w-lg mx-auto">
        {onBack && (
          <button
            onClick={onBack}
            className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-violet-400/70 focus:ring-offset-2 focus:ring-offset-slate-950"
            aria-label="Voltar"
          >
            ←
          </button>
        )}

        <div className="flex-1 min-w-0">
          {title ? (
            <>
              {worldStyle && (
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className={`inline-flex max-w-full items-center rounded-full border px-2.5 py-1 text-xs font-black leading-none ${worldStyle.pillClass}`}
                  >
                    {worldStyle.label}
                  </span>
                </div>
              )}

              <h1 className="text-sm font-black text-white truncate">
                {title}
              </h1>

              {subtitle && (
                <p className="text-xs text-slate-400 truncate">{subtitle}</p>
              )}
            </>
          ) : (
            <span className="font-black text-base bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Arena do Saber
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {progress.streak > 1 && (
            <span className="text-xs text-orange-400 font-bold">
              🔥{progress.streak}
            </span>
          )}

          <div className="text-right">
            <div className="text-xs text-amber-400 font-bold">
              ⚡{progress.xp}
            </div>
            <div className="text-xs text-slate-400">Lv.{progress.level}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
