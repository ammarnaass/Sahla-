"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

interface WirelessPrintBridgeProps {
  pin: string;
  isCounterPC: boolean;
  setIsCounterPC: (v: boolean) => void;
  autoPrint: boolean;
  setAutoPrint: (v: boolean) => void;
  testPrintStatus: string;
  onTestPrint: () => void;
}

export function WirelessPrintBridge({
  pin,
  isCounterPC,
  setIsCounterPC,
  autoPrint,
  setAutoPrint,
  testPrintStatus,
  onTestPrint,
}: WirelessPrintBridgeProps) {
  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-extrabold text-white">
            جسر الطباعة اللاسلكي (Phone-to-PC Bridge)
          </h3>
          <p className="text-[11px] text-slate-400">
            بروتوكول Server-Sent Events اللحظي لبث الوثائق من الهاتف للطابعة
          </p>
        </div>
        <span className="text-2xl">📡</span>
      </div>

      {/* PIN Card */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
        <div className="text-xs text-slate-400 font-bold">
          رمز اقتران حاسوب الكاونتر (Printer PIN)
        </div>
        <div className="text-4xl font-black text-emerald-400 font-mono tracking-widest">{pin}</div>
        <div className="text-[11px] text-slate-500">
          أدخل هذا الرمز في متصفح حاسوب المحل الموصول بالطابعة
        </div>
      </div>

      {/* Connection Status */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-white">حالة الاتصال:</span>
          <span className="text-emerald-400">متصل وجاهز للاستقبال اللحظي</span>
        </div>
        <span className="text-slate-400 font-mono text-[10px]">Port: 5000 / SSE</span>
      </div>

      {/* Actions & Toggles */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
          <div>
            <div className="font-bold text-white">الطباعة التلقائية الفورية</div>
            <div className="text-[11px] text-slate-400">
              فتح نافذة الطباعة مباشرة بمجرد إنهاء المستند
            </div>
          </div>
          <input
            type="checkbox"
            checked={autoPrint}
            onChange={(e) => setAutoPrint(e.target.checked)}
            className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
          <div>
            <div className="font-bold text-white">وضع حاسوب الاستقبال (Receiver Mode)</div>
            <div className="text-[11px] text-slate-400">
              تفعيل الاستماع الدائم لأوامر الهواتف على هذا الجهاز
            </div>
          </div>
          <input
            type="checkbox"
            checked={isCounterPC}
            onChange={(e) => setIsCounterPC(e.target.checked)}
            className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
          />
        </div>
      </div>

      {testPrintStatus && (
        <div className="text-xs text-emerald-400 font-bold p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/30">
          ✓ {testPrintStatus}
        </div>
      )}

      <div className="pt-2">
        <Button variant="outline" onClick={onTestPrint} className="w-full text-xs py-2.5">
          إرسال صفحة اختبار لطابعة المحل 🖨️
        </Button>
      </div>
    </div>
  );
}
