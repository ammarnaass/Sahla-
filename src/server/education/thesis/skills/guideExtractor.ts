/**
 * 🏛️ Skill: guide-extractor (مستخرج قواعد دليل المذكرة الجامعية)
 * مواصفة استوديو المذكرات (PRD النسخة 1.0 - الجزائر)
 * 
 * يقرأ دليل المذكرة المرفوع من قبل الطالب أو المشرف،
 * ويستخرج تلقائياً هيكل المذكرة وقواعد الغلاف وحجم الصفحات وأسلوب التوثيق المطلوب
 * ليقترح ملف مؤسسة (InstitutionProfile) جديداً ومعتمداً.
 */

import { AIProviderRouter } from "@/server/ai/providers/providerRouter";
import { InstitutionProfile, ThesisDegree } from "../types";

export interface ExtractGuideInput {
  guide_text: string;
  university_hint?: string;
  faculty_hint?: string;
  degree_hint?: ThesisDegree;
}

export class GuideExtractor {
  public static async extractProfile(
    input: ExtractGuideInput
  ): Promise<InstitutionProfile> {
    const { guide_text, university_hint = "", faculty_hint = "", degree_hint = "MASTER_ACADEMIC" } = input;

    const systemPrompt = `[ROLE] أنت خبير في هندسة النظم الأكاديمية والتوثيق الجامعي في الجزائر.
مهمتك قراءة نص "دليل إعداد المذكرات ومشاريع التخرج" الصادر عن إحدى الجامعات أو الكليات الجزائرية،
واستخراج قواعد الإعداد المنهجية بدقة متناهية لتحويلها إلى ملف مؤسسة (InstitutionProfile).

المطلوب استخراجه:
1. اسم الجامعة، الكلية، والقسم.
2. الطور (ليسانس، ماستر أكاديمي، ماستر مهني، تقني سامٍ).
3. أسلوب التوثيق الإلزامي (APA7 أو ISO690 أو IEEE أو غيرها).
4. هيكل المذكرة (عدد الفصول الأدنى والأقصى، إلزامية الجانب التطبيقي/الميداني، عناصر المقدمة والخاتمة).
5. حدود الحجم والصفحات (الأدنى والأقصى).
6. مواصفات الخط والتنسيق والهوامش ونظام ترقيم الصفحات.
7. ترويسة الغلاف والبيانات الإلزامية.`;

    const userPrompt = `نص دليل إعداد المذكرة المرفوع:
"""
${guide_text.substring(0, 5000)}
"""
${university_hint ? `تلميح اسم الجامعة: ${university_hint}` : ""}
${faculty_hint ? `تلميح الكلية: ${faculty_hint}` : ""}
الطور المستهدف: ${degree_hint}

أرجع كائن JSON حصراً يطابق بنية InstitutionProfile:
{
  "profile_id": "UNIV-CODE-DEGREE@2026",
  "institution_name": "اسم الجامعة الرسمي الكامل",
  "faculty": "اسم الكلية أو المعهد",
  "department": "اسم القسم إن وُجد",
  "degree": "${degree_hint}",
  "degree_title_ar": "مذكرة تخرج لنيل شهادة ...",
  "language": "ar",
  "cover": {
    "header": [
      "الجمهورية الجزائرية الديمقراطية الشعبية",
      "وزارة التعليم العالي والبحث العلمي"
    ],
    "fields": [
      "university",
      "faculty",
      "department",
      "degree",
      "specialty",
      "title",
      "student",
      "supervisor",
      "jury",
      "academic_year"
    ]
  },
  "front_matter": [
    "dedication",
    "acknowledgments",
    "abstract_ar",
    "abstract_fr",
    "abstract_en",
    "toc"
  ],
  "structure": {
    "general_intro": {
      "required": [
        "context",
        "problem",
        "hypotheses",
        "importance",
        "objectives",
        "methodology",
        "scope",
        "outline"
      ]
    },
    "chapters": {
      "min": 3,
      "max": 5,
      "theoretical_first": true,
      "applied_required": true
    },
    "general_conclusion": ["findings", "recommendations", "future_work"],
    "back_matter": ["references", "appendices"]
  },
  "pages": {
    "min": 60,
    "max": 100
  },
  "citation": {
    "style": "APA7",
    "in_text": "author-year",
    "numbering": "arabic"
  },
  "format": {
    "paper": "A4",
    "margins_mm": { "top": 25, "bottom": 25, "start": 30, "end": 20 },
    "font": {
      "family": "Traditional Arabic",
      "body_pt": 14,
      "heading_pt": [18, 16, 14],
      "line_spacing": 1.5
    },
    "page_numbers": {
      "front": "abjad",
      "body": "arabic"
    }
  },
  "is_verified": true,
  "notes": "تم استخراج القواعد آلياً من دليل المذكرة الرسمي للجامعة"
}`;

    try {
      const aiResponse = await AIProviderRouter.run({
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
        schema: true,
        maxTokens: 2500,
        temperature: 0.15,
        timeoutMs: 40000,
        metadata: { skill: "guide-extractor", jobId: "extract_guide" },
      });

      if (aiResponse && aiResponse.text) {
        let cleanText = aiResponse.text.trim();
        const firstBrace = cleanText.indexOf("{");
        const lastBrace = cleanText.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          cleanText = cleanText.substring(firstBrace, lastBrace + 1);
        }
        const parsed = JSON.parse(cleanText);
        if (parsed && parsed.institution_name && parsed.structure) {
          return parsed as InstitutionProfile;
        }
      }
    } catch (err: any) {
      console.warn("[GuideExtractor] AI parsing fallback:", err?.message);
    }

    // Default Fallback
    return {
      profile_id: `CUSTOM-${Date.now()}`,
      institution_name: university_hint || "جامعة جزائرية معتمدة",
      faculty: faculty_hint || "كلية معتمدة",
      degree: degree_hint,
      degree_title_ar: "مذكرة ماستر أكاديمي في التخصص",
      language: "ar",
      cover: {
        header: ["الجمهورية الجزائرية الديمقراطية الشعبية", "وزارة التعليم العالي والبحث العلمي"],
        fields: ["university", "faculty", "degree", "title", "student", "supervisor", "academic_year"],
      },
      front_matter: ["dedication", "acknowledgments", "abstract_ar", "abstract_fr", "toc"],
      structure: {
        general_intro: {
          required: ["context", "problem", "hypotheses", "importance", "methodology", "outline"],
        },
        chapters: { min: 3, max: 4, theoretical_first: true, applied_required: true },
        general_conclusion: ["findings", "recommendations"],
        back_matter: ["references", "appendices"],
      },
      pages: { min: 50, max: 90 },
      citation: { style: "APA7", in_text: "author-year", numbering: "arabic" },
      format: {
        paper: "A4",
        margins_mm: { top: 25, bottom: 25, start: 30, end: 20 },
        font: { family: "Traditional Arabic", body_pt: 14, heading_pt: [18, 16, 14], line_spacing: 1.5 },
        page_numbers: { front: "abjad", body: "arabic" },
      },
      is_verified: false,
      notes: "تم اشتقاق القواعد احتياطياً لتعذر فحص كامل المستند.",
    };
  }
}
