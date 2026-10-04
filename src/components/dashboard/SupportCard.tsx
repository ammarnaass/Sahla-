"use client";

import React from "react";

export function SupportCard() {
  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/20 text-right flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          💬
        </span>
        <div>
          <h4 className="text-xs font-bold text-white">هل تواجه أي صعوبة أو استفسار؟</h4>
          <p className="text-[11px] text-slate-400">فريق الدعم الفني جاهز لمساعدتك عبر واتساب</p>
        </div>
      </div>

      <a
        href="https://wa.me/213555000000"
        target="_blank"
        rel="noreferrer"
        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shrink-0 shadow-sm"
      >
        محادثة واتساب
      </a>
    </div>
  );
}
