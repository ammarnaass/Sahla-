"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SAAS_PLANS, SaaSPlan } from "@/server/config/constants";
import {
  CheckCircleIcon,
  CardEpayIcon,
  ArrowLeftIcon,
  CrownIcon,
  SparklesIcon,
  TrendUpIcon,
  ShieldCheckIcon,
  BoltIcon,
} from "@/components/ui/Icons";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<SaaSPlan | null>(null);
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeNotice, setUpgradeNotice] = useState<string | null>(null);

  // Profit estimation calculator
  const [dailyDocs, setDailyDocs] = useState<number>(30);
  const [avgPrice, setAvgPrice] = useState<number>(200);

  const monthlyRevenue = dailyDocs * avgPrice * 26; // 26 working days
  const platformCost = billingCycle === "monthly" ? 2500 : 2000;
  const netKioskProfit = monthlyRevenue - platformCost;

  const handleUpgrade = async (plan: SaaSPlan) => {
    if (plan.id === "STARTER") {
      setUpgradeNotice("أنت بالفعل على خطة البداية المجانية أو يمكنك استخدامها فوراً!");
      return;
    }

    setSelectedPlan(plan);
    setUpgrading(true);
    setUpgradeNotice(null);

    try {
      const res = await fetch("/api/subscriptions/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId: "shop_1",
          planId: plan.id,
          paymentMethod: "CIB_EDAHABIA",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUpgradeNotice(`تم تفعيل اشتراك [${plan.nameAr}] بنجاح! تم شحن ${data.pointsGranted} نقطة فورية لمكتبتك.`);
      } else {
        setUpgradeNotice(`فشل الترقية: ${data.error}`);
      }
    } catch {
      setUpgradeNotice("حدث خطأ أثناء الاتصال ببوابة الدفع. يرجى المحاولة لاحقاً.");
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/85 dark:bg-slate-950/85 border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              سـ
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-slate-900 dark:text-white">منصة سهلة</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold">
                خطط SaaS
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/25 active:scale-95"
          >
            <span>لوحة التحكم</span>
            <ArrowLeftIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Title */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-800/60 shadow-2xs">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>استثمار مربح ومدروس للمكتبات ومقاهي الإنترنت في الجزائر</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            اختر الخطة المناسبة لحجم نشاطك التجاري
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            كل خطة مصممة بعناية لمضاعفة أرباح كاونترك، مع دعم كامل للطباعة اللاسلكية وبوابات الدفع الوطنية الذهبية و CIB.
          </p>

          {/* Monthly / Yearly Switch */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <span className={`text-xs font-bold transition-colors ${billingCycle === "monthly" ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
              اشتراك شهري
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className="w-14 h-8 bg-slate-200 dark:bg-slate-800 rounded-full p-1 transition-colors relative border border-slate-300 dark:border-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              aria-label="تبديل فترة الاشتراك"
            >
              <div
                className={`w-6 h-6 rounded-full bg-emerald-500 shadow-md transform transition-transform duration-200 ${
                  billingCycle === "yearly" ? "-translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${billingCycle === "yearly" ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
              <span>اشتراك سنوي</span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-[10px] font-extrabold flex items-center gap-1">
                <SparklesIcon className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                <span>خصم 20%</span>
              </span>
            </span>
          </div>
        </div>

        {/* Upgrade Notice Banner */}
        {upgradeNotice && (
          <div
            className={`p-4 rounded-2xl border text-sm font-bold text-center flex items-center justify-center gap-2 transition-all ${
              upgradeNotice.includes("بنجاح")
                ? "bg-emerald-500/15 dark:bg-emerald-950/70 border-emerald-500/40 dark:border-emerald-700/80 text-emerald-800 dark:text-emerald-300"
                : "bg-rose-500/15 dark:bg-rose-950/70 border-rose-500/40 dark:border-rose-700/80 text-rose-800 dark:text-rose-300"
            }`}
          >
            {upgradeNotice.includes("بنجاح") ? (
              <CheckCircleIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <BoltIcon className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0" />
            )}
            <span>{upgradeNotice}</span>
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAAS_PLANS.map((plan) => {
            const price =
              billingCycle === "monthly"
                ? plan.priceMonthlyDZD
                : Math.round(plan.priceYearlyDZD / 12);

            return (
              <div
                key={plan.id}
                className={`relative bg-white dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 shadow-2xs hover:shadow-xl ${
                  plan.isPopular
                    ? "border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/10 dark:bg-slate-900/90"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 right-6 px-3.5 py-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-full text-[11px] font-black shadow-md flex items-center gap-1.5">
                    <CrownIcon className="w-3.5 h-3.5 text-white" />
                    <span>الخيار الأكثر اختياراً للمكتبات</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">{plan.nameAr}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">{plan.nameFr}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center shrink-0">
                      {plan.id === "PRO_KIOSK" ? (
                        <CrownIcon className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                      ) : plan.id === "ENTERPRISE" ? (
                        <SparklesIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <BoltIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      )}
                    </div>
                  </div>

                  <div className="pt-2 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
                        {price.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">دج / شهرياً</span>
                    </div>
                    {billingCycle === "yearly" && plan.priceYearlyDZD > 0 && (
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1.5 font-semibold flex items-center gap-1">
                        <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>يُدفع {plan.priceYearlyDZD.toLocaleString()} دج سنوياً (توفير شهرين)</span>
                      </p>
                    )}
                  </div>

                  {/* Feature list */}
                  <div className="space-y-2.5 pt-2">
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-300">المميزات المضمنة في الباقة:</span>
                    <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircleIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800/80">
                  <button
                    disabled={upgrading}
                    onClick={() => handleUpgrade(plan)}
                    className={`w-full py-3 rounded-xl font-black text-xs transition duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                      plan.isPopular
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white border border-slate-300 dark:border-slate-700/80"
                    }`}
                  >
                    {upgrading && selectedPlan?.id === plan.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>جاري معالجة الطلب...</span>
                      </>
                    ) : plan.priceMonthlyDZD === 0 ? (
                      <span>ابدأ التجربة المجانية</span>
                    ) : (
                      <>
                        <CardEpayIcon className="w-4 h-4" />
                        <span>ترقية المحل الآن</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ROI Profit Calculator */}
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm backdrop-blur-sm">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold bg-teal-500/10 dark:bg-teal-950 text-teal-700 dark:text-teal-400 border border-teal-500/20 dark:border-teal-800/60">
              <TrendUpIcon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>حاسبة العائد على الاستثمار لمكتبتك</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              كم ستربح شهرياً عند استخدام منصة سهلة؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              قم بتحريك المؤشرات لتوقع إيراداتك وأرباحك الصافية بناءً على حجم نشاطك:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-700 dark:text-slate-300">متوسط الوثائق المنجزة يومياً:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-mono font-black">{dailyDocs} وثيقة / يومياً</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={dailyDocs}
                  onChange={(e) => setDailyDocs(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-700 dark:text-slate-300">متوسط سعر بيع الوثيقة للزبون:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-mono font-black">{avgPrice} دج</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="500"
                  step="25"
                  value={avgPrice}
                  onChange={(e) => setAvgPrice(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
                />
              </div>
            </div>

            {/* Profit Summary Card */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-emerald-500/20 dark:border-emerald-900/40 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
                <span>إجمالي الإيراد المتوقع (26 يوم):</span>
                <span className="font-extrabold text-slate-900 dark:text-white font-mono">{monthlyRevenue.toLocaleString()} دج</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
                <span>تكلفة اشتراك باقة سهلة Pro:</span>
                <span className="font-extrabold text-rose-600 dark:text-rose-400 font-mono">-{platformCost.toLocaleString()} دج</span>
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">صافي ربح محلك الشهري:</span>
                <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300 font-mono">
                  {netKioskProfit.toLocaleString()} دج
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center pt-1 leading-relaxed">
                تغطي تكلفة الاشتراك من أول يومين عمل فقط، وباقي الشهر أرباح صافية لمكتبتك!
              </p>
            </div>
          </div>
        </div>

        {/* Wholesale Cards Banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-white to-teal-50/60 dark:from-emerald-950/60 dark:to-slate-900 border border-emerald-200 dark:border-emerald-800/40 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 text-right">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <CardEpayIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>هل أنت موزع أو صاحب مكتبة كبرى ترغب ببيع كروت التعبئة؟</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              نوفر خدمة طباعة بطاقات الشحن الورقية بالجملة (A4 Scratch Cards) بأسعار تفاضلية وهامش ربح مضمون لموزعي الولايات.
            </p>
          </div>

          <Link
            href="/dashboard#wallet"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition shrink-0 shadow-lg shadow-emerald-600/30 active:scale-95"
          >
            <span>طلب كروت الشحن بالجملة</span>
            <ArrowLeftIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
