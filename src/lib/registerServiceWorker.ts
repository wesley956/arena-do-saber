export function registerServiceWorker() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "[::1]";

  if (isLocalhost) return;

  window.addEventListener("load", () => {
    try {
      void navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => undefined);
    } catch {
      // Registro opcional: se o navegador bloquear, o app continua funcionando normalmente.
    }
  });
}
