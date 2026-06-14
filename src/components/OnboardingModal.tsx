import { STORAGE_KEYS } from "../lib/storageKeys";
import { type CSSProperties, useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";


type OnboardingItem = {
  icon: string;
  title: string;
  description: string;
};

const LOGO_MASK_STYLE: CSSProperties = {
  WebkitMaskImage:
    "radial-gradient(circle at center, black 0%, black 58%, rgba(0,0,0,0.82) 74%, transparent 100%)",
  maskImage:
    "radial-gradient(circle at center, black 0%, black 58%, rgba(0,0,0,0.82) 74%, transparent 100%)",
  filter: "drop-shadow(0 0 18px rgba(168, 85, 247, 0.45))",
};

const ITEMS: OnboardingItem[] = [
  {
    icon: "🧭",
    title: "Defina sua Jornada",
    description:
      "Escolha seu objetivo, fase de estudo e, se quiser, o tipo de concurso que deseja preparar.",
  },
  {
    icon: "✨",
    title: "Receba um caminho recomendado",
    description:
      "A Home passa a destacar o melhor caminho inicial de acordo com o perfil salvo neste aparelho.",
  },
  {
    icon: "🎡",
    title: "Compita na Partida Clássica",
    description:
      "Gire a roleta, responda perguntas, libere desafios e conquiste Insígnias de Sabedoria.",
  },
  {
    icon: "🎯",
    title: "Treine no modo certo",
    description:
      "O Treino Solo começa pelo mundo mais adequado para sua jornada: Escola ou Concurso.",
  },
  {
    icon: "🗺️",
    title: "Veja as Trilhas Futuras",
    description:
      "O app já está preparado para crescer com alfabetização, fundamental, concursos e mais.",
  },
  {
    icon: "🏆",
    title: "Evolua seu perfil",
    description:
      "XP, acertos, precisão, insígnias e progresso ficam salvos localmente no dispositivo.",
  },
];

function hasSeenOnboarding(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEYS.ONBOARDING_SEEN) === "true";
  } catch {
    return false;
  }
}

function markOnboardingAsSeen() {
  try {
    window.localStorage.setItem(STORAGE_KEYS.ONBOARDING_SEEN, "true");
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
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-slate-950/85 px-3 py-4 backdrop-blur-sm sm:items-center sm:px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      aria-describedby="onboarding-description"
    >
      <Card className="w-full max-w-2xl overflow-hidden border-violet-500/40 bg-slate-950 p-0 shadow-2xl shadow-violet-950/50">
        <div className="relative p-5 sm:p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.28),transparent_58%)]" />
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-amber-300/10 blur-3xl" />

          <div className="relative mb-5 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="mb-3 inline-flex rounded-full border border-violet-400/25 bg-violet-500/15 px-3 py-1 text-xs font-black uppercase tracking-wide text-violet-200">
                Beta público · Jornada personalizada
              </p>

              <div className="flex items-center gap-3">
                <div className="relative h-16 w-16 shrink-0" aria-hidden="true">
                  <div className="absolute inset-2 rounded-full bg-violet-500/35 blur-xl" />
                  <img
                    src="/brand/arena-logo.png"
                    alt=""
                    className="relative h-full w-full scale-125 object-cover"
                    style={LOGO_MASK_STYLE}
                  />
                </div>

                <h2
                  id="onboarding-title"
                  className="text-2xl font-black leading-tight text-white sm:text-3xl"
                >
                  Bem-vindo à
                  <span className="block bg-gradient-to-r from-violet-200 via-sky-200 to-amber-100 bg-clip-text text-transparent">
                    Arena do Saber
                  </span>
                </h2>
              </div>

              <p id="onboarding-description" className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                Um quiz educacional onde você estuda, compete, conquista
                insígnias e segue uma jornada de aprendizado feita para seu
                objetivo.
              </p>
            </div>

            <button
              type="button"
              onClick={closeOnboarding}
              className="shrink-0 rounded-full border border-slate-700 px-3 py-2 text-sm font-bold text-slate-300 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              aria-label="Fechar boas-vindas"
            >
              ✕
            </button>
          </div>

          <div className="relative grid gap-3 sm:grid-cols-2" aria-live="polite" aria-atomic="true">
            {ITEMS.map((item) => (
              <div
                key={item.title}
                className="min-w-0 rounded-2xl border border-slate-700/70 bg-slate-900/75 p-4"
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

          <div className="relative mt-6 rounded-2xl border border-emerald-400/25 bg-emerald-950/15 p-3">
            <p className="text-xs font-black uppercase tracking-wide text-emerald-200">
              Privacidade simples
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">
              Nesta versão, sua jornada e progresso ficam salvos neste
              dispositivo. Não há conta online nem envio automático de dados.
            </p>
          </div>

          <div className="relative mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-relaxed text-slate-400">
              Depois das boas-vindas, você poderá definir ou editar sua Jornada
              pelo menu lateral.
            </p>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="ghost" onClick={closeOnboarding}>
                Pular
              </Button>
              <Button onClick={closeOnboarding}>Começar minha jornada</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
