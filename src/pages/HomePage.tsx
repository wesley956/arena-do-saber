import { PlayerProgress } from "../types/game";
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
  onPlay: () => void;
  onSolo: () => void;
  onReview: () => void;
  onProfile: () => void;
  onEmblems: () => void;
  onFeedback: () => void;
  onDuel: () => void;
  onStudyMap: () => void;
  onAbout: () => void;
  onPrivacy: () => void;
}

export function HomePage({
  progress,
  onPlay,
  onSolo,
  onReview,
  onProfile,
  onEmblems,
  onFeedback,
  onDuel,
  onStudyMap,
  onAbout,
  onPrivacy,
}: HomePageProps) {
  const xpInLevel = xpProgressInLevel(progress.xp);
  const toNext = xpToNextLevel(progress.xp);
  const accuracy = getAccuracyRate(progress);
  const hasErrors = progress.wrongQuestionIds.length > 0;
  const completedEmblemSet = new Set(progress.completedEmblems);
  const completedEmblemCount = progress.completedEmblems.length;
  const totalEmblems = ALL_CATEGORIES.length;
  const emblemPreview = ALL_CATEGORIES.slice(0, 4);

  return (
    <AppShell>
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-3 pb-8 pt-4 sm:px-4">
        <section className="text-center">
          <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-700 text-4xl shadow-xl shadow-violet-950/40">
            ⚔️
          </div>
          <p className="mb-2 inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-200">
            Versão Beta · Progresso salvo neste dispositivo
          </p>
          <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl">
            Arena do Saber
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Estude, compita e conquiste insígnias em um quiz educacional com
            roleta, desafios e treino inteligente.
          </p>
        </section>

        <Card className="p-4 sm:p-5" glow>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-2xl">
                🧑‍🎓
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-lg font-black text-white">
                  Estudante Lv. {progress.level}
                </h2>
                <p className="text-sm text-slate-300">
                  ⚡ {progress.xp} XP · {toNext} XP para Lv. {progress.level + 1}
                </p>
              </div>
            </div>
            <Button variant="secondary" onClick={onProfile}>
              Ver perfil →
            </Button>
          </div>

          <div className="mt-4">
            <ProgressBar
              value={xpInLevel}
              max={Math.max(xpInLevel + toNext, 1)}
              label="Progresso de nível"
              showLabel
            />
          </div>
        </Card>

        <section className="grid gap-3 sm:grid-cols-3">
          <Card className="p-4 text-center">
            <p className="text-2xl font-black text-emerald-300">
              {progress.totalCorrect}
            </p>
            <p className="text-sm text-slate-400">Acertos</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-black text-violet-300">{accuracy}%</p>
            <p className="text-sm text-slate-400">Precisão</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-black text-amber-300">
              {progress.completedEmblems.length}
            </p>
            <p className="text-sm text-slate-400">Insígnias</p>
          </Card>
        </section>

        <section className="grid gap-3 md:grid-cols-2">
          <Card className="p-5">
            <h2 className="text-xl font-black leading-tight text-white">
              🎡 Partida Clássica
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Gire a roleta, avance nas categorias, libere desafios e conquiste
              as 6 Insígnias de Sabedoria.
            </p>
            <Button className="mt-4" fullWidth size="lg" onClick={onPlay}>
              Jogar Agora
            </Button>
          </Card>

          <Card className="p-5">
            <h2 className="text-xl font-black leading-tight text-white">
              🎯 Treino Solo
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Estude sem pressão por matéria. O ciclo de perguntas reduz
              repetições e lembra seu histórico local.
            </p>
            <Button
              className="mt-4"
              fullWidth
              variant="secondary"
              size="lg"
              onClick={onSolo}
            >
              Treinar Agora
            </Button>
          </Card>
        </section>

        <section className="grid grid-cols-2 gap-3">
          {[
            {
              icon: "🗺️",
              title: "Mapa",
              helper: "Progresso por matéria",
              action: onStudyMap,
              tone: "border-indigo-400/40 bg-indigo-950/25 text-indigo-100",
            },
            {
              icon: "⚡",
              title: "Duelo",
              helper: "Partida local rápida",
              action: onDuel,
              tone: "border-amber-400/40 bg-amber-950/20 text-amber-100",
            },
            {
              icon: "📘",
              title: hasErrors ? "Revisar" : "Revisão",
              helper: hasErrors
                ? `${progress.wrongQuestionIds.length} erro(s) salvo(s)`
                : "Sem erros pendentes",
              action: onReview,
              tone: "border-rose-400/40 bg-rose-950/20 text-rose-100",
            },
            {
              icon: "🏆",
              title: "Perfil",
              helper: "Nível e conquistas",
              action: onProfile,
              tone: "border-violet-400/40 bg-violet-950/25 text-violet-100",
            },
          ].map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={item.action}
              className={`min-h-[92px] rounded-2xl border p-3 text-left shadow-lg shadow-slate-950/20 transition-all hover:-translate-y-0.5 hover:bg-slate-800/70 focus:outline-none focus:ring-2 focus:ring-violet-300/70 focus:ring-offset-2 focus:ring-offset-slate-950 ${item.tone}`}
            >
              <span className="text-2xl" aria-hidden="true">
                {item.icon}
              </span>
              <span className="mt-2 block text-base font-black leading-tight">
                {item.title}
              </span>
              <span className="mt-1 block text-xs leading-snug text-slate-300">
                {item.helper}
              </span>
            </button>
          ))}
        </section>

        <Card className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-wide text-amber-200">
                Coleção de Insígnias
              </p>
              <h2 className="mt-1 text-lg font-black text-white">
                {completedEmblemCount}/{totalEmblems} conquistadas
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">
                Veja todas as insígnias bloqueadas e conquistadas em uma área própria.
              </p>
            </div>

            <Button variant="secondary" onClick={onEmblems}>
              Ver coleção →
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {emblemPreview.map((category) => {
              const earned = completedEmblemSet.has(category.id);

              return (
                <span
                  key={category.id}
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl border text-lg ${
                    earned
                      ? `${category.borderClass} ${category.bgClass} text-white`
                      : "border-slate-700 bg-slate-900 text-slate-400"
                  }`}
                  title={category.emblemName}
                >
                  {earned ? category.icon : "🔒"}
                </span>
              );
            })}

            <span className="flex h-10 items-center rounded-2xl border border-slate-700 bg-slate-900 px-3 text-xs font-black text-slate-300">
              +{Math.max(totalEmblems - emblemPreview.length, 0)}
            </span>
          </div>
        </Card>

        <footer className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-center text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="leading-relaxed">
            Arena do Saber Beta {APP_VERSION} · Escola + Concurso · PWA/APK preparado
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={onAbout}
              className="rounded-full px-3 py-2 font-bold text-slate-300 underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
            >
              Sobre
            </button>
            <button
              type="button"
              onClick={onFeedback}
              className="rounded-full px-3 py-2 font-bold text-emerald-200 underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              Feedback Beta
            </button>
            <button
              type="button"
              onClick={onPrivacy}
              className="rounded-full px-3 py-2 font-bold text-slate-300 underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
            >
              Privacidade
            </button>
          </div>
        </footer>
      </main>
    </AppShell>
  );
}
