import { PlayerProgress } from "../types/game";
import { AppShell } from "../components/layout/AppShell";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ProgressBar } from "../components/game/ProgressBar";
import { xpProgressInLevel, xpToNextLevel } from "../lib/xp";
import { getAccuracyRate } from "../lib/stats";

interface HomePageProps {
  progress: PlayerProgress;
  onPlay: () => void;
  onSolo: () => void;
  onReview: () => void;
  onProfile: () => void;
  onDuel: () => void;
  onStudyMap: () => void;
}

export function HomePage({
  progress,
  onPlay,
  onSolo,
  onReview,
  onProfile,
  onDuel,
  onStudyMap,
}: HomePageProps) {
  const xpInLevel = xpProgressInLevel(progress.xp);
  const toNext = xpToNextLevel(progress.xp);
  const accuracy = getAccuracyRate(progress);
  const hasErrors = progress.wrongQuestionIds.length > 0;

  return (
    <AppShell>
      {/* Hero Section */}
      <div className="text-center py-6 mb-2">
        <div className="text-5xl mb-3 animate-pulse">⚔️</div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-violet-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent mb-2">
          Arena do Saber
        </h1>
        <p className="text-slate-400 text-sm max-w-xs mx-auto">
          Estude, compita e conquiste emblemas no maior quiz educacional!
        </p>
      </div>

      {/* Player Card */}
      <Card className="p-4 mb-4" glow>
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onProfile}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-2xl flex-shrink-0 border border-violet-500/50 hover:opacity-80 transition-opacity"
          >
            🧑‍🎓
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Estudante</span>
              <span className="text-xs bg-violet-900/60 text-violet-300 border border-violet-700 px-1.5 py-0.5 rounded-full font-bold">
                Lv. {progress.level}
              </span>
              {progress.streak > 1 && (
                <span className="text-xs text-orange-400 font-bold">
                  🔥 {progress.streak}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
              <span className="text-amber-400 font-bold">⚡ {progress.xp} XP</span>
              <span>·</span>
              <span>{toNext} XP para Lv. {progress.level + 1}</span>
            </div>
          </div>
          <button
            onClick={onProfile}
            className="text-slate-400 hover:text-white transition-colors text-sm"
          >
            Ver perfil →
          </button>
        </div>
        <ProgressBar
          value={xpInLevel}
          max={100}
          colorClass="bg-violet-500"
          height="sm"
        />

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-700/50">
          <div className="text-center">
            <div className="text-emerald-400 font-bold text-base">{progress.totalCorrect}</div>
            <div className="text-slate-500 text-xs">Acertos</div>
          </div>
          <div className="text-center border-x border-slate-700/50">
            <div className="text-violet-400 font-bold text-base">{accuracy}%</div>
            <div className="text-slate-500 text-xs">Precisão</div>
          </div>
          <div className="text-center">
            <div className="text-amber-400 font-bold text-base">{progress.completedEmblems.length}</div>
            <div className="text-slate-500 text-xs">Emblemas</div>
          </div>
        </div>
      </Card>

      {/* Main CTA */}
      <Button
        onClick={onPlay}
        fullWidth
        size="xl"
        variant="primary"
        className="mb-3"
      >
        🎲 Jogar Agora
      </Button>

      {/* Secondary actions */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Button onClick={onSolo} fullWidth size="lg" variant="secondary">
          📖 Treino Solo
        </Button>
        <Button onClick={onDuel} fullWidth size="lg" variant="secondary">
          ⚡ Duelo Rápido
        </Button>
      </div>

      {/* Mapa de Estudos — destaque visual */}
      <Button
        onClick={onStudyMap}
        fullWidth
        size="lg"
        variant="ghost"
        className="mb-3 border-indigo-700/60 text-indigo-300 hover:bg-indigo-900/20 hover:border-indigo-500"
      >
        🗺️ Mapa de Estudos
      </Button>

      {/* Review */}
      {hasErrors ? (
        <Button
          onClick={onReview}
          fullWidth
          size="md"
          variant="ghost"
          className="mb-4 border-red-800/50 text-red-400 hover:bg-red-900/20"
        >
          🔖 Revisar Erros ({progress.wrongQuestionIds.length})
        </Button>
      ) : (
        <Button onClick={onReview} fullWidth size="md" variant="ghost" className="mb-4">
          🔖 Revisão dos Erros
        </Button>
      )}

      {/* Emblems summary */}
      {progress.completedEmblems.length > 0 && (
        <Card className="p-4">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">
            🏆 Seus Emblemas
          </p>
          <div className="flex flex-wrap gap-2">
            {progress.completedEmblems.map((id) => (
              <span
                key={id}
                className="text-xs bg-amber-900/40 text-amber-300 border border-amber-800 rounded-full px-2.5 py-1 font-semibold"
              >
                🏅 {id.split("-").slice(1).join(" ")}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Footer note */}
      <p className="text-center text-slate-600 text-xs mt-6">
        Arena do Saber MVP v1.0 · Escola + Concurso
      </p>
    </AppShell>
  );
}
