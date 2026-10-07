"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ui/ThemeProvider";

interface ThemeToggleProps {
  variant?: "icon" | "button" | "chip";
  className?: string;
  showText?: boolean;
}

export function ThemeToggle({
  variant = "icon",
  className = "",
  showText = false,
}: ThemeToggleProps) {
  const { isDark, toggleTheme, mounted } = useTheme();

  // Prevent SSR flash / hydration mismatch
  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-xl border border-border bg-background/50 flex items-center justify-center text-muted-foreground opacity-60 ${className}`}
        aria-hidden="true"
      >
        <span className="w-4 h-4" />
      </div>
    );
  }

  if (variant === "button" || showText) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? "تبديل إلى الوضع المشرق (النهاري)" : "تبديل إلى الوضع المظلم (الليلي)"}
        className={`flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 border border-border bg-card hover:bg-muted/60 text-foreground cursor-pointer shadow-sm ${className}`}
      >
        <div className="flex items-center gap-2">
          {isDark ? (
            <Sun size={16} className="text-amber-400 shrink-0 transition-transform hover:rotate-45" />
          ) : (
            <Moon size={16} className="text-slate-700 dark:text-slate-300 shrink-0 transition-transform hover:-rotate-12" />
          )}
          <span className="font-cairo">المظهر</span>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            isDark
              ? "bg-slate-800 text-amber-300 border border-slate-700"
              : "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"
          }`}
        >
          {isDark ? "ليلي 🌙" : "نهاري ☀️"}
        </span>
      </button>
    );
  }

  if (variant === "chip") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? "تبديل إلى الوضع المشرق" : "تبديل إلى الوضع المظلم"}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all border border-border bg-muted/40 hover:bg-muted text-foreground cursor-pointer ${className}`}
      >
        {isDark ? (
          <>
            <Sun size={14} className="text-amber-400" />
            <span className="text-[11px] font-cairo">نهاري</span>
          </>
        ) : (
          <>
            <Moon size={14} className="text-slate-600" />
            <span className="text-[11px] font-cairo">ليلي</span>
          </>
        )}
      </button>
    );
  }

  // Default "icon" variant
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "تبديل إلى الوضع المشرق (النهاري)" : "تبديل إلى الوضع المظلم (الليلي)"}
      title={isDark ? "تبديل إلى الوضع المشرق (النهاري)" : "تبديل إلى الوضع المظلم (الليلي)"}
      className={`w-9 h-9 rounded-xl border border-border bg-card/80 hover:bg-muted/80 text-foreground flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95 ${className}`}
    >
      {isDark ? (
        <Sun size={18} className="text-amber-400 transition-transform duration-300 hover:rotate-90" />
      ) : (
        <Moon size={18} className="text-slate-700 dark:text-slate-300 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}
