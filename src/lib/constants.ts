// Sahla Algerian Data Constants (بيانات ثابتة جزائرية)
// 58 Wilayas + Activity types + Service catalog

export interface Wilaya {
  code: number;
  nameAr: string;
  nameFr: string;
}

export const ALGERIAN_WILAYAS: Wilaya[] = [
  { code: 1, nameAr: "أدرار", nameFr: "Adrar" },
  { code: 2, nameAr: "الشلف", nameFr: "Chlef" },
  { code: 3, nameAr: "الأغواط", nameFr: "Laghouat" },
  { code: 4, nameAr: "أم البواقي", nameFr: "Oum El Bouaghi" },
  { code: 5, nameAr: "باتنة", nameFr: "Batna" },
  { code: 6, nameAr: "بجاية", nameFr: "Béjaïa" },
  { code: 7, nameAr: "بسكرة", nameFr: "Biskra" },
  { code: 8, nameAr: "بشار", nameFr: "Béchar" },
  { code: 9, nameAr: "البليدة", nameFr: "Blida" },
  { code: 10, nameAr: "البويرة", nameFr: "Bouira" },
  { code: 11, nameAr: "تمنراست", nameFr: "Tamanrasset" },
  { code: 12, nameAr: "تبسة", nameFr: "Tébessa" },
  { code: 13, nameAr: "تلمسان", nameFr: "Tlemcen" },
  { code: 14, nameAr: "تيارت", nameFr: "Tiaret" },
  { code: 15, nameAr: "تيزي وزو", nameFr: "Tizi Ouzou" },
  { code: 16, nameAr: "الجزائر", nameFr: "Alger" },
  { code: 17, nameAr: "الجلفة", nameFr: "Djelfa" },
  { code: 18, nameAr: "جيجل", nameFr: "Jijel" },
  { code: 19, nameAr: "سطيف", nameFr: "Sétif" },
  { code: 20, nameAr: "سعيدة", nameFr: "Saïda" },
  { code: 21, nameAr: "سكيكدة", nameFr: "Skikda" },
  { code: 22, nameAr: "سيدي بلعباس", nameFr: "Sidi Bel Abbès" },
  { code: 23, nameAr: "عنابة", nameFr: "Annaba" },
  { code: 24, nameAr: "قالمة", nameFr: "Guelma" },
  { code: 25, nameAr: "قسنطينة", nameFr: "Constantine" },
  { code: 26, nameAr: "المدية", nameFr: "Médéa" },
  { code: 27, nameAr: "مستغانم", nameFr: "Mostaganem" },
  { code: 28, nameAr: "المسيلة", nameFr: "M'Sila" },
  { code: 29, nameAr: "معسكر", nameFr: "Mascara" },
  { code: 30, nameAr: "ورقلة", nameFr: "Ouargla" },
  { code: 31, nameAr: "وهران", nameFr: "Oran" },
  { code: 32, nameAr: "البيض", nameFr: "El Bayadh" },
  { code: 33, nameAr: "إليزي", nameFr: "Illizi" },
  { code: 34, nameAr: "برج بوعريريج", nameFr: "Bordj Bou Arréridj" },
  { code: 35, nameAr: "بومرداس", nameFr: "Boumerdès" },
  { code: 36, nameAr: "الطارف", nameFr: "El Tarf" },
  { code: 37, nameAr: "تندوف", nameFr: "Tindouf" },
  { code: 38, nameAr: "تيسمسيلت", nameFr: "Tissemsilt" },
  { code: 39, nameAr: "الوادي", nameFr: "El Oued" },
  { code: 40, nameAr: "خنشلة", nameFr: "Khenchela" },
  { code: 41, nameAr: "سوق أهراس", nameFr: "Souk Ahras" },
  { code: 42, nameAr: "تيبازة", nameFr: "Tipaza" },
  { code: 43, nameAr: "ميلة", nameFr: "Mila" },
  { code: 44, nameAr: "عين الدفلى", nameFr: "Aïn Defla" },
  { code: 45, nameAr: "النعامة", nameFr: "Naâma" },
  { code: 46, nameAr: "عين تموشنت", nameFr: "Aïn Témouchent" },
  { code: 47, nameAr: "غرداية", nameFr: "Ghardaïa" },
  { code: 48, nameAr: "غليزان", nameFr: "Relizane" },
  { code: 49, nameAr: "تيميمون", nameFr: "Timimoun" },
  { code: 50, nameAr: "برج باجي مختار", nameFr: "Bordj Badji Mokhtar" },
  { code: 51, nameAr: "أولاد جلال", nameFr: "Ouled Djellal" },
  { code: 52, nameAr: "بني عباس", nameFr: "Béni Abbès" },
  { code: 53, nameAr: "عين صالح", nameFr: "In Salah" },
  { code: 54, nameAr: "عين قزام", nameFr: "In Guezzam" },
  { code: 55, nameAr: "توقرت", nameFr: "Touggourt" },
  { code: 56, nameAr: "جانت", nameFr: "Djanet" },
  { code: 57, nameAr: "المغير", nameFr: "El M'Ghair" },
  { code: 58, nameAr: "المنيعة", nameFr: "El Meniaa" },
];

export const ACTIVITY_TYPES = [
  { code: "KIOSK", nameAr: "كيوسك / مكتبة", nameFr: "Kiosque / Librairie" },
  { code: "CYBER", nameAr: "مقهى إنترنت", nameFr: "Cybercafé" },
  { code: "BUREAU", nameAr: "مكتب خدمات", nameFr: "Bureau de services" },
  { code: "PRINT_SHOP", nameAr: "محل طباعة وتصوير", nameFr: "Imprimerie" },
  { code: "FREELANCE", nameAr: "عمل حر", nameFr: "Freelance" },
  { code: "OTHER", nameAr: "أخرى", nameFr: "Autre" },
] as const;

export interface ServiceDefinition {
  code: string;
  nameAr: string;
  nameFr: string;
  icon: string;
  pointsCost: number;
  category: "documents" | "commerce" | "school" | "tools";
  isActive: boolean;
  isFree: boolean;
}

export type ServiceItem = ServiceDefinition;

export const SERVICES_CATALOG: ServiceDefinition[] = [
  { code: "CV_GEN", nameAr: "سيرة ذاتية ورسائل تحفيز", nameFr: "CV & Lettre de motivation", icon: "📄", pointsCost: 15, category: "documents", isActive: true, isFree: false },
  { code: "ID_PHOTO", nameAr: "صور الهوية 35×45 مم", nameFr: "Photos d'identité 35×45mm", icon: "📸", pointsCost: 0, category: "tools", isActive: true, isFree: true },
  { code: "INVOICE", nameAr: "فواتير تجارية رسمية", nameFr: "Factures commerciales", icon: "🧾", pointsCost: 10, category: "commerce", isActive: true, isFree: false },
  { code: "SCHOOL_RESEARCH", nameAr: "بحوث مدرسية وامتحانات", nameFr: "Recherches scolaires & examens", icon: "🎓", pointsCost: 10, category: "school", isActive: true, isFree: false },
  { code: "FORM_OCR", nameAr: "ملء النماذج الرسمية بالـ OCR", nameFr: "Formulaires officiels OCR", icon: "📋", pointsCost: 10, category: "documents", isActive: true, isFree: false },
  { code: "TAX_G50", nameAr: "التصاريح الجبائية G50 و G12", nameFr: "Déclarations fiscales G50/G12", icon: "🏛️", pointsCost: 20, category: "commerce", isActive: true, isFree: false },
  { code: "CUSTOMERS", nameAr: "دفتر الزبائن وسجل الكريدي", nameFr: "Carnet clients & crédit", icon: "👥", pointsCost: 0, category: "tools", isActive: true, isFree: true },
  { code: "EPAY", nameAr: "دفع إلكتروني بالذهبية و CIB", nameFr: "Paiement CIB/Dahabia", icon: "💳", pointsCost: 0, category: "tools", isActive: true, isFree: true },
  { code: "PRINT_BRIDGE", nameAr: "جسر الطباعة اللاسلكي", nameFr: "Pont d'impression sans fil", icon: "🖨️", pointsCost: 0, category: "tools", isActive: true, isFree: true },
  { code: "BARCODE", nameAr: "باركود و QR Code", nameFr: "Barcode & QR Code", icon: "📊", pointsCost: 0, category: "tools", isActive: true, isFree: true },
  { code: "PDF_TOOLS", nameAr: "أدوات PDF", nameFr: "Outils PDF", icon: "📑", pointsCost: 0, category: "tools", isActive: false, isFree: true },
];

export function getServiceByCode(code: string): ServiceDefinition | undefined {
  return SERVICES_CATALOG.find((s) => s.code === code);
}

export function getWilayaByCode(code: number): Wilaya | undefined {
  return ALGERIAN_WILAYAS.find((w) => w.code === code);
}
