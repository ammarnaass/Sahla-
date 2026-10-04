import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "danger" | "neutral" | "soon" | "free";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "neutral",
  size = "md",
  className = "",
}: BadgeProps) {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs font-medium",
    md: "px-2.5 py-1 text-xs font-semibold",
  };

  const variantStyles = {
    primary: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    success: "bg-teal-500/15 text-teal-300 border border-teal-500/30",
    warning: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
    danger: "bg-red-500/15 text-red-400 border border-red-500/30",
    neutral: "bg-slate-800 text-slate-300 border border-slate-700/60",
    soon: "bg-purple-500/15 text-purple-300 border border-purple-500/30",
    free: "bg-emerald-600 text-white font-bold shadow-xs",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full select-none transition-colors ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
