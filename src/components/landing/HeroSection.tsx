"use client";

import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import {
  FileText,
  Receipt,
  ScanLine,
  Camera,
  Printer,
  ShieldCheck,
  Sparkles,
  Zap,
  Play,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

interface HeroSectionProps {
  onStartFree: () => void;
}

export function HeroSection({ onStartFree }: HeroSectionProps) {
  const { t } = useLanguage();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<"CV" | "INVOICE" | "OCR" | "PHOTO">("CV");

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-24 lg:pb-32 border-b border-border">
      {/* Background glowing gradients & radial effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-emerald-500/15 to-teal-400/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[320px] h-[320px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Tag Pill - Material 3 Tonal Chip */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-card/90 border border-primary/30 text-primary text-xs sm:text-sm font-bold mb-8 shadow-xs backdrop-blur-md">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
          </span>
          <span>منظومة الخدمات والطباعة السحابية الأولى للأكشاك والمكتبات في 58 ولاية 🇩🇿</span>
        </div>

        {/* Main Title with Emerald Gradient */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.2] mb-6 font-display">
          <span className="block text-foreground">{t("landing.heroTitle")}</span>
          <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-500">
            طباعة، رقمنة، وفواتير تجارية في ثوانٍ
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
          {t("landing.heroSubtitle")}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Button
            size="lg"
            variant="primary"
            onClick={onStartFree}
            className="w-full sm:w-auto px-9 text-base shadow-lg shadow-emerald-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer font-bold"
            rightIcon={<ArrowLeft className="w-5 h-5" />}
          >
            <span>{t("common.startFree")}</span>
          </Button>

          <Button
            size="lg"
            variant="secondary"
            onClick={() => setShowDemoModal(true)}
            className="w-full sm:w-auto px-7 text-base cursor-pointer transition-colors"
            leftIcon={<Play className="w-4 h-4 fill-primary text-primary" />}
          >
            <span>{t("common.watchDemo")}</span>
          </Button>
        </div>

        {/* Value Props Strip */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap text-xs sm:text-sm text-muted-foreground font-semibold mb-14">
          <Badge variant="primary" className="py-1 px-3 gap-1.5 font-bold">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>50 نقطة ترحيبية مجاناً</span>
          </Badge>
          <span className="inline-flex items-center gap-1.5 text-foreground font-medium">
            <Zap className="w-4 h-4 text-amber-500" />
            جسر طباعة لاسلكي فوري
          </span>
          <span className="inline-flex items-center gap-1.5 text-foreground font-medium">
            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            مطابقة تامة لقوانين التجارة والضرائب
          </span>
        </div>

        {/* Hero Interactive Bento Preview Card - Material 3 Surface */}
        <Card className="max-w-4xl mx-auto p-5 sm:p-7 shadow-lg backdrop-blur-2xl text-right border-border">
          {/* Top Bar simulating real SaaS system */}
          <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              <span className="text-xs text-muted-foreground font-mono mr-2 hidden sm:inline">sahla.app/dashboard</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-3 py-1 rounded-full border border-border">
                <Printer className="w-3.5 h-3.5 text-primary" />
                <span className="hidden sm:inline">طابعة الكاونتر:</span>
                <span className="text-primary font-bold">متصلة</span>
              </div>
              <Badge variant="primary" className="font-black text-xs">
                50 نقطة كهدية
              </Badge>
            </div>
          </div>

          {/* 4 Interactive Service Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setSelectedPreview("CV")}
              className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                selectedPreview === "CV"
                  ? "bg-primary/10 border-primary shadow-xs ring-1 ring-primary/30"
                  : "bg-muted/40 hover:bg-muted/70 border-border"
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-2">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="text-xs font-bold text-foreground">سيرة ذاتية ATS</div>
              <div className="text-[10px] text-primary mt-0.5 font-medium">15 نقطة · جاهزة فوراً</div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPreview("INVOICE")}
              className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                selectedPreview === "INVOICE"
                  ? "bg-primary/10 border-primary shadow-xs ring-1 ring-primary/30"
                  : "bg-muted/40 hover:bg-muted/70 border-border"
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-2">
                <Receipt className="w-5 h-5 text-primary" />
              </div>
              <div className="text-xs font-bold text-foreground">فاتورة تجارية B2B</div>
              <div className="text-[10px] text-primary mt-0.5 font-medium">10 نقاط · NIF + TVA</div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPreview("OCR")}
              className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                selectedPreview === "OCR"
                  ? "bg-primary/10 border-primary shadow-xs ring-1 ring-primary/30"
                  : "bg-muted/40 hover:bg-muted/70 border-border"
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-2">
                <ScanLine className="w-5 h-5 text-primary" />
              </div>
              <div className="text-xs font-bold text-foreground">مسح الـ OCR الذكي</div>
              <div className="text-[10px] text-primary mt-0.5 font-medium">10 نقاط · ملء تلقائي</div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPreview("PHOTO")}
              className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                selectedPreview === "PHOTO"
                  ? "bg-primary/10 border-primary shadow-xs ring-1 ring-primary/30"
                  : "bg-muted/40 hover:bg-muted/70 border-border"
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-2">
                <Camera className="w-5 h-5 text-primary" />
              </div>
              <div className="text-xs font-bold text-foreground">صور الهوية 3.5×4.5</div>
              <div className="text-[10px] text-primary mt-0.5 font-medium">مجاني · 8 صور جاهزة</div>
            </button>
          </div>

          {/* Live Dynamic Preview Container */}
          <div className="p-4 sm:p-5 rounded-2xl bg-muted/40 border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1.5 text-right w-full sm:w-auto">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-primary">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span>
                  {selectedPreview === "CV" && "نموذج سيرة ذاتية قياسية (الجمهورية الجزائرية الديمقراطية الشعبية)"}
                  {selectedPreview === "INVOICE" && "فاتورة مطابقة للقانون التجاري والجبائي الجزائري (G50 / NIF)"}
                  {selectedPreview === "OCR" && "استخراج بيانات بطاقة التعريف الوطنية البيومترية بنقرة واحدة"}
                  {selectedPreview === "PHOTO" && "لوح طباعة مقاس 10×15 سم يحتوي على 8 صور بيومترية دقيقة"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                جاهز للإرسال الفوري إلى أي طابعة ليزرية أو حرارية، أو التصدير بصيغة PDF عالية الدقة للزبون.
              </p>
            </div>

            <Button
              size="sm"
              variant="primary"
              onClick={onStartFree}
              className="shrink-0 w-full sm:w-auto text-xs px-6 py-2.5 font-bold shadow-sm cursor-pointer"
            >
              جرب هذا النموذج مجاناً
            </Button>
          </div>
        </Card>
      </div>

      {/* Demo Video/Walkthrough Modal */}
      <Modal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        title="شاهد كيف تعمل منصة سهلة في 40 ثانية"
        description="تجربة سريعة توضح كيف تنجز أول وثيقة لزبونك وتسلمها له فوراً"
        maxWidth="lg"
      >
        <div className="space-y-4 text-right">
          <div className="aspect-video rounded-xl bg-muted/60 border border-border flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/15 text-primary flex items-center justify-center mb-4 border border-primary/30">
              <Play className="w-8 h-8 fill-primary" />
            </div>
            <h4 className="text-base font-bold text-foreground mb-2">عرض توضيحي تفاعلي</h4>
            <p className="text-xs text-muted-foreground max-w-sm">
              1. اختر السيرة الذاتية ← 2. اكتب اسم ومؤهلات الزبون ← 3. اضغط «تحميل PDF» واطبع فوراً!
            </p>
          </div>
          <Button
            variant="primary"
            className="w-full cursor-pointer font-bold"
            onClick={() => {
              setShowDemoModal(false);
              onStartFree();
            }}
          >
            جرب الآن مجاناً مع 50 نقطة
          </Button>
        </div>
      </Modal>
    </section>
  );
}

