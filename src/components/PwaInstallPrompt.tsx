import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

function isRunningStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as NavigatorWithStandalone).standalone === true
  );
}

export function PwaInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    setIsInstalled(isRunningStandalone());

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    }

    function handleAppInstalled() {
      setIsInstalled(true);
      setInstallPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  if (isInstalled || !installPrompt) return null;

  async function handleInstallClick() {
    const promptEvent = installPrompt;

    if (!promptEvent) return;

    setInstallPrompt(null);

    try {
      await promptEvent.prompt();
      await promptEvent.userChoice;
    } catch {
      setInstallPrompt(promptEvent);
    }
  }

  return (
    <button
      type="button"
      onClick={handleInstallClick}
      className="fixed bottom-4 right-4 z-50 rounded-2xl border border-white/20 bg-violet-700 px-4 py-3 text-sm font-bold text-white shadow-2xl shadow-violet-950/40 transition hover:scale-[1.02] hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-300"
      aria-label="Instalar Arena do Saber como aplicativo"
    >
      📲 Instalar app
    </button>
  );
}
