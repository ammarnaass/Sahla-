"use client";

import React from "react";
import Link from "next/link";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Simple Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 py-4 px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
            سـ
          </div>
          <span className="font-extrabold text-white text-lg">سهلة · Sahla</span>
        </Link>
        <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          🇩🇿 إعداد أول زيارة
        </span>
      </header>

      {/* Main Flow Content */}
      <main className="flex-1 flex items-center justify-center">
        <OnboardingFlow />
      </main>

      {/* Simple Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-900">
        سهلة · المنصة الرقمية لأصحاب المحلات في الجزائر
      </footer>
    </div>
  );
}
