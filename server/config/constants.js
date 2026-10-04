/**
 * 🇩🇿 منصة سهلة (Sahla) - ثوابت التكوين الوطنية
 * Sahla Platform Configuration & Algerian National Constants
 */

module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  SESSION_SECRET: process.env.SESSION_SECRET || 'sahla_secure_secret_2026',
  SESSION_MAX_AGE: 30 * 24 * 60 * 60 * 1000, // 30 days

  // شبكات الاتصال الجزائرية
  OPERATORS: {
    MOBILIS: { name: 'Mobilis', nameAr: 'موبيليس', prefix: ['06', '+2136', '2136'] },
    DJEZZY: { name: 'Djezzy', nameAr: 'جيزي', prefix: ['07', '+2137', '2137'] },
    OOREDOO: { name: 'Ooredoo', nameAr: 'أوريدو', prefix: ['05', '+2135', '2135'] }
  },

  // أدوار المستخدمين المعمارية (RBAC)
  ROLES: {
    SUPER_ADMIN: 'SUPER_ADMIN', // مدير النظام الوطني
    SHOP_ADMIN: 'SHOP_ADMIN',   // صاحب / مدير المحل
    STAFF: 'STAFF'              // موظف المحل لخدمة الزبائن
  },

  // الحسابات الافتراضية المعتمدة
  DEFAULT_USERS: [
    {
      id: 'user_super_admin',
      name: 'مدير منصة سهلة المركزي',
      phone: '0550000000',
      role: 'SUPER_ADMIN',
      shopId: null,
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 'user_shop_admin',
      name: 'أحمد بن علي',
      phone: '0555123456',
      role: 'SHOP_ADMIN',
      shopId: 'shop_1',
      createdAt: '2026-02-15T00:00:00.000Z'
    },
    {
      id: 'user_staff',
      name: 'سفيان بلقاسم (موظف)',
      phone: '0661998877',
      role: 'STAFF',
      shopId: 'shop_1',
      createdAt: '2026-03-10T00:00:00.000Z'
    }
  ],

  // المحلات الافتراضية
  DEFAULT_SHOPS: [
    {
      id: 'shop_1',
      name: 'مكتبة النجاح الرقمية',
      owner: 'أحمد بن علي',
      phone: '0555123456',
      wilaya: '16 - الجزائر العاصمة',
      wilayaCode: 16,
      activity: 'KIOSK',
      points: 140,
      status: 'ACTIVE',
      staff: [
        {
          id: 'staff_1',
          name: 'سفيان بلقاسم',
          phone: '0661998877',
          role: 'STAFF',
          addedAt: '2026-03-10'
        }
      ]
    },
    {
      id: 'shop_2',
      name: 'سيبار الأمل وهران',
      owner: 'عبد القادر بلحاج',
      phone: '0770112233',
      wilaya: '31 - وهران',
      wilayaCode: 31,
      activity: 'CYBER',
      points: 85,
      status: 'ACTIVE',
      staff: []
    },
    {
      id: 'shop_3',
      name: 'فضاء الخدمات الرقمية سطيف',
      owner: 'مراد قرفي',
      phone: '0660445566',
      wilaya: '19 - سطيف',
      wilayaCode: 19,
      activity: 'PUBLIC_WRITER',
      points: 210,
      status: 'ACTIVE',
      staff: []
    }
  ],

  // ولايات الجزائر الـ 58
  WILAYAS: [
    "01 - أدرار", "02 - الشلف", "03 - الأغواط", "04 - أم البواقي", "05 - باتنة",
    "06 - بجاية", "07 - بسكرة", "08 - بشار", "09 - البليدة", "10 - البويرة",
    "11 - تمنراست", "12 - تبسة", "13 - تلمسان", "14 - تيارت", "15 - تيزي وزو",
    "16 - الجزائر العاصمة", "17 - الجلفة", "18 - جيجل", "19 - سطيف", "20 - سعيدة",
    "21 - سكيكدة", "22 - سيدي بلعباس", "23 - عنابة", "24 - قالمة", "25 - قسنطينة",
    "26 - المدية", "27 - مستغانم", "28 - المسيلة", "29 - معسكر", "30 - ورقلة",
    "31 - وهران", "32 - البيض", "33 - إليزي", "34 - برج بوعريريج", "35 - بومرداس",
    "36 - الطارف", "37 - تندوف", "38 - تسمسيلت", "39 - الوادي", "40 - خنشلة",
    "41 - سوق أهراس", "42 - تيبازة", "43 - ميلة", "44 - عين الدفلى", "45 - النعامة",
    "46 - عين تموشنت", "47 - غرداية", "48 - غليزان", "49 - تيميمون", "50 - برج باجي مختار",
    "51 - أولاد جلال", "52 - بني عباس", "53 - عين صالح", "54 - عين قزام", "55 - تقرت",
    "56 - جانت", "57 - المغير", "58 - المنيعة"
  ],

  // قائمة أسعار الخدمات بالنقاط
  SERVICE_RATES: {
    CV_GEN: { name: 'سيرة ذاتية احترافية', cost: 10, defaultPriceDZD: 250 },
    INVOICE_PDF: { name: 'فاتورة تجارية مطابقة', cost: 10, defaultPriceDZD: 300 },
    PHOTO_ID: { name: 'معالجة صور الهوية والبيومترية', cost: 8, defaultPriceDZD: 200 },
    UNEMPLOY_FORM: { name: 'استمارة منحة البطالة (Wassit)', cost: 5, defaultPriceDZD: 150 },
    TAX_G50: { name: 'مساعد التصريح الجبائي G50', cost: 15, defaultPriceDZD: 500 },
    RENTAL_CONTRACT: { name: 'عقد إيجار معياري', cost: 12, defaultPriceDZD: 350 },
    REPRINT_DOC: { name: 'إعادة طباعة وثيقة', cost: 0, defaultPriceDZD: 50 }
  }
};
