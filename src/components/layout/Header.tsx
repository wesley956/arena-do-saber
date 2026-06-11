import { PlayerProgress, World } from "../../types/game";

interface HeaderProps {
  progress: PlayerProgress;
  title?: string;
  subtitle?: string;
  world?: World;
  onBack?: () => void;
}

const WORLD_LABELS: Record<World, { label: string; color: string }> = {
  school: { label: "🏫 Escola", color: "text-blue-400" },
  contest: { label: "🎯 Concurso", color: "text-amber-400" },
};

export function Header({
  progress,
  title,
  subtitle,
  world,
  onBack,
}: HeaderProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 w-full max-w-lg mx-auto">
      {onBack && (
        <button
          onClick={onBack}
          className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all flex-shrink-0"
          aria-label="Voltar"
        >
          ←
        </button>
      )}

      <div className="flex-1 min-w-0">
        {title ? (
          <>
            <div className="flex items-center gap-2">
              {world && (
                <span className={`text-xs font-bold ${WORLD_LABELS[world].color}`}>
                  {WORLD_LABELS[world].label}
                </span>
              )}
            </div>
            <h1 className="text-sm font-black text-white truncate">{title}</h1>
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

      {/* Player quick stats */}
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
          <div className="text-xs text-slate-400">
            Lv.{progress.level}
          </div>
        </div>
      </div>
    </div>
  );
}
