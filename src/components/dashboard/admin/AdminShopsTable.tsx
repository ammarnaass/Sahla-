"use client";

import React from "react";
import type { NationalShop } from "@/hooks/dashboard/useSuperAdminMetrics";

interface AdminShopsTableProps {
  shops: NationalShop[];
  search: string;
  onSearchChange: (v: string) => void;
  onTopup: (id: string, name: string) => void;
  onToggleStatus: (id: string) => void;
}

export function AdminShopsTable({
  shops,
  search,
  onSearchChange,
  onTopup,
  onToggleStatus,
}: AdminShopsTableProps) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">دليل المحلات والكيوسكات المعتمدة</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">البحث والتحكم في إعدادات وشحن كل محل</p>
        </div>

        <div className="w-full sm:max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="بحث باسم المحل، الولاية، أو الهاتف..."
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold bg-slate-50 dark:bg-slate-950/40">
              <th className="py-3.5 px-4">اسم المحل</th>
              <th className="py-3.5 px-4">المسؤول والولاية</th>
              <th className="py-3.5 px-4">رقم الهاتف</th>
              <th className="py-3.5 px-4">الرصيد المتاح</th>
              <th className="py-3.5 px-4">الحالة</th>
              <th className="py-3.5 px-4 text-center">إجراءات الإدارة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {shops.map((shop) => (
              <tr key={shop.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{shop.name}</td>
                <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                  <div>{shop.owner}</div>
                  <div className="text-[10px] text-slate-500">
                    ولاية {shop.wilaya} ({shop.wilayaCode.toString().padStart(2, "0")})
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono text-emerald-600 dark:text-emerald-400" dir="ltr">
                  {shop.phone}
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                  {shop.points} نقطة
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      shop.isActive
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20"
                        : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500/20"
                    }`}
                  >
                    {shop.isActive ? "نشط" : "مجمّد"}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onTopup(shop.id, shop.name)}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors text-[11px] font-bold cursor-pointer"
                      title="شحن إداري استثنائي"
                    >
                      +50 نقطة ⚡
                    </button>
                    <button
                      onClick={() => onToggleStatus(shop.id)}
                      className={`px-2.5 py-1 rounded-lg transition-colors text-[11px] font-bold border cursor-pointer ${
                        shop.isActive
                          ? "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-300 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20"
                          : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
                      }`}
                    >
                      {shop.isActive ? "تجميد" : "تنشيط"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {shops.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  لا توجد محلات مطابقة لمعايير البحث
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
