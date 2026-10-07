"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import {
  Box,
  Typography,
  TextField,
  Button as MuiButton,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Card as MuiCard,
  Chip,
} from "@mui/material";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  Store,
  Crown,
  Sparkles,
  Printer,
  ShieldCheck,
  CreditCard,
  Sun,
  Moon,
  ArrowRight,
  QrCode,
  CheckCircle2,
  PhoneCall,
  Laptop,
} from "lucide-react";

export function LoginClientView() {
  const router = useRouter();
  const { loginWithEmail } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Form State
  const [activeTab, setActiveTab] = useState<"email" | "qr">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quickFillSuccess, setQuickFillSuccess] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? theme : "dark";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim()) {
      setErrorMsg("يرجى إدخال البريد الإلكتروني (جيميل)");
      return;
    }
    if (!password) {
      setErrorMsg("يرجى إدخال كلمة المرور");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await loginWithEmail(email.trim(), password);
      if (!res.success) {
        setErrorMsg(res.error || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
        setIsSubmitting(false);
        return;
      }

      // Check role for redirection
      if (res.user?.role === "SUPER_ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setErrorMsg("تعذر الاتصال بخادم سهلة. يرجى المحاولة لاحقاً.");
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string, roleName: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg("");
    setQuickFillSuccess(`تم ملء بيانات ${roleName} بنجاح`);
    setTimeout(() => setQuickFillSuccess(null), 3000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300 relative overflow-hidden antialiased">
      {/* Background Decorative Gradients & Mesh */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ─── Top Floating Header ─── */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-border/40 backdrop-blur-md bg-background/50 z-20">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
            سـ
          </div>
          <div className="flex flex-col">
            <span className="font-black text-base text-foreground font-cairo leading-none">
              سهلة · Sahla
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              الرجوع للرئيسية
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <IconButton
            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            sx={{
              color: "text.primary",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "10px",
              p: 0.9,
            }}
          >
            {currentTheme === "dark" ? (
              <Sun size={18} className="text-amber-400" />
            ) : (
              <Moon size={18} className="text-slate-600" />
            )}
          </IconButton>

          <Link href="/register">
            <MuiButton
              variant="outlined"
              size="small"
              sx={{
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "0.8rem",
                borderColor: "divider",
                color: "text.primary",
                "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
              }}
            >
              فتح حساب جديد
            </MuiButton>
          </Link>
        </div>
      </header>

      {/* ─── Main Two-Column Layout ─── */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center p-4 sm:p-8 lg:p-12 z-10">
        {/* ─── Right Column: Shadcn Auth Card ─── */}
        <div className="w-full max-w-md my-auto">
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-2xl backdrop-blur-xl relative">
            {/* Card Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/20">
                <Sparkles size={14} /> كاونتر الأكشاك والمكتبات 2.0
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground font-cairo tracking-tight">
                تسجيل الدخول إلى المحل
              </h1>
              <p className="text-xs text-muted-foreground mt-1.5 font-cairo">
                أدخل بيانات حسابك للوصول إلى لوحة التحكم وطابعاتك السحابية.
              </p>
            </div>

            {/* Shadcn-Style Tabs: Email vs QR Code */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-muted/50 border border-border mb-6 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setActiveTab("email"); setErrorMsg(""); }}
                className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "email"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Mail size={15} /> بالبريد الإلكتروني
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab("qr"); setErrorMsg(""); }}
                className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "qr"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <QrCode size={15} /> دخول سريع بـ QR
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="mb-5 p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive flex items-center gap-2 text-xs font-bold animate-fadeIn">
                <AlertTriangle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Quick Fill Success Notification */}
            {quickFillSuccess && (
              <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-xs font-bold animate-fadeIn">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{quickFillSuccess}</span>
              </div>
            )}

            {activeTab === "email" ? (
              /* ─── Form Content ─── */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5 font-cairo">
                    البريد الإلكتروني (جيميل)
                  </label>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="example@gmail.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    dir="ltr"
                    size="small"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Mail size={16} className="text-muted-foreground" />
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: "12px",
                          bgcolor: "background.paper",
                          "& fieldset": { borderColor: "divider" },
                          "&:hover fieldset": { borderColor: "primary.main" },
                        },
                      },
                    }}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-foreground font-cairo">
                      كلمة المرور
                    </label>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">
                      نسيت كلمة المرور؟
                    </span>
                  </div>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    dir="ltr"
                    size="small"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock size={16} className="text-muted-foreground" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: "12px",
                          bgcolor: "background.paper",
                          "& fieldset": { borderColor: "divider" },
                          "&:hover fieldset": { borderColor: "primary.main" },
                        },
                      },
                    }}
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        sx={{ color: "text.secondary", "&.Mui-checked": { color: "#10b981" } }}
                      />
                    }
                    label={
                      <span className="text-xs text-muted-foreground font-cairo">
                        تذكرني على هذا الجهاز
                      </span>
                    }
                  />
                  <div className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
                    <PhoneCall size={12} className="text-emerald-500" />
                    <span>0550-00-00-00</span>
                  </div>
                </div>

                <MuiButton
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  disableElevation
                  sx={{
                    mt: 1,
                    py: 1.4,
                    borderRadius: "12px",
                    fontWeight: 800,
                    fontSize: "0.95rem",
                    bgcolor: "#10b981",
                    "&:hover": { bgcolor: "#059669" },
                    boxShadow: "0 8px 20px -4px rgba(16, 185, 129, 0.35)",
                  }}
                >
                  {isSubmitting ? "جاري التحقق والربط..." : "تسجيل الدخول إلى المحل"}
                </MuiButton>
              </form>
            ) : (
              /* ─── Fast QR Login Tab ─── */
              <div className="py-6 text-center space-y-4">
                <div className="w-44 h-44 mx-auto rounded-2xl bg-muted/40 border-2 border-dashed border-emerald-500/40 p-4 flex flex-col items-center justify-center">
                  <QrCode size={88} className="text-emerald-600 dark:text-emerald-400 mb-2 animate-pulse" />
                  <span className="text-[11px] font-bold text-muted-foreground">
                    كود جلسة الكاونتر المباشرة
                  </span>
                </div>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto font-cairo">
                  افتح تطبيق سهلة على هاتفك واضغط على <strong>مسح QR</strong> للدخول المباشر إلى هذا الحاسوب بدون كلمة سر.
                </p>
                <MuiButton
                  variant="outlined"
                  size="small"
                  onClick={() => handleQuickFill("najah.kiosk@gmail.com", "Shop@2026!", "صاحب كشك")}
                  sx={{ borderRadius: "10px", fontSize: "0.8rem", fontWeight: 700 }}
                >
                  محاكاة المسح الناجح (تجربة)
                </MuiButton>
              </div>
            )}

            {/* ─── Quick Demo Accounts (بطاقات التجربة الفورية) ─── */}
            <div className="mt-8 pt-5 border-t border-border">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-muted-foreground mb-3 font-cairo">
                <Sparkles size={14} className="text-amber-500" />
                حسابات تجريبية جاهزة للاختبار بنقرة واحدة:
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Demo Kiosk */}
                <button
                  type="button"
                  onClick={() => handleQuickFill("najah.kiosk@gmail.com", "Shop@2026!", "صاحب كشك")}
                  className="p-2.5 rounded-xl bg-muted/30 border border-border hover:border-emerald-500/50 hover:bg-emerald-500/5 text-right transition-all group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-0.5">
                    <Store size={14} /> صاحب كشك
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono truncate">
                    najah.kiosk@gmail.com
                  </div>
                </button>

                {/* Demo Super Admin */}
                <button
                  type="button"
                  onClick={() => handleQuickFill("admin@sahla.dz", "Admin@2026!", "مدير النظام")}
                  className="p-2.5 rounded-xl bg-muted/30 border border-border hover:border-amber-500/50 hover:bg-amber-500/5 text-right transition-all group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 mb-0.5">
                    <Crown size={14} /> مدير النظام
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono truncate">
                    admin@sahla.dz
                  </div>
                </button>
              </div>
            </div>

            {/* Bottom Register Prompt */}
            <div className="text-center text-xs text-muted-foreground mt-6 font-cairo">
              ليس لديك حساب بعد؟{" "}
              <Link
                href="/register"
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                افتح حساب محلك مجاناً واحصل على 50 نقطة
              </Link>
            </div>
          </div>
        </div>

        {/* ─── Left Column: Value Proposition & Live Trust (Desktop Only) ─── */}
        <div className="hidden lg:flex flex-col justify-center flex-1 max-w-lg mr-12 p-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-6 border border-emerald-500/20 w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            شبكة سحابية وطنية متصلة على مدار الساعة
          </div>

          <h2 className="text-3xl font-black text-foreground font-cairo mb-4 leading-tight">
            المحطة الرقمية الشاملة لكافة خدمات المواطنين في محلك 🇩🇿
          </h2>

          <p className="text-muted-foreground text-sm font-cairo leading-relaxed mb-8">
            صُممت سهلة لتمنح الأكشاك والمكتبات ومراكز الطباعة أسرع تجربة خدمة زبائن، مع التزام تام بحماية المعطيات الشخصية وفق القانون 18-07.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-card border border-border shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Printer size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground font-cairo">
                  جسر طباعة لاسلكي وحراري فوري
                </h4>
                <p className="text-xs text-muted-foreground font-cairo mt-0.5">
                  طباعة المستندات الصادرة من هواتف الزبائن دون فلاش ديسك ودون تثبيت تعريفات معقدة.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-card border border-border shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground font-cairo">
                  مطابقة القانون 18-07 لحماية المعطيات
                </h4>
                <p className="text-xs text-muted-foreground font-cairo mt-0.5">
                  حذف تلقائي للملفات بعد الطباعة مع تشفير شامل يحمي خصوصية الزبون ومسؤوليتك.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-card border border-border shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <CreditCard size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground font-cairo">
                  شحن رصيد سهل عبر الذهبية و CIB
                </h4>
                <p className="text-xs text-muted-foreground font-cairo mt-0.5">
                  شحن فوري لنقاط الطباعة والمبيعات ببطاقتك البنكية أو بكروت الخدش المعتمدة.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-cairo">
            <span className="flex items-center gap-1.5 font-bold text-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              1,240+ محل تجاري مسجل عبر 58 ولاية
            </span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              متاح 24/7
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
