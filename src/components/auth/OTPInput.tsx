"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (val: string) => void;
  onComplete: (code: string) => void;
  onResend: (channel?: "SMS" | "WHATSAPP") => void;
  disabled?: boolean;
  error?: string;
  remainingAttempts?: number;
  phoneDisplay: string;
  demoCode?: string;
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  onComplete,
  onResend,
  disabled,
  error,
  remainingAttempts,
  phoneDisplay,
  demoCode,
}: OTPInputProps) {
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [showAlternativeHelp, setShowAlternativeHelp] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 60-second countdown
  useEffect(() => {
    setTimer(60);
    setCanResend(false);
    setShowAlternativeHelp(false);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 30) {
          setShowAlternativeHelp(true);
        }
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const digits = value.split("").slice(0, length);
  while (digits.length < length) {
    digits.push("");
  }

  const handleDigitChange = (index: number, char: string) => {
    // Only accept numeric
    const clean = char.replace(/\D/g, "");
    if (!clean && char !== "") return;

    const newDigits = [...digits];

    if (clean.length > 1) {
      // Pasted string
      const pasted = clean.slice(0, length).split("");
      pasted.forEach((d, i) => {
        if (index + i < length) {
          newDigits[index + i] = d;
        }
      });
      const finalCode = newDigits.join("");
      onChange(finalCode);
      if (finalCode.length === length) {
        onComplete(finalCode);
      }
      const nextIdx = Math.min(index + clean.length, length - 1);
      inputRefs.current[nextIdx]?.focus();
      return;
    }

    newDigits[index] = clean;
    const finalCode = newDigits.join("");
    onChange(finalCode);

    if (clean && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (finalCode.length === length) {
      onComplete(finalCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="space-y-5 text-center">
      {/* Subtitle */}
      <div className="text-xs sm:text-sm text-slate-300">
        أدخل الرمز المكون من 6 أرقام المرسل إلى:{" "}
        <span className="font-bold text-white font-mono" dir="ltr">
          {phoneDisplay}
        </span>
      </div>

      {/* Demo helper badge for immediate testing */}
      {demoCode && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <span>💡 رمز التجربة السريع:</span>
          <button
            type="button"
            onClick={() => {
              onChange(demoCode);
              onComplete(demoCode);
            }}
            className="underline font-bold hover:text-emerald-300"
          >
            {demoCode} (اضغط للتعبئة)
          </button>
        </div>
      )}

      {/* 6 Digit Inputs */}
      <div className="flex items-center justify-center gap-2 sm:gap-3" dir="ltr">
        {digits.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputRefs.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={6}
            disabled={disabled}
            value={digit}
            onChange={(e) => handleDigitChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className="w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-black rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none transition-all disabled:opacity-50 font-mono"
          />
        ))}
      </div>

      {/* Error or attempts remaining */}
      {error && (
        <div className="text-xs font-bold text-red-400 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
          ⚠️ {error}
          {remainingAttempts !== undefined && remainingAttempts > 0 && (
            <span className="block mt-1 text-[11px] text-red-300">
              تبقّت لك {remainingAttempts} محاولات قبل القفل المؤقت.
            </span>
          )}
        </div>
      )}

      {/* Resend Timer & Choices */}
      <div className="pt-2 text-xs text-slate-400 flex flex-col items-center gap-2">
        {!canResend ? (
          <p>
            يمكنك طلب رمز جديد بعد:{" "}
            <span className="font-bold text-emerald-400 font-mono">{timer} ثانية</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={() => {
              onResend("SMS");
              setTimer(60);
              setCanResend(false);
            }}
            className="text-emerald-400 font-bold hover:underline"
          >
            إعادة إرسال الرمز عبر رسالة SMS ↺
          </button>
        )}

        {/* PRD: Button «لم يصلني الكود» appears after 30s with alternative channels */}
        {showAlternativeHelp && (
          <div className="mt-2 pt-2 border-t border-slate-800/80 w-full flex items-center justify-center gap-2">
            <span className="text-slate-400">لم يصلك الرمز؟</span>
            <button
              type="button"
              onClick={() => onResend("WHATSAPP")}
              className="text-xs font-semibold text-teal-400 hover:text-teal-300 hover:underline flex items-center gap-1"
            >
              <span>💬 الإرسال عبر واتساب</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
