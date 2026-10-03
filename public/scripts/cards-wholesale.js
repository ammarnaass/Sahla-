// Sahla Scratch Cards Wholesale & Physical Distribution Engine (محرك تجهيز وطباعة بطاقات الشحن للتوزيع الميداني)

class CardsWholesaleManager {
  constructor() {
    this.STORAGE_KEY = 'sahla_scratch_cards';
  }

  // توليد دفعة بطاقات جديدة وتخزينها
  generateWholesaleBatch(points, count = 6) {
    const pts = parseInt(points, 10);
    let priceDZD = 1000;
    if (pts === 300) priceDZD = 2500;
    else if (pts === 1000) priceDZD = 7000;

    const batchId = 'BATCH-' + Date.now().toString().slice(-4);
    const existingCards = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    const newCards = [];

    for (let i = 1; i <= count; i++) {
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const card = {
        pin: `SAHLA-${pts}-${randomCode}`,
        serial: `SN${new Date().getFullYear()}-${batchId}-${i.toString().padStart(3, '0')}`,
        points: pts,
        priceDZD,
        status: 'UNREDEEMED',
        batch: batchId,
        createdAt: new Date().toISOString()
      };
      newCards.push(card);
      existingCards.unshift(card);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingCards));
    window.dispatchEvent(new CustomEvent('sahla:cards-updated', { detail: existingCards }));

    return {
      batchId,
      points: pts,
      priceDZD,
      count,
      cards: newCards
    };
  }

  // رسم وتوليد ورقة A4 تحتوي على بطاقات الشحن المجهزة للتقطيع
  renderWholesaleSheetHTML(batchData) {
    const cards = batchData.cards || [];

    return `
      <div class="printable-area cards-wholesale-a4-sheet" dir="rtl">
        <!-- ترويسة الصفحة للطباعة -->
        <header class="wholesale-sheet-header">
          <div class="sheet-title-box">
            <h3>منصة سهلة · دفعة بطاقات التعبئة المادية (Planche A4 de Cartes de Recharge)</h3>
            <p>الدفعة: <strong>${batchData.batchId}</strong> · الفئة: <strong>${batchData.points} نقطة (${batchData.priceDZD} دج)</strong> · التاريخ: ${new Date().toLocaleDateString('ar-DZ')}</p>
          </div>
          <div class="sheet-cut-instructions">
            <span>✂️ يُطبع على ورق مقوى (Bristol 200-250g) وتُقص البطاقات بدقة باتباع خطوط التقطيع المتقطعة</span>
          </div>
        </header>

        <!-- شبكة البطاقات (2 أعمدة × 3 أو 5 صفوف) -->
        <div class="wholesale-cards-grid">
          ${cards.map(c => `
            <div class="physical-card-item">
              <div class="pcard-border-cut">
                <!-- الجزء العلوي للبطاقة -->
                <div class="pcard-top">
                  <div class="pcard-brand">
                    <span class="pcard-logo">🇩🇿 سهلة · Sahla</span>
                    <small>بطاقة تعبئة رصيد خدمات رقمية</small>
                  </div>
                  <div class="pcard-points-badge">
                    <strong>${c.points}</strong>
                    <span>نقطة</span>
                  </div>
                </div>

                <!-- الجزء الأوسط: الكود السري وشريط التغطية المحاكى -->
                <div class="pcard-body">
                  <div class="pcard-scratch-area">
                    <span class="scratch-label">امسح الطبقة الفضية برفق:</span>
                    <div class="scratch-silver-box">
                      <span class="revealed-pin">${c.pin}</span>
                      <div class="silver-hatch-pattern"></div>
                    </div>
                  </div>

                  <div class="pcard-qr-box">
                    <svg width="60" height="60" viewBox="0 0 100 100">
                      <rect width="100" height="100" fill="#fff"/>
                      <rect x="10" y="10" width="30" height="30" fill="#0f172a"/>
                      <rect x="15" y="15" width="20" height="20" fill="#fff"/>
                      <rect x="20" y="20" width="10" height="10" fill="#0f172a"/>
                      <rect x="60" y="10" width="30" height="30" fill="#0f172a"/>
                      <rect x="65" y="15" width="20" height="20" fill="#fff"/>
                      <rect x="70" y="20" width="10" height="10" fill="#0f172a"/>
                      <rect x="10" y="60" width="30" height="30" fill="#0f172a"/>
                      <rect x="15" y="65" width="20" height="20" fill="#fff"/>
                      <rect x="20" y="70" width="10" height="10" fill="#0f172a"/>
                      <rect x="50" y="50" width="12" height="12" fill="#0f172a"/>
                    </svg>
                    <small>مسح وتفعيل</small>
                  </div>
                </div>

                <!-- الجزء السفلي: السعر والرقم التسلسلي وشروط الاستخدام -->
                <div class="pcard-footer">
                  <div class="pcard-price-tag">السعر الموصى به: <strong>${c.priceDZD} دج</strong></div>
                  <div class="pcard-serial mono-code">${c.serial}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <footer class="wholesale-sheet-footer">
          <span>صالحة لجميع خدمات منصة سهلة (سير ذاتية، فواتير، استمارات، بحوث، تصاريح جبائية) · غير قابلة للاسترجاع بعد خدش الكود</span>
          <span>صفحة 1 من 1 · Sahla Wholesale Distribution</span>
        </footer>
      </div>
    `;
  }
}

const sahlaCardsWholesale = new CardsWholesaleManager();
