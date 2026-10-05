"use client";

import React from "react";
import type { ServiceDefinition } from "@/lib/constants";
import { getServiceIcon, AlertTriangleIcon } from "@/components/ui/Icons";

interface StudioHeaderProps {
  service: ServiceDefinition;
  points: number;
  pointsCost?: number;
  isInsufficient: boolean;
}

export function StudioHeader({ service, points, pointsCost, isInsufficient }: StudioHeaderProps) {
  const effectiveCost = pointsCost !== undefined ? pointsCost : service.pointsCost;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center shrink-0">
            {getServiceIcon(service.code, 20)}
          </div>
          <div>
            <div className="text-sm font-bold text-white">{service.nameAr}</div>
            <div className="text-[11px] text-slate-400">
              {service.isFree ? "خدمة مجانية بالكامل" : `تكلفة التوليد: ${effectiveCost} نقطة`}
            </div>
          </div>
        </div>

        <div className="text-left font-mono">
          <div className="text-[10px] text-slate-400 font-sans">رصيدك الحالي</div>
          <div
            className={`text-base font-extrabold ${
              isInsufficient ? "text-rose-400" : "text-emerald-400"
            }`}
          >
            {points} نقطة
          </div>
        </div>
      </div>

      {isInsufficient && (
        <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-300 font-semibold flex items-center gap-2 animate-pulse">
          <AlertTriangleIcon className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            رصيدك الحالي ({points} نقطة) أقل من تكلفة الخدمة ({effectiveCost} نقطة). يرجى شحن الرصيد من تبويب المحفظة.
          </span>
        </div>
      )}
    </div>
  );
}
