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

// ─── Super Admin Granular Roles & Permissions (RBAC) ───
export const ADMIN_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",                 // مدير النظام العام السيادي
  OPERATIONS_ADMIN: "OPERATIONS_ADMIN",       // مدير شبكة الأكشاك والعمليات
  FINANCE_ADMIN: "FINANCE_ADMIN",             // المدير المالي وعقود B2B
  AI_OPS_ADMIN: "AI_OPS_ADMIN",               // مسؤول عمليات الذكاء الاصطناعي
  SECURITY_AUDITOR: "SECURITY_AUDITOR",       // مشرف الأمان والتدقيق
  REGIONAL_SUPERVISOR: "REGIONAL_SUPERVISOR", // مشرف جهوي إقليمي
} as const;

export type AdminRoleType = (typeof ADMIN_ROLES)[keyof typeof ADMIN_ROLES];

export const ADMIN_PERMISSIONS = {
  VIEW_ANALYTICS: "analytics:view",
  VIEW_DEEP_METRICS: "analytics:deep_metrics",
  MANAGE_SHOPS: "shops:manage",
  TOPUP_SHOP_POINTS: "shops:topup_points",
  MANAGE_INVOICES: "invoices:manage",
  MANAGE_WHOLESALE_CARDS: "wholesale:manage",
  MANAGE_AI_PROVIDERS: "ai:manage_providers",
  MANAGE_AI_CONTENT: "ai:manage_content",
  MANAGE_ADMINS: "admins:manage",
  RESET_ADMIN_PASS: "admins:reset_password",
  VIEW_AUDIT_LOGS: "audit:view_logs",
  SEND_BROADCAST: "broadcast:send",
} as const;

export type AdminPermissionType = (typeof ADMIN_PERMISSIONS)[keyof typeof ADMIN_PERMISSIONS];

export interface AdminRoleMeta {
  role: AdminRoleType;
  titleAr: string;
  descriptionAr: string;
  badgeColor: string;
  iconName: string;
  defaultPermissions: AdminPermissionType[];
}

export const ADMIN_ROLES_META: Record<AdminRoleType, AdminRoleMeta> = {
  SUPER_ADMIN: {
    role: "SUPER_ADMIN",
    titleAr: "مدير النظام العام (سيادي)",
    descriptionAr: "صلاحيات سيادية كاملة على كافة أركان المنصة والـ 58 ولاية وإعدادات الـ AI والمالية والأمان.",
    badgeColor: "amber",
    iconName: "Crown",
    defaultPermissions: Object.values(ADMIN_PERMISSIONS),
  },
  OPERATIONS_ADMIN: {
    role: "OPERATIONS_ADMIN",
    titleAr: "مدير العمليات وشبكة الأكشاك",
    descriptionAr: "متابعة وتفعيل وتجميد الأكشاك في كافة الولايات، شحن النقاط الميدانية، وإرسال البث الوطني.",
    badgeColor: "emerald",
    iconName: "Store",
    defaultPermissions: [
      ADMIN_PERMISSIONS.VIEW_ANALYTICS,
      ADMIN_PERMISSIONS.MANAGE_SHOPS,
      ADMIN_PERMISSIONS.TOPUP_SHOP_POINTS,
      ADMIN_PERMISSIONS.SEND_BROADCAST,
    ],
  },
  FINANCE_ADMIN: {
    role: "FINANCE_ADMIN",
    titleAr: "المدير المالي وعقود B2B",
    descriptionAr: "إدارة الفواتير التجارية الرسمية، عقود الاشتراكات، دفعات كروت الشحن بالجملة، وتتبع المداخيل.",
    badgeColor: "blue",
    iconName: "CreditCard",
    defaultPermissions: [
      ADMIN_PERMISSIONS.VIEW_ANALYTICS,
      ADMIN_PERMISSIONS.VIEW_DEEP_METRICS,
      ADMIN_PERMISSIONS.MANAGE_INVOICES,
      ADMIN_PERMISSIONS.MANAGE_WHOLESALE_CARDS,
    ],
  },
  AI_OPS_ADMIN: {
    role: "AI_OPS_ADMIN",
    titleAr: "مسؤول الذكاء الاصطناعي والمحتوى",
    descriptionAr: "إدارة وفحص مزودي الـ AI (Ping)، توجيه النماذج، وضبط محتوى استوديو البحوث وبنوك الأسئلة.",
    badgeColor: "purple",
    iconName: "Brain",
    defaultPermissions: [
      ADMIN_PERMISSIONS.VIEW_ANALYTICS,
      ADMIN_PERMISSIONS.MANAGE_AI_PROVIDERS,
      ADMIN_PERMISSIONS.MANAGE_AI_CONTENT,
    ],
  },
  SECURITY_AUDITOR: {
    role: "SECURITY_AUDITOR",
    titleAr: "مشرف الأمان والتدقيق",
    descriptionAr: "مراجعة سجلات التدقيق الأمني (Audit Logs)، مراقبة محاولات الدخول، وإعادة تعيين كلمات المرور.",
    badgeColor: "orange",
    iconName: "ShieldAlert",
    defaultPermissions: [
      ADMIN_PERMISSIONS.VIEW_AUDIT_LOGS,
      ADMIN_PERMISSIONS.RESET_ADMIN_PASS,
    ],
  },
  REGIONAL_SUPERVISOR: {
    role: "REGIONAL_SUPERVISOR",
    titleAr: "مشرف جهوي إقليمي",
    descriptionAr: "متابعة شبكة الأكشاك والتنسيق الميداني ضمن نطاق ولايات جغرافية محددة.",
    badgeColor: "cyan",
    iconName: "MapPin",
    defaultPermissions: [
      ADMIN_PERMISSIONS.VIEW_ANALYTICS,
      ADMIN_PERMISSIONS.MANAGE_SHOPS,
      ADMIN_PERMISSIONS.TOPUP_SHOP_POINTS,
    ],
  },
};


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
    adminRole: "SUPER_ADMIN",
    status: "ACTIVE",
    isRoot: true,
    shopId: null,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "admin_ops_1",
    name: "كريم بلقاسم",
    email: "ops.karim@sahla.dz",
    phone: "0551223344",
    password: "Admin@2026!",
    role: ROLES.SUPER_ADMIN,
    adminRole: "OPERATIONS_ADMIN",
    status: "ACTIVE",
    isRoot: false,
    shopId: null,
    createdAt: "2026-02-01T10:00:00.000Z",
  },
  {
    id: "admin_fin_1",
    name: "ليلى سلطاني",
    email: "finance.leila@sahla.dz",
    phone: "0552334455",
    password: "Admin@2026!",
    role: ROLES.SUPER_ADMIN,
    adminRole: "FINANCE_ADMIN",
    status: "ACTIVE",
    isRoot: false,
    shopId: null,
    createdAt: "2026-02-10T14:30:00.000Z",
  },
  {
    id: "admin_ai_1",
    name: "أمين زياني",
    email: "ai.amine@sahla.dz",
    phone: "0553445566",
    password: "Admin@2026!",
    role: ROLES.SUPER_ADMIN,
    adminRole: "AI_OPS_ADMIN",
    status: "ACTIVE",
    isRoot: false,
    shopId: null,
    createdAt: "2026-02-20T09:15:00.000Z",
  },
  {
    id: "admin_sec_1",
    name: "هشام مزيان",
    email: "security.hichem@sahla.dz",
    phone: "0554556677",
    password: "Admin@2026!",
    role: ROLES.SUPER_ADMIN,
    adminRole: "SECURITY_AUDITOR",
    status: "ACTIVE",
    isRoot: false,
    shopId: null,
    createdAt: "2026-03-01T11:45:00.000Z",
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
    staff: [],
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
