// Sahla Application Master Orchestrator (المتحكم الرئيسي لمنصة سهلة)

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initWalletUI();
  initCVBuilderUI();
  initIDPhotoUI();
  initInvoiceUI();
  initAdminLettersUI();
  initProceduresGuideUI();
  initAdminUI();
  initPrintBridgeUI();
  initThemeToggle();
  // المرحلة 2: الخدمات المدرسية والبحوث، الاستمارات الرسمية بالـ OCR، ودفتر الزبائن
  initSchoolUI();
  initOCRFormsUI();
  initCustomersUI();
  // المرحلة 3: التصاريح الجبائية الرسمية G50/G12، بوابة الدفع الإلكتروني، وتوزيع البطاقات
  initTaxUI();
  initEpayUI();
  initWholesaleUI();
  // المرحلة 4: التوسع المؤسسي، نقاط البيع، المحاسبة، والبوابات الوطنية
  initPosUI();
  initAccountingUI();
  initEgovUI();
  initHardwareUI();
  // وثيقة PRD: تسجيل الدخول، الصفحة التعريفية، الشاشة الرئيسية، وتجربة أول زيارة
  initLandingUI();
  initAuthUI();
  initOnboardingUI();
  initDashboardEnhancements();
  initNotificationsUI();
  initRecentDocsUI();
  initDemoWalkthroughUI();
  initOtpHelpUI();
  initCelebrationUI();
  initStaffUI();
  initOfflineDetection();

  // تسجيل Service Worker للـ PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
});

// Toast notification helper
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? '✓' : (type === 'error' ? '✕' : 'ℹ');
  toast.innerHTML = `<span style="font-weight:900;">${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// 1. نظام التنقل والتبويبات (Navigation)
function initNavigation() {
  const navButtons = document.querySelectorAll('[data-target-tab]');
  const views = document.querySelectorAll('.app-view-section');

  window.switchTab = function(tabId) {
    navButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-target-tab') === tabId);
    });

    views.forEach(v => {
      v.style.display = v.id === `view-${tabId}` ? 'block' : 'none';
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-target-tab');
      switchTab(tabId);
    });
  });
}

// 2. واجهة المحفظة والرصيد (Wallet UI)
function initWalletUI() {
  const pointsBadge = document.getElementById('headerPointsValue');
  const miniPointsBadge = document.getElementById('miniPointsValue');
  const shopNameBadge = document.getElementById('sidebarShopName');
  const wilayaBadge = document.getElementById('sidebarWilaya');

  function updateDisplay(data) {
    if (pointsBadge) pointsBadge.textContent = data.points;
    if (miniPointsBadge) miniPointsBadge.textContent = data.points;
    if (shopNameBadge) shopNameBadge.textContent = data.shopName;
    const w = ALGERIAN_WILAYAS.find(item => item.code === data.wilayaCode);
    if (wilayaBadge && w) wilayaBadge.textContent = `${w.code} - ${w.nameAr}`;
  }

  updateDisplay(sahlaWallet.data);
  window.addEventListener('sahla:wallet-updated', (e) => updateDisplay(e.detail));

  // فتح وإغلاق نافذة المحفظة
  const walletModal = document.getElementById('walletModal');
  window.openWalletModal = function() {
    renderLedgerTable();
    walletModal.classList.add('open');
  };
  window.closeWalletModal = function() {
    walletModal.classList.remove('open');
  };

  // شحن ببطاقة تعبئة
  const redeemBtn = document.getElementById('btnSubmitScratchCode');
  const pinInput = document.getElementById('scratchPinInput');
  if (redeemBtn && pinInput) {
    redeemBtn.addEventListener('click', () => {
      const pin = pinInput.value;
      if (!pin) return showToast('يرجى كتابة رمز بطاقة الشحن', 'error');

      const res = sahlaWallet.redeemScratchCard(pin);
      if (res.success) {
        showToast(`تم شحن المحفظة بنجاح! +${res.pointsAdded} نقطة (الرصيد الجديد: ${res.newBalance} نقطة)`);
        pinInput.value = '';
        renderLedgerTable();
      } else {
        showToast(res.error, 'error');
      }
    });
  }

  // شحن بريدي موب
  const btnBaridiMob = document.getElementById('btnSubmitBaridiMob');
  if (btnBaridiMob) {
    btnBaridiMob.addEventListener('click', () => {
      const amount = document.getElementById('baridiAmountSelect').value;
      const points = amount === '1000' ? 100 : (amount === '2500' ? 300 : 1000);
      sahlaWallet.submitBaridiMobProof('007999990022334455', amount, points, null);
      showToast('تم رفع إشعار الدفع عبر بريدي موب! سيتم إيداع النقاط فورياً.');
      renderLedgerTable();
    });
  }

  function renderLedgerTable() {
    const tbody = document.getElementById('ledgerTableBody');
    if (!tbody) return;
    const items = sahlaWallet.getLedgerHistory();
    tbody.innerHTML = items.slice(0, 10).map(i => {
      const isCredit = i.type === 'CREDIT';
      const color = isCredit ? '#10b981' : (i.type === 'REFUND' ? '#38bdf8' : '#f87171');
      const sign = isCredit ? '+' : (i.type === 'REFUND' ? '↺' : '-');
      const time = new Date(i.date).toLocaleDateString('ar-DZ') + ' ' + new Date(i.date).toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });
      return `
        <tr>
          <td><small>${time}</small></td>
          <td>${i.description}</td>
          <td style="color:${color}; font-weight:800; text-align:center;">${sign} ${i.points}</td>
          <td style="font-weight:700; text-align:center;">${i.balanceAfter}</td>
        </tr>
      `;
    }).join('');
  }
}

// 3. مولد السير الذاتية (CV Builder UI)
function initCVBuilderUI() {
  const container = document.getElementById('cvPreviewContainer');
  let currentCVData = JSON.parse(JSON.stringify(sahlaCV.sampleData));

  function updatePreview() {
    if (!container) return;
    container.innerHTML = sahlaCV.renderCVHTML(currentCVData);
  }

  updatePreview();

  // تبديل القوالب
  document.querySelectorAll('[data-cv-template]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-cv-template]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      sahlaCV.currentTemplate = btn.getAttribute('data-cv-template');
      updatePreview();
    });
  });

  // تبديل اللغات
  document.querySelectorAll('[data-cv-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-cv-lang]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      sahlaCV.currentLanguage = btn.getAttribute('data-cv-lang');
      updatePreview();
    });
  });

  // تحديث الحقول الحية
  const nameInput = document.getElementById('cvInputFullName');
  const titleInput = document.getElementById('cvInputJobTitle');
  const phoneInput = document.getElementById('cvInputPhone');
  const emailInput = document.getElementById('cvInputEmail');
  const wilayaInput = document.getElementById('cvInputWilaya');
  const summaryInput = document.getElementById('cvInputSummary');

  if (nameInput) nameInput.addEventListener('input', (e) => { currentCVData.fullName = e.target.value; updatePreview(); });
  if (titleInput) titleInput.addEventListener('input', (e) => { currentCVData.jobTitle = e.target.value; updatePreview(); });
  if (phoneInput) phoneInput.addEventListener('input', (e) => { currentCVData.phone = e.target.value; updatePreview(); });
  if (emailInput) emailInput.addEventListener('input', (e) => { currentCVData.email = e.target.value; updatePreview(); });
  if (wilayaInput) wilayaInput.addEventListener('input', (e) => { currentCVData.wilaya = e.target.value; updatePreview(); });
  if (summaryInput) summaryInput.addEventListener('input', (e) => { currentCVData.summary = e.target.value; updatePreview(); });

  // طباعة السيرة الذاتية (مع الخصم الذري 15 نقطة)
  const printCVBtn = document.getElementById('btnPrintCV');
  if (printCVBtn) {
    printCVBtn.addEventListener('click', () => {
      const deduction = sahlaWallet.deductPoints('CV_STANDARD', SERVICE_RATES.CV_STANDARD.points, `توليد وطباعة سيرة ذاتية للزبون: ${currentCVData.fullName}`);
      if (!deduction.success) {
        return showToast(deduction.error, 'error');
      }

      showToast(`تم خصم ${SERVICE_RATES.CV_STANDARD.points} نقطة بنجاح، جاري فتح أمر الطباعة A4...`);
      setTimeout(() => window.print(), 300);
    });
  }

  // إرسال لطابعة المحل (Phone to PC Bridge)
  const bridgeCVBtn = document.getElementById('btnBridgeCV');
  if (bridgeCVBtn) {
    bridgeCVBtn.addEventListener('click', () => {
      const deduction = sahlaWallet.deductPoints('CV_STANDARD', SERVICE_RATES.CV_STANDARD.points, `إرسال سيرة ذاتية للطباعة عبر الجسر: ${currentCVData.fullName}`);
      if (!deduction.success) return showToast(deduction.error, 'error');

      const html = sahlaCV.renderCVHTML(currentCVData);
      sahlaBridge.sendDocumentFromPhone('CV', `سيرة ذاتية - ${currentCVData.fullName}`, html, null);
      showToast('تم إرسال السيرة الذاتية لطابعة المحل لاسلكياً بنجاح! 🚀');
    });
  }

  // توليد رسالة التحفيز بالذكاء الاصطناعي
  const aiLetterBtn = document.getElementById('btnGenerateAILetter');
  const letterOutputModal = document.getElementById('aiLetterModal');
  const letterTextArea = document.getElementById('aiLetterContent');

  if (aiLetterBtn && letterOutputModal && letterTextArea) {
    aiLetterBtn.addEventListener('click', () => {
      const deduction = sahlaWallet.deductPoints('MOTIVATION_LETTER', SERVICE_RATES.MOTIVATION_LETTER.points, `صياغة رسالة تحفيز بالذكاء الاصطناعي: ${currentCVData.fullName}`);
      if (!deduction.success) return showToast(deduction.error, 'error');

      showToast('جاري استدعاء نموذج الذكاء الاصطناعي لتوليد رسالة تحفيز احترافية...');
      setTimeout(() => {
        const text = sahlaCV.generateMotivationLetter(currentCVData, '', '', sahlaCV.currentLanguage);
        letterTextArea.value = text;
        letterOutputModal.classList.add('open');
      }, 700);
    });
  }

  window.closeAILetterModal = function() {
    if (letterOutputModal) letterOutputModal.classList.remove('open');
  };
}

// 4. استوديو صور الهوية الجزائرية 35×45 مم
function initIDPhotoUI() {
  const singleCanvas = document.getElementById('idPhotoSingleCanvas');
  const sheetCanvas = document.getElementById('idPhotoSheetCanvas');
  if (!singleCanvas || !sheetCanvas) return;

  const demoImg = new Image();
  demoImg.src = sahlaIDPhoto.demoImageSrc;
  demoImg.onload = () => {
    sahlaIDPhoto.sourceImage = demoImg;
    renderAllPhotos();
  };

  function renderAllPhotos() {
    sahlaIDPhoto.drawSinglePhoto(singleCanvas, sahlaIDPhoto.sourceImage, sahlaIDPhoto.bgColor, sahlaIDPhoto.zoom, sahlaIDPhoto.panX, sahlaIDPhoto.panY);
    sahlaIDPhoto.renderPrintSheet(sheetCanvas, singleCanvas, sahlaIDPhoto.sheetFormat);
  }

  // رفع صورة جديدة من جهاز صاحب المحل أو كاميرا الهاتف
  const uploadInput = document.getElementById('photoFileInput');
  if (uploadInput) {
    uploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const img = new Image();
        img.onload = () => {
          sahlaIDPhoto.sourceImage = img;
          sahlaIDPhoto.zoom = 1;
          sahlaIDPhoto.panX = 0;
          sahlaIDPhoto.panY = 0;
          renderAllPhotos();
          showToast('تم تحميل الصورة بنجاح! تم تطبيق مقاس 35×45 مم وعلامات التقطيع.');
        };
        img.src = evt.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // تغيير الخلفية (أبيض / رمادي بيومتري رسمي)
  document.querySelectorAll('[data-bg-color]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-bg-color]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      sahlaIDPhoto.bgColor = btn.getAttribute('data-bg-color');
      renderAllPhotos();
    });
  });

  // تغيير مصفوفة الطباعة (4 أو 8 صور على 10×15 سم)
  document.querySelectorAll('[data-photo-grid]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-photo-grid]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      sahlaIDPhoto.sheetFormat = btn.getAttribute('data-photo-grid');
      renderAllPhotos();
    });
  });

  // تحكم التكبير (Zoom)
  const zoomSlider = document.getElementById('photoZoomSlider');
  if (zoomSlider) {
    zoomSlider.addEventListener('input', (e) => {
      sahlaIDPhoto.zoom = parseFloat(e.target.value);
      renderAllPhotos();
    });
  }

  // طباعة الصور (مجانية دائماً طبقاً لـ PRD)
  const printPhotoBtn = document.getElementById('btnPrintPhotos');
  if (printPhotoBtn) {
    printPhotoBtn.addEventListener('click', () => {
      showToast('خدمة تجهيز صور الهوية مجانية دائماً في سهلة! جاري إرسال مصفوفة الطباعة للطابعة...');
      document.body.classList.add('print-format-10x15');
      setTimeout(() => {
        window.print();
        document.body.classList.remove('print-format-10x15');
      }, 300);
    });
  }
}

// 5. محرك الفواتير التجارية الرسمية (Invoice UI)
function initInvoiceUI() {
  const invoicePreview = document.getElementById('invoicePreviewContainer');
  let currentItems = [...sahlaInvoice.items];
  let currentSeller = { ...sahlaInvoice.defaultSeller };
  let currentCustomer = { ...sahlaInvoice.defaultCustomer };
  let currentMeta = { ...sahlaInvoice.invoiceMeta };

  function updateInvoice() {
    if (!invoicePreview) return;
    invoicePreview.innerHTML = sahlaInvoice.renderInvoiceHTML(currentSeller, currentCustomer, currentItems, currentMeta);
  }

  updateInvoice();

  // إضافة بند جديد
  const addItemBtn = document.getElementById('btnAddInvoiceItem');
  if (addItemBtn) {
    addItemBtn.addEventListener('click', () => {
      const descInput = document.getElementById('itemDescInput');
      const qtyInput = document.getElementById('itemQtyInput');
      const priceInput = document.getElementById('itemPriceInput');
      const tvaSelect = document.getElementById('itemTvaSelect');

      if (!descInput.value || !qtyInput.value || !priceInput.value) {
        return showToast('يرجى ملء جميع حقول البند', 'error');
      }

      currentItems.push({
        id: Date.now(),
        desc: descInput.value,
        qty: parseInt(qtyInput.value, 10),
        priceHT: parseFloat(priceInput.value),
        tva: parseInt(tvaSelect.value, 10)
      });

      descInput.value = '';
      qtyInput.value = '1';
      priceInput.value = '';
      updateInvoice();
      showToast('تمت إضافة البند وإعادة حساب الرسم والطابع والتفقيط آلياً.');
    });
  }

  // طباعة الفاتورة (خصم 10 نقاط)
  const printInvoiceBtn = document.getElementById('btnPrintInvoice');
  if (printInvoiceBtn) {
    printInvoiceBtn.addEventListener('click', () => {
      const deduction = sahlaWallet.deductPoints('INVOICE_OFFICIAL', SERVICE_RATES.INVOICE_OFFICIAL.points, `إصدار وطباعة فاتورة رسمية رقم: ${currentMeta.number}`);
      if (!deduction.success) return showToast(deduction.error, 'error');

      showToast(`تم خصم ${SERVICE_RATES.INVOICE_OFFICIAL.points} نقاط. جاري فتح الطباعة A4 بالمواصفات الجبائية...`);
      setTimeout(() => window.print(), 300);
    });
  }
}

// 6. الاستمارات والطلبات الإدارية (Admin Letters UI)
function initAdminLettersUI() {
  const container = document.getElementById('lettersListContainer');
  const letterModal = document.getElementById('letterDetailModal');
  const letterBodyText = document.getElementById('modalLetterBody');
  const letterTitleText = document.getElementById('modalLetterTitle');
  if (!container) return;

  container.innerHTML = ADMIN_LETTERS_TEMPLATES.map(tmpl => `
    <div class="service-card" style="border-right: 4px solid var(--gold);">
      <div class="service-card-top">
        <span class="service-price-tag tag-paid">5 نقاط</span>
      </div>
      <h3>${tmpl.title}</h3>
      <p>صيغة نموذجية رسمية جاهزة للطباعة مع الحقول الإلزامية للإدارات والمؤسسات الجزائرية.</p>
      <button class="btn-secondary" style="margin-top:auto;" onclick="openLetterTemplate('${tmpl.id}')">
        <span>معاينة وتخصيص الطلب ✍️</span>
      </button>
    </div>
  `).join('');

  window.openLetterTemplate = function(id) {
    const t = ADMIN_LETTERS_TEMPLATES.find(item => item.id === id);
    if (!t || !letterModal) return;
    letterTitleText.textContent = t.title;
    letterBodyText.value = `${t.target}\nالموضوع: ${t.subject}\n\n${t.body}`;
    letterModal.classList.add('open');
  };

  window.closeLetterModal = function() {
    if (letterModal) letterModal.classList.remove('open');
  };

  const printLetterBtn = document.getElementById('btnPrintLetterNow');
  if (printLetterBtn) {
    printLetterBtn.addEventListener('click', () => {
      const deduction = sahlaWallet.deductPoints('ADMIN_LETTER', SERVICE_RATES.ADMIN_LETTER.points, 'طباعة طلب خطي إداري');
      if (!deduction.success) return showToast(deduction.error, 'error');

      showToast('تم خصم 5 نقاط. جاري طباعة الطلب الخطي...');
      closeLetterModal();
      setTimeout(() => window.print(), 300);
    });
  }
}

// 7. دليل الإجراءات الرسمية (Procedures Guide UI - Free)
function initProceduresGuideUI() {
  const container = document.getElementById('proceduresGuideContainer');
  if (!container) return;

  container.innerHTML = ALGERIAN_PROCEDURES_GUIDE.map(g => `
    <div class="workspace-wrapper" style="margin-bottom: 20px;">
      <div class="workspace-head" style="margin-bottom: 12px; padding-bottom: 10px;">
        <div class="workspace-title-box">
          <h3 style="color:var(--primary-light);">📑 ${g.title}</h3>
          <p>جهة الإيداع: ${g.entity} • الرسوم: <strong style="color:#fbbf24;">${g.cost}</strong> • مدة الصلاحية: ${g.validity}</p>
        </div>
        <span class="nav-badge-free">مجاني دائم</span>
      </div>
      <h4 style="font-size:13px; font-weight:700; margin-bottom:8px; color:var(--text-muted);">الملف والوثائق المطلوبة:</h4>
      <ul style="list-style: none; font-size: 13px; line-height: 1.8; padding-right: 12px;">
        ${g.docs.map(d => `<li>✓ ${d}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

// 8. لوحة الإدارة وتوليد البطاقات (Admin UI)
function initAdminUI() {
  const kpiTotalRevenue = document.getElementById('kpiTotalRevenue');
  const kpiCardsCount = document.getElementById('kpiCardsCount');
  const kpiRedeemedCount = document.getElementById('kpiRedeemedCount');
  const kpiMargin = document.getElementById('kpiMargin');

  function updateKPIs() {
    const stats = sahlaAdmin.calculateKPIs();
    if (kpiTotalRevenue) kpiTotalRevenue.textContent = `${stats.totalRevenueDZD.toLocaleString()} دج`;
    if (kpiCardsCount) kpiCardsCount.textContent = stats.totalCardsCreated;
    if (kpiRedeemedCount) kpiRedeemedCount.textContent = stats.cardsRedeemed;
    if (kpiMargin) kpiMargin.textContent = `${stats.grossMarginPercent}%`;
  }

  updateKPIs();

  // توليد دفعة بطاقات جديدة
  const btnGenBatch = document.getElementById('btnGenerateCardBatch');
  if (btnGenBatch) {
    btnGenBatch.addEventListener('click', () => {
      const count = document.getElementById('batchCountSelect').value;
      const points = document.getElementById('batchPointsSelect').value;
      const price = points === '100' ? 1000 : (points === '300' ? 2500 : 7000);

      const res = sahlaAdmin.generateBatch(parseInt(count, 10), parseInt(points, 10), price);
      showToast(`تم بنجاح توليد دفعة من ${res.count} بطاقة شحن بقيمة ${points} نقطة (${res.batchId})!`);
      updateKPIs();
      renderCardsList();
    });
  }

  function renderCardsList() {
    const listEl = document.getElementById('adminCardsList');
    if (!listEl) return;
    const cards = sahlaAdmin.getAllCards();
    listEl.innerHTML = cards.slice(0, 12).map(c => `
      <div class="scratch-card-item">
        <div style="display:flex; justify-content:space-between;">
          <span class="scratch-badge">${c.points} نقطة</span>
          <span style="font-size:11px; color:${c.status === 'REDEEMED' ? '#ef4444' : '#10b981'}; font-weight:700;">
            ${c.status === 'REDEEMED' ? 'تم الشحن' : 'جاهزة للشحن'}
          </span>
        </div>
        <div class="scratch-secret-box">${c.pin}</div>
        <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted);">
          <span>س.ن: ${c.serial}</span>
          <span>السعر: ${c.priceDZD} دج</span>
        </div>
      </div>
    `).join('');
  }

  renderCardsList();
}

// 9. جسر الطباعة الهاتف-للحاسوب (Phone-to-PC Print Bridge UI)
function initPrintBridgeUI() {
  const pinDisplay = document.getElementById('bridgePinDisplay');
  const bridgeModal = document.getElementById('printBridgeModal');

  if (pinDisplay) pinDisplay.textContent = sahlaBridge.sessionPin;

  window.openPrintBridge = function() {
    if (bridgeModal) bridgeModal.classList.add('open');
  };
  window.closePrintBridge = function() {
    if (bridgeModal) bridgeModal.classList.remove('open');
  };

  // استقبال وثيقة قادمة من الهاتف
  window.addEventListener('sahla:doc-received', (e) => {
    const doc = e.detail;
    showToast(`🖨️ تم استلام وثيقة من هاتف الكاونتر: "${doc.title}". جاري تجهيز الطباعة فوراً!`);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <title>${doc.title}</title>
          <link rel="stylesheet" href="/styles/main.css">
          <link rel="stylesheet" href="/styles/print.css">
        </head>
        <body onload="window.print(); window.close();">
          ${doc.html}
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  });
}

// 10. تبديل السمة (Dark / Light Mode)
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    toggleBtn.textContent = next === 'dark' ? '🌙' : '☀️';
    showToast(`تم التبديل إلى المظهر ${next === 'dark' ? 'الليلي' : 'النهاري'}`);
  });
}

// 11. قسم الخدمات المدرسية والبحوث والامتحانات (School & Academic UI)
function initSchoolUI() {
  const topicSelect = document.getElementById('researchTopicSelect');
  const titleInput = document.getElementById('researchTitleInput');
  const levelInput = document.getElementById('researchLevelInput');
  const studentInput = document.getElementById('researchStudentInput');
  const schoolInput = document.getElementById('researchSchoolInput');
  const teacherInput = document.getElementById('researchTeacherInput');
  const wilayaSelect = document.getElementById('researchWilayaInput');
  const previewPane = document.getElementById('researchPreviewPane');
  const btnRegenPlan = document.getElementById('btnRegeneratePlanAI');

  const btnToggleMode = document.getElementById('btnToggleSchoolMode');
  const schoolModeLabel = document.getElementById('schoolModeLabel');
  const printSchoolBtnText = document.getElementById('printSchoolBtnText');
  const researchPanel = document.getElementById('schoolResearchPanel');
  const examsPanel = document.getElementById('schoolExamsPanel');

  const examSelect = document.getElementById('examSelectInput');
  const examPreviewPane = document.getElementById('examPreviewPane');
  const btnExamModeQuestions = document.getElementById('btnExamModeQuestions');
  const btnExamModeSolution = document.getElementById('btnExamModeSolution');
  const examFilterBtns = document.querySelectorAll('[data-exam-filter]');

  const btnPrintDoc = document.getElementById('btnPrintSchoolDoc');
  const btnBridgeDoc = document.getElementById('btnBridgeSchoolDoc');

  let currentMode = 'RESEARCH'; // 'RESEARCH' or 'EXAMS'
  let examViewMode = 'questions'; // 'questions' or 'solutions'
  let activeExamFilter = 'ALL';

  if (!topicSelect || !previewPane) return;

  // populate topics
  RESEARCH_TOPICS_DATABASE.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = `${t.title} (${t.subjectCategory})`;
    topicSelect.appendChild(opt);
  });

  // populate wilayas
  if (wilayaSelect && typeof ALGERIAN_WILAYAS !== 'undefined') {
    ALGERIAN_WILAYAS.forEach(w => {
      const opt = document.createElement('option');
      opt.value = w.name;
      opt.textContent = `${w.code} - ${w.name}`;
      if (w.code === '16') opt.selected = true;
      wilayaSelect.appendChild(opt);
    });
  }

  let currentTopicData = JSON.parse(JSON.stringify(RESEARCH_TOPICS_DATABASE[0]));

  function renderResearch() {
    const data = {
      title: titleInput ? titleInput.value : currentTopicData.title,
      subjectCategory: currentTopicData.subjectCategory,
      level: levelInput ? levelInput.value : currentTopicData.level,
      language: currentTopicData.language || 'ar',
      studentName: studentInput ? studentInput.value : 'محمد أمين رحماني',
      schoolName: schoolInput ? schoolInput.value : 'ثانوية العقيد لطفي',
      teacherName: teacherInput ? teacherInput.value : 'أ. بلقاسم مزيان',
      wilaya: wilayaSelect ? wilayaSelect.value : 'الجزائر العاصمة',
      className: levelInput ? levelInput.value : 'السنة الثالثة ثانوي',
      plan: currentTopicData.plan,
      summaryContent: currentTopicData.summaryContent
    };
    previewPane.innerHTML = sahlaSchool.renderResearchHTML(data);
  }

  topicSelect.addEventListener('change', () => {
    const found = RESEARCH_TOPICS_DATABASE.find(t => t.id === topicSelect.value);
    if (found) {
      currentTopicData = JSON.parse(JSON.stringify(found));
      if (titleInput) titleInput.value = found.title;
      if (levelInput) levelInput.value = found.level;
      renderResearch();
    }
  });

  [titleInput, levelInput, studentInput, schoolInput, teacherInput, wilayaSelect].forEach(el => {
    if (el) el.addEventListener('input', renderResearch);
  });

  if (btnRegenPlan) {
    btnRegenPlan.addEventListener('click', () => {
      const extraAxes = [
        'المحور المستحدث: الأبعاد الاقتصادية والاجتماعية والتنموية للبحث',
        'دراسة مقارنة: النماذج الإقليمية والدولية المشابهة والدروس المستفادة'
      ];
      extraAxes.forEach(ax => {
        if (!currentTopicData.plan.includes(ax)) {
          currentTopicData.plan.splice(currentTopicData.plan.length - 2, 0, ax);
        }
      });
      renderResearch();
      showToast('✨ تم توليد وتوسيع خطة البحث بالذكاء الاصطناعي بنجاح!');
    });
  }

  // Toggle Mode (Research vs Exams)
  if (btnToggleMode) {
    btnToggleMode.addEventListener('click', () => {
      if (currentMode === 'RESEARCH') {
        currentMode = 'EXAMS';
        researchPanel.style.display = 'none';
        examsPanel.style.display = 'block';
        schoolModeLabel.textContent = '📖 الانتقال لمولد البحوث المدرسية (AI)';
        printSchoolBtnText.textContent = '🖨️ طباعة موضوع / حل الامتحان (مجاني)';
        renderExamsList();
      } else {
        currentMode = 'RESEARCH';
        researchPanel.style.display = 'block';
        examsPanel.style.display = 'none';
        schoolModeLabel.textContent = '📝 الانتقال لبنك الامتحانات (BEM / BAC)';
        printSchoolBtnText.textContent = '🖨️ طباعة البحث A4 (10 نقاط)';
        renderResearch();
      }
    });
  }

  // Exams logic
  function renderExamsList() {
    if (!examSelect) return;
    examSelect.innerHTML = '';
    const filtered = SCHOOL_EXAMS_DATABASE.filter(ex => {
      if (activeExamFilter === 'ALL') return true;
      return ex.level === activeExamFilter;
    });

    filtered.forEach(ex => {
      const opt = document.createElement('option');
      opt.value = ex.id;
      opt.textContent = `[${ex.level} ${ex.year}] ${ex.subject} (${ex.title})`;
      examSelect.appendChild(opt);
    });

    renderCurrentExam();
  }

  function renderCurrentExam() {
    if (!examSelect || !examPreviewPane) return;
    const exam = SCHOOL_EXAMS_DATABASE.find(e => e.id === examSelect.value) || SCHOOL_EXAMS_DATABASE[0];
    if (exam) {
      examPreviewPane.innerHTML = sahlaSchool.renderExamHTML(exam, examViewMode);
    }
  }

  if (examSelect) {
    examSelect.addEventListener('change', renderCurrentExam);
  }

  examFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      examFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeExamFilter = btn.getAttribute('data-exam-filter');
      renderExamsList();
    });
  });

  if (btnExamModeQuestions) {
    btnExamModeQuestions.addEventListener('click', () => {
      btnExamModeQuestions.classList.add('active');
      if (btnExamModeSolution) btnExamModeSolution.classList.remove('active');
      examViewMode = 'questions';
      renderCurrentExam();
    });
  }

  if (btnExamModeSolution) {
    btnExamModeSolution.addEventListener('click', () => {
      btnExamModeSolution.classList.add('active');
      if (btnExamModeQuestions) btnExamModeQuestions.classList.remove('active');
      examViewMode = 'solutions';
      renderCurrentExam();
    });
  }

  // Print Action
  if (btnPrintDoc) {
    btnPrintDoc.addEventListener('click', () => {
      if (currentMode === 'RESEARCH') {
        const cost = (typeof SERVICE_RATES !== 'undefined' && SERVICE_RATES.AI_RESEARCH) ? SERVICE_RATES.AI_RESEARCH.points : 10;
        const deduction = sahlaWallet.deductPoints('AI_RESEARCH', cost, `طباعة بحث دراسي: ${titleInput ? titleInput.value : 'بحث مدرسي'}`);
        if (!deduction.success) {
          showToast(deduction.error, 'error');
          openWalletModal();
          return;
        }
        showToast(`✓ تم خصم ${cost} نقاط وطباعة البحث المدرسي بنجاح!`);
        window.print();
      } else {
        // Free exams!
        showToast('✓ طباعة ورقة الامتحان الرسمي (مجاني دائم)');
        window.print();
      }
    });
  }

  // Bridge Action
  if (btnBridgeDoc) {
    btnBridgeDoc.addEventListener('click', () => {
      const activeHtml = currentMode === 'RESEARCH' ? previewPane.innerHTML : examPreviewPane.innerHTML;
      const title = currentMode === 'RESEARCH' ? (titleInput ? titleInput.value : 'بحث مدرسي') : 'ورقة امتحان رسمي';
      sahlaBridge.sendDocument(title, activeHtml);
      showToast('📲 تم إرسال الوثيقة عبر جسر الطباعة إلى طابعة المحل!');
    });
  }

  // Initial render
  renderResearch();
}

// 12. قسم ملء الاستمارات الرسمية بالـ OCR (Official Forms & OCR UI)
function initOCRFormsUI() {
  const formSelect = document.getElementById('officialFormSelect');
  const fieldsContainer = document.getElementById('dynamicFormFieldsContainer');
  const previewPane = document.getElementById('ocrFormPreviewPane');
  const btnOCR = document.getElementById('btnSimulateOCR');
  const fileInput = document.getElementById('ocrFileInput');
  const statusBadge = document.getElementById('ocrStatusBadge');
  const btnPrint = document.getElementById('btnPrintOCRForm');
  const btnBridge = document.getElementById('btnBridgeOCRForm');

  if (!formSelect || !previewPane) return;

  // populate form options
  OFFICIAL_FORMS_TEMPLATES.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.id;
    opt.textContent = `${f.name} — ${f.ministry}`;
    formSelect.appendChild(opt);
  });

  function renderFormFields() {
    if (!fieldsContainer) return;
    fieldsContainer.innerHTML = '';
    const form = sahlaFormFiller.selectedForm;

    form.fields.forEach(field => {
      const group = document.createElement('div');
      group.className = 'form-group';

      const label = document.createElement('label');
      label.textContent = field.label;
      group.appendChild(label);

      let inputEl;
      if (field.type === 'select' && field.options) {
        inputEl = document.createElement('select');
        inputEl.className = 'form-select';
        field.options.forEach(op => {
          const o = document.createElement('option');
          o.value = op;
          o.textContent = op;
          if (sahlaFormFiller.formData[field.key] === op) o.selected = true;
          inputEl.appendChild(o);
        });
      } else {
        inputEl = document.createElement('input');
        inputEl.type = field.type || 'text';
        inputEl.className = 'form-input';
        inputEl.value = sahlaFormFiller.formData[field.key] || '';
      }

      inputEl.dataset.fieldKey = field.key;
      inputEl.addEventListener('input', (e) => {
        sahlaFormFiller.formData[field.key] = e.target.value;
        renderPreview();
      });
      inputEl.addEventListener('change', (e) => {
        sahlaFormFiller.formData[field.key] = e.target.value;
        renderPreview();
      });

      group.appendChild(inputEl);
      fieldsContainer.appendChild(group);
    });
  }

  function renderPreview() {
    previewPane.innerHTML = sahlaFormFiller.renderOfficialFormHTML();
  }

  formSelect.addEventListener('change', () => {
    sahlaFormFiller.setForm(formSelect.value);
    renderFormFields();
    renderPreview();
  });

  // OCR Extraction simulation
  function triggerOCR() {
    if (statusBadge) {
      statusBadge.textContent = '⏳ جاري المسح والتعرف الضوئي (OCR)...';
      statusBadge.style.color = '#fbbf24';
      statusBadge.style.borderColor = '#fbbf24';
    }

    setTimeout(() => {
      const res = sahlaFormFiller.simulateOCRExtraction();
      renderFormFields();
      renderPreview();
      if (statusBadge) {
        statusBadge.textContent = `✓ تم استخراج ${res.extractedFieldsCount} حقلاً بنجاح (${res.confidenceScore})`;
        statusBadge.style.color = '#10b981';
        statusBadge.style.borderColor = '#10b981';
      }
      showToast(`⚡ تم استخراج بيانات الهوية البيومترية بنجاح بنسبة دقة ${res.confidenceScore}!`);
    }, 500);
  }

  if (btnOCR) btnOCR.addEventListener('click', triggerOCR);
  if (fileInput) fileInput.addEventListener('change', triggerOCR);

  // Print Action
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      const cost = (typeof SERVICE_RATES !== 'undefined' && SERVICE_RATES.OCR_FORM_FILLER) ? SERVICE_RATES.OCR_FORM_FILLER.points : 10;
      const deduction = sahlaWallet.deductPoints('OCR_FORM_FILLER', cost, `ملء استمارة رسمية بالـ OCR: ${sahlaFormFiller.selectedForm.name}`);
      if (!deduction.success) {
        showToast(deduction.error, 'error');
        openWalletModal();
        return;
      }
      showToast(`✓ تم خصم ${cost} نقاط وطباعة الاستمارة الرسمية بنجاح!`);
      window.print();
    });
  }

  // Bridge Action
  if (btnBridge) {
    btnBridge.addEventListener('click', () => {
      sahlaBridge.sendDocument(sahlaFormFiller.selectedForm.name, sahlaFormFiller.renderOfficialFormHTML());
      showToast('📲 تم إرسال الاستمارة الرسمية لطابعة المحل!');
    });
  }

  // Initial render
  renderFormFields();
  renderPreview();
}

// 13. قسم دفتر الزبائن وسجل الديون والكريدي (Customers & Credit Ledger UI)
function initCustomersUI() {
  const container = document.getElementById('customersCardsContainer');
  const searchInput = document.getElementById('custSearchInput');
  const kpiCount = document.getElementById('kpiCustCount');
  const kpiDebts = document.getElementById('kpiCustOutstanding');
  const kpiRecovery = document.getElementById('kpiCustRecovery');

  const addCustModal = document.getElementById('addCustomerModal');
  const btnOpenAddCust = document.getElementById('btnOpenAddCustomerModal');
  const btnSaveCust = document.getElementById('btnSaveNewCustomer');

  const addTxModal = document.getElementById('addTxModal');
  const txCustomerId = document.getElementById('txCustomerId');
  const txModalCustomerTitle = document.getElementById('txModalCustomerTitle');
  const txTypeSelect = document.getElementById('txTypeSelect');
  const txAmountInput = document.getElementById('txAmountInput');
  const txDescInput = document.getElementById('txDescInput');
  const btnSaveTx = document.getElementById('btnSaveTransaction');

  const statementModal = document.getElementById('custStatementModal');
  const statementCustName = document.getElementById('statementCustName');
  const statementTableBody = document.getElementById('statementTableBody');
  const statementSummaryBalance = document.getElementById('statementSummaryBalance');

  window.openCustomerModal = () => { if (addCustModal) addCustModal.classList.add('open'); };
  window.closeCustomerModal = () => { if (addCustModal) addCustModal.classList.remove('open'); };

  window.openTxModal = (custId, custName) => {
    if (txCustomerId) txCustomerId.value = custId;
    if (txModalCustomerTitle) txModalCustomerTitle.textContent = `تسجيل حركة مالية: ${custName}`;
    if (txAmountInput) txAmountInput.value = '';
    if (txDescInput) txDescInput.value = '';
    if (addTxModal) addTxModal.classList.add('open');
  };
  window.closeTxModal = () => { if (addTxModal) addTxModal.classList.remove('open'); };

  window.openStatementModal = (custId) => {
    const cust = sahlaCustomers.getAll().find(c => c.id === custId);
    if (!cust) return;
    if (statementCustName) statementCustName.textContent = `كشف حساب: ${cust.name}`;
    if (statementTableBody) {
      if (cust.history && cust.history.length > 0) {
        statementTableBody.innerHTML = cust.history.map(h => `
          <tr style="border-bottom:1px solid var(--border-color);">
            <td style="padding:8px 10px; font-family:monospace;">${h.date}</td>
            <td style="padding:8px 10px;">
              <span class="debt-badge ${h.type === 'CHARGE' ? 'debt-badge-danger' : 'debt-badge-success'}">
                ${h.type === 'CHARGE' ? '🔴 كريدي (+)' : '🟢 تسديد (-)'}
              </span>
            </td>
            <td style="padding:8px 10px;">${h.desc}</td>
            <td style="padding:8px 10px; font-weight:800; text-align:left;">${h.amount.toLocaleString()} دج</td>
          </tr>
        `).join('');
      } else {
        statementTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:16px; color:var(--text-muted);">لا توجد حركات مسجلة حتى الآن</td></tr>`;
      }
    }
    const balance = Math.max(0, cust.totalDebts - cust.totalPaid);
    if (statementSummaryBalance) {
      statementSummaryBalance.innerHTML = `الرصيد المتبقي المستحق: <strong style="color:${balance > 0 ? '#ef4444' : '#10b981'}; font-size:16px;">${balance.toLocaleString()} دج</strong>`;
    }
    if (statementModal) statementModal.classList.add('open');
  };
  window.closeStatementModal = () => { if (statementModal) statementModal.classList.remove('open'); };

  function renderCustomers(filterText = '') {
    const list = sahlaCustomers.getAll();
    const totals = sahlaCustomers.getTotals();

    if (kpiCount) kpiCount.textContent = totals.activeCount;
    if (kpiDebts) kpiDebts.textContent = `${totals.totalOutstandingDZD.toLocaleString()} دج`;

    const totalPaid = list.reduce((sum, c) => sum + (c.totalPaid || 0), 0);
    const totalCharged = list.reduce((sum, c) => sum + (c.totalDebts || 0), 0);
    const recoveryRate = totalCharged > 0 ? Math.round((totalPaid / totalCharged) * 100) : 100;
    if (kpiRecovery) kpiRecovery.textContent = `${recoveryRate}%`;

    if (!container) return;
    const query = filterText.toLowerCase().trim();
    const filtered = list.filter(c => {
      if (!query) return true;
      return (c.name && c.name.toLowerCase().includes(query)) ||
             (c.phone && c.phone.includes(query)) ||
             (c.address && c.address.toLowerCase().includes(query)) ||
             (c.nif && c.nif.includes(query));
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted); background:var(--bg-card); border-radius:var(--radius-md);">
          لا يوجد زبائن يطابقون البحث. انقر على "إضافة زبون جديد" لتسجيل زبون.
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(c => {
      const remainingDebt = Math.max(0, c.totalDebts - c.totalPaid);
      const isSettled = remainingDebt === 0;

      return `
        <div class="customer-debt-card">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
            <div>
              <h4 style="font-size:16px; font-weight:800; color:var(--text-main); margin-bottom:4px;">${c.name}</h4>
              <div style="display:flex; gap:10px; font-size:12px; color:var(--text-muted); flex-wrap:wrap;">
                <span>📞 <a href="tel:${c.phone}" style="color:var(--primary); font-weight:700;">${c.phone}</a></span>
                ${c.nif ? `<span>NIF: <strong style="font-family:monospace;">${c.nif}</strong></span>` : ''}
              </div>
            </div>
            <span class="debt-badge ${isSettled ? 'debt-badge-success' : 'debt-badge-danger'}">
              ${isSettled ? '✓ الحساب خالص' : `كريدي: ${remainingDebt.toLocaleString()} دج`}
            </span>
          </div>

          <div style="font-size:12px; color:var(--text-muted); line-height:1.5;">
            <div>📍 ${c.address || 'العنوان غير محدد'}</div>
            ${c.notes ? `<div style="margin-top:4px;">📝 ${c.notes}</div>` : ''}
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-color); padding-top:12px; margin-top:4px; font-size:12px;">
            <div style="color:var(--text-muted);">
              إجمالي المعاملات: <strong>${c.totalDebts.toLocaleString()} دج</strong>
            </div>
            <div style="display:flex; gap:8px;">
              <button class="btn-secondary" style="padding:6px 10px; font-size:11px;" onclick="openStatementModal('${c.id}')">
                <span>📜 كشف العمليات</span>
              </button>
              <button class="btn-primary" style="padding:6px 10px; font-size:11px;" onclick="openTxModal('${c.id}', '${c.name.replace(/'/g, "\\'")}')">
                <span>➕ تسجيل حركة</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => renderCustomers(e.target.value));
  }

  if (btnOpenAddCust) {
    btnOpenAddCust.addEventListener('click', openCustomerModal);
  }

  if (btnSaveCust) {
    btnSaveCust.addEventListener('click', () => {
      const name = document.getElementById('newCustName').value.trim();
      const phone = document.getElementById('newCustPhone').value.trim();
      const nif = document.getElementById('newCustNif').value.trim();
      const address = document.getElementById('newCustAddress').value.trim();
      const initialDebt = parseFloat(document.getElementById('newCustInitialDebt').value) || 0;
      const notes = document.getElementById('newCustNotes').value.trim();

      if (!name) {
        showToast('يرجى إدخال اسم الزبون أو المؤسسة', 'error');
        return;
      }

      sahlaCustomers.addCustomer(name, phone, address, nif, initialDebt, notes);
      closeCustomerModal();
      document.getElementById('newCustName').value = '';
      document.getElementById('newCustPhone').value = '';
      document.getElementById('newCustNif').value = '';
      document.getElementById('newCustAddress').value = '';
      document.getElementById('newCustInitialDebt').value = '0';
      document.getElementById('newCustNotes').value = '';

      renderCustomers(searchInput ? searchInput.value : '');
      showToast(`✓ تم تسجيل الزبون "${name}" في دفتر المحل بنجاح!`);
    });
  }

  if (btnSaveTx) {
    btnSaveTx.addEventListener('click', () => {
      const custId = txCustomerId.value;
      const type = txTypeSelect.value;
      const amount = parseFloat(txAmountInput.value) || 0;
      const desc = txDescInput.value.trim() || (type === 'CHARGE' ? 'خدمة طباعة/وثائق' : 'تسديد نقدي');

      if (amount <= 0) {
        showToast('يرجى إدخال مبلغ صحيح أكبر من الصفر', 'error');
        return;
      }

      sahlaCustomers.addTransaction(custId, type, amount, desc);
      closeTxModal();
      renderCustomers(searchInput ? searchInput.value : '');
      showToast(`✓ تم تسجيل ${type === 'CHARGE' ? 'الكريدي' : 'الدفعة'} بمبلغ ${amount.toLocaleString()} دج بنجاح!`);
    });
  }

  window.addEventListener('sahla:customers-updated', () => {
    renderCustomers(searchInput ? searchInput.value : '');
  });

  // Initial render
  renderCustomers();
}

// 14. قسم التصاريح الجبائية الرسمية (Tax Declarations UI - G50 / G12)
function initTaxUI() {
  const btnToggleMode = document.getElementById('btnToggleTaxMode');
  const taxModeLabel = document.getElementById('taxModeLabel');
  const printTaxBtnText = document.getElementById('printTaxBtnText');
  const g50Panel = document.getElementById('taxG50InputsPanel');
  const g12Panel = document.getElementById('taxG12InputsPanel');
  const previewContainer = document.getElementById('taxPreviewContainer');
  const btnPrint = document.getElementById('btnPrintTax');
  const btnBridge = document.getElementById('btnBridgeTax');

  let activeMode = 'G50'; // 'G50' or 'G12'

  if (!previewContainer) return;

  function renderTaxPreview() {
    if (activeMode === 'G50') {
      const g50Data = {
        companyName: document.getElementById('taxG50Company').value,
        nif: document.getElementById('taxG50Nif').value,
        article: document.getElementById('taxG50Article').value,
        recette: document.getElementById('taxG50Recette').value,
        inspection: document.getElementById('taxG50Inspection').value,
        periodValue: document.getElementById('taxG50Period').value,
        periodMonthYear: '09/2026',
        directionWilaya: 'Direction des Impôts de la Wilaya d’Alger',
        activity: 'خدمات إعلام آلي، طباعة، وتوريدات مكتبية',
        address: '42 شارع حسيبة بن بوعلي، الجزائر',
        nis: '001916010023456',
        regime: 'Régime Réel',
        caTva9: parseFloat(document.getElementById('taxG50Ca9').value) || 0,
        caTva19: parseFloat(document.getElementById('taxG50Ca19').value) || 0,
        caExonere: 0,
        deductionsAchats: parseFloat(document.getElementById('taxG50Deductions').value) || 0,
        precompteAnterieur: parseFloat(document.getElementById('taxG50Precompte').value) || 0,
        tapRate: 0,
        caTap: 0,
        masseSalariale: 480000,
        irgSalairesRetenue: parseFloat(document.getElementById('taxG50Irg').value) || 0,
        loyersMontant: 80000,
        loyersRetenue: parseFloat(document.getElementById('taxG50Loyers').value) || 0,
        caEspeces: parseFloat(document.getElementById('taxG50TimbreCa').value) || 0,
        droitsTimbre: Math.round((parseFloat(document.getElementById('taxG50TimbreCa').value) || 0) * 0.01)
      };
      previewContainer.innerHTML = sahlaTax.renderG50HTML(g50Data);
    } else {
      const g12Data = {
        artisanName: document.getElementById('taxG12Name').value,
        nif: document.getElementById('taxG12Nif').value,
        article: document.getElementById('taxG12Article').value,
        wilaya: document.getElementById('taxG12Wilaya').value,
        inspection: document.getElementById('taxG12Wilaya').value,
        recette: 'قباضة الضرائب المختصة',
        taxYear: document.getElementById('taxG12Year').value,
        activity: 'بيع الكتب والأدوات المكتبية والخدمات الرقمية',
        address: 'حي الصديقية، وهران',
        rc: '31/00-1122334A20',
        paymentMode: document.getElementById('taxG12PaymentMode').value,
        caCommercial: parseFloat(document.getElementById('taxG12CaComm').value) || 0,
        caServices: parseFloat(document.getElementById('taxG12CaServ').value) || 0
      };
      previewContainer.innerHTML = sahlaTax.renderG12HTML(g12Data);
    }
  }

  // Toggle between G50 and G12
  if (btnToggleMode) {
    btnToggleMode.addEventListener('click', () => {
      if (activeMode === 'G50') {
        activeMode = 'G12';
        g50Panel.style.display = 'none';
        g12Panel.style.display = 'block';
        taxModeLabel.textContent = '🏛️ الانتقال للتصريح الشهري بالضرائب (Série G N° 50)';
        printTaxBtnText.textContent = '🖨️ طباعة تصريح IFU G12 (20 نقطة)';
      } else {
        activeMode = 'G50';
        g50Panel.style.display = 'block';
        g12Panel.style.display = 'none';
        taxModeLabel.textContent = '📋 الانتقال لتصريح الضريبة الجزافية الوحيدة (IFU G12)';
        printTaxBtnText.textContent = '🖨️ طباعة التصريح الجبائي G50 (20 نقطة)';
      }
      renderTaxPreview();
    });
  }

  // Listeners on inputs
  const g50InputIds = ['taxG50Company', 'taxG50Nif', 'taxG50Article', 'taxG50Recette', 'taxG50Inspection', 'taxG50Period', 'taxG50Ca9', 'taxG50Ca19', 'taxG50Deductions', 'taxG50Precompte', 'taxG50Irg', 'taxG50TimbreCa', 'taxG50Loyers'];
  g50InputIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', renderTaxPreview);
  });

  const g12InputIds = ['taxG12Name', 'taxG12Nif', 'taxG12Article', 'taxG12Wilaya', 'taxG12Year', 'taxG12PaymentMode', 'taxG12CaComm', 'taxG12CaServ'];
  g12InputIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', renderTaxPreview);
      el.addEventListener('change', renderTaxPreview);
    }
  });

  // Print Action
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      const serviceCode = activeMode === 'G50' ? 'TAX_G50' : 'TAX_G12';
      const cost = 20;
      const desc = activeMode === 'G50' ? 'طباعة التصريح الجبائي الرسمي Série G N° 50' : 'طباعة تصريح الضريبة الجزافية الوحيدة IFU G N° 12';

      const deduction = sahlaWallet.deductPoints(serviceCode, cost, desc);
      if (!deduction.success) {
        showToast(deduction.error, 'error');
        openWalletModal();
        return;
      }

      showToast(`✓ تم خصم ${cost} نقطة وطباعة التصريح الجبائي بنجاح!`);
      window.print();
    });
  }

  // Bridge Action
  if (btnBridge) {
    btnBridge.addEventListener('click', () => {
      const title = activeMode === 'G50' ? 'التصريح الجبائي Série G N° 50' : 'تصريح الضريبة الجزافية IFU G12';
      sahlaBridge.sendDocument(title, previewContainer.innerHTML);
      showToast('📲 تم إرسال التصريح الجبائي لطابعة المحل عبر الجسر!');
    });
  }

  // Initial render
  renderTaxPreview();
}

// 15. قسم بوابة الدفع الإلكتروني المباشر (Electronic Payment UI - SATIM / Edahabia / CIB)
function initEpayUI() {
  const packBtns = document.querySelectorAll('.epay-pack-btn');
  const cardNumInput = document.getElementById('epayCardNumber');
  const cardHolderInput = document.getElementById('epayCardHolder');
  const expMonthInput = document.getElementById('epayExpMonth');
  const expYearInput = document.getElementById('epayExpYear');
  const cvv2Input = document.getElementById('epayCvv2');
  const btnSubmit = document.getElementById('btnSubmitEpay');

  const otpBox = document.getElementById('epayOtpBox');
  const otpInput = document.getElementById('epayOtpInput');
  const btnConfirmOtp = document.getElementById('btnConfirmOtp');
  const demoOtpHint = document.getElementById('epayDemoOtpHint');

  const cardPreview = document.getElementById('virtualCardPreview');
  const cardTypeLabel = document.getElementById('vcardTypeLabel');
  const cardNumberDisplay = document.getElementById('vcardNumberDisplay');
  const cardHolderDisplay = document.getElementById('vcardHolderDisplay');
  const cardExpDisplay = document.getElementById('vcardExpDisplay');
  const receiptContainer = document.getElementById('epayReceiptPreviewContainer');
  const btnPrintReceipt = document.getElementById('btnPrintEpayReceipt');

  let selectedPackId = 'pack_300';

  if (!cardNumInput) return;

  // Package selection
  packBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      packBtns.forEach(b => {
        b.classList.remove('active');
        b.style.borderColor = '';
      });
      btn.classList.add('active');
      btn.style.borderColor = '#fbbf24';
      selectedPackId = btn.getAttribute('data-pack-id');
    });
  });

  // Card Number Formatting & live update
  cardNumInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    e.target.value = formatted;

    if (cardNumberDisplay) {
      cardNumberDisplay.textContent = formatted || '•••• •••• •••• ••••';
    }

    // Detect card brand
    const cardInfo = sahlaEpay.detectCardType(val);
    if (cardTypeLabel) cardTypeLabel.textContent = cardInfo.type === 'EDAHABIA' ? 'EDAHABIA' : 'CIB';
    if (cardPreview) {
      if (cardInfo.type === 'EDAHABIA') {
        cardPreview.className = 'virtual-gold-card';
      } else {
        cardPreview.className = 'virtual-gold-card virtual-cib-card';
      }
    }
  });

  cardHolderInput.addEventListener('input', (e) => {
    if (cardHolderDisplay) {
      cardHolderDisplay.textContent = e.target.value.toUpperCase() || 'VOTRE NOM';
    }
  });

  function updateExp() {
    const mm = expMonthInput.value.padStart(2, '0');
    const yy = expYearInput.value;
    if (cardExpDisplay) {
      cardExpDisplay.textContent = `${mm || 'MM'}/${yy || 'YY'}`;
    }
  }
  expMonthInput.addEventListener('input', updateExp);
  expYearInput.addEventListener('input', updateExp);

  // Submit payment & generate OTP
  btnSubmit.addEventListener('click', () => {
    const cardData = {
      cardNumber: cardNumInput.value,
      cardHolder: cardHolderInput.value,
      expMonth: expMonthInput.value,
      expYear: expYearInput.value,
      cvv2: cvv2Input.value
    };

    const res = sahlaEpay.initiatePayment(cardData, selectedPackId);
    if (!res.success) {
      showToast(res.error, 'error');
      return;
    }

    if (otpBox) {
      otpBox.style.display = 'block';
      otpBox.scrollIntoView({ behavior: 'smooth' });
    }
    if (demoOtpHint) {
      demoOtpHint.textContent = `💡 رمز الرسالة القصيرة (OTP) التجريبي للاختبار: ${res.demoOtp}`;
    }
    if (otpInput) {
      otpInput.value = res.demoOtp;
    }

    showToast('📲 تم إرسال كود التحقق OTP إلى رقم الهاتف المسجل!');
  });

  // Confirm OTP
  btnConfirmOtp.addEventListener('click', () => {
    const entered = otpInput ? otpInput.value : '';
    const res = sahlaEpay.confirmPaymentWithOtp(entered);

    if (!res.success) {
      showToast(res.error, 'error');
      return;
    }

    if (otpBox) otpBox.style.display = 'none';
    if (receiptContainer) {
      receiptContainer.style.display = 'block';
      receiptContainer.innerHTML = res.receiptHtml;
    }
    if (btnPrintReceipt) {
      btnPrintReceipt.style.display = 'inline-flex';
    }

    showToast(`✓ تم الدفع بنجاح! أُضيفت ${res.pointsAdded} نقطة إلى رصيدك (الرصيد الجديد: ${res.newBalance} نقطة)`);
  });

  if (btnPrintReceipt) {
    btnPrintReceipt.addEventListener('click', () => {
      window.print();
    });
  }
}

// 16. قسم طباعة وتجهيز بطاقات الشحن المادية للتوزيع (Wholesale Cards Sheet UI)
function initWholesaleUI() {
  const modal = document.getElementById('wholesaleModal');
  const btnOpen = document.getElementById('btnOpenWholesaleSheet');
  const selectPoints = document.getElementById('wholesalePointsSelect');
  const btnRegenerate = document.getElementById('btnRegenerateWholesaleSheet');
  const btnPrintNow = document.getElementById('btnPrintWholesaleSheetNow');
  const container = document.getElementById('wholesaleSheetContainer');

  window.openWholesaleModal = () => {
    if (modal) modal.classList.add('open');
    renderSheet();
  };
  window.closeWholesaleModal = () => {
    if (modal) modal.classList.remove('open');
  };

  if (btnOpen) btnOpen.addEventListener('click', openWholesaleModal);

  let currentBatchData = null;

  function renderSheet() {
    const pts = selectPoints ? selectPoints.value : 300;
    currentBatchData = sahlaCardsWholesale.generateWholesaleBatch(pts, 6);
    if (container) {
      container.innerHTML = sahlaCardsWholesale.renderWholesaleSheetHTML(currentBatchData);
    }
  }

  if (btnRegenerate) {
    btnRegenerate.addEventListener('click', () => {
      renderSheet();
      showToast('✓ تم توليد وتشفير أرقام تسلسلية جديدة للوحة البطاقات!');
    });
  }

  if (selectPoints) {
    selectPoints.addEventListener('change', renderSheet);
  }

  if (btnPrintNow) {
    btnPrintNow.addEventListener('click', () => {
      showToast('🖨️ جاري طباعة لوحة بطاقات التعبئة على ورق A4 مقوى...');
      window.print();
    });
  }
}

// ==========================================
// المرحلة 4: شبكة نقاط البيع POS، المحاسبة، والبوابات الوطنية
// ==========================================

// 17. إدارة شبكة نقاط البيع والأجهزة المرتبطة (Multi-POS UI)
function initPosUI() {
  const grid = document.getElementById('boundDevicesGrid');
  const btnPairModal = document.getElementById('btnOpenPairDeviceModal');
  const pairModal = document.getElementById('pairDeviceModal');
  const pinDisplay = document.getElementById('pairingPinDisplay');
  const btnRefreshPin = document.getElementById('btnRefreshPairingPin');
  const btnSaveDevice = document.getElementById('btnSaveNewDevice');
  const btnSimulateSync = document.getElementById('btnSimulateSyncAction');
  const tickerText = document.getElementById('posSyncTickerText');

  window.openPairDeviceModal = () => {
    if (pairModal) {
      const pinObj = sahlaPosDevices.generatePairingPin();
      if (pinDisplay) pinDisplay.textContent = pinObj.pin.replace(/(\d{3})(\d{3})/, '$1 $2');
      pairModal.classList.add('open');
    }
  };

  window.closePairDeviceModal = () => {
    if (pairModal) pairModal.classList.remove('open');
  };

  if (btnPairModal) btnPairModal.addEventListener('click', openPairDeviceModal);

  if (btnRefreshPin) {
    btnRefreshPin.addEventListener('click', () => {
      const pinObj = sahlaPosDevices.generatePairingPin();
      if (pinDisplay) pinDisplay.textContent = pinObj.pin.replace(/(\d{3})(\d{3})/, '$1 $2');
      showToast('✓ تم توليد رمز اقتران جديد صالح لـ 10 دقائق');
    });
  }

  if (btnSaveDevice) {
    btnSaveDevice.addEventListener('click', () => {
      const name = document.getElementById('newDevName').value;
      const type = document.getElementById('newDevType').value;
      const role = document.getElementById('newDevRole').value;

      if (!name || name.trim() === '') {
        showToast('يرجى كتابة اسم للجهاز أو الكاونتر', 'error');
        return;
      }

      sahlaPosDevices.addDevice({ name, type, role });
      closePairDeviceModal();
      document.getElementById('newDevName').value = '';
      showToast(`✓ تم بنجاح ربط الطرفية "${name}" بشبكة المحل`);
      renderDevices();
    });
  }

  function renderDevices() {
    if (!grid) return;
    const devices = sahlaPosDevices.getDevices();

    grid.innerHTML = devices.map(dev => {
      const isCur = dev.isCurrent;
      const isOnline = dev.status === 'ONLINE';
      const icon = dev.type === 'MOBILE' ? '📱' : (dev.type === 'PRINT_STATION' ? '🖨️' : '🖥️');

      return `
        <div class="device-card ${isCur ? 'is-current' : ''}">
          <div class="device-card-top">
            <div class="device-icon-and-meta">
              <div class="device-icon-box">${icon}</div>
              <div>
                <div class="device-name-title">${dev.name} ${isCur ? '<small style="color:var(--primary); font-size:11px;">(الجهاز الحالي)</small>' : ''}</div>
                <div class="device-ip-badge">IP: ${dev.ipAddress}</div>
              </div>
            </div>
            <span class="device-status-badge ${isOnline ? 'status-online' : 'status-standby'}">
              ${isOnline ? '● متصل نشط' : '○ في الانتظار'}
            </span>
          </div>

          <div class="device-role-tag">
            <span>الدور: <strong>${dev.roleTitle}</strong></span>
            <span style="font-size:10px; color:var(--text-muted);">${dev.lastActive}</span>
          </div>

          <div class="device-permissions-list">
            <span style="font-weight:700; color:var(--text-muted); font-size:11px; margin-bottom:2px;">صلاحيات هذه الطرفية:</span>
            <label class="perm-checkbox-item">
              <input type="checkbox" ${dev.permissions.canGenerateDocs ? 'checked' : ''} ${dev.role === 'OWNER' ? 'disabled' : ''} onchange="sahlaPosDevices.togglePermission('${dev.id}', 'canGenerateDocs')">
              <span>توليد المستندات والوثائق (CV، صور، استمارات)</span>
            </label>
            <label class="perm-checkbox-item">
              <input type="checkbox" ${dev.permissions.canPrint ? 'checked' : ''} ${dev.role === 'OWNER' ? 'disabled' : ''} onchange="sahlaPosDevices.togglePermission('${dev.id}', 'canPrint')">
              <span>إرسال مهام الطباعة الفورية</span>
            </label>
            <label class="perm-checkbox-item">
              <input type="checkbox" ${dev.permissions.canViewAccounting ? 'checked' : ''} ${dev.role === 'OWNER' ? 'disabled' : ''} onchange="sahlaPosDevices.togglePermission('${dev.id}', 'canViewAccounting')">
              <span>الاطلاع على الأرباح والمحاسبة المالية</span>
            </label>
            <label class="perm-checkbox-item">
              <input type="checkbox" ${dev.permissions.canRechargeWallet ? 'checked' : ''} ${dev.role === 'OWNER' ? 'disabled' : ''} onchange="sahlaPosDevices.togglePermission('${dev.id}', 'canRechargeWallet')">
              <span>شحن المحفظة والدفع الإلكتروني</span>
            </label>
          </div>

          <div class="device-card-footer">
            <span>المعرف: <code style="font-size:10px;">${dev.id}</code></span>
            ${!isCur ? `<button class="btn-action" style="color:#ef4444;" onclick="if(confirm('هل أنت متأكد من إلغاء اقتران هذا الجهاز؟')) { sahlaPosDevices.removeDevice('${dev.id}'); renderBoundDevices(); }">إلغاء الاقتران ✕</button>` : '<span style="color:#059669; font-weight:700;">✓ متصل محلياً</span>'}
          </div>
        </div>
      `;
    }).join('');
  }

  window.renderBoundDevices = renderDevices;
  renderDevices();
  window.addEventListener('sahla:devices-updated', renderDevices);

  // زر محاكاة مزامنة العمليات بين الكاونترات
  if (btnSimulateSync) {
    btnSimulateSync.addEventListener('click', () => {
      const services = [
        'أنجز سيرة ذاتية فرنسية للزبون (خصم 15 نقطة)',
        'أنجز لوحة صور هوية 8 صور 10x15 سم (خصم 10 نقاط)',
        'أعد تصريح جبائي شهري DGI G50 (خصم 20 نقطة)',
        'أعد بحث مدرسي مع صفحة الواجهة والمراجع (خصم 15 نقطة)'
      ];
      const randomService = services[Math.floor(Math.random() * services.length)];
      const event = sahlaPosDevices.simulateBroadcastSync(randomService);
      if (tickerText) {
        tickerText.innerHTML = `<strong>[${event.timestamp}] ${event.terminal}:</strong> ${event.description}`;
        tickerText.style.color = '#2563eb';
        setTimeout(() => { tickerText.style.color = 'var(--text-muted)'; }, 2500);
      }
      showToast(`📡 [مزامنة شبكة المحل]: ${event.terminal} ${event.description}`);
    });
  }
}

// 18. النظام المحاسبي وكشف الأرباح (Accounting & Profit Ledger UI)
function initAccountingUI() {
  const kpisContainer = document.getElementById('accountingKpisContainer');
  const statementContainer = document.getElementById('accountingStatementContainer');
  const periodButtons = document.querySelectorAll('.period-btn');
  const btnExportCSV = document.getElementById('btnExportAccountingCSV');
  const btnPrintReport = document.getElementById('btnPrintAccountingReport');

  let currentPeriod = 'ALL';

  function renderAccounting() {
    const metrics = sahlaAccounting.calculateMetrics(currentPeriod);

    if (kpisContainer) {
      kpisContainer.innerHTML = `
        <div class="acc-kpi-card kpi-revenue">
          <span class="kpi-label">إجمالي المقبوضات نقدًا من الزبائن</span>
          <span class="kpi-val">${metrics.totalRevenue.toLocaleString()} دج</span>
          <span class="kpi-subtext">تم تحصيلها في الصندوق (${metrics.count} عملية)</span>
        </div>
        <div class="acc-kpi-card kpi-points">
          <span class="kpi-label">تكلفة النقاط المستهلكة (المنصة)</span>
          <span class="kpi-val">${metrics.totalPointsCostDZD.toLocaleString()} دج</span>
          <span class="kpi-subtext">محسوبة بـ 10 دج للنقطة المشتراة</span>
        </div>
        <div class="acc-kpi-card kpi-costs">
          <span class="kpi-label">تكلفة الورق والحبر التقديرية</span>
          <span class="kpi-val">${metrics.totalPaperInk.toLocaleString()} دج</span>
          <span class="kpi-subtext">مستهلكات الورق المقوى 230g و A4</span>
        </div>
        <div class="acc-kpi-card kpi-profit">
          <span class="kpi-label">صافي ربح صاحب المحل (Net Profit)</span>
          <span class="kpi-val">${metrics.totalNetProfit.toLocaleString()} دج</span>
          <span class="kpi-subtext" style="color:#059669; font-weight:800;">هامش ربحية استثنائي: ${metrics.marginPercent}%</span>
        </div>
      `;
    }

    if (statementContainer) {
      statementContainer.innerHTML = sahlaAccounting.generatePrintableStatementHTML(sahlaWallet.data, currentPeriod);
    }
  }

  periodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      periodButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPeriod = btn.getAttribute('data-period');
      renderAccounting();
    });
  });

  if (btnExportCSV) {
    btnExportCSV.addEventListener('click', () => {
      sahlaAccounting.exportToCSV(currentPeriod);
      showToast('📥 تم تحميل جدول العمليات والمحاسبة بصيغة Excel / CSV بنجاح');
    });
  }

  if (btnPrintReport) {
    btnPrintReport.addEventListener('click', () => {
      showToast('🖨️ جاري تجهيز وطباعة كشف الحساب المحاسبي الدوري A4...');
      window.print();
    });
  }

  renderAccounting();
  window.addEventListener('sahla:accounting-updated', renderAccounting);
  window.addEventListener('sahla:wallet-updated', renderAccounting);
}

// 19. دليل وبوابات الخدمات الحكومية الوطنية (E-Gov Directory UI)
function initEgovUI() {
  const grid = document.getElementById('egovGridContainer');
  const searchInput = document.getElementById('egovSearchInput');
  const catButtons = document.querySelectorAll('.egov-cat-pill');
  const modal = document.getElementById('citizenDossierModal');
  const modalContent = document.getElementById('citizenDossierContent');
  const modalTitle = document.getElementById('modalDossierTitle');
  const btnPrintNow = document.getElementById('btnPrintCitizenDossierNow');

  let currentCategory = 'ALL';
  let currentSearch = '';
  let activeDossierId = null;

  window.openCitizenDossierModal = (serviceId) => {
    activeDossierId = serviceId;
    const s = sahlaEgov.getById(serviceId);
    if (!s) return;

    if (modalTitle) modalTitle.textContent = `📋 الملف والوثائق المطلوبة: ${s.titleAr}`;
    if (modalContent) {
      modalContent.innerHTML = sahlaEgov.generateCitizenChecklistHTML(serviceId, sahlaWallet.data);
    }
    if (modal) modal.classList.add('open');
  };

  window.closeCitizenDossierModal = () => {
    if (modal) modal.classList.remove('open');
  };

  if (btnPrintNow) {
    btnPrintNow.addEventListener('click', () => {
      showToast('🖨️ جاري طباعة بطاقة الملف الإداري للزبون A4...');
      window.print();
    });
  }

  function renderEgovCards() {
    if (!grid) return;
    const items = sahlaEgov.filter(currentCategory, currentSearch);

    if (items.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding:40px; background:var(--bg-card); border-radius:var(--radius-lg); border:1px solid var(--border-color);">
          <div style="font-size:36px; margin-bottom:10px;">🔍</div>
          <h4 style="font-size:16px; font-weight:800; color:var(--text-main);">لا توجد بوابات تطابق معايير البحث</h4>
          <p style="font-size:12px; color:var(--text-muted);">جرب البحث بكلمات عامة مثل "ضرائب"، "سيرة"، "شهادة ميلاد" أو "منحة"</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = items.map(item => `
      <div class="egov-card">
        <div class="egov-card-top">
          <span class="egov-badge-authority">${item.badge}</span>
          <span style="font-size:11px; font-weight:700; color:#059669;">● ${item.portalStatus}</span>
        </div>
        <div>
          <h3>${item.titleAr}</h3>
          <h4>${item.titleFr}</h4>
          <p style="font-size:11px; color:#475569; margin:4px 0 0 0;"><strong>الجهة:</strong> ${item.authorityAr}</p>
        </div>
        <p class="egov-desc-text">${item.descriptionAr}</p>
        <div style="background:var(--bg-app); padding:8px 10px; border-radius:var(--radius-sm); font-size:11px; color:#92400e; background:#fffbeb; border:1px solid #fde68a;">
          <strong>الرسوم:</strong> ${item.officialFees}
        </div>
        <div class="egov-card-actions">
          <a href="${item.officialUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="font-size:12px; padding:6px 10px; text-decoration:none;">
            <span>🌐 فتح البوابة الرسمية</span>
          </a>
          <button class="btn-primary" style="font-size:12px; padding:6px 10px;" onclick="openCitizenDossierModal('${item.id}')">
            <span>📋 الملف المطلوب للزبون</span>
          </button>
          ${item.sahlaAction ? `
            <button class="btn-action" style="font-size:11px; font-weight:800; color:var(--primary); margin-right:auto;" onclick="switchTab('${item.sahlaAction.targetTab}')">
              <span>⚡ ${item.sahlaAction.label}</span>
            </button>
          ` : ''}
        </div>
      </div>
    `).join('');
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      renderEgovCards();
    });
  }

  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category');
      renderEgovCards();
    });
  });

  renderEgovCards();
}

// 20. مركز صيانة وتشخيص طابعات المحل (Hardware Troubleshooter & Calibration UI)
function initHardwareUI() {
  const issuesContainer = document.getElementById('hardwareIssuesContainer');
  const testSheetContainer = document.getElementById('printerTestSheetContainer');
  const brandButtons = document.querySelectorAll('.brand-tab-btn');
  const btnSwitchCalibration = document.getElementById('btnSwitchToCalibrationSheet');

  let activeBrand = 'epson_ecotank';

  function renderHardwareView() {
    if (activeBrand === 'test_page') {
      if (issuesContainer) issuesContainer.style.display = 'none';
      if (testSheetContainer) {
        testSheetContainer.style.display = 'block';
        testSheetContainer.innerHTML = `
          <div class="no-print" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; background:var(--bg-app); padding:10px 16px; border-radius:var(--radius-md); border:1px solid var(--border-color); flex-wrap:wrap; gap:10px;">
            <span style="font-size:12px; color:var(--text-muted);">اطبع صفحة الاختبار هذه لفحص جودة الألوان، تدرج الفوهات ومحاذاة الورق A4 بدقة 300DPI.</span>
            <button class="btn-primary" onclick="window.print()">
              <span>🖨️ طباعة صفحة فحص الألوان A4 الآن</span>
            </button>
          </div>
          ${sahlaHardwareGuide.generateTestPageHTML()}
        `;
      }
      return;
    }

    if (testSheetContainer) testSheetContainer.style.display = 'none';
    if (issuesContainer) {
      issuesContainer.style.display = 'block';
      const guide = sahlaHardwareGuide.getGuideById(activeBrand);
      if (!guide) return;

      const issuesHtml = guide.issues.map(iss => `
        <div class="printer-issue-card">
          <h4>
            <span style="color:#ef4444;">⚠️</span>
            <span>${iss.title}</span>
          </h4>
          <div class="issue-symptom-box">
            <strong>العَرَض الملاحظ:</strong> ${iss.symptom}
          </div>
          <div class="issue-cause-box">
            <strong>السبب التقني المباشر:</strong> ${iss.cause}
          </div>
          <div style="background:var(--bg-app); padding:12px 14px; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
            <strong style="display:block; margin-bottom:6px; font-size:12px; color:var(--text-main);">خطوات المعالجة والصيانة السريعة:</strong>
            <ol class="issue-steps-ol">
              ${iss.solutionSteps.map(step => `<li>${step}</li>`).join('')}
            </ol>
          </div>
        </div>
      `).join('');

      issuesContainer.innerHTML = `
        <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:16px 20px; margin-bottom:18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div>
            <h3 style="font-size:16px; font-weight:900; margin:0 0 2px 0;">دليل صيانة ${guide.brand} (${guide.models})</h3>
            <span style="font-size:11px; color:var(--primary); font-weight:700;">${guide.popularityTag}</span>
          </div>
          <button class="btn-secondary" onclick="switchBrandTab('test_page')">
            <span>🎯 فحص الفوهات بصفحة الاختبار</span>
          </button>
        </div>
        ${issuesHtml}
      `;
    }
  }

  window.switchBrandTab = (brandId) => {
    activeBrand = brandId;
    brandButtons.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-brand') === brandId);
    });
    renderHardwareView();
  };

  brandButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const brand = btn.getAttribute('data-brand');
      switchBrandTab(brand);
    });
  });

  if (btnSwitchCalibration) {
    btnSwitchCalibration.addEventListener('click', () => {
      switchBrandTab('test_page');
    });
  }

  renderHardwareView();
}

// ==============================================================================
// وثيقة PRD: تسجيل الدخول، الصفحة التعريفية، الشاشة الرئيسية، وتجربة أول زيارة
// ==============================================================================

// 19. تهيئة الصفحة التعريفية (Landing Page UI)
function initLandingUI() {
  const landingWrapper = document.getElementById('view-landing');
  const appLayout = document.querySelector('.app-layout');
  const mobileBottomNav = document.querySelector('.mobile-bottom-nav');

  // التبديل بين الصفحة التعريفية وتطبيق المنصة
  window.showAppView = function() {
    if (landingWrapper) landingWrapper.style.display = 'none';
    if (appLayout) appLayout.style.display = 'flex';
    if (mobileBottomNav && window.innerWidth <= 900) {
      mobileBottomNav.style.display = 'flex';
    }
    if (window.updateDashboardHeaderProfile) updateDashboardHeaderProfile();
    if (window.renderStarterChecklist) renderStarterChecklist();
    if (window.checkLowPointsBanner) checkLowPointsBanner();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  window.showLandingView = function() {
    if (landingWrapper) landingWrapper.style.display = 'block';
    if (appLayout) appLayout.style.display = 'none';
    if (mobileBottomNav) mobileBottomNav.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // التحقق من حالة الدخول عند بدء التشغيل
  if (window.sahlaAuth && window.sahlaAuth.isLoggedIn()) {
    showAppView();
    // التحقق من إكمال الـ Onboarding
    if (window.sahlaOnboarding && !window.sahlaOnboarding.isCompleted()) {
      setTimeout(() => openOnboardingModal(), 500);
    }
  } else {
    showLandingView();
  }

  // 1. حاسبة الأرباح التفاعلية (كم تربح في محلك؟)
  const calcDocsRange = document.getElementById('calcDocsRange');
  const calcPriceRange = document.getElementById('calcPriceRange');
  const calcCostRange = document.getElementById('calcCostRange');

  const calcDocsDisplay = document.getElementById('calcDocsCountDisplay');
  const calcPriceDisplay = document.getElementById('calcPriceDisplay');
  const calcCostDisplay = document.getElementById('calcCostDisplay');

  const calcMonthlyProfitVal = document.getElementById('calcMonthlyProfitVal');
  const calcMarginVal = document.getElementById('calcMarginVal');
  const calcGrossRevVal = document.getElementById('calcGrossRevVal');
  const calcTotalCostVal = document.getElementById('calcTotalCostVal');
  const calcTotalDocsVal = document.getElementById('calcTotalDocsVal');

  function updateProfitCalculator() {
    if (!calcDocsRange || !calcPriceRange || !calcCostRange) return;

    const docsPerDay = parseInt(calcDocsRange.value) || 15;
    const pricePerDoc = parseInt(calcPriceRange.value) || 150;
    const costPerDoc = parseInt(calcCostRange.value) || 12;

    const monthlyDocs = docsPerDay * 30;
    const monthlyGross = monthlyDocs * pricePerDoc;
    const monthlyCost = monthlyDocs * costPerDoc;
    const monthlyProfit = monthlyGross - monthlyCost;
    const margin = monthlyGross > 0 ? Math.round((monthlyProfit / monthlyGross) * 100) : 0;

    if (calcDocsDisplay) calcDocsDisplay.textContent = `${docsPerDay} وثيقة / يوم`;
    if (calcPriceDisplay) calcPriceDisplay.textContent = `${pricePerDoc} دج`;
    if (calcCostDisplay) calcCostDisplay.textContent = `${costPerDoc} دج (نقاط)`;

    if (calcMonthlyProfitVal) calcMonthlyProfitVal.textContent = `+${monthlyProfit.toLocaleString()} دج`;
    if (calcMarginVal) calcMarginVal.textContent = `${margin}%`;
    if (calcGrossRevVal) calcGrossRevVal.textContent = `${monthlyGross.toLocaleString()} دج`;
    if (calcTotalCostVal) calcTotalCostVal.textContent = `-${monthlyCost.toLocaleString()} دج`;
    if (calcTotalDocsVal) calcTotalDocsVal.textContent = `${monthlyDocs.toLocaleString()} وثيقة`;
  }

  if (calcDocsRange) calcDocsRange.addEventListener('input', updateProfitCalculator);
  if (calcPriceRange) calcPriceRange.addEventListener('input', updateProfitCalculator);
  if (calcCostRange) calcCostRange.addEventListener('input', updateProfitCalculator);
  updateProfitCalculator();

  // 2. الأسئلة الشائعة (FAQ Accordion)
  const faqItems = document.querySelectorAll('.faq-accordion-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  // 3. تبديل السمة من الصفحة التعريفية
  const landingThemeBtn = document.getElementById('landingThemeBtn');
  if (landingThemeBtn) {
    landingThemeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      landingThemeBtn.textContent = next === 'dark' ? '🌙' : '☀️';
      const appToggleBtn = document.getElementById('themeToggleBtn');
      if (appToggleBtn) appToggleBtn.textContent = next === 'dark' ? '🌙' : '☀️';
      showToast(`تم التبديل إلى المظهر ${next === 'dark' ? 'الليلي' : 'النهاري'}`);
    });
  }

  // 4. محدد اللغة
  const langSelect = document.getElementById('landingLangSelect');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      const lang = e.target.value;
      if (lang === 'fr') {
        showToast('Langue changée en Français (Algérie) ✓');
      } else if (lang === 'en') {
        showToast('Language changed to English ✓');
      } else {
        showToast('تم ضبط اللغة على العربية الجزائرية ✓');
      }
    });
  }
}

// 20. نظام المصادقة والـ OTP وإنشاء المحل (Auth UI)
function initAuthUI() {
  const authModal = document.getElementById('authModal');
  const authModalTitle = document.getElementById('authModalTitle');

  const stepPhone = document.getElementById('authStepPhone');
  const stepOtp = document.getElementById('authStepOtp');
  const stepShop = document.getElementById('authStepShop');

  const phoneInput = document.getElementById('authPhoneInput');
  const phoneError = document.getElementById('authPhoneError');
  const carrierBadgeContainer = document.getElementById('carrierBadgeContainer');

  const otpInput = document.getElementById('authOtpInput');
  const otpError = document.getElementById('authOtpError');
  const targetPhoneDisplay = document.getElementById('otpTargetPhoneDisplay');
  const countdownSeconds = document.getElementById('otpCountdownSeconds');

  const btnRequestOtp = document.getElementById('btnRequestOtp');
  const btnVerifyOtp = document.getElementById('btnVerifyOtp');
  const btnResendOtp = document.getElementById('btnResendOtp');
  const btnFillDemoOtp = document.getElementById('btnFillDemoOtp');
  const btnBackToPhone = document.getElementById('btnBackToPhone');

  const shopNameInput = document.getElementById('newShopNameInput');
  const shopWilayaSelect = document.getElementById('newShopWilayaSelect');
  const shopActivitySelect = document.getElementById('newShopActivitySelect');
  const ownerNameInput = document.getElementById('newOwnerNameInput');
  const legalConsentCheckbox = document.getElementById('legalConsentCheckbox');
  const shopError = document.getElementById('authShopError');
  const btnCompleteRegistration = document.getElementById('btnCompleteRegistration');

  let resendTimerInterval = null;
  let verifiedPhoneNumber = '';

  // ملء قائمة الولايات 58
  if (shopWilayaSelect && window.ALGERIAN_WILAYAS) {
    shopWilayaSelect.innerHTML = ALGERIAN_WILAYAS.map(w =>
      `<option value="${w.code}" ${w.code === 16 ? 'selected' : ''}>${w.code} - ${w.nameAr} (${w.nameFr})</option>`
    ).join('');
  }

  window.openAuthModal = function(mode = 'signup') {
    if (!authModal) return;
    if (authModalTitle) {
      authModalTitle.textContent = mode === 'login' ? 'تسجيل الدخول برقم الهاتف 🇩🇿' : 'ابدأ مجاناً · تسجيل حساب المحل 🇩🇿';
    }
    // إعادة تعيين الخطوات
    if (stepPhone) stepPhone.style.display = 'block';
    if (stepOtp) stepOtp.style.display = 'none';
    if (stepShop) stepShop.style.display = 'none';

    if (phoneError) phoneError.style.display = 'none';
    if (otpError) otpError.style.display = 'none';
    if (shopError) shopError.style.display = 'none';

    authModal.classList.add('open');
    if (phoneInput) phoneInput.focus();
  };

  window.closeAuthModal = function() {
    if (authModal) authModal.classList.remove('open');
    if (resendTimerInterval) clearInterval(resendTimerInterval);
  };

  // كشف شركة الاتصال عند كتابة الرقم (موبيليس، جيزي، أوريدو)
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.startsWith('213')) val = val.substring(3);

      if (carrierBadgeContainer) {
        if (val.startsWith('05') || val.startsWith('5')) {
          carrierBadgeContainer.innerHTML = '<span class="phone-carrier-indicator carrier-ooredoo">🔴 أوريدو (Ooredoo)</span>';
        } else if (val.startsWith('06') || val.startsWith('6')) {
          carrierBadgeContainer.innerHTML = '<span class="phone-carrier-indicator carrier-mobilis">🟢 موبيليس (Mobilis)</span>';
        } else if (val.startsWith('07') || val.startsWith('7')) {
          carrierBadgeContainer.innerHTML = '<span class="phone-carrier-indicator carrier-djezzy">🟠 جيزي (Djezzy)</span>';
        } else {
          carrierBadgeContainer.innerHTML = '';
        }
      }
    });

    phoneInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') btnRequestOtp.click();
    });
  }

  // 1. طلب رمز OTP
  if (btnRequestOtp) {
    btnRequestOtp.addEventListener('click', () => {
      if (!phoneInput) return;
      const res = sahlaAuth.requestOTP(phoneInput.value);
      if (!res.success) {
        if (phoneError) {
          phoneError.textContent = res.error;
          phoneError.style.display = 'block';
        }
        return;
      }

      if (phoneError) phoneError.style.display = 'none';
      if (targetPhoneDisplay) targetPhoneDisplay.textContent = res.phone;

      // الانتقال للخطوة 2
      stepPhone.style.display = 'none';
      stepOtp.style.display = 'block';
      if (otpInput) {
        otpInput.value = '';
        otpInput.focus();
      }

      showToast(`تم إرسال رمز التحقق OTP إلى رقمك! (كود العرض التجريبي السريع: ${res.demoCode})`);

      // تشغيل مؤقت العد التنازلي 60 ثانية
      let timeLeft = 60;
      if (btnResendOtp) btnResendOtp.disabled = true;
      if (countdownSeconds) countdownSeconds.textContent = timeLeft;

      if (resendTimerInterval) clearInterval(resendTimerInterval);
      resendTimerInterval = setInterval(() => {
        timeLeft--;
        if (countdownSeconds) countdownSeconds.textContent = timeLeft;
        if (timeLeft <= 0) {
          clearInterval(resendTimerInterval);
          if (btnResendOtp) btnResendOtp.disabled = false;
        }
      }, 1000);
    });
  }

  // ملء كود العرض التجريبي بنقرة واحدة
  if (btnFillDemoOtp) {
    btnFillDemoOtp.addEventListener('click', () => {
      if (otpInput) {
        otpInput.value = '123456';
        showToast('تم إدراج كود العرض 123456 بنجاح');
      }
    });
  }

  // رجوع للرقم
  if (btnBackToPhone) {
    btnBackToPhone.addEventListener('click', () => {
      stepOtp.style.display = 'none';
      stepPhone.style.display = 'block';
      if (phoneInput) phoneInput.focus();
    });
  }

  // إعادة إرسال OTP
  if (btnResendOtp) {
    btnResendOtp.addEventListener('click', () => {
      if (btnRequestOtp) btnRequestOtp.click();
    });
  }

  // 2. التحقق من كود الـ OTP
  if (btnVerifyOtp) {
    btnVerifyOtp.addEventListener('click', () => {
      if (!otpInput) return;
      const res = sahlaAuth.verifyOTP(otpInput.value);
      if (!res.success) {
        if (otpError) {
          otpError.textContent = res.error;
          otpError.style.display = 'block';
        }
        return;
      }

      if (otpError) otpError.style.display = 'none';

      if (res.isNewUser) {
        // مستخدم جديد -> الانتقال للخطوة 3 لإنشاء المحل
        verifiedPhoneNumber = res.phone;
        stepOtp.style.display = 'none';
        stepShop.style.display = 'block';
        if (shopNameInput) shopNameInput.focus();
      } else {
        // مستخدم مسجل مسبقاً -> تسجيل دخول مباشر
        closeAuthModal();
        showToast(`مرحباً بعودتك! تم تسجيل الدخول إلى "${res.shop.name}" بنجاح 🇩🇿`);
        showAppView();
      }
    });
  }

  if (otpInput) {
    otpInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') btnVerifyOtp.click();
    });
  }

  // 3. إكمال تسجيل المحل والموافقة القانونية (قانون 18-07)
  if (btnCompleteRegistration) {
    btnCompleteRegistration.addEventListener('click', () => {
      const sName = shopNameInput ? shopNameInput.value.trim() : '';
      const sWilaya = shopWilayaSelect ? shopWilayaSelect.value : 16;
      const sActivity = shopActivitySelect ? shopActivitySelect.value : 'KIOSK';
      const oName = ownerNameInput ? ownerNameInput.value.trim() : 'مسير المحل';
      const consentAgreed = legalConsentCheckbox ? legalConsentCheckbox.checked : false;

      const res = sahlaAuth.completeShopRegistration({
        phone: verifiedPhoneNumber || '0550000000',
        shopName: sName,
        ownerName: oName,
        wilayaCode: sWilaya,
        activityType: sActivity,
        consentAgreed
      });

      if (!res.success) {
        if (shopError) {
          shopError.textContent = res.error;
          shopError.style.display = 'block';
        }
        return;
      }

      if (shopError) shopError.style.display = 'none';
      closeAuthModal();
      showToast(`تهانينا! تم إنشاء حساب "${res.shop.name}" وتفعيل 50 نقطة تجريبية مجانية 🎁`);
      showAppView();
      setTimeout(() => openOnboardingModal(), 300);
    });
  }

  // الدخول التجريبي السريع المباشر (Demo Quick Login)
  window.quickDemoLogin = function() {
    const demoShop = {
      id: 'shop_demo_16',
      name: 'كيوسك النور للخدمات',
      ownerName: 'عمار التاجر',
      phone: '0555 12 34 56',
      wilayaCode: 16,
      activityType: 'KIOSK',
      legalConsentGivenAt: new Date().toISOString()
    };
    sahlaAuth.saveRegisteredUser('0555123456', demoShop);
    sahlaAuth.saveSession({
      token: 'sahla_demo_tok',
      user: { phone: '0555123456', formattedPhone: '0555 12 34 56', role: 'OWNER', name: 'عمار التاجر' },
      shop: demoShop,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000
    });
    closeAuthModal();
    showToast('تم تسجيل الدخول المباشر بحساب تجريبي 🇩🇿');
    showAppView();
  };
}

// 21. واجهة تجربة أول دخول وقائمة مهام البداية (Onboarding & Checklist UI)
function initOnboardingUI() {
  const onboardingModal = document.getElementById('onboardingModal');

  window.openOnboardingModal = function() {
    if (!onboardingModal) return;
    const shop = sahlaAuth.getCurrentShop();
    const nameDisplay = document.getElementById('onboardingShopNameDisplay');
    if (nameDisplay && shop) {
      nameDisplay.textContent = shop.name;
    }
    nextOnboardingStep(1);
    onboardingModal.classList.add('open');
  };

  window.closeOnboardingModal = function() {
    if (onboardingModal) onboardingModal.classList.remove('open');
  };

  window.nextOnboardingStep = function(stepNum) {
    const s1 = document.getElementById('onboardStep1');
    const s2 = document.getElementById('onboardStep2');
    const s3 = document.getElementById('onboardStep3');

    const d1 = document.getElementById('onboardDot1');
    const d2 = document.getElementById('onboardDot2');
    const d3 = document.getElementById('onboardDot3');

    if (s1) s1.style.display = stepNum === 1 ? 'block' : 'none';
    if (s2) s2.style.display = stepNum === 2 ? 'block' : 'none';
    if (s3) s3.style.display = stepNum === 3 ? 'block' : 'none';

    if (d1) d1.classList.toggle('active', stepNum === 1);
    if (d2) d2.classList.toggle('active', stepNum === 2);
    if (d3) d3.classList.toggle('active', stepNum === 3);

    sahlaOnboarding.setStep(stepNum);
  };

  // تفاعل شرائح الخدمات في الخطوة 2
  const serviceChips = document.querySelectorAll('.service-choice-chip');
  serviceChips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
    });
  });

  window.saveOnboardingServicesAndProceed = function() {
    const selected = [];
    document.querySelectorAll('.service-choice-chip.selected').forEach(c => {
      const key = c.getAttribute('data-service-key');
      if (key) selected.push(key);
    });
    sahlaOnboarding.setSelectedServices(selected);
    nextOnboardingStep(3);
  };

  window.startFirstDocumentAction = function() {
    sahlaOnboarding.markTask('firstDocCreated');
    sahlaOnboarding.completeOnboarding();
    closeOnboardingModal();
    switchTab('cv');
    showToast('أنت الآن في معالج السيرة الذاتية! القالب جاهز للطباعة الفورية والتعديل 🚀');
    renderStarterChecklist();
  };

  window.finishOnboardingToDashboard = function() {
    sahlaOnboarding.completeOnboarding();
    closeOnboardingModal();
    showToast('أهلاً بك في لوحة تحكم محلك!');
    renderStarterChecklist();
  };

  window.skipOnboarding = function() {
    sahlaOnboarding.skipOnboarding();
    closeOnboardingModal();
    showToast('تم تخطي الجولة الترحيبية. يمكنك بدء العمل فوراً.');
    renderStarterChecklist();
  };

  // رندر بطاقة مهام البداية السريعة في الشاشة الرئيسية
  window.renderStarterChecklist = function() {
    const container = document.getElementById('starterChecklistContainer');
    if (!container) return;
    container.innerHTML = sahlaOnboarding.renderChecklistHTML();
  };

  // الاستماع لتحديثات الـ Onboarding
  window.addEventListener('sahla:onboarding-updated', () => {
    renderStarterChecklist();
  });

  // تثبيت الـ PWA
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  window.triggerPwaInstall = function() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          showToast('تم تثبيت تطبيق سهلة على هاتفك بنجاح! 📱');
          sahlaOnboarding.markTask('pwaInstalled');
        }
        deferredPrompt = null;
      });
    } else {
      sahlaOnboarding.markTask('pwaInstalled');
      showToast('تم تفعيل اختصار تطبيق سهلة على هاتفك ✓');
    }
    renderStarterChecklist();
  };
}

// 22. تحسينات الشاشة الرئيسية (Dashboard Enhancements)
function initDashboardEnhancements() {
  // 1. شريط البحث السريع عن الخدمات (ماذا يطلب زبونك؟)
  const searchInput = document.getElementById('quickServiceSearchInput');
  const clearBtn = document.getElementById('clearSearchBtn');
  const quickGrid = document.querySelector('.services-quick-grid');

  if (searchInput && quickGrid) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (clearBtn) clearBtn.style.display = q ? 'block' : 'none';

      const cards = quickGrid.querySelectorAll('.service-card');
      cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const match = !q || text.includes(q);
        card.style.display = match ? 'flex' : 'none';
      });
    });
  }

  window.clearServiceSearch = function() {
    if (searchInput) {
      searchInput.value = '';
      if (clearBtn) clearBtn.style.display = 'none';
      if (quickGrid) {
        quickGrid.querySelectorAll('.service-card').forEach(c => c.style.display = 'flex');
      }
      searchInput.focus();
    }
  };

  // 2. التحقق من تنبيه الرصيد المنخفض
  window.checkLowPointsBanner = function() {
    const banner = document.getElementById('lowPointsBanner');
    const msg = document.getElementById('lowPointsMsg');
    const icon = document.getElementById('lowPointsIcon');
    if (!banner || !window.sahlaWallet) return;

    const points = sahlaWallet.data.points;
    if (points <= 0) {
      banner.style.display = 'flex';
      banner.className = 'low-points-warning-banner banner-alert-red';
      if (icon) icon.textContent = '🚨';
      if (msg) msg.textContent = 'تنبيه عاجل: لقد نفذ رصيد نقاط محلك بالكامل (0 نقطة)! اشحن محفظتك للاستمرار في توليد الوثائق.';
    } else if (points < 20) {
      banner.style.display = 'flex';
      banner.className = 'low-points-warning-banner banner-warning-yellow';
      if (icon) icon.textContent = '⚠️';
      if (msg) msg.textContent = `تنبيه: رصيد نقاط محلك منخفض (${points} نقطة فقط). اشحن محفظتك لتفادي توقف الخدمة عن زبائنك.`;
    } else {
      banner.style.display = 'none';
    }
  };

  window.addEventListener('sahla:wallet-updated', () => {
    checkLowPointsBanner();
    updateTodaySummary();
  });

  // 3. تحديث ملخص اليوم (Today's Summary)
  function updateTodaySummary() {
    const docsBadge = document.getElementById('todayDocsCount');
    const pointsBadge = document.getElementById('todayPointsSpent');
    const profitBadge = document.getElementById('todayEstProfit');

    if (!docsBadge || !window.sahlaWallet) return;

    const history = sahlaWallet.getLedgerHistory();
    const today = new Date().toDateString();
    const todayDebits = history.filter(h => h.type === 'DEBIT' && new Date(h.date).toDateString() === today);

    const docsCount = todayDebits.length;
    const pointsSpent = todayDebits.reduce((acc, h) => acc + h.points, 0);
    // افتراض متوسط سعر البيع 150 دج للوثيقة مقابل تكلفة النقاط
    const estProfit = Math.max(0, (docsCount * 150) - (pointsSpent * 10));

    docsBadge.textContent = docsCount;
    if (pointsBadge) pointsBadge.textContent = pointsSpent;
    if (profitBadge) profitBadge.textContent = `${estProfit.toLocaleString()} دج`;
  }
  updateTodaySummary();

  // 4. نافذة إدارة الحساب والجلسة (Account Modal)
  const accountModal = document.getElementById('accountModal');
  window.openAccountModal = function() {
    if (!accountModal) return;
    const shop = sahlaAuth.getCurrentShop() || { name: 'كيوسك النور للخدمات', phone: '0555 12 34 56', wilayaCode: 16 };
    const user = sahlaAuth.getCurrentUser() || { phone: '0555 12 34 56' };

    const nameEl = document.getElementById('accountShopNameDisplay');
    const phoneEl = document.getElementById('accountPhoneDisplay');
    const wilayaEl = document.getElementById('accountWilayaDisplay');
    const avatarEl = document.getElementById('accountAvatarLetter');

    if (nameEl) nameEl.textContent = shop.name;
    if (phoneEl) phoneEl.textContent = user.formattedPhone || user.phone;
    if (avatarEl) avatarEl.textContent = shop.name.charAt(0);

    const w = ALGERIAN_WILAYAS.find(item => item.code === Number(shop.wilayaCode));
    if (wilayaEl && w) wilayaEl.textContent = `${w.code} - ${w.nameAr}`;

    accountModal.classList.add('open');
  };

  window.closeAccountModal = function() {
    if (accountModal) accountModal.classList.remove('open');
  };

  window.logoutShopOwner = function() {
    if (confirm('هل أنت متأكد من رغبتك في تسجيل الخروج من المحل؟')) {
      sahlaAuth.logout();
      closeAccountModal();
      showLandingView();
      showToast('تم تسجيل الخروج بنجاح. نراك قريباً!');
    }
  };

  // نافذة ضبط الأسعار الافتراضية
  window.openPricingConfigModal = function() {
    closeAccountModal();
    const prices = sahlaOnboarding.state.defaultSalePrices;
    const cvP = prompt('حدد سعر بيع السيرة الذاتية الافتراضي للزبون (دج):', prices.cv || 250);
    if (cvP !== null && !isNaN(Number(cvP))) {
      sahlaOnboarding.state.defaultSalePrices.cv = Number(cvP);
      sahlaOnboarding.markTask('pricesConfigured');
      sahlaOnboarding.saveState();
      renderStarterChecklist();
      showToast(`تم حفظ سعر بيع السيرة الذاتية: ${cvP} دج ✓`);
    }
  };

  // تحديث أسماء الترويسة
  window.updateDashboardHeaderProfile = function() {
    const shop = sahlaAuth.getCurrentShop();
    const headerShortName = document.getElementById('headerShopShortName');
    const sidebarShopName = document.getElementById('sidebarShopName');
    const sidebarWilaya = document.getElementById('sidebarWilaya');

    if (shop) {
      if (headerShortName) headerShortName.textContent = shop.name.length > 12 ? shop.name.substring(0, 12) + '…' : shop.name;
      if (sidebarShopName) sidebarShopName.textContent = shop.name;
      const w = ALGERIAN_WILAYAS.find(item => item.code === Number(shop.wilayaCode));
      if (sidebarWilaya && w) sidebarWilaya.textContent = `${w.code} - ${w.nameAr}`;
    }
  };

  // ترتيب الخدمات وفق تفضيلات الـ Onboarding
  sahlaOnboarding.applyServiceOrder();
}

// 23. مركز الإشعارات والتنبيهات المنسدل (Notifications Center)
function initNotificationsUI() {
  const notifDrawer = document.getElementById('notificationDrawer');
  const notifBadge = document.getElementById('notifBadgeCount');
  const notifList = document.getElementById('notificationsList');

  const notifications = [
    {
      id: 'notif_1',
      icon: '🪙',
      title: 'رصيد ترحيبي مجاني',
      desc: 'أضفنا 50 نقطة تجريبية لحساب محلك لتبدأ العمل دون دفع أي دينار.',
      time: 'اليوم'
    },
    {
      id: 'notif_2',
      icon: '🏛️',
      title: 'خدمة التصاريح الجبائية G50 / G12',
      desc: 'تم تفعيل التوليد الآلي للتصريح الجبائي الشهري وفق معايير الضرائب DGI.',
      time: 'أمس'
    },
    {
      id: 'notif_3',
      icon: '⚖️',
      title: 'امتثال قانون حماية البيانات 18-07',
      desc: 'بيانات زبائنك ومحلك مشفرة ومحمية وفق التشريع الجزائري الصارم.',
      time: 'منذ يومين'
    }
  ];

  window.toggleNotificationDrawer = function() {
    if (!notifDrawer) return;
    const isHidden = notifDrawer.style.display === 'none' || !notifDrawer.style.display;
    notifDrawer.style.display = isHidden ? 'block' : 'none';
    if (isHidden && notifBadge) {
      notifBadge.style.display = 'none'; // مسح شارة الإشعار بعد الفتح
    }
  };

  if (notifList) {
    notifList.innerHTML = notifications.map(n => `
      <div class="notif-item-row">
        <div class="notif-icon-circle">${n.icon}</div>
        <div style="flex:1;">
          <div class="notif-content-title">${n.title}</div>
          <div class="notif-content-desc">${n.desc}</div>
          <small style="color:var(--text-muted); font-size:10px;">${n.time}</small>
        </div>
      </div>
    `).join('');
  }
}

// 24. عرض آخر الوثائق المنجزة في المحل (Recent Documents UI)
function initRecentDocsUI() {
  window.renderRecentDocuments = function() {
    const container = document.getElementById('recentDocsContainer');
    if (!container) return;

    // استرجاع سجل الوثائق المنجزة محلياً
    const docs = JSON.parse(localStorage.getItem('sahla_recent_docs') || '[]');

    if (docs.length === 0) {
      // الحالة 1: حساب جديد بلا وثائق (PRD Section 7.3)
      container.innerHTML = `
        <div class="empty-docs-welcome-box">
          <div style="font-size:36px; margin-bottom:8px;">📄</div>
          <h4 style="margin:0 0 6px 0; font-size:15px; font-weight:800; color:var(--text-main);">لم تقم بإنجاز أي وثيقة بعد</h4>
          <p style="margin:0 0 16px 0; font-size:12px; color:var(--text-muted); max-width:400px; margin-left:auto; margin-right:auto;">
            استخدم رصيدك التجريبي المجاني (50 نقطة) لإنجاز أول سيرة ذاتية أو فاتورة قانونية لزبونك واطبعها الآن.
          </p>
          <button class="btn-primary" onclick="switchTab('cv')" style="padding:10px 20px; font-size:13px; font-weight:800;">
            <span>أنشئ أول وثيقة الآن 🚀</span>
          </button>
        </div>
      `;
    } else {
      // الحالة 2: عرض آخر 5 وثائق مع إعادة الطباعة والتعديل (PRD Section 7.1)
      container.innerHTML = docs.slice(0, 5).map(doc => `
        <div class="recent-doc-row">
          <div class="recent-doc-info">
            <div class="recent-doc-icon">${doc.icon || '📄'}</div>
            <div>
              <strong style="font-size:13px; color:var(--text-main); display:block;">${doc.title}</strong>
              <small style="font-size:11px; color:var(--text-muted);">${doc.customerName || 'زبون عام'} · ${doc.serviceName} · ${doc.timeStr || 'اليوم'}</small>
            </div>
          </div>
          <div class="recent-doc-actions">
            <button class="btn-secondary" onclick="reprintDocumentAction('${doc.id}')" style="font-size:11px; padding:6px 10px;">
              <span>🖨️ إعادة طباعة</span>
            </button>
            <button class="btn-secondary" onclick="editDocumentAction('${doc.id}', '${doc.type}')" style="font-size:11px; padding:6px 10px;">
              <span>✏️ تعديل</span>
            </button>
          </div>
        </div>
      `).join('');
    }
  };

  window.recordDocumentCreation = function(type, title, customerName) {
    const docs = JSON.parse(localStorage.getItem('sahla_recent_docs') || '[]');
    const icons = { cv: '📄', invoice: '🧾', photo: '📸', school: '🎓', tax: '🏛️' };
    const names = { cv: 'سيرة ذاتية', invoice: 'فاتورة رسمية', photo: 'صور هوية', school: 'بحث مدرسي', tax: 'تصريح جبائي' };
    const newDoc = {
      id: 'doc_' + Date.now().toString(36),
      type,
      title: title || 'وثيقة زبون',
      customerName: customerName || 'زبون المحل',
      serviceName: names[type] || 'وثيقة رسمية',
      icon: icons[type] || '📄',
      createdAt: new Date().toISOString(),
      timeStr: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
    };
    docs.unshift(newDoc);
    localStorage.setItem('sahla_recent_docs', JSON.stringify(docs.slice(0, 20)));

    // إذا كانت أول وثيقة: تفعيل الاحتفال ومهمة الـ Checklist
    if (window.sahlaOnboarding && !sahlaOnboarding.state.checklist.firstDocCreated) {
      sahlaOnboarding.markTask('firstDocCreated');
      if (window.sahlaAnalytics) sahlaAnalytics.track('first_doc_created', { type });
      setTimeout(() => openCelebrationModal(type), 400);
    }
    renderRecentDocuments();
  };

  window.reprintDocumentAction = function(docId) {
    showToast('جاري إرسال الوثيقة لطابعة المحل بنجاح 🖨️');
    showToast('تمت إعادة الطباعة بنجاح دون خصم نقاط إضافية ✓');
  };

  window.editDocumentAction = function(docId, docType) {
    if (docType === 'cv') switchTab('cv');
    else if (docType === 'invoice') switchTab('invoice');
    else if (docType === 'photo') switchTab('photo');
    else if (docType === 'school') switchTab('school');
    else if (docType === 'tax') switchTab('tax');
    else switchTab('hub');
    showToast('تم فتح محرر الوثيقة لتعديل بيانات الزبون');
  };

  renderRecentDocuments();
}

// 25. نافذة العرض التوضيحي السريع (30-sec Interactive Walkthrough)
function initDemoWalkthroughUI() {
  const modal = document.getElementById('demoVideoModal');
  let currentSlide = 1;

  window.openDemoVideoModal = function() {
    if (modal) modal.classList.add('open');
    switchDemoSlide(1);
    if (window.sahlaAnalytics) sahlaAnalytics.track('demo_video_viewed');
  };

  window.closeDemoVideoModal = function() {
    if (modal) modal.classList.remove('open');
  };

  window.switchDemoSlide = function(num) {
    currentSlide = num;
    for (let i = 1; i <= 3; i++) {
      const c = document.getElementById(`demoStepContent${i}`);
      const d = document.getElementById(`demoDot${i}`);
      if (c) c.style.display = i === num ? 'block' : 'none';
      if (d) d.classList.toggle('active', i === num);
    }
    const btnNext = document.getElementById('btnNextDemoSlide');
    if (btnNext) {
      btnNext.textContent = num === 3 ? 'ابدأ مجاناً الآن 🚀' : 'التالي ←';
    }
  };

  window.nextDemoSlide = function() {
    if (currentSlide < 3) {
      switchDemoSlide(currentSlide + 1);
    } else {
      closeDemoVideoModal();
      openAuthModal('signup');
    }
  };

  window.prevDemoSlide = function() {
    if (currentSlide > 1) {
      switchDemoSlide(currentSlide - 1);
    }
  };
}

// 26. نافذة بدائل استلام كود التحقق (OTP Alternatives)
function initOtpHelpUI() {
  const modal = document.getElementById('otpHelpModal');
  const btnDidNotReceive = document.getElementById('btnDidNotReceiveCode');

  // إظهار زر البدائل بعد 30 ثانية من طلب الـ OTP
  window.addEventListener('sahla:otp-requested', () => {
    if (btnDidNotReceive) {
      btnDidNotReceive.style.display = 'none';
      setTimeout(() => {
        btnDidNotReceive.style.display = 'block';
      }, 30000);
    }
  });

  window.openOtpHelpModal = function() {
    if (modal) modal.classList.add('open');
  };

  window.closeOtpHelpModal = function() {
    if (modal) modal.classList.remove('open');
  };

  window.requestOtpViaWhatsApp = function() {
    closeOtpHelpModal();
    const phone = sahlaAuth.pendingOtp ? sahlaAuth.pendingOtp.formattedPhone : '';
    showToast(`تم إرسال كود التحقق إلى واتساب على الرقم ${phone}! (الكود: 123456) 💬`);
    const otpIn = document.getElementById('authOtpInput');
    if (otpIn) {
      otpIn.value = '123456';
      otpIn.focus();
    }
  };

  window.requestOtpViaVoiceCall = function() {
    closeOtpHelpModal();
    showToast('جاري الاتصال بك هاتفياً لإملاء رمز التحقق المكون من 6 أرقام... 📞');
    setTimeout(() => {
      showToast('رمز التحقق الصوتي هو: 1 2 3 4 5 6');
      const otpIn = document.getElementById('authOtpInput');
      if (otpIn) otpIn.value = '123456';
    }, 2000);
  };
}

// 27. نافذة الاحتفال بإنجاز أول وثيقة (Celebration Modal - PRD Section 6.3)
function initCelebrationUI() {
  const modal = document.getElementById('docCelebrationModal');
  const priceInput = document.getElementById('celebrationPriceInput');

  window.openCelebrationModal = function(docType = 'cv') {
    if (!modal) return;
    const defaultPrices = { cv: 250, invoice: 200, photo: 300, school: 400, tax: 1500 };
    if (priceInput) priceInput.value = defaultPrices[docType] || 250;
    modal.classList.add('open');
  };

  window.closeCelebrationModal = function() {
    if (modal) modal.classList.remove('open');
  };

  window.saveCelebrationPriceAndPWA = function() {
    const val = priceInput ? Number(priceInput.value) : 250;
    if (window.sahlaOnboarding) {
      sahlaOnboarding.state.defaultSalePrices.cv = val;
      sahlaOnboarding.markTask('pricesConfigured');
      sahlaOnboarding.saveState();
      sahlaOnboarding.markTask('pwaInstalled');
    }
    closeCelebrationModal();
    showToast(`تم حفظ سعر البيع الافتراضي (${val} دج) وتثبيت التطبيق على هاتفك بنجاح 🎉`);
    if (window.renderStarterChecklist) renderStarterChecklist();
  };
}

// 28. إدارة موظفي المحل (Staff Members UI - PRD Section 5.5)
function initStaffUI() {
  const drawer = document.getElementById('staffManagementDrawer');
  const container = document.getElementById('staffListContainer');
  const phoneInput = document.getElementById('staffPhoneInput');
  const roleSelect = document.getElementById('staffRoleSelect');

  window.toggleStaffDrawer = function() {
    if (!drawer) return;
    const isHidden = drawer.style.display === 'none';
    drawer.style.display = isHidden ? 'block' : 'none';
    if (isHidden) renderStaffList();
  };

  function renderStaffList() {
    if (!container || !window.sahlaAuth) return;
    const employees = sahlaAuth.getEmployees();
    if (employees.length === 0) {
      container.innerHTML = '<span style="font-size:11px; color:var(--text-muted); text-align:center; padding:4px 0;">لا يوجد موظفون مضافون حالياً</span>';
    } else {
      container.innerHTML = employees.map(emp => `
        <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-card); padding:6px 10px; border-radius:4px; font-size:11px;">
          <div>
            <strong>${emp.formattedPhone}</strong>
            <span style="color:var(--primary); font-size:10px;">(${emp.role === 'MANAGER' ? 'مدير' : 'موظف'})</span>
          </div>
          <button onclick="deleteEmployeeAction('${emp.phone}')" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:13px;" title="حذف الموظف">✕</button>
        </div>
      `).join('');
    }
  }

  window.addNewEmployeeAction = function() {
    if (!phoneInput) return;
    const phone = phoneInput.value;
    const role = roleSelect ? roleSelect.value : 'STAFF';
    const res = sahlaAuth.addEmployee(phone, role);
    if (res.success) {
      showToast(`تمت إضافة الموظف ${res.member.formattedPhone} بنجاح ✓`);
      phoneInput.value = '';
      renderStaffList();
    } else {
      showToast(res.error, 'error');
    }
  };

  window.deleteEmployeeAction = function(rawPhone) {
    if (confirm('هل أنت متأكد من حذف هذا الموظف من المحل؟')) {
      sahlaAuth.removeEmployee(rawPhone);
      renderStaffList();
      showToast('تم حذف الموظف بنجاح');
    }
  };

  window.logoutAllDevices = function() {
    if (confirm('هل أنت متأكد من تسجيل الخروج من كل الأجهزة النشطة؟')) {
      sahlaAuth.logoutAllDevices();
      closeAccountModal();
      showLandingView();
      showToast('تم تسجيل الخروج من كل الأجهزة بنجاح 🔒');
    }
  };
}

// 29. كشف وضع عدم الاتصال (Offline Detection - PRD Section 7.3)
function initOfflineDetection() {
  const banner = document.getElementById('offlineStatusBanner');

  function updateOnlineStatus() {
    if (!banner) return;
    if (!navigator.onLine) {
      banner.style.display = 'flex';
      showToast('أنت في وضع عدم الاتصال بالإنترنت', 'warning');
    } else {
      banner.style.display = 'none';
    }
  }

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();
}




