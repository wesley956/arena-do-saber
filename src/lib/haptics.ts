type HapticPattern = number | number[];

function canVibrate() {
  return (
    typeof window !== "undefined" &&
    typeof window.navigator !== "undefined" &&
    "vibrate" in window.navigator
  );
}

function vibrate(pattern: HapticPattern) {
  if (!canVibrate()) return;

  try {
    window.navigator.vibrate(pattern);
  } catch {
    // Vibração é um extra. Se falhar, o jogo continua normal.
  }
}

export function vibrateTap() {
  vibrate(18);
}

export function vibrateSuccess() {
  vibrate([25, 35, 35]);
}

export function vibrateError() {
  vibrate([60, 35, 90]);
}

export function vibrateReward() {
  vibrate([35, 35, 45, 45, 70]);
}
