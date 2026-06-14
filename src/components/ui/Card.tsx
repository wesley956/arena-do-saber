import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glow?: boolean;
  variant?: "default" | "dark" | "glass";
}

export function Card({
  children,
  className = "",
  onClick,
  glow = false,
  variant = "default",
}: CardProps) {
  const base = "min-w-0 break-words rounded-2xl border transition-all duration-200";
  const variants = {
    default: "bg-slate-800/80 border-slate-700/60 backdrop-blur-sm",
    dark: "bg-slate-900/90 border-slate-700/40",
    glass: "bg-white/5 border-white/10 backdrop-blur-md",
  };
  const glowClass = glow ? "shadow-lg shadow-violet-900/30" : "";
  const clickableClass = onClick
    ? "cursor-pointer hover:border-violet-500/60 hover:bg-slate-700/80 active:scale-[0.99] focus-within:ring-2 focus-within:ring-violet-300"
    : "";

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!onClick) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  }

  return (
    <div
      className={`${base} ${variants[variant]} ${glowClass} ${clickableClass} ${className}`}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
