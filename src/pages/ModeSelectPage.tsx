import { GameMode, PlayerProgress, World } from "../types/game";
import { AppShell } from "../components/layout/AppShell";
import { Header } from "../components/layout/Header";
import { ModeCard } from "../components/game/ModeCard";

interface ModeSelectPageProps {
  progress: PlayerProgress;
  world: World;
  onSelectMode: (mode: GameMode) => void;
  onBack: () => void;
}

export function ModeSelectPage({
  progress,
  world,
  onSelectMode,
  onBack,
}: ModeSelectPageProps) {
  return (
    <AppShell
      header={
        <Header
          progress={progress}
          title="Escolher Modo"
          world={world}
          onBack={onBack}
        />
      }
    >
      <div className="text-center mb-6">
        <h2 className="text-xl font-black text-white mb-1">
          Como você quer jogar?
        </h2>
        <p className="text-slate-400 text-sm">
          Escolha o modo que melhor se encaixa no seu objetivo agora.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <ModeCard mode="classic" onClick={() => onSelectMode("classic")} />
        <ModeCard mode="solo" onClick={() => onSelectMode("solo")} />
        <ModeCard mode="duel" onClick={() => onSelectMode("duel")} />
        <ModeCard
          mode="review"
          onClick={() => onSelectMode("review")}
          disabled={progress.wrongQuestionIds.length === 0}
        />
      </div>

      {progress.wrongQuestionIds.length === 0 && (
        <p className="text-xs text-slate-400 text-center mt-3">
          🔖 A revisão de erros ficará disponível após você errar algumas perguntas.
        </p>
      )}
    </AppShell>
  );
}
