"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button as MuiButton } from "@mui/material";
import { Mail, QrCode, AlertTriangle, Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { UserNavDropdown } from "@/components/navigation/UserNavDropdown";
import { LoginForm } from "./LoginForm";
import { QrLoginScanner } from "./QrLoginScanner";
import { AuthTrustSidebar } from "./AuthTrustSidebar";

export function LoginClientView() {
  const router = useRouter();
  const { loginWithEmail, isLoggedIn } = useAuth();

  // Form State
  const [activeTab, setActiveTab] = useState<"email" | "qr">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300 relative overflow-hidden antialiased">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-border/40 backdrop-blur-md bg-background/50 z-20">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
            سـ
          </div>
          <div className="flex flex-col">
            <span className="font-black text-base text-foreground font-cairo leading-none">
              {siteConfig.name}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">الرجوع للرئيسية</span>
          </div>
        </Link>

        <div className="flex items-center gap-2.5">
          <ThemeToggle variant="icon" />

          {isLoggedIn ? (
            <UserNavDropdown />
          ) : (
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
          )}
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center p-4 sm:p-8 lg:p-12 z-10">
        {/* Right Column: Auth Card */}
        <div className="w-full max-w-md my-auto">
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-2xl backdrop-blur-xl relative">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/20">
                <Sparkles size={14} /> كاونتر الأكشاك والمكتبات {siteConfig.version}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground font-cairo tracking-tight">
                تسجيل الدخول إلى المحل
              </h1>
              <p className="text-xs text-muted-foreground mt-1.5 font-cairo">
                أدخل بيانات حسابك للوصول إلى لوحة التحكم وطابعاتك السحابية.
              </p>
            </div>

            {/* Tabs */}
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

            {/* Error Feedback */}
            {errorMsg && (
              <div className="mb-5 p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive flex items-center gap-2 text-xs font-bold">
                <AlertTriangle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Active Tab View */}
            {activeTab === "email" ? (
              <LoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                rememberMe={rememberMe}
                setRememberMe={setRememberMe}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
              />
            ) : (
              <QrLoginScanner
                onSimulateScan={async () => {
                  setIsSubmitting(true);
                  try {
                    const res = await loginWithEmail("najah.kiosk@gmail.com", "Shop@2026!");
                    if (res.success) {
                      router.push("/dashboard");
                    } else {
                      setErrorMsg("تعذر مسح رمز QR");
                    }
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              />
            )}

            <div className="text-center text-xs text-muted-foreground mt-6 pt-5 border-t border-border font-cairo">
              ليس لديك حساب بعد؟{" "}
              <Link href="/register" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                افتح حساب محلك مجاناً واحصل على 50 نقطة
              </Link>
            </div>
          </div>
        </div>

        {/* Left Column: Trust & Highlights Sidebar */}
        <AuthTrustSidebar />
      </div>
    </div>
  );
}
