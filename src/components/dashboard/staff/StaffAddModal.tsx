"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface StaffAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  setName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
}

export function StaffAddModal({
  isOpen,
  onClose,
  name,
  setName,
  phone,
  setPhone,
  error,
  onSubmit,
}: StaffAddModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="إضافة موظف جديد للمحل"
      maxWidth="md"
    >
      <form onSubmit={onSubmit} className="space-y-4 text-right">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">الاسم واللقب *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: يونس قاسمي"
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            رقم هاتف الموظف (لإرسال رمز OTP) *
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0661 99 88 77"
            dir="ltr"
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 text-right font-mono"
          />
        </div>

        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
          💡 سيتمكن الموظف من تسجيل الدخول برقم هاتفه مباشرة، وستكون صلاحياته محددة في إنجاز
          وثائق الزبائن والطباعة دون أي وصول لإعدادات الخزينة أو الرصيد.
        </div>

        {error && (
          <div className="text-xs text-red-400 font-bold p-2 rounded-lg bg-red-950/40 border border-red-500/20">
            ⚠️ {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            إلغاء
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            تأكيد الإضافة 👤
          </Button>
        </div>
      </form>
    </Modal>
  );
}
