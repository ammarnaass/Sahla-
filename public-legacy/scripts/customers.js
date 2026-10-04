// Sahla Customer Directory & Credit Ledger Engine (دفتر الزبائن وسجل الديون والكريدي)

class CustomersManager {
  constructor() {
    this.STORAGE_KEY = 'sahla_customers_data';
    this.init();
  }

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.customers = JSON.parse(saved);
      } catch (e) {
        this.resetDefaults();
      }
    } else {
      this.resetDefaults();
    }
  }

  resetDefaults() {
    this.customers = [
      {
        id: 'CUST-001',
        name: 'مؤسسة السلام للأشغال العامة (SARL)',
        phone: '0550 44 33 22',
        address: 'حي البدر، بئر مراد رايس، الجزائر',
        nif: '001916012345678',
        totalDebts: 6500, // دج مستحقات
        totalPaid: 4000,
        notes: 'طباعة مناقصات ومخططات A3 أسبوعياً',
        history: [
          { date: '2026-09-20', type: 'CHARGE', amount: 4500, desc: 'طباعة وتجليد ملف مناقصة 3 نسخ' },
          { date: '2026-09-22', type: 'PAYMENT', amount: 4000, desc: 'دفعة نقدية' },
          { date: '2026-09-27', type: 'CHARGE', amount: 6000, desc: 'طباعة فواتير وتصاريح رسمية' }
        ]
      },
      {
        id: 'CUST-002',
        name: 'الأستاذ عبد الرحمن بوعزيز (محامي)',
        phone: '0661 99 88 77',
        address: 'شارع طرابلس، حسين داي، الجزائر',
        nif: '',
        totalDebts: 1800,
        totalPaid: 1800,
        notes: 'نسخ مذكرات قضائية وعرائض',
        history: [
          { date: '2026-09-15', type: 'CHARGE', amount: 1800, desc: 'نسخ وطباعة 6 عرائض قضائية' },
          { date: '2026-09-16', type: 'PAYMENT', amount: 1800, desc: 'تسوية الحساب بالكامل' }
        ]
      },
      {
        id: 'CUST-003',
        name: 'المدرسة القرآنية الفضيلة',
        phone: '0770 11 22 33',
        address: 'القبة، الجزائر',
        nif: '',
        totalDebts: 3200,
        totalPaid: 1000,
        notes: 'طباعة مقررات وشهادات تكريم للتلاميذ',
        history: [
          { date: '2026-09-25', type: 'CHARGE', amount: 3200, desc: 'طباعة 80 شهادة تقدير ملونة على ورق مقوى' },
          { date: '2026-09-26', type: 'PAYMENT', amount: 1000, desc: 'عربون مسبق' }
        ]
      }
    ];
    this.save();
  }

  save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.customers));
    window.dispatchEvent(new CustomEvent('sahla:customers-updated', { detail: this.customers }));
  }

  getAll() {
    return this.customers;
  }

  addCustomer(name, phone, address, nif, initialDebt = 0, notes = '') {
    const newCust = {
      id: 'CUST-' + Date.now().toString().slice(-5),
      name,
      phone,
      address,
      nif,
      totalDebts: parseFloat(initialDebt) || 0,
      totalPaid: 0,
      notes,
      history: initialDebt > 0 ? [
        { date: new Date().toISOString().split('T')[0], type: 'CHARGE', amount: parseFloat(initialDebt), desc: 'رصيد افتتاحي / معاملات سابقة' }
      ] : []
    };

    this.customers.unshift(newCust);
    this.save();
    return newCust;
  }

  addTransaction(customerId, type, amount, desc) {
    const cust = this.customers.find(c => c.id === customerId);
    if (!cust) return null;

    const val = parseFloat(amount);
    if (type === 'CHARGE') {
      cust.totalDebts += val;
    } else if (type === 'PAYMENT') {
      cust.totalPaid += val;
    }

    cust.history.unshift({
      date: new Date().toISOString().split('T')[0],
      type,
      amount: val,
      desc
    });

    this.save();
    return cust;
  }

  getTotals() {
    const totalDebts = this.customers.reduce((sum, c) => sum + (c.totalDebts - c.totalPaid), 0);
    return {
      activeCount: this.customers.length,
      totalOutstandingDZD: Math.max(0, totalDebts)
    };
  }
}

const sahlaCustomers = new CustomersManager();
