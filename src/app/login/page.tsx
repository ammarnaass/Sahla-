"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/components/ui/ThemeProvider";
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  AlertTriangleIcon,
  StoreIcon,
  CrownIcon,
  SparklesIcon,
  WirelessPrintIcon,
  ShieldCheckIcon,
  CardEpayIcon,
  ArrowRightIcon,
} from "@/components/ui/Icons";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail } = useAuth();
  const { theme, setTheme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg("");
  };

  return (
    <div className="min-h-[100dvh] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center lg:grid lg:grid-cols-2 selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      {/* ─── Right Column: Auth Form ─── */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-20 order-2 lg:order-1 relative">
        {/* Floating Theme Switcher */}
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-sm"
            aria-label="تبديل الوضع الليلي والنهاري"
          >
            {theme === "light" ? (
              <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        <div className="w-full max-w-md mx-auto">
          {/* Header & Logo */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-3 group mb-6">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                سـ
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">سهلة · Sahla</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">منظومة الأكشاك والمكتبات</span>
              </div>
            </Link>

            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              تسجيل الدخول إلى المحل
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              أدخل بريدك الإلكتروني (جيميل) وكلمة المرور للوصول إلى لوحة التحكم وطابعاتك السحابية.
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-3 animate-in fade-in zoom-in-95">
              <AlertTriangleIcon size={18} className="text-rose-500 dark:text-rose-400 shrink-0" />
              <p className="leading-snug">{errorMsg}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                البريد الإلكتروني أو الجيميل <span className="text-emerald-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  dir="ltr"
                  className="w-full h-12 px-4 pl-10 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono shadow-sm"
                  required
                />
                <span className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
                  <MailIcon size={18} />
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  كلمة المرور <span className="text-emerald-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? <EyeOffIcon size={14} /> : <EyeIcon size={14} />}
                  <span>{showPassword ? "إخفاء" : "إظهار"}</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  dir="ltr"
                  className="w-full h-12 px-4 pl-10 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono shadow-sm"
                  required
                />
                <span className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
                  <LockIcon size={18} />
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500/30 accent-emerald-500"
                />
                <span>تذكرني على هذا الجهاز</span>
              </label>

              <span className="text-slate-500 text-[11px] font-mono">
                دعم فني: 0550-00-00-00
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>جارٍ التحقق وتأمين الجلسة...</span>
                </>
              ) : (
                <span>تسجيل الدخول إلى المحل</span>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Fill */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/80">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-3 text-center flex items-center justify-center gap-1.5">
              <SparklesIcon size={14} className="text-amber-500 dark:text-amber-400" />
              <span>حسابات تجريبية سريعة للتجربة الفورية:</span>
            </p>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => handleQuickFill("najah.kiosk@gmail.com", "Shop@2026!")}
                className="p-3 rounded-2xl bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-all text-right group cursor-pointer shadow-sm"
              >
                <div className="font-black text-xs text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500 flex items-center gap-1.5">
                  <StoreIcon size={14} />
                  <span>صاحب كشك</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-1 font-mono">najah.kiosk@gmail.com</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill("admin@sahla.dz", "Admin@2026!")}
                className="p-3 rounded-2xl bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-all text-right group cursor-pointer shadow-sm"
              >
                <div className="font-black text-xs text-amber-600 dark:text-amber-400 group-hover:text-amber-500 flex items-center gap-1.5">
                  <CrownIcon size={14} />
                  <span>مدير النظام الوطني</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-1 font-mono">admin@sahla.dz</div>
              </button>
            </div>
          </div>

          {/* Bottom Switcher */}
          <div className="mt-8 text-center text-xs text-slate-600 dark:text-slate-400">
            ليس لديك حساب بعد؟{" "}
            <Link href="/register" className="font-extrabold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors inline-flex items-center gap-1">
              <span>افتح حساب محلك مجاناً واحصل على 50 نقطة</span>
              <SparklesIcon size={14} className="text-amber-500 dark:text-amber-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Left Column: Value Prop Showcase ─── */}
      <div className="hidden lg:flex flex-col justify-between p-12 xl:p-16 bg-gradient-to-br from-slate-100 via-white to-emerald-50/30 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 border-r border-slate-200 dark:border-slate-800/80 relative overflow-hidden order-1 lg:order-2 transition-colors duration-200">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
            <span>منظومة سهلة السحابية · إصدار الجيل الجديد 2026</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-4 tracking-tight">
            المنصة السحابية الموحدة لإدارة الأكشاك ومراكز الطباعة في الجزائر 🇩🇿
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-sm xl:text-base leading-relaxed max-w-lg mb-10 font-normal">
            سهولة تامة في استقبال ملفات المواطنين عبر QR Code والطباعة اللاسلكية الحرارية، مع امتثال كامل للقانون الجزائري لحماية المعطيات الشخصية.
          </p>

          <div className="space-y-4 max-w-lg">
            <div className="p-4.5 rounded-3xl bg-white/80 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-4 backdrop-blur-sm shadow-sm">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <WirelessPrintIcon size={22} />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-0.5">جسر طباعة حراري لاسلكي متزامن</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                  بدون تعريفات أو كوابل معقدة، يستقبل الكاونتر مهام الطباعة تلقائياً وفورياً.
                </p>
              </div>
            </div>

            <div className="p-4.5 rounded-3xl bg-white/80 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-4 backdrop-blur-sm shadow-sm">
              <div className="w-11 h-11 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                <ShieldCheckIcon size={22} />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-0.5">مطابقة القانون 18-07 لحماية المعطيات</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                  تشفير آمن للوثائق وحذف تلقائي نهائي بعد انقضاء المدة المحددة (24 إلى 72 ساعة).
                </p>
              </div>
            </div>

            <div className="p-4.5 rounded-3xl bg-white/80 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-4 backdrop-blur-sm shadow-sm">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <CardEpayIcon size={22} />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-0.5">نظام شحن نقاط بالجملة وبالدفع الإلكتروني</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                  شحن رصيد المحل ببطاقات الخدش من الموزعين أو بالبطاقة الذهبية / CIB في ثوانٍ.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Network Metric */}
        <div className="relative z-10 pt-8 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
            <span className="font-bold text-slate-800 dark:text-slate-300">شبكة سهلة نشطة عبر 58 ولاية</span>
          </div>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">1,240+ محل تجاري مسجل</span>
        </div>
      </div>
    </div>
  );
}
