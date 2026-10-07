"use client";

import React, { useState } from "react";
import { Receipt, Search, Eye, Plus, CheckCircle2, Clock, Filter } from "lucide-react";
import { Button as MuiButton } from "@mui/material";
import type { InvoiceRecord } from "@/server/repositories/invoiceRepository";

interface AdminInvoicesTabProps {
  invoices?: InvoiceRecord[];
  onOpenCreateModal: () => void;
  onSelectInvoice: (inv: InvoiceRecord) => void;
  onToggleStatus: (invoiceId: string, currentStatus: string) => void;
}

export function AdminInvoicesTab({
  invoices = [],
  onOpenCreateModal,
  onSelectInvoice,
  onToggleStatus,
}: AdminInvoicesTabProps) {
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInvoices = invoices.filter((inv) => {
    const matchesFilter = filterStatus === "ALL" || inv.status === filterStatus;
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.wilaya.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPaidDZD = invoices
    .filter((i) => i.status === "PAID")
    .reduce((sum, i) => sum + (i.totalAmountDZD || 0), 0);

  const totalPendingDZD = invoices
    .filter((i) => i.status === "PENDING")
    .reduce((sum, i) => sum + (i.totalAmountDZD || 0), 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
          <span className="text-xs font-bold text-muted-foreground block font-cairo">
            إجمالي الفواتير المسددة
          </span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">
            {totalPaidDZD.toLocaleString()} دج
          </span>
          <span className="text-[11px] text-muted-foreground font-medium mt-1 block">
            {invoices.filter((i) => i.status === "PAID").length} فاتورة مسددة
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
          <span className="text-xs font-bold text-muted-foreground block font-cairo">
            الفواتير قيد التحصيل والانتظار
          </span>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1 block">
            {totalPendingDZD.toLocaleString()} دج
          </span>
          <span className="text-[11px] text-muted-foreground font-medium mt-1 block">
            {invoices.filter((i) => i.status === "PENDING").length} في انتظار الدفع
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-muted-foreground block font-cairo">
              نظام الفوترة الوطني المعتمد
            </span>
            <span className="text-sm font-bold text-foreground mt-1 block font-cairo">
              إصدار فواتير رسمية متوافقة مع المحاسبة
            </span>
          </div>
          <MuiButton
            variant="contained"
            size="small"
            disableElevation
            onClick={onOpenCreateModal}
            startIcon={<Plus size={16} />}
            sx={{
              mt: 2,
              borderRadius: "10px",
              fontWeight: 700,
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            إصدار فاتورة جديدة +
          </MuiButton>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="ابحث برقم الفاتورة، المحل، أو الولاية..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-3 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-muted/40 border border-border focus:outline-none focus:border-emerald-500 text-foreground"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/50 border border-border text-xs font-bold w-full sm:w-auto">
          <button
            onClick={() => setFilterStatus("ALL")}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterStatus === "ALL"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            الكل ({invoices.length})
          </button>
          <button
            onClick={() => setFilterStatus("PAID")}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterStatus === "PAID"
                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            مسددة ✓
          </button>
          <button
            onClick={() => setFilterStatus("PENDING")}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterStatus === "PENDING"
                ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            قيد الانتظار ⏳
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground font-bold">
                <th className="py-3.5 px-4">رقم الفاتورة</th>
                <th className="py-3.5 px-4">المحل والزبون</th>
                <th className="py-3.5 px-4">الولاية</th>
                <th className="py-3.5 px-4">المبلغ الصافي</th>
                <th className="py-3.5 px-4">طريقة الدفع</th>
                <th className="py-3.5 px-4">الحالة</th>
                <th className="py-3.5 px-4 text-left">معاينة وإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-foreground block">{inv.shopName}</span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {new Date(inv.createdAt).toLocaleDateString("ar-DZ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground font-medium">
                      {inv.wilaya}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-black text-sm text-foreground">
                      {(inv.totalAmountDZD ?? 0).toLocaleString()} دج
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[11px] text-muted-foreground px-2 py-0.5 rounded-md bg-muted border border-border">
                        {inv.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onToggleStatus(inv.id, inv.status)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition ${
                          inv.status === "PAID"
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                            : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/25"
                        }`}
                      >
                        {inv.status === "PAID" ? (
                          <>
                            <CheckCircle2 size={12} /> مسددة
                          </>
                        ) : (
                          <>
                            <Clock size={12} /> قيد الانتظار
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-left">
                      <button
                        onClick={() => onSelectInvoice(inv)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-foreground border border-border transition"
                      >
                        <Eye size={14} /> معاينة وطباعة
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-muted-foreground font-cairo">
                    لا توجد فواتير مطابقة لمعايير الفلترة
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
