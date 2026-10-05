/**
 * 💡 Skill 5.11: study-aids (مساعدات المراجعة والفهم الأكاديمي)
 * Generates comprehension questions, key terms glossary, and concise review summary.
 */

import { StudyAidsResult, SectionContent } from "../types";

export interface StudyAidsInput {
  topic: string;
  stage: string;
  sections: SectionContent[];
}

export function runStudyAids(input: StudyAidsInput): StudyAidsResult {
  const { topic } = input;

  return {
    questions: [
      `س1: ما هو المفهوم الجوهري الذي يعالجه موضوع "${topic}" بأسلوبك الخاص؟`,
      `س2: استخرج فكرتين رئيسيتين وردتا في البحث تناسبان متطلبات منهاج وزارة التربية الوطنية.`,
      `س3: ما هي أهم نتيجة استخلصتها من الخاتمة لدعم مشاركتك في القسم مع أستاذك؟`,
    ],
    glossary: [
      {
        term: "المنهاج الرسمي",
        explanation: "مجموع الكفاءات والمعارف التي تقرها وزارة التربية الوطنية لكل مستوى دراسي.",
      },
      {
        term: "المقاربة بالكفاءات",
        explanation: "المنهجية البيداغوجية المعتمدة في الجزائر لتمكين المتعلم من توظيف معارفه في وضعيات مركبة.",
      },
    ],
    summary: `يقدم هذا البحث إحاطة شاملة حول "${topic}" من خلال ضبط الأطر المفاهيمية، وعرض النماذج التطبيقية المستمدة من الواقع الوطني، مع تلخيص النتائج والتوصيات المنهجية التي تخدم المسار الأكاديمي للتلميذ.`,
  };
}
