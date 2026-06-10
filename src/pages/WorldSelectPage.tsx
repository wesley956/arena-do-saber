import { PlayerProgress, World } from "../types/game";
import { AppShell } from "../components/layout/AppShell";
import { Header } from "../components/layout/Header";
import { WorldCard } from "../components/game/WorldCard";

interface WorldSelectPageProps {
  progress: PlayerProgress;
  onSelectWorld: (world: World) => void;
  onBack: () => void;
}

export function WorldSelectPage({
  progress,
  onSelectWorld,
  onBack,
}: WorldSelectPageProps) {
  return (
    <AppShell
      header={
        <Header progress={progress} title="Escolher Mundo" onBack={onBack} />
      }
    >
      <div className="text-center mb-6">
        <h2 className="text-xl font-black text-white mb-1">
          Qual mundo você quer explorar?
        </h2>
        <p className="text-slate-400 text-sm">
          Cada mundo tem suas próprias matérias, perguntas e emblemas.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <WorldCard world="school" onClick={() => onSelectWorld("school")} />
        <WorldCard world="contest" onClick={() => onSelectWorld("contest")} />
      </div>
    </AppShell>
  );
}
