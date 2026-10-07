"use client";

import React, { useState } from "react";
import {
  X,
  Store,
  MapPin,
  Phone,
  Mail,
  Coins,
  CheckCircle2,
  XCircle,
  Calendar,
  Sparkles,
  Zap,
  Copy,
  Check,
  ShieldAlert,
} from "lucide-react";
import { Button as MuiButton } from "@mui/material";
import type { ShopRecord } from "@/server/repositories/shopRepository";

interface ShopDetailsModalProps {
  shop: ShopRecord | null;
  onClose: () => void;
  onTopup: (shopId: string, points: number) => void;
  onToggleStatus: (shopId: string) => void;
}

export function ShopDetailsModal({
  shop,
  onClose,
  onTopup,
  onToggleStatus,
}: ShopDetailsModalProps) {
  const [topupAmount, setTopupAmount] = useState(100);
  const [isTopupSuccess, setIsTopupSuccess] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!shop) return null;

  const handleQuickTopup = (pts: number) => {
    onTopup(shop.id, pts);
    setIsTopupSuccess(true);
    setTimeout(() => setIsTopupSuccess(false), 3000);
  };

  const copyPhone = () => {
    if (shop.phone) {
      navigator.clipboard.writeText(shop.phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const planName =
    shop.plan === "ENTERPRISE"
      ? "باقة كبرى (Enterprise)"
      : shop.plan === "PRO_KIOSK"
      ? "كشك احترافي (Pro Kiosk)"
      : "باقة الانطلاقة (Starter)";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-card border border-border rounded-3xl max-w-xl w-full p-6 shadow-2xl relative overflow-hidden animate-scaleIn text-right">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute left-5 top-5 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
          aria-label="إغلاق النافذة"
        >
          <X size={18} />
        </button>

        {/* Header: Shop identity */}
        <div className="flex items-start gap-4 mb-6 pr-1">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black text-2xl shadow-md shrink-0">
            <Store size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-foreground font-cairo">
                {shop.name}
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  shop.isActive
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                    : "bg-destructive/15 text-destructive border border-destructive/30"
                }`}
              >
                {shop.isActive ? "نشط بالسحابة" : "مجمد وموقوف"}
              </span>
            </div>

            <p className="text-xs text-muted-foreground font-cairo mt-1 flex items-center gap-2">
              <span>مسير المحل: <strong className="text-foreground">{shop.owner}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1 font-bold text-foreground">
                <MapPin size={12} className="text-emerald-500" />
                {shop.wilaya}
              </span>
            </p>
          </div>
        </div>

        {/* Commercial Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {/* Points Balance */}
          <div className="p-3.5 rounded-2xl bg-muted/30 border border-border">
            <span className="text-[11px] font-bold text-muted-foreground block font-cairo">
              رصيد النقاط المتاح
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <Coins size={16} className="text-amber-500" />
              <span className="text-xl font-black text-foreground font-mono">
                {(shop.pointsBalance ?? 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* SaaS Plan */}
          <div className="p-3.5 rounded-2xl bg-muted/30 border border-border">
            <span className="text-[11px] font-bold text-muted-foreground block font-cairo">
              باقة الاشتراك الحالية
            </span>
            <div className="flex items-center gap-1 mt-1">
              <Sparkles size={14} className="text-teal-500" />
              <span className="text-xs font-bold text-foreground font-cairo">
                {planName}
              </span>
            </div>
          </div>

          {/* Activity Type */}
          <div className="p-3.5 rounded-2xl bg-muted/30 border border-border col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold text-muted-foreground block font-cairo">
              تصنيف النشاط
            </span>
            <span className="text-xs font-bold text-foreground font-cairo mt-1 block">
              {shop.activity || "كيوسك ومكتبة خدمات"}
            </span>
          </div>
        </div>

        {/* Contact Info Strip */}
        <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-2.5 mb-6 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Phone size={13} className="text-emerald-500" /> رقم الهاتف:
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-foreground">{shop.phone || "غير مسجل"}</span>
              {shop.phone && (
                <button
                  type="button"
                  onClick={copyPhone}
                  className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                  title="نسخ رقم الهاتف"
                >
                  {copiedPhone ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Calendar size={13} className="text-teal-500" /> تاريخ الانضمام:
            </span>
            <span className="font-mono text-muted-foreground">
              {new Date(shop.createdAt).toLocaleDateString("ar-DZ", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Quick Topup Section */}
        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-foreground font-cairo flex items-center gap-1.5">
              <Zap size={14} className="text-emerald-500" />
              شحن رصيد كاونتر المحل الإداري الفوري
            </h4>
            {isTopupSuccess && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 size={12} /> تم الشحن بنجاح!
              </span>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2 mb-3">
            {[50, 100, 250, 500].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => handleQuickTopup(amt)}
                className="py-1.5 px-2 rounded-xl text-xs font-mono font-bold bg-card border border-border hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                +{amt} ن
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min={10}
              max={10000}
              value={topupAmount}
              onChange={(e) => setTopupAmount(Number(e.target.value))}
              placeholder="كمية مخصصة..."
              className="flex-1 py-1.5 px-3 rounded-xl bg-card border border-border text-xs font-mono font-bold text-foreground focus:outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={() => handleQuickTopup(topupAmount)}
              className="py-1.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer font-cairo shadow-sm"
            >
              شحن القيمة
            </button>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => onToggleStatus(shop.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              shop.isActive
                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/30"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
            }`}
          >
            {shop.isActive ? (
              <>
                <XCircle size={14} /> تجميد الحساب
              </>
            ) : (
              <>
                <CheckCircle2 size={14} /> إعادة تنشيط الحساب
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-foreground transition-all cursor-pointer font-cairo"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
