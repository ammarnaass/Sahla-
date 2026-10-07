"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SparklesIcon, ShieldCheckIcon, BoltIcon, CustomersIcon } from "@/components/ui/Icons";

export function WhySahlaSection() {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: <SparklesIcon size={24} className="text-emerald-400" />,
      title: t("landing.why1Title"),
      desc: t("landing.why1Desc"),
      stat: "0 دج اشتراك شهري",
    },
    {
      icon: <ShieldCheckIcon size={24} className="text-teal-400" />,
      title: t("landing.why2Title"),
      desc: t("landing.why2Desc"),
      stat: "100% جزائري ومطابق",
    },
    {
      icon: <BoltIcon size={24} className="text-amber-400" />,
      title: t("landing.why3Title"),
      desc: t("landing.why3Desc"),
      stat: "< 800KB فائق السرعة",
    },
    {
      icon: <CustomersIcon size={24} className="text-cyan-400" />,
      title: t("landing.why4Title"),
      desc: t("landing.why4Desc"),
      stat: "عربي · فرنسي · إنجليزي",
    },
  ];

  return (
    <section className="py-20 sm:py-28 border-b border-slate-200 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/40 transition-colors relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <span>لماذا يختار أصحاب الأكشاك سهلة؟</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {t("landing.whyTitle")}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-4 leading-relaxed font-medium">
            وداعاً للبرامج المعقدة وتضييع وقت الزبائن على أجهزة الكمبيوتر البطيئة
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between group shadow-sm hover:shadow-xl hover:-translate-y-1"
            >
              <div>
                <div className="w-13 h-13 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {b.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">{b.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">{b.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/80">
                <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 inline-block font-mono">
                  {b.stat}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
