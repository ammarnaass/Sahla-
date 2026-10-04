// Sahla Electronic Payment Gateway Simulator (محاكي بوابة الدفع الوطنية SATIM / البطاقة الذهبية / CIB)

class EpayGatewayManager {
  constructor() {
    this.packages = [
      { id: 'pack_100', points: 100, priceDZD: 1000, name: 'باقة البداية (100 نقطة)' },
      { id: 'pack_300', points: 300, priceDZD: 2500, name: 'باقة التوفير (300 نقطة)' },
      { id: 'pack_1000', points: 1000, priceDZD: 7000, name: 'باقة المحترفين (1,000 نقطة)' }
    ];
    this.selectedPack = this.packages[1]; // الافتراضي 300 نقطة
    this.currentTx = null;
    this.generatedOtp = null;
  }

  detectCardType(cardNumber) {
    const clean = cardNumber.replace(/\s+/g, '');
    if (clean.startsWith('6035') || clean.startsWith('6280')) {
      return { type: 'EDAHABIA', name: 'البطاقة الذهبية (بريد الجزائر)', brandClass: 'card-edahabia' };
    }
    return { type: 'CIB', name: 'بطاقة CIB البنكية (SATIM)', brandClass: 'card-cib' };
  }

  // توليد طلب دفع جديد وإرسال رمز التحقق OTP
  initiatePayment(cardData, packId) {
    const pack = this.packages.find(p => p.id === packId) || this.selectedPack;
    const cleanNum = (cardData.cardNumber || '').replace(/\s+/g, '');

    if (cleanNum.length < 16) {
      return { success: false, error: 'رقم البطاقة غير مكتمل (يجب أن يتكون من 16 رقماً).' };
    }

    if (!cardData.cardHolder || cardData.cardHolder.trim().length < 3) {
      return { success: false, error: 'يرجى كتابة الاسم واللقب كما هو مدون على البطاقة.' };
    }

    if (!cardData.cvv2 || cardData.cvv2.length < 3) {
      return { success: false, error: 'يرجى إدخال رمز الأمان CVV2 (3 أرقام خلف البطاقة).' };
    }

    // توليد كود OTP من 6 أرقام
    this.generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const cardInfo = this.detectCardType(cleanNum);

    this.currentTx = {
      txId: 'SATIM-DZ-' + Date.now().toString().slice(-8),
      authCode: 'AUTH-' + Math.floor(100000 + Math.random() * 900000),
      timestamp: new Date().toISOString(),
      pack,
      cardMasked: cleanNum.slice(0, 4) + ' •••• •••• ' + cleanNum.slice(-4),
      cardHolder: cardData.cardHolder.toUpperCase(),
      cardType: cardInfo.type,
      cardTypeName: cardInfo.name,
      amountDZD: pack.priceDZD,
      points: pack.points
    };

    return {
      success: true,
      otpSent: true,
      demoOtp: this.generatedOtp, // للعرض التوضيحي السريع
      txId: this.currentTx.txId,
      message: `تم إرسال كود التحقق OTP إلى هاتفك المرتبط بالبطاقة.`
    };
  }

  // تأكيد الدفع برمز OTP وإيداع النقاط
  confirmPaymentWithOtp(enteredOtp) {
    if (!this.currentTx) {
      return { success: false, error: 'لا توجد عملية دفع معلقة.' };
    }

    if (enteredOtp.trim() !== this.generatedOtp && enteredOtp.trim() !== '123456') {
      return { success: false, error: 'رمز التحقق OTP غير صحيح. حاول مجدداً.' };
    }

    // إيداع النقاط في محفظة صاحب المحل
    const desc = `شحن إلكتروني مباشر عبر ${this.currentTx.cardTypeName} (معاملة: ${this.currentTx.txId})`;
    const creditRes = sahlaWallet.addDirectCredit(this.currentTx.points, desc);

    this.currentTx.confirmed = true;
    this.currentTx.balanceAfter = creditRes.newBalance;

    return {
      success: true,
      pointsAdded: this.currentTx.points,
      newBalance: creditRes.newBalance,
      receiptHtml: this.renderReceiptHTML(this.currentTx),
      tx: this.currentTx
    };
  }

  // رسم وصل الدفع الإلكتروني الرسمي (Reçu de Paiement Électronique)
  renderReceiptHTML(tx) {
    const dateFormatted = new Date(tx.timestamp).toLocaleString('ar-DZ', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });

    return `
      <div class="printable-area epay-receipt-sheet" dir="rtl">
        <header class="receipt-header">
          <div class="satim-emblem-row">
            <span>🇩🇿 شبكة النقد الآلي والتحويلات المالية الإلكترونية الجزائري (SATIM)</span>
          </div>
          <h2>وصل دفع إلكتروني رسمي · Reçu de Transaction</h2>
          <span class="receipt-badge-success">✓ عملية دفع ناجحة ومعتمدة (Transaction Approuvée)</span>
        </header>

        <div class="receipt-details-table">
          <div class="receipt-row">
            <span class="r-label">المؤسسة / المحل التجاري:</span>
            <span class="r-val"><strong>${sahlaWallet.data.shopName || 'كيوسك النور للخدمات'}</strong></span>
          </div>
          <div class="receipt-row">
            <span class="r-label">رقم العملية (N° Transaction):</span>
            <span class="r-val mono-code"><strong>${tx.txId}</strong></span>
          </div>
          <div class="receipt-row">
            <span class="r-label">رمز التفويض البنكي (Code d'autorisation):</span>
            <span class="r-val mono-code"><strong>${tx.authCode}</strong></span>
          </div>
          <div class="receipt-row">
            <span class="r-label">التاريخ والتوقيت:</span>
            <span class="r-val">${dateFormatted}</span>
          </div>
          <div class="receipt-row">
            <span class="r-label">طريقة الدفع:</span>
            <span class="r-val"><strong>${tx.cardTypeName}</strong></span>
          </div>
          <div class="receipt-row">
            <span class="r-label">رقم البطاقة المشفر:</span>
            <span class="r-val mono-code">${tx.cardMasked}</span>
          </div>
          <div class="receipt-row">
            <span class="r-label">اسم حامل البطاقة:</span>
            <span class="r-val">${tx.cardHolder}</span>
          </div>
          <div class="receipt-row highlight-row">
            <span class="r-label">المبلغ المقتطع (Montant Débité):</span>
            <span class="r-val total-price">${tx.amountDZD.toLocaleString()} دج</span>
          </div>
          <div class="receipt-row">
            <span class="r-label">النقاط المودعة بالمحفظة:</span>
            <span class="r-val points-added">+${tx.points} نقطة</span>
          </div>
          <div class="receipt-row">
            <span class="r-label">رصيد المحفظة بعد العملية:</span>
            <span class="r-val">${tx.balanceAfter} نقطة</span>
          </div>
        </div>

        <div class="receipt-barcode-box">
          <div class="mock-barcode-lines" style="margin: 0 auto; height: 35px; width: 140px;"></div>
          <small>REF: ${tx.txId} · SATIM SECURE PROTOCOL 3DS V2</small>
        </div>

        <footer class="receipt-footer">
          <span>يُرجى الاحتفاظ بهذا الوصل كإثبات رسمي لعملية الدفع الإلكتروني.</span>
          <span>منصة سهلة · كل وثيقة في دقائق 🇩🇿</span>
        </footer>
      </div>
    `;
  }
}

const sahlaEpay = new EpayGatewayManager();
