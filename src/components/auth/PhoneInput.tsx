"use client";

import React from "react";
import { normalizeAlgerianPhone } from "@/lib/auth";

interface PhoneInputProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  error?: string;
}

export function PhoneInput({ value, onChange, disabled, error }: PhoneInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow digits and spaces
    const cleaned = raw.replace(/[^\d\s]/g, "");
    onChange(cleaned);
  };

  const validation = normalizeAlgerianPhone(value);

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-foreground">
        رقم الهاتف الجزائري (Ooredoo / Djezzy / Mobilis)
      </label>

      <div
        className={`relative flex items-center rounded-xl bg-card border transition-all ${
          error
            ? "border-red-500/80 focus-within:ring-2 focus-within:ring-red-500/30"
            : validation.valid
            ? "border-emerald-500/80 focus-within:ring-2 focus-within:ring-emerald-500/30"
            : "border-border focus-within:border-emerald-500/60 focus-within:ring-2 focus-within:ring-emerald-500/20"
        }`}
      >
        {/* Country Code Fixed Badge */}
        <div className="flex items-center gap-1.5 px-3.5 py-3 border-l border-border bg-muted/60 rounded-r-xl select-none shrink-0">
          <span className="text-base">🇩🇿</span>
          <span className="text-xs font-bold font-mono text-foreground ltr-text" dir="ltr">
            +213
          </span>
        </div>

        {/* Input */}
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          disabled={disabled}
          placeholder="05 / 06 / 07 XX XX XX"
          value={value}
          onChange={handleChange}
          dir="ltr"
          className="w-full bg-transparent px-3 py-3 text-sm sm:text-base font-semibold text-foreground placeholder-muted-foreground focus:outline-none disabled:opacity-50 text-left font-mono"
        />

        {/* Carrier indicator badge */}
        {validation.carrier && (
          <div className="px-3 shrink-0">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              {validation.carrier}
            </span>
          </div>
        )}
      </div>

      {/* Validation feedback message */}
      {error ? (
        <p className="text-xs font-medium text-red-500 dark:text-red-400 flex items-center gap-1">
          <span>⚠️</span>
          <span>{error}</span>
        </p>
      ) : value && !validation.valid ? (
        <p className="text-xs text-muted-foreground">
          مثال: <span className="font-mono text-foreground" dir="ltr">0555 12 34 56</span> (9 أو 10 أرقام تبدأ بـ 05/06/07)
        </p>
      ) : validation.valid ? (
        <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
          <span>✓</span>
          <span>رقم هاتف صالح: {validation.formatted}</span>
        </p>
      ) : null}
    </div>
  );
}
