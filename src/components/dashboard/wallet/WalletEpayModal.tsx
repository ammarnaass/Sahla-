"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface WalletEpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: { points: number; dzd: number } | null;
  paymentSuccess: boolean;
  onConfirmEpay: () => void;
}

export function WalletEpayModal({
  isOpen,
  onClose,
  selectedPackage,
  paymentSuccess,
  onConfirmEpay,
}: WalletEpayModalProps) {
  if (!selectedPackage) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="بوابة الدفع الإلكتروني الجزائري 🇩🇿"
      maxWidth="max-w-md"
    >
      <div className="space-y-5 text-right">
        {paymentSuccess ? (
          <div className="py-8 text-center space-y-3 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 text-3xl flex items-center justify-center mx-auto border border-emerald-500/30">
              ✓
            </div>
            <h4 className="text-base font-extrabold text-white">تمت عملية الدفع بنجاح!</h4>
            <div className="text-xs text-slate-400">
              تمت إضافة {selectedPackage.points} نقطة إلى رصيد المحل
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center">
              <div>
                <div className="text-sm font-bold text-white">
                  شحن {selectedPackage.points} نقطة
                </div>
                <div className="text-xs text-slate-400">المبلغ الإجمالي المطلوب دفعه</div>
              </div>
              <div className="text-lg font-black text-emerald-400 font-mono">
                {selectedPackage.dzd.toLocaleString()} دج
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-300">اختر وسيلة الدفع:</div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="p-3 rounded-xl border border-emerald-500 bg-slate-900 text-xs font-bold text-white flex flex-col items-center gap-1.5 shadow-md shadow-emerald-950/40"
                >
                  <span className="text-xl">💳</span>
                  <span>البطاقة الذهبية (Edahabia)</span>
                </button>
                <button
                  type="button"
                  className="p-3 rounded-xl border border-slate-800 bg-slate-900 text-xs font-bold text-slate-300 flex flex-col items-center gap-1.5 hover:border-slate-700"
                >
                  <span className="text-xl">🏦</span>
                  <span>بطاقة CIB البنكية</span>
                </button>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 text-center leading-relaxed">
              🔒 المعاملات مؤمنة عبر منصة النقد الآلي وتمرير المعاملات SATIM ومتوافقة مع القانون 18-05
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                إلغاء
              </Button>
              <Button variant="primary" onClick={onConfirmEpay} className="flex-1">
                تأكيد الدفع ({selectedPackage.dzd} دج) ⚡
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
