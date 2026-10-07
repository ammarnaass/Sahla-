"use client";

import React, { useEffect, useState } from "react";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Activity,
  RefreshCw,
  ChevronRight,
  ArrowUpRight,
  CheckCircle,
} from "lucide-react";
import type { AIInsight, InsightType, InsightSeverity } from "@/server/ai/types";

interface AdminAIInsightsCardProps {
  onOpenChatWithQuery?: (query: string) => void;
  className?: string;
}

export function AdminAIInsightsCard({
  onOpenChatWithQuery,
  className = "",
}: AdminAIInsightsCardProps) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadInsights = async (forceRefresh: boolean = false) => {
    if (forceRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch(
        `/api/v1/admin/ai/insights${forceRefresh ? "?refresh=true" : ""}`
      );
      const data = await res.json();
      if (data.success && data.insights) {
        setInsights(data.insights);
      }
    } catch (err) {
      console.error("[AdminAIInsightsCard] fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, []);

  const getTypeStyle = (type: InsightType, severity: InsightSeverity) => {
    if (severity === "critical" || type === "risk") {
      return {
        badge: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
        border: "border-r-red-500 dark:border-r-red-500",
        icon: AlertTriangle,
        iconColor: "text-red-600 dark:text-red-400",
        label: "تنبيه ومخاطر",
      };
    }
    if (type === "growth") {
      return {
        badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
        border: "border-r-emerald-500 dark:border-r-emerald-500",
        icon: TrendingUp,
        iconColor: "text-emerald-600 dark:text-emerald-400",
        label: "نمو وتوسع",
      };
    }
    if (type === "opportunity") {
      return {
        badge: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
        border: "border-r-amber-500 dark:border-r-amber-500",
        icon: Lightbulb,
        iconColor: "text-amber-600 dark:text-amber-400",
        label: "فرصة تشغيلية",
      };
    }
    return {
      badge: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
      border: "border-r-blue-500 dark:border-r-blue-500",
      icon: Activity,
      iconColor: "text-blue-600 dark:text-blue-400",
      label: "تحليل إحصائي",
    };
  };

  return (
    <div
      className={`rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-card via-card to-emerald-500/5 shadow-sm overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-5 border-b border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-foreground">
                الرؤى والتحليلات الذكية الفورية
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                Gemini 2.5 Flash
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              تحليل آلي فوري لبيانات الـ 58 ولاية، معدلات النشاط، وفرص تحسين الإيرادات
            </p>
          </div>
        </div>

        <button
          onClick={() => loadInsights(true)}
          disabled={loading || refreshing}
          className="p-2 rounded-xl border border-border/80 hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-xs"
          title="تحديث الرؤى"
        >
          <RefreshCw
            size={14}
            className={refreshing ? "animate-spin text-emerald-600" : ""}
          />
          <span className="hidden sm:inline">تحديث</span>
        </button>
      </div>

      {/* Body */}
      <div className="p-5">
        {loading ? (
          <div className="space-y-3 py-6">
            <div className="h-16 rounded-xl bg-muted/50 animate-pulse" />
            <div className="h-16 rounded-xl bg-muted/50 animate-pulse" />
          </div>
        ) : insights.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground text-sm">
            <CheckCircle size={32} className="mx-auto mb-2 text-emerald-500" />
            <p>لا توجد تنبيهات عاجلة حالياً. جميع مؤشرات المنصة تسير بشكل طبيعي.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((ins) => {
              const style = getTypeStyle(ins.type, ins.severity);
              const IconComp = style.icon;

              return (
                <div
                  key={ins.id}
                  className={`p-4 rounded-xl border border-border/70 bg-card/60 backdrop-blur-sm border-r-4 ${style.border} flex flex-col justify-between hover:shadow-md transition-all duration-200 group`}
                >
                  <div>
                    {/* Header: Badge & Icon */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 ${style.badge}`}
                      >
                        <IconComp size={12} className={style.iconColor} />
                        {style.label}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="font-bold text-sm text-foreground mb-1.5 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {ins.title_ar}
                    </h4>

                    {/* Body */}
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {ins.body_ar}
                    </p>

                    {/* Action Suggestion */}
                    {ins.action_suggestion_ar && (
                      <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-800 dark:text-emerald-200">
                        <span className="font-bold">💡 الإجراء المقترح: </span>
                        {ins.action_suggestion_ar}
                      </div>
                    )}
                  </div>

                  {/* Ask AI Button */}
                  {onOpenChatWithQuery && (
                    <div className="mt-4 pt-3 border-t border-border/50 flex justify-end">
                      <button
                        onClick={() =>
                          onOpenChatWithQuery(
                            `اشرح لي المزيد حول: "${ins.title_ar}" وما هي الخطوات العملية المقترحة؟`
                          )
                        }
                        className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 group/btn"
                      >
                        <span>مناقشة مع المساعد الذكي</span>
                        <ArrowUpRight
                          size={13}
                          className="group-hover/btn:translate-x-[-2px] transition-transform"
                        />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
