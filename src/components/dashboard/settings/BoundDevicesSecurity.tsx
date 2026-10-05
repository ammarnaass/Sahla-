"use client";

import React from "react";

interface BoundDevicesSecurityProps {
  onUnbindDevice?: (deviceId: string) => void;
}

export function BoundDevicesSecurity({ onUnbindDevice }: BoundDevicesSecurityProps) {
  const handleUnbind = (id: string) => {
    if (onUnbindDevice) {
      onUnbindDevice(id);
    } else {
      alert("تم فك ارتباط الجهاز بنجاح");
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-extrabold text-white">
              الأجهزة المقترنة (Bound Devices)
            </h3>
            <p className="text-[11px] text-slate-400">
              حماية الحساب من المشاركة خارج المحل وفق قانون 18-07
            </p>
          </div>
          <span className="text-2xl">📱</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          يُسمح بربط جهازين نشطين كحد أقصى لكل محل (هاتف الكاونتر وحاسوب الطابعة). يتم إلغاء الجلسات
          القديمة تلقائياً عند تجاوز الحد.
        </p>

        <div className="space-y-2.5">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="text-lg">💻</span>
              <div>
                <div className="font-bold text-white">حاسوب الكاونتر الرئيسي (Windows)</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Chrome 122.0 • الجزائر العاصمة
                </div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
              الجهاز الحالي
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="text-lg">📱</span>
              <div>
                <div className="font-bold text-white">هاتف الكاتب العمومي (Samsung A34)</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Mobile App • نشط منذ ساعتين
                </div>
              </div>
            </div>
            <button
              onClick={() => handleUnbind("dev_2")}
              className="text-[11px] font-bold text-red-400 hover:text-red-300"
            >
              فك الارتباط
            </button>
          </div>
        </div>
      </div>

      <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-[11px] text-slate-500">
        🔒 تشفير الجلسات عبر توكنات HttpOnly JWT آمنة تدوم 30 يوماً متوافقة مع متطلبات الأمان الوطنية
      </div>
    </div>
  );
}
