"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export function WhySahlaSection() {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: "💎",
      title: t("landing.why1Title"),
      desc: t("landing.why1Desc"),
      stat: "0 دج اشتراك",
    },
    {
      icon: "🇩🇿",
      title: t("landing.why2Title"),
      desc: t("landing.why2Desc"),
      stat: "100% جزائري",
    },
    {
      icon: "⚡",
      title: t("landing.why3Title"),
      desc: t("landing.why3Desc"),
      stat: "< 800KB خفيف جداً",
    },
    {
      icon: "🌍",
      title: t("landing.why4Title"),
      desc: t("landing.why4Desc"),
      stat: "3 لغات معتمدة",
    },
  ];

  return (
    <section className="py-16 sm:py-24 border-b border-slate-800/60 bg-slate-950/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            مميزات مصممة لراحتك
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
            {t("landing.whyTitle")}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            وداعاً للبرامج المعقدة وتضييع وقت الزبائن على أجهزة الكمبيوتر البطيئة
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all p-6 flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 inline-block mb-5">
                  {b.icon}
                </span>
                <h3 className="text-lg font-bold text-white mb-2">{b.title}</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{b.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
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
