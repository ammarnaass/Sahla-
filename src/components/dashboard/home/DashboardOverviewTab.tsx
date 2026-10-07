"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { QuickSearch } from "@/components/dashboard/QuickSearch";
import { FrequentServices } from "@/components/dashboard/FrequentServices";
import { RecentDocuments } from "@/components/dashboard/RecentDocuments";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { DailySummary } from "@/components/dashboard/DailySummary";
import { StarterChecklist } from "@/components/dashboard/StarterChecklist";
import { SupportCard } from "@/components/dashboard/SupportCard";
import { SERVICES_CATALOG, type ServiceDefinition } from "@/lib/constants";
import type { DocumentRecord } from "@/hooks/dashboard/useDocumentsArchive";
import { useDashboardTab } from "@/contexts/DashboardTabContext";
import { Sparkles, ArrowLeft, Printer, Shield, FileCheck, Layers } from "lucide-react";
import { getServiceIcon } from "@/components/ui/Icons";

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
  const { setActiveTab } = useDashboardTab();

  // Curated quick launch services
  const coreServices = SERVICES_CATALOG.slice(0, 6);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ── 1. Modern Kiosk Welcome & Pulse Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500/10 via-card to-card border border-emerald-500/25 p-4 sm:p-6 shadow-xs">
        {/* Ambient glow in background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <Badge variant="primary" className="gap-1.5 font-bold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span>كاونتر المستندات السريع · الإصدار 2.0</span>
              </Badge>
              <span className="text-xs text-muted-foreground">جاهز لاستقبال الزبائن والطباعة</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-foreground tracking-tight font-cairo">
              مرحباً بك في كاونتر سهلة الرقمي 👋
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl leading-relaxed">
              أنجز بحوث التلاميذ، مواضيع الامتحانات، والفروض المدرسية في ثوانٍ مع الطباعة المباشرة والتصدير.
            </p>
          </div>

          {/* Quick KPI Pill */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-start bg-background/80 backdrop-blur-xs border border-border rounded-2xl p-2.5 shadow-2xs">
            <div className="text-right px-2">
              <div className="text-[10px] text-muted-foreground font-bold">وثائق اليوم</div>
              <div className="text-base sm:text-lg font-black text-foreground font-mono">
                {dailyStats.docsCount} <span className="text-xs font-normal text-muted-foreground">وثيقة</span>
              </div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-right px-2">
              <div className="text-[10px] text-muted-foreground font-bold">أرباح تقديرية</div>
              <div className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                +{dailyStats.estimatedProfitDZD.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">دج</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Service Pills Bar */}
        <div className="relative z-10 mt-4 pt-3.5 border-t border-border/80 flex items-center gap-2 overflow-x-auto no-scrollbar snap-x">
          <span className="text-[11px] font-bold text-muted-foreground shrink-0 font-cairo">إطلاق فوري:</span>
          {frequentServices.slice(0, 5).map((svc) => (
            <button
              key={svc.code}
              type="button"
              onClick={() => onSelectService(svc)}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card hover:bg-muted border border-border hover:border-primary/50 text-xs font-bold text-foreground hover:text-primary transition-all cursor-pointer shadow-2xs snap-start active:scale-95"
            >
              <span className="text-sm">{svc.code === "EDU_RESEARCH" ? "🎓" : svc.code === "ID_PHOTO" ? "📷" : svc.code === "CV_MAKER" ? "📄" : "⚡"}</span>
              <span className="font-cairo">{svc.nameAr}</span>
              <span className="text-[9px] text-primary font-mono font-bold">({svc.pointsCost}ن)</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 2. Responsive Multi-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Operational Column (2 cols on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mobile & Tablet Financial Row: Immediately visible without scrolling */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
            <BalanceCard points={points} onRecharge={onRecharge} />
            <DailySummary
              docsCount={dailyStats.docsCount}
              pointsUsed={dailyStats.pointsUsed}
              estimatedProfitDZD={dailyStats.estimatedProfitDZD}
            />
          </div>

          {/* Quick Search */}
          <QuickSearch onSelectService={onSelectService} />

          {/* Frequent Services Carousel */}
          <FrequentServices
            services={frequentServices}
            onSelectService={onSelectService}
          />

          {/* Core Services Grid Highlights */}
          <div className="space-y-3 text-right">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 font-cairo">
                <Sparkles size={16} className="text-primary" />
                <span>الخدمات الأساسية في الكاونتر</span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab("services")}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer font-cairo"
              >
                <span>دليل كل الخدمات ({SERVICES_CATALOG.length})</span>
                <ArrowLeft size={13} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {coreServices.map((svc) => (
                <div
                  key={svc.code}
                  onClick={() => onSelectService(svc)}
                  className="p-3.5 rounded-2xl bg-card border border-border hover:border-primary/50 hover:bg-muted/40 transition-all cursor-pointer flex flex-col justify-between group shadow-xs active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-9 h-9 rounded-xl bg-muted border border-border flex items-center justify-center text-foreground group-hover:scale-105 transition-transform">
                      {getServiceIcon(svc.code, 18)}
                    </div>
                    {svc.isFree ? (
                      <Badge variant="outline" className="text-[9px] text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                        مجاني
                      </Badge>
                    ) : (
                      <Badge variant="primary" className="text-[9px] font-mono font-bold">
                        {svc.pointsCost} ن
                      </Badge>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 font-cairo">
                      {svc.nameAr}
                    </h4>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5 truncate">
                      {svc.nameFr}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Documents Table */}
          <div id="recent-docs">
            <RecentDocuments
              documents={documents}
              onCreateNewDoc={() => onSelectService(SERVICES_CATALOG[0])}
            />
          </div>

          {/* Full Catalog Banner Callout */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-card via-muted/40 to-card border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <Layers size={20} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-foreground font-cairo">
                  هل تبحث عن خدمات إضافية متخصصة؟
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  استمارات الحالة المدنية، استمارة جواز السفر، وثائق التوظيف، وتصاميم الإعلانات
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab("services")}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all cursor-pointer shrink-0 shadow-xs active:scale-95 font-cairo flex items-center gap-1.5"
            >
              <span>فتح الدليل الكامل</span>
              <ArrowLeft size={14} />
            </button>
          </div>
        </div>

        {/* Side Overview Cards (Desktop column / Tablet & Mobile bottom secondary) */}
        <div className="space-y-6">
          {/* Desktop-only: Balance and Daily Summary remain in side column */}
          <div className="hidden lg:block space-y-6">
            <BalanceCard points={points} onRecharge={onRecharge} />

            <DailySummary
              docsCount={dailyStats.docsCount}
              pointsUsed={dailyStats.pointsUsed}
              estimatedProfitDZD={dailyStats.estimatedProfitDZD}
            />
          </div>

          <StarterChecklist />
          <SupportCard />
        </div>
      </div>
    </div>
  );
}
