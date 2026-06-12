export interface LocalSettings {
  hapticsEnabled: boolean;
}

const LOCAL_SETTINGS_KEY = "arena-do-saber:local-settings-v1";

const DEFAULT_LOCAL_SETTINGS: LocalSettings = {
  hapticsEnabled: true,
};

export function getLocalSettings(): LocalSettings {
  if (typeof window === "undefined") {
    return DEFAULT_LOCAL_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_SETTINGS_KEY);
    if (!raw) return DEFAULT_LOCAL_SETTINGS;

    const parsed = JSON.parse(raw) as Partial<LocalSettings>;

    return {
      hapticsEnabled:
        typeof parsed.hapticsEnabled === "boolean"
          ? parsed.hapticsEnabled
          : DEFAULT_LOCAL_SETTINGS.hapticsEnabled,
    };
  } catch {
    return DEFAULT_LOCAL_SETTINGS;
  }
}

export function saveLocalSettings(settings: LocalSettings) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(settings));
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
