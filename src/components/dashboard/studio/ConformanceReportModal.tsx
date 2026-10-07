"use client";

import React from "react";
import { CheckCircleIcon, ShieldCheckIcon } from "@/components/ui/Icons";
import { ConformanceReport, ConformanceCheck } from "@/server/education/guidance/types";

interface ConformanceReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ConformanceReport | null;
  documentTitle?: string;
}

export const ConformanceReportModal: React.FC<ConformanceReportModalProps> = ({
  isOpen,
  onClose,
  report,
  documentTitle,
}) => {
  if (!isOpen || !report) return null;

  const scorePct = Math.round(report.score * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheckIcon size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>تقرير المطابقة والتحقق الأكاديمي</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                  report.pass ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                }`}>
                  {report.pass ? "مطابق للمنهاج الجزائري" : "يحتاج مراجعة"}
                </span>
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-md">
                {documentTitle || "فحص معايير الجيل الثاني وسلالم التنقيط الرسمية"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Score & Key Metrics Banner */}
        <div className="p-4 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {scorePct}%
              </div>
              <span className="text-[10px] text-slate-400">درجة المطابقة</span>
            </div>

            <div className="h-8 w-px bg-slate-800" />

            <div className="text-xs space-y-0.5">
              <div className="text-slate-300 font-medium">
                محاولات التحقق والإصلاح: <span className="font-bold text-white">{report.attempts}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                حد النجاح المعتمد: <span className="text-emerald-600 dark:text-emerald-400 font-mono">≥ 85%</span> بدون أخطاء حرجة
              </div>
            </div>
          </div>

          <div className="text-left text-[11px] text-slate-400 font-mono">
            {new Date(report.evaluated_at).toLocaleTimeString("ar-DZ")}
          </div>
        </div>

        {/* Checks Breakdown List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <h4 className="text-xs font-bold text-slate-300 mb-2">
            سجل المدققات الوطنية (V01 - V16):
          </h4>

          {report.checks.map((check: ConformanceCheck) => (
            <div
              key={check.id}
              className={`p-2.5 rounded-xl border text-xs flex items-start justify-between gap-3 transition-colors ${
                check.status === "ok"
                  ? "bg-slate-900/60 border-slate-800 text-slate-200"
                  : check.status === "fixed"
                  ? "bg-blue-950/30 border-blue-500/30 text-blue-200"
                  : "bg-rose-950/30 border-rose-500/30 text-rose-200"
              }`}
            >
              <div className="flex items-start gap-2">
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                  check.severity === "critical"
                    ? "bg-rose-500/20 text-rose-300"
                    : check.severity === "high"
                    ? "bg-amber-500/20 text-amber-300"
                    : "bg-slate-700 text-slate-300"
                }`}>
                  {check.id}
                </span>

                <div>
                  <div className="font-bold text-white text-xs">{check.name}</div>
                  {check.detail && (
                    <p className="text-[11px] text-slate-400 mt-0.5">{check.detail}</p>
                  )}
                  {check.fix_applied && (
                    <div className="text-[11px] text-blue-300 mt-1 flex items-center gap-1 font-mono">
                      <span>🛠️ تم الإصلاح آلياً:</span>
                      <span>{check.fix_applied}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div>
                {check.status === "ok" && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                    <CheckCircleIcon size={12} />
                    <span>مطابق</span>
                  </span>
                )}
                {check.status === "fixed" && (
                  <span className="text-[11px] text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-full font-bold">
                    تم التصليح
                  </span>
                )}
                {check.status === "failed" && (
                  <span className="text-[11px] text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-full font-bold">
                    معيب
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            إغلاق التقرير
          </button>
        </div>
      </div>
    </div>
  );
};
