// Sahla Algerian E-Government Directory & Citizen Dossier Assistant (دليل البوابات الحكومية والملفات الإدارية)

class EgovDirectoryManager {
  constructor() {
    this.services = (typeof EGOV_SERVICES_DIRECTORY !== 'undefined') ? EGOV_SERVICES_DIRECTORY : (window.EGOV_SERVICES_DIRECTORY || []);
    this.selectedService = this.services[0] || null;
  }

  getAll() {
    return this.services;
  }

  getById(id) {
    return this.services.find(s => s.id === id);
  }

  filter(category = 'ALL', searchQuery = '') {
    return this.services.filter(item => {
      const matchCat = category === 'ALL' || item.category === category;
      if (!matchCat) return false;

      if (!searchQuery || searchQuery.trim() === '') return true;
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = item.titleAr.toLowerCase().includes(q) || item.titleFr.toLowerCase().includes(q);
      const matchAuth = item.authorityAr.toLowerCase().includes(q) || item.authorityFr.toLowerCase().includes(q);
      const matchDesc = item.descriptionAr.toLowerCase().includes(q);
      const matchDocs = item.requiredDossier.some(d => d.doc.toLowerCase().includes(q) || d.note.toLowerCase().includes(q));

      return matchTitle || matchAuth || matchDesc || matchDocs;
    });
  }

  // توليد وثيقة قائمة الوثائق والشروط الإدارية A4 لتسليمها للزبون
  generateCitizenChecklistHTML(serviceId, shopData = {}) {
    const s = this.getById(serviceId);
    if (!s) return '';

    const shopName = shopData.shopName || 'كيوسك وخدمات النور الرقمية';
    const wilayaCode = shopData.wilayaCode || 16;
    const w = (typeof ALGERIAN_WILAYAS !== 'undefined') ? ALGERIAN_WILAYAS.find(item => item.code === wilayaCode) : null;
    const wilayaName = w ? w.nameAr : 'الجزائر';
    const today = new Date().toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' });

    const dossierItems = s.requiredDossier.map((d, idx) => `
      <div class="dossier-checklist-item">
        <div class="dossier-checkbox">☐</div>
        <div class="dossier-item-text">
          <span class="dossier-item-name">${d.doc}</span>
          <span class="dossier-item-note">${d.note}</span>
        </div>
      </div>
    `).join('');

    return `
      <div class="citizen-dossier-sheet">
        <!-- ترويسة المحل للمطبوعة -->
        <div class="dossier-header-bar">
          <div class="dossier-shop-box">
            <h3>${shopName}</h3>
            <p>خدمات رقمية، نسخ وطباعة وثائق · ولاية ${wilayaName} (${wilayaCode})</p>
            <p>هاتف: ${shopData.phone || '0550 00 00 00'}</p>
          </div>
          <div class="dossier-title-box">
            <h2>دليل الوثائق والشروط المطلوبة</h2>
            <p>بطاقة إرشادية تسلّم للزبون · ${today}</p>
          </div>
        </div>

        <!-- معلومات الخدمة والبوابة الرسمية -->
        <div class="dossier-service-meta">
          <div class="dossier-badge-row">
            <span class="dossier-category-badge">${s.badge}</span>
            <span class="dossier-status-badge">✓ بوابة معتمدة ورسمية</span>
          </div>
          <h3>${s.titleAr}</h3>
          <h4>${s.titleFr}</h4>
          <p class="dossier-authority"><strong>الجهة المسؤولة:</strong> ${s.authorityAr}</p>
          <p class="dossier-desc">${s.descriptionAr}</p>
          <div class="dossier-portal-link">
            <span>🌐 الرابط الرسمي للبوابة:</span>
            <strong>${s.officialUrl}</strong>
          </div>
        </div>

        <!-- قائمة الوثائق المطلوبة للتحضير -->
        <div class="dossier-requirements-section">
          <div class="dossier-sec-head">
            <h4>📋 الملف الإداري والوثائق المطلوبة من الزبون (Dossier à fournir):</h4>
            <small>يرجى إحضار هذه الوثائق معك للمحل لإتمام العملية بنجاح وبأسرع وقت:</small>
          </div>
          <div class="dossier-items-list">
            ${dossierItems}
          </div>
        </div>

        <!-- الرسوم والطابع الجبائي -->
        <div class="dossier-fees-box">
          <span class="fees-label">💰 الرسوم وحقوق الطابع المعتمدة:</span>
          <span class="fees-val">${s.officialFees}</span>
        </div>

        <!-- نصائح صاحب المحل وملاحظات هامة -->
        <div class="dossier-kiosk-advice">
          <strong>💡 إرشادات هامة من مكتب الخدمات:</strong>
          <p>${s.kioskTips}</p>
        </div>

        <!-- تذييل الورقة -->
        <div class="dossier-footer-note">
          <span>نحن في خدمتكم لإتمام معاملاتكم الرقمية وحجز المواعيد واستخراج الوثائق بدقة وسرعة.</span>
          <span>منصة سهلة · شبكة مكاتب الخدمات في الجزائر</span>
        </div>
      </div>
    `;
  }
}

window.sahlaEgov = new EgovDirectoryManager();
