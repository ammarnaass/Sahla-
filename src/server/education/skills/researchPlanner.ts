/**
 * 🗺️ Skill 5.2: research-planner (تخطيط البحث وهيكلة المحاور - معايير المدرسة الجزائرية v2.0)
 * Builds a curriculum-aligned outline adhering to PRD 2.0:
 * - Specific volume and structure by stage (Primary, Middle, Secondary).
 * - Incorporates teacher's required elements (F4: عناصر مطلوبة من الأستاذ).
 * - Grounds outline to curriculum unit (مقطع تعليمي).
 */

import { EducationStage, StyleLevel, Language, PlanOutlineItem } from "../types";
import { PRESET_TOPICS } from "@/lib/educationConstants";

export interface ResearchPlannerInput {
  topic: string;
  stage: EducationStage;
  level: number;
  pages: number;
  style?: StyleLevel;
  language?: Language;
  teacher_requirements?: string; // F4
  unit_id?: string;
  unit_title?: string;
}

export interface ResearchPlannerOutput {
  outline: PlanOutlineItem[];
  total_target_words: number;
}

export function runResearchPlanner(input: ResearchPlannerInput): ResearchPlannerOutput {
  const cleanTopic = input.topic.trim();
  const pages = Math.max(1, input.pages || (input.stage === "primary" ? 2 : input.stage === "middle" ? 4 : 6));
  const stage = input.stage || "middle";

  // Approximate target words per page based on stage for A4 printing
  const wordsPerPage = stage === "primary" ? 160 : stage === "middle" ? 260 : 360;
  const totalTargetWords = wordsPerPage * pages;

  const outline: PlanOutlineItem[] = [];

  // Parse teacher requirements if specified
  const teacherElements: string[] = [];
  if (input.teacher_requirements && input.teacher_requirements.trim().length > 0) {
    const rawItems = input.teacher_requirements
      .split(/[\n,;،•\-\*]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 2);
    teacherElements.push(...rawItems);
  }

  // 1. Introduction
  if (stage === "primary") {
    outline.push({
      id: "s1",
      title: `مقدمة مبسطة وشيقة حول ${cleanTopic}`,
      type: "intro",
      target_words: Math.round(wordsPerPage * 0.6),
      key_points: ["فكرة عامة بكلمات سهلة", "ماذا سنتعلم في هذا البحث الصغير؟"],
    });
  } else if (stage === "secondary") {
    outline.push({
      id: "s1",
      title: `المقدمة: الإطار المنهجي وطرح الإشكالية الجوهرية لـ ${cleanTopic}`,
      type: "intro",
      target_words: Math.round(wordsPerPage * 0.8),
      key_points: [
        `السياق المعرفي والتاريخي لـ ${cleanTopic}`,
        "صياغة الإشكالية المركزية والفرضيات المنهجية",
        "خطة البحث ومسار التحليل وفق المنهاج الوطني الجزائري",
      ],
    });
  } else {
    // Middle
    outline.push({
      id: "s1",
      title: `المقدمة: الإطار العام والأهمية لموضوع ${cleanTopic}`,
      type: "intro",
      target_words: Math.round(wordsPerPage * 0.7),
      key_points: ["طرح الموضوع والتعريف الإجمالي", "بيان أهداف البحث والصلة بالمقرر الدراسي الجزائري"],
    });
  }

  // 2. Body sections
  if (teacherElements.length > 0) {
    // F4: Prioritize teacher's explicit requirements
    teacherElements.forEach((elem, idx) => {
      outline.push({
        id: `s${outline.length + 1}`,
        title: `المبحث ${idx + 1}: ${elem} (مطلوب من الأستاذ المشرف)`,
        type: "body",
        target_words: Math.round((totalTargetWords * 0.65) / teacherElements.length),
        key_points: [
          `معالجة دقيقة لمحور: ${elem}`,
          "الاعتماد على مصطلحات الكتاب المدرسي الجزائري وأمثلة تطبيقية",
        ],
      });
    });
  } else if (stage === "primary") {
    // Primary: 1-2 body items with rich simple illustrations
    outline.push({
      id: "s2",
      title: `المحور الأول: ما هو ${cleanTopic}؟ (المفاهيم الأساسية)`,
      type: "body",
      target_words: Math.round(wordsPerPage * 0.8),
      key_points: ["تعريف سهل وبسيط", "أمثلة من محيط التلميذ وبيئته الجزائرية"],
    });
    if (pages >= 2) {
      outline.push({
        id: "s3",
        title: `المحور الثاني: كيف نطبقه في حياتنا المدرسية واليومية؟`,
        type: "body",
        target_words: Math.round(wordsPerPage * 0.8),
        key_points: ["صور توضيحية ورسومات", "إرشادات وقيم التعاون"],
      });
    }
  } else if (stage === "secondary") {
    // Secondary: Deep analytical sections (3-5 sections)
    outline.push({
      id: "s2",
      title: `المبحث الأول: التأسيس النظري والأبعاد المفاهيمية لـ ${cleanTopic}`,
      type: "body",
      target_words: Math.round(wordsPerPage * 0.9),
      key_points: ["النشأة والمفاهيم الكبرى", "المصطلحات العلمية المعتمدة في التخصص"],
    });
    outline.push({
      id: "s3",
      title: `المبحث الثاني: التحليل الميداني والإحصائي والتطبيقات في الجزائر`,
      type: "body",
      target_words: Math.round(wordsPerPage * 0.9),
      key_points: [
        "الشواهد الواقعية من المؤسسات والتجارب الوطنية",
        "تحليل البيانات واستقراء الظاهرة",
      ],
    });
    outline.push({
      id: "s4",
      title: `المبحث الثالث: الرؤية الاستشرافية والحلول في ضوء السياسات العامة`,
      type: "body",
      target_words: Math.round(wordsPerPage * 0.9),
      key_points: ["تقييم التحديات الحالية", "اقتراح بدائل وتوصيات منهجية بناءة"],
    });
    if (pages >= 8) {
      outline.push({
        id: "s5",
        title: `المبحث الرابع: دراسة مقارنة وتقييم التجارب الإقليمية والدولية`,
        type: "body",
        target_words: Math.round(wordsPerPage * 0.9),
        key_points: ["المقارنة الموضوعية", "الدروس المستفادة للقطاع الوطني"],
      });
    }
  } else {
    // Middle school
    outline.push({
      id: "s2",
      title: `المبحث الأول: المفاهيم والنشأة التاريخية / العلمية لـ ${cleanTopic}`,
      type: "body",
      target_words: Math.round(wordsPerPage * 0.85),
      key_points: ["التعريف المفاهيمي المنهاجي", "الأهمية والدلالة الوطنية"],
    });
    outline.push({
      id: "s3",
      title: `المبحث الثاني: دراسة تفصيلية وتحليل واقعي للظاهرة في الجزائر`,
      type: "body",
      target_words: Math.round(wordsPerPage * 0.85),
      key_points: ["نماذج وأمثلة من الولايات الجزائرية", "الإجراءات والمشاريع المعتمدة"],
    });
    if (pages >= 4) {
      outline.push({
        id: "s4",
        title: `المبحث الثالث: التحديات والحلول وتوجيهات وزارة التربية الوطنية`,
        type: "body",
        target_words: Math.round(wordsPerPage * 0.85),
        key_points: ["دور الفرد والمجتمع", "نصائح للتلميذ والشباب الجزائري"],
      });
    }
  }

  // 3. Conclusion
  outline.push({
    id: `s${outline.length + 1}`,
    title:
      stage === "primary"
        ? "الخاتمة: ماذا تعلمنا ونصائح مفيدة"
        : stage === "secondary"
        ? "الخاتمة: التركيب النهائي، حوصلة النتائج وآفاق البحث"
        : "الخاتمة: الاستنتاجات العامة والتوصيات",
    type: "conclusion",
    target_words: Math.round(wordsPerPage * 0.6),
    key_points: [
      "الإجابة المركزة عن تساؤلات البحث",
      stage === "secondary" ? "فتح آفاق لإشكاليات مستقبلية" : "تأكيد دور التلميذ في التحصيل العلمي",
    ],
  });

  // 4. References
  outline.push({
    id: `s${outline.length + 1}`,
    title: "قائمة المراجع والمصادر الرسمية المعتمدة (الديوان الوطني للمطبوعات المدرسية ONPS)",
    type: "reference",
    target_words: 90,
    key_points: [
      "الكتاب المدرسي المعتمد للطور والمستوى",
      "المناهج والوثائق المرافقة الرسمية لوزارة التربية الوطنية",
    ],
  });

  return {
    outline,
    total_target_words: totalTargetWords,
  };
}
