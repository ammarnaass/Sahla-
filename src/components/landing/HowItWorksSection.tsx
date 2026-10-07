"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PhoneIcon, BoltIcon, WirelessPrintIcon, CheckCircleIcon } from "@/components/ui/Icons";

export function HowItWorksSection() {
  const { t } = useLanguage();

  const steps = [
    {
      num: "01",
      icon: <PhoneIcon size={26} className="text-emerald-400" />,
      title: t("landing.step1Title"),
      desc: t("landing.step1Desc"),
      detail: "بحسابك أو برقم هاتفك الجزائري (05/06/07) في ثوانٍ",
    },
    {
      num: "02",
      icon: <BoltIcon size={26} className="text-amber-400" />,
      title: t("landing.step2Title"),
      desc: t("landing.step2Desc"),
      detail: "حقول واضحة، تدقيق آلي، وقوالب تحترم المعايير الإدارية الجزائرية",
    },
    {
      num: "03",
      icon: <WirelessPrintIcon size={26} className="text-teal-400" />,
      title: t("landing.step3Title"),
      desc: t("landing.step3Desc"),
      detail: "ملف PDF عالي الدقة جاهز للطباعة المباشرة أو الإرسال الفوري للزبون",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            خطوات بسيطة وسريعة
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-4 tracking-tight">
            {t("landing.howItWorksTitle")}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3">
            انتقل من فتح الموقع إلى تسليم الوثيقة للزبون في أقل من 5 دقائق
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 transition-all duration-300 group hover:-translate-y-1 shadow-sm"
            >
              {/* Step number badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <span className="text-4xl font-black text-slate-200 dark:text-slate-800 group-hover:text-emerald-500/20 transition-colors font-mono">
                  {step.num}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {step.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3">
                {step.desc}
              </p>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center gap-2">
                <CheckCircleIcon size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{step.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
