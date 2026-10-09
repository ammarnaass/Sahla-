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
  doc_kind?: string;
}

export interface ResearchPlannerOutput {
  outline: PlanOutlineItem[];
  total_target_words: number;
}

export function runResearchPlanner(input: ResearchPlannerInput): ResearchPlannerOutput {
  const cleanTopic = input.topic.trim();
  const pages = Math.max(1, input.pages || 3);
  const stage = input.stage || "middle";
  const docKind = (input.doc_kind || "RESEARCH").toUpperCase();
  const lang = (input.language || "ar").toLowerCase();

  // Approximate target words per page based on stage for A4 printing
  const wordsPerPage = docKind === "THESIS" ? 420 : stage === "primary" ? 160 : stage === "middle" ? 260 : 360;
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

  if (lang === "fr") {
    // French outline generator
    if (pages <= 1) {
      outline.push(
        { id: "s1", title: `Introduction : Contexte général de ${cleanTopic}`, type: "intro", target_words: 100 },
        { id: "s2", title: `Axe principal : Analyse synthétique et points clés`, type: "body", target_words: 200 },
        { id: "s3", title: `Conclusion et synthèse`, type: "conclusion", target_words: 80 }
      );
    } else {
      outline.push({ id: "s1", title: `Introduction générale et problématique : ${cleanTopic}`, type: "intro", target_words: 150 });
      outline.push({ id: "s2", title: `Axe 1 : Cadre conceptuel, historique et théorique`, type: "body", target_words: 250 });
      outline.push({ id: "s3", title: `Axe 2 : Étude approfondie et réalités de terrain en Algérie`, type: "body", target_words: 250 });
      if (pages >= 3) {
        outline.push({ id: "s4", title: `Axe 3 : Défis actuels, analyses comparatives et perspectives`, type: "body", target_words: 250 });
      }
      if (pages >= 5) {
        outline.push({ id: "s5", title: `Axe 4 : Solutions concrètes et recommandations stratégiques`, type: "body", target_words: 250 });
      }
      outline.push({ id: `s${outline.length + 1}`, title: `Conclusion générale et synthèse des résultats`, type: "conclusion", target_words: 150 });
      outline.push({ id: `s${outline.length + 1}`, title: `Références bibliographiques et sources officielles`, type: "reference", target_words: 90 });
    }
  } else if (lang === "en") {
    // English outline generator
    if (pages <= 1) {
      outline.push(
        { id: "s1", title: `Introduction: Overview of ${cleanTopic}`, type: "intro", target_words: 100 },
        { id: "s2", title: `Core Analysis: Key Concepts and Facts`, type: "body", target_words: 200 },
        { id: "s3", title: `Conclusion and Summary`, type: "conclusion", target_words: 80 }
      );
    } else {
      outline.push({ id: "s1", title: `Introduction and Problem Statement: ${cleanTopic}`, type: "intro", target_words: 150 });
      outline.push({ id: "s2", title: `Section 1: Conceptual and Historical Framework`, type: "body", target_words: 250 });
      outline.push({ id: "s3", title: `Section 2: Practical Implementation and Algerian Context`, type: "body", target_words: 250 });
      if (pages >= 3) {
        outline.push({ id: "s4", title: `Section 3: Challenges, Data Analysis, and Perspectives`, type: "body", target_words: 250 });
      }
      if (pages >= 5) {
        outline.push({ id: "s5", title: `Section 4: Strategic Recommendations and Future Outlook`, type: "body", target_words: 250 });
      }
      outline.push({ id: `s${outline.length + 1}`, title: `General Conclusion and Key Findings`, type: "conclusion", target_words: 150 });
      outline.push({ id: `s${outline.length + 1}`, title: `Official References and Bibliography`, type: "reference", target_words: 90 });
    }
  } else if (docKind === "THESIS") {
    // University thesis / TS outline
    outline.push({
      id: "s1",
      title: `المقدمة العامة: الإشكالية المركزية والفرضيات وأهمية دراسة "${cleanTopic}"`,
      type: "intro",
      target_words: 250,
      key_points: ["سياق الموضوع", "طرح الإشكالية والفرضيات", "منهجية البحث وحدود الدراسة"],
    });
    outline.push({
      id: "s2",
      title: `الفصل الأول: الإطار المفاهيمي والنظري والأدبيات السابقة`,
      type: "body",
      target_words: 350,
      key_points: ["التأصيل النظري والمفاهيم الجوهرية", "الدراسات الأكاديمية السابقة"],
    });
    outline.push({
      id: "s3",
      title: `الفصل الثاني: واقع وتحديات التطبيق الميداني في البيئة والمؤسسات الجزائرية`,
      type: "body",
      target_words: 350,
      key_points: ["دراسة الواقع الجزائري", "المعطيات والإحصائيات الرسمية"],
    });
    if (pages >= 5) {
      outline.push({
        id: "s4",
        title: `الفصل الثالث: الدراسة التطبيقية التحليلية ومناقشة النتائج واختبار الفرضيات`,
        type: "body",
        target_words: 350,
        key_points: ["تحليل المؤشرات والبيانات", "مناقشة إثبات أو نفي الفرضيات"],
      });
    }
    if (pages >= 10) {
      outline.push({
        id: "s5",
        title: `الفصل الرابع: الآفاق الاستراتيجية والحلول المقترحة لتطوير القطاع`,
        type: "body",
        target_words: 350,
        key_points: ["خطة عمل تنفيذية", "رؤية استشرافية للبيئة الوطنية"],
      });
    }
    outline.push({
      id: `s${outline.length + 1}`,
      title: `الخاتمة العامة: حوصلة النتائج، التوصيات العملية والآفاق المستقبلية للبحث`,
      type: "conclusion",
      target_words: 200,
      key_points: ["خلاصة مخرجات المذكرة", "توصيات لأصحاب القرار والباحثين"],
    });
    outline.push({
      id: `s${outline.length + 1}`,
      title: `قائمة المصادر والمراجع الأكاديمية المعتمدة (وفق معايير التوثيق العلمي APA)`,
      type: "reference",
      target_words: 100,
      key_points: ["المراجع الوطنية والجامعية الجزائرية", "الدراسات والتقارير الرسمية"],
    });
  } else if (docKind === "PEDAGOGIC") {
    // Pedagogic lesson sheet
    outline.push(
      {
        id: "s1",
        title: `بطاقة المذكرة: الكفاءة الختامية والمركبات ومؤشرات الكفاءة لموضوع "${cleanTopic}"`,
        type: "intro",
        target_words: 120,
        key_points: ["الكفاءة الشاملة", "الأهداف التعلمية المصاغة"],
      },
      {
        id: "s2",
        title: `مرحلة الانطلاق (05-10 د): الوضعية المشكلة التمهيدية ومراجعة المكتسبات القبلية`,
        type: "body",
        target_words: 200,
        key_points: ["إثارة دافعية المتعلمين", "رصد التصورات الأولية"],
      },
      {
        id: "s3",
        title: `مرحلة بناء التعلمات (35 د): الأنشطة التفاعلية والمهمات الفردية والجماعية`,
        type: "body",
        target_words: 300,
        key_points: ["المهمات التعلمية المتدرجة", "استثمار السندات الديدكتيكية"],
      },
      {
        id: "s4",
        title: `مرحلة الاستثمار والتقويم (15 د): وضعية إدماج جزئي والواجب المنزلي`,
        type: "conclusion",
        target_words: 150,
        key_points: ["تقويم مدى تحقق الكفاءة", "النشاط اللاصفي الإدماجي"],
      },
      {
        id: "s5",
        title: `السندات والمراجع البيداغوجية: المنهاج الرسمي والوثيقة المرافقة (وزارة التربية الوطنية)`,
        type: "reference",
        target_words: 80,
      }
    );
  } else if (docKind === "SUMMARY") {
    // Lesson summary
    outline.push(
      {
        id: "s1",
        title: `المقدمة والتمهيد: خارطة المفاهيم الأساسية لدرس "${cleanTopic}"`,
        type: "intro",
        target_words: 120,
      },
      {
        id: "s2",
        title: `المحور الأول: القواعد والتعاريف والظواهر الجوهرية المقررة`,
        type: "body",
        target_words: 250,
      },
      {
        id: "s3",
        title: `المحور الثاني: جداول مقارنة ومخططات تبسيطية للاستيعاب السريع`,
        type: "body",
        target_words: 250,
      },
      {
        id: "s4",
        title: `المحور الثالث: تطبيقات عملية وأسئلة شائعة في الامتحانات مع إجاباتها النموذجية`,
        type: "body",
        target_words: 250,
      },
      {
        id: "s5",
        title: `الخاتمة ونصائح المراجعة الذكية للتحضير للاختبارات الرسمية`,
        type: "conclusion",
        target_words: 120,
      }
    );
  } else {
    // Standard school research (RESEARCH) tailored by pages count
    if (pages <= 1) {
      outline.push(
        {
          id: "s1",
          title: `المقدمة: مدخل عام وموجز حول ${cleanTopic}`,
          type: "intro",
          target_words: 80,
        },
        {
          id: "s2",
          title: `العرض الرئيسي: المفاهيم والشواهد الأساسية في الجزائر`,
          type: "body",
          target_words: 180,
        },
        {
          id: "s3",
          title: `الخاتمة: الخلاصة والدروس المستفادة`,
          type: "conclusion",
          target_words: 70,
        }
      );
    } else if (pages === 2) {
      outline.push(
        {
          id: "s1",
          title: `المقدمة: الإطار العام والأهمية لموضوع ${cleanTopic}`,
          type: "intro",
          target_words: 120,
        },
        {
          id: "s2",
          title: `المبحث الأول: المفاهيم والنشأة التاريخية / العلمية`,
          type: "body",
          target_words: 220,
        },
        {
          id: "s3",
          title: `المبحث الثاني: التطبيقات والشواهد في الواقع الجزائري`,
          type: "body",
          target_words: 220,
        },
        {
          id: "s4",
          title: `الخاتمة: الاستنتاجات العامة والتوصيات`,
          type: "conclusion",
          target_words: 120,
        }
      );
    } else {
      // 3, 5, 10 pages
      outline.push({
        id: "s1",
        title:
          stage === "primary"
            ? `مقدمة مبسطة وشيقة حول ${cleanTopic}`
            : stage === "secondary"
            ? `المقدمة: الإطار المنهجي وطرح الإشكالية الجوهرية لـ ${cleanTopic}`
            : `المقدمة: الإطار العام والأهمية لموضوع ${cleanTopic}`,
        type: "intro",
        target_words: Math.round(wordsPerPage * 0.7),
        key_points: ["طرح الموضوع والتعريف الإجمالي", "بيان أهداف البحث والصلة بالمقرر الدراسي الجزائري"],
      });

      if (teacherElements.length > 0) {
        teacherElements.forEach((elem, idx) => {
          outline.push({
            id: `s${outline.length + 1}`,
            title: `المبحث ${idx + 1}: ${elem} (مطلوب من الأستاذ المشرف)`,
            type: "body",
            target_words: Math.round((totalTargetWords * 0.6) / teacherElements.length),
          });
        });
      } else {
        outline.push({
          id: "s2",
          title: `المبحث الأول: المفاهيم والنشأة التاريخية / العلمية لـ ${cleanTopic}`,
          type: "body",
          target_words: Math.round(wordsPerPage * 0.85),
        });
        outline.push({
          id: "s3",
          title: `المبحث الثاني: دراسة تفصيلية وتحليل واقعي للظاهرة في الجزائر`,
          type: "body",
          target_words: Math.round(wordsPerPage * 0.85),
        });
        if (pages >= 4) {
          outline.push({
            id: "s4",
            title: `المبحث الثالث: التحديات والحلول وتوجيهات وزارة التربية الوطنية`,
            type: "body",
            target_words: Math.round(wordsPerPage * 0.85),
          });
        }
        if (pages >= 7) {
          outline.push({
            id: "s5",
            title: `المبحث الرابع: نماذج مقارنة ودراسة حالة نموذجية في الجزائر`,
            type: "body",
            target_words: Math.round(wordsPerPage * 0.85),
          });
        }
      }

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
      });

      outline.push({
        id: `s${outline.length + 1}`,
        title: "قائمة المراجع والمصادر الرسمية المعتمدة (الديوان الوطني للمطبوعات المدرسية ONPS)",
        type: "reference",
        target_words: 90,
      });
    }
  }

  return {
    outline,
    total_target_words: totalTargetWords,
  };
}
