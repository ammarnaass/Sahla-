"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/components/ui/ThemeProvider";
import { ALGERIAN_WILAYAS, ACTIVITY_TYPES } from "@/lib/constants";
import {
  SparklesIcon,
  AlertTriangleIcon,
  StoreIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  BoltIcon,
} from "@/components/ui/Icons";

export function RegisterClientView() {
  const router = useRouter();
  const { registerWithEmail } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? (resolvedTheme || theme || "dark") : "dark";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");
  const [wilaya, setWilaya] = useState("16 - الجزائر");
  const [activity, setActivity] = useState("KIOSK");
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("يرجى إدخال اسم صاحب أو مسير المحل");
      return;
    }
    if (!email.trim()) {
      setErrorMsg("يرجى إدخال البريد الإلكتروني (جيميل)");
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg("كلمة المرور يجب أن لا تقل عن 6 خانات");
      return;
    }
    if (!shopName.trim()) {
      setErrorMsg("يرجى إدخال اسم المحل التجاري أو المكتبة");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await registerWithEmail({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        shopName: shopName.trim(),
        wilaya,
        activity,
        phone: phone.trim() || undefined,
      });

      if (!res.success) {
        setErrorMsg(res.error || "تعذر إتمام تسجيل المحل");
        setIsSubmitting(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setErrorMsg("حدث خطأ في الاتصال بالخادم. يرجى المحاولة لاحقاً.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center lg:grid lg:grid-cols-2 selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      {/* ─── Right Column: Registration Form ─── */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-20 order-2 lg:order-1 relative">
        {/* Floating Theme Switcher */}
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <button
            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-sm"
            aria-label="تبديل الوضع الليلي والنهاري"
          >
            {currentTheme === "light" ? (
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

        <div className="w-full max-w-lg mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-3 group mb-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                سـ
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">سهلة · Sahla</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">منظومة الأكشاك والمكتبات</span>
              </div>
            </Link>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              فتح حساب محل سحابي جديد 🇩🇿
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              سجّل محلك في شبكة سهلة الوطنية واستلم فورياً 50 نقطة تجريبية مجانية لمعالجة وطباعة ملفات الزبائن.
            </p>
          </div>

          {/* Welcome Bonus Callout */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/25 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <SparklesIcon size={20} />
            </div>
            <div>
              <div className="text-xs font-black text-emerald-600 dark:text-emerald-400">هدية الانضمام: 50 نقطة مجاناً</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400">تضاف فورياً إلى محفظة المحل عند تأكيد الحساب للطباعة التجريبية.</div>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-2.5 animate-in fade-in zoom-in-95">
              <AlertTriangleIcon size={16} className="text-rose-500 dark:text-rose-400 shrink-0" />
              <p className="leading-snug">{errorMsg}</p>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  اسم صاحب أو مسير المحل <span className="text-emerald-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: كريم بن مهيدي"
                  className="w-full h-11 px-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  البريد الإلكتروني (جيميل) <span className="text-emerald-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@gmail.com"
                  dir="ltr"
                  className="w-full h-11 px-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  كلمة المرور (6 خانات فأكثر) <span className="text-emerald-500">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  dir="ltr"
                  className="w-full h-11 px-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  رقم الهاتف (موبيليس، جيزي، أوريدو)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0555 12 34 56"
                  dir="ltr"
                  className="w-full h-11 px-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  اسم المحل التجاري / المكتبة <span className="text-emerald-500">*</span>
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="مثال: مكتبة الأمل للطباعة"
                  className="w-full h-11 px-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ولاية النشاط (58 ولاية) <span className="text-emerald-500">*</span>
                </label>
                <select
                  value={wilaya}
                  onChange={(e) => setWilaya(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-sm"
                >
                  {ALGERIAN_WILAYAS.map((w) => (
                    <option key={w.code} value={`${w.code} - ${w.nameAr}`} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {String(w.code).padStart(2, "0")} - {w.nameAr} ({w.nameFr})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                نوع النشاط التجاري
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ACTIVITY_TYPES.map((act) => (
                  <button
                    key={act.code}
                    type="button"
                    onClick={() => setActivity(act.code)}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      activity === act.code
                        ? "bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-white font-extrabold ring-1 ring-emerald-500/30"
                        : "bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <div className="text-[11px] leading-tight font-bold">{act.nameAr}</div>
                    <div className="text-[9px] text-slate-500 mt-0.5">{act.nameFr}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>جارٍ إنشاء المتجر وتخصيص النقاط...</span>
                </>
              ) : (
                <span>تأكيد وفتح حساب المتجر مجاناً</span>
              )}
            </button>
          </form>

          {/* Bottom Link to Login */}
          <div className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400">
            لديك حساب مسجل بالفعل؟{" "}
            <Link href="/login" className="font-extrabold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors inline-flex items-center gap-1">
              <span>تسجيل الدخول إلى حسابك</span>
              <ArrowLeftIcon size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Left Column: SaaS Benefits ─── */}
      <div className="hidden lg:flex flex-col justify-between p-12 xl:p-16 bg-gradient-to-br from-slate-100 via-white to-emerald-50/30 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 border-r border-slate-200 dark:border-slate-800/80 relative overflow-hidden order-1 lg:order-2 transition-colors duration-200">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
            انضم لأكثر من 1,200 كشك في 58 ولاية
          </div>

          <h2 className="text-3xl xl:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-4 tracking-tight">
            حوّل كشكك أو مكتبتك إلى مركز خدمات رقمية حديث ⚡
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-sm xl:text-base leading-relaxed max-w-lg mb-8">
            تخلص من فلاش ديسك وكوابل USB وخطر الفيروسات. زبائنك يرسلون ملفاتهم مباشرة بالكاميرا أو الرابط، وتطبعها بنقرة واحدة.
          </p>

          <div className="space-y-4 max-w-lg">
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between shadow-sm">
              <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">نقاط ترحيبية فورية</span>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">+50 نقطة مجانية</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between shadow-sm">
              <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">صلاحية الوثائق وحمايتها</span>
              <span className="text-xs font-black text-teal-600 dark:text-teal-400">حذف تلقائي بعد 48 ساعة</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between shadow-sm">
              <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">طرق شحن الرصيد</span>
              <span className="text-xs font-black text-amber-600 dark:text-amber-400">بطاقات الجملة + ذهبية / CIB</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-8 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <span>دعم فني وتدريب مجاني على المنظومة</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">Sahla OS v2.0</span>
        </div>
      </div>
    </div>
  );
}
