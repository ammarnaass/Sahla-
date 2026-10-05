"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

interface CelebrationScreenProps {
  docTitle: string;
  defaultSalePrice?: number;
  onFinish: (savedPrice: number) => void;
}

export function CelebrationScreen({
  docTitle,
  defaultSalePrice = 200,
  onFinish,
}: CelebrationScreenProps) {
  const [salePrice, setSalePrice] = useState(defaultSalePrice);

  return (
    <div className="space-y-6 max-w-lg mx-auto py-6 text-center">
      {/* Celebration Icon */}
      <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-4xl mx-auto border border-emerald-500/30 animate-pulse">
        🎯
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          إنجاز رائع!
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          أول وثيقة جاهزة في أقل من دقيقة!
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          تم إنشاء «{docTitle}» بنجاح وتم خصم 10 نقاط تجريبية فقط.
        </p>
      </div>

      {/* Suggested Sale Price Box */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-right space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 dark:text-white">كم ستبيع هذه الوثيقة لزبونك؟</span>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">تحديد سعر البيع الافتراضي</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="number"
              step="50"
              min="50"
              max="2000"
              value={salePrice}
              onChange={(e) => setSalePrice(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 dark:text-white font-mono focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 dark:text-slate-400">
              دج
            </span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center shrink-0">
            <span className="text-[10px] text-slate-600 dark:text-slate-400 block">ربحك الصافي:</span>
            <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">
              +{(salePrice - 30).toLocaleString()} دج
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
          💡 سيتم استخدام هذا السعر لحساب أرباح محلك اليومية والشهرية تلقائياً في الشاشة الرئيسية.
        </p>
      </div>

      {/* Continue Action */}
      <Button
        variant="primary"
        size="lg"
        onClick={() => onFinish(salePrice)}
        className="w-full font-bold shadow-lg shadow-emerald-500/20"
      >
        <span>حفظ السعر والدخول إلى الشاشة الرئيسية</span>
        <svg className="w-5 h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Button>
    </div>
  );
}
