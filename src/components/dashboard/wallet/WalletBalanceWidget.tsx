"use client";

import React from "react";

interface WalletBalanceWidgetProps {
  points: number;
}

export function WalletBalanceWidget({ points }: WalletBalanceWidgetProps) {
  return (
    <div className="lg:col-span-1 p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:from-emerald-950/50 dark:via-slate-900 dark:to-slate-900 border border-emerald-500/30 dark:border-emerald-500/40 relative overflow-hidden shadow-xl flex flex-col justify-between transition-colors">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
            رصيد المحل المتاح
          </span>
          <span className="text-2xl">🪙</span>
        </div>

        <div>
          <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
            {points}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-semibold">
            نقطة صالحة لكافة الخدمات والمستندات
          </div>
        </div>

        <div className="p-3 bg-white/80 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between shadow-xs">
          <span>القيمة التقديرية للأرباح:</span>
          <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">
            {(points * 20).toLocaleString()} دج
          </span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
        <span>الخصم ذري (Atomic) بعد نجاح التوليد فقط</span>
      </div>
    </div>
  );
}
