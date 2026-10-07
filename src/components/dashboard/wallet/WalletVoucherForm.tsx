"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface WalletVoucherFormProps {
  scratchPin: string;
  onPinChange: (val: string) => void;
  onRedeem: (e: React.FormEvent) => void;
  pinError: string;
  pinSuccess: string;
  isRedeeming: boolean;
}

export function WalletVoucherForm({
  scratchPin,
  onPinChange,
  onRedeem,
  pinError,
  pinSuccess,
  isRedeeming,
}: WalletVoucherFormProps) {
  return (
    <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between transition-colors">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              شحن الرصيد ببطاقة تعبئة (Scratch Card)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              أدخل الكود المكون من 16 رقماً الموجود تحت الطبقة الفضية على بطاقتك
            </p>
          </div>
          <span className="text-2xl">🎟️</span>
        </div>

        <form onSubmit={onRedeem} className="space-y-3">
          <div>
            <input
              type="text"
              value={scratchPin}
              onChange={(e) => onPinChange(e.target.value)}
              placeholder="9482-1049-8392-1048"
              dir="ltr"
              maxLength={19}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-mono text-center text-sm tracking-wider focus:outline-none focus:border-emerald-500 shadow-inner transition-colors"
            />
          </div>

          {pinError && (
            <div className="text-xs text-red-600 dark:text-red-400 font-bold p-2.5 rounded-xl bg-red-500/10 border border-red-500/30">
              {pinError}
            </div>
          )}

          {pinSuccess && (
            <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 animate-in fade-in">
              {pinSuccess}
            </div>
          )}

          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              variant="primary"
              disabled={isRedeeming || !scratchPin.trim()}
              className="text-xs px-6 py-2.5 flex items-center gap-2 shadow-md shadow-emerald-500/20"
            >
              {isRedeeming ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>جاري التحقق وشحن الرصيد...</span>
                </>
              ) : (
                <>
                  <span>تأكيد شحن البطاقة</span>
                  <span>⚡</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
        تباع بطاقات التعبئة لدى شبكة موزعي سهلة المعتمدين في ولايتك بدون أي عمولات إضافية.
      </div>
    </div>
  );
}
