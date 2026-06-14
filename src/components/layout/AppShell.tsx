import { ReactNode } from "react";
import { ArenaAmbientBackground } from "../effects/ArenaAmbientBackground";

interface AppShellProps {
  children: ReactNode;
  header?: ReactNode;
}

export function AppShell({ children, header }: AppShellProps) {
  return (
    <div className="theme-app-bg min-h-screen min-h-dvh bg-slate-950 flex flex-col">
      {/* Background decoration */}
      <div className="theme-bg-decoration fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-900/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-900/20 rounded-full blur-3xl" />
        <ArenaAmbientBackground />
      </div>

      {header && (
        <div className="theme-header safe-top sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/60">
          {header}
        </div>
      )}

      <main className="theme-page safe-bottom page-enter flex-1 relative z-10 w-full max-w-lg mx-auto px-4 py-4 pb-8">
        {children}
      </main>
    </div>
  );
}
