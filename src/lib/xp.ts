import { Difficulty, XPEvent } from "../types/game";

// ============================================================
// XP SYSTEM — Arena do Saber
// ============================================================

export const XP_TABLE: Record<XPEvent, number> = {
  correct_easy: 10,
  correct_medium: 15,
  correct_hard: 25,
  review_correct: 8,
  emblem_gained: 50,
  classic_win: 100,
  duel_win: 40,
};

export function getXPForAnswer(difficulty: Difficulty): number {
  const map: Record<Difficulty, XPEvent> = {
    easy: "correct_easy",
    medium: "correct_medium",
    hard: "correct_hard",
  };
  return XP_TABLE[map[difficulty]];
}

export function getXPForEvent(event: XPEvent): number {
  return XP_TABLE[event];
}

export function calcLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function xpToNextLevel(xp: number): number {
  const level = calcLevel(xp);
  return level * 100 - xp;
}

export function xpProgressInLevel(xp: number): number {
  return xp % 100;
}
