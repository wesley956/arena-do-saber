import { useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

const ONBOARDING_STORAGE_KEY = "arena-do-saber:onboarding-seen";

type OnboardingItem = {
  icon: string;
  title: string;
  description: string;
};

const ITEMS: OnboardingItem[] = [
  {
    icon: "🎡",
    title: "Partida Clássica",
    description:
      "Gire a roleta, avance nas categorias e conquiste Insígnias de Sabedoria.",
  },
  {
    icon: "🎯",
    title: "Treino Solo",
    description:
      "Estude uma matéria por vez com ciclo inteligente para reduzir repetições.",
  },
  {
    icon: "🗺️",
    title: "Mapa de Estudos",
    description:
      "Veja seu progresso por mundo e escolha onde quer melhorar agora.",
  },
  {
    icon: "📝",
    title: "Caderno de Resolução",
    description:
      "Anote raciocínios, contas e ideias durante as questões.",
  },
  {
    icon: "🏆",
    title: "Perfil e Conquistas",
    description:
      "Acompanhe XP, acertos, desempenho e conquistas salvas neste dispositivo.",
  },
];

function hasSeenOnboarding(): boolean {
  try {
    return window.localStorage.getItem(ONBOARDING_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function markOnboardingAsSeen() {
  try {
    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
  } catch {
    // O jogo deve continuar funcionando mesmo sem acesso ao localStorage.
  }
}

export function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(!hasSeenOnboarding());
  }, []);

  function closeOnboarding() {
    markOnboardingAsSeen();
    setIsOpen(false);
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-slate-950/80 px-3 py-4 backdrop-blur-sm sm:items-center sm:px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <Card className="w-full max-w-2xl border-violet-500/40 bg-slate-900 p-5 shadow-2xl shadow-violet-950/40 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="mb-2 inline-flex rounded-full bg-violet-500/15 px-3 py-1 text-xs font-black uppercase tracking-wide text-violet-200">
              Versão Beta
            </p>
            <h2
              id="onboarding-title"
              className="text-2xl font-black leading-tight text-white sm:text-3xl"
            >
              Bem-vindo à Arena do Saber
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
              Um quiz educacional para estudar, praticar e evoluir com roleta,
              desafios e progresso salvo neste dispositivo.
            </p>
          </div>
          <button
            type="button"
            onClick={closeOnboarding}
            className="rounded-full border border-slate-700 px-3 py-2 text-sm font-bold text-slate-300 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            aria-label="Fechar boas-vindas"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {ITEMS.map((item) => (
            <div
              key={item.title}
              className="min-w-0 rounded-2xl border border-slate-700/70 bg-slate-800/70 p-4"
            >
              <div className="mb-2 text-2xl" aria-hidden="true">
                {item.icon}
              </div>
              <h3 className="text-base font-black leading-tight text-white">
                {item.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-relaxed text-slate-400">
            Seus dados ficam no próprio navegador/app. Você pode limpar tudo nas
            configurações do navegador quando quiser.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="ghost" onClick={closeOnboarding}>
              Pular
            </Button>
            <Button onClick={closeOnboarding}>Começar agora</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
