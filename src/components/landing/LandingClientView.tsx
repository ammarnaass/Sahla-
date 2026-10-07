"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Button as MuiButton,
  Card as MuiCard,
  Typography,
  Container,
  Box,
  IconButton,
  AppBar,
  Toolbar,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
} from "@mui/material";
import {
  Store,
  Printer,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  Check,
  CheckCircle2,
  Zap,
  TrendingUp,
  CreditCard,
  QrCode,
  Users,
  ChevronDown,
  Star,
  Clock,
  HelpCircle,
  FileText,
  BadgeCheck,
  Shield,
  Layers,
  ArrowUpRight,
} from "lucide-react";

export function LandingClientView() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);
  const [pagesPerDay, setPagesPerDay] = useState<number>(120);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? theme : "dark";

  // ROI Calculator Calculations
  const averagePricePerPage = 15; // DZD
  const monthlyRevenue = pagesPerDay * averagePricePerPage * 30;
  const platformCost = isAnnual ? 2000 : 2500; // estimated plan cost
  const netProfit = monthlyRevenue - platformCost;

  const formatDZD = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300 antialiased selection:bg-emerald-500/20 selection:text-emerald-500">
      {/* ─── Navigation Bar ─── */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "background.default",
          borderBottom: "1px solid",
          borderColor: "divider",
          backdropFilter: "blur(16px)",
          backgroundColor:
            currentTheme === "dark"
              ? "rgba(2, 6, 23, 0.85)"
              : "rgba(255, 255, 255, 0.85)",
          zIndex: 50,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between", py: 1, px: { xs: 0, sm: 2 } }}>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-900/25 group-hover:scale-105 transition-transform">
                سـ
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg text-foreground tracking-tight flex items-center gap-1.5 font-cairo">
                  سهلة · Sahla
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    2.0
                  </span>
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  منظومة الكيوسكات والمكتبات في الجزائر
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">
                المميزات
              </a>
              <a href="#how-it-works" className="hover:text-foreground transition-colors">
                طريقة العمل
              </a>
              <a href="#plans" className="hover:text-foreground text-emerald-600 dark:text-emerald-400 font-bold transition-colors">
                الخطط والأسعار
              </a>
              <a href="#calculator" className="hover:text-foreground transition-colors">
                حاسبة الأرباح
              </a>
              <a href="#faq" className="hover:text-foreground transition-colors">
                الأسئلة الشائعة
              </a>
            </div>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <IconButton
                onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                sx={{
                  color: "text.primary",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "10px",
                  p: 1,
                }}
              >
                {currentTheme === "dark" ? (
                  <Sun size={18} className="text-amber-400" />
                ) : (
                  <Moon size={18} className="text-slate-600" />
                )}
              </IconButton>

              <Link href="/login" passHref>
                <MuiButton
                  variant="outlined"
                  sx={{
                    borderRadius: "10px",
                    fontWeight: 700,
                    px: 2.5,
                    py: 0.8,
                    fontSize: "0.875rem",
                    borderColor: "divider",
                    color: "text.primary",
                    "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
                  }}
                >
                  دخول المحل
                </MuiButton>
              </Link>

              <Link href="/register" passHref className="hidden sm:inline-block">
                <MuiButton
                  variant="contained"
                  disableElevation
                  sx={{
                    borderRadius: "10px",
                    fontWeight: 700,
                    px: 2.5,
                    py: 0.8,
                    fontSize: "0.875rem",
                    bgcolor: "#10b981",
                    "&:hover": { bgcolor: "#059669" },
                  }}
                >
                  افتح حساباً مجاناً
                </MuiButton>
              </Link>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* ─── Main Content ─── */}
      <main className="flex-1">
        {/* ─── Hero Section ─── */}
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
                <span>1,240+ كشك ومكتبة نشطة</span>
              </div>
              <div className="h-4 w-px bg-border hidden sm:block" />
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <Star size={16} className="text-amber-400 fill-amber-400" />
                <span>4.9 / 5 تقييم الشركاء</span>
              </div>
              <div className="h-4 w-px bg-border hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span>مطابق للقانون 18-07 لحماية المعطيات</span>
              </div>
            </div>

            {/* ─── Modern Kiosk Interactive Preview Mockup ─── */}
            <div className="mt-14 max-w-4xl mx-auto rounded-3xl p-2 sm:p-3 bg-gradient-to-b from-border/70 to-border/20 border border-border/80 shadow-2xl relative">
              <div className="rounded-2xl bg-card border border-border overflow-hidden text-right">
                {/* Browser/Counter Bar */}
                <div className="px-4 py-3 bg-muted/40 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="mr-3 text-xs font-mono text-muted-foreground">
                      sahla.dz/counter · كاونتر كشك النجاح
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      الطابعة متصلة (Epson L3250)
                    </span>
                  </div>
                </div>

                {/* Simulated Counter Dashboard */}
                <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Left: Live QR Print Reception */}
                  <div className="p-4 rounded-xl bg-background border border-border flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-muted-foreground">
                          رمز استقبال الملفات السريع
                        </span>
                        <QrCode size={18} className="text-emerald-500" />
                      </div>
                      <div className="w-36 h-36 mx-auto rounded-xl bg-emerald-500/10 border-2 border-dashed border-emerald-500/30 flex flex-col items-center justify-center p-3 text-center">
                        <QrCode size={64} className="text-emerald-600 dark:text-emerald-400 mb-1" />
                        <span className="text-[10px] font-bold text-foreground">
                          امسح وارفع وثيقتك
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground text-center mt-3">
                      يمسح الزبون الرمز بهاتفه وتردك الوثيقة جاهزة للطباعة فورياً.
                    </p>
                  </div>

                  {/* Middle: Active Print Queue */}
                  <div className="p-4 rounded-xl bg-background border border-border md:col-span-2">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                        <Printer size={16} className="text-emerald-500" />
                        طابور الطباعة الحي
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                        3 طلبات جديدة
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-600">
                            <FileText size={18} />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-foreground">
                              شهادة_ميلاد_رقمية.pdf
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              صفحة واحدة · أبيض وأسود · الزبون: أمين ز.
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-600">15 دج</span>
                          <button className="px-3 py-1 rounded-md bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition">
                            طباعة 🖨️
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-teal-500/15 flex items-center justify-center text-teal-600">
                            <FileText size={18} />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-foreground">
                              بطاقة_الشفاء_سكان.pdf
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              صفحتان · ملون وجهان · الزبون: مريم ب.
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-600">40 دج</span>
                          <button className="px-3 py-1 rounded-md bg-muted text-foreground text-xs font-bold border border-border">
                            جاهز
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ─── Features Grid Section (Bento Style) ─── */}
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
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-card border border-border hover:border-emerald-500/40 transition-all duration-300 shadow-sm group">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Printer size={24} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 font-cairo">
                  طباعة سحابية حرارية ولاسلكية
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-cairo">
                  اربط طابعتك العادية (USB أو Wi-Fi) ببرنامج الجسر السريع واطبع ملفات الزبائن مباشرة دون الحاجة لنقلها بحاسوبك الشخصي.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-card border border-border hover:border-emerald-500/40 transition-all duration-300 shadow-sm group">
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 font-cairo">
                  حماية تامة ومطابقة القانون 18-07
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-cairo">
                  تشفير كامل للوثائق العائلية والملفات الحساسة مع حذف تلقائي نهائي بعد انقضاء الوقت المحدد دون ترك أي أثر في حاسوبك.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-card border border-border hover:border-emerald-500/40 transition-all duration-300 shadow-sm group">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <CreditCard size={24} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 font-cairo">
                  شحن رصيد سهل (الذهبية / CIB / كروت)
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-cairo">
                  اشحن نقاط كاونترك بالبطاقة الذهبية، CIB، أو بكروت الخدش المعتمدة من موزعي سهلة المعتمدين في ولايتك.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-2xl bg-card border border-border hover:border-emerald-500/40 transition-all duration-300 shadow-sm group">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Store size={24} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 font-cairo">
                  نقطة بيع وجرد المخزون (POS)
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-cairo">
                  سجّل مبيعات الأدوات المدرسية، بطاقات التعبئة، والخدمات المكتبية مع تنبيهات عند نفاد السلع وحساب الأرباح اليومية.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="p-6 rounded-2xl bg-card border border-border hover:border-emerald-500/40 transition-all duration-300 shadow-sm group">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 font-cairo">
                  تقارير وأرباح لحظية دقيقة
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-cairo">
                  تعرّف على دخلك اليومي والشهري، عدد الصفحات المطبوعة، وأكثر الساعات ازدحاماً لتحسين تنظيم كاونترك.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="p-6 rounded-2xl bg-card border border-border hover:border-emerald-500/40 transition-all duration-300 shadow-sm group">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Zap size={24} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 font-cairo">
                  عمل بدون انقطاع وأوفلاين
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-cairo">
                  إذا تباطأ اتصال الإنترنت في المحل، يستمر الكاونتر في تلقي المهام محلياً مع المزامنة التلقائية فور عودة الشبكة.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ─── How it works (3 Simple Steps) ─── */}
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
              {/* Step 1 */}
              <div className="relative p-6 rounded-2xl bg-card border border-border text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black text-xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                  1
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 font-cairo">
                  الزبون يمسح كود QR
                </h3>
                <p className="text-sm text-muted-foreground font-cairo">
                  يقوم الزبون بمسح الملصق الذكي الموضوع على واجهة كاونترك بكاميرا هاتفه دون تثبيت أي تطبيق.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative p-6 rounded-2xl bg-card border border-border text-center">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 font-black text-xl flex items-center justify-center mx-auto mb-4 border border-teal-500/30">
                  2
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 font-cairo">
                  رفع الملف وتحديد الإعدادات
                </h3>
                <p className="text-sm text-muted-foreground font-cairo">
                  يختار الزبون عدد النسخ (ألوان أو أبيض وأسود) ويرفع الملف مشفراً في جزء من الثانية.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative p-6 rounded-2xl bg-card border border-border text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black text-xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                  3
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 font-cairo">
                  طباعة بضغطة زر واستلام الثمن
                </h3>
                <p className="text-sm text-muted-foreground font-cairo">
                  يظهر الطلب فوراً في شاشتك، تضغط "طباعة"، تخرج الورقة وتستلم حسابك بدقة وسرعة.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ─── MODERN PRICING & PLANS SECTION (مثل المواقع العصرية) ─── */}
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

            {/* Pricing Cards Grid (3 Modern SaaS Tiers) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {/* Plan 1: Starter (البداية والتجربة) */}
              <div className="rounded-3xl p-8 bg-card border border-border flex flex-col justify-between hover:shadow-lg transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-foreground font-cairo">
                      باقة البداية (Starter)
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground border border-border">
                      مجاناً للأبد
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-6 font-cairo">
                    مثالية للأكشاك الصغيرة والمكتبات المبتدئة لتجربة المنظومة واستكشاف الفوائد.
                  </p>

                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-foreground font-cairo">0</span>
                    <span className="text-xl font-bold text-muted-foreground font-cairo">دج</span>
                    <span className="text-xs text-muted-foreground mr-1">/ شهرياً</span>
                  </div>

                  <div className="h-px bg-border my-6" />

                  <div className="space-y-3.5 text-sm text-foreground mb-8">
                    <div className="flex items-center gap-2.5">
                      <Check size={18} className="text-emerald-500 shrink-0" />
                      <span>50 صفحة طباعة مجانية شهرياً</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check size={18} className="text-emerald-500 shrink-0" />
                      <span>ربط طابعة محلية واحدة (USB)</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check size={18} className="text-emerald-500 shrink-0" />
                      <span>رمز QR ذكي لاستقبال الوثائق</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check size={18} className="text-emerald-500 shrink-0" />
                      <span>حذف آمن للوثائق بعد 24 ساعة</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-muted-foreground line-through">
                      <Check size={18} className="opacity-30 shrink-0" />
                      <span>نقطة بيع وجرد المخزون POS</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-muted-foreground line-through">
                      <Check size={18} className="opacity-30 shrink-0" />
                      <span>دعم فني مخصص ذو أولوية</span>
                    </div>
                  </div>
                </div>

                <Link href="/register" className="w-full">
                  <MuiButton
                    fullWidth
                    variant="outlined"
                    sx={{
                      borderRadius: "12px",
                      py: 1.4,
                      fontWeight: 700,
                      borderColor: "border",
                      color: "text.primary",
                      "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
                    }}
                  >
                    ابدأ مجاناً الآن
                  </MuiButton>
                </Link>
              </div>

              {/* Plan 2: Pro (الأكثر طلباً - Highlighted with Glow) */}
              <div className="rounded-3xl p-8 bg-card border-2 border-emerald-500/80 shadow-2xl shadow-emerald-500/15 flex flex-col justify-between relative transform lg:-translate-y-3 transition-all duration-300">
                {/* Popular Badge */}
                <div className="absolute -top-4 right-1/2 translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-black tracking-wide shadow-md flex items-center gap-1.5">
                  <Star size={14} className="fill-white" /> الأكثر طلباً للمحلات
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4 mt-2">
                    <span className="text-xl font-bold text-foreground font-cairo">
                      باقة المحترف (Pro)
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      أفضل قيمة
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-6 font-cairo">
                    الخيار الشامل للأكشاك والمكتبات النشطة لزيادة المداخيل وإلغاء الطوابير نهائياً.
                  </p>

                  <div className="mb-2 flex items-baseline gap-1">
                    <span className="text-5xl font-black text-emerald-600 dark:text-emerald-400 font-cairo">
                      {isAnnual ? "2,000" : "2,500"}
                    </span>
                    <span className="text-xl font-bold text-muted-foreground font-cairo">دج</span>
                    <span className="text-xs text-muted-foreground mr-1">/ شهرياً</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-6">
                    {isAnnual ? "تُدفع 24,000 دج سنوياً (توفير 6,000 دج)" : "تُجدد شهرياً وتلغى في أي وقت"}
                  </p>

                  <div className="h-px bg-border my-6" />

                  <div className="space-y-3.5 text-sm text-foreground mb-8">
                    <div className="flex items-center gap-2.5 font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 size={18} className="shrink-0" />
                      <span>طباعة غير محدودة بدون قيود</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check size={18} className="text-emerald-500 shrink-0" />
                      <span>ربط حتى 3 طابعات (USB + Wi-Fi)</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check size={18} className="text-emerald-500 shrink-0" />
                      <span>نقطة بيع POS وإدارة المخزون والسلع</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check size={18} className="text-emerald-500 shrink-0" />
                      <span>تقارير مالية يومية وأرباح لحظية</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check size={18} className="text-emerald-500 shrink-0" />
                      <span>ملصقات QR مطبوعة مجاناً لمحلّك</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check size={18} className="text-emerald-500 shrink-0" />
                      <span>دعم فني ذو أولوية عبر الواتساب والهاتف</span>
                    </div>
                  </div>
                </div>

                <Link href="/register" className="w-full">
                  <MuiButton
                    fullWidth
                    variant="contained"
                    size="large"
                    disableElevation
                    sx={{
                      borderRadius: "12px",
                      py: 1.6,
                      fontWeight: 800,
                      fontSize: "1rem",
                      bgcolor: "#10b981",
                      "&:hover": { bgcolor: "#059669" },
                      boxShadow: "0 10px 20px -5px rgba(16, 185, 129, 0.4)",
                    }}
                  >
                    اشترك الآن وجرّب 14 يوماً مجاناً
                  </MuiButton>
                </Link>
              </div>

              {/* Plan 3: Enterprise (المؤسسات والفروع الكبرى) */}
              <div className="rounded-3xl p-8 bg-card border border-border flex flex-col justify-between hover:shadow-lg transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-foreground font-cairo">
                      باقة الفروع الكبرى (Enterprise)
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      مخصصة للشبكات
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-6 font-cairo">
                    للمراكز الكبرى، مكاتب الطباعة الجامعية، والشبكات ذات الفروع المتعددة.
                  </p>

                  <div className="mb-2 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-foreground font-cairo">
                      {isAnnual ? "5,500" : "6,500"}
                    </span>
                    <span className="text-xl font-bold text-muted-foreground font-cairo">دج</span>
                    <span className="text-xs text-muted-foreground mr-1">/ شهرياً</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-6">
                    {isAnnual ? "تُدفع 66,000 دج سنوياً مع فوترة رسمية" : "تُدفع شهرياً مع عقد مرن"}
                  </p>

                  <div className="h-px bg-border my-6" />

                  <div className="space-y-3.5 text-sm text-foreground mb-8">
                    <div className="flex items-center gap-2.5">
                      <Check size={18} className="text-emerald-500 shrink-0" />
                      <span>طابعات وفروع غير محدودة</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check size={18} className="text-emerald-500 shrink-0" />
                      <span>حسابات متعددة للموظفين مع صلاحيات</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check size={18} className="text-emerald-500 shrink-0" />
                      <span>تخصيص كامل للشعار والهوية البصرية</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check size={18} className="text-emerald-500 shrink-0" />
                      <span>ربط API مخصص بأنظمة خارجية</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check size={18} className="text-emerald-500 shrink-0" />
                      <span>مدير حساب VIP مخصص 24/7</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check size={18} className="text-emerald-500 shrink-0" />
                      <span>فاتورة رسمية وعقد قانوني معتمد</span>
                    </div>
                  </div>
                </div>

                <Link href="/register" className="w-full">
                  <MuiButton
                    fullWidth
                    variant="outlined"
                    sx={{
                      borderRadius: "12px",
                      py: 1.4,
                      fontWeight: 700,
                      borderColor: "border",
                      color: "text.primary",
                      "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
                    }}
                  >
                    تواصل مع المبيعات / انضم
                  </MuiButton>
                </Link>
              </div>
            </div>

            {/* Money-Back Guarantee Notice */}
            <div className="mt-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2 font-medium">
              <ShieldCheck size={18} className="text-emerald-500" />
              <span>ضمان استرجاع الأموال 100% خلال 14 يوماً إذا لم تناسبك الخدمة، بدون أي أسئلة.</span>
            </div>
          </Container>
        </section>

        {/* ─── Interactive ROI Profit Calculator (حاسبة الأرباح) ─── */}
        <section id="calculator" className="py-20 sm:py-28 border-b border-border">
          <Container maxWidth="md">
            <div className="p-8 sm:p-12 rounded-3xl bg-card border border-border shadow-xl">
              <div className="text-center mb-8">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                  آلة حاسبة تفاعلية
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-foreground mt-1 font-cairo">
                  كم ستجني شهرياً مع منظومة سهلة؟
                </h3>
                <p className="text-sm text-muted-foreground mt-2 font-cairo">
                  حرّك المؤشر بحسب متوسط عدد الصفحات التي يطبعها محلك يومياً لرؤية العائد التقريبي:
                </p>
              </div>

              {/* Slider Controller */}
              <div className="mb-10 px-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-foreground">
                    معدل الصفحات اليومية:
                  </span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {pagesPerDay} صفحة / يوم
                  </span>
                </div>
                <Slider
                  value={pagesPerDay}
                  onChange={(_, val) => setPagesPerDay(val as number)}
                  min={20}
                  max={500}
                  step={10}
                  sx={{
                    color: "#10b981",
                    height: 8,
                    "& .MuiSlider-thumb": {
                      width: 24,
                      height: 24,
                      backgroundColor: "#fff",
                      border: "3px solid #10b981",
                    },
                  }}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>20 صفحة (محل هادئ)</span>
                  <span>250 صفحة (متوسط)</span>
                  <span>500+ صفحة (مكتبة جامعية)</span>
                </div>
              </div>

              {/* Results Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                <div className="p-5 rounded-2xl bg-muted/40 border border-border">
                  <div className="text-xs font-bold text-muted-foreground mb-1">
                    الدخل الشهري المتوقع من الطباعة
                  </div>
                  <div className="text-3xl font-black text-foreground font-mono">
                    {formatDZD(monthlyRevenue)} دج
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                    صافي الربح الإضافي التقديري
                  </div>
                  <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {formatDZD(netProfit)} دج
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link href="/register">
                  <MuiButton
                    variant="contained"
                    size="large"
                    disableElevation
                    sx={{
                      borderRadius: "12px",
                      px: 5,
                      py: 1.4,
                      fontWeight: 800,
                      bgcolor: "#10b981",
                      "&:hover": { bgcolor: "#059669" },
                    }}
                  >
                    ابدأ في زيادة مداخيلك اليوم
                  </MuiButton>
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* ─── Frequently Asked Questions (FAQ Accordion) ─── */}
        <section id="faq" className="py-20 sm:py-28 border-b border-border bg-muted/10">
          <Container maxWidth="md">
            <div className="text-center mb-14">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                إجابات مباشرة
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-foreground mt-2 font-cairo">
                الأسئلة الأكثر شيوعاً
              </h2>
            </div>

            <div className="space-y-4">
              <Accordion
                disableGutters
                elevation={0}
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "16px !important",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary expandIcon={<ChevronDown size={20} />}>
                  <Typography fontWeight="bold" sx={{ fontFamily: "var(--font-cairo)" }}>
                    هل أحتاج لشراء طابعة خاصة للعمل مع منصة سهلة؟
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary" sx={{ fontFamily: "var(--font-cairo)", fontSize: "0.95rem" }}>
                    إطلاقاً! تعمل سهلة مع أي طابعة عادية تملكها حالياً (Epson, Canon, HP, Brother...) سواء كانت متصلة عبر كابل USB عادي أو عبر شبكة Wi-Fi المحلية.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion
                disableGutters
                elevation={0}
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "16px !important",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary expandIcon={<ChevronDown size={20} />}>
                  <Typography fontWeight="bold" sx={{ fontFamily: "var(--font-cairo)" }}>
                    كيف يدفع لي الزبون ثمن الطباعة والخدمات؟
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary" sx={{ fontFamily: "var(--font-cairo)", fontSize: "0.95rem" }}>
                    يدفع الزبون لك نقداً مباشرة في كاونترك كالمعتاد، أو يمكنك تفعيل الدفع بمسح رمز QR إذا كان الزبون يملك محفظة رقمية أو رصيداً في سهلة.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion
                disableGutters
                elevation={0}
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "16px !important",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary expandIcon={<ChevronDown size={20} />}>
                  <Typography fontWeight="bold" sx={{ fontFamily: "var(--font-cairo)" }}>
                    هل ملفات ووثائق الزبائن محمية قانونياً؟
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary" sx={{ fontFamily: "var(--font-cairo)", fontSize: "0.95rem" }}>
                    نعم تماماً. منصة سهلة مطابقة 100% للقانون الجزائري 18-07 لحماية المعطيات ذات الطابع الشخصي. يتم تشفير الملفات وحذفها نهائياً بعد طباعتها لتجنب أي تسريب أو مسؤولية قانونية.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion
                disableGutters
                elevation={0}
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "16px !important",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary expandIcon={<ChevronDown size={20} />}>
                  <Typography fontWeight="bold" sx={{ fontFamily: "var(--font-cairo)" }}>
                    كيف أشحن رصيد كاونتري بعد انتهاء النقاط التجريبية؟
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary" sx={{ fontFamily: "var(--font-cairo)", fontSize: "0.95rem" }}>
                    يمكنك الشحن فورياً عبر البطاقة الذهبية أو بطاقة CIB البنكية، أو شراء بطاقات شحن خدش من شبكة موزعي سهلة المعتمدين المنتشرين في 58 ولاية.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </div>
          </Container>
        </section>

        {/* ─── Final CTA Banner ─── */}
        <section className="py-20 sm:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 via-teal-500/10 to-transparent pointer-events-none" />
          <Container maxWidth="md" sx={{ textAlign: "center", position: "relative", zIndex: 1 }}>
            <h2 className="text-3xl sm:text-5xl font-black text-foreground font-cairo mb-4 leading-tight">
              جاهز لتحويل كاونترك إلى محطة ذكية وسريعة؟
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto font-cairo">
              انضم إلى أكثر من 1,200 كشك ومكتبة في الجزائر وابدأ في خدمة زبائنك باحترافية تامة خلال دقائق.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="w-full sm:w-auto">
                <MuiButton
                  variant="contained"
                  size="large"
                  disableElevation
                  sx={{
                    borderRadius: "12px",
                    px: 5,
                    py: 1.6,
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    bgcolor: "#10b981",
                    "&:hover": { bgcolor: "#059669" },
                    boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)",
                  }}
                >
                  افتح حساب محلك مجاناً الآن
                </MuiButton>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <MuiButton
                  variant="outlined"
                  size="large"
                  sx={{
                    borderRadius: "12px",
                    px: 4,
                    py: 1.6,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    borderColor: "divider",
                    color: "text.primary",
                    "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
                  }}
                >
                  تسجيل الدخول للمحل
                </MuiButton>
              </Link>
            </div>
          </Container>
        </section>
      </main>

      {/* ─── Modern Footer ─── */}
      <footer className="py-12 border-t border-border bg-card text-muted-foreground text-sm font-cairo">
        <Container maxWidth="lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black">
                  سـ
                </div>
                <span className="font-black text-foreground text-lg">سهلة · Sahla</span>
              </div>
              <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                المنصة الوطنية الرائدة لرقمنة الأكشاك ومراكز الطباعة في الجزائر. نربط أصحاب المحلات بحلول سحابية ذكية ترفع الإنتاجية وتحمي البيانات.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-foreground text-sm mb-3">روابط سريعة</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#features" className="hover:text-foreground">المميزات</a></li>
                <li><a href="#plans" className="hover:text-foreground">الخطط والأسعار</a></li>
                <li><a href="#calculator" className="hover:text-foreground">حاسبة الأرباح</a></li>
                <li><a href="#faq" className="hover:text-foreground">الأسئلة الشائعة</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-foreground text-sm mb-3">الدعم القانوني</h4>
              <ul className="space-y-2 text-xs">
                <li><span className="hover:text-foreground cursor-pointer">شروط الاستخدام</span></li>
                <li><span className="hover:text-foreground cursor-pointer">سياسة الخصوصية (قانون 18-07)</span></li>
                <li><span className="hover:text-foreground cursor-pointer">شبكة الموزعين المعتمدين</span></li>
                <li><span className="text-emerald-600 font-bold">هاتف الدعم: 0550-00-00-00</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
            <p>© {new Date().getFullYear()} سهلة · Sahla. جميع الحقوق محفوظة لجمهورية الجزائر الديمقراطية الشعبية 🇩🇿</p>
            <p className="flex items-center gap-1">
              صُنع بكل فخر لدعم أصحاب المشاريع الصغيرة في الجزائر 🇩🇿
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}
