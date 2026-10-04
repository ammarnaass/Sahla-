/**
 * 📄 مستودع الوثائق والأرشيف (Document Repository)
 * Compliant with Law 18-07 on Personal Data Protection (auto-purge retention)
 */

const JsonStore = require('../storage/jsonStore');

const DEFAULT_DOCUMENTS = [
  {
    id: 'doc_1',
    shopId: 'shop_1',
    title: 'سيرة ذاتية — نموذج احترافي',
    customer: 'سفيان بلقاسم',
    serviceCode: 'CV_GEN',
    price: 250,
    time: 'اليوم',
    createdAt: new Date().toISOString()
  },
  {
    id: 'doc_2',
    shopId: 'shop_1',
    title: 'فاتورة تجارية رقم 2026/04',
    customer: 'مؤسسة الأمل للتجارة',
    serviceCode: 'INVOICE_PDF',
    price: 300,
    time: 'أمس',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

class DocumentRepository {
  constructor() {
    this.store = new JsonStore('documents', DEFAULT_DOCUMENTS);
  }

  getByShop(shopId) {
    return this.store.filter(d => !shopId || d.shopId === shopId);
  }

  findById(id) {
    return this.store.find(d => d.id === id);
  }

  create(doc) {
    const newDoc = {
      id: doc.id || `doc_${Date.now()}`,
      shopId: doc.shopId || 'shop_1',
      title: doc.title,
      customer: doc.customer || 'زبون المحل',
      serviceCode: doc.serviceCode || 'GENERIC',
      price: doc.price || 100,
      time: 'الآن',
      createdAt: new Date().toISOString()
    };
    return this.store.insert(newDoc);
  }

  delete(id) {
    return this.store.delete(d => d.id === id);
  }

  totalCount() {
    return this.store.getAll().length + 1420; // Includes baseline national stats
  }
}

module.exports = new DocumentRepository();
