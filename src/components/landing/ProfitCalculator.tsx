"use client";

import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export function ProfitCalculator() {
  const { t } = useLanguage();

  const [docsPerDay, setDocsPerDay] = useState(25);
  const [salePrice, setSalePrice] = useState(250);

  // Estimations:
  // Average points cost per document ≈ 10 points ≈ 30 DZD cost to shop
  const estimatedCostPerDoc = 30;
  const workDaysPerMonth = 26;

  const monthlyGrossRevenue = docsPerDay * salePrice * workDaysPerMonth;
  const monthlyCost = docsPerDay * estimatedCostPerDoc * workDaysPerMonth;
  const monthlyNetProfit = Math.max(0, monthlyGrossRevenue - monthlyCost);

  return (
    <section id="calculator" className="py-16 sm:py-24 border-b border-slate-800/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            حاسبة الأرباح التفاعلية
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
            {t("landing.calcTitle")}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            {t("landing.calcSubtitle")}
          </p>
        </div>

        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Sliders Controls */}
            <div className="space-y-6">
              {/* Slider 1: Docs per day */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-200">
                    {t("landing.calcDocsPerDay")}
                  </label>
                  <span className="text-base font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 font-mono">
                    {docsPerDay} وثيقة / يوم
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={docsPerDay}
                  onChange={(e) => setDocsPerDay(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                  <span>5 وثائق</span>
                  <span>50 وثيقة</span>
                  <span>120 وثيقة</span>
                </div>
              </div>

              {/* Slider 2: Average Sale Price */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-200">
                    {t("landing.calcAvgPrice")}
                  </label>
                  <span className="text-base font-extrabold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-lg border border-teal-500/20 font-mono">
                    {salePrice} دج
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="600"
                  step="25"
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                  <span>50 دج</span>
                  <span>300 دج</span>
                  <span>600 دج</span>
                </div>
              </div>

              <div className="text-xs text-slate-400 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                💡 الحساب مبني على 26 يوم عمل شهرياً ومتوسط تكلفة 10 نقاط (≈30 دج) للوثيقة الواحدة.
              </div>
            </div>

            {/* Results Showcase Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 text-center relative overflow-hidden">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                {t("landing.calcNetProfit")}
              </div>

              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight my-4 font-mono text-emerald-400 drop-shadow-sm">
                {monthlyNetProfit.toLocaleString()} <span className="text-xl sm:text-2xl font-bold">دج</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/50">
                  <div className="text-slate-400 mb-1">مداخيل المحل</div>
                  <div className="text-sm font-bold text-slate-200 font-mono">
                    {monthlyGrossRevenue.toLocaleString()} دج
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/50">
                  <div className="text-slate-400 mb-1">تكلفة النقاط</div>
                  <div className="text-sm font-bold text-slate-300 font-mono">
                    {monthlyCost.toLocaleString()} دج
                  </div>
                </div>
              </div>

              <div className="mt-4 text-[11px] text-emerald-400/90 font-medium">
                ✨ هامش ربح يقارب 85% لكيوسكك أو مكتبتك
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
