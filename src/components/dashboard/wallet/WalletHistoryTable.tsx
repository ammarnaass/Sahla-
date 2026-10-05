"use client";

import React from "react";
import type { LedgerItem } from "@/components/dashboard/WalletTab";

interface WalletHistoryTableProps {
  ledger: LedgerItem[];
}

export function WalletHistoryTable({ ledger }: WalletHistoryTableProps) {
  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-white">سجل حركات الرصيد (Ledger) 📜</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            سجل دقيق ومحمي لكل عمليات الشحن والاستهلاك بالمحل
          </p>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
          {ledger.length} حركة
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-right">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="py-2.5 px-3">البيان / الخدمة</th>
              <th className="py-2.5 px-3">النوع</th>
              <th className="py-2.5 px-3">تغير النقاط</th>
              <th className="py-2.5 px-3">الرصيد بعدها</th>
              <th className="py-2.5 px-3">الوقت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {ledger.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  لا توجد حركات مسجلة حتى الآن
                </td>
              </tr>
            ) : (
              ledger.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 text-white font-bold">{item.description}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.type === "CREDIT"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {item.type === "CREDIT" ? "إيداع / شحن" : "استهلاك خدمة"}
                    </span>
                  </td>
                  <td
                    className={`py-3 px-3 font-mono font-bold ${
                      item.pointsDelta > 0 ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {item.pointsDelta > 0 ? `+${item.pointsDelta}` : item.pointsDelta}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    {item.balanceAfter} نقطة
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                    {new Date(item.createdAt).toLocaleTimeString("ar-DZ", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
