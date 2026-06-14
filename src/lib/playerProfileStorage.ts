import {
  ContestTrack,
  LocalPlayerProfile,
  PlayerGoal,
  StudyStage,
} from "../types/playerProfile";
import { LEGACY_KEYS, STORAGE_KEYS } from "./storageKeys";

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

function migratePlayerProfileStorage(): void {
  try {
    if (typeof window === "undefined") return;

    const legacyProfile = window.localStorage.getItem(LEGACY_KEYS.PLAYER_PROFILE);
    const currentProfile = window.localStorage.getItem(STORAGE_KEYS.PLAYER_PROFILE);

    if (legacyProfile && !currentProfile) {
      window.localStorage.setItem(STORAGE_KEYS.PLAYER_PROFILE, legacyProfile);
    }

    if (legacyProfile) {
      window.localStorage.removeItem(LEGACY_KEYS.PLAYER_PROFILE);
    }
  } catch {
    // Migração silenciosa: o app continua funcionando.
  }
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

    migratePlayerProfileStorage();

    const raw = window.localStorage.getItem(STORAGE_KEYS.PLAYER_PROFILE);
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
      STORAGE_KEYS.PLAYER_PROFILE,
      JSON.stringify({
        ...profile,
        nickname: profile.nickname.trim() || "Estudante",
        updatedAt: new Date().toISOString(),
      })
    );

    window.localStorage.removeItem(LEGACY_KEYS.PLAYER_PROFILE);
  } catch {
    // Falha silenciosa: o app continua funcionando sem bloquear o jogador.
  }
}
