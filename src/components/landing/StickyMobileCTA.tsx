"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/Button";

interface StickyMobileCTAProps {
  onStartFree: () => void;
}

export function StickyMobileCTA({ onStartFree }: StickyMobileCTAProps) {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 p-3 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 md:hidden flex items-center justify-between gap-3 shadow-xl safe-bottom transition-colors">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <span>ابدأ الآن مجاناً</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-extrabold border border-emerald-500/30">
            50 نقطة هدية
          </span>
        </span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400">بدون اشتراك · بدون بطاقة</span>
      </div>

      <Button
        variant="primary"
        size="sm"
        onClick={onStartFree}
        className="px-5 font-bold shadow-md shadow-emerald-900/30 shrink-0"
      >
        <span>{t("common.startFree")}</span>
        <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Button>
    </div>
  );
}
