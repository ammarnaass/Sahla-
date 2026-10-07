"use client";

import React, { useState } from "react";
import {
  X,
  Radio,
  Send,
  AlertTriangle,
  Info,
  BellRing,
  CheckCircle2,
  Globe,
  Sparkles,
} from "lucide-react";
import { ALGERIAN_WILAYAS } from "@/lib/constants";

interface NationalBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBroadcastSent: (message: string) => void;
}

export function NationalBroadcastModal({
  isOpen,
  onClose,
  onBroadcastSent,
}: NationalBroadcastModalProps) {
  const [title, setTitle] = useState("تنبيه وزاري: تحديث استمارات الحالة المدنية 2026");
  const [message, setMessage] = useState(
    "يرجى من كافة أصحاب الأكشاك والمكتبات اعتماد النماذج الرسمية المحينة فورياً عبر المنظومة لضمان مطابقة الوثائق."
  );
  const [priority, setPriority] = useState<"urgent" | "important" | "info">("urgent");
  const [targetScope, setTargetScope] = useState<"ALL" | "CUSTOM">("ALL");
  const [selectedWilaya, setSelectedWilaya] = useState<string>("ALL");
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setIsSent(true);
    onBroadcastSent(`تم بث التنبيه الوطني بنجاح: "${title}" عبر شبكة الأكشاك`);
    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-card border border-border rounded-3xl max-w-xl w-full p-6 shadow-2xl relative overflow-hidden animate-scaleIn text-right">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute left-5 top-5 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
          aria-label="إغلاق النافذة"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pr-1">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Radio size={24} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black text-foreground font-cairo flex items-center gap-2">
              بث إشعار وتنبيه وطني عاجل (National Broadcast)
            </h2>
            <p className="text-xs text-muted-foreground font-cairo">
              إرسال تنبيه فوري يظهر في الشريط العلوي لجميع كاونترات الأكشاك في الجزائر
            </p>
          </div>
        </div>

        {isSent ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-base font-bold text-foreground font-cairo">
              تم إرسال التنبيه الوطني بنجاح! 🇩🇿
            </h3>
            <p className="text-xs text-muted-foreground font-cairo">
              يتم الآن عرض التنبيه في شاشات كافة الأكشاك والمكتبات المتصلة بالسحابة فورياً.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            {/* Priority Selector */}
            <div>
              <label className="block text-xs font-bold text-foreground font-cairo mb-1.5">
                درجة الأهمية والاستعجال:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    id: "urgent",
                    label: "🚨 عاجل جداً",
                    bg: "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400",
                  },
                  {
                    id: "important",
                    label: "⚠️ تنبيه هام",
                    bg: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
                  },
                  {
                    id: "info",
                    label: "ℹ️ إشعار عام",
                    bg: "bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPriority(item.id as any)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer font-cairo ${
                      priority === item.id
                        ? `${item.bg} ring-2 ring-foreground/20 font-black`
                        : "bg-muted/20 border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scope / Wilayas */}
            <div>
              <label className="block text-xs font-bold text-foreground font-cairo mb-1">
                النطاق الجغرافي للبث:
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={targetScope}
                  onChange={(e) => setTargetScope(e.target.value as any)}
                  className="py-2 px-3 rounded-xl bg-muted/30 border border-border text-xs font-medium text-foreground focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">كامل التراب الوطني (كافة الـ 58 ولاية)</option>
                  <option value="CUSTOM">تحديد ولاية معينة</option>
                </select>

                {targetScope === "CUSTOM" && (
                  <select
                    value={selectedWilaya}
                    onChange={(e) => setSelectedWilaya(e.target.value)}
                    className="flex-1 py-2 px-3 rounded-xl bg-muted/30 border border-border text-xs font-medium text-foreground focus:outline-none focus:border-emerald-500"
                  >
                    {ALGERIAN_WILAYAS.map((w) => (
                      <option key={w.code} value={w.nameAr}>
                        {w.code.toString().padStart(2, "0")} - {w.nameAr}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-foreground font-cairo mb-1">
                عنوان التنبيه:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="مثال: تحديث استمارة..."
                className="w-full py-2 px-3 rounded-xl bg-muted/30 border border-border text-xs font-bold text-foreground focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Content Message */}
            <div>
              <label className="block text-xs font-bold text-foreground font-cairo mb-1">
                نص الرسالة والتوجيهات:
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="أدخل نص التنبيه الموجه لأصحاب الأكشاك..."
                className="w-full py-2 px-3 rounded-xl bg-muted/30 border border-border text-xs font-medium text-foreground focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Visual Preview Box */}
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground font-cairo block">
                معاينة حية لشكل الشريط كما سيظهر في شاشات الكاونتر:
              </span>
              <div
                className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  priority === "urgent"
                    ? "bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30"
                    : priority === "important"
                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                    : "bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30"
                }`}
              >
                <BellRing size={16} className="shrink-0 animate-bounce" />
                <div className="truncate font-cairo">
                  <strong className="ml-1.5">[{title}]:</strong>
                  <span className="font-normal">{message}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-3">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-all cursor-pointer font-cairo shadow-md active:scale-95"
              >
                <Send size={14} />
                <span>إرسال البث الآن فورياً</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-foreground transition-all cursor-pointer font-cairo"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
