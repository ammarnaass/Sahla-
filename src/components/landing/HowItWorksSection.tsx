"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export function HowItWorksSection() {
  const { t } = useLanguage();

  const steps = [
    {
      num: "01",
      icon: "📱",
      title: t("landing.step1Title"),
      desc: t("landing.step1Desc"),
      detail: "برقم هاتفك (05/06/07) فقط، دون تعقيد كلمات المرور",
    },
    {
      num: "02",
      icon: "⚡",
      title: t("landing.step2Title"),
      desc: t("landing.step2Desc"),
      detail: "حقول واضحة، تدقيق آلي، وقوالب تحترم الإدارة الجزائرية",
    },
    {
      num: "03",
      icon: "🖨️",
      title: t("landing.step3Title"),
      desc: t("landing.step3Desc"),
      detail: "ملف PDF عالي الدقة جاهز للطباعة أو الإرسال بالواتساب للزبون",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 border-b border-slate-800/60 bg-slate-950/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            خطوات بسيطة وسريعة
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
            {t("landing.howItWorksTitle")}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            انتقل من فتح الموقع إلى تسليم الوثيقة للزبون في أقل من 5 دقائق
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 group hover:-translate-y-1 shadow-lg"
            >
              {/* Step number badge */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  {step.icon}
                </span>
                <span className="text-4xl font-black text-slate-800 group-hover:text-emerald-500/20 transition-colors font-mono">
                  {step.num}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                {step.title}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                {step.desc}
              </p>
              <div className="text-xs text-slate-400 font-medium pt-3 border-t border-slate-800/80 flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span>
                <span>{step.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
