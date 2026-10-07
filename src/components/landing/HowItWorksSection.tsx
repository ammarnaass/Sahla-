"use client";

import React from "react";
import { Container } from "@mui/material";

export function HowItWorksSection() {
  const steps = [
    {
      num: 1,
      title: "الزبون يمسح كود QR",
      desc: "يقوم الزبون بمسح الملصق الذكي الموضوع على واجهة كاونترك بكاميرا هاتفه دون تثبيت أي تطبيق.",
      badgeColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    },
    {
      num: 2,
      title: "رفع الملف وتحديد الإعدادات",
      desc: "يختار الزبون عدد النسخ (ألوان أو أبيض وأسود) ويرفع الملف مشفراً في جزء من الثانية.",
      badgeColor: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30",
    },
    {
      num: 3,
      title: "طباعة بضغطة زر واستلام الثمن",
      desc: "يظهر الطلب فوراً في شاشتك، تضغط 'طباعة'، تخرج الورقة وتستلم حسابك بدقة وسرعة.",
      badgeColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 border-b border-border">
      <Container maxWidth="lg">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            بساطة مطلقة
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground mt-2 font-cairo">
            كيف تعمل منصة سهلة في محلك؟
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step) => (
            <div
              key={step.num}
              className="relative p-6 rounded-2xl bg-card border border-border text-center"
            >
              <div
                className={`w-12 h-12 rounded-2xl font-black text-xl flex items-center justify-center mx-auto mb-4 border ${step.badgeColor}`}
              >
                {step.num}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 font-cairo">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground font-cairo">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
