// ============================================================
// STORAGE KEYS — fonte única da verdade para localStorage
// ============================================================

export const STORAGE_KEYS = {
  PLAYER_PROGRESS: "arena-do-saber:progress-v1",
  PLAYER_PROFILE: "arena-do-saber:profile-v1",
  ONBOARDING_SEEN: "arena-do-saber:onboarding-seen",
  SOLO_TRAINING_HISTORY: "arena-do-saber:solo-history-v1",
  LOCAL_SETTINGS: "arena-do-saber:settings-v1",
  SCRATCHPADS: "arena-do-saber:scratchpads-v1",
} as const;

export const LEGACY_KEYS = {
  PLAYER_PROGRESS: "arena_saber_progress",
  PLAYER_PROFILE: "arena-do-saber-player-profile-v1",
  SOLO_TRAINING_HISTORY: "arena-do-saber:solo-training-history",
  LOCAL_SETTINGS: "arena-do-saber:local-settings-v1",
  SCRATCHPADS: "arena-do-saber:scratchpads",
} as const;
