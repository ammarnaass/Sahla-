"use client";

import React from "react";

interface DailySummaryProps {
  docsCount: number;
  pointsUsed: number;
  estimatedProfitDZD: number;
}

export function DailySummary({
  docsCount,
  pointsUsed,
  estimatedProfitDZD,
}: DailySummaryProps) {
  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-right space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>📊</span>
          <span>ملخص النشاط اليومي</span>
        </h3>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          {new Date().toLocaleDateString("ar-DZ", {
            weekday: "long",
            day: "numeric",
            month: "short",
          })}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Metric 1: Today Docs */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-center">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">وثائق اليوم</span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
            {docsCount}
          </span>
        </div>

        {/* Metric 2: Points Used */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-center">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">نقاط مستهلكة</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {pointsUsed}
          </span>
        </div>

        {/* Metric 3: Estimated Profit */}
        <div className="p-3 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/25 text-center">
          <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-bold block mb-1">الربح التقديري</span>
          <span className="text-lg sm:text-xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
            +{estimatedProfitDZD.toLocaleString()} <span className="text-xs">دج</span>
          </span>
        </div>
      </div>
    </div>
  );
}
