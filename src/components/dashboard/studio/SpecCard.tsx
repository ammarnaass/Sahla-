"use client";

import React from "react";
import { SparklesIcon, ShieldCheckIcon, BoltIcon } from "@/components/ui/Icons";
import { Spec, SpecWarning } from "@/server/education/guidance/types";

interface SpecCardProps {
  spec: Spec | null;
  pointsBalance: number;
  isLoading?: boolean;
  onModifyField?: (field: string, value: any) => void;
  onApproveAndGenerate?: () => void;
}

export const SpecCard: React.FC<SpecCardProps> = ({
  spec,
  pointsBalance,
  isLoading = false,
  onModifyField,
  onApproveAndGenerate,
}) => {
  if (!spec) return null;

  const cost = spec.estimate_points || 15;
  const hasEnoughPoints = pointsBalance >= cost;

  return (
    <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-2xl p-4 shadow-xl text-slate-100 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <SparklesIcon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>بطاقة المواصفة المعتمدة (Spec Card)</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                {spec.pack_id}
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">عقد المخرجات الدقيق قبل خصم النقاط والتوليد</p>
          </div>
        </div>

        {/* Cost Badge */}
        <div className="text-left">
          <div className="flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1 rounded-xl text-emerald-300 font-mono text-xs font-bold">
            <BoltIcon size={13} className="text-amber-400" />
            <span>{cost} نقطة</span>
          </div>
        </div>
      </div>

      {/* Summary Arabic Text (Section 3.4) */}
      <div className="bg-slate-950/70 border border-emerald-500/20 rounded-xl p-3 mb-3">
        <p className="text-xs leading-relaxed text-emerald-100/90 font-medium">
          «سننتج لك: {spec.summary_ar}»
        </p>
      </div>

      {/* Constraints Specs Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-[11px]">
        <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
          <span className="text-slate-400 block text-[10px]">الأقسام المقررة:</span>
          <span className="font-bold text-white">{spec.structure.length} أقسام منهجية</span>
        </div>
        <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
          <span className="text-slate-400 block text-[10px]">الكلمات للقسم:</span>
          <span className="font-bold text-white">
            {spec.constraints.words_per_section ? `${spec.constraints.words_per_section.min}-${spec.constraints.words_per_section.max}` : "مضبوط آلياً"}
          </span>
        </div>
        <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
          <span className="text-slate-400 block text-[10px]">نظام الأرقام:</span>
          <span className="font-bold text-white">
            {spec.constraints.numerals === "western" ? "أرقام مغاربية (1, 2, 3)" : "أرقام مشرقية"}
          </span>
        </div>
        <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
          <span className="text-slate-400 block text-[10px]">الغلاف والمراجع:</span>
          <span className="font-bold text-white">رسمي جزائري (ONPS)</span>
        </div>
      </div>

      {/* Smart Warnings (Section 3.5) */}
      {spec.warnings && spec.warnings.length > 0 && (
        <div className="space-y-1.5 mb-3">
          {spec.warnings.map((w: SpecWarning, idx: number) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl text-[11px] border flex flex-col gap-1 ${
                w.code === "topic_broad"
                  ? "bg-amber-950/30 border-amber-500/30 text-amber-200"
                  : "bg-blue-950/30 border-blue-500/30 text-blue-200"
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                <span>⚠️ {w.message}</span>
              </div>
              {w.suggestions && w.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="text-[10px] text-slate-400">اقتراحات محددة:</span>
                  {w.suggestions.map((sug, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => onModifyField && onModifyField("topic", sug)}
                      className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] transition-colors cursor-pointer"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
        <div className="text-[11px] text-slate-400 flex items-center gap-1">
          <ShieldCheckIcon size={14} className="text-emerald-600 dark:text-emerald-400" />
          <span>مطابقة حتمية قبل خصم أي نقطة</span>
        </div>

        <button
          type="button"
          disabled={isLoading || !hasEnoughPoints}
          onClick={onApproveAndGenerate}
          className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            !hasEnoughPoints
              ? "bg-slate-800 text-slate-500 cursor-not-allowed"
              : isLoading
              ? "bg-emerald-700 text-white opacity-70 animate-pulse"
              : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/40"
          }`}
        >
          {isLoading ? (
            <span>جارِ التوليد والتحقق...</span>
          ) : (
            <>
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>اعتماد المواصفة وبدء التوليد ({cost} نقطة)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
