"use client";

import React from "react";
import Link from "next/link";
import { Container, Button as MuiButton } from "@mui/material";
import { Sparkles, ArrowRight, Star, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { KioskPreview } from "./KioskPreview";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 border-b border-border/50">
      {/* Subtle Ambient Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-emerald-500/15 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-32 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <Container maxWidth="lg" sx={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* Modern Top Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-bold mb-8 shadow-sm backdrop-blur-md animate-pulse">
          <Sparkles size={16} />
          المنظومة السحابية الذكية الأولى لكاونتر الطباعة والأكشاك في الجزائر 🇩🇿
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.15] mb-6 font-cairo">
          أنجز مهام زبائنك في ثوانٍ،
          <br />
          <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent">
            بأقصى سرعة وبأعلى ربحية.
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground font-medium mb-10 leading-relaxed font-cairo">
          ودّع الفلاش ديسك ومجموعات الواتساب البطيئة. استقبل ملفات الزبائن مباشرة عبر رمز QR، واطبعها لاسلكياً بضغطة زر مع إدارة متكاملة للمبيعات والمخزون.
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link href="/register" className="w-full sm:w-auto">
            <MuiButton
              variant="contained"
              size="large"
              disableElevation
              endIcon={<ArrowRight size={20} />}
              sx={{
                borderRadius: "12px",
                px: 4,
                py: 1.6,
                fontSize: "1.05rem",
                fontWeight: 800,
                width: { xs: "100%", sm: "auto" },
                bgcolor: "#10b981",
                "&:hover": { bgcolor: "#059669" },
                boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)",
              }}
            >
              ابدأ مجاناً بـ 50 نقطة طباعة
            </MuiButton>
          </Link>

          <a href="#plans" className="w-full sm:w-auto">
            <MuiButton
              variant="outlined"
              size="large"
              sx={{
                borderRadius: "12px",
                px: 3.5,
                py: 1.6,
                fontSize: "1.05rem",
                fontWeight: 700,
                width: { xs: "100%", sm: "auto" },
                borderColor: "divider",
                color: "text.primary",
                "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
              }}
            >
              استكشف الخطط والأسعار
            </MuiButton>
          </a>
        </div>

        {/* Social Proof & Metrics Strip */}
        <div className="inline-flex flex-wrap items-center justify-center gap-6 sm:gap-10 py-3 px-6 rounded-2xl bg-card border border-border shadow-sm text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>{siteConfig.activeShopsCount} كشك ومكتبة نشطة</span>
          </div>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            <Star size={16} className="text-amber-400 fill-amber-400" />
            <span>{siteConfig.rating} / 5 تقييم الشركاء</span>
          </div>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>مطابق لـ {siteConfig.complianceLaw}</span>
          </div>
        </div>

        {/* Kiosk Interactive Preview */}
        <KioskPreview />
      </Container>
    </section>
  );
}
