"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { SERVICES_CATALOG, ServiceDefinition } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { useDashboardTab } from "@/contexts/DashboardTabContext";
import {
  getServiceIcon,
  SearchIcon,
  SparklesIcon,
  WirelessPrintIcon,
  CheckCircleIcon,
  BoltIcon,
  TrendUpIcon,
  ShieldCheckIcon,
} from "@/components/ui/Icons";

interface ServicesFullGridProps {
  onSelectService: (service: ServiceDefinition) => void;
  showHighlights?: boolean;
}

interface ServiceMetadata {
  description: string;
  outputFormat: string;
  turnaroundTime: string;
  isPopular?: boolean;
  highlightTag?: string;
  gradientFrom: string;
  gradientTo: string;
}

const SERVICE_META_MAP: Record<string, ServiceMetadata> = {
  SCHOOL_RESEARCH: {
    description: "توليد بحوث مدرسية متوافقة 100% مع منهاج وزارة التربية الوطنية (ابتدائي، متوسط، ثانوي) مع خطة البحث، المقدمة، الفصول والمراجع.",
    outputFormat: "🎓 بحث متكامل 1-10 صفحات A4 + تصدير Word",
    turnaroundTime: "⏱️ دقيقة واحدة",
    isPopular: true,
    highlightTag: "المدرسة الجزائرية 🇩🇿",
    gradientFrom: "from-amber-500/25",
    gradientTo: "to-orange-500/25",
  },
};

export function ServicesFullGrid({
  onSelectService,
  showHighlights = true,
}: ServicesFullGridProps) {
  const [selectedSoonService, setSelectedSoonService] = useState<ServiceDefinition | null>(null);
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [notifyContact, setNotifyContact] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [onlyActive, setOnlyActive] = useState<boolean>(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: '/' focuses the search bar, 'Escape' clears
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "Escape" && document.activeElement === searchInputRef.current) {
        setSearchQuery("");
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const groups = [
    { id: "all", name: "جميع الخدمات التعليمية", icon: "✨" },
    { id: "school", name: "التعليم والبحوث المدرسية", icon: "🎓" },
  ] as const;

  // Safe access to tab context if rendered inside dashboard tab provider
  let tabContext: { setActiveTab: (t: any) => void } | null = null;
  try {
    tabContext = useDashboardTab();
  } catch {
    tabContext = null;
  }

  const handleClick = (svc: ServiceDefinition) => {
    if (!svc.isActive) {
      setSelectedSoonService(svc);
      setNotifySuccess(false);
      setNotifyContact("");
      return;
    }

    if (svc.code === "SCHOOL_RESEARCH") {
      if (tabContext) {
        tabContext.setActiveTab("school-research");
      } else {
        window.location.hash = "school-research";
      }
      return;
    }

    onSelectService(svc);
  };

  // Filtered Services Computation
  const filteredServices = useMemo(() => {
    return SERVICES_CATALOG.filter((svc) => {
      // Category filter
      if (selectedCategory !== "all" && svc.category !== selectedCategory) {
        return false;
      }
      // Active only filter
      if (onlyActive && !svc.isActive) {
        return false;
      }
      // Search query
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.trim().toLowerCase();
        const meta = SERVICE_META_MAP[svc.code];
        const matchNameAr = svc.nameAr.toLowerCase().includes(query);
        const matchNameFr = svc.nameFr.toLowerCase().includes(query);
        const matchDesc = meta?.description.toLowerCase().includes(query) || false;
        const matchOutput = meta?.outputFormat.toLowerCase().includes(query) || false;
        return matchNameAr || matchNameFr || matchDesc || matchOutput;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, onlyActive]);

  // Featured / Popular Services for Fast Counter Access
  const featuredServices = useMemo(() => {
    return SERVICES_CATALOG.filter((svc) => SERVICE_META_MAP[svc.code]?.isPopular && svc.isActive);
  }, []);

  // Category service counts for quick pills
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: SERVICES_CATALOG.length };
    SERVICES_CATALOG.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="space-y-6 text-right select-none">
      {/* ── Operational Status & KPI Ribbon ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 flex items-center gap-3 shadow-2xs transition-colors">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <BoltIcon size={18} />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">جاهزية الخدمات</div>
            <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
              {SERVICES_CATALOG.filter((s) => s.isActive).length} خدمات نشطة 🟢
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 flex items-center gap-3 shadow-2xs transition-colors">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <SparklesIcon size={18} />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">نوع الخدمات</div>
            <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
              تعليمية ومدرسية 🇩🇿
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 flex items-center gap-3 shadow-2xs transition-colors">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <WirelessPrintIcon size={18} />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">دعم الطابعات</div>
            <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
              A4 وتصدير Word/PDF
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 flex items-center gap-3 shadow-2xs transition-colors">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <ShieldCheckIcon size={18} />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">المطابقة الوطنية</div>
            <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
              منهاج التربية الوطنية
            </div>
          </div>
        </div>
      </div>

      {/* ── High-Velocity Top Kiosk Services (الأكثر طلباً على الكاونتر) ── */}
      {showHighlights && searchQuery.trim().length === 0 && selectedCategory === "all" && !onlyActive && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <TrendUpIcon size={15} />
              </span>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>الخدمات الأكثر طلباً وسرعة على الكاونتر</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/20">
                  تشغيل فوري بنقرة واحدة
                </span>
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              المنهاج الرسمي لوزارة التربية الوطنية
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto gap-4">
            {featuredServices.map((svc) => {
              const meta = SERVICE_META_MAP[svc.code];
              return (
                <div
                  key={`feat_${svc.code}`}
                  onClick={() => handleClick(svc)}
                  className="p-4 rounded-2xl bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border border-emerald-500/30 hover:border-emerald-500 dark:border-emerald-500/30 dark:hover:border-emerald-400 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 opacity-80" />

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between pt-1">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-2xs">
                        {getServiceIcon(svc.code, 22)}
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                        {meta?.highlightTag || "مميز"}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {svc.nameAr}
                      </div>
                      <div className="text-[10.5px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        {svc.nameFr}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {meta?.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      {svc.isFree ? "مجانية 100%" : `${svc.pointsCost} نقطة`}
                    </span>
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10.5px] font-bold shadow-2xs transition-all flex items-center gap-1 group-hover:translate-x-[-2px]"
                    >
                      <span>تشغيل</span>
                      <span>↵</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Search Bar, Category Filters & Active Toggle ── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-2xs space-y-3.5 transition-colors">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Real-time Search Input */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-muted-foreground">
              <SearchIcon size={16} />
            </span>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في دليل الخدمات (بحوث مدرسية، مذكرات تخرج...)"
              className="w-full pr-10 pl-20 py-2.5 bg-muted/40 border border-border rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 font-medium transition-all"
            />
            <div className="absolute inset-y-0 left-3 flex items-center gap-1.5">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-muted-foreground hover:text-foreground text-xs px-1.5 py-0.5 rounded-md hover:bg-muted transition-colors cursor-pointer"
                  title="مسح البحث (Esc)"
                >
                  ✕
                </button>
              ) : (
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9.5px] font-mono text-muted-foreground bg-muted rounded border border-border">
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* Active Services Switch */}
          <button
            type="button"
            onClick={() => setOnlyActive(!onlyActive)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 ${
              onlyActive
                ? "bg-primary border-primary text-primary-foreground shadow-xs"
                : "bg-muted border-border text-foreground hover:bg-muted/80"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>الخدمات النشطة فقط ({SERVICES_CATALOG.filter((s) => s.isActive).length})</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          {groups.map((grp) => {
            const count = categoryCounts[grp.id] || 0;
            const isSelected = selectedCategory === grp.id;
            return (
              <button
                key={grp.id}
                type="button"
                onClick={() => setSelectedCategory(grp.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-primary border border-primary text-primary-foreground shadow-xs"
                    : "bg-muted border border-border text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                <span>{grp.icon}</span>
                <span>{grp.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-background text-muted-foreground border border-border"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Results Counter & Active Filters Summary ── */}
      <div className="flex items-center justify-between text-xs px-1 text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span>عرض</span>
          <span className="font-extrabold text-slate-900 dark:text-white font-mono">
            {filteredServices.length}
          </span>
          <span>من أصل</span>
          <span className="font-extrabold text-slate-900 dark:text-white font-mono">
            {SERVICES_CATALOG.length}
          </span>
          <span>خدمة متوفرة</span>
        </div>

        {(searchQuery || selectedCategory !== "all" || onlyActive) && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setOnlyActive(false);
            }}
            className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-bold cursor-pointer"
          >
            إعادة تعيين المرشحات ↺
          </button>
        )}
      </div>

      {/* ── Main Services Grid ── */}
      {filteredServices.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center text-xl">
            🔍
          </div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
            لم يتم العثور على أية خدمة مطابقة لـ «{searchQuery}»
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            تأكد من كتابة الكلمات المفتاحية بشكل صحيح أو جرب البحث باسم الخدمة بالعربية أو الفرنسية.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setOnlyActive(false);
            }}
          >
            إظهار جميع الخدمات
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto gap-4">
          {filteredServices.map((svc) => {
            const meta = SERVICE_META_MAP[svc.code];
            const isClickable = svc.isActive;

            return (
              <div
                key={svc.code}
                onClick={() => handleClick(svc)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                  !isClickable
                    ? "bg-muted/40 border-border opacity-70 hover:opacity-100"
                    : "bg-card border-border hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5 shadow-2xs"
                }`}
              >
                {/* Subtle top ambient glow */}
                <div
                  className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-r ${
                    meta?.gradientFrom || "from-emerald-500/20"
                  } ${meta?.gradientTo || "to-teal-500/20"} opacity-70 group-hover:opacity-100 transition-opacity`}
                />

                <div className="space-y-3">
                  {/* Top row: Icon + Cost & Status Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-11 h-11 rounded-2xl bg-muted border border-border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs text-foreground">
                      {getServiceIcon(svc.code, 24)}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {svc.isFree ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                          مجانية ✨
                        </span>
                      ) : !svc.isActive ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                          قريباً ⏳
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-mono">
                          💎 {svc.pointsCost} نقطة
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h4 className="text-sm font-extrabold text-foreground group-hover:text-primary transition-colors font-cairo">
                      {svc.nameAr}
                    </h4>
                    <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                      {svc.nameFr}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-2 line-clamp-2">
                      {meta?.description || "خدمة رقمية متطورة مصممة لأصحاب الكيوسكات والمكتبات."}
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Metadata Tags & Action Trigger */}
                <div className="pt-3.5 mt-3.5 border-t border-border flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    {svc.code === "SCHOOL_RESEARCH" && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-muted border border-border text-foreground">
                        ⌘R
                      </span>
                    )}
                    {meta?.outputFormat && (
                      <span className="text-[10px] font-medium text-muted-foreground truncate bg-muted px-2 py-0.5 rounded-md">
                        {meta.outputFormat}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {svc.isActive && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectService(svc);
                        }}
                        title="فتح استوديو A4 السريع كنافذة منبثقة"
                        className="text-[11px] font-bold px-2 py-1 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        سريع ⚡
                      </button>
                    )}

                    {svc.isActive ? (
                      <span className="text-xs font-bold text-primary group-hover:underline flex items-center gap-1 font-cairo">
                        <span>
                          {svc.code === "SCHOOL_RESEARCH"
                            ? "استوديو البحوث"
                            : "فتح الاستوديو"}
                        </span>
                        <span>←</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 group-hover:underline flex items-center gap-1 font-cairo">
                        <span>طلب إشعار</span>
                        <span>🔔</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Unavailable Service "Notify Me" Modal per PRD Section 7.3 ── */}
      {selectedSoonService && (
        <Modal
          isOpen={Boolean(selectedSoonService)}
          onClose={() => setSelectedSoonService(null)}
          title={`خدمة «${selectedSoonService.nameAr}» قيد التطوير النهائي`}
          description="نحن بصدد إطلاق هذه الخدمة وفق النماذج الرسمية في الجزائر"
        >
          <div className="space-y-4 text-center py-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl shadow-xs">
              ⏳
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {selectedSoonService.nameAr} ({selectedSoonService.nameFr})
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed mt-1">
                يجري حالياً التحقق من مطابقة النماذج الرسمية للطباعة المباشرة على أوراق A4 ونماذج الإدارات الجزائرية.
              </p>
            </div>

            {notifySuccess ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in zoom-in-95">
                <CheckCircleIcon size={16} />
                <span>تم تسجيل طلبك بنجاح! سيصلك تنبيه فوري فور إتاحة الخدمة في المنصة.</span>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <input
                  type="text"
                  value={notifyContact}
                  onChange={(e) => setNotifyContact(e.target.value)}
                  placeholder="أدخل رقم الهاتف أو البريد الإلكتروني لتنبيهك..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
                />
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setNotifySuccess(true)}
                  className="w-full font-bold shadow-md shadow-emerald-950/20"
                >
                  تفعيل التنبيه والإشعار الفوري 🔔
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
