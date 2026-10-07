export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: "Printer" | "ShieldCheck" | "CreditCard" | "Store" | "TrendingUp" | "Zap";
  colorClass: string;
}

export const platformFeatures: FeatureItem[] = [
  {
    id: "cloud-printing",
    title: "طباعة سحابية حرارية ولاسلكية",
    description: "اربط طابعتك العادية (USB أو Wi-Fi) ببرنامج الجسر السريع واطبع ملفات الزبائن مباشرة دون الحاجة لنقلها بحاسوبك الشخصي.",
    iconName: "Printer",
    colorClass: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  },
  {
    id: "legal-protection",
    title: "حماية تامة ومطابقة القانون 18-07",
    description: "تشفير كامل للوثائق العائلية والملفات الحساسة مع حذف تلقائي نهائي بعد انقضاء الوقت المحدد دون ترك أي أثر في حاسوبك.",
    iconName: "ShieldCheck",
    colorClass: "text-teal-600 dark:text-teal-400 bg-teal-500/10",
  },
  {
    id: "easy-recharge",
    title: "شحن رصيد سهل (الذهبية / CIB / كروت)",
    description: "اشحن نقاط كاونترك بالبطاقة الذهبية، CIB، أو بكروت الخدش المعتمدة من موزعي سهلة المعتمدين في ولايتك.",
    iconName: "CreditCard",
    colorClass: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
  },
  {
    id: "pos-inventory",
    title: "نقطة بيع وجرد المخزون (POS)",
    description: "سجّل مبيعات الأدوات المدرسية، بطاقات التعبئة، والخدمات المكتبية مع تنبيهات عند نفاد السلع وحساب الأرباح اليومية.",
    iconName: "Store",
    colorClass: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
  },
  {
    id: "analytics-reports",
    title: "تقارير وأرباح لحظية دقيقة",
    description: "تعرّف على دخلك اليومي والشهري، عدد الصفحات المطبوعة، وأكثر الساعات ازدحاماً لتحسين تنظيم كاونترك.",
    iconName: "TrendingUp",
    colorClass: "text-purple-600 dark:text-purple-400 bg-purple-500/10",
  },
  {
    id: "offline-sync",
    title: "عمل بدون انقطاع وأوفلاين",
    description: "إذا تباطأ اتصال الإنترنت في المحل، يستمر الكاونتر في تلقي المهام محلياً مع المزامنة التلقائية فور عودة الشبكة.",
    iconName: "Zap",
    colorClass: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  },
];
