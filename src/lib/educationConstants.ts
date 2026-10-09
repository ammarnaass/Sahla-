/**
 * 🎓 الثوابت والبيانات التعليمية الجزائرية لمنصة سهلة
 * مطابقة للمنهاج الرسمي لوزارة التربية الوطنية ووزارة التعليم العالي والبحث العلمي
 */

export type EducationLevel = "PRIMARY" | "MIDDLE" | "SECONDARY" | "UNIVERSITY";

export type DocumentMode = "RESEARCH" | "EXAM";

export type EducationDocKind = "RESEARCH" | "THESIS" | "SUMMARY" | "PEDAGOGIC";

export interface DocKindInfo {
  id: EducationDocKind;
  nameAr: string;
  badge: string;
  desc: string;
  icon: string;
}

export const EDUCATION_DOC_KINDS: DocKindInfo[] = [
  {
    id: "RESEARCH",
    nameAr: "بحث مدرسي / أكاديمي",
    badge: "ابتدائي · متوسط · ثانوي",
    desc: "بحوث مدرسية متوافقة مع المنهاج الوطني الجزائري الرسمي",
    icon: "🎓",
  },
  {
    id: "THESIS",
    nameAr: "مذكرة تخرج جامعية / تقني سامي",
    badge: "ليسانس · ماستر · دكتوراه · TS",
    desc: "مذكرات تخرج أكاديمية بالهيكل المنهجي والتحليل الميداني والمراجع",
    icon: "📜",
  },
  {
    id: "SUMMARY",
    nameAr: "ملخص ومراجعة درس شاملة",
    badge: "جميع الأطوار",
    desc: "خرائط ذهنية، تعاريف جوهرية، وقواعد ميسرة للمراجعة والامتحانات",
    icon: "📝",
  },
  {
    id: "PEDAGOGIC",
    nameAr: "مذكرة بيداغوجية للأستاذ (جذاذة)",
    badge: "إعداد الدروس للمربين",
    desc: "تحضير بيداغوجي وفق المقاربة بالكفاءات ووضعيات التعلم",
    icon: "📋",
  },
];

export const ALGERIAN_UNIVERSITIES = [
  "جامعة الجزائر 1 - بن يوسف بن خدة",
  "جامعة الجزائر 2 - أبو القاسم سعد الله",
  "جامعة الجزائر 3 - إبراهيم سلطان شيبوط",
  "جامعة هواري بومدين للعلوم والتكنولوجيا (USTHB) - باب الزوار",
  "جامعة وهران 1 - أحمد بن بلة",
  "جامعة وهران 2 - محمد بن أحمد",
  "جامعة قسنطينة 1 - الإخوة منتوري",
  "جامعة قسنطينة 2 - عبد الحميد مهري",
  "جامعة قسنطينة 3 - صلاح الدين الأيوبي",
  "جامعة سطيف 1 - فرحات عباس",
  "جامعة سطيف 2 - لمين دباغين",
  "جامعة باتنة 1 - الحاج لخضر",
  "جامعة تلمسان - أبو بكر بلقايد",
  "جامعة عنابة - باجي مختار",
  "جامعة البليدة 1 - سعد دحلب",
  "جامعة بومرداس - أمحمد بوقرة",
  "جامعة تيزي وزو - مولود معمري",
  "جامعة بجاية - عبد الرحمان ميرة",
  "جامعة بسكرة - محمد خيضر",
  "جامعة ورقلة - قاصدي مرباح",
  "جامعة الجلفة - زيان عاشور",
  "جامعة تيارت - ابن خلدون",
  "جامعة المسيلة - محمد بوضياف",
  "المعهد الوطني المتخصص في التكوين المهني (INSFP)",
  "مركز جامعي / مدرسة عليا وطنية",
];

export interface LevelInfo {
  id: EducationLevel;
  nameAr: string;
  nameFr: string;
  badge: string;
}

export const EDUCATION_LEVELS: LevelInfo[] = [
  { id: "PRIMARY", nameAr: "الطور الابتدائي (Primaire)", nameFr: "Enseignement Primaire", badge: "1AP - 5AP" },
  { id: "MIDDLE", nameAr: "الطور المتوسط (Moyen / BEM)", nameFr: "Enseignement Moyen", badge: "1AM - 4AM" },
  { id: "SECONDARY", nameAr: "الطور الثانوي (Secondaire / BAC)", nameFr: "Enseignement Secondaire", badge: "1AS - 3AS" },
  { id: "UNIVERSITY", nameAr: "التعليم العالي والجامعي (Supérieur)", nameFr: "Enseignement Supérieur", badge: "L / M / D" },
];

export interface GradeItem {
  id: string;
  level: EducationLevel;
  nameAr: string;
  nameFr: string;
  defaultSubjects: string[];
}

export const ALGERIAN_GRADES: GradeItem[] = [
  // الطور الابتدائي
  { id: "1AP", level: "PRIMARY", nameAr: "السنة الأولى ابتدائي", nameFr: "1ère Année Primaire", defaultSubjects: ["ARABIC", "MATH", "ISLAMIC", "CIVICS"] },
  { id: "2AP", level: "PRIMARY", nameAr: "السنة الثانية ابتدائي", nameFr: "2ème Année Primaire", defaultSubjects: ["ARABIC", "MATH", "ISLAMIC", "CIVICS"] },
  { id: "3AP", level: "PRIMARY", nameAr: "السنة الثالثة ابتدائي", nameFr: "3ème Année Primaire", defaultSubjects: ["ARABIC", "MATH", "SCIENCES", "ISLAMIC", "CIVICS", "FRENCH", "ENGLISH"] },
  { id: "4AP", level: "PRIMARY", nameAr: "السنة الرابعة ابتدائي", nameFr: "4ème Année Primaire", defaultSubjects: ["ARABIC", "MATH", "SCIENCES", "HISTORY_GEO", "ISLAMIC", "CIVICS", "FRENCH", "ENGLISH"] },
  { id: "5AP", level: "PRIMARY", nameAr: "السنة الخامسة ابتدائي (الشهادة)", nameFr: "5ème Année Primaire", defaultSubjects: ["ARABIC", "MATH", "SCIENCES", "HISTORY_GEO", "ISLAMIC", "CIVICS", "FRENCH", "ENGLISH"] },

  // الطور المتوسط
  { id: "1AM", level: "MIDDLE", nameAr: "السنة الأولى متوسط", nameFr: "1ère Année Moyenne", defaultSubjects: ["ARABIC", "MATH", "PHYSICS", "SCIENCES", "HISTORY_GEO", "ISLAMIC", "CIVICS", "FRENCH", "ENGLISH", "INFORMATICS"] },
  { id: "2AM", level: "MIDDLE", nameAr: "السنة الثانية متوسط", nameFr: "2ème Année Moyenne", defaultSubjects: ["ARABIC", "MATH", "PHYSICS", "SCIENCES", "HISTORY_GEO", "ISLAMIC", "CIVICS", "FRENCH", "ENGLISH", "INFORMATICS"] },
  { id: "3AM", level: "MIDDLE", nameAr: "السنة الثالثة متوسط", nameFr: "3ème Année Moyenne", defaultSubjects: ["ARABIC", "MATH", "PHYSICS", "SCIENCES", "HISTORY_GEO", "ISLAMIC", "CIVICS", "FRENCH", "ENGLISH", "INFORMATICS"] },
  { id: "4AM", level: "MIDDLE", nameAr: "السنة الرابعة متوسط (شهادة BEM)", nameFr: "4ème Année Moyenne (BEM)", defaultSubjects: ["ARABIC", "MATH", "PHYSICS", "SCIENCES", "HISTORY_GEO", "ISLAMIC", "CIVICS", "FRENCH", "ENGLISH"] },

  // الطور الثانوي
  { id: "1AS_SCI", level: "SECONDARY", nameAr: "1 ثانوي: جذع مشترك علوم وتكنولوجيا", nameFr: "1AS Tronc Commun Sciences", defaultSubjects: ["MATH", "PHYSICS", "SCIENCES", "ARABIC", "FRENCH", "ENGLISH", "HISTORY_GEO", "ISLAMIC", "INFORMATICS"] },
  { id: "1AS_LET", level: "SECONDARY", nameAr: "1 ثانوي: جذع مشترك آداب", nameFr: "1AS Tronc Commun Lettres", defaultSubjects: ["ARABIC", "HISTORY_GEO", "ISLAMIC", "FRENCH", "ENGLISH", "MATH", "SCIENCES"] },
  { id: "2AS_SCI", level: "SECONDARY", nameAr: "2 ثانوي: علوم تجريبية / رياضيات", nameFr: "2AS Sciences & Maths", defaultSubjects: ["SCIENCES", "PHYSICS", "MATH", "ARABIC", "FRENCH", "ENGLISH", "HISTORY_GEO", "ISLAMIC"] },
  { id: "2AS_MGT", level: "SECONDARY", nameAr: "2 ثانوي: تسيير واقتصاد", nameFr: "2AS Gestion & Économie", defaultSubjects: ["ECONOMY", "LAW", "MATH", "HISTORY_GEO", "ARABIC", "FRENCH", "ENGLISH"] },
  { id: "3AS_SCI", level: "SECONDARY", nameAr: "3 ثانوي (بكالوريا BAC): شعبة علوم تجريبية", nameFr: "3AS BAC Sciences Expérimentales", defaultSubjects: ["SCIENCES", "PHYSICS", "MATH", "PHILO", "ARABIC", "FRENCH", "ENGLISH", "HISTORY_GEO", "ISLAMIC"] },
  { id: "3AS_MATH", level: "SECONDARY", nameAr: "3 ثانوي (بكالوريا BAC): شعبة رياضيات وتقني رياضي", nameFr: "3AS BAC Mathématiques & TM", defaultSubjects: ["MATH", "PHYSICS", "SCIENCES", "PHILO", "ARABIC", "FRENCH", "ENGLISH"] },
  { id: "3AS_ECO", level: "SECONDARY", nameAr: "3 ثانوي (بكالوريا BAC): شعبة تسيير واقتصاد", nameFr: "3AS BAC Gestion & Économie", defaultSubjects: ["ECONOMY", "LAW", "MATH", "HISTORY_GEO", "PHILO", "ARABIC", "FRENCH", "ENGLISH"] },
  { id: "3AS_LET", level: "SECONDARY", nameAr: "3 ثانوي (بكالوريا BAC): شعبة آداب وفلسفة / لغات", nameFr: "3AS BAC Lettres & Langues", defaultSubjects: ["PHILO", "ARABIC", "HISTORY_GEO", "ISLAMIC", "FRENCH", "ENGLISH"] },

  // الطور الجامعي
  { id: "UNIV_L", level: "UNIVERSITY", nameAr: "التعليم الجامعي: طور الليسانس (L1 - L3)", nameFr: "Licence Universitaire (L1-L3)", defaultSubjects: ["INFORMATICS", "ECONOMY", "SCIENCES", "LAW", "MATH", "PHYSICS"] },
  { id: "UNIV_M", level: "UNIVERSITY", nameAr: "التعليم الجامعي: طور الماستر والدكتوراه (M1 - M2)", nameFr: "Master & Doctorat", defaultSubjects: ["INFORMATICS", "ECONOMY", "SCIENCES", "LAW", "MATH", "PHYSICS"] },
];

export interface SubjectItem {
  id: string;
  nameAr: string;
  nameFr: string;
  defaultLang: "ar" | "fr" | "en";
}

export const ALGERIAN_SUBJECTS: Record<string, SubjectItem> = {
  ARABIC: { id: "ARABIC", nameAr: "اللغة العربية وآدابها", nameFr: "Langue Arabe", defaultLang: "ar" },
  MATH: { id: "MATH", nameAr: "الرياضيات", nameFr: "Mathématiques", defaultLang: "ar" },
  PHYSICS: { id: "PHYSICS", nameAr: "العلوم الفيزيائية والتكنولوجيا", nameFr: "Sciences Physiques", defaultLang: "ar" },
  SCIENCES: { id: "SCIENCES", nameAr: "علوم الطبيعة والحياة", nameFr: "Sciences de la Nature et de la Vie", defaultLang: "ar" },
  HISTORY_GEO: { id: "HISTORY_GEO", nameAr: "التاريخ والجغرافيا", nameFr: "Histoire et Géographie", defaultLang: "ar" },
  ISLAMIC: { id: "ISLAMIC", nameAr: "التربية الإسلامية / العلوم الإسلامية", nameFr: "Éducation Islamique", defaultLang: "ar" },
  CIVICS: { id: "CIVICS", nameAr: "التربية المدنية", nameFr: "Éducation Civique", defaultLang: "ar" },
  FRENCH: { id: "FRENCH", nameAr: "اللغة الفرنسية", nameFr: "Langue Française", defaultLang: "fr" },
  ENGLISH: { id: "ENGLISH", nameAr: "اللغة الإنجليزية", nameFr: "Langue Anglaise", defaultLang: "en" },
  PHILO: { id: "PHILO", nameAr: "الفلسفة", nameFr: "Philosophie", defaultLang: "ar" },
  ECONOMY: { id: "ECONOMY", nameAr: "الاقتصاد والمناجمنت والتسيير المحاسبي", nameFr: "Économie & Gestion", defaultLang: "ar" },
  LAW: { id: "LAW", nameAr: "القانون والتشريع الجزائري", nameFr: "Droit & Législation", defaultLang: "ar" },
  INFORMATICS: { id: "INFORMATICS", nameAr: "الإعلام الآلي والذكاء الاصطناعي", nameFr: "Informatique & IA", defaultLang: "ar" },
};

export interface PresetTopic {
  id: string;
  level: EducationLevel;
  subjectId: string;
  mode: DocumentMode;
  title: string;
  plan: string[];
}

export const PRESET_TOPICS: PresetTopic[] = [
  // بحوث تاريخ وجغرافيا
  {
    id: "hist_rev",
    level: "MIDDLE",
    subjectId: "HISTORY_GEO",
    mode: "RESEARCH",
    title: "الثورة التحريرية الجزائرية المباركة (1954 - 1962)",
    plan: [
      "مقدمة: دوافع انطلاق الثورة التحريرية وبيان أول نوفمبر 1954",
      "المبحث الأول: المراحل الكبرى للثورة (مرحلة الانطلاق ومؤتمر الصومام 1956)",
      "المبحث الثاني: المظاهرات الشعبية ومفاوضات إيفيان واسترجاع السيادة",
      "خاتمة: تضحيات الشهداء ومكانة الجزائر الدولية بعد الاستقلال",
      "قائمة المراجع: تاريخ الثورة الجزائرية - ديوان المطبوعات المدرسية",
    ],
  },
  {
    id: "hist_emir",
    level: "MIDDLE",
    subjectId: "HISTORY_GEO",
    mode: "RESEARCH",
    title: "الأمير عبد القادر الجزائري: قائد المقاومة الوطنية ومؤسس الدولة الحديثة (1808 - 1883م)",
    plan: [
      "المقدمة: السياق التاريخي للاحتلال الفرنسي 1830م وطرح إشكالية المقاومة ومشروع الدولة",
      "المبحث الأول: نشأة الأمير عبد القادر، بيعة الدردار (1832م) وتأسيس الدولة الجزائرية الحديثة",
      "المبحث الثاني: الاستراتيجية العسكرية والمعارك الحاسمة ومعاهدات الهدنة (دي ميشال 1834م، التافنة 1837م)",
      "المبحث الثالث: مؤسسات الدولة الحديثة: التنظيم الإداري، عاصمة الزمالة المتنقلة، وسك العملة والمصانع",
      "الخاتمة: الحصيلة التاريخية، البعد الإنساني للأمير (حوادث دمشق 1860م) والرمزية الوطنية الخالدة",
      "فهرس المصادر والمراجع الوطنية الرسمية المعتمدة (الديوان الوطني للمطبوعات المدرسية ONPS)",
    ],
  },
  {
    id: "geo_dam",
    level: "MIDDLE",
    subjectId: "HISTORY_GEO",
    mode: "RESEARCH",
    title: "مشروع السد الأخضر في الجزائر: حماية التربية ومكافحة التصحر",
    plan: [
      "مقدمة: الموقع الجغرافي للجزائر وخطر زحف الرمال الصحراوية",
      "المبحث الأول: أهداف مشروع السد الأخضر وسياقه التاريخي والبيئي",
      "المبحث الثاني: إعادة تأهيل وتوسيع السد الأخضر في إطار التنمية المستدامة",
      "خاتمة: دور الشباب والمؤسسات في الحفاظ على الغطاء النباتي الوطني",
    ],
  },
  // بحوث علوم وتكنولوجيا
  {
    id: "sci_solar",
    level: "SECONDARY",
    subjectId: "PHYSICS",
    mode: "RESEARCH",
    title: "الطاقات المتجددة في الجزائر: آفاق الطاقة الشمسية والهيدروجين الأخضر",
    plan: [
      "مقدمة: تحديات التحول الطاقوي واستراتيجية الجزائر الجديدة",
      "المبحث الأول: الإمكانيات الهائلة للإشعاع الشمسي في الصحراء الجزائرية",
      "المبحث الثاني: محطات توليد الطاقة الكهروضوئية ومشاريع الهيدروجين النظيف",
      "خاتمة: مستقبل الاقتصاد الأخضر وتحقيق الاكتفاء الطاقوي المستدام",
      "المراجع: تقارير وزارة الانتقال الطاقوي والطاقات المتجددة",
    ],
  },
  {
    id: "sci_digest",
    level: "PRIMARY",
    subjectId: "SCIENCES",
    mode: "RESEARCH",
    title: "الجهاز الهضمي عند الإنسان والتغذية الصحية المتوازنة",
    plan: [
      "مقدمة: أهمية التغذية في تزويد جسم الإنسان بالطاقة والنشاط",
      "المبحث الأول: أعضاء الجهاز الهضمي ووظيفة كل عضو في تفكيك الأغذية",
      "المبحث الثاني: القواعد الصحية لحماية الأسنان والمعدة من الأمراض",
      "خاتمة: نصائح يومية لنمط حياة صحي ومتوازن للأطفال",
    ],
  },
  {
    id: "tech_ai",
    level: "UNIVERSITY",
    subjectId: "INFORMATICS",
    mode: "RESEARCH",
    title: "تطبيقات الذكاء الاصطناعي التوليدي في تحسين الخدمات الرقمية للمؤسسات",
    plan: [
      "مقدمة وإشكالية البحث: ثورة النماذج اللغوية الكبيرة وأثرها على الإنتاجية",
      "المبحث الأول: الأسس الخوارزمية للتعلم العميق ومعالجة اللغات الطبيعية (NLP)",
      "المبحث الثاني: دراسة حالة: أتمتة الوثائق والخدمات الإدارية والمالية",
      "المبحث الثالث: التحديات الأخلاقية والأمنية والامتثال لقوانين حماية البيانات",
      "خاتمة وتوصيات: استراتيجيات دمج الذكاء الاصطناعي في المنظومات الجزائرية",
      "قائمة المراجع والمصادر العلمية الموثقة",
    ],
  },
  {
    id: "thesis_ai_mgt",
    level: "UNIVERSITY",
    subjectId: "ECONOMY",
    mode: "RESEARCH",
    title: "مذكرة تخرج: أثر التحول الرقمي وأنظمة الذكاء الاصطناعي على تحسين الأداء المالي للمؤسسات الاقتصادية الجزائرية",
    plan: [
      "مقدمة عامة: الإشكالية المركزية، أهمية الدراسة والفرضيات",
      "الفصل الأول: الإطار النظري والمفاهيمي للتحول الرقمي والذكاء الاصطناعي",
      "الفصل الثاني: واقع البنية التحتية والرقمنة في المؤسسات الاقتصادية الجزائرية",
      "الفصل الثالث: دراسة حالة تطبيقية ميدانية (تحليل المؤشرات والبيانات)",
      "خاتمة عامة: نتائج اختبار الفرضيات، التوصيات، والآفاق المستقبلية",
      "قائمة المراجع والمصادر الأكاديمية الموثقة بتوثيق APA",
    ],
  },
  {
    id: "thesis_law_cyber",
    level: "UNIVERSITY",
    subjectId: "LAW",
    mode: "RESEARCH",
    title: "مذكرة تخرج: الحماية الجنائية للمعطيات ذات الطابع الشخصي في التشريع الجزائري (دراسة تحليلية للقانون 18-07)",
    plan: [
      "مقدمة وإشكالية: التطور الرقمي وتحديات حماية الخصوصية الرقمية",
      "الفصل الأول: الإطار المفاهيمي والتاريخي للجريمة المعلوماتية وحماية المعطيات",
      "الفصل الثاني: آليات الحماية الموضوعية والإجرائية في القانون الجزائري 18-07",
      "الفصل الثالث: دور الهيئة الوطنية لحماية المعطيات (ANPDP) والتحديات الميدانية",
      "الخاتمة: الاستنتاجات، اقتراحات تعديل النصوص القانونية، والتوصيات",
      "قائمة المراجع والمؤلفات القانونية والجرائد الرسمية المعتمدة",
    ],
  },
  {
    id: "thesis_fintech",
    level: "UNIVERSITY",
    subjectId: "ECONOMY",
    mode: "RESEARCH",
    title: "مذكرة تخرج: تحديات الشمول المالي وتطوير الدفع الإلكتروني في البنوك التجارية الجزائرية (دراسة حالة بنك BADR)",
    plan: [
      "مقدمة: إشكالية عصرنة الخدمات المصرفية ونظام الدفع الإلكتروني بالجزائر",
      "الفصل الأول: الأسس النظرية للصيرفة الإلكترونية والشمول المالي",
      "الفصل الثاني: المنظومة القانونية والمصرفية للدفع الإلكتروني وبطاقة الذهبية و CIB",
      "الفصل الثالث: دراسة ميدانية واستبيان لتحليل رضا الزبائن في بنك الفلاحة والتنمية الريفية",
      "خاتمة: حوصلة النتائج وتوصيات لتوسيع التغطية المصرفية الرقمية",
      "قائمة المصادر والمراجع والدوريات المصرفية الجزائرية والدولية",
    ],
  },
  // بحوث فلسفة
  {
    id: "philo_sci",
    level: "SECONDARY",
    subjectId: "PHILO",
    mode: "RESEARCH",
    title: "المشكلة العلمية والإشكالية الفلسفية: الحدود والتكامل المعرفي",
    plan: [
      "طرح الإشكال: هل تميز الفلسفة عن العلم يعني القطيعة أم التكامل؟",
      "محاولة حل المشكلة - القضية: أوجه التمايز بين الحقل الفلسفي والمنهج العلمي",
      "نقيض القضية: التداخل العضوي وتغذية التساؤل الفلسفي للابتكار العلمي",
      "التركيب: نحو نظرة شمولية تتكامل فيها التجربة مع التأمل العقلاني",
      "حل الإشكال: الخاتمة ونتائج البحث المعرفي",
    ],
  },
  // نماذج امتحانات وفروض
  {
    id: "exam_bem_arab",
    level: "MIDDLE",
    subjectId: "ARABIC",
    mode: "EXAM",
    title: "امتحان تجريبي لشهادة التعليم المتوسط (BEM) في اللغة العربية",
    plan: [
      "الجزء الأول: السند النصي (نص أصيل حول حب الوطن وخدمة المجتمع)",
      "أسئلة فهم النص والبناء الفكري (04 نقاط)",
      "أسئلة قواعد اللغة والظواهر الإعرابية والبناء الفني (04 نقاط)",
      "الجزء الثاني: الوضعية الإدماجية المعاييرية وسياق الإنتاج الكتابي (08 نقاط)",
      "ملحق الحل النموذجي المفصل وشبكة التقويم وسلّم التنقيط الرسمي (20/20)",
    ],
  },
  {
    id: "exam_bac_math",
    level: "SECONDARY",
    subjectId: "MATH",
    mode: "EXAM",
    title: "فرض الفصل الثاني النموذجي في الرياضيات - 3 ثانوي علوم تجريبية",
    plan: [
      "التمرين الأول: دراسة المتتاليات العددية والبرهان بالتراجع (05 نقاط)",
      "التمرين الثاني: الأعداد المركبة والتحويلات النقطية في المستوي (05 نقاط)",
      "المسألة الشاملة: دراسة دالة لوغاريتمية وتعيين المماسات وحساب المساحات (10 نقاط)",
      "ورقة التصحيح النموذجي مع خطوات التعليل وتوزيع العلامات بالتفصيل",
    ],
  },
  {
    id: "exam_prim_sci",
    level: "PRIMARY",
    subjectId: "SCIENCES",
    mode: "EXAM",
    title: "اختبار الفصل الأول في التربية العلمية والتكنولوجية - 4 ابتدائي",
    plan: [
      "السؤال الأول: ربط المفاهيم بوظائف الأعضاء الحيوية (02.5 نقاط)",
      "السؤال الثاني: صح أو خطأ مع تصحيح الخطأ إن وجد (02.5 نقاط)",
      "السؤال الثالث: إكمال الفراغات بالكلمات العلمية المناسبة (02 نقاط)",
      "الوضعية الإدماجية: تصنيف الأطعمة وتحديد الوجبة الصحية المتكاملة (03 نقاط)",
    ],
  },
];

/**
 * دالة لاحتساب تكلفة النقاط لصاحب المحل وسعر البيع المقترح للزبون
 */
export function calculateEducationPricing(
  pageCount: 1 | 2 | 3 | 5 | 10,
  mode: DocumentMode,
  hasAnswerKey: boolean
) {
  let pointsCost = 10;
  let defaultSaleDZD = 150;

  if (pageCount === 1) {
    pointsCost = 8;
    defaultSaleDZD = 100;
  } else if (pageCount === 2) {
    pointsCost = 10;
    defaultSaleDZD = 150;
  } else if (pageCount === 3) {
    pointsCost = 15;
    defaultSaleDZD = 250;
  } else if (pageCount === 5) {
    pointsCost = 20;
    defaultSaleDZD = 350;
  } else if (pageCount === 10) {
    pointsCost = 30;
    defaultSaleDZD = 600;
  }

  // إضافة نقاط رمزية للحل النموذجي إذا كان امتحاناً متعدد الصفحات
  if (mode === "EXAM" && hasAnswerKey) {
    pointsCost += 2;
    defaultSaleDZD += 50;
  }

  return { pointsCost, defaultSaleDZD };
}
