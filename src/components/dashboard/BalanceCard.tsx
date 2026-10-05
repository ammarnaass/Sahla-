"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { AlertTriangleIcon, CardEpayIcon } from "@/components/ui/Icons";

interface BalanceCardProps {
  points: number;
  onRecharge: (pointsToAdd: number) => void;
}

export function BalanceCard({ points, onRecharge }: BalanceCardProps) {
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [scratchCardCode, setScratchCardCode] = useState("");
  const [topupError, setTopupError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const isLow = points > 0 && points <= 20;
  const isZero = points <= 0;

  const handleRedeemCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scratchCardCode.trim()) {
      setTopupError("يرجى إدخال كود بطاقة الشحن");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      // Simulate redeeming 100 points
      onRecharge(100);
      setScratchCardCode("");
      setShowTopupModal(false);
    }, 600);
  };

  const handleDemoAdd = (pts: number) => {
    onRecharge(pts);
    setShowTopupModal(false);
  };

  return (
    <>
      <div
        className={`p-6 rounded-3xl border shadow-lg relative overflow-hidden transition-all duration-300 text-right ${
          isZero
            ? "bg-gradient-to-br from-rose-50 via-white to-rose-50/50 dark:from-red-950/50 dark:via-slate-900 dark:to-slate-900 border-rose-300 dark:border-red-500/50"
            : isLow
            ? "bg-gradient-to-br from-amber-50 via-white to-amber-50/50 dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900 border-amber-300 dark:border-amber-500/50"
            : "bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/40 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 border-emerald-200 dark:border-emerald-500/30"
        }`}
      >
        {/* Glow corner */}
        <div
          className={`absolute -top-12 -left-12 w-40 h-40 rounded-full blur-3xl pointer-events-none ${
            isZero ? "bg-red-500/15" : isLow ? "bg-amber-500/15" : "bg-emerald-500/15"
          }`}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">رصيد محفظتك الرقمية</span>
              {isZero ? (
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-red-500/15 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30">
                  نفد الرصيد
                </span>
              ) : isLow ? (
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                  رصيد منخفض
                </span>
              ) : (
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  رصيد نشط
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                {points.toLocaleString()}
              </span>
              <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">نقطة</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              {isZero
                ? "يُرجى شحن الرصيد لتتمكن من إنشاء وتوليد الوثائق المدفوعة لزبائنك."
                : isLow
                ? "قارب رصيدك على الانتهاء. اشحن الآن لتفادي أي انقطاع في الخدمة."
                : "رصيدك كافٍ لإنجاز وثائق متعددة وطباعتها فورياً."}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Button
              variant={isZero ? "danger" : isLow ? "gold" : "primary"}
              size="lg"
              onClick={() => setShowTopupModal(true)}
              className="px-6 font-bold shadow-md shadow-emerald-900/20 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>شحن الرصيد</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Top up Modal */}
      <Modal
        isOpen={showTopupModal}
        onClose={() => setShowTopupModal(false)}
        title="شحن رصيد المحل (نقاط سهلة)"
        description="اختر الطريقة الأنسب لشحن رصيد محلك فورياً"
      >
        <div className="space-y-5 text-right">
          {/* Quick Demo Options */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
              شحن تجريبي فوري (لأغراض العرض والتجربة):
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoAdd(50)}
                className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-center transition-colors cursor-pointer"
              >
                <span className="block text-base font-bold text-slate-900 dark:text-white font-mono">+50</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">نقطة</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoAdd(150)}
                className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-center transition-colors cursor-pointer"
              >
                <span className="block text-base font-bold text-slate-900 dark:text-white font-mono">+150</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">نقطة</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoAdd(500)}
                className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-center transition-colors cursor-pointer"
              >
                <span className="block text-base font-bold text-slate-900 dark:text-white font-mono">+500</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">نقطة</span>
              </button>
            </div>
          </div>

          {/* Physical Scratch Card Pin Input */}
          <form onSubmit={handleRedeemCode} className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                تعبئة عبر بطاقة الشحن (Scratch Card PIN):
              </label>
              <input
                type="text"
                placeholder="أدخل الرمز المكون من 14 أو 16 رقماً..."
                value={scratchCardCode}
                onChange={(e) => {
                  setScratchCardCode(e.target.value);
                  setTopupError("");
                }}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-3 text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:border-emerald-500"
              />
              {topupError && (
                <p className="text-xs text-rose-500 dark:text-rose-400 mt-1 flex items-center gap-1.5 font-bold">
                  <AlertTriangleIcon className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{topupError}</span>
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isProcessing}
              className="w-full font-bold cursor-pointer"
            >
              تأكيد وتعبئة البطاقة
            </Button>
          </form>

          {/* Electronic Payments info */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <CardEpayIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>الدفع الإلكتروني (بريدي موب / الذهبية / CIB):</span>
            </div>
            <p className="leading-relaxed">
              يمكنك أيضاً الشحن التلقائي بربط حسابك مع خدمة الدفع المباشر بالبطاقة الذهبية أو CIB.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
