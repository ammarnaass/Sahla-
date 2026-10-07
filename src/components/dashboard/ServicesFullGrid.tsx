"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { SERVICES_CATALOG, ServiceDefinition } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
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
  CV_GEN: {
    description: "تصميم وإنجاز سيرة ذاتية احترافية ورسائل تحفيز متوافقة مع متطلبات التوظيف والشركات الوطنية.",
    outputFormat: "📄 قالب A4 احترافي + Word/PDF",
    turnaroundTime: "⏱️ أقل من دقيقة",
    isPopular: true,
    highlightTag: "الأكثر طلباً للشباب",
    gradientFrom: "from-emerald-500/20",
    gradientTo: "to-teal-500/20",
  },
  ID_PHOTO: {
    description: "معالجة وضبط صور الهوية البيومترية الرسمية (35×45 مم) بخلفية رمادية أو بيضاء قياسية للوثائق.",
    outputFormat: "📸 لوح 8 صور بيومترية A4",
    turnaroundTime: "⚡ فوري (30 ثانية)",
    isPopular: true,
    highlightTag: "خدمة يومية أساسية",
    gradientFrom: "from-sky-500/20",
    gradientTo: "to-blue-500/20",
  },
  INVOICE: {
    description: "إصدار وصولات وفواتير تجارية قانونية مع حساب آلي للضريبة، الخصم، وبيانات الزبون والمؤسسة.",
    outputFormat: "🧾 فاتورة تجارية رسمية + QR",
    turnaroundTime: "⚡ فوري",
    isPopular: true,
    highlightTag: "للتجار والمهنيين",
    gradientFrom: "from-indigo-500/20",
    gradientTo: "to-violet-500/20",
  },
  SCHOOL_RESEARCH: {
    description: "توليد بحوث مدرسية متوافقة 100% مع منهاج وزارة التربية الوطنية (ابتدائي، متوسط، ثانوي) مع أسئلة مراجعة.",
    outputFormat: "🎓 بحث متكامل 1-10 صفحات A4",
    turnaroundTime: "⏱️ دقيقة واحدة",
    isPopular: true,
    highlightTag: "المدرسة الجزائرية 🇩🇿",
    gradientFrom: "from-amber-500/20",
    gradientTo: "to-orange-500/20",
  },
  FORM_OCR: {
    description: "المعالجة الضوئية للوثائق الرسمية والبطاقات البيومترية لاستخراج البيانات وملء الاستمارات آلياً.",
    outputFormat: "📋 استمارة رسمية معبأة آلياً",
    turnaroundTime: "⚡ 15 ثانية",
    gradientFrom: "from-cyan-500/20",
    gradientTo: "to-blue-500/20",
  },
  TAX_G50: {
    description: "تجهيز وحساب التصريحات الجبائية الدورية G50 و G12 مع جداول المداخيل والضرائب المعتمدة لمفتشيات الضرائب.",
    outputFormat: "🏛️ جدول رسمي لمصلحة الضرائب",
    turnaroundTime: "⏱️ دقيقتان",
    gradientFrom: "from-rose-500/20",
    gradientTo: "to-pink-500/20",
  },
  CUSTOMERS: {
    description: "سجل رقمي لتتبع حسابات الكريدي وديون الزبائن اليومية في المحل مع ميزة إشعارات المتابعة الفورية.",
    outputFormat: "👥 دفتر ديون وزبائن مشفر",
    turnaroundTime: "⚡ أداة حرة دائمة",
    gradientFrom: "from-emerald-500/20",
    gradientTo: "to-green-500/20",
  },
  EPAY: {
    description: "توليد روابط ورموز استجابة سريعة QR للدفع الإلكتروني السريع عبر البطاقة الذهبية وبطاقات CIB البنكية.",
    outputFormat: "💳 دفع إلكتروني بريد الجزائر / CIB",
    turnaroundTime: "⚡ فوري",
    gradientFrom: "from-yellow-500/20",
    gradientTo: "to-amber-500/20",
  },
  PRINT_BRIDGE: {
    description: "ربط ذكي ومباشر مع طابعة الكاونتر المحلية لطباعة الفواتير والبحوث بنقرة واحدة عبر الويب.",
    outputFormat: "🖨️ طباعة سحابية ولاسلكية",
    turnaroundTime: "⚡ اتصال دائم",
    gradientFrom: "from-teal-500/20",
    gradientTo: "to-emerald-500/20",
  },
  BARCODE: {
    description: "توليد ملصقات الباركود المعياري ورموز QR Code للسلع والمشتريات وتتبع المنتجات في المكتبة.",
    outputFormat: "📊 ملصقات باركود قياسية",
    turnaroundTime: "⚡ فوري",
    gradientFrom: "from-purple-500/20",
    gradientTo: "to-indigo-500/20",
  },
  PDF_TOOLS: {
    description: "دمج، ضغط، وتقسيم وثائق الـ PDF وتجهيزها للطباعة المزدوجة على أوراق A4.",
    outputFormat: "📑 ملفات PDF مجهزة للطباعة",
    turnaroundTime: "قريباً",
    gradientFrom: "from-slate-500/20",
    gradientTo: "to-slate-700/20",
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
    { id: "all", name: "جميع الخدمات", icon: "✨" },
    { id: "documents", name: "الوثائق الإدارية والمهنية", icon: "📑" },
    { id: "commerce", name: "التجارة والضرائب والمحاسبة", icon: "🧾" },
    { id: "school", name: "التعليم والبحوث المدرسية", icon: "🎓" },
    { id: "tools", name: "الأدوات المجانية المساعدة", icon: "🛠️" },
  ] as const;

  const handleClick = (svc: ServiceDefinition) => {
    if (!svc.isActive) {
      setSelectedSoonService(svc);
      setNotifySuccess(false);
      setNotifyContact("");
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
              10 خدمات نشطة 🟢
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 flex items-center gap-3 shadow-2xs transition-colors">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <SparklesIcon size={18} />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">أدوات مجانية</div>
            <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
              6 أدوات مجانية ✨
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
              A4 وطابعات كاونتر
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
              الجزائر 2026 🇩🇿
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
              80% من معاملات الكيوسكات
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-2xs space-y-3.5 transition-colors">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Real-time Search Input */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <SearchIcon size={16} />
            </span>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في دليل الخدمات (سيرة ذاتية، صور بيومترية، بحوث، فواتير، G50...)"
              className="w-full pr-10 pl-20 py-2.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 font-medium transition-all"
            />
            <div className="absolute inset-y-0 left-3 flex items-center gap-1.5">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs px-1.5 py-0.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="مسح البحث (Esc)"
                >
                  ✕
                </button>
              ) : (
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9.5px] font-mono text-slate-400 dark:text-slate-500 bg-slate-200/60 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">
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
                ? "bg-emerald-600 border-emerald-500 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
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
                    ? "bg-emerald-600 border border-emerald-500 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800"
                }`}
              >
                <span>{grp.icon}</span>
                <span>{grp.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected
                      ? "bg-emerald-700 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredServices.map((svc) => {
            const meta = SERVICE_META_MAP[svc.code];
            const isClickable = svc.isActive;

            return (
              <div
                key={svc.code}
                onClick={() => handleClick(svc)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                  !isClickable
                    ? "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 opacity-80 hover:opacity-100"
                    : "bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800/90 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:shadow-lg hover:-translate-y-0.5 shadow-2xs"
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
                    <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
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
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-mono">
                          💎 {svc.pointsCost} نقطة
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {svc.nameAr}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      {svc.nameFr}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-2 line-clamp-2">
                      {meta?.description || "خدمة رقمية متطورة مصممة لأصحاب الكيوسكات والمكتبات."}
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Metadata Tags & Action Trigger */}
                <div className="pt-3.5 mt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    {meta?.outputFormat && (
                      <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 truncate bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        {meta.outputFormat}
                      </span>
                    )}
                  </div>

                  <div className="shrink-0">
                    {svc.isActive ? (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline flex items-center gap-1">
                        <span>فتح الاستوديو</span>
                        <span>←</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 group-hover:underline flex items-center gap-1">
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
