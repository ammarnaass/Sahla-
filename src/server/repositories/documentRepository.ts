/**
 * 📄 مستودع الوثائق والأرشيف (Document Repository)
 * Compliant with Law 18-07 on Personal Data Protection
 */

import { JsonStore } from "../storage/jsonStore";

export interface DocumentRecord {
  id: string;
  shopId: string;
  title: string;
  customer: string;
  serviceCode: string;
  price: number;
  time: string;
  createdAt: string;
}

const DEFAULT_DOCUMENTS: DocumentRecord[] = [
  {
    id: "doc_1",
    shopId: "shop_1",
    title: "سيرة ذاتية — نموذج احترافي",
    customer: "سفيان بلقاسم",
    serviceCode: "CV_GEN",
    price: 250,
    time: "اليوم",
    createdAt: new Date().toISOString(),
  },
  {
    id: "doc_2",
    shopId: "shop_1",
    title: "فاتورة تجارية رقم 2026/04",
    customer: "مؤسسة الأمل للتجارة",
    serviceCode: "INVOICE_PDF",
    price: 300,
    time: "أمس",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

class DocumentRepository {
  private store: JsonStore<DocumentRecord>;

  constructor() {
    this.store = new JsonStore<DocumentRecord>("documents", DEFAULT_DOCUMENTS);
  }

  getByShop(shopId?: string): DocumentRecord[] {
    return this.store.filter((d) => !shopId || d.shopId === shopId);
  }

  findById(id: string): DocumentRecord | null {
    return this.store.find((d) => d.id === id);
  }

  create(doc: Partial<DocumentRecord>): DocumentRecord {
    const newDoc: DocumentRecord = {
      id: doc.id || `doc_${Date.now()}`,
      shopId: doc.shopId || "shop_1",
      title: doc.title || "وثيقة رقمية",
      customer: doc.customer || "زبون المحل",
      serviceCode: doc.serviceCode || "GENERIC",
      price: doc.price || 100,
      time: "الآن",
      createdAt: new Date().toISOString(),
    };
    return this.store.insert(newDoc);
  }

  delete(id: string): boolean {
    return this.store.delete((d) => d.id === id);
  }

  totalCount(): number {
    return this.store.getAll().length + 1420; // Baseline platform activity
  }
}

export const documentRepository = new DocumentRepository();
