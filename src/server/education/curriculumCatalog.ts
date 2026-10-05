/**
 * 📚 Sahla Algerian Curriculum Catalog v2.0 (خريطة المنهاج الوطني الجزائري)
 * Compliant with Algerian Ministry of National Education Standards.
 * Hierarchy: Stage -> Level -> Track -> Subject -> Domain -> Unit (مقطع تعليمي) -> Competency
 */

export const CATALOG_VERSION = "2026.1";

export interface CurriculumUnit {
  id: string; // e.g. "AM4-MATH-U01"
  code: string;
  title: string;
  domain: string;
  trimester: 1 | 2 | 3;
  competency: string;
  key_concepts: string[];
  boundaries: string;
  textbook_ref: string;
}

export interface SubjectMetadata {
  id: string;
  name: string;
  coefficient: number; // المعامل
  weekly_hours: number; // الحجم الساعي
  exam_duration_hours: number; // مدة الاختبار بالساعات
  has_situation_integration: boolean; // هل يتضمن وضعية إدماجية
  units: CurriculumUnit[];
}

export interface TrackMetadata {
  id: string;
  name: string;
  subjects: SubjectMetadata[];
}

export interface LevelMetadata {
  id: number;
  code: string; // 1AP, 4AM, 3AS
  name: string;
  stage: "primary" | "middle" | "secondary";
  is_official_exam_year?: boolean; // BEM or BAC
  exam_title?: string; // شهادة التعليم المتوسط، البكالوريا
  tracks?: TrackMetadata[];
  subjects?: SubjectMetadata[];
}

export const ALGERIAN_WILAYAS_DIRECTORATES = [
  "مديرية التربية لولاية أدرار (01)",
  "مديرية التربية لولاية الشلف (02)",
  "مديرية التربية لولاية الأغواط (03)",
  "مديرية التربية لولاية أم البواقي (04)",
  "مديرية التربية لولاية باتنة (05)",
  "مديرية التربية لولاية بجاية (06)",
  "مديرية التربية لولاية بسكرة (07)",
  "مديرية التربية لولاية بشار (08)",
  "مديرية التربية لولاية البليدة (09)",
  "مديرية التربية لولاية البويرة (10)",
  "مديرية التربية لولاية تمنراست (11)",
  "مديرية التربية لولاية تبسة (12)",
  "مديرية التربية لولاية تلمسان (13)",
  "مديرية التربية لولاية تيارت (14)",
  "مديرية التربية لولاية تيزي وزو (15)",
  "مديرية التربية لولاية الجزائر - وسط (16)",
  "مديرية التربية لولاية الجزائر - شرق (16)",
  "مديرية التربية لولاية الجزائر - غرب (16)",
  "مديرية التربية لولاية الجلفة (17)",
  "مديرية التربية لولاية جيجل (18)",
  "مديرية التربية لولاية سطيف (19)",
  "مديرية التربية لولاية سعيدة (20)",
  "مديرية التربية لولاية سكيكدة (21)",
  "مديرية التربية لولاية سيدي بلعباس (22)",
  "مديرية التربية لولاية عنابة (23)",
  "مديرية التربية لولاية قالمة (24)",
  "مديرية التربية لولاية قسنطينة (25)",
  "مديرية التربية لولاية المدية (26)",
  "مديرية التربية لولاية مستغانم (27)",
  "مديرية التربية لولاية المسيلة (28)",
  "مديرية التربية لولاية معسكر (29)",
  "مديرية التربية لولاية ورقلة (30)",
  "مديرية التربية لولاية وهران (31)",
  "مديرية التربية لولاية البيض (32)",
  "مديرية التربية لولاية إليزي (33)",
  "مديرية التربية لولاية برج بوعريريج (34)",
  "مديرية التربية لولاية بومرداس (35)",
  "مديرية التربية لولاية الطارف (36)",
  "مديرية التربية لولاية تندوف (37)",
  "مديرية التربية لولاية تيسمسيلت (38)",
  "مديرية التربية لولاية الوادي (39)",
  "مديرية التربية لولاية خنشلة (40)",
  "مديرية التربية لولاية سوق أهراس (41)",
  "مديرية التربية لولاية تيبازة (42)",
  "مديرية التربية لولاية ميلة (43)",
  "مديرية التربية لولاية عين الدفلى (44)",
  "مديرية التربية لولاية النعامة (45)",
  "مديرية التربية لولاية عين تموشنت (46)",
  "مديرية التربية لولاية غرداية (47)",
  "مديرية التربية لولاية غليزان (48)",
];

export const CURRICULUM_CATALOG: { stages: Record<string, LevelMetadata[]> } = {
  stages: {
    primary: [
      {
        id: 1,
        code: "1AP",
        name: "السنة الأولى ابتدائي",
        stage: "primary",
        subjects: [
          {
            id: "ARABIC",
            name: "اللغة العربية",
            coefficient: 2,
            weekly_hours: 9,
            exam_duration_hours: 1,
            has_situation_integration: false,
            units: [
              {
                id: "AP1-ARA-U01",
                code: "U01",
                title: "عائلتي ومدرستي",
                domain: "فهم المنطوق والتعبير",
                trimester: 1,
                competency: "التواصل الشفهي والتعبير عن المحيط القريب",
                key_concepts: ["التحية", "أفراد الأسرة", "الأدوات المدرسية"],
                boundaries: "جمل بسيطة قصيرة لا تتجاوز 4 كلمات",
                textbook_ref: "كتاب القراءة والتعبير ص 10",
              },
            ],
          },
          {
            id: "MATHS",
            name: "الرياضيات",
            coefficient: 2,
            weekly_hours: 5,
            exam_duration_hours: 1,
            has_situation_integration: false,
            units: [
              {
                id: "AP1-MAT-U01",
                code: "U01",
                title: "الأعداد والحساب من 1 إلى 10",
                domain: "الأعداد والحساب",
                trimester: 1,
                competency: "عد وكتابة ومقارنة الأعداد الطبيعية الأصغر من 10",
                key_concepts: ["العد التصاعدي", "المقارنة بأكبر وأصغر", "الجمع البسيط"],
                boundaries: "عدم تجاوز المجال العددي 10",
                textbook_ref: "كتاب الرياضيات ص 14",
              },
            ],
          },
        ],
      },
      {
        id: 4,
        code: "4AP",
        name: "السنة الرابعة ابتدائي",
        stage: "primary",
        subjects: [
          {
            id: "ARABIC",
            name: "اللغة العربية",
            coefficient: 3,
            weekly_hours: 7,
            exam_duration_hours: 1.5,
            has_situation_integration: true,
            units: [
              {
                id: "AP4-ARA-U01",
                code: "U01",
                title: "القيم الإنسانية والعيش معاً في سلام",
                domain: "فهم المكتوب والإنتاج الكتابي",
                trimester: 1,
                competency: "إنتاج نص سردي وصفي يعبر عن التضامن والتعاون",
                key_concepts: ["الفعل الفاعل المفعول به", "الجملة الفعلية", "أدوات الربط"],
                boundaries: "نص لا يتجاوز 6 إلى 8 أسطر",
                textbook_ref: "كتاب اللغة العربية ص 12",
              },
              {
                id: "AP4-ARA-U02",
                code: "U02",
                title: "الهوية الوطنية وتاريخ الجزائر المجيد",
                domain: "فهم المكتوب والإنتاج الكتابي",
                trimester: 2,
                competency: "الاعتزاز بالانتماء الوطني ورموز السيادة",
                key_concepts: ["العلم الوطني", "النشيد قسماً", "شهداء الثورة التحريرية"],
                boundaries: "حقائق تاريخية مبسطة مع التركيز على الرموز الوطنية",
                textbook_ref: "كتاب اللغة العربية ص 45",
              },
            ],
          },
          {
            id: "SCIENCES",
            name: "التربية العلمية والتكنولوجية",
            coefficient: 2,
            weekly_hours: 2,
            exam_duration_hours: 1,
            has_situation_integration: true,
            units: [
              {
                id: "AP4-SCI-U01",
                code: "U01",
                title: "التنفس وقواعد الصحة الحركية",
                domain: "الإنسان والصحة",
                trimester: 1,
                competency: "تبني سلوك صحي وقائي للجهازين التنفسي والحركي",
                key_concepts: ["الشهيق والزفير", "النبض القلبي", "مخاطر التدخين والتلوث"],
                boundaries: "الابتعاد عن الشروحات التشريحية المعقدة",
                textbook_ref: "كتاب التربية العلمية ص 16",
              },
            ],
          },
          {
            id: "HISTORY_GEO",
            name: "التاريخ والجغرافيا",
            coefficient: 2,
            weekly_hours: 2,
            exam_duration_hours: 1,
            has_situation_integration: true,
            units: [
              {
                id: "AP4-HG-U01",
                code: "U01",
                title: "المعالم المكانية وتضاريس الجزائر",
                domain: "السكان والبيئة",
                trimester: 1,
                competency: "تحديد الموقع الجغرافي للجزائر وأقاليمها الطبيعية",
                key_concepts: ["الشمال والجنوب", "سلسلة الأطلس التلي والصحراوي", "الصحراء الكبرى"],
                boundaries: "خريطة الجزائر الصماء والبيانات الكبرى فقط",
                textbook_ref: "كتاب الجغرافيا ص 10",
              },
            ],
          },
        ],
      },
      {
        id: 5,
        code: "5AP",
        name: "السنة الخامسة ابتدائي (امتحان التقييم)",
        stage: "primary",
        is_official_exam_year: true,
        exam_title: "امتحان تقييم مكتسبات مرحلة التعليم الابتدائي",
        subjects: [
          {
            id: "ARABIC",
            name: "اللغة العربية",
            coefficient: 3,
            weekly_hours: 7,
            exam_duration_hours: 1.5,
            has_situation_integration: true,
            units: [
              {
                id: "AP5-ARA-U01",
                code: "U01",
                title: "القيم الأخلاقية والإنسانية في المجتمع",
                domain: "فهم المكتوب والتعبير الكتابي",
                trimester: 1,
                competency: "إنتاج نص مركب يوظف كان وأخواتها وإن وأخواتها",
                key_concepts: ["النواسخ", "المبتدأ والخبر", "التعبير عن الرأي بحجة"],
                boundaries: "فقرة من 8 إلى 10 أسطر",
                textbook_ref: "كتاب اللغة العربية 5 ابتدائي ص 14",
              },
            ],
          },
          {
            id: "MATHS",
            name: "الرياضيات",
            coefficient: 3,
            weekly_hours: 5,
            exam_duration_hours: 1.5,
            has_situation_integration: true,
            units: [
              {
                id: "AP5-MAT-U01",
                code: "U01",
                title: "الأعداد الكبيرة والعمليات الحسابية والكسور",
                domain: "الأعداد والحساب",
                trimester: 1,
                competency: "حل وضعيات مشكلة بتوظيف الأعداد الطبيعية والكسور البسيطة",
                key_concepts: ["مراتب الأعداد", "الضرب في عدد ذي رقمين", "مفهوم الكسر"],
                boundaries: "أرقام حتى 999 999 والكسور ذات المقامات المألوفة",
                textbook_ref: "كتاب الرياضيات ص 18",
              },
            ],
          },
        ],
      },
    ],

    middle: [
      {
        id: 3,
        code: "3AM",
        name: "السنة الثالثة متوسط",
        stage: "middle",
        subjects: [
          {
            id: "HISTORY",
            name: "التاريخ",
            coefficient: 2,
            weekly_hours: 2,
            exam_duration_hours: 1.5,
            has_situation_integration: true,
            units: [
              {
                id: "AM3-HIST-U01",
                code: "U01",
                title: "الجزائر في العهد العثماني (البحرية الجزائرية ومكانتها)",
                domain: "تاريخ الجزائر الحديث",
                trimester: 1,
                competency: "إبراز المكانة الدولية للجزائر وتطور الأسطول البحري",
                key_concepts: ["الإخوة بربروس", "دار السلطان والبايلكات", "معاهدات السلام الدولية"],
                boundaries: "الفترة الممتدة من 1518م إلى 1830م دون تفاصيل المعارك الثانوية",
                textbook_ref: "كتاب التاريخ 3 متوسط ص 22",
              },
              {
                id: "AM3-HIST-U02",
                code: "U02",
                title: "الثورة الزراعية والتنمية الاقتصادية في الجزائر المعاصرة",
                domain: "تاريخ الجزائر المعاصر وبناء الدولة",
                trimester: 2,
                competency: "تقييم السياسات التنموية الوطنية الكبرى بعد الاستقلال",
                key_concepts: ["القرى الفلاحية", "تأميم الأراضي", "السدود واستصلاح الأراضي الصحراوية"],
                boundaries: "المحطات التاريخية الرسمية المعتمدة لسنوات السبعينات والثمانينات",
                textbook_ref: "كتاب التاريخ 3 متوسط ص 78",
              },
            ],
          },
        ],
      },
      {
        id: 4,
        code: "4AM",
        name: "السنة الرابعة متوسط (شهادة BEM)",
        stage: "middle",
        is_official_exam_year: true,
        exam_title: "شهادة التعليم المتوسط (BEM)",
        subjects: [
          {
            id: "MATHS",
            name: "الرياضيات",
            coefficient: 4,
            weekly_hours: 5,
            exam_duration_hours: 2,
            has_situation_integration: true,
            units: [
              {
                id: "AM4-MAT-U01",
                code: "U01",
                title: "الأعداد الطبيعية والأعداد الناطقة وحساب الجذور التربيعية",
                domain: "الأعداد والحساب",
                trimester: 1,
                competency: "حساب القاسم المشترك الأكبر PGCD وتبسيط العبارات التي تتضمن جذوراً تربيعية",
                key_concepts: ["خوارزمية إقليدس", "الكسور غير القابلة للاختزال", "خواص الجذور a√b"],
                boundaries: "كتابة النتائج بصيغة كسرية مختزلة وجذور مبسطة، الأرقام الغربية 0-9",
                textbook_ref: "كتاب الرياضيات 4 متوسط ص 10",
              },
              {
                id: "AM4-MAT-U02",
                code: "U02",
                title: "الحساب الحرفي والمعادلات والمتراجحات من الدرجة الأولى",
                domain: "الجبر والدوال",
                trimester: 1,
                competency: "نشر وتحليل عبارات جبرية وحل متراجحات وتمثيل حلولها بيانياً",
                key_concepts: ["المتطابقات الشهيرة الثلاث", "التحليل بالعامل المشترك", "معادلة الجداء المعدوم"],
                boundaries: "الدرجة الأولى فقط بعد التحليل",
                textbook_ref: "كتاب الرياضيات ص 36",
              },
              {
                id: "AM4-MAT-U03",
                code: "U03",
                title: "خاصية طالس وحساب المثلثات في المثلث القائم",
                domain: "الهندسة والمستوي",
                trimester: 2,
                competency: "حساب الأطوال وإثبات التوازي وتوظيف جيب وجيب تمام وظل زاوية حادة",
                key_concepts: ["طالس والعكسية", "النسب المثلثية cos sin tan", "العلاقة cos² + sin² = 1"],
                boundaries: "المثلث القائم والدائرة المحيطة",
                textbook_ref: "كتاب الرياضيات ص 70",
              },
              {
                id: "AM4-MAT-U04",
                code: "U04",
                title: "الدوال الخطية والتآلفية وجمل معادلتين والوضعية الإدماجية المركبة",
                domain: "تنظيم المعطيات والدوال",
                trimester: 3,
                competency: "نمذجة وضعيات من الواقع وحلها بيانيا وجبريا",
                key_concepts: ["معامل التوجيه", "التمثيل البياني", "حل جملة معادلتين بالتعويض والجمع"],
                boundaries: "تطبيقات مالية واقتصادية واقعية ومشاكل المساحات والمحيطات",
                textbook_ref: "كتاب الرياضيات ص 110",
              },
            ],
          },
          {
            id: "PHYSICS",
            name: "العلوم الفيزيائية والتكنولوجيا",
            coefficient: 2,
            weekly_hours: 2,
            exam_duration_hours: 1.5,
            has_situation_integration: true,
            units: [
              {
                id: "AM4-PHY-U01",
                code: "U01",
                title: "المادة وتحولاتها (التحليل الكهربائي والتفاعلات الكيميائية في المحاليل الشاردية)",
                domain: "المادة وتحولاتها",
                trimester: 1,
                competency: "تفسير هجرة الشوارد وكتابة المعادلات النصفية والإجمالية بالأفراد والصيغ الشاردية",
                key_concepts: ["المحلول المائي والشاردي", "المصعد والمهبط", "تفاعل حمض كلور الماء مع المعادن"],
                boundaries: "الشوارد البسيطة المبرمجة: Zn2+, Fe2+, Cu2+, Al3+, Cl-",
                textbook_ref: "كتاب الفيزياء ص 12",
              },
              {
                id: "AM4-PHY-U02",
                code: "U02",
                title: "الظواهر الميكانيكية (الثقل وتوازن جسم صلب خاضع لقوتين أو 3 قوى)",
                domain: "الميكانيك",
                trimester: 2,
                competency: "تمثيل القوى بشعاع وتطبيق شرطي التوازن F1 + F2 = 0",
                key_concepts: ["الثقل والكتلة P = m.g", "دافعة أرخميدس", "قوة شد الخيط ورد الفعل"],
                boundaries: "الأجسام الصلبة المتجانسة فقط",
                textbook_ref: "كتاب الفيزياء ص 55",
              },
              {
                id: "AM4-PHY-U03",
                code: "U03",
                title: "الظواهر الكهربائية والأمن الكهربائي في المنازل",
                domain: "الكهرباء",
                trimester: 2,
                competency: "قراءة المخططات الكهربائية واقتراح حلول الحماية من الصدمات والحمولة الزائدة",
                key_concepts: ["التيار المتناوب", "المأخذ الأرضي", "القاطع التفاضلي والمنصهرة"],
                boundaries: "شبكة التوزيع المنزلية 230V ذات التردد 50Hz",
                textbook_ref: "كتاب الفيزياء ص 92",
              },
            ],
          },
          {
            id: "SCIENCES",
            name: "علوم الطبيعة والحياة",
            coefficient: 2,
            weekly_hours: 2,
            exam_duration_hours: 1.5,
            has_situation_integration: true,
            units: [
              {
                id: "AM4-SCI-U01",
                code: "U01",
                title: "التغذية عند الإنسان (الهضم والامتصاص المعوي ونقل المغذيات)",
                domain: "الإنسان والصحة",
                trimester: 1,
                competency: "ربط التحولات الكيميائية للأغذية بنشاط الأنزيمات وامتصاص الزغابة المعوية",
                key_concepts: ["الأنزيمات النوعية", "الزغابة المعوية", "الدم واللمف والوسط الداخلي"],
                boundaries: "الهضم الميكانيكي والكيميائي للأغذية الأساسية",
                textbook_ref: "كتاب علوم الطبيعة والحياة ص 10",
              },
              {
                id: "AM4-SCI-U02",
                code: "U02",
                title: "التنسيق الوظيفي في العضوية (الاتصال العصبي والمناعة)",
                domain: "الاتصال العصبي والمناعة",
                trimester: 2,
                competency: "تفسير المنعكسات الفطرية والحركات الإرادية وخطوط الدفاع المناعي الثلاثة",
                key_concepts: ["المستقبل الحسي والعصب والمخ", "القوس الانعكاسية", "الاستجابة الخلطية والخلوية"],
                boundaries: "الابتعاد عن الآليات الجزيئية المتقدمة التي تدرس في الثانوي",
                textbook_ref: "كتاب العلوم ص 60",
              },
            ],
          },
          {
            id: "ARABIC",
            name: "اللغة العربية وآدابها",
            coefficient: 5,
            weekly_hours: 5,
            exam_duration_hours: 2,
            has_situation_integration: true,
            units: [
              {
                id: "AM4-ARA-U01",
                code: "U01",
                title: "قضايا المجتمع والتضامن الإنساني والإعلام والمجتمع",
                domain: "فهم المكتوب والإنتاج الكتابي",
                trimester: 1,
                competency: "تحليل نصوص نثرية واستخراج الفكرة العامة والأفكار الأساسية وإنتاج نص حجاجي",
                key_concepts: ["عطف النسق", "البدل وعطف البيان", "العدد وأحواله", "النمط الحجاجي والتفسيري"],
                boundaries: "مواضيع واقعية تعالج قضايا العصر دون إقحام سياسي",
                textbook_ref: "كتاب اللغة العربية 4 متوسط ص 12",
              },
            ],
          },
          {
            id: "HISTORY_GEO",
            name: "التاريخ والجغرافيا",
            coefficient: 3,
            weekly_hours: 3,
            exam_duration_hours: 1.5,
            has_situation_integration: true,
            units: [
              {
                id: "AM4-HG-U01",
                code: "U01",
                title: "الثورة التحريرية الكبرى (1954-1962م) ومراحل الكفاح الوطني",
                domain: "تاريخ الجزائر المعاصر",
                trimester: 2,
                competency: "تحليل بيان أول نوفمبر ومؤتمر الصومام والمظاهرات الشعبية ودور جيش وجبهة التحرير",
                key_concepts: ["بيان أول نوفمبر", "مؤتمر الصومام 1956", "مظاهرات 11 ديسمبر 1960", "اتفاقيات إيفيان"],
                boundaries: "الالتزام بالحقائق التاريخية الوطنية الثابتة في المنهاج الرسمي",
                textbook_ref: "كتاب التاريخ 4 متوسط ص 54",
              },
            ],
          },
        ],
      },
    ],

    secondary: [
      {
        id: 3,
        code: "3AS",
        name: "السنة الثالثة ثانوي (شهادة البكالوريا BAC)",
        stage: "secondary",
        is_official_exam_year: true,
        exam_title: "شهادة البكالوريا (BAC)",
        tracks: [
          {
            id: "SCIENTIFIC",
            name: "شعبة علوم تجريبية",
            subjects: [
              {
                id: "SCIENCES",
                name: "علوم الطبيعة والحياة",
                coefficient: 6,
                weekly_hours: 6,
                exam_duration_hours: 4.5,
                has_situation_integration: true,
                units: [
                  {
                    id: "AS3-SCI-U01",
                    code: "U01",
                    title: "آليات تركيب البروتين (الاستنساخ والترجمة وتنشيط الأحماض الآمينية)",
                    domain: "التخصص الوظيفي للبروتينات",
                    trimester: 1,
                    competency: "نمذجة وتفسير مراحل التعبير المورثي وتحديد دور الـ ARNm والريبوزوم",
                    key_concepts: ["الاستنساخ الحيوي", "الشفة الوراثية", "ARNt والريبوزوم", "طاقة ATP"],
                    boundaries: "الخلايا حقيقية النواة وبدائية النواة وفق المنهاج الجزائري",
                    textbook_ref: "كتاب علوم الطبيعة والحياة 3 ثانوي ص 12",
                  },
                  {
                    id: "AS3-SCI-U02",
                    code: "U02",
                    title: "دور البروتينات في الدفاع عن الذات (المناعة الخلطية والخلوية وفقدان المناعة VIH)",
                    domain: "المناعة",
                    trimester: 1,
                    competency: "استغلال الوثائق العلمية وتفسير التعرف المزدوج وآليات البلعمة وتخريب الخلايا المصابة",
                    key_concepts: ["محددات الذات CMH I و CMH II", "الخلايا LB و LT4 و LT8", "الأجسام المضادة والغشاء الهيولي"],
                    boundaries: "الاستدلال العلمي المنهجي المبني على التجارب والشواهد المخبرية",
                    textbook_ref: "كتاب العلوم ص 70",
                  },
                  {
                    id: "AS3-SCI-U03",
                    code: "U03",
                    title: "دور البروتينات في الاتصال العصبي (النقل المشبكي والإدماج العصبي)",
                    domain: "الاتصال العصبي",
                    trimester: 2,
                    competency: "تفسير كمون الراحة وكمون العمل وتأثير المبلغات العصبية والمخدرات",
                    key_concepts: ["القنوات الفولطية وقنوات التسرب", "مضخة Na+/K+", "PPSE و PPSI", "الكورار والمورفين"],
                    boundaries: "التسجيلات الإلكتروفيزيولوجية والأسمولية",
                    textbook_ref: "كتاب العلوم ص 130",
                  },
                ],
              },
              {
                id: "MATHS",
                name: "الرياضيات",
                coefficient: 5,
                weekly_hours: 5,
                exam_duration_hours: 3.5,
                has_situation_integration: false,
                units: [
                  {
                    id: "AS3-MAT-U01",
                    code: "U01",
                    title: "الدوال العددية والنهايات والاشتقاقية ونظرية القيم المتوسطة",
                    domain: "التحليل",
                    trimester: 1,
                    competency: "دراسة سلوك الدوال العددية ورسم المستقيمات المقاربة والمنحنيات البيانية",
                    key_concepts: ["المستقيم المقارب المائل", "مبرهنة القيم المتوسطة", "نقطة الانعطاف ونقطة التماثل"],
                    boundaries: "الدوال الناطقة والصماء وكثيرات الحدود، الأرقام الغربية 0-9",
                    textbook_ref: "كتاب الرياضيات 3 ثانوي ص 14",
                  },
                  {
                    id: "AS3-MAT-U02",
                    code: "U02",
                    title: "الدوال الأسية والدوال اللوغاريتمية النيبيرية وحساب التكامل",
                    domain: "التحليل",
                    trimester: 1,
                    competency: "حل المعادلات التفاضلية ودراسة الدوال الأسية واللوغاريتمية وحساب المساحات بالتكامل",
                    key_concepts: ["الدالة الأسية exp", "الدالة اللوغاريتمية ln", "الدوال الأصلية والتكامل بالتجزئة"],
                    boundaries: "مجموعات التعريف وخواص الجداء والقوى",
                    textbook_ref: "كتاب الرياضيات ص 76",
                  },
                ],
              },
              {
                id: "PHYSICS",
                name: "العلوم الفيزيائية",
                coefficient: 5,
                weekly_hours: 5,
                exam_duration_hours: 3.5,
                has_situation_integration: false,
                units: [
                  {
                    id: "AS3-PHY-U01",
                    code: "U01",
                    title: "المتابعة الزمنية لتحول كيميائي في وسط مائي",
                    domain: "الكيمياء",
                    trimester: 1,
                    competency: "رسم جداول التقدم وحساب السرعة الحجمية للتفاعل وزمن نصف التفاعل t1/2",
                    key_concepts: ["المعايرة اللونية", "قياس الناقلية الكهربائية", "العوامل الحركية ودرجة الحرارة"],
                    boundaries: "التفاعلات البطيئة والتامة",
                    textbook_ref: "كتاب الفيزياء 3 ثانوي ص 10",
                  },
                  {
                    id: "AS3-PHY-U02",
                    code: "U02",
                    title: "تطور جملة ميكانيكية (قوانين نيوتن وحركة الكواكب والأقمار والكرية في الهواء)",
                    domain: "الميكانيك",
                    trimester: 2,
                    competency: "تطبيق القانون الثاني لنيوتن وإيجاد المعادلات التفاضلية للسرعة والموضع",
                    key_concepts: ["مرجع غاليلي", "تسارع الجاذبية g", "قوة الاحتكاك المائع f = k.v"],
                    boundaries: "السقوط الشاقولي الحقيقي والحر",
                    textbook_ref: "كتاب الفيزياء ص 150",
                  },
                ],
              },
              {
                id: "PHILOSOPHY",
                name: "الفلسفة",
                coefficient: 2,
                weekly_hours: 2,
                exam_duration_hours: 3,
                has_situation_integration: true,
                units: [
                  {
                    id: "AS3-PHI-U01",
                    code: "U01",
                    title: "السؤال العلمي والسؤال الفلسفي والمشكلة والإشكالية",
                    domain: "فلسفة المعرفة والعلوم",
                    trimester: 1,
                    competency: "كتابة مقال فلسفي منظم وفق الطريقة المقارنة أو الجدلية",
                    key_concepts: ["طريقة المقارنة", "الطريقة الجدلية", "الاستقصاء بالوضع"],
                    boundaries: "الالتزام بخطوات المقال الفلسفي المعتمدة وزارياً (طرح المشكلة، محاولة حلها، الخاتمة)",
                    textbook_ref: "كتاب الفلسفة 3 ثانوي ص 15",
                  },
                ],
              },
            ],
          },
          {
            id: "LITERATURE",
            name: "شعبة آداب وفلسفة",
            subjects: [
              {
                id: "PHILOSOPHY",
                name: "الفلسفة",
                coefficient: 6,
                weekly_hours: 6,
                exam_duration_hours: 4.5,
                has_situation_integration: true,
                units: [
                  {
                    id: "AS3-PHI-LIT-U01",
                    code: "U01",
                    title: "الإدراك الحسي والذاكرة والخيال واللغة والفكر",
                    domain: "الإنسان والمدركات",
                    trimester: 1,
                    competency: "المعالجة الفلسفية المعمقة لإشكالية علاقة الفكر باللغة والذاكرة بالدماغ",
                    key_concepts: ["النظرية العقلية والحسية", "الجشطالتية", "العلامة واللسانيات عند دوسوسير"],
                    boundaries: "الاستقصاء بالوضع وتحليل النصوص الفلسفية الكلاسيكية والحديثة",
                    textbook_ref: "كتاب الفلسفة شعبة آداب ص 18",
                  },
                ],
              },
              {
                id: "ARABIC",
                name: "اللغة العربية وآدابها",
                coefficient: 6,
                weekly_hours: 6,
                exam_duration_hours: 4,
                has_situation_integration: true,
                units: [
                  {
                    id: "AS3-ARA-LIT-U01",
                    code: "U01",
                    title: "عصر الضعف والانحطاط وعصر النهضة الأدبية وشعر المنفى والمهجر",
                    domain: "الأدب وتاريخه والنقد",
                    trimester: 1,
                    competency: "دراسة نصوص المديح النبوي والشعر التعليمي وأشعار البارودي وشوقي وإيليا أبي ماضي",
                    key_concepts: ["البديع والبيان", "الرابطة القلمية", "الاتساق والانسجام", "التضمين والاقتباس"],
                    boundaries: "العروض وتحليل البناء الفكري والبناء اللغوي والتقييم النقدي",
                    textbook_ref: "كتاب الأدب العربي ص 12",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

/**
 * Helper: Find curriculum units for a given stage, level, subject, and optional stream
 */
export function getCurriculumUnits(stage: string, levelCode: string, subjectId: string, trackId?: string): CurriculumUnit[] {
  const stageLevels = CURRICULUM_CATALOG.stages[stage.toLowerCase()] || [];
  const levelMeta = stageLevels.find(
    (l) => l.code.toUpperCase() === levelCode.toUpperCase() || String(l.id) === String(levelCode)
  );

  if (!levelMeta) return [];

  // If level has tracks (Secondary)
  if (levelMeta.tracks && levelMeta.tracks.length > 0) {
    const selectedTrack = trackId
      ? levelMeta.tracks.find((t) => t.id.toUpperCase() === trackId.toUpperCase())
      : levelMeta.tracks[0];

    const subjectMeta = selectedTrack?.subjects.find((s) => s.id.toUpperCase() === subjectId.toUpperCase());
    return subjectMeta?.units || [];
  }

  // Primary or Middle
  const subjectMeta = levelMeta.subjects?.find((s) => s.id.toUpperCase() === subjectId.toUpperCase());
  return subjectMeta?.units || [];
}
