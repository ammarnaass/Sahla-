"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Store,
  FileText,
  Coins,
  MapPin,
  CheckCircle2,
  Sparkles,
  Search,
} from "lucide-react";

interface AdminAnalyticsTabProps {
  stats?: {
    totalShops: number;
    activeShops: number;
    totalPointsInCirculation: number;
    nationalDocumentsCount: number;
    estimatedRevenueDZD: number;
    activeSubscriptionsCount: number;
    mrrDZD: number;
    arrDZD: number;
    invoicesCount: number;
    paidInvoicesDZD: number;
    pendingInvoicesDZD: number;
  };
  analytics?: {
    wilayasDistribution: {
      wilayaCode: number;
      wilayaName: string;
      shopsCount: number;
      activeShopsCount: number;
      totalPoints: number;
      percentage: number;
    }[];
    planBreakdown: {
      planId: string;
      planNameAr: string;
      count: number;
      monthlyPriceDZD: number;
      totalRevenueDZD: number;
    }[];
    activityBreakdown: Record<string, number>;
  };
}

export function AdminAnalyticsTab({ stats, analytics }: AdminAnalyticsTabProps) {
  const [wilayaSearch, setWilayaSearch] = useState("");

  const formatDZD = (num?: number) => {
    if (num === undefined || num === null) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const filteredWilayas = (analytics?.wilayasDistribution || []).filter((w) =>
    w.wilayaName.toLowerCase().includes(wilayaSearch.toLowerCase()) ||
    w.wilayaCode.toString().includes(wilayaSearch)
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ─── Executive KPI Cards Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MRR Card */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted-foreground font-cairo">
              الدخل الشهري المتكرر (MRR)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            {formatDZD(stats?.mrrDZD)} <span className="text-sm font-bold text-muted-foreground">دج</span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1.5 flex items-center gap-1">
            <Sparkles size={12} /> اشتراكات نشطة متجددة
          </p>
        </div>

        {/* ARR Card */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted-foreground font-cairo">
              الدخل السنوي المتوقع (ARR)
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Coins size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            {formatDZD(stats?.arrDZD)} <span className="text-sm font-bold text-muted-foreground">دج</span>
          </div>
          <p className="text-[11px] text-muted-foreground font-bold mt-1.5">
            محسوب بمعدل نمو الاشتراكات
          </p>
        </div>

        {/* Active Shops */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted-foreground font-cairo">
              الأكشاك والمكتبات النشطة
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Store size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            {stats?.activeShops || 0}{" "}
            <span className="text-sm font-normal text-muted-foreground font-sans">
              / {stats?.totalShops || 0} محل
            </span>
          </div>
          <p className="text-[11px] text-blue-600 dark:text-blue-400 font-bold mt-1.5 flex items-center gap-1">
            <CheckCircle2 size={12} /> متصلة بالشبكة السحابية
          </p>
        </div>

        {/* National Documents Printed */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted-foreground font-cairo">
              الوثائق المطبوعة وطنياً
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <FileText size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            {formatDZD(stats?.nationalDocumentsCount)}
          </div>
          <p className="text-[11px] text-muted-foreground font-bold mt-1.5">
            عبر كاونترات 58 ولاية
          </p>
        </div>
      </div>

      {/* ─── Plan Breakdown Strip ─── */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
        <h3 className="text-base font-bold text-foreground font-cairo mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-emerald-500" />
          توزيع المشتركين بحسب الباقات (SaaS Plan Breakdown)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(analytics?.planBreakdown || []).map((p) => (
            <div
              key={p.planId}
              className="p-4 rounded-xl bg-muted/30 border border-border flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-muted-foreground block font-cairo">
                  {p.planNameAr}
                </span>
                <span className="text-2xl font-black text-foreground font-mono">
                  {p.count} <span className="text-xs font-normal text-muted-foreground">مشترك</span>
                </span>
              </div>
              <div className="text-left">
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 block">
                  {formatDZD(p.totalRevenueDZD)} دج
                </span>
                <span className="text-[10px] text-muted-foreground font-cairo">
                  إجمالي الإيراد الشهري
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Wilayas Distribution Table ─── */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-foreground font-cairo flex items-center gap-2">
              <MapPin size={18} className="text-emerald-500" />
              توزيع الشبكة ونشاط الطباعة عبر الـ 58 ولاية
            </h3>
            <p className="text-xs text-muted-foreground font-cairo mt-0.5">
              إحصائيات فورية لعدد الأكشاك ونقاط الطباعة المستهلكة في كل ولاية
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث بالولاية أو الرمز..."
              value={wilayaSearch}
              onChange={(e) => setWilayaSearch(e.target.value)}
              className="w-full pl-3 pr-9 py-2 text-xs rounded-xl bg-muted/40 border border-border focus:outline-none focus:border-emerald-500 text-foreground"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground font-bold">
                <th className="py-3 px-3">الرمز</th>
                <th className="py-3 px-3">الولاية</th>
                <th className="py-3 px-3">عدد الأكشاك</th>
                <th className="py-3 px-3">الأكشاك النشطة</th>
                <th className="py-3 px-3">النقاط المستهلكة</th>
                <th className="py-3 px-3 text-left">النسبة الوطنية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredWilayas.length > 0 ? (
                filteredWilayas.map((w) => (
                  <tr key={w.wilayaCode} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-muted-foreground">
                      {w.wilayaCode.toString().padStart(2, "0")}
                    </td>
                    <td className="py-3 px-3 font-bold text-foreground">{w.wilayaName}</td>
                    <td className="py-3 px-3 font-mono">{w.shopsCount}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                        {w.activeShopsCount}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold">{formatDZD(w.totalPoints)}</td>
                    <td className="py-3 px-3 text-left">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-mono text-xs">{w.percentage.toFixed(1)}%</span>
                        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${Math.min(w.percentage * 3, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground">
                    لا توجد ولاية مطابقة للبحث
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
