"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/contexts/AuthContext";
import { ALGERIAN_WILAYAS, ACTIVITY_TYPES } from "@/lib/constants";
import {
  MailIcon,
  LockIcon,
  StoreIcon,
  SparklesIcon,
  AlertTriangleIcon,
  EyeIcon,
  EyeOffIcon,
} from "@/components/ui/Icons";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const router = useRouter();
  const { loginWithEmail, registerWithEmail } = useAuth();

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");
  const [wilaya, setWilaya] = useState("16 - الجزائر");
  const [activity, setActivity] = useState("KIOSK");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password) {
      setErrorMsg("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    setIsSubmitting(true);
    const res = await loginWithEmail(email.trim(), password);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
      return;
    }

    onClose();
    if (res.user?.role === "SUPER_ADMIN") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim() || !email.trim() || !password || !shopName.trim()) {
      setErrorMsg("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("كلمة المرور يجب أن لا تقل عن 6 خانات");
      return;
    }

    setIsSubmitting(true);
    const res = await registerWithEmail({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      shopName: shopName.trim(),
      wilaya,
      activity,
    });
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || "تعذر إتمام التسجيل");
      return;
    }

    onClose();
    router.push("/dashboard");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          {mode === "login" ? (
            <>
              <LockIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>تسجيل الدخول إلى المحل</span>
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>فتح حساب محل جديد (50 نقطة هدية)</span>
            </>
          )}
        </div>
      }
      description={
        mode === "login"
          ? "أدخل بريدك الإلكتروني (جيميل) وكلمة المرور للوصول إلى لوحة التحكم."
          : "سجّل محلك في شبكة سهلة واحصل على 50 نقطة ترحيبية مجانية."
      }
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMsg("");
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === "login"
                ? "bg-emerald-500 text-slate-950 shadow-sm font-black"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            تسجيل الدخول
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("register");
              setErrorMsg("");
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === "register"
                ? "bg-emerald-500 text-slate-950 shadow-sm font-black"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            فتح حساب جديد
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
            <AlertTriangleIcon className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Mode: Login */}
        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                البريد الإلكتروني أو الجيميل <span className="text-emerald-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                dir="ltr"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 font-mono transition-colors"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  كلمة المرور <span className="text-emerald-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 cursor-pointer"
                >
                  {showPassword ? "إخفاء" : "إظهار"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                dir="ltr"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 font-mono transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>جارٍ التحقق...</span>
                </>
              ) : (
                <span>تسجيل الدخول إلى المحل</span>
              )}
            </button>

            {/* Quick Portal Navigation */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
              <Link
                href="/admin"
                onClick={onClose}
                className="text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1"
              >
                <span>👑 لوحة تحكم مدير النظام</span>
              </Link>
              <Link
                href="/dashboard"
                onClick={onClose}
                className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 font-medium hover:underline flex items-center gap-1"
              >
                <span>معاينة كضيف ←</span>
              </Link>
            </div>
          </form>
        ) : (
          /* Mode: Register */
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  اسم المسير <span className="text-emerald-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="محمد بن علي"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  البريد (جيميل) <span className="text-emerald-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kiosk@gmail.com"
                  dir="ltr"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 font-mono transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  اسم المحل <span className="text-emerald-500">*</span>
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="مكتبة الأمل"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الولاية <span className="text-emerald-500">*</span>
                </label>
                <select
                  value={wilaya}
                  onChange={(e) => setWilaya(e.target.value)}
                  className="w-full h-10 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 transition-colors"
                >
                  {ALGERIAN_WILAYAS.map((w) => (
                    <option key={w.code} value={`${w.code} - ${w.nameAr}`} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {String(w.code).padStart(2, "0")} - {w.nameAr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                كلمة المرور (6 خانات فأكثر) <span className="text-emerald-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                dir="ltr"
                className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 font-mono transition-colors"
                required
              />
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
              <span className="text-slate-700 dark:text-slate-300 font-bold">الرصيد الافتتاحي الممنوح:</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400 font-mono">+50 نقطة مجانية</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>جارٍ إنشاء المتجر...</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="w-4 h-4 text-slate-950" />
                  <span>تأكيد وفتح حساب المتجر مجاناً</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
}
