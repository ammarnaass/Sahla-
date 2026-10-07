"use client";

import React from "react";
import type { DocumentRecord } from "@/hooks/dashboard/useDocumentsArchive";
import {
  DocCvIcon,
  SchoolCapIcon,
  InvoiceBillIcon,
  CameraPhotoIcon,
  WirelessPrintIcon,
  ShieldCheckIcon,
} from "@/components/ui/Icons";

interface DocumentsTableProps {
  filteredDocs: DocumentRecord[];
  onPrint: (doc: DocumentRecord) => void;
  onDownload: (doc: DocumentRecord) => void;
}

export function DocumentsTable({
  filteredDocs,
  onPrint,
  onDownload,
}: DocumentsTableProps) {
  const getDocTypeIcon = (type: string) => {
    switch (type) {
      case "SCHOOL_RESEARCH":
      case "EXAM":
        return <SchoolCapIcon size={18} className="text-emerald-600 dark:text-emerald-400" />;
      case "CV":
        return <DocCvIcon size={18} className="text-emerald-600 dark:text-emerald-400" />;
      case "ID_PHOTO":
        return <CameraPhotoIcon size={18} className="text-emerald-600 dark:text-emerald-400" />;
      case "INVOICE":
        return <InvoiceBillIcon size={18} className="text-emerald-600 dark:text-emerald-400" />;
      default:
        return <DocCvIcon size={18} className="text-emerald-600 dark:text-emerald-400" />;
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold bg-slate-50 dark:bg-slate-950/40">
              <th className="py-3.5 px-4">عنوان الوثيقة</th>
              <th className="py-3.5 px-4">الزبون</th>
              <th className="py-3.5 px-4">سعر البيع المقترح</th>
              <th className="py-3.5 px-4">التاريخ</th>
              <th className="py-3.5 px-4">الاحتفاظ (قانون 18-07)</th>
              <th className="py-3.5 px-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredDocs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  لم يتم العثور على وثائق مطابقة. ابدأ بإنجاز أول وثيقة لزبائنك!
                </td>
              </tr>
            ) : (
              filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      {getDocTypeIcon(doc.type)}
                    </div>
                    <span className="truncate max-w-xs">{doc.title}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">{doc.customerName}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {doc.salePrice} دج
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-[11px] font-mono">
                    {new Date(doc.createdAt).toLocaleDateString("ar-DZ")}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                      <ShieldCheckIcon className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span>حذف آلي بعد 48 ساعة</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onPrint(doc)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition-colors text-[11px] font-bold cursor-pointer"
                        title="طباعة فورية"
                      >
                        <WirelessPrintIcon className="w-3.5 h-3.5" />
                        <span>طباعة</span>
                      </button>
                      <button
                        onClick={() => onDownload(doc)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors text-[11px] font-bold cursor-pointer"
                        title="تنزيل PDF"
                      >
                        <span>تنزيل PDF</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
