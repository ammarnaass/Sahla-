"use client";

import React from "react";
import { ServiceDefinition } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import { getServiceIcon } from "@/components/ui/Icons";

interface FrequentServicesProps {
  services: ServiceDefinition[];
  onSelectService: (service: ServiceDefinition) => void;
}

export function FrequentServices({ services, onSelectService }: FrequentServicesProps) {
  if (!services || services.length === 0) return null;

  return (
    <div className="space-y-3 text-right">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2 font-cairo">
          <Zap size={16} className="text-primary animate-pulse" />
          <span>الخدمات الأكثر طلباً في محلك</span>
        </h3>
        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
          تشغيل سريع
        </span>
      </div>

      {/* Horizontal smooth scroll on mobile & tablet */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory">
        {services.map((svc) => (
          <div
            key={svc.code}
            onClick={() => onSelectService(svc)}
            className="p-4 rounded-2xl bg-card border border-border hover:border-primary/50 hover:bg-muted/40 transition-all cursor-pointer shrink-0 w-44 sm:w-48 flex flex-col justify-between group shadow-xs hover:shadow-md hover:shadow-primary/5 snap-start active:scale-[0.98]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center text-foreground group-hover:scale-105 group-hover:border-primary/40 transition-transform">
                {getServiceIcon(svc.code, 20)}
              </div>
              {svc.isFree ? (
                <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                  مجاني
                </Badge>
              ) : (
                <Badge variant="primary" className="text-[10px] font-mono font-bold">
                  {svc.pointsCost} ن
                </Badge>
              )}
            </div>

            <div>
              <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 font-cairo">
                {svc.nameAr}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1 font-mono">
                {svc.nameFr}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
