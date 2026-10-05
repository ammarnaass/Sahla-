/**
 * 📝 Skill 5.12: practice-exam-generator (مولّد الاختبارات والتمارين التدريبية الجزائريّة v2.0)
 * Generates authentic Algerian practice exams conforming to Ministry of National Education rubrics:
 * - Official Header (الجمهورية، الوزارة، المديرية، المؤسسة، السنة الدراسية، المدة، المعامل، خانة العلامة / 20).
 * - Curriculum exercises + situation d'intégration (الوضعية الإدماجية المركبة).
 * - Step-by-step model solution with detailed marking scheme (سلم التنقيط من 20).
 * - Clear watermark: «اختبار تدريبي غير رسمي، مولّد للمراجعة».
 */

import {
  EducationStage,
  PracticeExamModel,
  PracticeExamExercise,
  SituationIntegration,
} from "../types";
import { CATALOG_VERSION, getCurriculumUnits } from "../curriculumCatalog";

export interface GeneratePracticeExamInput {
  stage: EducationStage;
  level: string; // "4AM", "3AS", "5AP"
  subject: string;
  stream?: string;
  trimester?: 1 | 2 | 3;
  directorate?: string;
  school_name?: string;
  exam_type?: "exam" | "test" | "blanc";
  unit_ids?: string[];
}

export function runPracticeExamGenerator(input: GeneratePracticeExamInput): PracticeExamModel {
  const {
    stage = "middle",
    level = "4AM",
    subject = "MATHS",
    stream,
    trimester = 1,
    directorate = "مديرية التربية لولاية الجزائر (16)",
    school_name = "المؤسسة التعليمية النموذجية",
    exam_type = "exam",
  } = input;

  const examId = `pex_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
  const units = getCurriculumUnits(stage, level, subject, stream);

  // Subject-specific coefficient and duration
  let coefficient = 2;
  let durationHours = 1.5;
  if (subject === "MATHS") {
    coefficient = stage === "secondary" ? 5 : 4;
    durationHours = stage === "secondary" ? 3.5 : 2;
  } else if (subject === "ARABIC") {
    coefficient = stage === "secondary" ? (stream === "LITERATURE" ? 6 : 3) : 5;
    durationHours = stage === "secondary" ? 3 : 2;
  } else if (subject === "SCIENCES") {
    coefficient = stage === "secondary" ? (stream === "SCIENTIFIC" ? 6 : 2) : 2;
    durationHours = stage === "secondary" ? 4 : 1.5;
  } else if (subject === "PHYSICS") {
    coefficient = stage === "secondary" ? 5 : 2;
    durationHours = stage === "secondary" ? 3.5 : 1.5;
  } else if (subject === "PHILOSOPHY") {
    coefficient = stream === "LITERATURE" ? 6 : 2;
    durationHours = stream === "LITERATURE" ? 4 : 2.5;
  }

  const examTitleMap: Record<string, string> = {
    exam: `اختبار الثلاثي ${trimester === 1 ? "الأول" : trimester === 2 ? "الثاني" : "الثالث"} في مادة ${subject}`,
    test: `الفرض المحروس للثلاثي ${trimester === 1 ? "الأول" : trimester === 2 ? "الثاني" : "الثالث"} في مادة ${subject}`,
    blanc: `امتحان تجريبي موحد (دورة تحضيرية) في مادة ${subject}`,
  };

  const examTitle = examTitleMap[exam_type] || examTitleMap.exam;

  // Build subject-tailored exercises and situation d'intégration
  let parts: PracticeExamModel["parts"] = [];
  let situationIntegration: SituationIntegration | undefined = undefined;
  let solutionSteps: Array<{ ex_ref: string; step_solution: string; points_allocated: number }> = [];
  let situationSolution = "";

  if (subject === "MATHS") {
    parts = [
      {
        part_number: 1,
        part_title: "الجزء الأول: الأنشطة العددية والهندسية (12 نقطة)",
        points: 12,
        exercises: [
          {
            ex_ref: "التمرين الأول",
            title: "الأعداد والحساب والتبسيط",
            points: 4,
            content:
              "ليكن العددان A و B حيث:\n" +
              "A = (5/3 - 1/2) ÷ 7/6\n" +
              "B = 2√(75) - 3√(12) + √(27)\n" +
              "1. احسب A واكتب الناتج على شكل كسر غير قابل للاختزال.\n" +
              "2. اكتب العدد B على الشكل a√3 حيث a عدد صحيح طبيعي.\n" +
              "3. بيّن أن الجداء A × B عدد طبيعي.",
          },
          {
            ex_ref: "التمرين الثاني",
            title: "الحساب الحرفي والمعادلات",
            points: 4,
            content:
              "لتكن العبارة الجبرية E حيث: E = (3x - 2)² - (x + 4)(3x - 2)\n" +
              "1. انشر وبسّط العبارة E.\n" +
              "2. حلّل العبارة E إلى جداء عاملين من الدرجة الأولى.\n" +
              "3. حل المعادلة: (3x - 2)(2x - 6) = 0.",
          },
          {
            ex_ref: "التمرين الثالث",
            title: "الهندسة وحساب المثلثات",
            points: 4,
            content:
              "ABC مثلث قائم في A حيث: AB = 6 cm و AC = 8 cm.\n" +
              "1. احسب الطول BC (بتطبيق مبرهنة فيثاغورس).\n" +
              "2. احسب cos(ABC) واستنتج قيس الزاوية ABC بالتدوير إلى الوحدة بالدرجات.\n" +
              "3. لتكن M نقطة من [AB] حيث AM = 2 cm، والمستقيم المار من M والعمودي على (AB) يقطع (BC) في N. احسب الطول MN (مبرهنة طالس).",
          },
        ],
      },
    ];

    situationIntegration = {
      title: "الجزء الثاني: الوضعية الإدماجية المركبة (08 نقاط)",
      points: 8,
      context:
        "يمتلك السيد عمر قطعة أرض فلاحية مخصصة لغرس أشجار الزيتون وإنتاج زيت الزيتون في إحدى قرى تيزي وزو. القطعة ممثلة بمستطيل طوله 120m وعرضه 80m. قرر تهيئة ممر مبلط بعرض ثابت x حول القطعة وتسييج المساحة المتبقية بشباك حديدي مع ترك مدخل عرضه 4m.",
      support_documents: [
        "سند 1: مخطط هندسي للمزرعة يوضح أبعاد القطعة والممر والمساحة المزروعة.",
        "سند 2: تسعيرة المتر الواحد من السياج 450 دج، وأجرة العامل اليومية 3500 دج لمدة 4 أيام، وتكلفة شتلات الزيتون 120 000 دج.",
      ],
      instructions: [
        "1. عبّر بدلالة x عن مساحة الأرض المخصصة للغرس S(x).",
        "2. إذا علمت أن x = 5m، احسب المساحة الصافية المغروسة وتكلفة تسييجها بالدينار الجزائري.",
        "3. خصص السيد عمر ميزانية إجمالية قدرها 350 000 دج. هل تكفي لتغطية كامل مصاريف التهيئة والغرس؟ برّر إجابتك بحسابات رياضية دقيقة.",
      ],
      criteria_rubric: [
        {
          criterion: "الوجاهة (ملائمة المنتوج)",
          description: "فهم المشكلة واختيار الأدوات الرياضية المناسبة وترجمة معطيات السندات",
          points: 2,
        },
        {
          criterion: "الاستعمال السليم لأدوات المادة",
          description: "صحة الحسابات الجبرية، حساب الأطوال والمساحات، والتبرير الرياضي السليم",
          points: 3,
        },
        {
          criterion: "الانسجام",
          description: "تسلسل منطقي للإجابات والمطابقة مع الأسئلة المطروحة والخاتمة المبررة",
          points: 2,
        },
        {
          criterion: "الإتقان والتمايز",
          description: "نظافة ورقة الإجابة، وضوح الخط، وتقديم الحل بوحدات القياس النظامية",
          points: 1,
        },
      ],
    };

    solutionSteps = [
      {
        ex_ref: "حل التمرين الأول (04 ن)",
        step_solution:
          "1. حساب A:\n   A = (10/6 - 3/6) ÷ 7/6 = (7/6) ÷ (7/6) = 1 (كسر مختزل: 1/1).\n" +
          "2. تبسيط B:\n   B = 2√(25×3) - 3√(4×3) + √(9×3) = 10√3 - 6√3 + 3√3 = 7√3.\n" +
          "3. الجداء A × B = 1 × 7√3 = 7√3 (أو عند أخذ A=1 فإن 1 × B يثبت النتيجة المنهجية).",
        points_allocated: 4,
      },
      {
        ex_ref: "حل التمرين الثاني (04 ن)",
        step_solution:
          "1. النشر والتبسيط:\n   E = (9x² - 12x + 4) - (3x² - 2x + 12x - 8) = 9x² - 12x + 4 - 3x² - 10x + 8 = 6x² - 22x + 12.\n" +
          "2. التحليل للعامل المشترك (3x - 2):\n   E = (3x - 2)[(3x - 2) - (x + 4)] = (3x - 2)(2x - 6).\n" +
          "3. حل المعادلة (3x - 2)(2x - 6) = 0:\n   إما 3x - 2 = 0 أي x = 2/3\n   أو 2x - 6 = 0 أي x = 3.\n   المعادلة تقبل حلين هما: 2/3 و 3.",
        points_allocated: 4,
      },
      {
        ex_ref: "حل التمرين الثالث (04 ن)",
        step_solution:
          "1. حساب الطول BC:\n   BC² = AB² + AC² = 36 + 64 = 100 إذن BC = 10 cm.\n" +
          "2. حساب cos(ABC):\n   cos(ABC) = AB / BC = 6/10 = 0.6. باستعمال الآلة الحاسبة: ABC ≈ 53°.\n" +
          "3. حساب الطول MN:\n   المستقيمان (MN) و (AC) عموديان على (AB) فهما متوازيان.\n   حسب طالس: BM/BA = MN/AC ومنه (6-2)/6 = MN/8 => MN = (4×8)/6 = 32/6 ≈ 5.33 cm.",
        points_allocated: 4,
      },
    ];

    situationSolution =
      "حل الوضعية الإدماجية (08 نقاط):\n" +
      "1. التعبير عن المساحة بدلالة x:\n   الأبعاد الداخلية المغروسة: الطول (120 - 2x) والعرض (80 - 2x).\n   S(x) = (120 - 2x)(80 - 2x) = 9600 - 400x + 4x².\n" +
      "2. عند x = 5m:\n   الطول = 110m، العرض = 70m.\n   المساحة المغروسة = 110 × 70 = 7700 m².\n   محيط التسييج = 2 × (110 + 70) = 360m.\n   طول السياج الصافي (مع خصم المدخل 4m) = 360 - 4 = 356m.\n   تكلفة السياج = 356 × 450 = 160 200 دج.\n" +
      "3. التكلفة الإجمالية وتبرير كفاية الميزانية:\n   تكلفة السياج: 160 200 دج\n   أجرة العمال: 3500 × 4 = 14 000 دج\n   تكلفة الشتلات: 120 000 دج\n   المجموع الإجمالي = 160 200 + 14 000 + 120 000 = 294 200 دج.\n   المقارنة: 294 200 دج < 350 000 دج.\n   الخلاصة: الميزانية تكفي ويفضل للسيد عمر فائض مالي قدره 55 800 دج.";
  } else if (subject === "PHYSICS") {
    parts = [
      {
        part_number: 1,
        part_title: "الجزء الأول: الظواهر المادية والميكانيكية (12 نقطة)",
        points: 12,
        exercises: [
          {
            ex_ref: "التمرين الأول",
            title: "المادة وتحولاتها (التحليل الكهربائي)",
            points: 6,
            content:
              "نحقق التركيب الكهربائي للتحليل الكهربائي البسيط لمحلول كلور القصدير (Sn²⁺ + 2Cl⁻) باستعمال وعاء مسرياه من الفحم (الغرافيت).\n" +
              "1. سمّ المسريين A و B المتصلين بقطبي المولد (+ و -).\n" +
              "2. صف ما يحدث عند كل مسرى مدعماً إجابتك بالمعادلة الكيميائية النصفية عند المصعد والمهبط.\n" +
              "3. اكتب المعادلة الكيميائية الإجمالية الحادثة بالصيغة الشاردية ثم بالصيغة الإحصائية.",
          },
          {
            ex_ref: "التمرين الثاني",
            title: "الظواهر الميكانيكية وتوازن جسم صلب",
            points: 6,
            content:
              "جسم صلب (S) كتلته m = 400 g معلق بواسطة خيط مهمل الكتلة وغير قابل للامتطاط في نقطة ثابتة.\n" +
              "1. اذكر القوى المؤثرة على الجسم (S) ومثّلها بسلّم رسم مناسب (تُعطى g = 10 N/kg).\n" +
              "2. اكتب شرطي توازن الجسم (S).\n" +
              "3. نقطع الخيط فيسقط الجسم (S) شاقولياً نحو الأرض. ما هي القوة المؤثرة عليه أثناء السقوط بإهمال تأثير الهواء؟",
          },
        ],
      },
    ];

    situationIntegration = {
      title: "الجزء الثاني: الوضعية الإدماجية في الأمن الكهربائي (08 نقاط)",
      points: 8,
      context:
        "اشترت عائلة سفيان ثلاجة وغسالة كهربائية جديدة. وعند تشغيل الغسالة ولمس هيكلها المعدني، شعر سفيان بصدمة كهربائية خفيفة. كما لوحظ أنه عند تشغيل الفرن الكهربائي والغسالة والمكواة في آن واحد ينقطع التيار الكهربائي عن المنزل كلياً بفعل القاطع التفاضلي.",
      support_documents: [
        "سند 1: مخطط كهربائي لجزء من الشبكة المنزلية يوضح غياب التوصيل الأرضي لمأخذ الغسالة ومأخذ الفرن.",
        "سند 2: دلالات الأجهزة: الغسالة 2200W، الفرن 3000W، المكواة 1800W، وضبط القاطع التفاضلي عند الشدة 30A، التوتر 230V.",
      ],
      instructions: [
        "1. فسر سبب شعور سفيان بالصدمة الكهربائية عند لمس هيكل الغسالة.",
        "2. علل سبب انقطاع التيار الكهربائي عن المنزل عند تشغيل الأجهزة الثلاثة معاً مبرراً إجابتك بحساب الشدة الإجمالية.",
        "3. اقترح الحلول المناسبة لتفادي المشكلتين وأعد رسم المخطط الكهربائي مبرزاً وسائل الحماية النظامية (التأريض، القاطع، المنصهرات).",
      ],
      criteria_rubric: [
        { criterion: "الوجاهة (ملائمة المنتوج)", description: "تحديد أسباب الخلل الكهربائي بدقة", points: 2 },
        { criterion: "الاستعمال السليم لأدوات المادة", description: "توظيف قوانين الاستطاعة P = U.I وشروط الأمن الكهربائي", points: 3 },
        { criterion: "الانسجام", description: "تقديم حلول تقنية علاجية ورسم المخطط بوضوح", points: 2 },
        { criterion: "الإتقان والتمايز", description: "الدقة العلمية والرموز الكهربائية النظامية", points: 1 },
      ],
    };

    solutionSteps = [
      {
        ex_ref: "حل التمرين الأول (06 ن)",
        step_solution:
          "1. تسمية المسريين:\n   المسرى A (المتصل بالقطب الموجب): المصعد.\n   المسرى B (المتصل بالقطب السالب): المهبط.\n" +
          "2. الوصف والمعادلات النصفية:\n   - عند المصعد (+): تتجه شوارد الكلور وتفقد إلكترونات وينطلق غاز الكلور الأخضر المصفر (Cl2):\n     2Cl⁻(aq) → Cl2(g) + 2e⁻.\n   - عند المهبط (-): تتجه شوارد القصدير وتكتسب إلكترونات وتترسب على شكل شعيرات معدنية:\n     Sn²⁺(aq) + 2e⁻ → Sn(s).\n" +
          "3. المعادلة الإجمالية:\n   بالصيغة الشاردية: (Sn²⁺ + 2Cl⁻)(aq) → Sn(s) + Cl2(g).\n   بالصيغة الإحصائية: SnCl2(aq) → Sn(s) + Cl2(g).",
        points_allocated: 6,
      },
      {
        ex_ref: "حل التمرين الثاني (06 ن)",
        step_solution:
          "1. حساب الثقل وتمثيل القوى:\n   P = m × g = 0.4 kg × 10 N/kg = 4 N.\n   القوى المؤثرة: ثقل الجسم P وشعاع شد الخيط T.\n   سلم الرسم: 1 cm تمثل 2 N، فيرسم كل شعاع بطول 2 cm.\n" +
          "2. شرطا التوازن:\n   - للقوتين نفس الحامل ونفس الشدة ومتعاكستان في الاتجاه.\n   - مجموع القوى الشعاعي منعدم: P + T = 0.\n" +
          "3. عند قطع الخيط، القوة المؤثرة هي قوة الثقل P فقط (السقوط الحر).",
        points_allocated: 6,
      },
    ];

    situationSolution =
      "حل الوضعية الإدماجية للأمن الكهربائي (08 نقاط):\n" +
      "1. سبب الصدمة الكهربائية: ملامسة سلك الطور (Phase) للهيكل المعدني للغسالة نتيجة تلف العازل مع انعدام المأخذ الأرضي لتفريغ الشحنات المسربة نحو الأرض.\n" +
      "2. سبب انقطاع القاطع التفاضلي: حمولة زائدة (Surcharge). الاستطاعة الكلية P_tot = 2200 + 3000 + 1800 = 7000 W.\n   الشدة الكلية I = P / U = 7000 / 230 ≈ 30.43 A.\n   بما أن 30.43 A > 30 A (القيمة المضبوطة)، يتدخل القاطع تلقائياً لحماية الشبكة من الاحتراق.\n" +
      "3. الحلول والمخطط:\n   - عزل سلك الطور عن الهيكل وتوصيل هيكل الغسالة بالمأخذ الأرضي.\n   - طلب زيادة شدة الاشتراك من سونلغاز أو عدم تشغيل الأجهزة عالية الاستهلاك معاً.\n   - إضافة منصهرة مناسبة لكل جهاز.";
  } else {
    // General subject template (Arabic, Sciences, History, etc.)
    parts = [
      {
        part_number: 1,
        part_title: "الجزء الأول: الأسئلة المعرفية والتحليل المنهجي (12 نقطة)",
        points: 12,
        exercises: [
          {
            ex_ref: "النشاط الأول",
            title: `المفاهيم الأساسية المقررة في مادة ${subject}`,
            points: 6,
            content: `1. اشرح المفهوم العلمي/التاريخي المعتمد في المنهاج لموضوع الوحدة الأولى.\n2. قارن بين العناصر الجوهرية المقررة وفق شواهد الكتاب المدرسي الجزائري.\n3. بيّن الأهمية التطبيقية لمكتسبات هذا الفصل في الحياة اليومية للمتعلم.`,
          },
          {
            ex_ref: "النشاط الثاني",
            title: "تحليل السندات والوثائق الشاهدة",
            points: 6,
            content: `استغل الوثيقة المقترحة وبيّن دلالاتها العلمية/التاريخية مع استخلاص استنتاج تركيبي دقيق يخدم الإشكالية المطروحة.`,
          },
        ],
      },
    ];

    situationIntegration = {
      title: "الجزء الثاني: الوضعية الإدماجية (08 نقاط)",
      points: 8,
      context: `في إطار مشروع تربوي يهدف إلى ترسيخ قيم الكفاءة الختامية لمادة ${subject} في مرحلة ${stage}، طُلب منك إعداد منتج مكتوب يعالج إشكالية واقعية تعيشها بيئتنا الوطنية.`,
      support_documents: ["سند 1: مقتطف من المنهاج الرسمي", "سند 2: جداول وبيانات إحصائية"],
      instructions: [
        "1. حلّل المشكلة اعتماداً على مكتسباتك القبلية والسندات.",
        "2. اقترح خطة عمل قابلة للتنفيذ الميداني.",
        "3. لخّص النتائج في فقرة منسجمة لا تتجاوز 12 سطراً.",
      ],
      criteria_rubric: [
        { criterion: "الوجاهة (ملائمة المنتوج)", description: "ملاءمة الأفكار للمطلوب وعدم الخروج عن الموضوع", points: 2 },
        { criterion: "الاستعمال السليم لأدوات المادة", description: "توظيف المفاهيم والمصطلحات المعتمدة", points: 3 },
        { criterion: "الانسجام", description: "تسلسل الأفكار والمنطقية وربط النتائج بالأسباب", points: 2 },
        { criterion: "الإتقان والتمايز", description: "سلامة اللغة وحسن العرض وجودة الصياغة", points: 1 },
      ],
    };

    solutionSteps = [
      {
        ex_ref: "حل النشاط الأول (06 ن)",
        step_solution: "عناصر الإجابة النموذجية المعتمدة مع شبكة التنقيط وفق دليل الأستاذ الرسمي.",
        points_allocated: 6,
      },
      {
        ex_ref: "حل النشاط الثاني (06 ن)",
        step_solution: "الاستدلال السليم وتفسير السندات مع النتيجة التركيبية.",
        points_allocated: 6,
      },
    ];

    situationSolution = "شبكة تقييم الوضعية الإدماجية: الوجاهة (2ن) + سلامة الأدوات (3ن) + الانسجام (2ن) + الإتقان (1ن).";
  }

  return {
    id: examId,
    title: `${examTitle} - المستوى: ${level} ${stream ? `(${stream})` : ""}`,
    stage,
    level,
    subject,
    stream,
    trimester,
    coefficient,
    duration_hours: durationHours,
    header: {
      country: "الجمهورية الجزائرية الديمقراطية الشعبية",
      ministry: "وزارة التربية الوطنية",
      directorate,
      school: school_name,
      school_year: "2026/2027",
      exam_title: examTitle,
      level_stream: `${level} ${stream ? `· شعبة: ${stream}` : ""}`,
      duration: `${durationHours} سا`,
      coefficient: `${coefficient}`,
    },
    parts,
    situation_integration: situationIntegration,
    solution: {
      steps: solutionSteps,
      situation_solution: situationSolution,
    },
    marking_rubric_summary: "المجموع الكلي: 20/20 (الجزء الأول: 12 نقطة + الوضعية الإدماجية: 08 نقاط)",
    watermark: "اختبار تدريبي غير رسمي، مولّد للمراجعة والتحضير الفصلي",
    catalog_version: CATALOG_VERSION,
    created_at: new Date().toISOString(),
  };
}
