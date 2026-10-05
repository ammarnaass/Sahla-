import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrendUpIcon, SparklesIcon, BoltIcon } from "@/components/ui/Icons";

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
    <section id="calculator" className="py-20 sm:py-28 border-b border-slate-200 dark:border-slate-800/60 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <TrendUpIcon size={16} />
            <span>حاسبة الأرباح التقديرية للمحلات</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {t("landing.calcTitle")}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-4 leading-relaxed font-medium">
            {t("landing.calcSubtitle")}
          </p>
        </div>

        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Sliders Controls */}
            <div className="space-y-6">
              {/* Slider 1: Docs per day */}
              <div>
                <div className="flex justify-between items-center mb-2.5">
                  <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {t("landing.calcDocsPerDay")}
                  </label>
                  <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 font-mono">
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
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                  <span>5 وثائق</span>
                  <span>50 وثيقة</span>
                  <span>120 وثيقة</span>
                </div>
              </div>

              {/* Slider 2: Average Sale Price */}
              <div>
                <div className="flex justify-between items-center mb-2.5">
                  <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {t("landing.calcAvgPrice")}
                  </label>
                  <span className="text-sm font-extrabold text-teal-700 dark:text-teal-400 bg-teal-500/10 px-3 py-1 rounded-xl border border-teal-500/20 font-mono">
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
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                  <span>50 دج</span>
                  <span>300 دج</span>
                  <span>600 دج</span>
                </div>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-400 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5 leading-relaxed">
                <BoltIcon size={16} className="text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>الحساب مبني على 26 يوم عمل شهرياً ومتوسط تكلفة 10 نقاط (≈30 دج) للوثيقة الواحدة.</span>
              </div>
            </div>

            {/* Results Showcase Card */}
            <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-teal-50/70 dark:from-emerald-950/70 dark:via-slate-900 dark:to-slate-900 border border-emerald-200 dark:border-emerald-500/30 text-center relative overflow-hidden shadow-sm">
              <div className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2">
                {t("landing.calcNetProfit")}
              </div>

              <div className="text-4xl sm:text-5xl font-black tracking-tight my-4 font-mono text-emerald-700 dark:text-emerald-400 drop-shadow-2xs">
                {monthlyNetProfit.toLocaleString()} <span className="text-xl sm:text-2xl font-bold">دج</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/40">
                  <div className="text-slate-500 dark:text-slate-400 mb-1 font-medium">مداخيل المحل</div>
                  <div className="text-sm font-black text-slate-900 dark:text-slate-200 font-mono">
                    {monthlyGrossRevenue.toLocaleString()} دج
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/40">
                  <div className="text-slate-500 dark:text-slate-400 mb-1 font-medium">تكلفة النقاط</div>
                  <div className="text-sm font-black text-slate-900 dark:text-slate-300 font-mono">
                    {monthlyCost.toLocaleString()} دج
                  </div>
                </div>
              </div>

              <div className="mt-5 text-xs text-emerald-800 dark:text-emerald-300/90 font-bold flex items-center justify-center gap-1.5">
                <SparklesIcon size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>هامش ربح يقارب 85% لكيوسكك أو مكتبتك</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
