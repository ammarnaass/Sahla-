/**
 * 🎓 Skill: thesis-planner (مخطط المذكرات الأكاديمية وفق معايير الجامعات الجزائرية)
 * 
 * يولد خطة مذكرة تخرج متكاملة وفق ملف المؤسسة (Institution Profile):
 * - عنوان أكاديمي مدقق
 * - إشكالية جوهرية مصاغة بدقة علمية
 * - أسئلة فرعية متدرجة
 * - فرضيات قابلة للاختبار
 * - منهج وأدوات وعينة
 * - فصول ومباحث مع توزيع دقيق لأوزان الصفحات
 */

import { AIProviderRouter } from "@/server/ai/providers/providerRouter";
import { InstitutionProfile, ThesisPlan, ThesisChapterPlan, ThesisDegree, ThesisType } from "./types";

export interface ThesisPlannerInput {
  topic: string;
  profile: InstitutionProfile;
  specialty: string;
  degree?: ThesisDegree;
  type?: ThesisType;
  targetPages?: number;
  hasDataset?: boolean;
  datasetDescription?: string;
  teacherRequirements?: string;
  language?: "ar" | "fr" | "en";
}

export async function runThesisPlanner(input: ThesisPlannerInput): Promise<Omit<ThesisPlan, "id" | "thesis_id" | "is_approved" | "created_at" | "updated_at">> {
  const {
    topic,
    profile,
    specialty,
    degree = profile.degree,
    type = "THEORETICAL",
    targetPages = profile.pages.min || 60,
    hasDataset = false,
    datasetDescription = "",
    teacherRequirements = "",
    language = profile.language || "ar",
  } = input;

  const cleanTopic = topic.trim();
  const minChapters = profile.structure.chapters.min || 3;
  const maxChapters = profile.structure.chapters.max || 5;
  const isAppliedRequired = profile.structure.chapters.applied_required && (type !== "THEORETICAL" || hasDataset);

  const systemPrompt = `أنت أستاذ محاضر وعضو اللجنة العلمية ومؤطر مذكرات تخرج في الجامعات الجزائرية (${profile.institution_name} - ${profile.faculty}).
مهمتك إعداد خطة أكاديمية نموذجية ومحكمة لمذكرة تخرج (${profile.degree_title_ar}) في تخصص: "${specialty}".
يجب أن تتطابق الخطة بدقة تامة مع دليل إعداد المذكرات المعتمد (${profile.profile_id})، باللغة العربية الفصحى الأكاديمية الرصينة، بدون أي تكرار أو حشو.
القاعدة الذهبية:
1. صياغة إشكالية واضحة وأسئلة فرعية منبثقة عنها.
2. صياغة فرضيات علمية مقابلة للأسئلة.
3. تحديد المنهج العلمي المناسب والأدوات الميدانية.
4. تقسيم المذكرة إلى بين ${minChapters} و ${maxChapters} فصول متوازنة، لكل فصل مباحث محددة مع تحديد الوزن التقديري لعدد الصفحات (مجموع الصفحات يقارب ${targetPages} صفحة).
${isAppliedRequired ? "5. يجب تخصيص فصل تطبيقي/ميداني (دراسة حالة أو تحليل استبيان) يتناسب مع البيئة والمؤسسات الجزائرية." : ""}`;

  const userPrompt = `الموضوع المقترح: "${cleanTopic}"
المؤسسة: ${profile.institution_name} (${profile.faculty})
التخصص: ${specialty}
نوع المذكرة: ${type === "FIELD_STUDY" ? "دراسة ميدانية" : type === "CASE_STUDY" ? "دراسة حالة" : type === "INTERNSHIP_REPORT" ? "تقرير تربص مهني" : "دراسة نظرية تحليلية"}
عدد الصفحات الإجمالي المطلوب: ${targetPages} صفحة
أسلوب التوثيق: ${profile.citation.style}
${hasDataset ? `البيانات المتوفرة: ${datasetDescription || "بيانات استبيان / مؤشرات مالية وإحصائية"}` : "لا توجد بيانات خام مرفوعة حالياً."}
${teacherRequirements ? `توجيهات وعناصر الأستاذ المشرف الإلزامية: "${teacherRequirements}"` : ""}

أرجع النتيجة بصيغة JSON حصراً بالشكل التالي دون نصوص إضافية:
{
  "title": "العنوان الأكاديمي الدقيق والمدقق للمذكرة",
  "problem": "صياغة مستفيضة للإشكالية المركزية للمذكرة (بين 80 إلى 150 كلمة)",
  "sub_questions": [
    "التساؤل الفرعي الأول؟",
    "التساؤل الفرعي الثاني؟",
    "التساؤل الفرعي الثالث؟"
  ],
  "hypotheses": [
    "الفرضية الرئيسية الأولى...",
    "الفرضية الثانية...",
    "الفرضية الثالثة..."
  ],
  "methodology": {
    "type": "المنهج المعتمد (مثل: المنهج الوصفي التحليلي مع دراسة حالة)",
    "tools": ["الاستبيان", "المقابلة نصف الموجهة", "التحليل الوثائقي"],
    "sample": "مجتمع وعينة الدراسة الميدانية"
  },
  "chapters": [
    {
      "id": "c1",
      "number": 1,
      "title": "عنوان الفصل الأول...",
      "kind": "theoretical",
      "target_pages": 20,
      "needs_data": false,
      "sections": [
        { "id": "c1s1", "title": "المبحث الأول: ...", "key_points": ["عنصر 1", "عنصر 2"] },
        { "id": "c1s2", "title": "المبحث الثاني: ...", "key_points": ["عنصر 1", "عنصر 2"] }
      ]
    }
  ],
  "summary_ar": "ملخص منهجي موجز يوضح اتساق الخطة مع المعايير الجزائرية ودليل المؤسسة"
}`;

  try {
    const aiResponse = await AIProviderRouter.run({
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
      schema: true,
      maxTokens: 2500,
      temperature: 0.25,
      timeoutMs: 45000,
      metadata: { skill: "thesis-planner", jobId: `plan_${cleanTopic.substring(0, 10)}` },
    });

    if (aiResponse && aiResponse.text) {
      let cleanText = aiResponse.text.trim();
      const firstBrace = cleanText.indexOf("{");
      const lastBrace = cleanText.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleanText = cleanText.substring(firstBrace, lastBrace + 1);
      }
      const parsed = JSON.parse(cleanText);

      if (parsed && Array.isArray(parsed.chapters) && parsed.chapters.length >= 2) {
        return {
          title: parsed.title || cleanTopic,
          problem: parsed.problem || `تتمحور الإشكالية المركزية لهذه المذكرة حول أثر وتطبيقات موضوع "${cleanTopic}" في الواقع والمؤسسات الجزائرية.`,
          sub_questions: parsed.sub_questions || [
            `ما هو الإطار المفاهيمي والنظري المؤطر لـ "${cleanTopic}"؟`,
            `ما هو واقع التحديات والتطبيقات في البيئة الجزائرية؟`,
            `كيف تساهم الآليات المقترحة في تحسين الأداء واستدامة النتائج؟`,
          ],
          hypotheses: parsed.hypotheses || [
            `توجد علاقة ذات دلالة إحصائية بين تطبيق مبادئ الموضوع والارتقاء بالأداء.`,
            `تؤثر المحددات الهيكلية والتنظيمية في المؤسسات الجزائرية على مستوى الفاعلية.`,
          ],
          methodology: parsed.methodology || {
            type: "المنهج الوصفي التحليلي ودراسة الحالة",
            tools: ["التحليل المكتبي", "الاستبيان الميداني"],
            sample: "عينة قصدية من الفاعلين والمختصين في القطاع",
          },
          chapters: parsed.chapters.map((ch: any, idx: number) => ({
            id: ch.id || `c${idx + 1}`,
            number: ch.number || idx + 1,
            title: ch.title || `الفصل ${idx + 1}`,
            kind: ch.kind || (idx === parsed.chapters.length - 1 ? "applied" : "theoretical"),
            target_pages: ch.target_pages || Math.round(targetPages / parsed.chapters.length),
            needs_data: Boolean(ch.needs_data),
            sections: Array.isArray(ch.sections)
              ? ch.sections.map((sec: any, sIdx: number) => ({
                  id: sec.id || `c${idx + 1}s${sIdx + 1}`,
                  title: sec.title || `المبحث ${sIdx + 1}`,
                  key_points: sec.key_points || [],
                }))
              : [],
          })),
          total_target_pages: targetPages,
          summary_ar:
            parsed.summary_ar ||
            `تمت صياغة الخطة وفق دليل ${profile.institution_name} وتوزيع أوزان الصفحات على ${parsed.chapters.length} فصول أكاديمية.`,
        };
      }
    }
  } catch (err: any) {
    console.warn("[ThesisPlanner] AI planning failed, falling back to deterministic profile structure:", err?.message);
  }

  // 🛡️ Deterministic Academic Fallback based on Institution Profile
  return buildDeterministicThesisPlan(cleanTopic, profile, specialty, targetPages, isAppliedRequired);
}

function buildDeterministicThesisPlan(
  topic: string,
  profile: InstitutionProfile,
  specialty: string,
  targetPages: number,
  isAppliedRequired: boolean
): Omit<ThesisPlan, "id" | "thesis_id" | "is_approved" | "created_at" | "updated_at"> {
  const pagesPerChapter = Math.round(targetPages / 3);

  const chapters: ThesisChapterPlan[] = [
    {
      id: "c1",
      number: 1,
      title: `الفصل الأول: الإطار المفاهيمي والنظري لموضوع ${topic}`,
      kind: "theoretical",
      target_pages: pagesPerChapter,
      needs_data: false,
      sections: [
        {
          id: "c1s1",
          title: "المبحث الأول: ماهية المفاهيم، النشأة والتطور التاريخي",
          key_points: ["التأصيل المفاهيمي واللغوي", "المقاربات والنظريات الكلاسيكية والحديثة", "الأهمية والأهداف الاستراتيجية"],
        },
        {
          id: "c1s2",
          title: "المبحث الثاني: الأبعاد الهيكلية والآليات الوظيفية المعتمدة",
          key_points: ["المكونات والخصائص الجوهرية", "النماذج التطبيقية الرائدة", "المعايير والمؤشرات الأكاديمية"],
        },
      ],
    },
    {
      id: "c2",
      number: 2,
      title: `الفصل الثاني: واقع وتحديات التطبيق في البيئة والمؤسسات الجزائرية`,
      kind: "theoretical",
      target_pages: pagesPerChapter,
      needs_data: false,
      sections: [
        {
          id: "c2s1",
          title: "المبحث الأول: الإطار التشريعي والتنظيمي المعمول به في الجزائر",
          key_points: ["النصوص القانونية والمراسيم التنفيذية", "الهيئات والجهات الوصية", "السياسات والبرامج الوطنية المعتمدة"],
        },
        {
          id: "c2s2",
          title: "المبحث الثاني: المعوقات الهيكلية وفرص التطوير المتاحة",
          key_points: ["التحديات التقنية والبشرية", "متطلبات التحول الرقمي والحوكمة", "تجارب المقارنة القطاعية في الجزائر"],
        },
      ],
    },
    {
      id: "c3",
      number: 3,
      title: isAppliedRequired
        ? `الفصل الثالث: الدراسة التطبيقية والميدانية / دراسة حالة في الجزائر`
        : `الفصل الثالث: التحليل الاستشرافي ونموذج التطوير المقترح`,
      kind: isAppliedRequired ? "applied" : "theoretical",
      target_pages: targetPages - pagesPerChapter * 2,
      needs_data: isAppliedRequired,
      sections: isAppliedRequired
        ? [
            {
              id: "c3s1",
              title: "المبحث الأول: الإجراءات المنهجية للدراسة الميدانية وتقديم عينة ومجتمع البحث",
              key_points: ["منهجية وأدوات جمع البيانات", "توصيف مجتمع الدراسة وخصائص العينة", "اختبار صدق وثبات أدوات القياس"],
            },
            {
              id: "c3s2",
              title: "المبحث الثاني: عرض وتحليل النتائج ومناقشتها في ضوء الفرضيات",
              key_points: ["التحليل الإحصائي للبيانات المجمعة", "اختبار صحة الفرضيات العلمية", "استخلاص النتائج الميدانية والتوصيات العملية"],
            },
          ]
        : [
            {
              id: "c3s1",
              title: "المبحث الأول: صياغة مصفوفة الحلول والبدائل الاستراتيجية",
              key_points: ["تحديد الأولويات والمحددات التنفيذية", "آليات إدارة المخاطر والتغيير", "مؤشرات قياس الأداء الشامل"],
            },
            {
              id: "c3s2",
              title: "المبحث الثاني: الرؤية الاستشرافية لتعزيز كفاءة التطبيق",
              key_points: ["التوصيات الموجهة لصناع القرار", "الآفاق المستقبلية للأبحاث الأكاديمية", "المتطلبات التقنية والبشرية"],
            },
          ],
    },
  ];

  return {
    title: topic.includes("مذكرة") ? topic : `مذكرة تخرج: ${topic}`,
    problem: `تتمحور الإشكالية المركزية لهذه الدراسة حول مدى مساهمة وتأثير «${topic}» في الارتقاء بالأداء وتحقيق الأهداف الاستراتيجية ضمن الواقع والمؤسسات الجزائرية، وما هي أبرز المعوقات التي تواجه التطبيق العملي وسبل تجاوزها؟`,
    sub_questions: [
      `ما هي الأسس النظرية والمفاهيمية المؤطرة لموضوع «${topic}» في الأدبيات المتخصصة؟`,
      `كيف يتجلى واقع تطبيق هذه المفاهيم في البيئة الاقتصادية والتنظيمية الجزائرية؟`,
      `ما هي الآليات العملية الكفيلة بتطوير الأداء ومعالجة الفجوات المرصودة؟`,
    ],
    hypotheses: [
      `توجد علاقة ارتباطية إيجابية بين استيعاب الأطر النظرية لـ «${topic}» وفعالية الأداء الميداني.`,
      `تؤثر المحددات الهيكلية والبيئية في المؤسسات الجزائرية بشكل معنوي على التطبيق السليم للمشروع.`,
    ],
    methodology: {
      type: "المنهج الوصفي التحليلي مع دراسة حالة ميدانية",
      tools: ["التحليل الوثائقي والمكتبي", "الاستبيان الميداني", "الملاحظة المنظمة"],
      sample: "عينة ممثلة من الإطارات والمختصين في القطاع المعني",
    },
    chapters,
    total_target_pages: targetPages,
    summary_ar: `خطة أكاديمية معتمدة وفق دليل ${profile.institution_name}، موزعة على 3 فصول رئيسية تحقق التوازن بين الجانب النظري والتطبيقي وتستوفي ${targetPages} صفحة.`,
  };
}
