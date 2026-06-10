import { useEffect, useState } from "react";
import { HomePage } from "./pages/HomePage";
import { WorldSelectPage } from "./pages/WorldSelectPage";
import { ModeSelectPage } from "./pages/ModeSelectPage";
import { ClassicGamePage } from "./pages/ClassicGamePage";
import { SoloTrainingPage } from "./pages/SoloTrainingPage";
import { ReviewErrorsPage } from "./pages/ReviewErrorsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { QuickDuelPage } from "./pages/QuickDuelPage";
import { GameMode, ClassicMatchState, PlayerProgress, World } from "./types/game";
import { loadProgress, saveProgress } from "./lib/storage";

export type AppScreen =
  | "home"
  | "world"
  | "mode"
  | "classic"
  | "solo"
  | "review"
  | "profile"
  | "duel";

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("home");
  const [progress, setProgress] = useState<PlayerProgress>(() => loadProgress());
  const [selectedWorld, setSelectedWorld] = useState<World>("school");
  const [preferredMode, setPreferredMode] = useState<GameMode | null>(null);
  const [lastMatchSummary, setLastMatchSummary] = useState<string | null>(null);
  // Track whether review was opened directly from home (so Back returns home, not mode)
  const [reviewFromHome, setReviewFromHome] = useState(false);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  function updateProgress(next: PlayerProgress) {
    setProgress(next);
    saveProgress(next);
  }

  function goHome() {
    setPreferredMode(null);
    setLastMatchSummary(null);
    setScreen("home");
  }

  function openWorldSelect(mode?: GameMode) {
    setPreferredMode(mode ?? null);
    setScreen("world");
  }

  function handleWorldSelected(world: World) {
    setSelectedWorld(world);
    if (preferredMode === "classic") setScreen("classic");
    else if (preferredMode === "solo") setScreen("solo");
    else if (preferredMode === "duel") setScreen("duel");
    else if (preferredMode === "review") setScreen("review");
    else setScreen("mode");
  }

  function handleModeSelected(mode: GameMode) {
    if (mode === "classic") setScreen("classic");
    if (mode === "solo") setScreen("solo");
    if (mode === "duel") setScreen("duel");
    if (mode === "review") { setReviewFromHome(false); setScreen("review"); }
  }

  function handleClassicEnd(match: ClassicMatchState, totalXP: number) {
    const winner =
      match.winner === "player"
        ? "Vitória"
        : match.winner === "draw"
        ? "Empate"
        : "Derrota";
    setLastMatchSummary(`${winner} na partida clássica · +${totalXP} XP`);
    // Progress was already saved by onProgressUpdate during the match; reload from storage to sync.
    setProgress(loadProgress());
    setScreen("home");
  }

  if (screen === "world") {
    return (
      <WorldSelectPage
        progress={progress}
        onSelectWorld={handleWorldSelected}
        onBack={goHome}
      />
    );
  }

  if (screen === "mode") {
    return (
      <ModeSelectPage
        progress={progress}
        world={selectedWorld}
        onSelectMode={handleModeSelected}
        onBack={() => setScreen("world")}
      />
    );
  }

  if (screen === "classic") {
    return (
      <ClassicGamePage
        world={selectedWorld}
        progress={progress}
        onProgressUpdate={updateProgress}
        onGameEnd={handleClassicEnd}
        onBack={() => setScreen("mode")}
      />
    );
  }

  if (screen === "solo") {
    return (
      <SoloTrainingPage
        world={selectedWorld}
        progress={progress}
        onProgressUpdate={updateProgress}
        onBack={() => setScreen("mode")}
      />
    );
  }

  if (screen === "review") {
    return (
      <ReviewErrorsPage
        progress={progress}
        onProgressUpdate={updateProgress}
        onBack={() => reviewFromHome ? goHome() : setScreen("mode")}
      />
    );
  }

  if (screen === "profile") {
    return (
      <ProfilePage
        progress={progress}
        onProgressUpdate={updateProgress}
        onBack={goHome}
      />
    );
  }

  if (screen === "duel") {
    return (
      <QuickDuelPage
        world={selectedWorld}
        progress={progress}
        onProgressUpdate={updateProgress}
        onBack={() => setScreen("mode")}
      />
    );
  }

  return (
    <div>
      {lastMatchSummary && (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-full border border-violet-500/50 bg-slate-900/95 px-4 py-2 text-sm font-bold text-violet-200 shadow-xl shadow-violet-950/40">
          {lastMatchSummary}
        </div>
      )}
      <HomePage
        progress={progress}
        onPlay={() => openWorldSelect()}
        onSolo={() => openWorldSelect("solo")}
        onReview={() => { setReviewFromHome(true); setScreen("review"); }}
        onProfile={() => setScreen("profile")}
        onDuel={() => openWorldSelect("duel")}
      />
    </div>
  );
}
