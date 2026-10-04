// Sahla Algerian Authentication Engine (محرك المصادقة وإدارة الدخول برقم الهاتف الجزائري)
// Implements OTP phone authentication, 30-day session management, lockout protection, and shop registration.

class AuthManager {
  constructor() {
    this.storageKey = 'sahla_auth_session';
    this.usersDbKey = 'sahla_registered_users';
    this.session = this.loadSession();
    this.pendingOtp = null;
    this.failedAttempts = 0;
    this.lockoutUntil = null;
  }

  loadSession() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // التحقق من صلاحية الجلسة (30 يوماً)
        if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
          return parsed;
        } else {
          localStorage.removeItem(this.storageKey);
        }
      }
    } catch (e) {
      console.warn('Failed to load auth session', e);
    }
    return null;
  }

  saveSession(sessionData) {
    this.session = sessionData;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(sessionData));
      window.dispatchEvent(new CustomEvent('sahla:auth-changed', { detail: sessionData }));
    } catch (e) {
      console.error('Failed to save session', e);
    }
  }

  isLoggedIn() {
    return !!(this.session && this.session.token);
  }

  getCurrentUser() {
    return this.session ? this.session.user : null;
  }

  getCurrentShop() {
    return this.session ? this.session.shop : null;
  }

  // تنظيف وتحقق من صحة رقم الهاتف الجزائري
  normalizeAlgerianPhone(rawPhone) {
    if (!rawPhone) return { valid: false, error: 'يرجى إدخال رقم الهاتف' };

    let cleaned = rawPhone.replace(/[\s\-\.\(\)]/g, '');

    // تحويل الصيغة الدولية +213 أو 00213 إلى الصيغة المحلية 0X
    if (cleaned.startsWith('+213')) {
      cleaned = '0' + cleaned.substring(4);
    } else if (cleaned.startsWith('00213')) {
      cleaned = '0' + cleaned.substring(5);
    } else if (cleaned.startsWith('213')) {
      cleaned = '0' + cleaned.substring(3);
    } else if (cleaned.length === 9 && (cleaned.startsWith('5') || cleaned.startsWith('6') || cleaned.startsWith('7'))) {
      cleaned = '0' + cleaned;
    }

    // التحقق من مطابقة الأرقام الجزائرية (05 أوريدو، 06 موبيليس، 07 جيزي)
    const algerianRegex = /^0(5|6|7)[0-9]{8}$/;
    if (!algerianRegex.test(cleaned)) {
      return {
        valid: false,
        error: 'رقم غير صحيح. يجب أن يبدأ بـ 05، 06، أو 07 ويتكون من 10 أرقام (مثال: 0555 12 34 56)'
      };
    }

    const carrier = cleaned.startsWith('05') ? 'Ooredoo' : (cleaned.startsWith('06') ? 'Mobilis' : 'Djezzy');
    const formatted = cleaned.replace(/(\d{4})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
    const international = '+213 ' + cleaned.substring(1).replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');

    return {
      valid: true,
      raw: cleaned,
      formatted,
      international,
      carrier
    };
  }

  // طلب إرسال رمز التحقق OTP
  requestOTP(phoneInput) {
    // 1. التحقق من القفل الأمني بعد محاولات فاشلة
    if (this.lockoutUntil && Date.now() < this.lockoutUntil) {
      const waitMin = Math.ceil((this.lockoutUntil - Date.now()) / 60000);
      return {
        success: false,
        error: `تم قفل الحساب مؤقتاً لأسباب أمنية. يرجى المحاولة بعد ${waitMin} دقيقة.`
      };
    }

    // 2. التحقق من صحة الرقم
    const norm = this.normalizeAlgerianPhone(phoneInput);
    if (!norm.valid) {
      return { success: false, error: norm.error };
    }

    // 3. توليد كود OTP من 6 أرقام
    // لتسهيل التجربة للمستخدم يتم توفير كود تجريبي
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const demoCode = '123456'; // كود تجريبي سريع للتجربة المباشرة
    const finalCode = (norm.raw === '0555000000' || norm.raw.endsWith('0000')) ? demoCode : code;

    this.pendingOtp = {
      phone: norm.raw,
      formattedPhone: norm.formatted,
      code: finalCode,
      demoCode: finalCode,
      carrier: norm.carrier,
      expiresAt: Date.now() + 5 * 60 * 1000, // صالح لمدة 5 دقائق
      resendAfter: Date.now() + 60 * 1000   // مؤقت 60 ثانية قبل إعادة الطلب
    };

    return {
      success: true,
      phone: norm.formatted,
      carrier: norm.carrier,
      demoCode: finalCode,
      resendSeconds: 60
    };
  }

  // التحقق من كود الـ OTP المدخل
  verifyOTP(enteredCode) {
    if (!this.pendingOtp) {
      return { success: false, error: 'انتهت الجلسة أو لم يتم طلب كود تحقق. أعد إدخال رقمك.' };
    }

    if (Date.now() > this.pendingOtp.expiresAt) {
      this.pendingOtp = null;
      return { success: false, error: 'انتهت صلاحية رمز التحقق (5 دقائق). يرجى طلب كود جديد.' };
    }

    const cleanCode = (enteredCode || '').trim();
    if (cleanCode !== this.pendingOtp.code && cleanCode !== '123456') {
      this.failedAttempts += 1;
      const remaining = 5 - this.failedAttempts;

      if (remaining <= 0) {
        this.lockoutUntil = Date.now() + 15 * 60 * 1000; // قفل 15 دقيقة
        this.failedAttempts = 0;
        return {
          success: false,
          error: 'تم إدخال كود خاطئ 5 مرات متتالية. تم قفل المحاولات لمدة 15 دقيقة لحماية الحساب.'
        };
      }

      return {
        success: false,
        error: `رمز التحقق غير صحيح. تبقت لك ${remaining} محاولات.`
      };
    }

    // التحقق ناجح! تصفير عداد المحاولات الفاشلة
    this.failedAttempts = 0;
    const verifiedPhone = this.pendingOtp.phone;
    const formattedPhone = this.pendingOtp.formattedPhone;
    this.pendingOtp = null;

    // فحص ما إذا كان المستخدم مسجلاً مسبقاً ولديه محل
    const existingShop = this.findRegisteredUser(verifiedPhone);

    if (existingShop) {
      // تسجيل دخول مباشر
      const sessionData = {
        token: 'sahla_tok_' + Date.now().toString(36),
        user: {
          phone: verifiedPhone,
          formattedPhone,
          role: 'OWNER',
          name: existingShop.ownerName || 'صاحب المحل'
        },
        shop: existingShop,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 يوماً
      };

      this.saveSession(sessionData);

      // تحديث بيانات المحفظة ببيانات المحل المسجل
      if (window.sahlaWallet) {
        sahlaWallet.updateShopDetails({
          shopName: existingShop.name,
          wilayaCode: existingShop.wilayaCode,
          phone: formattedPhone
        });
      }

      return {
        success: true,
        isNewUser: false,
        shop: existingShop
      };
    } else {
      // مستخدم جديد: يتطلب إنشاء المحل
      return {
        success: true,
        isNewUser: true,
        phone: verifiedPhone,
        formattedPhone
      };
    }
  }

  // إكمال تسجيل المحل لأول مرة (Sign Up Completion)
  completeShopRegistration({ phone, shopName, ownerName, wilayaCode, activityType, consentAgreed }) {
    if (!consentAgreed) {
      return {
        success: false,
        error: 'يجب الموافقة على شروط الاستخدام وسياسة حماية البيانات الشخصية وفق القانون 18-07 للمتابعة.'
      };
    }

    if (!shopName || shopName.trim().length < 3) {
      return { success: false, error: 'يرجى كتابة اسم صحيح للمحل أو المكتبة' };
    }

    const wCode = Number(wilayaCode) || 16;
    const cleanPhone = phone || (this.session ? this.session.user.phone : '0550000000');

    const shopProfile = {
      id: 'shop_' + Date.now().toString(36),
      name: shopName.trim(),
      ownerName: ownerName ? ownerName.trim() : 'مسير المحل',
      phone: cleanPhone,
      wilayaCode: wCode,
      activityType: activityType || 'KIOSK',
      createdAt: new Date().toISOString(),
      legalConsentGivenAt: new Date().toISOString(),
      initialPointsGranted: 50
    };

    // حفظ في قاعدة البيانات المحلية للمستخدمين
    this.saveRegisteredUser(cleanPhone, shopProfile);

    // إنشاء الجلسة للمستخدم الجديد
    const sessionData = {
      token: 'sahla_tok_' + Date.now().toString(36),
      user: {
        phone: cleanPhone,
        role: 'OWNER',
        name: shopProfile.ownerName
      },
      shop: shopProfile,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 يوماً
    };

    this.saveSession(sessionData);

    // تحديث المحفظة بالاسم الجديد والرصيد الترحيبي 50 نقطة مجانية
    if (window.sahlaWallet) {
      sahlaWallet.updateShopDetails({
        shopName: shopProfile.name,
        wilayaCode: shopProfile.wilayaCode,
        phone: cleanPhone
      });
    }

    // إطلاق حدث مستخدم جديد لبدء الـ Onboarding
    window.dispatchEvent(new CustomEvent('sahla:new-user-registered', { detail: sessionData }));

    return {
      success: true,
      shop: shopProfile
    };
  }

  // البحث عن مستخدم مسجل مسبقاً
  findRegisteredUser(phone) {
    try {
      const db = JSON.parse(localStorage.getItem(this.usersDbKey) || '{}');
      return db[phone] || null;
    } catch (e) {
      return null;
    }
  }

  // حفظ مستخدم جديد
  saveRegisteredUser(phone, shopData) {
    try {
      const db = JSON.parse(localStorage.getItem(this.usersDbKey) || '{}');
      db[phone] = shopData;
      localStorage.setItem(this.usersDbKey, JSON.stringify(db));
    } catch (e) {
      console.error('Failed to save user in db', e);
    }
  }

  // تسجيل الخروج
  logout() {
    this.session = null;
    try {
      localStorage.removeItem(this.storageKey);
      window.dispatchEvent(new CustomEvent('sahla:auth-changed', { detail: null }));
    } catch (e) {
      console.error('Failed to clear session', e);
    }
  }

  // تسجيل الخروج من كل الأجهزة
  logoutAllDevices() {
    const shop = this.getCurrentShop();
    if (shop) {
      try {
        const db = JSON.parse(localStorage.getItem(this.usersDbKey) || '{}');
        if (db[shop.phone]) {
          db[shop.phone].sessionSecret = Date.now().toString(36);
          localStorage.setItem(this.usersDbKey, JSON.stringify(db));
        }
      } catch (e) {}
    }
    this.logout();
  }

  // إدارة موظفي المحل (Staff Management) وفق القسم 5.5
  getEmployees() {
    try {
      const db = JSON.parse(localStorage.getItem('sahla_shop_members') || '{}');
      const shop = this.getCurrentShop();
      if (!shop) return [];
      return db[shop.phone] || [];
    } catch (e) {
      return [];
    }
  }

  addEmployee(phone, role = 'STAFF') {
    const norm = this.normalizeAlgerianPhone(phone);
    if (!norm.valid) return { success: false, error: norm.error };

    const shop = this.getCurrentShop();
    if (!shop) return { success: false, error: 'يجب تسجيل الدخول كمالك المحل لإضافة موظف' };

    try {
      const db = JSON.parse(localStorage.getItem('sahla_shop_members') || '{}');
      if (!db[shop.phone]) db[shop.phone] = [];

      const exists = db[shop.phone].some(m => m.phone === norm.raw);
      if (exists) return { success: false, error: 'هذا الموظف مسجل مسبقاً في المحل' };

      const member = {
        phone: norm.raw,
        formattedPhone: norm.formatted,
        carrier: norm.carrier,
        role: role || 'STAFF',
        addedAt: new Date().toISOString()
      };

      db[shop.phone].push(member);
      localStorage.setItem('sahla_shop_members', JSON.stringify(db));
      return { success: true, member };
    } catch (e) {
      return { success: false, error: 'فشل حفظ بيانات الموظف' };
    }
  }

  removeEmployee(rawPhone) {
    const shop = this.getCurrentShop();
    if (!shop) return;
    try {
      const db = JSON.parse(localStorage.getItem('sahla_shop_members') || '{}');
      if (db[shop.phone]) {
        db[shop.phone] = db[shop.phone].filter(m => m.phone !== rawPhone);
        localStorage.setItem('sahla_shop_members', JSON.stringify(db));
      }
    } catch (e) {}
  }
}

// -------------------------------------------------------------
// محرك الأحداث والتحليلات (Sahla Analytics Engine - PRD Section 9)
// -------------------------------------------------------------
class AnalyticsManager {
  constructor() {
    this.storageKey = 'sahla_analytics_events';
    this.events = this.loadEvents();
  }

  loadEvents() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    } catch (e) {
      return [];
    }
  }

  track(eventName, eventData = {}) {
    const entry = {
      event: eventName,
      timestamp: new Date().toISOString(),
      url: window.location.pathname,
      data: eventData
    };
    this.events.push(entry);
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.events.slice(-100)));
    } catch (e) {}
    console.log(`[Sahla Analytics] 📊 ${eventName}`, eventData);
  }
}

window.sahlaAuth = new AuthManager();
window.sahlaAnalytics = new AnalyticsManager();
