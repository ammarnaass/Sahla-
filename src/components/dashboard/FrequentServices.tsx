"use client";

import React from "react";
import { ServiceDefinition } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { BoltIcon, getServiceIcon } from "@/components/ui/Icons";

interface FrequentServicesProps {
  services: ServiceDefinition[];
  onSelectService: (service: ServiceDefinition) => void;
}

export function FrequentServices({ services, onSelectService }: FrequentServicesProps) {
  if (!services || services.length === 0) return null;

  return (
    <div className="space-y-3 text-right">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BoltIcon className="w-4 h-4 text-emerald-400" />
          <span>الخدمات الأكثر طلباً في محلك</span>
        </h3>
        <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
          سريعة الاستخدام
        </span>
      </div>

      {/* Horizontal scroll on mobile */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
        {services.map((svc) => (
          <div
            key={svc.code}
            onClick={() => onSelectService(svc)}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 transition-all cursor-pointer shrink-0 w-44 sm:w-48 flex flex-col justify-between group shadow-sm hover:shadow-md hover:shadow-emerald-950/20"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center group-hover:scale-105 group-hover:border-emerald-500/40 transition-transform">
                {getServiceIcon(svc.code, 20)}
              </div>
              {svc.isFree ? (
                <Badge variant="free" size="sm">
                  مجاني
                </Badge>
              ) : (
                <Badge variant="primary" size="sm">
                  {svc.pointsCost} ن
                </Badge>
              )}
            </div>

            <div>
              <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                {svc.nameAr}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 font-mono">
                {svc.nameFr}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
