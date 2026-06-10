import { PlayerProgress } from "../../types/game";
import { xpProgressInLevel } from "../../lib/xp";
import { ProgressBar } from "./ProgressBar";

interface PlayerStatsProps {
  progress: PlayerProgress;
  compact?: boolean;
}

export function PlayerStats({ progress, compact = false }: PlayerStatsProps) {
  const xpInLevel = xpProgressInLevel(progress.xp);

  if (compact) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="text-slate-300 font-semibold">Nível {progress.level}</span>
        <span className="text-amber-400 font-bold">⚡ {progress.xp} XP</span>
        {progress.streak > 1 && (
          <span className="text-orange-400 font-bold">
            🔥 {progress.streak}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <ProgressBar
        value={xpInLevel}
        max={100}
        colorClass="bg-violet-500"
        height="sm"
      />
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <div className="text-slate-400 text-xs">⚡ XP Total</div>
          <div className="font-bold text-amber-400">{progress.xp}</div>
        </div>
        <div>
          <div className="text-slate-400 text-xs">🏅 Nível</div>
          <div className="font-bold text-violet-400">{progress.level}</div>
        </div>
        <div>
          <div className="text-slate-400 text-xs">🔥 Sequência</div>
          <div className="font-bold text-orange-400">{progress.streak}</div>
        </div>
        <div>
          <div className="text-slate-400 text-xs">✅ Acertos</div>
          <div className="font-bold text-emerald-400">{progress.totalCorrect}</div>
        </div>
      </div>
    </div>
  );
}
