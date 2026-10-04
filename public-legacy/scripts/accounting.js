// Sahla Advanced Accounting & Profit Ledger Manager (النظام المحاسبي وكشف الأرباح وهامش الربحية)

class AccountingManager {
  constructor() {
    this.storageKey = 'sahla_accounting_data';
    this.operations = this.loadOperations();
  }

  loadOperations() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load accounting data from localStorage');
    }
    const def = (typeof DEFAULT_ACCOUNTING_SAMPLE !== 'undefined') ? DEFAULT_ACCOUNTING_SAMPLE : (window.DEFAULT_ACCOUNTING_SAMPLE || []);
    return JSON.parse(JSON.stringify(def));
  }

  saveOperations() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.operations));
      window.dispatchEvent(new CustomEvent('sahla:accounting-updated', { detail: this.operations }));
    } catch (e) {
      console.error('Failed to save accounting data', e);
    }
  }

  getOperations(filterPeriod = 'ALL') {
    if (filterPeriod === 'ALL') return this.operations;
    const today = new Date().toISOString().split('T')[0];
    if (filterPeriod === 'TODAY') {
      return this.operations.filter(op => op.date.startsWith(today));
    }
    if (filterPeriod === 'WEEK') {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      return this.operations.filter(op => op.date >= oneWeekAgo);
    }
    if (filterPeriod === 'MONTH') {
      const currentMonth = today.substring(0, 7);
      return this.operations.filter(op => op.date.startsWith(currentMonth));
    }
    return this.operations;
  }

  addOperation({ serviceCode, serviceName, customerName, terminal, pointsCost, priceSoldToCustomer, paperAndInkEst = 20, category = 'DOCUMENTS' }) {
    const pointsDZDValue = pointsCost * 10; // 10 DZD per point
    const netProfit = priceSoldToCustomer - pointsDZDValue - paperAndInkEst;

    const op = {
      id: 'op_' + Date.now().toString(36),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      serviceCode: serviceCode || 'GENERAL',
      serviceName: serviceName || 'خدمة مكتبية',
      customerName: customerName || 'زبون عام',
      terminal: terminal || 'POS 1 (الكاونتر الرئيسي)',
      pointsCost: pointsCost || 0,
      pointsDZDValue,
      paperAndInkEst,
      priceSoldToCustomer: Number(priceSoldToCustomer) || 0,
      netProfit,
      paymentMethod: 'CASH',
      category
    };

    this.operations.unshift(op);
    this.saveOperations();
    return op;
  }

  calculateMetrics(filterPeriod = 'ALL') {
    const list = this.getOperations(filterPeriod);
    const totalRevenue = list.reduce((sum, item) => sum + (Number(item.priceSoldToCustomer) || 0), 0);
    const totalPointsCostDZD = list.reduce((sum, item) => sum + (Number(item.pointsDZDValue) || 0), 0);
    const totalPaperInk = list.reduce((sum, item) => sum + (Number(item.paperAndInkEst) || 0), 0);
    const totalNetProfit = list.reduce((sum, item) => sum + (Number(item.netProfit) || 0), 0);
    const marginPercent = totalRevenue > 0 ? ((totalNetProfit / totalRevenue) * 100).toFixed(1) : 0;

    // Services breakdown
    const servicesCount = {};
    list.forEach(item => {
      const key = item.serviceCode;
      if (!servicesCount[key]) {
        servicesCount[key] = { name: item.serviceName, count: 0, revenue: 0, profit: 0 };
      }
      servicesCount[key].count += 1;
      servicesCount[key].revenue += Number(item.priceSoldToCustomer) || 0;
      servicesCount[key].profit += Number(item.netProfit) || 0;
    });

    return {
      count: list.length,
      totalRevenue,
      totalPointsCostDZD,
      totalPaperInk,
      totalNetProfit,
      marginPercent,
      servicesCount
    };
  }

  // تصدير جدول العمليات إلى ملف Excel / CSV مع ترميز UTF-8 مع BOM لدعم اللغة العربية
  exportToCSV(filterPeriod = 'ALL') {
    const list = this.getOperations(filterPeriod);
    const headers = [
      'المعرف',
      'التاريخ والوقت',
      'الخدمة المنجزة',
      'اسم الزبون',
      'نقطة البيع (الكاونتر)',
      'النقاط المستهلكة',
      'تكلفة النقاط (دج)',
      'تكلفة الورق والحبر التقديرية (دج)',
      'سعر البيع للزبون (دج)',
      'صافي ربح المحل (دج)',
      'طريقة الدفع'
    ];

    const rows = list.map(op => [
      op.id,
      op.date,
      `"${op.serviceName.replace(/"/g, '""')}"`,
      `"${(op.customerName || 'زبون عام').replace(/"/g, '""')}"`,
      `"${op.terminal.replace(/"/g, '""')}"`,
      op.pointsCost,
      op.pointsDZDValue,
      op.paperAndInkEst,
      op.priceSoldToCustomer,
      op.netProfit,
      op.paymentMethod === 'CASH' ? 'نقداً (Cash)' : 'إلكتروني'
    ]);

    const csvContent = '\uFEFF' + [
      headers.join(';'),
      ...rows.map(r => r.join(';'))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const today = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `sahla-rapport-comptable-${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // توليد كشف الحساب المحاسبي الرسمي A4 القابل للطباعة
  generatePrintableStatementHTML(shopData = {}, filterPeriod = 'MONTH') {
    const metrics = this.calculateMetrics(filterPeriod);
    const operations = this.getOperations(filterPeriod);
    const today = new Date().toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' });
    const periodLabel = filterPeriod === 'TODAY' ? 'اليومي (اليوم)' : (filterPeriod === 'WEEK' ? 'الأسبوعي (آخر 7 أيام)' : (filterPeriod === 'MONTH' ? 'الشهري (الشهر الحالي)' : 'الإجمالي الشامل'));

    const shopName = shopData.shopName || 'كيوسك وخدمات النور الرقمية';
    const wilayaCode = shopData.wilayaCode || 16;
    const w = (typeof ALGERIAN_WILAYAS !== 'undefined') ? ALGERIAN_WILAYAS.find(item => item.code === wilayaCode) : null;
    const wilayaName = w ? w.nameAr : 'الجزائر';

    const tableRows = operations.map((op, idx) => `
      <tr>
        <td style="text-align:center; font-weight:700;">${idx + 1}</td>
        <td style="font-family:monospace; font-size:11px;">${op.date}</td>
        <td><strong>${op.serviceName}</strong><br><small style="color:#64748b;">${op.terminal}</small></td>
        <td>${op.customerName || 'زبون عام'}</td>
        <td style="text-align:center; font-weight:700;">${op.pointsCost} <span style="font-size:10px; color:#64748b;">(${op.pointsDZDValue} دج)</span></td>
        <td style="text-align:center;">${op.paperAndInkEst} دج</td>
        <td style="text-align:center; font-weight:800; color:#0f172a;">${Number(op.priceSoldToCustomer).toLocaleString()} دج</td>
        <td style="text-align:center; font-weight:900; color:#059669;">+${Number(op.netProfit).toLocaleString()} دج</td>
      </tr>
    `).join('');

    return `
      <div class="accounting-a4-sheet">
        <!-- ترويسة الكشف الرسمي -->
        <div class="acc-official-header">
          <div class="acc-header-top">
            <span>الجمهورية الجزائرية الديمقراطية الشعبية</span>
            <span>RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE</span>
          </div>
          <div class="acc-header-main">
            <div class="acc-shop-info">
              <h3>${shopName}</h3>
              <p>مكتب خدمات عمومية، إنترنت ونسخ وثائق</p>
              <p>ولاية: ${wilayaName} (${wilayaCode}) · هاتف: ${shopData.phone || '0550 00 00 00'}</p>
            </div>
            <div class="acc-doc-badge">
              <h2>كشف الحساب المحاسبي الدوري</h2>
              <p>Bilan Financier & Marge Bénéficiaire</p>
              <div class="acc-period-tag">${periodLabel} · بتاريخ ${today}</div>
            </div>
          </div>
        </div>

        <!-- ملخص المؤشرات المالية الرئيسية -->
        <div class="acc-metrics-summary-grid">
          <div class="acc-metric-box">
            <span class="acc-metric-label">إجمالي المقبوضات نقدًا (Chiffre d’Affaires)</span>
            <span class="acc-metric-value value-revenue">${metrics.totalRevenue.toLocaleString()} دج</span>
          </div>
          <div class="acc-metric-box">
            <span class="acc-metric-label">تكلفة النقاط المستهلكة (Coût Points)</span>
            <span class="acc-metric-value value-cost">${metrics.totalPointsCostDZD.toLocaleString()} دج</span>
          </div>
          <div class="acc-metric-box">
            <span class="acc-metric-label">استهلاك الورق والحبر التقديري</span>
            <span class="acc-metric-value">${metrics.totalPaperInk.toLocaleString()} دج</span>
          </div>
          <div class="acc-metric-box highlight-profit">
            <span class="acc-metric-label">صافي ربح المحل (Bénéfice Net)</span>
            <span class="acc-metric-value value-profit">${metrics.totalNetProfit.toLocaleString()} دج</span>
            <span class="acc-margin-pill">هامش الربح: ${metrics.marginPercent}%</span>
          </div>
        </div>

        <!-- جدول العمليات المفصلة -->
        <div class="acc-table-container">
          <h4 style="margin-bottom:8px; font-size:14px; font-weight:800; color:#0f172a;">سجل العمليات والخدمات المنجزة (${metrics.count} عملية)</h4>
          <table class="acc-table">
            <thead>
              <tr>
                <th style="width:30px;">#</th>
                <th>التاريخ والوقت</th>
                <th>الخدمة المنجزة والكاونتر</th>
                <th>الزبون</th>
                <th>تكلفة النقاط</th>
                <th>مستهلكات</th>
                <th>سعر التحصيل</th>
                <th>صافي الربح</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" style="text-align:right; font-weight:900;">المجاميع الإجمالية للكشف:</td>
                <td style="text-align:center; font-weight:900;">${metrics.totalPointsCostDZD.toLocaleString()} دج</td>
                <td style="text-align:center; font-weight:900;">${metrics.totalPaperInk.toLocaleString()} دج</td>
                <td style="text-align:center; font-weight:900; color:#0f172a;">${metrics.totalRevenue.toLocaleString()} دج</td>
                <td style="text-align:center; font-weight:900; color:#059669;">+${metrics.totalNetProfit.toLocaleString()} دج</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- قسم التوفيق النقدي والخاتم الرسمي -->
        <div class="acc-footer-grid">
          <div class="acc-cash-reconciliation">
            <h5 style="margin-bottom:6px; font-weight:800;">مطابقة الصندوق النقدي (Caisse Espèces)</h5>
            <ul style="list-style:none; padding:0; margin:0; font-size:12px; line-height:1.8; color:#334155;">
              <li>✓ المقبوضات النقدية المسجلة: <strong>${metrics.totalRevenue.toLocaleString()} دج</strong></li>
              <li>✓ تكلفة إعادة شحن محفظة النقاط: <strong>${metrics.totalPointsCostDZD.toLocaleString()} دج</strong></li>
              <li>✓ الصافي المستحق بصندوق المحل: <strong>${metrics.totalNetProfit.toLocaleString()} دج</strong></li>
            </ul>
          </div>
          <div class="acc-stamp-box">
            <p>تأشيرة وخاتم مسير المحل / المكتب</p>
            <div class="stamp-placeholder">
              <span>خاتم وتوقيع المحل</span>
              <small>${shopName}</small>
            </div>
          </div>
        </div>

        <div class="acc-print-footer-note">
          وثيقة محاسبية إدارية داخلية مولدة آلياً عبر منصة "سهلة" للمحلات ومكاتب الخدمات في الجزائر · معالجة فورية
        </div>
      </div>
    `;
  }
}

window.sahlaAccounting = new AccountingManager();
