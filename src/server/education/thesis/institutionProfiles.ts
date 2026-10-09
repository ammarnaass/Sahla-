/**
 * 🏛️ Algerian University & Institution Profiles Catalog
 * دليل ومستودع قواعد المذكرات الرسمية للجامعات والمعاهد الجزائرية (النسخة 1.0)
 * 
 * يحدد لكل مؤسسة:
 * - شكل الغلاف وترتيب الصفحة الأولى
 * - الترتيب الأكاديمي (الإهداء، الشكر، الملخصات عربي/فرنسي/إنجليزي، الفهرس)
 * - الهيكل الإلزامي (المقدمة العامة، الفصول، الجانب التطبيقي، الخاتمة)
 * - أسلوب التوثيق المعتمد (APA 7، ISO 690)
 * - حجم الخط، الهوامش، والترقيم الأبجدي/الرقمي
 */

import { InstitutionProfile, ThesisDegree } from "./types";

export const ALGERIAN_INSTITUTION_PROFILES: InstitutionProfile[] = [
  // 1. الدليل الوطني الموحد لشهادة الماستر LMD (وزارة التعليم العالي والبحث العلمي)
  {
    profile_id: "ALGERIA-STANDARD-MASTER-LMD@2026",
    institution_name: "الجامعات الجزائرية (الدليل المرجعي الوطني لوزارة التعليم العالي)",
    faculty: "كليات العلوم الإنسانية، الاقتصادية والتكنولوجية",
    degree: "MASTER_ACADEMIC",
    degree_title_ar: "مذكرة تخرج لنيل شهادة الماستر الأكاديمي (نظام LMD)",
    language: "ar",
    cover: {
      header: [
        "الجمهورية الجزائرية الديمقراطية الشعبية",
        "وزارة التعليم العالي والبحث العلمي",
      ],
      fields: [
        "university",
        "faculty",
        "department",
        "degree",
        "specialty",
        "title",
        "student",
        "supervisor",
        "jury",
        "academic_year",
      ],
    },
    front_matter: [
      "dedication",
      "acknowledgments",
      "abstract_ar",
      "abstract_fr",
      "abstract_en",
      "toc",
      "list_tables",
      "list_figures",
      "abbreviations",
    ],
    structure: {
      general_intro: {
        required: [
          "context", // الإطار العام
          "problem", // الإشكالية المركزية
          "hypotheses", // الفرضيات
          "importance", // الأهمية
          "objectives", // الأهداف
          "reasons_for_choice", // أسباب اختيار الموضوع
          "methodology", // المنهج والأدوات
          "scope", // حدود الدراسة (مكانية، زمانية، بشرية)
          "previous_studies", // الدراسات السابقة
          "outline", // هيكل وتقسيم المذكرة
        ],
      },
      chapters: {
        min: 3,
        max: 4,
        theoretical_first: true,
        applied_required: true,
      },
      general_conclusion: ["findings", "recommendations", "future_work"],
      back_matter: ["references", "appendices"],
    },
    pages: { min: 60, max: 100 },
    citation: {
      style: "APA7",
      in_text: "author-year",
      numbering: "arabic",
    },
    format: {
      paper: "A4",
      margins_mm: { top: 25, bottom: 25, start: 30, end: 20 },
      font: {
        family: "Traditional Arabic",
        body_pt: 14,
        heading_pt: [18, 16, 14],
        line_spacing: 1.5,
      },
      page_numbers: { front: "abjad", body: "arabic" },
    },
    is_verified: true,
    notes: "مطابق لدليل إعداد مذكرات الماستر المعتمد من الندوة الوطنية للجامعات الجزائرية.",
  },

  // 2. جامعة العلوم والتكنولوجيا هواري بومدين (USTHB) - باب الزوار
  {
    profile_id: "UNIV-USTHB-INFO-MASTER@2026",
    institution_name: "جامعة العلوم والتكنولوجيا هواري بومدين (USTHB)",
    faculty: "كلية الإعلام الآلي (Faculté d'Informatique)",
    department: "قسم الذكاء الاصطناعي وهندسة البرمجيات",
    degree: "MASTER_ACADEMIC",
    degree_title_ar: "مذكرة ماستر في الإعلام الآلي والأنظمة الذكية",
    language: "ar",
    cover: {
      header: [
        "الجمهورية الجزائرية الديمقراطية الشعبية",
        "وزارة التعليم العالي والبحث العلمي",
        "جامعة العلوم والتكنولوجيا هواري بومدين - الجزائر",
      ],
      fields: [
        "university",
        "faculty",
        "department",
        "degree",
        "specialty",
        "title",
        "student",
        "supervisor",
        "academic_year",
      ],
    },
    front_matter: [
      "dedication",
      "acknowledgments",
      "abstract_ar",
      "abstract_en",
      "toc",
      "list_tables",
      "list_figures",
      "abbreviations",
    ],
    structure: {
      general_intro: {
        required: [
          "context",
          "problem",
          "objectives",
          "methodology",
          "outline",
        ],
      },
      chapters: {
        min: 3,
        max: 5,
        theoretical_first: true,
        applied_required: true,
      },
      general_conclusion: ["findings", "recommendations", "future_work"],
      back_matter: ["references", "appendices"],
    },
    pages: { min: 50, max: 90 },
    citation: {
      style: "IEEE",
      in_text: "numeric",
      numbering: "arabic",
    },
    format: {
      paper: "A4",
      margins_mm: { top: 25, bottom: 25, start: 25, end: 25 },
      font: {
        family: "Arial",
        body_pt: 12,
        heading_pt: [16, 14, 12],
        line_spacing: 1.5,
      },
      page_numbers: { front: "roman", body: "arabic" },
    },
    is_verified: true,
    notes: "دليل كلية الإعلام الآلي USTHB: إلزام فصل التحليل والتصميم وفصل الإنجاز البرمجي.",
  },

  // 3. جامعة الجزائر 3 - كلية العلوم الاقتصادية والتجارية وعلوم التسيير (دالي إبراهيم)
  {
    profile_id: "UNIV-ALGER3-ECO-GESTION@2026",
    institution_name: "جامعة الجزائر 3 - إبراهيم سلطان شيبوط",
    faculty: "كلية العلوم الاقتصادية والعلوم التجارية وعلوم التسيير",
    department: "قسم علوم التسيير والمالية",
    degree: "MASTER_ACADEMIC",
    degree_title_ar: "مذكرة تخرج ماستر أكاديمي في علوم التسيير والمالية",
    language: "ar",
    cover: {
      header: [
        "الجمهورية الجزائرية الديمقراطية الشعبية",
        "وزارة التعليم العالي والبحث العلمي",
        "جامعة الجزائر 3 - دالي إبراهيم",
      ],
      fields: [
        "university",
        "faculty",
        "department",
        "degree",
        "specialty",
        "title",
        "student",
        "supervisor",
        "jury",
        "academic_year",
      ],
    },
    front_matter: [
      "dedication",
      "acknowledgments",
      "abstract_ar",
      "abstract_en",
      "abstract_fr",
      "toc",
      "list_tables",
      "list_figures",
    ],
    structure: {
      general_intro: {
        required: [
          "context",
          "problem",
          "hypotheses",
          "importance",
          "objectives",
          "methodology",
          "previous_studies",
          "scope",
          "outline",
        ],
      },
      chapters: {
        min: 3,
        max: 4,
        theoretical_first: true,
        applied_required: true,
      },
      general_conclusion: ["findings", "recommendations", "future_work"],
      back_matter: ["references", "appendices"],
    },
    pages: { min: 70, max: 120 },
    citation: {
      style: "APA7",
      in_text: "author-year",
      numbering: "arabic",
    },
    format: {
      paper: "A4",
      margins_mm: { top: 25, bottom: 25, start: 30, end: 20 },
      font: {
        family: "Traditional Arabic",
        body_pt: 14,
        heading_pt: [18, 16, 14],
        line_spacing: 1.5,
      },
      page_numbers: { front: "abjad", body: "arabic" },
    },
    is_verified: true,
    notes: "دليل كلية العلوم الاقتصادية جامعة الجزائر 3: إلزام دراسة حالة تطبيقية في مؤسسة جزائرية أو تحليل إحصائي لاستبيان.",
  },

  // 4. جامعة الجزائر 1 - كلية الحقوق والعلوم السياسية (سعيد حمدين)
  {
    profile_id: "UNIV-ALGER1-DROIT@2026",
    institution_name: "جامعة الجزائر 1 - بن يوسف بن خدة",
    faculty: "كلية الحقوق",
    department: "قسم القانون العام والقانون الخاص",
    degree: "MASTER_ACADEMIC",
    degree_title_ar: "مذكرة ماستر أكاديمي في الحقوق والعلوم القانونية",
    language: "ar",
    cover: {
      header: [
        "الجمهورية الجزائرية الديمقراطية الشعبية",
        "وزارة التعليم العالي والبحث العلمي",
        "جامعة الجزائر 1 - بن يوسف بن خدة",
      ],
      fields: [
        "university",
        "faculty",
        "degree",
        "specialty",
        "title",
        "student",
        "supervisor",
        "jury",
        "academic_year",
      ],
    },
    front_matter: [
      "dedication",
      "acknowledgments",
      "toc",
      "abstract_ar",
      "abstract_fr",
    ],
    structure: {
      general_intro: {
        required: [
          "context",
          "problem",
          "importance",
          "objectives",
          "methodology",
          "outline",
        ],
      },
      chapters: {
        min: 2, // مذكرات الحقوق تعتمد عادة خطة ثنائية (بابان أو فصلان رئيسيان)
        max: 3,
        theoretical_first: false,
        applied_required: false,
      },
      general_conclusion: ["findings", "recommendations"],
      back_matter: ["references"],
    },
    pages: { min: 60, max: 110 },
    citation: {
      style: "ISO690",
      in_text: "numeric", // التهميش في أسفل الصفحة Footnotes
      numbering: "arabic",
    },
    format: {
      paper: "A4",
      margins_mm: { top: 25, bottom: 25, start: 30, end: 20 },
      font: {
        family: "Traditional Arabic",
        body_pt: 14,
        heading_pt: [18, 16, 14],
        line_spacing: 1.5,
      },
      page_numbers: { front: "abjad", body: "arabic" },
    },
    is_verified: true,
    notes: "دليل كلية الحقوق سعيد حمدين: الخطة الثنائية المتوازنة والتوثيق بهوامش أسفل الصفحة مع النصوص القانونية والجريدة الرسمية.",
  },

  // 5. جامعة وهران 2 - كلية العلوم الاجتماعية والإنسانية
  {
    profile_id: "UNIV-ORAN2-SOCIO-HUMAN@2026",
    institution_name: "جامعة وهران 2 - محمد بن أحمد",
    faculty: "كلية العلوم الاجتماعية",
    department: "قسم علم الاجتماع وعلم النفس",
    degree: "MASTER_ACADEMIC",
    degree_title_ar: "مذكرة ماستر في العلوم الاجتماعية",
    language: "ar",
    cover: {
      header: [
        "الجمهورية الجزائرية الديمقراطية الشعبية",
        "وزارة التعليم العالي والبحث العلمي",
        "جامعة وهران 2 - محمد بن أحمد",
      ],
      fields: [
        "university",
        "faculty",
        "department",
        "degree",
        "specialty",
        "title",
        "student",
        "supervisor",
        "jury",
        "academic_year",
      ],
    },
    front_matter: [
      "dedication",
      "acknowledgments",
      "abstract_ar",
      "abstract_en",
      "toc",
      "list_tables",
      "list_figures",
    ],
    structure: {
      general_intro: {
        required: [
          "context",
          "problem",
          "hypotheses",
          "importance",
          "objectives",
          "methodology",
          "scope",
          "previous_studies",
          "outline",
        ],
      },
      chapters: {
        min: 3,
        max: 5,
        theoretical_first: true,
        applied_required: true,
      },
      general_conclusion: ["findings", "recommendations", "future_work"],
      back_matter: ["references", "appendices"],
    },
    pages: { min: 65, max: 115 },
    citation: {
      style: "APA7",
      in_text: "author-year",
      numbering: "arabic",
    },
    format: {
      paper: "A4",
      margins_mm: { top: 25, bottom: 25, start: 30, end: 20 },
      font: {
        family: "Traditional Arabic",
        body_pt: 14,
        heading_pt: [18, 16, 14],
        line_spacing: 1.5,
      },
      page_numbers: { front: "abjad", body: "arabic" },
    },
    is_verified: true,
    notes: "دليل كلية العلوم الاجتماعية وهران 2: التزام بمنهجية البحث الميداني وأدوات المقابلة والاستبيان الميداني.",
  },

  // 6. وزارة التكوين والتعليم المهنيين (MFEP) - شهادة تقني سامٍ (TS)
  {
    profile_id: "MFEP-TS-INFORMATIQUE@2026",
    institution_name: "وزارة التكوين والتعليم المهنيين (المعهد الوطني المتخصص INSFP)",
    faculty: "المعهد الوطني المتخصص في التكوين المهني",
    degree: "TECH_SUPERIEUR",
    degree_title_ar: "مذكرة نهاية التكوين لنيل شهادة تقني سامٍ (TS)",
    language: "ar",
    cover: {
      header: [
        "الجمهورية الجزائرية الديمقراطية الشعبية",
        "وزارة التكوين والتعليم المهنيين",
      ],
      fields: [
        "university",
        "faculty",
        "degree",
        "specialty",
        "title",
        "student",
        "supervisor",
        "academic_year",
      ],
    },
    front_matter: [
      "dedication",
      "acknowledgments",
      "toc",
      "list_tables",
      "list_figures",
    ],
    structure: {
      general_intro: {
        required: [
          "context",
          "problem",
          "objectives",
          "methodology",
          "outline",
        ],
      },
      chapters: {
        min: 2,
        max: 4,
        theoretical_first: true,
        applied_required: true,
      },
      general_conclusion: ["findings", "recommendations"],
      back_matter: ["references", "appendices"],
    },
    pages: { min: 35, max: 70 },
    citation: {
      style: "ISO690",
      in_text: "numeric",
      numbering: "arabic",
    },
    format: {
      paper: "A4",
      margins_mm: { top: 25, bottom: 25, start: 25, end: 20 },
      font: {
        family: "Simplified Arabic",
        body_pt: 14,
        heading_pt: [18, 16, 14],
        line_spacing: 1.5,
      },
      page_numbers: { front: "abjad", body: "arabic" },
    },
    is_verified: true,
    notes: "دليل التكوين المهني (INSFP): التركيز على الجانب التطبيقي والمشروع العملي في مؤسسة التربص.",
  },
];

/**
 * 🔍 جلب قائمة ملفات المؤسسات المتاحة مع إمكانية التصفية
 */
export function listInstitutionProfiles(options?: {
  query?: string;
  degree?: string;
  language?: string;
}): InstitutionProfile[] {
  let list = [...ALGERIAN_INSTITUTION_PROFILES];

  if (!options) return list;

  if (options.degree) {
    list = list.filter((p) => p.degree === options.degree);
  }

  if (options.language) {
    list = list.filter((p) => p.language === options.language);
  }

  if (options.query && options.query.trim().length > 0) {
    const q = options.query.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.institution_name.toLowerCase().includes(q) ||
        p.faculty.toLowerCase().includes(q) ||
        p.profile_id.toLowerCase().includes(q) ||
        p.degree_title_ar.toLowerCase().includes(q)
    );
  }

  return list;
}

/**
 * 🎯 استرجاع ملف مؤسسة بواسطة المعرّف
 */
export function getInstitutionProfile(profileId: string): InstitutionProfile | null {
  if (!profileId) return null;
  const cleanId = profileId.trim();
  return (
    ALGERIAN_INSTITUTION_PROFILES.find((p) => p.profile_id === cleanId) || null
  );
}

/**
 * ⚡ الملاءمة الذكية التلقائية لملف المؤسسة
 * يطابق الجامعة والكلية المدخلة مع أفضل ملف مؤسسة رسمي أو يرجع الملف الوطني الموحد
 */
export function resolveProfileByInstitution(
  universityName?: string,
  facultyName?: string,
  degree?: ThesisDegree
): InstitutionProfile {
  const defaultProfile = ALGERIAN_INSTITUTION_PROFILES[0]; // ALGERIA-STANDARD-MASTER-LMD@2026
  if (!universityName && !facultyName) return defaultProfile;

  const combined = `${universityName || ""} ${facultyName || ""}`.toLowerCase();

  if (combined.includes("usthb") || combined.includes("باب الزوار") || combined.includes("بومدين")) {
    return (
      ALGERIAN_INSTITUTION_PROFILES.find((p) => p.profile_id === "UNIV-USTHB-INFO-MASTER@2026") ||
      defaultProfile
    );
  }

  if (combined.includes("حقوق") || combined.includes("قانون") || combined.includes("حمدين")) {
    return (
      ALGERIAN_INSTITUTION_PROFILES.find((p) => p.profile_id === "UNIV-ALGER1-DROIT@2026") ||
      defaultProfile
    );
  }

  if (
    combined.includes("اقتصاد") ||
    combined.includes("تسيير") ||
    combined.includes("دالي إبراهيم") ||
    combined.includes("تجارة") ||
    combined.includes("الجزائر 3")
  ) {
    return (
      ALGERIAN_INSTITUTION_PROFILES.find((p) => p.profile_id === "UNIV-ALGER3-ECO-GESTION@2026") ||
      defaultProfile
    );
  }

  if (combined.includes("وهران") || combined.includes("oran")) {
    return (
      ALGERIAN_INSTITUTION_PROFILES.find((p) => p.profile_id === "UNIV-ORAN2-SOCIO-HUMAN@2026") ||
      defaultProfile
    );
  }

  if (degree === "TECH_SUPERIEUR" || combined.includes("تكوين") || combined.includes("insfp")) {
    return (
      ALGERIAN_INSTITUTION_PROFILES.find((p) => p.profile_id === "MFEP-TS-INFORMATIQUE@2026") ||
      defaultProfile
    );
  }

  return defaultProfile;
}
