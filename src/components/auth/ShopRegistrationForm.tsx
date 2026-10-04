"use client";

import React, { useState } from "react";
import { ALGERIAN_WILAYAS, ACTIVITY_TYPES } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { LegalConsentCheckbox } from "./LegalConsentCheckbox";

interface ShopRegistrationFormProps {
  phone: string;
  onSubmit: (data: {
    phone: string;
    shopName: string;
    ownerName: string;
    wilayaCode: number;
    activityType: string;
    consentAgreed: boolean;
  }) => void;
  isLoading?: boolean;
}

export function ShopRegistrationForm({ phone, onSubmit, isLoading }: ShopRegistrationFormProps) {
  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [wilayaCode, setWilayaCode] = useState<number>(16); // 16 = Alger default
  const [activityType, setActivityType] = useState<string>("KIOSK");
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!shopName.trim()) {
      errs.shopName = "يرجى كتابة اسم المحل أو المكتبة";
    }
    if (!ownerName.trim()) {
      errs.ownerName = "يرجى إدخال اسم صاحب المحل";
    }
    if (!consentAgreed) {
      errs.consent = "يجب الموافقة على الشروط وسياسة الخصوصية للمتابعة";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      phone,
      shopName: shopName.trim(),
      ownerName: ownerName.trim(),
      wilayaCode,
      activityType,
      consentAgreed,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-right">
      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-between">
        <span>مرحباً بك! هذه أول مرة تسجل برقمك:</span>
        <span className="font-mono font-bold text-white" dir="ltr">
          {phone}
        </span>
      </div>

      {/* Shop Name */}
      <div>
        <label className="block text-xs font-bold text-slate-300 mb-1.5">
          اسم المحل أو المكتبة *
        </label>
        <input
          type="text"
          placeholder="مثال: مكتبة النجاح، كيوسك الأمل..."
          value={shopName}
          onChange={(e) => {
            setShopName(e.target.value);
            if (errors.shopName) setErrors((prev) => ({ ...prev, shopName: "" }));
          }}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        />
        {errors.shopName && <p className="text-xs text-red-400 mt-1">⚠️ {errors.shopName}</p>}
      </div>

      {/* Owner Name */}
      <div>
        <label className="block text-xs font-bold text-slate-300 mb-1.5">
          اسم صاحب المحل أو المسؤول *
        </label>
        <input
          type="text"
          placeholder="الاسم واللقب"
          value={ownerName}
          onChange={(e) => {
            setOwnerName(e.target.value);
            if (errors.ownerName) setErrors((prev) => ({ ...prev, ownerName: "" }));
          }}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        />
        {errors.ownerName && <p className="text-xs text-red-400 mt-1">⚠️ {errors.ownerName}</p>}
      </div>

      {/* Wilaya Selection (58 Algerian Wilayas) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            الولاية (58 ولاية) *
          </label>
          <select
            value={wilayaCode}
            onChange={(e) => setWilayaCode(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          >
            {ALGERIAN_WILAYAS.map((w) => (
              <option key={w.code} value={w.code} className="bg-slate-900 text-white">
                {w.code} - {w.nameAr} ({w.nameFr})
              </option>
            ))}
          </select>
        </div>

        {/* Activity Type */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            نوع النشاط *
          </label>
          <select
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          >
            {ACTIVITY_TYPES.map((act) => (
              <option key={act.code} value={act.code} className="bg-slate-900 text-white">
                {act.nameAr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Legal Consent */}
      <div className="pt-2">
        <LegalConsentCheckbox
          checked={consentAgreed}
          onChange={(val) => {
            setConsentAgreed(val);
            if (errors.consent) setErrors((prev) => ({ ...prev, consent: "" }));
          }}
          error={errors.consent}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        className="w-full mt-4 font-bold shadow-lg shadow-emerald-900/40"
      >
        <span>إتمام التسجيل والدخول إلى المحل</span>
        <svg className="w-5 h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Button>
    </form>
  );
}
