"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  DocCvIcon,
  SchoolCapIcon,
  InvoiceBillIcon,
  CameraPhotoIcon,
  WirelessPrintIcon,
  ArrowLeftIcon,
} from "@/components/ui/Icons";

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

  const getDocTypeIcon = (type: string) => {
    switch (type) {
      case "SCHOOL_RESEARCH":
      case "EXAM":
        return <SchoolCapIcon size={20} className="text-emerald-400" />;
      case "CV":
        return <DocCvIcon size={20} className="text-emerald-400" />;
      case "ID_PHOTO":
        return <CameraPhotoIcon size={20} className="text-emerald-400" />;
      case "INVOICE":
        return <InvoiceBillIcon size={20} className="text-emerald-400" />;
      default:
        return <DocCvIcon size={20} className="text-emerald-400" />;
    }
  };

  // New account without documents: Show "أنشئ أول وثيقة" card per PRD Section 7.3
  if (documents.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
          <DocCvIcon size={32} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">لم تقم بإنشاء أي وثيقة بعد</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
            ابدأ الآن بإنشاء أول سيرة ذاتية أو بحث مدرسي أو فاتورة لزبائنك برصيدك التجريبي المجاني.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={onCreateNewDoc}
          className="font-bold shadow-md shadow-emerald-900/20 cursor-pointer"
        >
          <span>أنشئ أول وثيقة لزبونك الآن</span>
          <ArrowLeftIcon className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 text-right">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <DocCvIcon size={16} className="text-emerald-600 dark:text-emerald-400" />
            <span>آخر الوثائق المنجزة في محلك</span>
          </h3>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">آخر 5 وثائق</span>
        </div>

        <div className="space-y-2.5">
          {documents.slice(0, 5).map((doc) => (
            <div
              key={doc.id}
              className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-200">
                  {getDocTypeIcon(doc.type)}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{doc.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                    {doc.customerName && <span>الزبون: {doc.customerName}</span>}
                    <span>•</span>
                    <span className="font-mono">{new Date(doc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Reprint & Edit */}
              <div className="flex items-center gap-2 shrink-0 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800/60">
                <button
                  onClick={() => setActiveActionDoc({ doc, action: "reprint" })}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <WirelessPrintIcon className="w-3.5 h-3.5" />
                  <span>إعادة طباعة</span>
                </button>
                <button
                  onClick={() => setActiveActionDoc({ doc, action: "edit" })}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
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
