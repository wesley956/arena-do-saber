import { ReactNode } from "react";
import { Card } from "../ui/Card";

type SummaryMetricTone = "success" | "danger" | "warning" | "info" | "neutral";

interface SummaryMetric {
  icon: string;
  label: string;
  value: ReactNode;
  tone?: SummaryMetricTone;
}

interface SessionSummaryProps {
  icon: string;
  title: string;
  message: string;
  metrics: SummaryMetric[];
  tip?: string;
  children?: ReactNode;
}

const toneClasses: Record<SummaryMetricTone, string> = {
  success: "text-emerald-300 border-emerald-500/30 bg-emerald-950/25",
  danger: "text-red-300 border-red-500/30 bg-red-950/25",
  warning: "text-amber-300 border-amber-500/30 bg-amber-950/25",
  info: "text-sky-300 border-sky-500/30 bg-sky-950/25",
  neutral: "text-slate-200 border-slate-700 bg-slate-900/60",
};

export function SessionSummary({
  icon,
  title,
  message,
  metrics,
  tip,
  children,
}: SessionSummaryProps) {
  return (
    <Card className="p-5 text-center" glow>
      <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-3xl border border-violet-400/30 bg-violet-500/15 text-5xl shadow-xl shadow-violet-950/30">
        {icon}
      </div>

      <h2 className="text-2xl font-black text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-300">
        {message}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className={`rounded-2xl border p-3 ${toneClasses[metric.tone ?? "neutral"]}`}
          >
            <div className="text-2xl">{metric.icon}</div>
            <div className="mt-1 text-2xl font-black">{metric.value}</div>
            <div className="mt-0.5 text-xs font-bold text-slate-400">
              {metric.label}
            </div>
          </div>
        ))}
      </div>

      {tip && (
        <div className="mt-4 rounded-2xl border border-sky-500/30 bg-sky-950/20 p-3 text-left text-sm leading-relaxed text-sky-100">
          <span className="font-black">Próximo passo:</span> {tip}
        </div>
      )}

      {children && <div className="mt-5 flex flex-col gap-3">{children}</div>}
    </Card>
  );
}
