"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface ServicePreferencesStepProps {
  selectedCodes: string[];
  onChange: (codes: string[]) => void;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

export function ServicePreferencesStep({
  selectedCodes,
  onChange,
  onNext,
  onPrev,
  onSkip,
}: ServicePreferencesStepProps) {
  const availableServices = [
    {
      code: "CV_GEN",
      title: "سيرة ذاتية ورسائل تحفيزية",
      icon: "📄",
      desc: "طلب يومي مرتفع من الباحثين عن عمل والطلاب",
    },
    {
      code: "INVOICE",
      title: "فواتير تجارية رسمية",
      icon: "🧾",
      desc: "للتجار والحرفيين والشركات المصغرة",
    },
    {
      code: "FORM_OCR",
      title: "استمارات إدارية ومنحة بطالة",
      icon: "📋",
      desc: "تعبئة سريعة بالماسح الضوئي الذكي",
    },
    {
      code: "SCHOOL_RESEARCH",
      title: "بحوث مدرسية ومذكرات تخرج",
      icon: "🎓",
      desc: "قوالب تعليمية للابتدائي، المتوسط والجامعي",
    },
    {
      code: "ID_PHOTO",
      title: "صور بطاقة التعريف وجواز السفر",
      icon: "📸",
      desc: "تكرار وطباعة 8 صور هوية في ورقة واحدة",
    },
    {
      code: "TAX_G50",
      title: "تصاريح جبائية G50 و G12",
      icon: "🏛️",
      desc: "للمحاسبين والتجار الخاضعين للضريبة",
    },
  ];

  const toggleService = (code: string) => {
    if (selectedCodes.includes(code)) {
      onChange(selectedCodes.filter((c) => c !== code));
    } else {
      onChange([...selectedCodes, code]);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto py-4 text-right">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          خطوة 2 من 3
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          ما هي أكثر الخدمات التي يطلبها زبائنك؟
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          حدد الخدمات لتخصيص وترتيب لوحة التحكم في محلك بالشكل الذي يناسبك
        </p>
      </div>

      {/* Selectable Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {availableServices.map((svc) => {
          const isSelected = selectedCodes.includes(svc.code);
          return (
            <div
              key={svc.code}
              onClick={() => toggleService(svc.code)}
              className={`p-4 rounded-2xl border cursor-pointer select-none transition-all flex items-start gap-3.5 ${
                isSelected
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-md ring-1 ring-emerald-500/50"
                  : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40"
              }`}
            >
              <div
                className={`w-5 h-5 mt-0.5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? "bg-emerald-600 border-emerald-500 text-white"
                    : "border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
                }`}
              >
                {isSelected && <span className="text-xs font-bold">✓</span>}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{svc.icon}</span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{svc.title}</h3>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">{svc.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={onPrev}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-3 py-2 cursor-pointer transition-colors"
        >
          ← السابق
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSkip}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-3 py-2 cursor-pointer transition-colors"
          >
            تخطي
          </button>
          <Button
            variant="primary"
            size="md"
            onClick={onNext}
            className="px-6 font-bold shadow-md shadow-emerald-500/20"
          >
            <span>التالي: تجربة وثيقة</span>
            <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
