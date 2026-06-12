import {
  ContestTrack,
  LocalPlayerProfile,
  PlayerGoal,
  StudyStage,
} from "../types/playerProfile";

const PLAYER_PROFILE_KEY = "arena-do-saber-player-profile-v1";

const GOALS: PlayerGoal[] = ["literacy", "school", "contest", "general"];
const STAGES: StudyStage[] = [
  "literacy",
  "fundamental1",
  "fundamental2",
  "highSchool",
  "adult",
];
const CONTEST_TRACKS: ContestTrack[] = [
  "pm",
  "gcm",
  "cityHall",
  "bank",
  "administrative",
  "court",
  "other",
];

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isPlayerGoal(value: unknown): value is PlayerGoal {
  return isString(value) && GOALS.includes(value as PlayerGoal);
}

function isStudyStage(value: unknown): value is StudyStage {
  return isString(value) && STAGES.includes(value as StudyStage);
}

function isContestTrack(value: unknown): value is ContestTrack {
  return isString(value) && CONTEST_TRACKS.includes(value as ContestTrack);
}

function normalizeProfile(value: unknown): LocalPlayerProfile | null {
  if (!value || typeof value !== "object") return null;

  const raw = value as Partial<LocalPlayerProfile>;

  if (!isString(raw.nickname)) return null;
  if (!isPlayerGoal(raw.goal)) return null;
  if (!isStudyStage(raw.studyStage)) return null;

  const now = new Date().toISOString();

  return {
    nickname: raw.nickname.trim() || "Estudante",
    goal: raw.goal,
    studyStage: raw.studyStage,
    contestTrack: isContestTrack(raw.contestTrack)
      ? raw.contestTrack
      : undefined,
    createdAt: isString(raw.createdAt) ? raw.createdAt : now,
    updatedAt: isString(raw.updatedAt) ? raw.updatedAt : now,
  };
}

export function loadPlayerProfile(): LocalPlayerProfile | null {
  try {
    if (typeof window === "undefined") return null;

    const raw = window.localStorage.getItem(PLAYER_PROFILE_KEY);
    if (!raw) return null;

    return normalizeProfile(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function savePlayerProfile(profile: LocalPlayerProfile) {
  try {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(
      PLAYER_PROFILE_KEY,
      JSON.stringify({
        ...profile,
        nickname: profile.nickname.trim() || "Estudante",
        updatedAt: new Date().toISOString(),
      })
    );
  } catch {
    // Falha silenciosa: o app continua funcionando sem bloquear o jogador.
  }
}
