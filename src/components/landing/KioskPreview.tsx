"use client";

import React from "react";
import { QrCode, Printer, FileText } from "lucide-react";

export function KioskPreview() {
  return (
    <div className="mt-14 max-w-4xl mx-auto rounded-3xl p-2 sm:p-3 bg-gradient-to-b from-border/70 to-border/20 border border-border/80 shadow-2xl relative">
      <div className="rounded-2xl bg-card border border-border overflow-hidden text-right">
        {/* Browser / Counter Bar */}
        <div className="px-4 py-3 bg-muted/40 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="mr-3 text-xs font-mono text-muted-foreground">
              sahla.dz/counter · كاونتر كشك النجاح
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              الطابعة متصلة (Epson L3250)
            </span>
          </div>
        </div>

        {/* Simulated Counter Dashboard */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left: Live QR Print Reception */}
          <div className="p-4 rounded-xl bg-background border border-border flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-muted-foreground">
                  رمز استقبال الملفات السريع
                </span>
                <QrCode size={18} className="text-emerald-500" />
              </div>
              <div className="w-36 h-36 mx-auto rounded-xl bg-emerald-500/10 border-2 border-dashed border-emerald-500/30 flex flex-col items-center justify-center p-3 text-center">
                <QrCode size={64} className="text-emerald-600 dark:text-emerald-400 mb-1" />
                <span className="text-[10px] font-bold text-foreground">
                  امسح وارفع وثيقتك
                </span>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground text-center mt-3">
              يمسح الزبون الرمز بهاتفه وتردك الوثيقة جاهزة للطباعة فورياً.
            </p>
          </div>

          {/* Middle & Right: Active Print Queue */}
          <div className="p-4 rounded-xl bg-background border border-border md:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Printer size={16} className="text-emerald-500" />
                طابور الطباعة الحي
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                3 طلبات جديدة
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-600">
                    <FileText size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">
                      شهادة_ميلاد_رقمية.pdf
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      صفحة واحدة · أبيض وأسود · الزبون: أمين ز.
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-600">15 دج</span>
                  <button className="px-3 py-1 rounded-md bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition">
                    طباعة 🖨️
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-500/15 flex items-center justify-center text-teal-600">
                    <FileText size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">
                      بطاقة_الشفاء_سكان.pdf
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      صفحتان · ملون وجهان · الزبون: مريم ب.
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-600">40 دج</span>
                  <button className="px-3 py-1 rounded-md bg-muted text-foreground text-xs font-bold border border-border">
                    جاهز
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
