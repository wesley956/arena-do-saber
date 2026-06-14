import { useEffect, useState } from "react";
import { HomePage } from "./pages/HomePage";
import { WorldSelectPage } from "./pages/WorldSelectPage";
import { ModeSelectPage } from "./pages/ModeSelectPage";
import { ClassicGamePage } from "./pages/ClassicGamePage";
import { SoloTrainingPage } from "./pages/SoloTrainingPage";
import { ReviewErrorsPage } from "./pages/ReviewErrorsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { QuickDuelPage } from "./pages/QuickDuelPage";
import { StudyMapPage } from "./pages/StudyMapPage";
import { AboutPage } from "./pages/AboutPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { BetaFeedbackPage } from "./pages/BetaFeedbackPage";
import { EmblemsPage } from "./pages/EmblemsPage";
import { JourneySetupPage } from "./pages/JourneySetupPage";
import { LearningTracksPage } from "./pages/LearningTracksPage";
import { SettingsPage } from "./pages/SettingsPage";
import { OnboardingModal } from "./components/OnboardingModal";
import { PwaInstallPrompt } from "./components/PwaInstallPrompt";
import { GameMode, ClassicMatchState, PlayerProgress, World } from "./types/game";
import { LocalPlayerProfile } from "./types/playerProfile";
import { loadProgress, saveProgress } from "./lib/storage";
import { loadPlayerProfile, savePlayerProfile } from "./lib/playerProfileStorage";

export type AppScreen =
  | "home"
  | "world"
  | "mode"
  | "classic"
  | "solo"
  | "review"
  | "profile"
  | "emblems"
  | "feedback"
  | "journey"
  | "tracks"
  | "settings"
  | "duel"
  | "studyMap"
  | "about"
  | "privacy";

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("home");
  const [progress, setProgress] = useState<PlayerProgress>(() => loadProgress());
  const [playerProfile, setPlayerProfile] = useState<LocalPlayerProfile | null>(() => loadPlayerProfile());
  const [selectedWorld, setSelectedWorld] = useState<World>("school");
  const [preferredMode, setPreferredMode] = useState<GameMode | null>(null);
  const [lastMatchSummary, setLastMatchSummary] = useState<string | null>(null);
  const [reviewFromHome, setReviewFromHome] = useState(false);
  const [fromStudyMap, setFromStudyMap] = useState(false);
  const [preselectedCategoryId, setPreselectedCategoryId] = useState<string | undefined>(undefined);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  function updateProgress(next: PlayerProgress) {
    setProgress(next);
    saveProgress(next);
  }

  function handleSavePlayerProfile(next: LocalPlayerProfile) {
    setPlayerProfile(next);
    savePlayerProfile(next);
    setScreen("home");
  }

  function goHome() {
    setPreferredMode(null);
    setLastMatchSummary(null);
    setFromStudyMap(false);
    setPreselectedCategoryId(undefined);
    setScreen("home");
  }

  function openWorldSelect(mode?: GameMode) {
    setPreferredMode(mode ?? null);
    setScreen("world");
  }

  function getPreferredWorldFromJourney(): World {
    return playerProfile?.goal === "contest" ? "contest" : "school";
  }

  function handleRecommendedJourneyStart() {
    setLastMatchSummary(null);
    setPreferredMode("solo");
    setSelectedWorld(getPreferredWorldFromJourney());
    setFromStudyMap(false);
    setPreselectedCategoryId(undefined);
    setScreen("solo");
  }

  function handleSmartClassicStart() {
    setLastMatchSummary(null);
    setPreferredMode("classic");
    setSelectedWorld(getPreferredWorldFromJourney());
    setFromStudyMap(false);
    setPreselectedCategoryId(undefined);
    setScreen("classic");
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
    if (mode === "review") {
      setReviewFromHome(false);
      setScreen("review");
    }
  }

  function handleClassicEnd(match: ClassicMatchState, totalXP: number) {
    const winner =
      match.winner === "player"
        ? "Vitória"
        : match.winner === "draw"
          ? "Empate"
          : "Derrota";

    setLastMatchSummary(`${winner} na partida clássica · +${totalXP} XP`);
    setProgress(loadProgress());
    setScreen("home");
  }

  function handleTrainCategory(world: World, categoryId: string) {
    setSelectedWorld(world);
    setPreselectedCategoryId(categoryId);
    setFromStudyMap(true);
    setScreen("solo");
  }

  function handleReviewFromMap(world: World) {
    setSelectedWorld(world);
    setFromStudyMap(true);
    setReviewFromHome(false);
    setScreen("review");
  }

  if (screen === "journey" || (!playerProfile && screen === "home")) {
    return (
      <>
        <OnboardingModal />
        <JourneySetupPage
          progress={progress}
          profile={playerProfile}
          isFirstRun={!playerProfile}
          onSave={handleSavePlayerProfile}
          onBack={playerProfile ? goHome : undefined}
        />
      </>
    );
  }

  if (screen === "tracks") {
    return (
      <LearningTracksPage
        progress={progress}
        profile={playerProfile}
        onBack={goHome}
        onJourney={() => setScreen("journey")}
        onStartSchool={() => {
          setPreferredMode("solo");
          setSelectedWorld("school");
          setScreen("solo");
        }}
        onStartContest={() => {
          setPreferredMode("solo");
          setSelectedWorld("contest");
          setScreen("solo");
        }}
      />
    );
  }

  if (screen === "studyMap") {
    return (
      <StudyMapPage
        progress={progress}
        onBack={goHome}
        onTrainCategory={handleTrainCategory}
        onReviewErrors={handleReviewFromMap}
      />
    );
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
        onBack={() => {
          setPreselectedCategoryId(undefined);
          if (fromStudyMap) {
            setFromStudyMap(false);
            setScreen("studyMap");
          } else {
            setScreen("mode");
          }
        }}
        preselectedCategoryId={preselectedCategoryId}
      />
    );
  }

  if (screen === "review") {
    return (
      <ReviewErrorsPage
        progress={progress}
        onProgressUpdate={updateProgress}
        onBack={() => {
          if (fromStudyMap) {
            setFromStudyMap(false);
            setScreen("studyMap");
          } else if (reviewFromHome) {
            goHome();
          } else {
            setScreen("mode");
          }
        }}
      />
    );
  }

  if (screen === "profile") {
    return <ProfilePage progress={progress} onBack={goHome} onProgressUpdate={setProgress} />;
  }

  if (screen === "emblems") {
    return (
      <EmblemsPage
        progress={progress}
        onBack={goHome}
        onStartClassic={(world) => {
          setPreferredMode("classic");
          if (world) {
            setSelectedWorld(world);
            setScreen("classic");
          } else {
            setScreen("world");
          }
        }}
      />
    );
  }

  if (screen === "feedback") {
    return <BetaFeedbackPage
      progress={progress}
      profile={playerProfile}
      onBack={goHome}
      onJourney={() => setScreen("journey")}
    />;
  }

  if (screen === "settings") {
    return (
      <SettingsPage
        progress={progress}
        profile={playerProfile}
        onBack={goHome}
        onJourney={() => setScreen("journey")}
        onBetaCenter={() => setScreen("feedback")}
        onPrivacy={() => setScreen("privacy")}
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

  if (screen === "about") {
    return (
      <AboutPage
        progress={progress}
        onBack={goHome}
        onPrivacy={() => setScreen("privacy")}
      />
    );
  }

  if (screen === "privacy") {
    return (
      <PrivacyPolicyPage
        progress={progress}
        onBack={() => setScreen("about")}
        onHome={goHome}
      />
    );
  }

  return (
    <>
      <OnboardingModal />
      <PwaInstallPrompt />

      {lastMatchSummary && (
        <div
          className="fixed left-1/2 top-4 z-50 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-full border border-emerald-400/40 bg-emerald-950/90 px-4 py-2 text-center text-sm font-black text-emerald-100 shadow-lg shadow-emerald-950/40"
          role="status"
          aria-live="polite"
        >
          {lastMatchSummary}
        </div>
      )}

      <HomePage
        progress={progress}
        playerProfile={playerProfile}
        onPlay={handleSmartClassicStart}
        onSolo={handleRecommendedJourneyStart}
        onReview={() => {
          setReviewFromHome(true);
          setScreen("review");
        }}
        onProfile={() => setScreen("profile")}
        onEmblems={() => setScreen("emblems")}
        onFeedback={() => setScreen("feedback")}
        onJourney={() => setScreen("journey")}
        onTracks={() => setScreen("tracks")}
        onSettings={() => setScreen("settings")}
        onRecommendedStart={handleRecommendedJourneyStart}
        onDuel={() => openWorldSelect("duel")}
        onStudyMap={() => setScreen("studyMap")}
        onAbout={() => setScreen("about")}
        onPrivacy={() => setScreen("privacy")}
      />
    </>
  );
}
