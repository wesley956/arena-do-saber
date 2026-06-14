import { getLocalSettings, type ThemePreference } from "./localSettings";

export type ResolvedTheme = "dark" | "light";

const SYSTEM_THEME_QUERY = "(prefers-color-scheme: light)";

export function resolveThemePreference(
  themePreference: ThemePreference
): ResolvedTheme {
  if (themePreference === "light") return "light";
  if (themePreference === "dark") return "dark";

  if (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(SYSTEM_THEME_QUERY).matches
  ) {
    return "light";
  }

  return "dark";
}

export function applyThemePreference(themePreference = getLocalSettings().themePreference) {
  if (typeof document === "undefined") return;

  const resolvedTheme = resolveThemePreference(themePreference);
  const root = document.documentElement;

  root.dataset.theme = resolvedTheme;
  root.style.colorScheme = resolvedTheme;

  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) {
    themeMeta.setAttribute(
      "content",
      resolvedTheme === "light" ? "#f8fafc" : "#7c3aed"
    );
  }
}

export function setupThemeChangeListener(): () => void {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return () => undefined;
  }

  const media = window.matchMedia(SYSTEM_THEME_QUERY);
  const handleChange = () => {
    if (getLocalSettings().themePreference === "system") {
      applyThemePreference("system");
    }
  };

  media.addEventListener("change", handleChange);

  return () => {
    media.removeEventListener("change", handleChange);
  };
}
