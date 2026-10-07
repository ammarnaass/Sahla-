"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { useTheme } from "@/components/ui/ThemeProvider";

export function OnboardingClientView() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? (resolvedTheme || theme || "dark") : "dark";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      {/* Top Simple Header */}
      <header className="border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md py-4 px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
            سـ
          </div>
          <span className="font-extrabold text-slate-900 dark:text-white text-lg">سهلة · Sahla</span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="تبديل الوضع الليلي والنهاري"
          >
            {currentTheme === "light" ? (
              <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            🇩🇿 إعداد أول زيارة
          </span>
        </div>
      </header>

      {/* Main Flow Content */}
      <main className="flex-1 flex items-center justify-center">
        <OnboardingFlow />
      </main>

      {/* Simple Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-900">
        سهلة · المنصة الرقمية لأصحاب المحلات في الجزائر
      </footer>
    </div>
  );
}
