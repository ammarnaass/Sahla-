export interface NavLink {
  label: string;
  href: string;
  highlight?: boolean;
}

export const headerNavLinks: NavLink[] = [
  { label: "المميزات", href: "#features" },
  { label: "طريقة العمل", href: "#how-it-works" },
  { label: "الخطط والأسعار", href: "#plans", highlight: true },
  { label: "حاسبة الأرباح", href: "#calculator" },
  { label: "الأسئلة الشائعة", href: "#faq" },
];

export const footerQuickLinks: NavLink[] = [
  { label: "المميزات", href: "#features" },
  { label: "الخطط والأسعار", href: "#plans" },
  { label: "حاسبة الأرباح", href: "#calculator" },
  { label: "الأسئلة الشائعة", href: "#faq" },
];

export const footerLegalLinks: NavLink[] = [
  { label: "شروط الاستخدام", href: "/terms" },
  { label: "سياسة الخصوصية (قانون 18-07)", href: "/privacy" },
  { label: "شبكة الموزعين المعتمدين", href: "/distributors" },
];
