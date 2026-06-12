import { type CSSProperties, useState } from "react";
import { PlayerProgress } from "../types/game";
import { LocalPlayerProfile } from "../types/playerProfile";
import { AppShell } from "../components/layout/AppShell";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ProgressBar } from "../components/game/ProgressBar";
import { xpProgressInLevel, xpToNextLevel } from "../lib/xp";
import { getAccuracyRate } from "../lib/stats";
import { ALL_CATEGORIES } from "../data/categories";
import { APP_VERSION } from "../lib/appVersion";

interface HomePageProps {
  progress: PlayerProgress;
  playerProfile: LocalPlayerProfile | null;
  onPlay: () => void;
  onSolo: () => void;
  onReview: () => void;
  onProfile: () => void;
  onEmblems: () => void;
  onFeedback: () => void;
  onJourney: () => void;
  onTracks: () => void;
  onRecommendedStart: () => void;
  onDuel: () => void;
  onStudyMap: () => void;
  onAbout: () => void;
  onPrivacy: () => void;
}

const LOGO_MASK_STYLE: CSSProperties = {
  WebkitMaskImage:
    "radial-gradient(circle at center, black 0%, black 56%, rgba(0,0,0,0.85) 72%, transparent 100%)",
  maskImage:
    "radial-gradient(circle at center, black 0%, black 56%, rgba(0,0,0,0.85) 72%, transparent 100%)",
  filter: "drop-shadow(0 0 18px rgba(168, 85, 247, 0.42))",
};

function IntegratedArenaLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`relative shrink-0 ${compact ? "h-12 w-12" : "h-16 w-16 sm:h-20 sm:w-20"}`}
      aria-hidden="true"
    >
      <div className="absolute inset-2 rounded-full bg-violet-500/30 blur-xl" />
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-400/20 via-transparent to-amber-300/10 blur-md" />
      <img
        src="/brand/arena-logo.png"
        alt=""
        className="relative h-full w-full scale-125 object-cover"
        style={LOGO_MASK_STYLE}
      />
    </div>
  );
}


function getJourneyLabel(profile: LocalPlayerProfile | null) {
  if (!profile) return "Definir objetivo";

  if (profile.goal === "literacy") return "Alfabetização";
  if (profile.goal === "contest") {
    if (profile.contestTrack === "pm") return "Concurso · Polícia Militar";
    if (profile.contestTrack === "gcm") return "Concurso · Guarda Municipal";
    if (profile.contestTrack === "cityHall") return "Concurso · Prefeitura";
    if (profile.contestTrack === "bank") return "Concurso · Banco";
    if (profile.contestTrack === "administrative") return "Concurso · Administrativo";
    if (profile.contestTrack === "court") return "Concurso · Tribunal";
    return "Concurso · Geral";
  }

  if (profile.goal === "school") {
    if (profile.studyStage === "fundamental1") return "Escola · Fundamental I";
    if (profile.studyStage === "fundamental2") return "Escola · Fundamental II";
    if (profile.studyStage === "highSchool") return "Escola · Ensino Médio";
    return "Escola";
  }

  return "Conhecimentos gerais";
}


function getRecommendedPath(profile: LocalPlayerProfile | null) {
  if (!profile) {
    return {
      icon: "🧭",
      title: "Defina sua jornada",
      description:
        "Escolha seu objetivo para o Arena do Saber recomendar o melhor caminho de estudo.",
      buttonLabel: "Definir jornada",
      tone: "border-violet-400/30 bg-violet-950/20",
      useJourneyButton: true,
    };
  }

  if (profile.goal === "literacy") {
    return {
      icon: "🔤",
      title: "Trilha: Alfabetização",
      description:
        "O app já guardou esse objetivo. Nas próximas fases, vamos adicionar conteúdos próprios para letras, sons, sílabas e palavras.",
      buttonLabel: "Começar pela base escolar",
      tone: "border-sky-400/30 bg-sky-950/20",
      useJourneyButton: false,
    };
  }

  if (profile.goal === "contest") {
    return {
      icon: "🎯",
      title: getJourneyLabel(profile),
      description:
        "Sua Home agora entende seu foco. Comece treinando no Mundo Concurso e depois evoluiremos para trilhas por edital.",
      buttonLabel: "Treinar concurso",
      tone: "border-amber-400/30 bg-amber-950/20",
      useJourneyButton: false,
    };
  }

  if (profile.goal === "school") {
    return {
      icon: "🏫",
      title: getJourneyLabel(profile),
      description:
        "Sua trilha foi ajustada para estudo escolar. Comece pelo Treino Solo para fortalecer as matérias.",
      buttonLabel: "Treinar escola",
      tone: "border-emerald-400/30 bg-emerald-950/20",
      useJourneyButton: false,
    };
  }

  return {
    icon: "🧠",
    title: "Trilha: Conhecimentos gerais",
    description:
      "Treine raciocínio, cultura geral e revisão usando os modos atuais do Arena do Saber.",
    buttonLabel: "Começar treino",
    tone: "border-violet-400/30 bg-violet-950/20",
    useJourneyButton: false,
  };
}

export function HomePage({
  progress,
  playerProfile,
  onPlay,
  onSolo,
  onReview,
  onProfile,
  onEmblems,
  onFeedback,
  onJourney,
  onTracks,
  onRecommendedStart,
  onDuel,
  onStudyMap,
  onAbout,
  onPrivacy,
}: HomePageProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const xpInLevel = xpProgressInLevel(progress.xp);
  const toNext = xpToNextLevel(progress.xp);
  const accuracy = getAccuracyRate(progress);
  const hasErrors = progress.wrongQuestionIds.length > 0;
  const completedEmblemCount = progress.completedEmblems.length;
  const totalEmblems = ALL_CATEGORIES.length;
  const playerName = playerProfile?.nickname?.trim() || "Estudante";
  const journeyLabel = getJourneyLabel(playerProfile);
  const recommendedPath = getRecommendedPath(playerProfile);

  function openFromMenu(action: () => void) {
    setMenuOpen(false);
    action();
  }

  return (
    <AppShell>
      <div className="space-y-4 pb-8">
        <header className="relative overflow-hidden rounded-[2rem] border border-violet-500/10 bg-slate-950/20 px-3 py-4 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.20),transparent_55%)]" />

          <div className="relative flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/80 text-xl text-white shadow-lg shadow-slate-950/30 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
              aria-label="Abrir menu"
            >
              ☰
            </button>

            <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-200">
              Beta
            </span>
          </div>

          <div className="relative mt-3 flex items-center justify-center gap-3">
            <IntegratedArenaLogo />
            <h1 className="text-left text-3xl font-black leading-none text-white sm:text-4xl">
              Arena
              <span className="block bg-gradient-to-r from-violet-200 via-sky-200 to-amber-100 bg-clip-text text-transparent">
                do Saber
              </span>
            </h1>
          </div>

          <p className="relative mx-auto mt-3 max-w-sm text-center text-sm leading-relaxed text-slate-300">
            Estude, compita e conquiste insígnias no maior quiz educacional.
          </p>
        </header>

        <section className="grid grid-cols-3 gap-2">
          <Card className="p-3 text-center">
            <p className="text-2xl font-black text-emerald-300">
              {progress.totalCorrect}
            </p>
            <p className="mt-1 text-xs font-bold text-slate-300">Acertos</p>
          </Card>

          <Card className="p-3 text-center">
            <p className="text-2xl font-black text-violet-300">{accuracy}%</p>
            <p className="mt-1 text-xs font-bold text-slate-300">Precisão</p>
          </Card>

          <Card className="p-3 text-center">
            <p className="text-2xl font-black text-amber-300">
              {completedEmblemCount}
            </p>
            <p className="mt-1 text-xs font-bold text-slate-300">Insígnias</p>
          </Card>
        </section>

        <Card className={`p-4 ${recommendedPath.tone}`}>
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950/70 text-2xl">
              {recommendedPath.icon}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-black uppercase tracking-wide text-violet-200">
                Caminho recomendado
              </p>
              <h2 className="mt-1 text-lg font-black leading-tight text-white">
                {recommendedPath.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {recommendedPath.description}
              </p>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  size="sm"
                  onClick={
                    recommendedPath.useJourneyButton
                      ? onJourney
                      : onRecommendedStart
                  }
                >
                  {recommendedPath.buttonLabel}
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={onJourney}
                >
                  Editar jornada
                </Button>
              </div>
            </div>
          </div>
        </Card>


        <section className="grid grid-cols-2 gap-3">
          <Card className="flex min-h-[180px] flex-col p-4" glow>
            <div className="flex-1">
              <h2 className="text-lg font-black leading-tight text-white">
                🎡 Partida Clássica
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Gire a roleta, vença desafios e entre no mundo recomendado pela sua jornada.
              </p>
            </div>

            <Button className="mt-4" fullWidth size="md" onClick={onPlay}>
              Jogar
            </Button>
          </Card>

          <Card className="flex min-h-[180px] flex-col p-4">
            <div className="flex-1">
              <h2 className="text-lg font-black leading-tight text-white">
                🎯 Treino Solo
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Estude por matéria começando pelo caminho ideal para seu objetivo.
              </p>
            </div>

            <Button
              className="mt-4"
              fullWidth
              variant="secondary"
              size="md"
              onClick={onSolo}
            >
              Treinar
            </Button>
          </Card>
        </section>

        <section className="grid grid-cols-3 gap-2">
          {[
            {
              icon: "🗺️",
              title: "Mapa",
              helper: "Matérias",
              action: onStudyMap,
              tone: "border-indigo-400/40 bg-indigo-950/25 text-indigo-100",
            },
            {
              icon: "⚡",
              title: "Duelo",
              helper: "Local",
              action: onDuel,
              tone: "border-amber-400/40 bg-amber-950/20 text-amber-100",
            },
            {
              icon: "📘",
              title: hasErrors ? "Revisar" : "Revisão",
              helper: hasErrors
                ? `${progress.wrongQuestionIds.length} erro(s)`
                : "Sem erros",
              action: onReview,
              tone: "border-rose-400/40 bg-rose-950/20 text-rose-100",
            },
          ].map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={item.action}
              className={`min-h-[88px] rounded-2xl border p-3 text-center shadow-lg shadow-slate-950/20 transition-all hover:-translate-y-0.5 hover:bg-slate-800/70 focus:outline-none focus:ring-2 focus:ring-violet-300/70 focus:ring-offset-2 focus:ring-offset-slate-950 ${item.tone}`}
            >
              <span className="block text-2xl" aria-hidden="true">
                {item.icon}
              </span>
              <span className="mt-2 block text-sm font-black leading-tight">
                {item.title}
              </span>
              <span className="mt-1 block text-xs leading-snug text-slate-300">
                {item.helper}
              </span>
            </button>
          ))}
        </section>

        <footer className="rounded-2xl border border-slate-800 bg-slate-900/45 p-3 text-center text-xs text-slate-400">
          Arena do Saber Beta {APP_VERSION} · Escola + Concurso
        </footer>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
          />

          <aside className="absolute left-0 top-0 flex h-full w-[86vw] max-w-sm flex-col overflow-y-auto border-r border-violet-500/20 bg-slate-950 shadow-2xl shadow-slate-950">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.22),transparent_48%)]" />

            <div className="relative flex-1 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <IntegratedArenaLogo compact />
                  <div className="min-w-0">
                    <p className="truncate text-base font-black text-white">
                      Arena do Saber
                    </p>
                    <p className="text-xs font-bold text-slate-400">
                      {journeyLabel}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-xl text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                  aria-label="Fechar menu"
                >
                  ×
                </button>
              </div>

              <button
                type="button"
                onClick={() => openFromMenu(onProfile)}
                className="mt-5 w-full rounded-[1.75rem] border border-slate-700 bg-slate-900/80 p-4 text-left shadow-xl shadow-violet-950/20 transition hover:border-violet-400/60 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-2xl">
                    🧑‍🎓
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-black text-white">
                      {playerName} Lv. {progress.level}
                    </h2>
                    <p className="text-sm text-slate-300">
                      ⚡ {progress.xp} XP · {toNext} XP para Lv.{" "}
                      {progress.level + 1}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <ProgressBar
                    value={xpInLevel}
                    max={Math.max(xpInLevel + toNext, 1)}
                    label="Progresso de nível"
                    showLabel
                  />
                </div>

                <p className="mt-3 text-sm font-black text-violet-200">
                  Ver perfil completo →
                </p>
              </button>

              <nav className="mt-5 space-y-2" aria-label="Menu principal">
                {[
                  {
                    icon: "👤",
                    label: "Perfil completo",
                    helper: "Nível, XP e conquistas",
                    action: onProfile,
                  },
                  {
                    icon: "🧭",
                    label: "Minha Jornada",
                    helper: journeyLabel,
                    action: onJourney,
                  },
                  {
                    icon: "🗺️",
                    label: "Trilhas Futuras",
                    helper: "Alfabetização, escola, concursos e mais",
                    action: onTracks,
                  },
                  {
                    icon: "🏆",
                    label: "Coleção de Insígnias",
                    helper: `${completedEmblemCount}/${totalEmblems} conquistadas`,
                    action: onEmblems,
                  },
                  {
                    icon: "🧪",
                    label: "Feedback Beta",
                    helper: "Enviar teste, erro ou sugestão",
                    action: onFeedback,
                  },
                  {
                    icon: "ℹ️",
                    label: "Sobre / Créditos",
                    helper: "Informações do projeto",
                    action: onAbout,
                  },
                  {
                    icon: "🔒",
                    label: "Privacidade",
                    helper: "Dados locais e segurança",
                    action: onPrivacy,
                  },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => openFromMenu(item.action)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-left transition hover:border-violet-400/50 hover:bg-slate-800/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-xl"
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>

                    <span className="min-w-0">
                      <span className="block truncate text-sm font-black text-white">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-slate-400">
                        {item.helper}
                      </span>
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="relative border-t border-slate-800 p-4 text-xs leading-relaxed text-slate-400">
              Arena do Saber Beta {APP_VERSION}
              <br />
              Progresso salvo neste dispositivo.
            </div>
          </aside>
        </div>
      )}
    </AppShell>
  );
}
