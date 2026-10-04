"use client";

import React from "react";
import { ServiceDefinition } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

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
          <span>⚡</span>
          <span>الخدمات الأكثر طلباً في محلك</span>
        </h3>
        <span className="text-[11px] text-emerald-400 font-medium">مخصصة لك</span>
      </div>

      {/* Horizontal scroll on mobile */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
        {services.map((svc) => (
          <div
            key={svc.code}
            onClick={() => onSelectService(svc)}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/50 transition-all cursor-pointer shrink-0 w-44 sm:w-48 flex flex-col justify-between group shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl p-2.5 rounded-xl bg-slate-800 group-hover:scale-105 transition-transform">
                {svc.icon}
              </span>
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
              <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                {svc.nameFr}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
