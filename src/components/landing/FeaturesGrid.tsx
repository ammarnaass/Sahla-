"use client";

import React from "react";
import { Container } from "@mui/material";
import {
  Zap,
  Printer,
  ShieldCheck,
  CreditCard,
  Store,
  TrendingUp,
} from "lucide-react";
import { platformFeatures } from "@/config/features";

const iconMap = {
  Printer: Printer,
  ShieldCheck: ShieldCheck,
  CreditCard: CreditCard,
  Store: Store,
  TrendingUp: TrendingUp,
  Zap: Zap,
};

export function FeaturesGrid() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-muted/20 border-b border-border">
      <Container maxWidth="lg">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/20">
            <Zap size={14} /> مميزات صُممت خصيصاً للواقع الجزائري
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground font-cairo">
            كل ما تحتاجه لإدارة محلك باحترافية وسرعة قياسية
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg mt-3 font-cairo">
            تم تصميم كل ميزة لتوفير دقائق ثمينة وزيادة مداخيلك اليومية بدون تعقيد تقني.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {platformFeatures.map((feat) => {
            const IconComponent = iconMap[feat.iconName] || Zap;
            return (
              <div
                key={feat.id}
                className="p-6 rounded-2xl bg-card border border-border hover:border-emerald-500/40 transition-all duration-300 shadow-sm group"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform ${feat.colorClass}`}
                >
                  <IconComponent size={24} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 font-cairo">
                  {feat.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-cairo">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
