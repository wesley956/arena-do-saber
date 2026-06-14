import { LEGACY_KEYS, STORAGE_KEYS } from "./storageKeys";

export type ThemePreference = "system" | "dark" | "light";

export interface LocalSettings {
  hapticsEnabled: boolean;
  themePreference: ThemePreference;
}

const DEFAULT_LOCAL_SETTINGS: LocalSettings = {
  hapticsEnabled: true,
  themePreference: "dark",
};

function normalizeThemePreference(value: unknown): ThemePreference {
  if (value === "system" || value === "dark" || value === "light") {
    return value;
  }

  return DEFAULT_LOCAL_SETTINGS.themePreference;
}

function migrateLocalSettings(): void {
  if (typeof window === "undefined") return;

  try {
    const legacySettings = window.localStorage.getItem(LEGACY_KEYS.LOCAL_SETTINGS);
    const currentSettings = window.localStorage.getItem(STORAGE_KEYS.LOCAL_SETTINGS);

    if (legacySettings && !currentSettings) {
      window.localStorage.setItem(STORAGE_KEYS.LOCAL_SETTINGS, legacySettings);
    }

    if (legacySettings) {
      window.localStorage.removeItem(LEGACY_KEYS.LOCAL_SETTINGS);
    }
  } catch {
    // Preferências são extras. Se falhar, o app continua normal.
  }
}

export function getLocalSettings(): LocalSettings {
  if (typeof window === "undefined") {
    return DEFAULT_LOCAL_SETTINGS;
  }

  try {
    migrateLocalSettings();

    const raw = window.localStorage.getItem(STORAGE_KEYS.LOCAL_SETTINGS);
    if (!raw) return DEFAULT_LOCAL_SETTINGS;

    const parsed = JSON.parse(raw) as Partial<LocalSettings>;

    return {
      hapticsEnabled:
        typeof parsed.hapticsEnabled === "boolean"
          ? parsed.hapticsEnabled
          : DEFAULT_LOCAL_SETTINGS.hapticsEnabled,
      themePreference: normalizeThemePreference(parsed.themePreference),
    };
  } catch {
    return DEFAULT_LOCAL_SETTINGS;
  }
}

export function saveLocalSettings(settings: LocalSettings) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      STORAGE_KEYS.LOCAL_SETTINGS,
      JSON.stringify(settings)
    );
    window.localStorage.removeItem(LEGACY_KEYS.LOCAL_SETTINGS);
  } catch {
    // Preferências são um extra. Se falhar, o app continua normal.
  }
}

export function areHapticsEnabled() {
  return getLocalSettings().hapticsEnabled;
}

export function setHapticsEnabledPreference(enabled: boolean) {
  saveLocalSettings({
    ...getLocalSettings(),
    hapticsEnabled: enabled,
  });
}


export function setThemePreference(themePreference: ThemePreference) {
  saveLocalSettings({
    ...getLocalSettings(),
    themePreference,
  });
}
