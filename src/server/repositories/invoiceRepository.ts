/**
 * 🧾 مستودع الفواتير الرسمية للشركات والمحلات (Invoice Repository)
 * Algerian B2B Invoicing with Tax compliance (TVA, Timbre Fiscal, and A4 print specs)
 */

import { JsonStore } from "../storage/jsonStore";

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

const DEFAULT_INVOICES: InvoiceRecord[] = [
  {
    id: "inv_1",
    invoiceNumber: "FAC-2026-0001",
    shopId: "shop_1",
    shopName: "مكتبة النجاح الرقمية",
    ownerName: "أحمد بن علي",
    wilaya: "16 - الجزائر العاصمة",
    wilayaCode: 16,
    date: "2026-03-01",
    dueDate: "2026-03-15",
    items: [
      {
        description: "اشتراك سحابي باقة المكتبة الاحترافية (PRO KIOSK) - 1 شهر",
        quantity: 1,
        unitPriceDZD: 2500,
        totalDZD: 2500,
      },
      {
        description: "حزمة رصيد إضافية - 500 نقطة طباعة حرارية",
        quantity: 1,
        unitPriceDZD: 4500,
        totalDZD: 4500,
      },
    ],
    subtotalDZD: 7000,
    taxDZD: 0,
    stampDutyDZD: 70,
    totalDZD: 7070,
    status: "PAID",
    paymentMethod: "EDAHABIA_CIB",
    notes: "تم الدفع بنجاح عبر البطاقة الذهبية / بريدي موب.",
    createdAt: "2026-03-01T10:00:00.000Z",
  },
  {
    id: "inv_2",
    invoiceNumber: "FAC-2026-0002",
    shopId: "shop_1",
    shopName: "مكتبة النجاح الرقمية",
    ownerName: "أحمد بن علي",
    wilaya: "16 - الجزائر العاصمة",
    wilayaCode: 16,
    date: "2026-04-01",
    dueDate: "2026-04-10",
    items: [
      {
        description: "تجديد اشتراك باقة المكتبة الاحترافية (PRO KIOSK) - 1 شهر",
        quantity: 1,
        unitPriceDZD: 2500,
        totalDZD: 2500,
      },
    ],
    subtotalDZD: 2500,
    taxDZD: 0,
    stampDutyDZD: 25,
    totalDZD: 2525,
    status: "PAID",
    paymentMethod: "BARIDIMOB",
    notes: "حوالة بريدي موب مؤكدة.",
    createdAt: "2026-04-01T09:30:00.000Z",
  },
  {
    id: "inv_3",
    invoiceNumber: "FAC-2026-0003",
    shopId: "shop_default",
    shopName: "مكتبة المستقبل بوهران",
    ownerName: "ياسين قدور",
    wilaya: "31 - وهران",
    wilayaCode: 31,
    date: "2026-10-05",
    dueDate: "2026-10-20",
    items: [
      {
        description: "طلب توريد بطاقات خدش الرصيد بالجملة (100 بطاقة فئة 50 نقطة)",
        quantity: 1,
        unitPriceDZD: 40000,
        totalDZD: 40000,
      },
    ],
    subtotalDZD: 40000,
    taxDZD: 0,
    stampDutyDZD: 400,
    totalDZD: 40400,
    status: "PENDING",
    paymentMethod: "CASH_WHOLESALE",
    notes: "فاتورة طلبية بطاقات شحن معتمدة قيد التسليم للموزع المعتمد بوهران.",
    createdAt: "2026-10-05T12:00:00.000Z",
  },
];

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
      shopId: data.shopId || "shop_1",
      shopName: data.shopName || "محل تجاري",
      ownerName: data.ownerName || "مسير المحل",
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
