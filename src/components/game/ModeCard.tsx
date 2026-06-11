import { GameMode } from "../../types/game";

interface ModeCardProps {
  mode: GameMode;
  onClick: () => void;
  disabled?: boolean;
}

const MODE_DATA: Record<
  GameMode,
  {
    icon: string;
    title: string;
    description: string;
    gradient: string;
    border: string;
    accent: string;
    tag: string;
  }
> = {
  classic: {
    icon: "🎲",
    title: "Partida Clássica",
    description:
      "Gire a roleta, responda perguntas por categoria e conquiste emblemas. Jogue contra o Rival Bot!",
    gradient: "from-violet-900/50 to-indigo-900/40",
    border: "border-violet-600/50",
    accent: "text-violet-400",
    tag: "Principal",
  },
  solo: {
    icon: "📖",
    title: "Treino Solo",
    description:
      "Escolha uma matéria e estude no seu ritmo. Sem pressão, sem adversário.",
    gradient: "from-emerald-900/50 to-teal-900/40",
    border: "border-emerald-600/50",
    accent: "text-emerald-400",
    tag: "Estudo",
  },
  duel: {
    icon: "⚡",
    title: "Duelo Rápido",
    description:
      "5 perguntas aleatórias contra o bot. Rápido, intenso e direto ao ponto.",
    gradient: "from-amber-900/50 to-orange-900/40",
    border: "border-amber-600/50",
    accent: "text-amber-400",
    tag: "Rápido",
  },
  review: {
    icon: "🔖",
    title: "Revisão dos Erros",
    description:
      "Revise as perguntas que você errou. Domine o conteúdo e melhore seu desempenho.",
    gradient: "from-red-900/50 to-rose-900/40",
    border: "border-red-600/50",
    accent: "text-red-400",
    tag: "Aprender",
  },
};

export function ModeCard({ mode, onClick, disabled = false }: ModeCardProps) {
  const data = MODE_DATA[mode];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group 
        w-full text-left rounded-2xl border-2 ${data.border} bg-gradient-to-br ${data.gradient}
        p-4 transition-all duration-200 active:scale-[0.98]
        ${disabled ? "opacity-40 cursor-not-allowed" : "hover:scale-[1.01] hover:shadow-lg cursor-pointer"}
      `}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{data.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className={`font-bold text-white text-base`}>{data.title}</h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${data.accent} bg-slate-900/40 border border-current/30`}
            >
              {data.tag}
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
            {data.description}
          </p>
        </div>
        <span className={`text-slate-400 font-bold ${disabled ? "" : "group-hover:text-white"}`}>
          ›
        </span>
      </div>
    </button>
  );
}
