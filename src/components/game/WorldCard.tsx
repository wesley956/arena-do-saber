import { World } from "../../types/game";

interface WorldCardProps {
  world: World;
  onClick: () => void;
}

const WORLD_DATA = {
  school: {
    emoji: "🏫",
    title: "Escola",
    description:
      "Aprenda matérias escolares com quiz, roleta, emblemas e desafios rápidos.",
    subjects: ["Português", "Matemática", "Ciências", "História", "Geografia", "Inglês"],
    gradient: "from-blue-600/30 via-indigo-700/20 to-violet-800/30",
    border: "border-blue-500/50",
    accent: "text-blue-400",
    badge: "bg-blue-900/60 text-blue-300 border-blue-700",
    btn: "bg-blue-600 hover:bg-blue-500",
  },
  contest: {
    emoji: "🎯",
    title: "Concurso",
    description:
      "Treine para concursos com perguntas por matéria, explicações e revisão dos erros.",
    subjects: ["Português", "Mat./Lógica", "Informática", "Atualidades", "Legislação", "Específicos"],
    gradient: "from-amber-600/30 via-yellow-700/20 to-orange-800/30",
    border: "border-amber-500/50",
    accent: "text-amber-400",
    badge: "bg-amber-900/60 text-amber-300 border-amber-700",
    btn: "bg-amber-600 hover:bg-amber-500",
  },
};

export function WorldCard({ world, onClick }: WorldCardProps) {
  const data = WORLD_DATA[world];

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left rounded-2xl border-2 ${data.border} bg-gradient-to-br ${data.gradient}
        p-5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
        hover:shadow-xl backdrop-blur-sm
      `}
    >
      <div className="flex items-start gap-4">
        <div className="text-5xl">{data.emoji}</div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-xl font-bold ${data.accent} mb-1`}>
            Mundo {data.title}
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-3">
            {data.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.subjects.map((subj) => (
              <span
                key={subj}
                className={`text-xs px-2 py-0.5 rounded-full border font-medium ${data.badge}`}
              >
                {subj}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`mt-4 w-full py-2.5 rounded-xl text-white text-sm font-bold text-center ${data.btn} transition-colors`}
      >
        Entrar neste Mundo →
      </div>
    </button>
  );
}
