import { STORAGE_KEYS } from "../lib/storageKeys";
import { useEffect, useState } from "react";
import { PlayerProgress } from "../types/game";
import { LocalPlayerProfile } from "../types/playerProfile";
import { AppShell } from "../components/layout/AppShell";
import { Header } from "../components/layout/Header";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import {
  APP_BUILD_LABEL,
  APP_CHANNEL,
  APP_RELEASE_DATE,
  APP_VERSION,
} from "../lib/appVersion";
import {
  getLocalSettings,
  setHapticsEnabledPreference,
} from "../lib/localSettings";
import { vibrateTap } from "../lib/haptics";

interface SettingsPageProps {
  progress: PlayerProgress;
  profile: LocalPlayerProfile | null;
  onBack: () => void;
  onJourney: () => void;
  onBetaCenter: () => void;
  onPrivacy: () => void;
}


function getProfileLabel(profile: LocalPlayerProfile | null) {
  if (!profile) return "Jornada ainda não definida";

  if (profile.goal === "literacy") return `${profile.nickname} · Alfabetização`;
  if (profile.goal === "contest") return `${profile.nickname} · Concurso`;
  if (profile.goal === "school") return `${profile.nickname} · Escola`;

  return `${profile.nickname} · Conhecimentos gerais`;
}

export function SettingsPage({
  progress,
  profile,
  onBack,
  onJourney,
  onBetaCenter,
  onPrivacy,
}: SettingsPageProps) {
  const [hapticsEnabled, setHapticsEnabledState] = useState(true);

  useEffect(() => {
    setHapticsEnabledState(getLocalSettings().hapticsEnabled);
  }, []);

  function toggleHaptics() {
    const nextValue = !hapticsEnabled;
    setHapticsEnabledState(nextValue);
    setHapticsEnabledPreference(nextValue);

    if (nextValue) {
      vibrateTap();
    }
  }

  function resetOnboarding() {
    try {
      window.localStorage.removeItem(STORAGE_KEYS.ONBOARDING_SEEN);
      window.location.reload();
    } catch {
      // Se localStorage falhar, apenas mantém o app funcionando.
    }
  }

  return (
    <AppShell
      header={
        <Header
          progress={progress}
          title="Configurações"
          subtitle="Dados locais, jornada e beta"
          onBack={onBack}
        />
      }
    >
      <div className="space-y-4 pb-8">
        <Card className="p-4" glow>
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-2xl">
              ⚙️
            </div>

            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-wide text-violet-200">
                Ajustes locais
              </p>
              <h1 className="mt-1 text-xl font-black text-white">
                Configurações do Arena
              </h1>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">
                Nesta versão beta, as principais informações ficam salvas neste
                aparelho. Aqui você pode revisar sua jornada e ferramentas de teste.
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-violet-400/25 bg-violet-950/15 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-violet-200">
            Minha Jornada
          </p>
          <h2 className="mt-1 text-lg font-black text-white">
            {getProfileLabel(profile)}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            A jornada ajuda a Home e os botões principais a abrirem o caminho
            mais adequado para o jogador.
          </p>

          <Button className="mt-4" type="button" fullWidth onClick={onJourney}>
            Editar minha jornada
          </Button>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-black text-white">Sensação de jogo</h2>

          <button
            type="button"
            onClick={toggleHaptics}
            aria-pressed={hapticsEnabled}
            className="mt-3 flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-left transition hover:border-emerald-400/50 hover:bg-slate-800/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            <span>
              <span className="block text-sm font-black text-white">
                📳 Vibração do jogo
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-slate-400">
                Afeta toques, acertos, erros e conquistas no celular.
              </span>
            </span>

            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${
                hapticsEnabled
                  ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400/50"
                  : "bg-slate-800 text-slate-300 border border-slate-700"
              }`}
            >
              {hapticsEnabled ? "Ligada" : "Desligada"}
            </span>
          </button>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-black text-white">
            Ferramentas do beta
          </h2>

          <div className="mt-3 grid gap-2">
            <button
              type="button"
              onClick={onBetaCenter}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-left transition hover:border-emerald-400/50 hover:bg-slate-800/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              <span className="block text-sm font-black text-white">
                🧪 Abrir Centro do Beta
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-slate-400">
                Checklist de teste, modelo de feedback e informações da versão.
              </span>
            </button>

            <button
              type="button"
              onClick={resetOnboarding}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-left transition hover:border-violet-400/50 hover:bg-slate-800/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
            >
              <span className="block text-sm font-black text-white">
                ✨ Rever onboarding
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-slate-400">
                Apaga apenas o marcador do tutorial e recarrega a tela.
              </span>
            </button>

            <button
              type="button"
              onClick={onPrivacy}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-left transition hover:border-sky-400/50 hover:bg-slate-800/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              <span className="block text-sm font-black text-white">
                🔒 Privacidade
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-slate-400">
                Entenda quais dados ficam salvos localmente no app.
              </span>
            </button>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-black text-white">Versão do app</h2>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Versão
              </p>
              <p className="mt-1 text-sm font-black text-white">
                {APP_VERSION}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Build
              </p>
              <p className="mt-1 text-sm font-black text-white">
                {APP_BUILD_LABEL}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Canal
              </p>
              <p className="mt-1 text-sm font-black text-white">
                {APP_CHANNEL}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Data
              </p>
              <p className="mt-1 text-sm font-black text-white">
                {APP_RELEASE_DATE}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-emerald-400/25 bg-emerald-950/15 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-emerald-200">
            Dados locais
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            Progresso atual: Lv. {progress.level}, {progress.xp} XP,{" "}
            {progress.totalCorrect} acertos e {progress.completedEmblems.length}{" "}
            insígnias. Tudo isso fica salvo no dispositivo nesta versão beta.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
