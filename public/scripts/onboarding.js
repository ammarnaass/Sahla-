// Sahla Onboarding & Dashboard Personalization Manager (إدارة تجربة أول دخول وقائمة مهام البداية)
// Handles 3-step first-time onboarding, service preferences, and starter checklist.

class OnboardingManager {
  constructor() {
    this.storageKey = 'sahla_onboarding_state';
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load onboarding state', e);
    }
    return {
      completed: false,
      step: 1,
      selectedServices: ['cv', 'invoice', 'id-photo', 'school'],
      defaultSalePrices: {
        cv: 250,
        photo: 300,
        invoice: 200,
        school: 400,
        tax: 1500
      },
      checklist: {
        accountCreated: true,
        firstDocCreated: false,
        pricesConfigured: false,
        pwaInstalled: false,
        firstRecharge: false
      }
    };
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
      window.dispatchEvent(new CustomEvent('sahla:onboarding-updated', { detail: this.state }));
    } catch (e) {
      console.error('Failed to save onboarding state', e);
    }
  }

  isCompleted() {
    return this.state.completed;
  }

  setStep(stepNumber) {
    this.state.step = stepNumber;
    this.saveState();
  }

  setSelectedServices(servicesList) {
    this.state.selectedServices = servicesList;
    this.saveState();
    this.applyServiceOrder();
  }

  completeOnboarding() {
    this.state.completed = true;
    this.saveState();
  }

  skipOnboarding() {
    this.state.completed = true;
    this.saveState();
  }

  // وضع علامة إتمام على مهمة من قائمة مهام البداية
  markTask(taskKey) {
    if (this.state.checklist[taskKey] !== undefined) {
      this.state.checklist[taskKey] = true;
      this.saveState();
    }
  }

  // التحقق إن كانت جميع مهام البداية قد اكتملت
  isChecklistAllDone() {
    const cl = this.state.checklist;
    return cl.accountCreated && cl.firstDocCreated && cl.pricesConfigured && cl.pwaInstalled;
  }

  // إعادة ترتيب خدمات لوحة التحكم بحسب ما يقدمه المحل
  applyServiceOrder() {
    const grid = document.querySelector('.services-quick-grid');
    if (!grid || !this.state.selectedServices || this.state.selectedServices.length === 0) return;

    const cards = Array.from(grid.children);
    cards.forEach(card => {
      // البحث عن فئة الكارت
      const match = this.state.selectedServices.some(s => card.className.includes(`card-${s}`));
      if (match) {
        card.style.order = '-1';
        card.style.borderColor = 'var(--primary)';
      } else {
        card.style.order = '1';
        card.style.borderColor = 'var(--border-color)';
      }
    });
  }

  // توليد HTML بطاقة قائمة مهام البداية (Starter Checklist)
  renderChecklistHTML() {
    if (this.isChecklistAllDone()) {
      return ''; // تختفي عند اكتمالها بالكامل وفق الـ PRD
    }

    const cl = this.state.checklist;

    const items = [
      { key: 'accountCreated', label: 'إنشاء حساب المحل والحصول على 50 نقطة تجريبية', done: cl.accountCreated },
      { key: 'firstDocCreated', label: 'إنجاز أول وثيقة لزبونك وتجربة الطباعة الفورية', done: cl.firstDocCreated, action: "switchTab('cv')" },
      { key: 'pricesConfigured', label: 'تحديد وضبط أسعار البيع الافتراضية في دفتر المحل', done: cl.pricesConfigured, action: "openPricingConfigModal()" },
      { key: 'pwaInstalled', label: 'تثبيت تطبيق سهلة على الشاشة الرئيسية لهاتفك', done: cl.pwaInstalled, action: "triggerPwaInstall()" },
      { key: 'firstRecharge', label: 'تجربة شحن المحفظة ببطاقة تعبئة أو الدفع الإلكتروني', done: cl.firstRecharge, action: "openWalletModal()" }
    ];

    const completedCount = items.filter(i => i.done).length;
    const progressPercent = Math.round((completedCount / items.length) * 100);

    return `
      <div class="starter-checklist-card">
        <div class="checklist-header">
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="checklist-icon-box">🎯</div>
            <div>
              <h4>قائمة مهام البداية السريعة</h4>
              <p>أكمل هذه الخطوات الخمس لتحقيق أقصى استفادة وأعلى ربح لمحلك</p>
            </div>
          </div>
          <div class="checklist-progress-pill">
            <span>${completedCount} من 5 مكتملة (${progressPercent}%)</span>
          </div>
        </div>

        <div class="checklist-progress-bar-wrap">
          <div class="checklist-progress-bar-fill" style="width: ${progressPercent}%;"></div>
        </div>

        <div class="checklist-items-grid">
          ${items.map(item => `
            <div class="checklist-item-row ${item.done ? 'is-done' : ''}">
              <div class="checklist-checkbox" onclick="sahlaOnboarding.markTask('${item.key}')">
                ${item.done ? '✓' : ''}
              </div>
              <span class="checklist-item-label">${item.label}</span>
              ${!item.done && item.action ? `
                <button class="btn-action checklist-action-btn" onclick="${item.action}">
                  <span>إنجاز الآن ←</span>
                </button>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

window.sahlaOnboarding = new OnboardingManager();
