import { PlayerProgress } from "../types/game";
import { AppShell } from "../components/layout/AppShell";
import { Header } from "../components/layout/Header";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { EmblemGrid } from "../components/game/EmblemGrid";
import { ProgressBar } from "../components/game/ProgressBar";
import { ALL_CATEGORIES } from "../data/categories";
import { getAccuracyRate, getStrongestCategory, getWeakestCategory } from "../lib/stats";
import { DEFAULT_PROGRESS } from "../lib/storage";
import { xpProgressInLevel, xpToNextLevel } from "../lib/xp";

interface ProfilePageProps {
  progress: PlayerProgress;
  onProgressUpdate: (p: PlayerProgress) => void;
  onBack: () => void;
}

export function ProfilePage({ progress, onProgressUpdate, onBack }: ProfilePageProps) {
  const accuracy = getAccuracyRate(progress);
  const strongest = getStrongestCategory(progress) ?? "Ainda sem dados";
  const weakest = getWeakestCategory(progress) ?? "Ainda sem dados";
  const xpInLevel = xpProgressInLevel(progress.xp);
  const nextLevel = xpToNextLevel(progress.xp);

  function reset() {
    const confirmed = window.confirm("Tem certeza que deseja zerar seu progresso local?");
    if (confirmed) onProgressUpdate({ ...DEFAULT_PROGRESS });
  }

  return (
    <AppShell header={<Header progress={progress} title="Perfil" onBack={onBack} />}>
      <Card className="mb-4 p-6 text-center" glow>
        <div className="mb-3 text-6xl">🧑‍🎓</div>
        <h2 className="text-2xl font-black text-white">Estudante</h2>
        <p className="mb-4 text-sm text-slate-400">Nível {progress.level} · {progress.xp} XP total</p>
        <ProgressBar value={xpInLevel} max={100} colorClass="bg-violet-500" label={`${nextLevel} XP para o próximo nível`} />
      </Card>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <Card className="p-4 text-center">
          <div className="text-2xl font-black text-emerald-400">{progress.totalCorrect}</div>
          <div className="text-xs text-slate-500">Acertos</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-black text-red-400">{progress.totalWrong}</div>
          <div className="text-xs text-slate-500">Erros</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-black text-violet-400">{accuracy}%</div>
          <div className="text-xs text-slate-500">Precisão</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-black text-amber-400">{progress.totalWins}/{progress.totalGamesPlayed}</div>
          <div className="text-xs text-slate-500">Vitórias/Jogos</div>
        </Card>
      </div>

      <Card className="mb-4 p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Diagnóstico</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between gap-4 rounded-lg bg-slate-800/60 p-3">
            <span className="text-slate-400">Matéria mais forte</span>
            <strong className="text-emerald-300">{strongest}</strong>
          </div>
          <div className="flex justify-between gap-4 rounded-lg bg-slate-800/60 p-3">
            <span className="text-slate-400">Matéria para revisar</span>
            <strong className="text-amber-300">{weakest}</strong>
          </div>
        </div>
      </Card>

      <Card className="mb-4 p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Emblemas conquistados</p>
        <EmblemGrid categories={ALL_CATEGORIES} earnedIds={progress.completedEmblems} progress={progress.categoryProgress} threshold={3} />
      </Card>

      <Button onClick={reset} fullWidth variant="danger">
        Zerar progresso local
      </Button>
    </AppShell>
  );
}
