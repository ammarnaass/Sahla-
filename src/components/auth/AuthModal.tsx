"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { PhoneInput } from "./PhoneInput";
import { OTPInput } from "./OTPInput";
import { ShopRegistrationForm } from "./ShopRegistrationForm";
import { trackEvent } from "@/lib/analytics";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export function AuthModal({ isOpen, onClose, initialMode = "register" }: AuthModalProps) {
  const router = useRouter();
  const {
    requestOTP,
    verifyOTP,
    completeShopRegistration,
    pendingOTP,
    failedAttempts,
    lockoutUntil,
  } = useAuth();

  const [step, setStep] = useState<"phone" | "otp" | "shop">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [demoCode, setDemoCode] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState("");

  const isLockedOut = lockoutUntil && Date.now() < lockoutUntil;

  const handleRequestOTP = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLockedOut) {
      setErrorMsg("تم قفل الحساب مؤقتاً بسبب تكرار المحاولات الخاطئة. يرجى الانتظار 15 دقيقة.");
      return;
    }

    setErrorMsg("");
    setIsSubmitting(true);
    trackEvent("signup_start");

    const res = requestOTP(phoneNumber);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || "تعذر إرسال الرمز، تأكد من الرقم");
      return;
    }

    setDemoCode(res.demoCode);
    setStep("otp");
    trackEvent("otp_sent", { phone: res.phone });
  };

  const handleVerifyOTP = (codeToVerify: string) => {
    if (isLockedOut) {
      setErrorMsg("تم قفل الحساب مؤقتاً لمدة 15 دقيقة.");
      return;
    }

    setErrorMsg("");
    setIsSubmitting(true);

    const res = verifyOTP(codeToVerify);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || "رمز غير صحيح");
      return;
    }

    trackEvent("otp_verified");

    if (res.isNewUser) {
      setVerifiedPhone(res.phone || phoneNumber);
      setStep("shop");
    } else {
      // Returning user directly to dashboard
      onClose();
      router.push("/dashboard");
    }
  };

  const handleShopSubmit = (data: {
    phone: string;
    shopName: string;
    ownerName: string;
    wilayaCode: number;
    activityType: string;
    consentAgreed: boolean;
  }) => {
    setErrorMsg("");
    setIsSubmitting(true);

    const res = completeShopRegistration(data);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || "حدث خطأ أثناء حفظ بيانات المحل");
      return;
    }

    trackEvent("shop_created", { wilaya: data.wilayaCode, activity: data.activityType });
    onClose();
    // New users navigate to onboarding wizard
    router.push("/onboarding");
  };

  const handleResend = (channel: "SMS" | "WHATSAPP" = "SMS") => {
    setErrorMsg("");
    const res = requestOTP(phoneNumber);
    if (res.success) {
      setDemoCode(res.demoCode);
    } else {
      setErrorMsg(res.error || "تعذر إعادة الإرسال حالياً");
    }
  };

  const modalTitle =
    step === "phone"
      ? initialMode === "login"
        ? "تسجيل الدخول إلى محلك"
        : "ابدأ مع سهلة مجاناً"
      : step === "otp"
      ? "تأكيد رقم الهاتف"
      : "إنشاء ملف محلك التجاري";

  const modalDesc =
    step === "phone"
      ? "بدون كلمة مرور وبدون تعقيد. رمز تحقق OTP فوري على هاتفك."
      : step === "otp"
      ? "أدخل الرمز للتحقق من ملكية الرقم والدخول الفوري."
      : "أدخل معلومات محلك لتخصيص القوالب وتوليد الوثائق الرسمية.";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      description={modalDesc}
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2">
          <div
            className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
              step === "phone"
                ? "bg-emerald-600 text-white ring-4 ring-emerald-500/20"
                : "bg-emerald-500/20 text-emerald-400"
            }`}
          >
            1
          </div>
          <div className="w-8 h-0.5 bg-slate-800" />
          <div
            className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
              step === "otp"
                ? "bg-emerald-600 text-white ring-4 ring-emerald-500/20"
                : step === "shop"
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-slate-800 text-slate-500"
            }`}
          >
            2
          </div>
          <div className="w-8 h-0.5 bg-slate-800" />
          <div
            className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
              step === "shop"
                ? "bg-emerald-600 text-white ring-4 ring-emerald-500/20"
                : "bg-slate-800 text-slate-500"
            }`}
          >
            3
          </div>
        </div>

        {/* Step 1: Phone input */}
        {step === "phone" && (
          <form onSubmit={handleRequestOTP} className="space-y-5">
            <PhoneInput
              value={phoneNumber}
              onChange={setPhoneNumber}
              disabled={isSubmitting || Boolean(isLockedOut)}
              error={errorMsg}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              disabled={!phoneNumber.trim() || Boolean(isLockedOut)}
              className="w-full font-bold shadow-lg shadow-emerald-900/30"
            >
              <span>إرسال رمز التحقق (OTP)</span>
              <svg className="w-5 h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Button>

            <div className="text-center">
              <span className="text-xs text-slate-400">
                🔒 دخول مشفر وآمن طبقاً للقانون الجزائري 18-07
              </span>
            </div>
          </form>
        )}

        {/* Step 2: OTP input */}
        {step === "otp" && (
          <div className="space-y-6">
            <OTPInput
              value={otpCode}
              onChange={setOtpCode}
              onComplete={handleVerifyOTP}
              onResend={handleResend}
              phoneDisplay={pendingOTP?.formattedPhone || phoneNumber}
              demoCode={demoCode}
              error={errorMsg}
              remainingAttempts={5 - failedAttempts}
              disabled={isSubmitting || Boolean(isLockedOut)}
            />

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setErrorMsg("");
                }}
                className="text-xs font-semibold text-slate-400 hover:text-white"
              >
                ← تغيير رقم الهاتف
              </button>

              <Button
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                disabled={otpCode.length < 6 || Boolean(isLockedOut)}
                onClick={() => handleVerifyOTP(otpCode)}
              >
                تأكيد ومتابعة
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Shop Registration */}
        {step === "shop" && (
          <ShopRegistrationForm
            phone={verifiedPhone || phoneNumber}
            onSubmit={handleShopSubmit}
            isLoading={isSubmitting}
          />
        )}
      </div>
    </Modal>
  );
}
