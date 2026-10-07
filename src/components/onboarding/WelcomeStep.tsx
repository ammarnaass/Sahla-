"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface WelcomeStepProps {
  shopName: string;
  points: number;
  onNext: () => void;
  onSkip: () => void;
}

export function WelcomeStep({ shopName, points, onNext, onSkip }: WelcomeStepProps) {
  return (
    <div className="text-center space-y-6 max-w-lg mx-auto py-6">
      {/* Animated Welcome Badge */}
      <div className="relative inline-flex items-center justify-center">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-4xl shadow-xl shadow-emerald-600/30 animate-bounce">
          🎉
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          تم إنشاء الحساب بنجاح 🇩🇿
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          أهلاً بك في سهلة، {shopName}!
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
          نحن هنا لمساعدتك على مضاعفة أرباح محلك وتسريع خدمة زبائنك بدون برامج معقدة.
        </p>
      </div>

      {/* Gift Box Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-emerald-500/30 dark:border-emerald-500/40 shadow-xl relative overflow-hidden">
        <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">هدية الانضمام الخاصة بك</div>
        <div className="text-4xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400 font-mono my-2 flex items-center justify-center gap-2">
          <span>+{points}</span>
          <span className="text-lg font-bold text-slate-700 dark:text-slate-300">نقطة مجانية</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          تكفي لإنجاز <strong className="text-slate-900 dark:text-white font-extrabold">2 إلى 3 وثائق رسمية كاملة</strong> لزبائنك مجاناً وبدء جني الأرباح فوراً!
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-2">
        <Button
          variant="primary"
          size="lg"
          onClick={onNext}
          className="w-full text-base font-bold shadow-lg shadow-emerald-500/20"
        >
          <span>تخصيص خدمات محلي (خطوة 2 من 3)</span>
          <svg className="w-5 h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Button>

        <button
          type="button"
          onClick={onSkip}
          className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors py-2 cursor-pointer"
        >
          تخطي والذهاب إلى الشاشة الرئيسية مباشرة →
        </button>
      </div>
    </div>
  );
}
