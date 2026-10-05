"use client";

import React from "react";
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
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-50 via-white to-teal-50/50 dark:from-slate-900 dark:via-emerald-950/40 dark:to-slate-900 border border-emerald-200 dark:border-emerald-500/25 p-5 sm:p-6 shadow-sm">
          {/* Ambient glow in background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-black border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                  <span>كاونتر المستندات السريع · الإصدار 2.0</span>
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">جاهز لاستقبال الزبائن</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                مرحباً بك في كاونتر سهلة الرقمي 👋
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
                أنجز بحوث التلاميذ، نماذج الامتحانات الوزارية، صور بطاقة الهوية، والسير الذاتية في ثوانٍ مع الطباعة الفورية.
              </p>
            </div>

            {/* Quick KPI Pill */}
            <div className="flex items-center gap-2 shrink-0 bg-white/90 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 shadow-2xs">
              <div className="text-right px-2">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">وثائق اليوم</div>
                <div className="text-lg font-black text-slate-900 dark:text-white">{dailyStats.docsCount} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">وثيقة</span></div>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-800" />
              <div className="text-right px-2">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">أرباح تقديرية</div>
                <div className="text-lg font-black text-emerald-700 dark:text-emerald-400">{dailyStats.estimatedProfitDZD.toLocaleString()} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">دج</span></div>
              </div>
            </div>
          </div>

          {/* Quick Counter Launch Action Pills */}
          <div className="relative z-10 mt-5 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 shrink-0">إطلاق فوري:</span>
            {frequentServices.slice(0, 4).map((svc) => (
              <button
                key={svc.code}
                type="button"
                onClick={() => onSelectService(svc)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 hover:border-emerald-500/40 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-2xs group"
              >
                <span>{svc.code === "EDU_RESEARCH" ? "🎓" : svc.code === "ID_PHOTO" ? "📷" : svc.code === "CV_MAKER" ? "📄" : "⚡"}</span>
                <span>{svc.nameAr}</span>
                <span className="text-[9px] text-emerald-700 dark:text-emerald-400 font-mono">({svc.pointsCost}ن)</span>
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
