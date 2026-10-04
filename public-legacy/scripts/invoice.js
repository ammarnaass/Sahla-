// Sahla Algerian Commercial Invoicing Engine (محرك الفواتير التجارية الرسمية الجزائرية)

class InvoiceManager {
  constructor() {
    this.defaultSeller = {
      name: 'كيوسك ومكتبة النور للخدمات الرقمية',
      activity: 'خدمات الإعلام الآلي، الطباعة والنسخ والخدمات المكتبية',
      address: 'شارع ديدوش مراد، رقم 45، الجزائر الوسطى',
      wilaya: 'الجزائر العاصمة',
      phone: '023 45 67 89 / 0550 12 34 56',
      nif: '001616012345678',
      nis: '001616012345678',
      rc: '16/00-0987654A21',
      article: '16019876543'
    };

    this.defaultCustomer = {
      name: 'مؤسسة الأفق للتجارة والتوزيع (EURL El Ofoq)',
      address: 'المنطقة الصناعية، الرويبة، الجزائر',
      phone: '0560 98 76 54',
      nif: '002016098765432',
      nis: '002016098765432',
      rc: '16/00-5544332B20',
      article: '16025544332'
    };

    this.items = [
      { id: 1, desc: 'تصميم وطباعة دفاتر وسجلات تجارية مخصصة', qty: 5, priceHT: 1800, tva: 19 },
      { id: 2, desc: 'إعداد وتنسيق وطباعة وثائق وعروض أسعار A4', qty: 100, priceHT: 35, tva: 19 },
      { id: 3, desc: 'تجهيز وطباعة بطاقات تعريف مهنية ملونة (PVC)', qty: 20, priceHT: 250, tva: 19 },
      { id: 4, desc: 'خدمات النسخ والمسح الضوئي والأرشفة الإلكترونية', qty: 1, priceHT: 2500, tva: 9 }
    ];

    this.invoiceMeta = {
      number: '2026/042',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'CASH', // 'CASH', 'CHEQUE', 'VIREMENT_BARIDIMOB'
      isTimbreApplicable: true // Timbre fiscal applicable on cash payments
    };
  }

  // حساب المجاميع المالية والضرائب الجزائرية بدقة
  calculateTotals(items = this.items, paymentMethod = this.invoiceMeta.paymentMethod) {
    let totalHT = 0;
    let tva9 = 0;
    let tva19 = 0;

    items.forEach(item => {
      const lineHT = item.qty * item.priceHT;
      totalHT += lineHT;
      if (item.tva === 19) tva19 += lineHT * 0.19;
      else if (item.tva === 9) tva9 += lineHT * 0.09;
    });

    const totalTVA = tva9 + tva19;
    const subtotalWithTVA = totalHT + totalTVA;

    // حساب الطابع الجبائي (Timbre Fiscal) الجزائري:
    // يطبق على الدفع نقداً (Espèces/Cash) بنسبة 1% بحد أدنى 25 دج وبحد أقصى 2500 دج وفق قانون المالية
    let timbreFiscal = 0;
    if (paymentMethod === 'CASH') {
      const calculatedTimbre = Math.ceil(subtotalWithTVA * 0.01);
      timbreFiscal = Math.max(25, Math.min(2500, calculatedTimbre));
    }

    const totalTTC = subtotalWithTVA + timbreFiscal;

    return {
      totalHT,
      tva9,
      tva19,
      totalTVA,
      timbreFiscal,
      totalTTC,
      wordsAr: numberToArabicWords(totalTTC),
      wordsFr: numberToFrenchWords(totalTTC)
    };
  }

  // توليد كود HTML الكامل للفاتورة الرسمية A4
  renderInvoiceHTML(seller = this.defaultSeller, customer = this.defaultCustomer, items = this.items, meta = this.invoiceMeta) {
    const calc = this.calculateTotals(items, meta.paymentMethod);

    return `
      <div class="invoice-a4-sheet" dir="rtl">
        <!-- ترويسة الفاتورة -->
        <header class="invoice-header">
          <div class="invoice-header-right">
            <h1 class="invoice-shop-title">${seller.name}</h1>
            <p class="invoice-shop-sub">${seller.activity}</p>
            <p class="invoice-shop-addr">📍 ${seller.address} - ${seller.wilaya}</p>
            <p class="invoice-shop-contact">📞 ${seller.phone}</p>
          </div>
          <div class="invoice-header-left">
            <div class="invoice-badge-box">
              <span class="invoice-badge-title">فاتورة رسمية</span>
              <span class="invoice-badge-num">N° : ${meta.number}</span>
              <span class="invoice-badge-date">التاريخ: ${meta.date}</span>
            </div>
          </div>
        </header>

        <!-- الإشارات القانونية الإلزامية للبائع والمشتري -->
        <div class="invoice-ident-grid">
          <!-- بيانات البائع الإلزامية -->
          <div class="invoice-ident-card seller-card">
            <h3 class="ident-title">المعرّفات الجبائية للبائع (Fournisseur)</h3>
            <div class="ident-row"><span>رقم التعريف الجبائي (NIF):</span> <strong>${seller.nif}</strong></div>
            <div class="ident-row"><span>رقم التعريف الإحصائي (NIS):</span> <strong>${seller.nis}</strong></div>
            <div class="ident-row"><span>رقم السجل التجاري (RC):</span> <strong>${seller.rc}</strong></div>
            <div class="ident-row"><span>رقم المادة (Article d'impôt):</span> <strong>${seller.article}</strong></div>
          </div>

          <!-- بيانات الزبون -->
          <div class="invoice-ident-card customer-card">
            <h3 class="ident-title">بيانات المشتري / الزبون (Client)</h3>
            <div class="ident-row"><span>الاسم أو الشركة:</span> <strong>${customer.name}</strong></div>
            <div class="ident-row"><span>العنوان:</span> <span>${customer.address}</span></div>
            <div class="ident-row"><span>NIF:</span> <strong>${customer.nif || 'مستهلك نهائي'}</strong></div>
            <div class="ident-row"><span>RC:</span> <span>${customer.rc || '—'}</span></div>
          </div>
        </div>

        <!-- جدول بنود الفاتورة -->
        <table class="invoice-items-table">
          <thead>
            <tr>
              <th style="width: 5%;">الرقم</th>
              <th style="width: 45%;">البيان وتعيين السلع والخدمات (Désignation)</th>
              <th style="width: 10%;">الكمية (Qté)</th>
              <th style="width: 15%;">سعر الوحدة خ.ر (P.U HT)</th>
              <th style="width: 10%;">الرسم (TVA)</th>
              <th style="width: 15%;">المبلغ الإجمالي خ.ر (Montant HT)</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((it, idx) => `
              <tr>
                <td style="text-align: center;">${idx + 1}</td>
                <td><strong>${it.desc}</strong></td>
                <td style="text-align: center;">${it.qty}</td>
                <td style="text-align: left;">${it.priceHT.toLocaleString()} دج</td>
                <td style="text-align: center;">${it.tva}%</td>
                <td style="text-align: left;"><strong>${(it.qty * it.priceHT).toLocaleString()} دج</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- ملخص المجاميع والضرائب وطريقة الدفع -->
        <div class="invoice-summary-block">
          <div class="invoice-words-box">
            <p class="words-ar">${calc.wordsAr}</p>
            <p class="words-fr"><em>${calc.wordsFr}</em></p>
            <div class="payment-method-tag">
              طريقة التسديد: <strong>${meta.paymentMethod === 'CASH' ? 'نقداً (Espèces)' : (meta.paymentMethod === 'CHEQUE' ? 'شيك بنكي / بريدي' : 'تحويل بنكي / بريدي موب')}</strong>
            </div>
          </div>

          <div class="invoice-totals-box">
            <div class="total-row"><span>المجموع خارج الرسم (Total HT):</span> <span>${calc.totalHT.toLocaleString()} دج</span></div>
            ${calc.tva9 > 0 ? `<div class="total-row"><span>الرسم ع.ق.م 9% (TVA 9%):</span> <span>${calc.tva9.toLocaleString()} دج</span></div>` : ''}
            ${calc.tva19 > 0 ? `<div class="total-row"><span>الرسم ع.ق.م 19% (TVA 19%):</span> <span>${calc.tva19.toLocaleString()} دج</span></div>` : ''}
            <div class="total-row"><span>إجمالي الرسم (Total TVA):</span> <span>${calc.totalTVA.toLocaleString()} دج</span></div>
            ${calc.timbreFiscal > 0 ? `<div class="total-row timbre-row"><span>طابع جبائي نقدي (Timbre Fiscal):</span> <span>${calc.timbreFiscal.toLocaleString()} دج</span></div>` : ''}
            <div class="total-row ttc-row"><span>المبلغ الإجمالي ش.ك.ر (Total TTC):</span> <strong>${calc.totalTTC.toLocaleString()} دج</strong></div>
          </div>
        </div>

        <!-- تذييل وتوقيع وخاتم المحل -->
        <footer class="invoice-footer">
          <div class="footer-notice">
            <p>• تم إصدار هذه الوثيقة طبقاً لأحكام القانون التجاري والتشريع الجبائي الجزائري ساري المفعول.</p>
            <p>• شكراً لثقتكم وتعاملكم معنا.</p>
          </div>
          <div class="stamp-box">
            <span>خاتم وتوقيع المحل (Cachet et Signature)</span>
            <div class="stamp-placeholder"></div>
          </div>
        </footer>
      </div>
    `;
  }
}

const sahlaInvoice = new InvoiceManager();
