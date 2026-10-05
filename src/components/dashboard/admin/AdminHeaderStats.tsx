"use client";

import React from "react";

interface AdminHeaderStatsProps {
  totalShops: number;
  activeCount: number;
  totalPoints: number;
  totalDocs: number;
}

export function AdminHeaderStats({
  totalShops,
  activeCount,
  totalPoints,
  totalDocs,
}: AdminHeaderStatsProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold">
              👑 لوحة مدير النظام الوطني (SUPER_ADMIN)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display mt-1">
            إدارة شبكة المحلات عبر الـ 58 ولاية 🇩🇿
          </h2>
          <p className="text-xs text-slate-400">
            مراقبة العمليات الوطنية، الشحن الإداري، وتفعيل أو تجميد اشتراكات المحلات
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 font-bold mb-1">إجمالي المحلات</div>
          <div className="text-3xl font-black text-amber-400 font-mono">{totalShops}</div>
          <div className="text-[10px] text-slate-500 mt-1">محل مسجل وطنياً</div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 font-bold mb-1">المحلات النشطة</div>
          <div className="text-3xl font-black text-emerald-400 font-mono">{activeCount}</div>
          <div className="text-[10px] text-slate-500 mt-1">نشطة وجاهزة للخدمة</div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 font-bold mb-1">النقاط المتداولة</div>
          <div className="text-3xl font-black text-blue-400 font-mono">
            {totalPoints.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">نقطة في خزائن المحلات</div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 font-bold mb-1">إجمالي الوثائق الوطنية</div>
          <div className="text-3xl font-black text-purple-400 font-mono">
            {totalDocs.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">وثيقة منجزة للزبائن</div>
        </div>
      </div>
    </div>
  );
}
