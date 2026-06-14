import { PlayerProgress } from "../types/game";

export type DailyMissionAction = "classic" | "solo" | "review" | "duel";

export interface DailyMission {
  id: string;
  icon: string;
  title: string;
  description: string;
  action: DailyMissionAction;
  buttonLabel: string;
  tone: string;
}

export function getDailyMission(progress: PlayerProgress): DailyMission {
  const dayOfWeek = new Date().getDay();
  const hasErrors = progress.wrongQuestionIds.length > 0;

  if (hasErrors && (dayOfWeek === 1 || dayOfWeek === 4)) {
    return {
      id: "review-errors",
      icon: "🔖",
      title: "Revisar erros salvos",
      description: `Você tem ${progress.wrongQuestionIds.length} questão(ões) na fila de revisão.`,
      action: "review",
      buttonLabel: "Iniciar revisão",
      tone: "border-rose-400/30 bg-rose-950/20",
    };
  }

  if (dayOfWeek === 2 || dayOfWeek === 5) {
    return {
      id: "classic-match",
      icon: "🎡",
      title: "Disputar uma Partida Clássica",
      description: "Gire a roleta, enfrente o rival e avance rumo às Insígnias de Sabedoria.",
      action: "classic",
      buttonLabel: "Entrar na Arena",
      tone: "border-violet-400/30 bg-violet-950/20",
    };
  }

  if (dayOfWeek === 3 || dayOfWeek === 6) {
    return {
      id: "solo-training",
      icon: "📚",
      title: "Treinar uma matéria",
      description: "Faça uma sessão curta no Treino Solo para fortalecer seu domínio.",
      action: "solo",
      buttonLabel: "Começar treino",
      tone: "border-emerald-400/30 bg-emerald-950/20",
    };
  }

  return {
    id: "quick-duel",
    icon: "⚡",
    title: "Fazer um Duelo Rápido",
    description: "Responda 5 perguntas contra o rival em uma rodada curta e intensa.",
    action: "duel",
    buttonLabel: "Duelar agora",
    tone: "border-amber-400/30 bg-amber-950/20",
  };
}
