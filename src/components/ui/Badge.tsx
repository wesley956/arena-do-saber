import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "danger" | "warning" | "info" | "purple";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "sm",
  className = "",
}: BadgeProps) {
  const variants = {
    default: "bg-slate-700 text-slate-200 border-slate-600",
    success: "bg-emerald-900/60 text-emerald-300 border-emerald-700",
    danger: "bg-red-900/60 text-red-300 border-red-700",
    warning: "bg-amber-900/60 text-amber-300 border-amber-700",
    info: "bg-blue-900/60 text-blue-300 border-blue-700",
    purple: "bg-violet-900/60 text-violet-300 border-violet-700",
  };

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}
