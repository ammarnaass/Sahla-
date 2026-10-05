/**
 * 🇩🇿 منصة سهلة (Sahla) - ثوابت التكوين الوطنية
 * Sahla Platform Configuration & Algerian National Constants (TypeScript Clean Architecture)
 */

export const CONFIG = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  SESSION_SECRET: process.env.SESSION_SECRET || "sahla_secure_secret_2026",
  SESSION_MAX_AGE: 30 * 24 * 60 * 60 * 1000, // 30 days
};

export const OPERATORS = {
  MOBILIS: { name: "Mobilis", nameAr: "موبيليس", prefix: ["06", "+2136", "2136"] },
  DJEZZY: { name: "Djezzy", nameAr: "جيزي", prefix: ["07", "+2137", "2137"] },
  OOREDOO: { name: "Ooredoo", nameAr: "أوريدو", prefix: ["05", "+2135", "2135"] },
} as const;

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN", // مدير النظام الوطني
  SHOP_ADMIN: "SHOP_ADMIN",   // صاحب / مدير المحل
  STAFF: "STAFF",             // موظف المحل لخدمة الزبائن
} as const;

export type UserRoleType = (typeof ROLES)[keyof typeof ROLES];

// SaaS Subscription Plans Definition
export interface SaaSPlan {
  id: "STARTER" | "PRO_KIOSK" | "ENTERPRISE";
  nameAr: string;
  nameFr: string;
  priceMonthlyDZD: number;
  priceYearlyDZD: number;
  monthlyPoints: number;
  maxDevices: number;
  maxStaff: number;
  isPopular?: boolean;
  features: string[];
}

export const SAAS_PLANS: SaaSPlan[] = [
  {
    id: "STARTER",
    nameAr: "البداية المجانية",
    nameFr: "Formule Débutant",
    priceMonthlyDZD: 0,
    priceYearlyDZD: 0,
    monthlyPoints: 50,
    maxDevices: 2,
    maxStaff: 1,
    features: [
      "50 نقطة تجريبية مجانية",
      "توليد السير الذاتية وصور الهوية",
      "جهاز كاونتر واحد + هاتف مسير",
      "دعم فني عبر البريد والمجتمع",
    ],
  },
  {
    id: "PRO_KIOSK",
    nameAr: "المكتبة الاحترافية",
    nameFr: "Kiosque & Librairie Pro",
    priceMonthlyDZD: 2500,
    priceYearlyDZD: 24000, // 20% discount
    monthlyPoints: 300,
    maxDevices: 5,
    maxStaff: 3,
    isPopular: true,
    features: [
      "300 نقطة شهرية مشمولة",
      "جميع قوالب الفواتير والـ OCR والتصاريح الجبائية G50",
      "ربط حتى 5 أجهزة وكاونترات متزامنة",
      "إدارة 3 موظفين مع حجب تقارير الأرباح",
      "جسر الطباعة اللاسلكي الفوري لطابعات الإيصالات",
      "تصدير فواتير تجارية رسمية ومطابقة قانونياً",
    ],
  },
  {
    id: "ENTERPRISE",
    nameAr: "السيبر والمطبعة الكبرى",
    nameFr: "Cyber & Imprimerie Entreprise",
    priceMonthlyDZD: 6000,
    priceYearlyDZD: 58000,
    monthlyPoints: 1000,
    maxDevices: 20,
    maxStaff: 10,
    features: [
      "1,000 نقطة شهرية مشمولة مع أسعار تفاضلية للشحن",
      "أجهزة كاونتر وموظفين غير محدودة للمحل",
      "لوحة قيادة مالية وتحليلات محاسبية فورية",
      "أولوية قصوى لمعالجة مستندات الـ OCR والبحوث",
      "خط دعم هاتفي وميداني مخصص للمحل 7/7",
      "امتياز شراء بطاقات التعبئة بالجملة بهامش ربح للموزع",
    ],
  },
];

export const DEFAULT_USERS = [
  {
    id: "user_super_admin",
    name: "مدير منصة سهلة المركزي",
    email: "admin@sahla.dz",
    secondaryEmail: "superadmin@gmail.com",
    phone: "0550000000",
    password: "Admin@2026!",
    role: ROLES.SUPER_ADMIN,
    shopId: null,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "user_shop_admin",
    name: "أحمد بن علي",
    email: "najah.kiosk@gmail.com",
    phone: "0555123456",
    password: "Shop@2026!",
    role: ROLES.SHOP_ADMIN,
    shopId: "shop_1",
    createdAt: "2026-02-15T00:00:00.000Z",
  },
  {
    id: "user_staff",
    name: "سفيان بلقاسم (موظف)",
    email: "staff.soufiane@gmail.com",
    phone: "0661998877",
    password: "Staff@2026!",
    role: ROLES.STAFF,
    shopId: "shop_1",
    createdAt: "2026-03-10T00:00:00.000Z",
  },
];

export const DEFAULT_SHOPS = [
  {
    id: "shop_1",
    name: "مكتبة النجاح الرقمية",
    owner: "أحمد بن علي",
    phone: "0555123456",
    wilaya: "16 - الجزائر العاصمة",
    wilayaCode: 16,
    activity: "KIOSK",
    plan: "PRO_KIOSK",
    points: 140,
    status: "ACTIVE",
    staff: [
      {
        id: "staff_1",
        name: "سفيان بلقاسم",
        phone: "0661998877",
        role: ROLES.STAFF,
        addedAt: "2026-03-10",
      },
    ],
  },
  {
    id: "shop_2",
    name: "سيبار الأمل وهران",
    owner: "عبد القادر بلحاج",
    phone: "0770112233",
    wilaya: "31 - وهران",
    wilayaCode: 31,
    activity: "CYBER",
    plan: "STARTER",
    points: 85,
    status: "ACTIVE",
    staff: [],
  },
  {
    id: "shop_3",
    name: "فضاء الخدمات الرقمية سطيف",
    owner: "مراد قرفي",
    phone: "0660445566",
    wilaya: "19 - سطيف",
    wilayaCode: 19,
    activity: "PUBLIC_WRITER",
    plan: "PRO_KIOSK",
    points: 210,
    status: "ACTIVE",
    staff: [],
  },
];
