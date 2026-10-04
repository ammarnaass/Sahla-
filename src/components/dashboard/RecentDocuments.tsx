"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export interface DocumentItem {
  id: string;
  title: string;
  type: string;
  customerName?: string;
  createdAt: string;
  salePrice?: number;
}

interface RecentDocumentsProps {
  documents: DocumentItem[];
  onCreateNewDoc: () => void;
}

export function RecentDocuments({ documents, onCreateNewDoc }: RecentDocumentsProps) {
  const [activeActionDoc, setActiveActionDoc] = useState<{
    doc: DocumentItem;
    action: "reprint" | "edit";
  } | null>(null);

  // New account without documents: Show "أنشئ أول وثيقة" card per PRD Section 7.3
  if (documents.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-3xl mx-auto border border-emerald-500/20">
          📄
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white">لم تقم بإنشاء أي وثيقة بعد</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            ابدأ الآن بإنشاء أول سيرة ذاتية أو فاتورة لزبائنك برصيدك التجريبي المجاني.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={onCreateNewDoc}
          className="font-bold shadow-md shadow-emerald-900/30"
        >
          <span>أنشئ أول وثيقة لزبونك الآن</span>
          <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 text-right">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>⏱️</span>
            <span>آخر الوثائق المنجزة في محلك</span>
          </h3>
          <span className="text-[11px] text-slate-400">آخر 5 وثائق</span>
        </div>

        <div className="space-y-2.5">
          {documents.slice(0, 5).map((doc) => (
            <div
              key={doc.id}
              className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2 rounded-xl bg-slate-800 shrink-0">
                  {doc.type === "CV" ? "📄" : doc.type === "INVOICE" ? "🧾" : "📋"}
                </span>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">{doc.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                    {doc.customerName && <span>الزبون: {doc.customerName}</span>}
                    <span>•</span>
                    <span className="font-mono">{new Date(doc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Reprint & Edit */}
              <div className="flex items-center gap-2 shrink-0 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                <button
                  onClick={() => setActiveActionDoc({ doc, action: "reprint" })}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>🖨️</span>
                  <span>إعادة طباعة</span>
                </button>
                <button
                  onClick={() => setActiveActionDoc({ doc, action: "edit" })}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>✏️</span>
                  <span>تعديل</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Simulation Modal */}
      {activeActionDoc && (
        <Modal
          isOpen={Boolean(activeActionDoc)}
          onClose={() => setActiveActionDoc(null)}
          title={
            activeActionDoc.action === "reprint"
              ? `إعادة طباعة: ${activeActionDoc.doc.title}`
              : `تعديل وثيقة: ${activeActionDoc.doc.title}`
          }
        >
          <div className="space-y-4 text-center py-2 text-right">
            <p className="text-xs text-slate-300">
              {activeActionDoc.action === "reprint"
                ? "جسر الطباعة اللاسلكي جاهز. سيتم إرسال الملف مباشرة إلى طابعة المحل أو تحميله بصيغة PDF."
                : "يمكنك تعديل بيانات الزبون وإعادة إصدار الوثيقة مجاناً خلال 72 ساعة."}
            </p>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => setActiveActionDoc(null)}
            >
              {activeActionDoc.action === "reprint" ? "بدء الطباعة الآن 🖨️" : "حفظ التعديلات"}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
