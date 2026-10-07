"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface ZeroBalanceBannerProps {
  onTopUp: () => void;
}

export function ZeroBalanceBanner({ onTopUp }: ZeroBalanceBannerProps) {
  return (
    <div className="bg-red-600/95 text-white px-4 py-2.5 flex items-center justify-between gap-3 text-xs font-bold shadow-lg animate-in slide-in-from-top">
      <div className="flex items-center gap-2">
        <span className="text-base">⚠️</span>
        <span>
          نفد رصيد نقاطك (0 نقطة)! الخدمات المدفوعة متوقفة مؤقتاً. الأدوات المجانية لا تزال متاحة.
        </span>
      </div>

      <button
        onClick={onTopUp}
        className="px-3.5 py-1 bg-white text-red-600 rounded-lg font-extrabold hover:bg-slate-100 transition-colors shadow-xs shrink-0"
      >
        اشحن الآن
      </button>
    </div>
  );
}
