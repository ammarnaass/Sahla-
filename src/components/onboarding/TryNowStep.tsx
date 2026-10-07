"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface TryNowStepProps {
  onSuccess: (docData: { title: string; type: string; customerName: string; salePrice: number }) => void;
  onPrev: () => void;
  onSkip: () => void;
}

export function TryNowStep({ onSuccess, onPrev, onSkip }: TryNowStepProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [customerName, setCustomerName] = useState("محمد بن سالم");
  const [jobTitle, setJobTitle] = useState("محاسب إداري");
  const [wilaya, setWilaya] = useState("الجزائر العاصمة");

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      onSuccess({
        title: `سيرة ذاتية — ${customerName}`,
        type: "CV",
        customerName,
        salePrice: 200, // Suggested sale price in DZD
      });
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto py-4 text-right">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          خطوة 3 من 3
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          جرّب الآن وأنشئ أول وثيقة في ثوانٍ!
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          لقد جهزنا لك قالباً تجريبياً لسيرة ذاتية جزائرية معتمدة. اضغط للتوليد الفوري.
        </p>
      </div>

      {/* Interactive Mock Generator Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-emerald-500/40 shadow-xl relative space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📄</span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">قالب السيرة الذاتية الكلاسيكي (CV)</h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">نموذج رسمي باللغتين العربية والفرنسية</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            تكلفة: 10 نقاط تجريبية
          </span>
        </div>

        {/* Pre-filled Sample Data Inputs */}
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-400 mb-1">اسم الزبون التجريبي:</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-400 mb-1">المهنة / التخصص:</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-400 mb-1">الولاية:</label>
              <input
                type="text"
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          variant="primary"
          size="lg"
          isLoading={isGenerating}
          onClick={handleGenerate}
          className="w-full font-bold shadow-lg shadow-emerald-500/20 text-base"
        >
          <span>{isGenerating ? "جارٍ توليد ملف الـ PDF..." : "أنشئ أول وثيقة تجريبية الآن ⚡"}</span>
        </Button>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-3 py-2 cursor-pointer transition-colors"
        >
          ← السابق
        </button>

        <button
          type="button"
          onClick={onSkip}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-3 py-2 cursor-pointer transition-colors"
        >
          تخطي إلى الشاشة الرئيسية مباشرة →
        </button>
      </div>
    </div>
  );
}
