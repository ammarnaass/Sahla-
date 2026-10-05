"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { ALGERIAN_WILAYAS, ACTIVITY_TYPES } from "@/lib/constants";

interface StaffShopProfileFormProps {
  shopName: string;
  setShopName: (v: string) => void;
  ownerName: string;
  setOwnerName: (v: string) => void;
  wilayaCode: number;
  setWilayaCode: (v: number) => void;
  commune: string;
  setCommune: (v: string) => void;
  activityType: string;
  setActivityType: (v: string) => void;
  saveSuccess: boolean;
  onSave: (e: React.FormEvent) => void;
}

export function StaffShopProfileForm({
  shopName,
  setShopName,
  ownerName,
  setOwnerName,
  wilayaCode,
  setWilayaCode,
  commune,
  setCommune,
  activityType,
  setActivityType,
  saveSuccess,
  onSave,
}: StaffShopProfileFormProps) {
  return (
    <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-extrabold text-white">البيانات الرسمية للمحل</h3>
          <p className="text-[11px] text-slate-400">
            تظهر هذه المعلومات في ترويسة الفواتير والوثائق المطبوعة
          </p>
        </div>
        <span className="text-xl">🏪</span>
      </div>

      <form onSubmit={onSave} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              اسم المحل أو المكتبة *
            </label>
            <input
              type="text"
              required
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              اسم المسؤول / صاحب المحل *
            </label>
            <input
              type="text"
              required
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              الولاية (58 ولاية) *
            </label>
            <select
              value={wilayaCode}
              onChange={(e) => setWilayaCode(parseInt(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              {ALGERIAN_WILAYAS.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.code.toString().padStart(2, "0")} - {w.nameAr}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">البلدية *</label>
            <input
              type="text"
              required
              value={commune}
              onChange={(e) => setCommune(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              نوع النشاط التجاري
            </label>
            <select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              {ACTIVITY_TYPES.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.nameAr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {saveSuccess && (
          <div className="text-xs text-emerald-400 font-bold p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
            ✓ تم حفظ بيانات المحل بنجاح وتحديث ترويسة الوثائق!
          </div>
        )}

        <div className="pt-2">
          <Button type="submit" variant="primary" className="text-xs py-2 px-6">
            حفظ التعديلات 💾
          </Button>
        </div>
      </form>
    </div>
  );
}
