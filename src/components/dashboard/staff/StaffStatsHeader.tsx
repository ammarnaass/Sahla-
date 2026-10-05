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
          <h2 className="text-xl sm:text-2xl font-black text-white font-display">
            إعدادات المحل وإدارة الموظفين (RBAC) 🏢
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            تخصيص بيانات المحل الرسمية وإدارة طاقم العمل وتفويض صلاحيات الكاونتر والطباعة
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 font-bold">
            طاقم العمل: {staffCount} موظف
          </span>
        </div>
      </div>
    </div>
  );
}
