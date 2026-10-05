"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ShieldCheckIcon } from "@/components/ui/Icons";

interface ErrorReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  docId?: string;
  examId?: string;
}

export function ErrorReportModal({
  isOpen,
  onClose,
  documentTitle,
  docId,
  examId,
}: ErrorReportModalProps) {
  const [issueType, setIssueType] = useState<string>("SCIENTIFIC_ERROR");
  const [description, setDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/education/report-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docId,
          examId,
          issueType,
          description: description.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage("✓ " + (data.message || "تم إرسال البلاغ بنجاح"));
        setTimeout(() => {
          setDescription("");
          setStatusMessage(null);
          onClose();
        }, 1800);
      } else {
        setStatusMessage(data.error || "فشل إرسال البلاغ");
      }
    } catch {
      setStatusMessage("تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="الإبلاغ عن خطأ علمي أو لغوي">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-200">
        <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex items-start gap-2.5">
          <ShieldCheckIcon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-300">تدقيق جودة المحتوى التعليمي</p>
            <p className="text-slate-300 text-[11px] mt-0.5">
              وثيقة: <span className="text-white font-medium">{documentTitle}</span>
            </p>
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-300 mb-1.5">نوع الملاحظة أو الخطأ:</label>
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
          >
            <option value="SCIENTIFIC_ERROR">خطأ علمي أو رياضي في المحتوى</option>
            <option value="TYPO">خطأ لغوي أو إملائي</option>
            <option value="CURRICULUM_MISMATCH">عدم تطابق مع المنهاج الجزائري الرسمي</option>
            <option value="FORMATTING">مشكلة في التنسيق أو الجداول</option>
            <option value="OTHER">أخرى</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-300 mb-1.5">
            تفاصيل الخطأ أو الملاحظة:
          </label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="يرجى توضيح الخطأ الملاحظ ورقم الصفحة أو الفقرة المعنية لمراجعته من الأساتذة المختصين..."
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 resize-none"
          />
        </div>

        {statusMessage && (
          <div
            className={`p-2.5 rounded-lg text-center font-bold ${
              statusMessage.startsWith("✓")
                ? "bg-emerald-950/60 border border-emerald-500 text-emerald-300"
                : "bg-rose-950/60 border border-rose-500 text-rose-300"
            }`}
          >
            {statusMessage}
          </div>
        )}

        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            إلغاء
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || !description.trim()}
            className="bg-amber-600 hover:bg-amber-500 text-white"
          >
            {isSubmitting ? "جاري الإرسال..." : "إرسال البلاغ لفريق المراجعة"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
