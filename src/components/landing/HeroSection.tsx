"use client";

import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

import {
  DocCvIcon,
  InvoiceBillIcon,
  FormOcrIcon,
  CameraPhotoIcon,
  WirelessPrintIcon,
  ShieldCheckIcon,
  SparklesIcon,
  BoltIcon,
} from "@/components/ui/Icons";

interface HeroSectionProps {
  onStartFree: () => void;
}

export function HeroSection({ onStartFree }: HeroSectionProps) {
  const { t } = useLanguage();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<"CV" | "INVOICE" | "OCR" | "PHOTO">("CV");

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-24 lg:pb-32 border-b border-slate-200 dark:border-slate-800/60">
      {/* Background glowing gradients & radial effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-emerald-600/15 to-teal-400/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[320px] h-[320px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Tag Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 dark:bg-slate-900/90 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm font-bold mb-8 shadow-sm backdrop-blur-md">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span>منظومة الخدمات والطباعة السحابية الأولى للأكشاك والمكتبات في 58 ولاية 🇩🇿</span>
        </div>

        {/* Main Title with Emerald Gradient */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.2] mb-6">
          <span className="block text-slate-900 dark:text-slate-100">{t("landing.heroTitle")}</span>
          <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-500">
            طباعة، رقمنة، وفواتير تجارية في ثوانٍ
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
          {t("landing.heroSubtitle")}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Button
            size="lg"
            variant="primary"
            onClick={onStartFree}
            className="w-full sm:w-auto px-9 text-base shadow-lg shadow-emerald-700/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer font-bold"
          >
            <span>{t("common.startFree")}</span>
            <svg className="w-5 h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>

          <Button
            size="lg"
            variant="secondary"
            onClick={() => setShowDemoModal(true)}
            className="w-full sm:w-auto px-7 text-base cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 transition-colors"
          >
            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span>{t("common.watchDemo")}</span>
          </Button>
        </div>

        {/* Value Props Strip */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold mb-14">
          <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <SparklesIcon size={16} />
            50 نقطة ترحيبية مجاناً
          </span>
          <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <BoltIcon size={16} className="text-amber-500 dark:text-amber-400" />
            جسر طباعة لاسلكي فوري
          </span>
          <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <ShieldCheckIcon size={16} className="text-teal-600 dark:text-teal-400" />
            مطابقة تامة لقوانين التجارة والضرائب
          </span>
        </div>

        {/* Hero Interactive Bento Preview Card */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-lg backdrop-blur-2xl text-right">
          {/* Top Bar simulating real SaaS system */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono mr-2 hidden sm:inline">sahla.app/dashboard</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700/50">
                <WirelessPrintIcon size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">طابعة الكاونتر:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">متصلة</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25 font-black">
                <span>50 نقطة كهدية</span>
              </div>
            </div>
          </div>

          {/* 4 Interactive Service Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setSelectedPreview("CV")}
              className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                selectedPreview === "CV"
                  ? "bg-emerald-50/70 dark:bg-slate-800/90 border-emerald-500/70 shadow-sm ring-1 ring-emerald-500/30"
                  : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                <DocCvIcon size={18} />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">سيرة ذاتية ATS</div>
              <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5">15 نقطة · جاهزة فوراً</div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPreview("INVOICE")}
              className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                selectedPreview === "INVOICE"
                  ? "bg-emerald-50/70 dark:bg-slate-800/90 border-emerald-500/70 shadow-sm ring-1 ring-emerald-500/30"
                  : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                <InvoiceBillIcon size={18} />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">فاتورة تجارية B2B</div>
              <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5">10 نقاط · NIF + TVA</div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPreview("OCR")}
              className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                selectedPreview === "OCR"
                  ? "bg-emerald-50/70 dark:bg-slate-800/90 border-emerald-500/70 shadow-sm ring-1 ring-emerald-500/30"
                  : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                <FormOcrIcon size={18} />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">مسح الـ OCR الذكي</div>
              <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5">10 نقاط · ملء تلقائي</div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPreview("PHOTO")}
              className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                selectedPreview === "PHOTO"
                  ? "bg-emerald-50/70 dark:bg-slate-800/90 border-emerald-500/70 shadow-sm ring-1 ring-emerald-500/30"
                  : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                <CameraPhotoIcon size={18} />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">صور الهوية 3.5×4.5</div>
              <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5">مجاني · 8 صور جاهزة</div>
            </button>
          </div>

          {/* Live Dynamic Preview Container */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1.5 text-right w-full sm:w-auto">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
                <span>
                  {selectedPreview === "CV" && "نموذج سيرة ذاتية قياسية (الجمهورية الجزائرية الديمقراطية الشعبية)"}
                  {selectedPreview === "INVOICE" && "فاتورة مطابقة للقانون التجاري والجبائي الجزائري (G50 / NIF)"}
                  {selectedPreview === "OCR" && "استخراج بيانات بطاقة التعريف الوطنية البيومترية بنقرة واحدة"}
                  {selectedPreview === "PHOTO" && "لوح طباعة مقاس 10×15 سم يحتوي على 8 صور بيومترية دقيقة"}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                جاهز للإرسال الفوري إلى أي طابعة ليزرية أو حرارية، أو التصدير بصيغة PDF عالية الدقة للزبون.
              </p>
            </div>

            <Button
              size="sm"
              variant="primary"
              onClick={onStartFree}
              className="shrink-0 w-full sm:w-auto text-xs px-6 py-2.5 font-bold shadow-sm cursor-pointer"
            >
              جرب هذا النموذج مجاناً
            </Button>
          </div>
        </div>
      </div>

      {/* Demo Video/Walkthrough Modal */}
      <Modal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        title="شاهد كيف تعمل منصة سهلة في 40 ثانية"
        description="تجربة سريعة توضح كيف تنجز أول وثيقة لزبونك وتسلمها له فوراً"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="aspect-video rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/30">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">عرض توضيحي تفاعلي</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm">
              1. اختر السيرة الذاتية ← 2. اكتب اسم ومؤهلات الزبون ← 3. اضغط «تحميل PDF» واطبع فوراً!
            </p>
          </div>
          <Button
            variant="primary"
            className="w-full cursor-pointer font-bold"
            onClick={() => {
              setShowDemoModal(false);
              onStartFree();
            }}
          >
            جرب الآن مجاناً مع 50 نقطة
          </Button>
        </div>
      </Modal>
    </section>
  );
}
