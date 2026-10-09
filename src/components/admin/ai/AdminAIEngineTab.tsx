"use client";

import React, { useState, useEffect } from "react";
import {
  Brain,
  Sparkles,
  TrendingUp,
  Activity,
  Layers,
  Cpu,
  Database,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  TrendingDown,
  RefreshCw,
  MessageSquareText,
  Lightbulb,
  CheckCircle2,
  Clock,
  Compass,
} from "lucide-react";
import { AdminAIChatPanel } from "./AdminAIChatPanel";
import { AdminAIInsightsCard } from "./AdminAIInsightsCard";
import { AdminAIProvidersManager } from "./providers/AdminAIProvidersManager";
import type { AIForecast } from "@/server/ai/types";

export type AIEngineSubTab = "chat" | "insights" | "forecasts" | "providers";

interface SubTabConfig {
  id: AIEngineSubTab;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
  badgeVariant?: "emerald" | "amber" | "teal" | "blue";
}

interface AdminAIEngineTabProps {
  initialSubTab?: AIEngineSubTab;
}

export function AdminAIEngineTab({ initialSubTab = "providers" }: AdminAIEngineTabProps = {}) {
  const [activeSubTab, setActiveSubTab] = useState<AIEngineSubTab>(initialSubTab);
  const [forecasts, setForecasts] = useState<AIForecast[]>([]);
  const [loadingForecasts, setLoadingForecasts] = useState(true);
  const [chatQuery, setChatQuery] = useState<string | undefined>(undefined);

  const fetchForecasts = async () => {
    setLoadingForecasts(true);
    try {
      const res = await fetch("/api/v1/admin/ai/forecast");
      const data = await res.json();
      if (data.success && data.forecasts) {
        setForecasts(data.forecasts);
      }
    } catch (err) {
      console.error("[AdminAIEngineTab] forecast error:", err);
    } finally {
      setLoadingForecasts(false);
    }
  };

  useEffect(() => {
    fetchForecasts();
  }, []);

  /**
   * Cross-Tab Synergy:
   * When user clicks "مناقشة مع المساعد الذكي" anywhere in insights or forecasts,
   * switch directly to the chat tab and pass the query!
   */
  const handleDeepDive = (query: string) => {
    setChatQuery(query);
    setActiveSubTab("chat");
  };

  const subTabs: SubTabConfig[] = [
    {
      id: "providers",
      label: "إدارة مزودي الذكاء الاصطناعي (AI Gateway)",
      icon: Layers,
      badge: "v2.0 ⚡",
      badgeVariant: "emerald",
    },
    {
      id: "chat",
      label: "المساعد الإداري الذكي",
      icon: MessageSquareText,
      badge: "مباشر ⚡",
      badgeVariant: "teal",
    },
    {
      id: "insights",
      label: "الرؤى والتحليلات الفورية",
      icon: Sparkles,
      badge: "تحديث آلي",
      badgeVariant: "blue",
    },
    {
      id: "forecasts",
      label: "توقعات الأعمال والنمو",
      icon: TrendingUp,
      badge: "شهري",
      badgeVariant: "amber",
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12" dir="rtl">
      {/* ── 1. Top Executive Banner (Compact & Informative) ── */}
      <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 p-5 sm:p-6 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 backdrop-blur-md">
                <Brain size={14} className="text-emerald-400" />
                محرك الذكاء الاصطناعي المركزي · Sahla Intelligence
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Multi-Provider Gateway
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              غرفة العمليات الذكية لمتابعة الـ 58 ولاية
            </h1>
            <p className="text-emerald-100/75 text-xs sm:text-sm max-w-2xl leading-relaxed">
              تحليل فوري لمؤشرات المنصة الوطنية، كشف الفرص التشغيلية، توقعات الإيرادات والنمو الشهري، والتحكم بمزودي الخدمة.
            </p>
          </div>

          {/* Engine Status Badges */}
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs">
              <Database size={14} className="text-emerald-400" />
              <span>موصول بقاعدة البيانات الحية</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs">
              <ShieldCheck size={14} className="text-teal-400" />
              <span>نظام احتياطي محلي 100% (Failover Safe)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Horizontal Segmented Navigation Tabs ── */}
      <div className="p-1.5 rounded-2xl bg-muted/40 border border-border/80 backdrop-blur-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {subTabs.map((tab) => {
            const isActive = activeSubTab === tab.id;
            const IconComp = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex-1 min-w-[210px] sm:min-w-0 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-between gap-2.5 shrink-0 ${
                  isActive
                    ? "bg-card text-foreground shadow-sm border border-border/80 text-emerald-700 dark:text-emerald-400 font-black"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <IconComp size={15} />
                  </div>
                  <span className="truncate">{tab.label}</span>
                </div>

                {tab.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-semibold shrink-0 border ${
                      isActive
                        ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30"
                        : "bg-muted text-muted-foreground border-border/50"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. Tab Content Views ── */}

      {/* ─── TAB 1: المساعد الإداري الذكي (Chat & Operations) ─── */}
      {activeSubTab === "chat" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
          {/* Main Full Chat Panel (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
              <AdminAIChatPanel
                isFloating={false}
                isOpen={true}
                initialQuery={chatQuery}
              />
            </div>
          </div>

          {/* Side Shortcuts & Quick Operations Panel (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Quick Admin Triggers Card */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <h3 className="font-bold text-sm text-foreground mb-3 flex items-center gap-2">
                <Zap size={16} className="text-amber-500" />
                <span>أوامر إدارية سريعة عبر المحرك</span>
              </h3>
              <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
                انقر على أي أمر ليقوم المساعد بجمع البيانات وتحليلها مباشرة:
              </p>
              <div className="space-y-2">
                <button
                  onClick={() =>
                    handleDeepDive("ما هي المحلات الـ 3 الأكثر استهلاكاً للنقاط هذا الأسبوع مع تفاصيل ولاياتها؟")
                  }
                  className="w-full p-2.5 rounded-xl border border-border/80 hover:border-emerald-500/40 hover:bg-emerald-500/5 text-right transition-all font-medium text-foreground text-xs flex items-center justify-between group"
                >
                  <span>⚡ أكثر المحلات استهلاكاً للنقاط</span>
                  <ArrowUpRight size={13} className="text-muted-foreground group-hover:text-emerald-600 transition-colors" />
                </button>
                <button
                  onClick={() =>
                    handleDeepDive("حلل توزيع المحلات الـ 58 ولاية واقترح 3 ولايات ذات أولوية قصوى للتوسع التجاري.")
                  }
                  className="w-full p-2.5 rounded-xl border border-border/80 hover:border-emerald-500/40 hover:bg-emerald-500/5 text-right transition-all font-medium text-foreground text-xs flex items-center justify-between group"
                >
                  <span>🗺️ خطة التوسع الجغرافي للـ 58 ولاية</span>
                  <ArrowUpRight size={13} className="text-muted-foreground group-hover:text-emerald-600 transition-colors" />
                </button>
                <button
                  onClick={() =>
                    handleDeepDive("هل توجد فواتير B2B معلقة أو متأخرة الدفع بحاجة لمتابعة من المشرفين؟")
                  }
                  className="w-full p-2.5 rounded-xl border border-border/80 hover:border-emerald-500/40 hover:bg-emerald-500/5 text-right transition-all font-medium text-foreground text-xs flex items-center justify-between group"
                >
                  <span>🧾 فحص الفواتير وعقود B2B المعلقة</span>
                  <ArrowUpRight size={13} className="text-muted-foreground group-hover:text-emerald-600 transition-colors" />
                </button>
                <button
                  onClick={() =>
                    handleDeepDive("صِغ لي مسودة إشعار ترويجي وطني يُشجع أصحاب المكتبات على ترقية باقاتهم إلى PRO_KIOSK.")
                  }
                  className="w-full p-2.5 rounded-xl border border-border/80 hover:border-emerald-500/40 hover:bg-emerald-500/5 text-right transition-all font-medium text-foreground text-xs flex items-center justify-between group"
                >
                  <span>📢 صياغة إشعار ترويجي وتنشيطي</span>
                  <ArrowUpRight size={13} className="text-muted-foreground group-hover:text-emerald-600 transition-colors" />
                </button>
              </div>
            </div>

            {/* Quick Helper Tips */}
            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-card via-card to-emerald-500/5 p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                <Lightbulb size={15} />
                <span>نصائح لاستخدام المساعد</span>
              </div>
              <ul className="text-[11px] text-muted-foreground space-y-1.5 leading-relaxed list-disc list-inside">
                <li>يمكنك طلب شحن نقاط لأي كشك (يتطلب تأكيدك قبل التنفيذ).</li>
                <li>اسأل عن أي ولاية برقمها أو اسمها للمقارنة الفورية.</li>
                <li>يحلل المساعد الفواتير والاشتراكات في الوقت الفعلي.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: الرؤى والتحليلات الفورية (Smart Insights) ─── */}
      {activeSubTab === "insights" && (
        <div className="space-y-4 animate-fadeIn">
          <AdminAIInsightsCard onOpenChatWithQuery={handleDeepDive} />
        </div>
      )}

      {/* ─── TAB 3: التوقعات ونماذج النمو (Business Forecasts) ─── */}
      {activeSubTab === "forecasts" && (
        <div className="space-y-5 animate-fadeIn">
          {/* Forecasts Header */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <TrendingUp className="text-teal-600 dark:text-teal-400" size={18} />
                  نماذج التنبؤ والنمو المستقبلي
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/15 text-teal-800 dark:text-teal-300 border border-teal-500/30">
                  نماذج إحصائية
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                توقعات آلية مبنية على معدل تسجيل المحلات، وتيرة استهلاك النقاط، ونمو الاشتراكات النشطة عبر الـ 58 ولاية.
              </p>
            </div>

            <button
              onClick={fetchForecasts}
              disabled={loadingForecasts}
              className="px-3.5 py-2 rounded-xl border border-border hover:bg-muted text-xs text-foreground transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
            >
              <RefreshCw size={13} className={loadingForecasts ? "animate-spin" : ""} />
              <span>إعادة حساب التوقعات</span>
            </button>
          </div>

          {/* Forecasts Cards Grid */}
          {loadingForecasts ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-44 rounded-2xl bg-muted/40 animate-pulse" />
              <div className="h-44 rounded-2xl bg-muted/40 animate-pulse" />
              <div className="h-44 rounded-2xl bg-muted/40 animate-pulse" />
            </div>
          ) : forecasts.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-xs rounded-2xl border border-border bg-card">
              لا توجد بيانات توقعات حالياً
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {forecasts.map((fcst) => {
                const isUp = fcst.trend === "up";
                const changePct =
                  fcst.current_value > 0
                    ? Math.round(
                        ((fcst.predicted_value - fcst.current_value) /
                          fcst.current_value) *
                          100
                      )
                    : 0;

                return (
                  <div
                    key={fcst.id}
                    className="p-5 rounded-2xl border border-border bg-card hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Metric Name & Trend Badge */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-bold text-sm text-foreground">
                          {fcst.metric_ar}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5 ${
                            isUp
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                              : "bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/30"
                          }`}
                        >
                          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          <span>{changePct >= 0 ? `+${changePct}%` : `${changePct}%`}</span>
                        </span>
                      </div>

                      {/* Values Comparison Strip */}
                      <div className="flex items-baseline gap-3 my-3 p-3 rounded-xl bg-muted/30 border border-border/60 text-xs">
                        <div>
                          <span className="text-[10px] text-muted-foreground block">
                            القيمة الحالية:
                          </span>
                          <span className="font-semibold text-foreground text-sm">
                            {fcst.current_value.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-muted-foreground font-bold">←</span>
                        <div>
                          <span className="text-[10px] text-muted-foreground block">
                            المتوقع ({fcst.period_ar}):
                          </span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                            {fcst.predicted_value.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Explanation */}
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {fcst.explanation_ar}
                      </p>
                    </div>

                    {/* Footer: Confidence & Deep Dive */}
                    <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-muted-foreground">
                        درجة الثقة: <strong className="text-foreground">{Math.round(fcst.confidence * 100)}%</strong>
                      </span>
                      <button
                        onClick={() =>
                          handleDeepDive(
                            `اشرح لي خطة العمل العملية لتسريع تحقيق هدف: "${fcst.metric_ar}" والانتقال من ${fcst.current_value.toLocaleString()} إلى ${fcst.predicted_value.toLocaleString()} خلال ${fcst.period_ar}.`
                          )
                        }
                        className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-bold flex items-center gap-1 group/btn"
                      >
                        <span>تحليل الخطوات</span>
                        <ArrowUpRight size={13} className="group-hover/btn:translate-x-[-2px] transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 4: بوابة مزودي الخدمة (Multi-Provider API Gateway) ─── */}
      {activeSubTab === "providers" && (
        <div className="space-y-4 animate-fadeIn">
          <AdminAIProvidersManager />
        </div>
      )}
    </div>
  );
}
