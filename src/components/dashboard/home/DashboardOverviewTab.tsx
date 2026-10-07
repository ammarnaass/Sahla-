"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { QuickSearch } from "@/components/dashboard/QuickSearch";
import { FrequentServices } from "@/components/dashboard/FrequentServices";
import { ServicesFullGrid } from "@/components/dashboard/ServicesFullGrid";
import { RecentDocuments } from "@/components/dashboard/RecentDocuments";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { DailySummary } from "@/components/dashboard/DailySummary";
import { StarterChecklist } from "@/components/dashboard/StarterChecklist";
import { SupportCard } from "@/components/dashboard/SupportCard";
import { SERVICES_CATALOG, type ServiceDefinition } from "@/lib/constants";
import type { DocumentRecord } from "@/hooks/dashboard/useDocumentsArchive";

interface DashboardOverviewTabProps {
  frequentServices: ServiceDefinition[];
  onSelectService: (svc: ServiceDefinition) => void;
  documents: DocumentRecord[];
  points: number;
  onRecharge: (pointsToAdd: number, desc?: string) => void;
  dailyStats: {
    docsCount: number;
    pointsUsed: number;
    estimatedProfitDZD: number;
  };
}

export function DashboardOverviewTab({
  frequentServices,
  onSelectService,
  documents,
  points,
  onRecharge,
  dailyStats,
}: DashboardOverviewTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
      {/* Main Content Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Modern Kiosk Welcome & Pulse Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500/10 via-card to-card border border-emerald-500/25 p-5 sm:p-6 shadow-sm">
          {/* Ambient glow in background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant="primary" className="gap-1.5 font-bold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span>كاونتر المستندات السريع · الإصدار 2.0</span>
                </Badge>
                <span className="text-xs text-muted-foreground">جاهز لاستقبال الزبائن</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                مرحباً بك في كاونتر سهلة الرقمي 👋
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl leading-relaxed">
                أنجز بحوث التلاميذ، نماذج الامتحانات الوزارية، صور بطاقة الهوية، والسير الذاتية في ثوانٍ مع الطباعة الفورية.
              </p>
            </div>

            {/* Quick KPI Pill */}
            <div className="flex items-center gap-2 shrink-0 bg-background/80 backdrop-blur-xs border border-border rounded-2xl p-2.5 shadow-2xs">
              <div className="text-right px-2">
                <div className="text-[10px] text-muted-foreground font-bold">وثائق اليوم</div>
                <div className="text-lg font-black text-foreground">{dailyStats.docsCount} <span className="text-xs font-normal text-muted-foreground">وثيقة</span></div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-right px-2">
                <div className="text-[10px] text-muted-foreground font-bold">أرباح تقديرية</div>
                <div className="text-lg font-black text-primary font-mono">+{dailyStats.estimatedProfitDZD.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">دج</span></div>
              </div>
            </div>
          </div>

          {/* Quick Counter Launch Action Pills */}
          <div className="relative z-10 mt-5 pt-4 border-t border-border flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-muted-foreground shrink-0">إطلاق فوري:</span>
            {frequentServices.slice(0, 4).map((svc) => (
              <button
                key={svc.code}
                type="button"
                onClick={() => onSelectService(svc)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card hover:bg-muted border border-border hover:border-primary/50 text-xs font-bold text-foreground hover:text-primary transition-all cursor-pointer shadow-2xs group"
              >
                <span>{svc.code === "EDU_RESEARCH" ? "🎓" : svc.code === "ID_PHOTO" ? "📷" : svc.code === "CV_MAKER" ? "📄" : "⚡"}</span>
                <span>{svc.nameAr}</span>
                <span className="text-[9px] text-primary font-mono">({svc.pointsCost}ن)</span>
              </button>
            ))}
          </div>
        </div>

        <QuickSearch onSelectService={onSelectService} />

        <FrequentServices
          services={frequentServices}
          onSelectService={onSelectService}
        />

        <div id="services">
          <ServicesFullGrid onSelectService={onSelectService} />
        </div>

        <div id="recent-docs">
          <RecentDocuments
            documents={documents}
            onCreateNewDoc={() => onSelectService(SERVICES_CATALOG[0])}
          />
        </div>
      </div>

      {/* Side Overview Cards */}
      <div className="space-y-6">
        <BalanceCard points={points} onRecharge={onRecharge} />

        <DailySummary
          docsCount={dailyStats.docsCount}
          pointsUsed={dailyStats.pointsUsed}
          estimatedProfitDZD={dailyStats.estimatedProfitDZD}
        />

        <StarterChecklist />
        <SupportCard />
      </div>
    </div>
  );
}
