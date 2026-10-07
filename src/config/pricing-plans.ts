export interface PricingFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  popular?: boolean;
  badge?: string;
  features: PricingFeature[];
  ctaText: string;
  ctaHref: string;
  ctaVariant: "contained" | "outlined";
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "باقة البداية (Starter)",
    subtitle: "مجاناً للأبد",
    description: "مثالية للأكشاك الصغيرة والمكتبات المبتدئة لتجربة المنظومة واستكشاف الفوائد بدون التزام مالي.",
    monthlyPrice: 0,
    annualPrice: 0,
    popular: false,
    badge: "مجاناً للأبد",
    ctaText: "ابدأ مجاناً الآن",
    ctaHref: "/register",
    ctaVariant: "outlined",
    features: [
      { text: "50 صفحة طباعة مجانية شهرياً", included: true },
      { text: "ربط طابعة محلية واحدة (USB)", included: true },
      { text: "رمز QR ذكي لاستقبال الوثائق", included: true },
      { text: "حذف آمن للوثائق بعد 24 ساعة", included: true },
      { text: "نقطة بيع وجرد المخزون POS", included: false },
      { text: "دعم فني مخصص ذو أولوية", included: false },
    ],
  },
  {
    id: "pro",
    name: "باقة المحترف (Pro)",
    subtitle: "الأكثر طلباً للمحلات",
    description: "الخيار الشامل للأكشاك والمكتبات النشطة لزيادة المداخيل وإلغاء طوابير الانتظار نهائياً.",
    monthlyPrice: 2500,
    annualPrice: 2000, // Monthly equivalent when billed annually (24,000 DZD/year)
    popular: true,
    badge: "أفضل قيمة ⭐",
    ctaText: "اشترك الآن وجرّب 14 يوماً مجاناً",
    ctaHref: "/register",
    ctaVariant: "contained",
    features: [
      { text: "طباعة غير محدودة بدون قيود", included: true, highlight: true },
      { text: "ربط حتى 3 طابعات (USB + Wi-Fi)", included: true },
      { text: "نقطة بيع POS وإدارة المخزون والسلع", included: true },
      { text: "تقارير مالية يومية وأرباح لحظية", included: true },
      { text: "ملصقات QR مطبوعة مجاناً لمحلّك", included: true },
      { text: "دعم فني ذو أولوية عبر الواتساب والهاتف", included: true },
    ],
  },
  {
    id: "enterprise",
    name: "باقة الفروع الكبرى (Enterprise)",
    subtitle: "مخصصة للشبكات",
    description: "للمراكز الكبرى، مكاتب الطباعة الجامعية، والشبكات ذات الفروع المتعددة والموظفين.",
    monthlyPrice: 6500,
    annualPrice: 5500, // Monthly equivalent when billed annually (66,000 DZD/year)
    popular: false,
    badge: "للشبكات والمراكز الكبرى",
    ctaText: "تواصل مع المبيعات / انضم",
    ctaHref: "/register",
    ctaVariant: "outlined",
    features: [
      { text: "طابعات وفروع غير محدودة", included: true },
      { text: "حسابات متعددة للموظفين مع صلاحيات", included: true },
      { text: "تخصيص كامل للشعار والهوية البصرية", included: true },
      { text: "ربط API مخصص بأنظمة خارجية", included: true },
      { text: "مدير حساب VIP مخصص 24/7", included: true },
      { text: "فاتورة رسمية وعقد قانوني معتمد", included: true },
    ],
  },
];
