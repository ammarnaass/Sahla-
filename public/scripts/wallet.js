// Sahla Wallet & Ledger Engine (نظام المحفظة والرصيد والخصم الذري)

class WalletManager {
  constructor() {
    this.STORAGE_KEY_WALLET = 'sahla_wallet_data';
    this.STORAGE_KEY_CARDS = 'sahla_scratch_cards';
    this.init();
  }

  init() {
    // تحميل بيانات المحفظة أو إنشاء حساب جديد
    const saved = localStorage.getItem(this.STORAGE_KEY_WALLET);
    if (saved) {
      try {
        this.data = JSON.parse(saved);
      } catch (e) {
        this.resetDefault();
      }
    } else {
      this.resetDefault();
    }

    // بطاقات الشحن المتاحة
    if (!localStorage.getItem(this.STORAGE_KEY_CARDS)) {
      localStorage.setItem(this.STORAGE_KEY_CARDS, JSON.stringify(INITIAL_SCRATCH_CARDS));
    }
  }

  resetDefault() {
    this.data = {
      points: 50, // رصيد ترحيبي مجاني لتجربة النظام
      shopName: 'كيوسك النور للخدمات الرقمية',
      ownerName: 'عبد القادر بوعبد الله',
      phone: '0550123456',
      wilayaCode: 16,
      commune: 'سيدي امحمد',
      role: 'OWNER',
      ledger: [
        {
          id: 'LEDGER-001',
          date: new Date().toISOString(),
          type: 'CREDIT',
          points: 50,
          balanceAfter: 50,
          description: 'رصيد ترحيبي تجريبي عند التسجيل في سهلة'
        }
      ]
    };
    this.save();
  }

  save() {
    localStorage.setItem(this.STORAGE_KEY_WALLET, JSON.stringify(this.data));
    window.dispatchEvent(new CustomEvent('sahla:wallet-updated', { detail: this.data }));
  }

  getBalance() {
    return this.data.points || 0;
  }

  getShopInfo() {
    return {
      shopName: this.data.shopName,
      ownerName: this.data.ownerName,
      phone: this.data.phone,
      wilayaCode: this.data.wilayaCode,
      commune: this.data.commune,
      role: this.data.role
    };
  }

  updateShopInfo(info) {
    this.data = { ...this.data, ...info };
    this.save();
  }

  // الخصم الذري (Atomic Deduction): لا تُخصم النقاط إلا إذا كانت الخدمة مدفوعة
  deductPoints(serviceCode, cost, description) {
    if (cost <= 0) return { success: true, pointsDeducted: 0, balance: this.data.points };

    if (this.data.points < cost) {
      return {
        success: false,
        error: `عذراً، رصيدك الحالي (${this.data.points} نقطة) لا يكفي لإتمام هذه الخدمة (${cost} نقطة). يرجى شحن المحفظة.`
      };
    }

    this.data.points -= cost;
    const entry = {
      id: 'LEDGER-' + Date.now().toString().slice(-6),
      date: new Date().toISOString(),
      type: 'DEBIT',
      serviceCode: serviceCode,
      points: cost,
      balanceAfter: this.data.points,
      description: description || 'استهلاك خدمة في المنصة'
    };

    this.data.ledger.unshift(entry);
    this.save();

    return {
      success: true,
      pointsDeducted: cost,
      balance: this.data.points,
      entry
    };
  }

  // استرجاع تلقائي عند فشل التوليد (Auto-Refund)
  refundPoints(cost, reason) {
    this.data.points += cost;
    const entry = {
      id: 'LEDGER-REF-' + Date.now().toString().slice(-6),
      date: new Date().toISOString(),
      type: 'REFUND',
      points: cost,
      balanceAfter: this.data.points,
      description: `استرجاع نقاط تلقائي: ${reason}`
    };

    this.data.ledger.unshift(entry);
    this.save();
    return entry;
  }

  // شحن برمز بطاقة تعبئة مادية (Scratch Card)
  redeemScratchCard(pinCode) {
    const cleanedPin = pinCode.trim().toUpperCase();
    const cards = JSON.parse(localStorage.getItem(this.STORAGE_KEY_CARDS) || '[]');
    const cardIndex = cards.findIndex(c => c.pin.toUpperCase() === cleanedPin);

    if (cardIndex === -1) {
      return { success: false, error: 'رمز بطاقة الشحن غير صحيح. تأكد من إدخال الرمز الممسوح بشكل دقيق.' };
    }

    const card = cards[cardIndex];
    if (card.status === 'REDEEMED') {
      return { success: false, error: 'هذه البطاقة تم شحنها مسبقاً ولا يمكن استخدامها مرة أخرى.' };
    }

    // شحن البطاقة
    card.status = 'REDEEMED';
    card.redeemedAt = new Date().toISOString();
    localStorage.setItem(this.STORAGE_KEY_CARDS, JSON.stringify(cards));

    this.data.points += card.points;
    const entry = {
      id: 'LEDGER-CARD-' + Date.now().toString().slice(-6),
      date: new Date().toISOString(),
      type: 'CREDIT',
      points: card.points,
      balanceAfter: this.data.points,
      description: `شحن رصيد ببطاقة تعبئة مادية (${card.points} نقطة - كود: ${card.pin})`
    };

    this.data.ledger.unshift(entry);
    this.save();

    return {
      success: true,
      pointsAdded: card.points,
      newBalance: this.data.points,
      card
    };
  }

  // إرسال طلب شحن بريدي موب مع صورة الوصل
  submitBaridiMobProof(rip, amountDZD, pointsRequested, receiptFile) {
    const entry = {
      id: 'LEDGER-BM-' + Date.now().toString().slice(-6),
      date: new Date().toISOString(),
      type: 'PENDING_APPROVAL',
      points: pointsRequested,
      amountDZD: amountDZD,
      balanceAfter: this.data.points,
      description: `طلب شحن بريدي موب بمبلغ ${amountDZD} دج (${pointsRequested} نقطة) - قيد التحقق الآلي`
    };

    // محاكاة قبول فوري تجريبي بعد ثانيتين
    setTimeout(() => {
      this.data.points += pointsRequested;
      entry.type = 'CREDIT';
      entry.balanceAfter = this.data.points;
      entry.description = `تم اعتماد شحن بريدي موب بنجاح (${pointsRequested} نقطة - ${amountDZD} دج)`;
      this.data.ledger.unshift(entry);
      this.save();
    }, 2500);

    return { success: true, message: 'تم استلام وصل التحويل، جاري معالجة الشحن وإيداع النقاط...' };
  }

  addDirectCredit(points, description) {
    const pts = parseInt(points, 10);
    this.data.points += pts;
    const entry = {
      id: 'LEDGER-EPAY-' + Date.now().toString().slice(-6),
      date: new Date().toISOString(),
      type: 'CREDIT',
      points: pts,
      balanceAfter: this.data.points,
      description
    };
    this.data.ledger.unshift(entry);
    this.save();
    return { success: true, pointsAdded: pts, newBalance: this.data.points, entry };
  }

  getLedgerHistory() {
    return this.data.ledger || [];
  }
}

const sahlaWallet = new WalletManager();
