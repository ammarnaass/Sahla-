"use client";

import React, { useState } from "react";
import { Container } from "@mui/material";
import { Sparkles, ShieldCheck } from "lucide-react";
import { pricingPlans } from "@/config/pricing-plans";
import { PricingCard } from "./PricingCard";

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="plans" className="py-24 sm:py-32 bg-muted/30 border-b border-border relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/20">
            <Sparkles size={14} /> باقات مرنة تناسب كل حجم عمل
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-foreground font-cairo tracking-tight">
            خطط تسعير واضحة وبسيطة،
            <br />
            <span className="text-emerald-600 dark:text-emerald-400">بدون أي تكاليف خفية</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg mt-3 font-cairo">
            اختر الخطة المناسبة لنشاطك، ويمكنك الترقية أو الإلغاء في أي وقت بنقرة واحدة.
          </p>

          {/* Monthly / Annual Toggle Switch */}
          <div className="mt-8 inline-flex items-center p-1 rounded-2xl bg-card border border-border shadow-sm">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                !isAnnual
                  ? "bg-foreground text-background shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              الدفع الشهري
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-200 ${
                isAnnual
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              الدفع السنوي
              <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-amber-400 text-slate-900 animate-bounce">
                وفّر 20% 🎉
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} isAnnual={isAnnual} />
          ))}
        </div>

        {/* Money-Back Guarantee Notice */}
        <div className="mt-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2 font-medium">
          <ShieldCheck size={18} className="text-emerald-500" />
          <span>ضمان استرجاع الأموال 100% خلال 14 يوماً إذا لم تناسبك الخدمة، بدون أي أسئلة.</span>
        </div>
      </Container>
    </section>
  );
}
