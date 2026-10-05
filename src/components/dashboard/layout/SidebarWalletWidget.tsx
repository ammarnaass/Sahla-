"use client";

import React from "react";
import { CardEpayIcon, BoltIcon, ArrowLeftIcon } from "@/components/ui/Icons";

interface SidebarWalletWidgetProps {
  points?: number;
  isCollapsed?: boolean;
  onOpenWallet?: () => void;
}

export function SidebarWalletWidget({
  points = 1250,
  isCollapsed = false,
  onOpenWallet,
}: SidebarWalletWidgetProps) {
  const dzdValue = (points * 2).toLocaleString("fr-DZ");

  if (isCollapsed) {
    return (
      <button
        type="button"
        onClick={onOpenWallet}
        title={`رصيد المحفظة: ${points.toLocaleString()} نقطة (~${dzdValue} دج)`}
        className="w-10 h-10 mx-auto rounded-xl bg-amber-500/10 dark:bg-gradient-to-br dark:from-amber-500/15 dark:via-emerald-500/10 dark:to-slate-900 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 hover:scale-105 transition-all cursor-pointer shadow-xs group"
      >
        <BoltIcon size={18} className="text-amber-600 dark:text-amber-400 group-hover:animate-pulse" />
      </button>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border border-slate-200 dark:border-slate-800/90 p-3.5 shadow-xs dark:shadow-sm group hover:border-emerald-500/30 transition-all">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">رصيد الكاونتر المتاح</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-extrabold border border-amber-500/25">
            نشط
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-baseline gap-1">
              <span>{points.toLocaleString()}</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">نقطة</span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              يعادل: <span className="text-slate-800 dark:text-slate-300 font-bold">{dzdValue} دج</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenWallet}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-[11px] font-bold shadow-sm shadow-emerald-900/30 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
          >
            <BoltIcon size={13} className="text-white" />
            <span>شحن سريع</span>
          </button>
        </div>

        {/* Quick action bar */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
          <button
            type="button"
            onClick={onOpenWallet}
            className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer font-medium"
          >
            <CardEpayIcon size={12} className="text-slate-400" />
            <span>كروت الخدش CIB/الذهبية</span>
          </button>
          <ArrowLeftIcon size={12} className="text-slate-400 dark:text-slate-500" />
        </div>
      </div>
    </div>
  );
}
