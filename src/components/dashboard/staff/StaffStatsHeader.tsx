"use client";

import React from "react";

interface StaffStatsHeaderProps {
  staffCount: number;
}

export function StaffStatsHeader({ staffCount }: StaffStatsHeaderProps) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
            إعدادات المحل وإدارة الموظفين (RBAC) 🏢
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            تخصيص بيانات المحل الرسمية وإدارة طاقم العمل وتفويض صلاحيات الكاونتر والطباعة
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold shadow-sm transition-colors">
            طاقم العمل: {staffCount} موظف
          </span>
        </div>
      </div>
    </div>
  );
}
