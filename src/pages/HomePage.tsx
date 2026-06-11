import { PlayerProgress } from "../types/game";
import { AppShell } from "../components/layout/AppShell";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ProgressBar } from "../components/game/ProgressBar";
import { xpProgressInLevel, xpToNextLevel } from "../lib/xp";
import { getAccuracyRate } from "../lib/stats";

interface HomePageProps {
  progress: PlayerProgress;
  onPlay: () => void;
  onSolo: () => void;
  onReview: () => void;
  onProfile: () => void;
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
  onDuel,
  onStudyMap,
  onAbout,
  onPrivacy,
}: HomePageProps) {
  const xpInLevel = xpProgressInLevel(progress.xp);
  const toNext = xpToNextLevel(progress.xp);
  const accuracy = getAccuracyRate(progress);
  const hasErrors = progress.wrongQuestionIds.length > 0;

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

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-indigo-400/40 bg-indigo-950/30 p-3 shadow-lg shadow-indigo-950/20">
            <div className="mb-2 flex items-start gap-2">
              <span className="text-xl" aria-hidden="true">🗺️</span>
              <div className="min-w-0">
                <p className="text-sm font-black text-indigo-100">
                  Mapa de Estudos
                </p>
                <p className="text-xs leading-snug text-slate-300">
                  Veja seu progresso por matéria e escolha onde treinar.
                </p>
              </div>
            </div>
            <Button variant="secondary" onClick={onStudyMap} fullWidth>
              Abrir Mapa de Estudos
            </Button>
          </div>
          <Button variant="secondary" onClick={onDuel} fullWidth>
            ⚡ Duelo Rápido Local
          </Button>
          <Button variant="ghost" onClick={onReview} fullWidth>
            {hasErrors
              ? `Revisar Erros (${progress.wrongQuestionIds.length})`
              : "Revisão dos Erros"}
          </Button>
          <Button variant="ghost" onClick={onProfile} fullWidth>
            🏆 Perfil / Conquistas
          </Button>
        </section>

        {progress.completedEmblems.length > 0 && (
          <Card className="p-4">
            <h2 className="mb-3 text-lg font-black text-white">
              Suas Insígnias
            </h2>
            <div className="flex flex-wrap gap-2">
              {progress.completedEmblems.map((id) => (
                <span
                  key={id}
                  className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-200"
                >
                  {id.split("-").slice(1).join(" ")}
                </span>
              ))}
            </div>
          </Card>
        )}

        <footer className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-center text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="leading-relaxed">
            Arena do Saber Beta · Escola + Concurso · PWA/APK preparado
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
