"use client";

import React, { useState } from "react";
import {
  Activity,
  FileText,
  Coins,
  ShieldCheck,
  Server,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

interface LiveActivityItem {
  id: string;
  type: "document" | "topup" | "subscription" | "kiosk";
  title: string;
  shopName: string;
  wilayaName: string;
  wilayaCode: number;
  timeAgo: string;
  badge: string;
}

const INITIAL_ACTIVITIES: LiveActivityItem[] = [
  {
    id: "act-1",
    type: "document",
    title: "استخراج شهادة سوابق عدلية إلكترونية",
    shopName: "كشك النجاح والخدمات الرقمية",
    wilayaName: "سطيف",
    wilayaCode: 19,
    timeAgo: "منذ دقيقتين",
    badge: "15 نقطة",
  },
  {
    id: "act-2",
    type: "topup",
    title: "شحن رصيد كاونتر المحل عبر بطاقة وطنية",
    shopName: "مكتبة المعرفة للطباعة",
    wilayaName: "الجزائر",
    wilayaCode: 16,
    timeAgo: "منذ 4 دقائق",
    badge: "+500 نقطة",
  },
  {
    id: "act-3",
    type: "subscription",
    title: "ترقية اشتراك المحل إلى باقة Kiosk Pro السنوية",
    shopName: "فضاء الباهية لخدمات الإنترنت",
    wilayaName: "وهران",
    wilayaCode: 31,
    timeAgo: "منذ 8 دقائق",
    badge: "2,000 دج/شهر",
  },
  {
    id: "act-4",
    type: "document",
    title: "توليد تصريح جبائي G50 وطباعة الإشعار",
    shopName: "مكتب خدمات المستقبل السريع",
    wilayaName: "قسنطينة",
    wilayaCode: 25,
    timeAgo: "منذ 11 دقيقة",
    badge: "20 نقطة",
  },
  {
    id: "act-5",
    type: "kiosk",
    title: "انضمام كشك جديد إلى الشبكة الوطنية السحابية",
    shopName: "مكتبة الحضنة الحديثة",
    wilayaName: "المسيلة",
    wilayaCode: 28,
    timeAgo: "منذ 16 دقيقة",
    badge: "كشك جديد 🇩🇿",
  },
  {
    id: "act-6",
    type: "document",
    title: "تصميم وطباعة سيرة ذاتية احترافية ATS باللغتين",
    shopName: "كيوسك الأوراس للإعلام الآلي",
    wilayaName: "باتنة",
    wilayaCode: 5,
    timeAgo: "منذ 21 دقيقة",
    badge: "15 نقطة",
  },
];

export function LiveActivityFeed() {
  const [filterType, setFilterType] = useState<string>("ALL");

  const filtered = INITIAL_ACTIVITIES.filter((a) => {
    if (filterType === "ALL") return true;
    return a.type === filterType;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Real-time Activity Feed */}
      <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Activity size={18} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground font-cairo flex items-center gap-2">
                سجل النشاط الميداني الحي (Live Ops Radar)
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </h3>
              <p className="text-xs text-muted-foreground font-cairo">
                بث مباشر للعمليات التي تتم عبر كاونترات الأكشاك في مختلف الولايات
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border text-xs">
            <button
              onClick={() => setFilterType("ALL")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filterType === "ALL"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setFilterType("document")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filterType === "document"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              وثائق
            </button>
            <button
              onClick={() => setFilterType("topup")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filterType === "topup"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              شحن
            </button>
            <button
              onClick={() => setFilterType("subscription")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filterType === "subscription"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              اشتراكات
            </button>
          </div>
        </div>

        {/* Activity Items List */}
        <div className="space-y-2.5 pt-2">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-muted/20 hover:bg-muted/40 border border-border/70 flex items-center justify-between gap-3 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    item.type === "document"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : item.type === "topup"
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      : item.type === "subscription"
                      ? "bg-teal-500/15 text-teal-600 dark:text-teal-400"
                      : "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {item.type === "document" && <FileText size={18} />}
                  {item.type === "topup" && <Coins size={18} />}
                  {item.type === "subscription" && <Sparkles size={18} />}
                  {item.type === "kiosk" && <ArrowUpRight size={18} />}
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-foreground font-cairo truncate">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                    <span className="truncate">{item.shopName}</span>
                    <span>•</span>
                    <span className="font-bold text-foreground font-cairo">
                      ولاية {item.wilayaName} ({item.wilayaCode.toString().padStart(2, "0")})
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-left shrink-0">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-muted text-foreground border border-border block">
                  {item.badge}
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1 justify-end mt-1">
                  <Clock size={10} />
                  {item.timeAgo}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cloud & Infrastructure Health Pulse */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Server size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground font-cairo">
              صحة البنية التحتية الوطنية
            </h3>
            <span className="text-[11px] text-muted-foreground">
              حالة السيرفرات وقواعد البيانات المركزية
            </span>
          </div>
        </div>

        <div className="space-y-3.5">
          {/* Service Uptime */}
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <span className="text-xs font-bold text-foreground block font-cairo">
                  جاهزية السحابة (Uptime)
                </span>
                <span className="text-[10px] text-muted-foreground">منذ 90 يوماً دون انقطاع</span>
              </div>
            </div>
            <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
              99.98%
            </span>
          </div>

          {/* SQLite Database */}
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <div>
                <span className="text-xs font-bold text-foreground block font-cairo">
                  قاعدة البيانات SQLite
                </span>
                <span className="text-[10px] text-muted-foreground">تزامن فوري متصل</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              متصل وسليم
            </span>
          </div>

          {/* API Latency */}
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Zap size={16} className="text-amber-500" />
              <div>
                <span className="text-xs font-bold text-foreground block font-cairo">
                  زمن استجابة الـ API
                </span>
                <span className="text-[10px] text-muted-foreground">متوسط استجابة الكاونتر</span>
              </div>
            </div>
            <span className="font-mono font-bold text-xs text-foreground">
              28 ms
            </span>
          </div>

          {/* Encryption & Security */}
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={16} className="text-teal-500" />
              <div>
                <span className="text-xs font-bold text-foreground block font-cairo">
                  أمان الاتصال والتشفير
                </span>
                <span className="text-[10px] text-muted-foreground">TLS 1.3 + SHA-256</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              مؤمن 100%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
