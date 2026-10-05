/**
 * ✍️ Skill 5.3: section-writer (كتابة الأقسام والمحتوى المهيكل)
 * Produces structured content blocks (paragraphs, bullet lists, defined terms, and tables)
 * strictly adapted to the student's educational level.
 */

import { EducationStage, StyleLevel, Language, PlanOutlineItem, SectionContent, BlockContent } from "../types";

export interface SectionWriterInput {
  section: PlanOutlineItem;
  topic: string;
  stage: EducationStage;
  level: number;
  style?: StyleLevel;
  language?: Language;
  previousSummary?: string;
}

export function runSectionWriter(input: SectionWriterInput): SectionContent {
  const { section, topic, stage, style = "moderate" } = input;
  const blocks: BlockContent[] = [];

  const isPrimary = stage === "primary";
  const isSecondary = stage === "secondary" || stage === "university";

  if (section.type === "intro") {
    if (isPrimary) {
      blocks.push({
        type: "paragraph",
        text: `يعتبر موضوع "${topic}" من المواضيع الجميلة والمفيدة التي نتعلمها في مدرستنا الحبيبة. يساعدنا هذا البحث البسيط على فهم معانيه وتطبيقاته في حياتنا اليومية بأسلوب ميسر وممتع.`,
      });
      blocks.push({
        type: "list",
        items: [
          `التعرف على مفهوم "${topic}" بكلمات واضحة وسهلة.`,
          `مشاهدة أمثلة وصور توضيحية من بيئتنا الجزائرية الجميلة.`,
          `تعلم نصائح وإرشادات مفيدة نطبقها في قسمنا ومع عائلتنا.`,
        ],
      });
    } else if (isSecondary) {
      blocks.push({
        type: "paragraph",
        text: `يحتل موضوع "${topic}" مكانة محورية ومتقدمة ضمن مفردات المنهاج الوطني الجزائري، لما يطرحه من إشكاليات فكرية وأبعاد علمية وتطبيقية ترتبط بالتنمية الشاملة وبناء المعرفة النقدية لدى الطالب.`,
      });
      blocks.push({
        type: "paragraph",
        text: `تكمن إشكالية هذا العمل الأكاديمي في الإجابة عن التساؤل الجوهري: كيف يساهم فهم آليات ومقومات "${topic}" في تقديم حلول واقعية ومستدامة للتحديات الراهنة وفق التوجهات الرسمية لوزارة التربية الوطنية؟`,
      });
      blocks.push({
        type: "list",
        items: [
          "تحديد الأطر النظرية والمفاهيمية المؤطرة للظاهرة.",
          "تحليل الشواهد الميدانية والبيانات الإحصائية المستخلصة من الواقع الجزائري.",
          "استخلاص النتائج والتوصيات المنهجية التي تخدم المسار الدراسي والبحثي.",
        ],
      });
    } else {
      // Middle School (BEM)
      blocks.push({
        type: "paragraph",
        text: `يحظى موضوع "${topic}" باهتمام بالغ في المنظومة التربوية الجزائرية لمرحلة التعليم المتوسط، حيث يسلط الضوء على المعارف الأساسية والمهارات البيداغوجية التي يحتاجها التلميذ للربط بين الدروس المقررة والواقع المعاش.`,
      });
      blocks.push({
        type: "list",
        items: [
          `بيان الأهمية التاريخية والعلمية لـ "${topic}".`,
          `إبراز دور المؤسسات الوطنية الجزائرية في تطوير هذا المجال.`,
          `تحفيز روح البحث والاستكشاف المنظم لدى المتعلم.`,
        ],
      });
    }
  } else if (section.type === "conclusion") {
    if (isPrimary) {
      blocks.push({
        type: "paragraph",
        text: `وفي ختام بحثنا الصغير، تعلمنا أن "${topic}" كنز معرفي ثمين ينبغي المحافظة عليه وتطويره بالاجتهاد والعمل الصالح لخدمة وطننا الغالي الجزائر.`,
      });
      blocks.push({
        type: "term",
        term: "نصيحة ذهبية",
        definition: "العلم والاجتهاد هما مفتاح النجاح والتفوق في كل مرحلة دراسية.",
      });
    } else {
      blocks.push({
        type: "paragraph",
        text: `صفوة القول، لقد بيّنت هذه الدراسة المستفيضة لموضوع "${topic}" أن بلوغ الأهداف التعليمية المنشودة يستند إلى الموازنة بين الأسس العلمية النظرية والممارسة الميدانية الرصينة.`,
      });
      blocks.push({
        type: "list",
        items: [
          "تأكيد صحة الفرضيات التي انطلق منها البحث في الإطار المنهجي.",
          "تثمين المكتسبات الوطنية وإسهامات الكفاءات الجزائرية في دعم هذا التخصص.",
          "الدعوة إلى مواصلة البحث المعمق عبر مراجع موثوقة ومستودعات علمية معتمدة.",
        ],
      });
    }
  } else {
    // Body section
    blocks.push({
      type: "paragraph",
      text: `يتناول هذا القسم دراسة تفصيلية وتحليلاً منهجياً لمحور "${section.title}"، مع التركيز على المفاهيم المعتمدة في المناهج الرسمية لوزارة التربية الوطنية. تم ربط الشروح بالأمثلة الواقعية المستوحاة من البيئة الجزائرية لضمان الاستيعاب الأمثل ومطابقة متطلبات الأستاذ المشرف.`,
    });

    if (style === "advanced" || isSecondary) {
      blocks.push({
        type: "term",
        term: `المفهوم البيداغوجي المحوري: ${section.title}`,
        definition: `مبدأ علمي ومنهجي مقرر يُعنى بدراسة وتحليل عناصر الظاهرة وربط أسبابها بنتائجها الميدانية المباشرة.`,
      });
    }

    blocks.push({
      type: "list",
      items: [
        `العنصر الأول: تحليل المقومات الأساسية وتحديد الأولويات في المنهاج.`,
        `العنصر الثاني: إبراز النماذج الجزائرية الناجحة وتطبيقاتها الميدانية.`,
        `العنصر الثالث: استخلاص الأثر التربوي والاجتماعي المترتب على هذا المحور.`,
      ],
    });
  }

  return {
    id: section.id,
    title: section.title,
    type: section.type === "intro" ? "intro" : section.type === "conclusion" ? "conclusion" : "body",
    blocks,
  };
}
