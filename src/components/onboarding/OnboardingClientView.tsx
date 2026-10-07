"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function OnboardingClientView() {
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
          <ThemeToggle variant="icon" />
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
