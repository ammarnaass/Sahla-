"use client";

import React from "react";
import Link from "next/link";
import { Button as MuiButton } from "@mui/material";
import { Check, CheckCircle2, Star } from "lucide-react";
import { PricingPlan } from "@/config/pricing-plans";

interface PricingCardProps {
  plan: PricingPlan;
  isAnnual: boolean;
}

export function PricingCard({ plan, isAnnual }: PricingCardProps) {
  const displayPrice = isAnnual ? plan.annualPrice : plan.monthlyPrice;
  const isFree = plan.monthlyPrice === 0;

  const formatDZD = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div
      className={`rounded-3xl p-8 bg-card flex flex-col justify-between transition-all duration-300 relative ${
        plan.popular
          ? "border-2 border-emerald-500/80 shadow-2xl shadow-emerald-500/15 lg:-translate-y-3"
          : "border border-border hover:shadow-lg"
      }`}
    >
      {/* Popular Highlight Badge */}
      {plan.popular && (
        <div className="absolute -top-4 right-1/2 translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-black tracking-wide shadow-md flex items-center gap-1.5 whitespace-nowrap">
          <Star size={14} className="fill-white" /> الأكثر طلباً للمحلات
        </div>
      )}

      <div>
        <div className={`flex items-center justify-between mb-4 ${plan.popular ? "mt-2" : ""}`}>
          <span className="text-xl font-bold text-foreground font-cairo">
            {plan.name}
          </span>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              plan.popular
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-black"
                : "bg-muted text-muted-foreground border border-border"
            }`}
          >
            {plan.badge}
          </span>
        </div>

        <p className="text-xs text-muted-foreground mb-6 font-cairo leading-relaxed">
          {plan.description}
        </p>

        {/* Price Display */}
        <div className="mb-2 flex items-baseline gap-1">
          <span
            className={`font-black font-cairo ${
              plan.popular
                ? "text-5xl text-emerald-600 dark:text-emerald-400"
                : "text-4xl text-foreground"
            }`}
          >
            {isFree ? "0" : formatDZD(displayPrice)}
          </span>
          <span className="text-xl font-bold text-muted-foreground font-cairo">دج</span>
          <span className="text-xs text-muted-foreground mr-1">/ شهرياً</span>
        </div>

        <p className="text-[11px] text-muted-foreground mb-6">
          {isFree
            ? "بدون بطاقة دفع وبدون التزام"
            : isAnnual
            ? `تُدفع ${formatDZD(displayPrice * 12)} دج سنوياً (توفير 20%)`
            : "تُجدد شهرياً وتلغى في أي وقت"}
        </p>

        <div className="h-px bg-border my-6" />

        {/* Features List */}
        <div className="space-y-3.5 text-sm text-foreground mb-8">
          {plan.features.map((feat, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2.5 ${
                !feat.included ? "text-muted-foreground line-through opacity-40" : ""
              } ${feat.highlight ? "font-bold text-emerald-600 dark:text-emerald-400" : ""}`}
            >
              {feat.included ? (
                feat.highlight ? (
                  <CheckCircle2 size={18} className="shrink-0" />
                ) : (
                  <Check size={18} className="text-emerald-500 shrink-0" />
                )
              ) : (
                <Check size={18} className="shrink-0 opacity-30" />
              )}
              <span>{feat.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <Link href={plan.ctaHref} className="w-full">
        <MuiButton
          fullWidth
          variant={plan.ctaVariant}
          size="large"
          disableElevation
          sx={{
            borderRadius: "12px",
            py: plan.popular ? 1.6 : 1.4,
            fontWeight: 800,
            fontSize: plan.popular ? "1rem" : "0.95rem",
            bgcolor: plan.popular ? "primary.main" : undefined,
            borderColor: !plan.popular ? "border" : undefined,
            color: !plan.popular ? "text.primary" : "#fff",
            "&:hover": {
              bgcolor: plan.popular ? "primary.dark" : "action.hover",
              borderColor: !plan.popular ? "primary.main" : undefined,
            },
            boxShadow: plan.popular ? "0 10px 20px -5px rgba(16, 185, 129, 0.4)" : undefined,
          }}
        >
          {plan.ctaText}
        </MuiButton>
      </Link>
    </div>
  );
}
