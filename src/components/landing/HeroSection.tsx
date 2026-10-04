"use client";

import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface HeroSectionProps {
  onStartFree: () => void;
}

export function HeroSection({ onStartFree }: HeroSectionProps) {
  const { t } = useLanguage();
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-800/60">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-600/15 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[280px] h-[280px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-semibold mb-6 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>منصة الخدمات الأولى للمكتبات ومقاهي الإنترنت في 58 ولاية 🇩🇿</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.2] mb-6">
          {t("landing.heroTitle")}
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10 font-medium">
          {t("landing.heroSubtitle")}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <Button
            size="lg"
            variant="primary"
            onClick={onStartFree}
            className="w-full sm:w-auto px-9 text-base shadow-xl shadow-emerald-700/20 hover:scale-[1.02] transition-transform"
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
            className="w-full sm:w-auto px-6 text-base"
          >
            <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span>{t("common.watchDemo")}</span>
          </Button>
        </div>

        {/* Under CTA Note */}
        <p className="text-xs sm:text-sm text-slate-400 font-medium flex items-center justify-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            50 نقطة تجريبية فورية
          </span>
          <span className="text-slate-600">•</span>
          <span>بدون اشتراك شهري</span>
          <span className="text-slate-600">•</span>
          <span>بدون بطاقة بنكية</span>
        </p>

        {/* Hero Interactive Preview Card */}
        <div className="mt-14 max-w-4xl mx-auto rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              <span className="text-xs text-slate-400 font-mono mr-2">sahla.app/dashboard</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold">
              <span>● رصيدك الحالي: 50 نقطة</span>
            </div>
          </div>

          {/* Quick Mock Dashboard Preview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-right">
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-emerald-500/40 transition-colors">
              <span className="text-2xl mb-1 block">📄</span>
              <div className="text-xs font-bold text-white">سيرة ذاتية جزائرية</div>
              <div className="text-[11px] text-emerald-400 mt-1">10 نقاط · جاهزة في 2 د</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-emerald-500/40 transition-colors">
              <span className="text-2xl mb-1 block">🧾</span>
              <div className="text-xs font-bold text-white">فاتورة تجارية قانونية</div>
              <div className="text-[11px] text-emerald-400 mt-1">15 نقطة · TVA + Timbre</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-emerald-500/40 transition-colors">
              <span className="text-2xl mb-1 block">📑</span>
              <div className="text-xs font-bold text-white">استمارة ومنحة بطالة</div>
              <div className="text-[11px] text-emerald-400 mt-1">5 نقاط · تعبئة فورية</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-emerald-500/40 transition-colors">
              <span className="text-2xl mb-1 block">🖼️</span>
              <div className="text-xs font-bold text-white">صور بطاقة التعريف 3.5×4.5</div>
              <div className="text-[11px] text-emerald-400 mt-1">مجاني · 8 صور في صفحة</div>
            </div>
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
          <div className="aspect-video rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/30">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <h4 className="text-base font-bold text-white mb-2">عرض توضيحي تفاعلي</h4>
            <p className="text-xs text-slate-400 max-w-sm">
              1. اختر السيرة الذاتية ← 2. اكتب اسم ومؤهلات الزبون ← 3. اضغط «تحميل PDF» واطبع فوراً!
            </p>
          </div>
          <Button
            variant="primary"
            className="w-full"
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
