"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface DocumentsHeaderProps {
  onOpenStudio: (serviceCode: string) => void;
  printSuccessNotice: string;
}

export function DocumentsHeader({ onOpenStudio, printSuccessNotice }: DocumentsHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display">
            سجل الوثائق والمستندات المنجزة 📑
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            إدارة وطباعة الوثائق المجهزة للزبائن مع الحذف الآلي الذاتي وفق قانون حماية المعطيات
            18-07
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="primary"
            onClick={() => onOpenStudio("SCHOOL_RESEARCH")}
            className="text-xs py-2.5 px-4 shadow-md shadow-emerald-950/40"
          >
            <span>إنجاز بحث مدرسي جديد +</span>
          </Button>
        </div>
      </div>

      {printSuccessNotice && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-in fade-in">
          <span>🖨️</span>
          <span>{printSuccessNotice}</span>
        </div>
      )}
    </div>
  );
}
