"use client";

import React from "react";
import { X, Printer, CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { Button as MuiButton } from "@mui/material";
import type { InvoiceRecord } from "@/server/repositories/invoiceRepository";
import { siteConfig } from "@/config/site";

interface InvoicePrintModalProps {
  invoice: InvoiceRecord | null;
  onClose: () => void;
  onToggleStatus: (invoiceId: string, currentStatus: string) => void;
}

export function InvoicePrintModal({ invoice, onClose, onToggleStatus }: InvoicePrintModalProps) {
  if (!invoice) return null;

  const isPaid = invoice.status === "PAID";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-card border border-border w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground text-sm font-cairo">
              معاينة الفاتورة الرسمية: {invoice.invoiceNumber}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isPaid
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                  : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
              }`}
            >
              {isPaid ? "مسددة (PAID)" : "قيد الانتظار (PENDING)"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleStatus(invoice.id, invoice.status)}
              className={`px-3 py-1 rounded-xl text-xs font-bold border transition ${
                isPaid
                  ? "text-amber-600 border-amber-500/30 hover:bg-amber-500/10"
                  : "text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
              }`}
            >
              {isPaid ? "تعليم كـ غير مسددة" : "تعليم كـ مسددة ✓"}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Body */}
        <div id="printable-invoice" className="p-8 overflow-y-auto space-y-6 text-right font-sans">
          {/* Invoice Header */}
          <div className="flex items-start justify-between border-b border-border pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-sm">
                  سـ
                </div>
                <span className="font-black text-lg text-foreground font-cairo">{siteConfig.name}</span>
              </div>
              <span className="text-xs text-muted-foreground block font-cairo">
                المنصة الوطنية لرقمنة الأكشاك ومراكز الطباعة
              </span>
              <span className="text-xs text-muted-foreground font-mono block">
                الهاتف: {siteConfig.supportPhone} · البريد: {siteConfig.supportEmail}
              </span>
            </div>

            <div className="text-left font-mono">
              <span className="text-xs text-muted-foreground block">رقم الفاتورة / Facture N°:</span>
              <span className="text-xl font-black text-foreground block">{invoice.invoiceNumber}</span>
              <span className="text-xs text-muted-foreground block mt-1">
                التاريخ: {new Date(invoice.createdAt).toLocaleDateString("ar-DZ")}
              </span>
            </div>
          </div>

          {/* Shop & Customer Details */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/20 border border-border text-xs">
            <div>
              <span className="text-muted-foreground font-bold block mb-1">صادرة إلى (الزبون / المحل):</span>
              <span className="font-bold text-foreground text-sm block">{invoice.shopName}</span>
              <span className="text-muted-foreground block">المسير: {invoice.ownerName || "—"}</span>
              <span className="text-muted-foreground block">الولاية: {invoice.wilaya}</span>
            </div>
            <div className="text-left">
              <span className="text-muted-foreground font-bold block mb-1">طريقة الدفع / Règlement:</span>
              <span className="font-mono font-bold text-foreground block">{invoice.paymentMethod}</span>
              <span className="text-muted-foreground block mt-1">
                الحالة: {isPaid ? "مسددة بالكامل" : "في انتظار التسديد"}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full text-xs text-right">
              <thead>
                <tr className="bg-muted/40 border-b border-border text-muted-foreground font-bold">
                  <th className="py-2.5 px-4">الوصف والخدمة</th>
                  <th className="py-2.5 px-4 text-center">الكمية</th>
                  <th className="py-2.5 px-4 text-center">سعر الوحدة</th>
                  <th className="py-2.5 px-4 text-left">المجموع (دج)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {(invoice.items || []).map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-4 font-bold text-foreground">{item.description}</td>
                    <td className="py-3 px-4 text-center font-mono">{item.quantity}</td>
                    <td className="py-3 px-4 text-center font-mono">{item.unitPriceDZD.toLocaleString()}</td>
                    <td className="py-3 px-4 text-left font-mono font-bold">{item.totalDZD.toLocaleString()} دج</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Stamp */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            {/* Fiscal / Legal Stamp Box */}
            <div className="w-48 h-24 rounded-xl border-2 border-dashed border-emerald-500/40 p-2 text-center flex flex-col items-center justify-center text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
              <ShieldCheck size={20} className="mb-0.5" />
              <span>فاتورة معتمدة إلكترونياً</span>
              <span className="font-mono text-[9px] text-muted-foreground">SAHLA SaaS DZ-2026</span>
            </div>

            {/* Total Amount */}
            <div className="text-left font-mono">
              <span className="text-xs text-muted-foreground block">المجموع الصافي / Total Net:</span>
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {invoice.totalAmountDZD.toLocaleString()} دج
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-cairo">
            موافقة للقانون الجزائري ومعتمدة للأكشاك والمكتبات
          </span>
          <div className="flex items-center gap-2">
            <MuiButton
              variant="outlined"
              size="small"
              onClick={onClose}
              sx={{ borderRadius: "10px", fontWeight: 700 }}
            >
              إغلاق
            </MuiButton>
            <MuiButton
              variant="contained"
              size="small"
              disableElevation
              onClick={handlePrint}
              startIcon={<Printer size={16} />}
              sx={{ borderRadius: "10px", fontWeight: 700, bgcolor: "#10b981", "&:hover": { bgcolor: "#059669" } }}
            >
              طباعة الفاتورة 🖨️
            </MuiButton>
          </div>
        </div>
      </div>
    </div>
  );
}
