/**
 * 🧾 مستودع الفواتير الرسمية للشركات والمحلات (Invoice Repository)
 * Algerian B2B Invoicing with Tax compliance (TVA, Timbre Fiscal, and A4 print specs)
 */

import { JsonStore } from "../storage/jsonStore";
import { DEFAULT_SHOP_ID } from "@/server/config/constants";

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPriceDZD: number;
  totalDZD: number;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string; // e.g. "FAC-2026-0001"
  shopId: string;
  shopName: string;
  ownerName: string;
  wilaya: string;
  wilayaCode: number;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotalDZD: number;
  taxDZD: number;
  stampDutyDZD: number;
  totalDZD: number;
  status: "PAID" | "PENDING" | "CANCELLED";
  paymentMethod: "EDAHABIA_CIB" | "BARIDIMOB" | "CASH_WHOLESALE" | "BANK_TRANSFER";
  notes?: string;
  createdAt: string;
}

const DEFAULT_INVOICES: InvoiceRecord[] = [];

class InvoiceRepository {
  private store: JsonStore<InvoiceRecord>;

  constructor() {
    this.store = new JsonStore<InvoiceRecord>("invoices", DEFAULT_INVOICES);
  }

  getAll(): InvoiceRecord[] {
    return this.store.getAll().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  findById(id: string): InvoiceRecord | null {
    return this.store.find((inv) => inv.id === id || inv.invoiceNumber === id);
  }

  findByShop(shopId: string): InvoiceRecord[] {
    return this.store.filter((inv) => inv.shopId === shopId);
  }

  create(data: Partial<InvoiceRecord>): InvoiceRecord {
    const all = this.store.getAll();
    const nextSeq = all.length + 1;
    const invNumber = data.invoiceNumber || `FAC-2026-${String(nextSeq).padStart(4, "0")}`;

    const subtotal = data.items
      ? data.items.reduce((acc, it) => acc + (it.totalDZD || it.quantity * it.unitPriceDZD), 0)
      : Number(data.subtotalDZD) || 0;

    const tax = data.taxDZD !== undefined ? Number(data.taxDZD) : 0;
    const stamp = Math.min(2500, Math.max(5, Math.round(subtotal * 0.01))); // 1% timbre fiscal
    const total = subtotal + tax + stamp;

    const newInvoice: InvoiceRecord = {
      id: data.id || `inv_${Date.now()}`,
      invoiceNumber: invNumber,
      shopId: data.shopId || DEFAULT_SHOP_ID,
      shopName: data.shopName || "مكتبة دانتي الرقمية",
      ownerName: data.ownerName || "عمار",
      wilaya: data.wilaya || "16 - الجزائر",
      wilayaCode: data.wilayaCode || 16,
      date: data.date || new Date().toISOString().split("T")[0],
      dueDate: data.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
      items: data.items || [
        {
          description: "خدمات اشتراك سحابي سهلة SaaS",
          quantity: 1,
          unitPriceDZD: subtotal,
          totalDZD: subtotal,
        },
      ],
      subtotalDZD: subtotal,
      taxDZD: tax,
      stampDutyDZD: stamp,
      totalDZD: total,
      status: data.status || "PENDING",
      paymentMethod: data.paymentMethod || "EDAHABIA_CIB",
      notes: data.notes || "فاتورة رسمية صادرة عن منظومة سهلة السحابية.",
      createdAt: data.createdAt || new Date().toISOString(),
    };

    return this.store.insert(newInvoice);
  }

  updateStatus(id: string, status: "PAID" | "PENDING" | "CANCELLED"): InvoiceRecord | null {
    return this.store.update((inv) => inv.id === id || inv.invoiceNumber === id, { status });
  }

  getMetrics() {
    const all = this.store.getAll();
    const paid = all.filter((i) => i.status === "PAID");
    const pending = all.filter((i) => i.status === "PENDING");

    return {
      totalInvoicedDZD: all.reduce((sum, i) => sum + i.totalDZD, 0),
      paidDZD: paid.reduce((sum, i) => sum + i.totalDZD, 0),
      pendingDZD: pending.reduce((sum, i) => sum + i.totalDZD, 0),
      invoicesCount: all.length,
      paidCount: paid.length,
      pendingCount: pending.length,
    };
  }
}

export const invoiceRepository = new InvoiceRepository();
