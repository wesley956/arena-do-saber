import { getCategoriesByWorld } from "../data/categories";
import { QUESTIONS, getQuestionById } from "../data/questions";
import { PlayerProgress, World } from "../types/game";
import { getScratchpadCount } from "./scratchpad";
import { getSoloTrainingSeenQuestionIds } from "./soloTrainingHistory";

type AchievementTone = "bronze" | "silver" | "gold" | "violet" | "emerald";

export interface ProfileCategoryStats {
  categoryId: string;
  categoryName: string;
  world: World;
  icon: string;
  colorClass: string;
  totalQuestions: number;
  answered: number;
  correct: number;
  wrong: number;
  accuracy: number;
  soloSeen: number;
  hasEmblem: boolean;
  progressPercent: number;
  activityScore: number;
}

export interface ProfileWorldStats {
  world: World;
  label: string;
  totalQuestions: number;
  answered: number;
  correct: number;
  wrong: number;
  accuracy: number;
  categoriesWithProgress: number;
  conqueredEmblems: number;
  categories: ProfileCategoryStats[];
}

export interface PlayerProfileSummary {
  totalAnswered: number;
  totalCorrect: number;
  totalWrong: number;
  accuracy: number;
  categoriesWithProgress: number;
  mostStudiedWorld: string;
  soloSeenQuestionCount: number;
  soloCategoriesStudied: number;
  scratchpadCount: number;
  completedEmblemsCount: number;
}

export interface PlayerAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progressLabel: string;
  tone: AchievementTone;
}

const WORLD_LABELS: Record<World, string> = {
  school: "Mundo Escola",
  contest: "Mundo Concurso",
};

function safePercent(value: number, total: number): number {
  if (total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((value / total) * 100)));
}

function getQuestionCountByCategory(categoryId: string): number {
  return QUESTIONS.filter((question) => question.categoryId === categoryId).length;
}

function countWrongByCategory(progress: PlayerProgress, categoryId: string): number {
  return progress.wrongQuestionIds.filter((questionId) => {
    const question = getQuestionById(questionId);
    return question?.categoryId === categoryId;
  }).length;
}

function getSafeSoloSeenIds(categoryId: string): string[] {
  try {
    return getSoloTrainingSeenQuestionIds(categoryId);
  } catch {
    return [];
  }
}

function getSafeScratchpadCount(): number {
  try {
    return getScratchpadCount();
  } catch {
    return 0;
  }
}

export function getProfileCategoryStats(
  progress: PlayerProgress,
  categoryId: string
): ProfileCategoryStats | null {
  const category = [...getCategoriesByWorld("school"), ...getCategoriesByWorld("contest")].find(
    (item) => item.id === categoryId
  );

  if (!category) return null;

  const correct = Math.max(0, progress.categoryProgress[categoryId] ?? 0);
  const wrong = countWrongByCategory(progress, categoryId);
  const answered = correct + wrong;
  const totalQuestions = getQuestionCountByCategory(categoryId);
  const soloSeen = getSafeSoloSeenIds(categoryId).length;
  const hasEmblem = progress.completedEmblems.includes(categoryId);
  const progressPercent = safePercent(Math.max(answered, soloSeen), totalQuestions);

  return {
    categoryId,
    categoryName: category.name,
    world: category.world,
    icon: category.icon,
    colorClass: category.textClass,
    totalQuestions,
    answered,
    correct,
    wrong,
    accuracy: safePercent(correct, answered),
    soloSeen,
    hasEmblem,
    progressPercent,
    activityScore: answered + soloSeen + (hasEmblem ? 1 : 0),
  };
}

export function getProfileWorldStats(
  progress: PlayerProgress,
  world: World
): ProfileWorldStats {
  const categories = getCategoriesByWorld(world)
    .map((category) => getProfileCategoryStats(progress, category.id))
    .filter((stats): stats is ProfileCategoryStats => stats !== null);

  const totalQuestions = categories.reduce((sum, category) => sum + category.totalQuestions, 0);
  const answered = categories.reduce((sum, category) => sum + category.answered, 0);
  const correct = categories.reduce((sum, category) => sum + category.correct, 0);
  const wrong = categories.reduce((sum, category) => sum + category.wrong, 0);
  const categoriesWithProgress = categories.filter(
    (category) => category.activityScore > 0
  ).length;
  const conqueredEmblems = categories.filter((category) => category.hasEmblem).length;

  return {
    world,
    label: WORLD_LABELS[world],
    totalQuestions,
    answered,
    correct,
    wrong,
    accuracy: safePercent(correct, answered),
    categoriesWithProgress,
    conqueredEmblems,
    categories,
  };
}

export function getAllProfileWorldStats(progress: PlayerProgress): ProfileWorldStats[] {
  return [getProfileWorldStats(progress, "school"), getProfileWorldStats(progress, "contest")];
}

function getSoloTrainingTotals(): { totalSeen: number; categoriesStudied: number } {
  const categoryIds = [...getCategoriesByWorld("school"), ...getCategoriesByWorld("contest")].map(
    (category) => category.id
  );

  const counts = categoryIds.map((categoryId) => getSafeSoloSeenIds(categoryId).length);

  return {
    totalSeen: counts.reduce((sum, count) => sum + count, 0),
    categoriesStudied: counts.filter((count) => count > 0).length,
  };
}

function hasAllEmblemsInAnyWorld(progress: PlayerProgress): boolean {
  return (["school", "contest"] as World[]).some((world) =>
    getCategoriesByWorld(world).every((category) =>
      progress.completedEmblems.includes(category.id)
    )
  );
}

export function getPlayerProfileSummary(progress: PlayerProgress): PlayerProfileSummary {
  const worldStats = getAllProfileWorldStats(progress);
  const totalAnswered = Math.max(0, progress.totalCorrect + progress.totalWrong);
  const soloTotals = getSoloTrainingTotals();
  const categoriesWithProgress = worldStats.reduce(
    (sum, world) => sum + world.categoriesWithProgress,
    0
  );

  const mostStudied = worldStats
    .map((world) => ({
      label: world.label,
      score: world.categories.reduce((sum, category) => sum + category.activityScore, 0),
    }))
    .sort((a, b) => b.score - a.score)[0];

  return {
    totalAnswered,
    totalCorrect: Math.max(0, progress.totalCorrect),
    totalWrong: Math.max(0, progress.totalWrong),
    accuracy: safePercent(progress.totalCorrect, totalAnswered),
    categoriesWithProgress,
    mostStudiedWorld: mostStudied && mostStudied.score > 0 ? mostStudied.label : "Ainda sem dados",
    soloSeenQuestionCount: soloTotals.totalSeen,
    soloCategoriesStudied: soloTotals.categoriesStudied,
    scratchpadCount: getSafeScratchpadCount(),
    completedEmblemsCount: progress.completedEmblems.length,
  };
}

export function getPlayerAchievements(progress: PlayerProgress): PlayerAchievement[] {
  const summary = getPlayerProfileSummary(progress);
  const studiedWorlds = getAllProfileWorldStats(progress).filter((world) =>
    world.categories.some((category) => category.activityScore > 0)
  ).length;
  const hasAnyBadge = summary.completedEmblemsCount > 0;

  return [
    {
      id: "first-steps",
      title: "Primeiros Passos",
      description: "Responder a primeira pergunta na Arena.",
      icon: "👣",
      unlocked: summary.totalAnswered >= 1,
      progressLabel: `${Math.min(summary.totalAnswered, 1)}/1 pergunta`,
      tone: "bronze",
    },
    {
      id: "first-correct",
      title: "Primeiro Acerto",
      description: "Acertar a primeira questão.",
      icon: "🎯",
      unlocked: summary.totalCorrect >= 1,
      progressLabel: `${Math.min(summary.totalCorrect, 1)}/1 acerto`,
      tone: "emerald",
    },
    {
      id: "focused-training",
      title: "Treinando com Foco",
      description: "Ver 10 perguntas no Treino Solo.",
      icon: "🧠",
      unlocked: summary.soloSeenQuestionCount >= 10,
      progressLabel: `${Math.min(summary.soloSeenQuestionCount, 10)}/10 no Treino Solo`,
      tone: "silver",
    },
    {
      id: "study-sequence",
      title: "Sequência de Estudos",
      description: "Usar o Treino Solo em mais de uma matéria.",
      icon: "📚",
      unlocked: summary.soloCategoriesStudied >= 2,
      progressLabel: `${Math.min(summary.soloCategoriesStudied, 2)}/2 matérias`,
      tone: "violet",
    },
    {
      id: "arena-explorer",
      title: "Explorador da Arena",
      description: "Registrar progresso nos dois mundos do jogo.",
      icon: "🧭",
      unlocked: studiedWorlds >= 2,
      progressLabel: `${Math.min(studiedWorlds, 2)}/2 mundos`,
      tone: "silver",
    },
    {
      id: "badge-hunter",
      title: "Caçador de Insígnias",
      description: "Conquistar pelo menos uma insígnia.",
      icon: "🏅",
      unlocked: hasAnyBadge,
      progressLabel: `${summary.completedEmblemsCount}/1 insígnia`,
      tone: "gold",
    },
    {
      id: "badge-master",
      title: "Mestre das Insígnias",
      description: "Conquistar todas as insígnias de um mundo.",
      icon: "👑",
      unlocked: hasAllEmblemsInAnyWorld(progress),
      progressLabel: hasAllEmblemsInAnyWorld(progress) ? "Mundo completo" : "0/1 mundo completo",
      tone: "gold",
    },
    {
      id: "active-scratchpad",
      title: "Caderno Ativo",
      description: "Salvar uma anotação no Caderno de Resolução.",
      icon: "📝",
      unlocked: summary.scratchpadCount > 0,
      progressLabel: `${summary.scratchpadCount}/1 anotação`,
      tone: "violet",
    },
    {
      id: "persistent-student",
      title: "Aluno Persistente",
      description: "Ter histórico salvo no Treino Solo.",
      icon: "💾",
      unlocked: summary.soloSeenQuestionCount > 0,
      progressLabel: `${summary.soloSeenQuestionCount} pergunta(s) salvas`,
      tone: "emerald",
    },
    {
      id: "challenger",
      title: "Desafiante",
      description: "Vencer um Desafio da Insígnia detectado por insígnia conquistada.",
      icon: "⚔️",
      unlocked: hasAnyBadge,
      progressLabel: hasAnyBadge ? "Desafio vencido" : "Bloqueada",
      tone: "bronze",
    },
  ];
}
