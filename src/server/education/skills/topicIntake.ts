/**
 * 🎯 Skill 5.1: topic-intake (فهم الطلب وتصنيف الموضوع)
 * Validates pedagogical alignment with Algerian curriculum, filters out-of-scope requests,
 * and suggests refined topic titles.
 */

import { EducationStage, Language } from "../types";

export interface TopicIntakeInput {
  stage: EducationStage;
  level: number;
  subject: string;
  topic: string;
  language?: Language;
}

export interface TopicIntakeOutput {
  ok: boolean;
  normalized_topic: string;
  scope: "valid_curriculum" | "too_broad" | "out_of_scope" | "sensitive";
  risks: string[];
  suggestions: string[];
}

export function runTopicIntake(input: TopicIntakeInput): TopicIntakeOutput {
  const cleanTopic = (input.topic || "").trim();

  if (!cleanTopic || cleanTopic.length < 3) {
    return {
      ok: false,
      normalized_topic: cleanTopic,
      scope: "out_of_scope",
      risks: ["العنوان فارغ أو قصير جداً"],
      suggestions: [
        "الثورة التحريرية الجزائرية 1954",
        "مشروع السد الأخضر ومكافحة التصحر",
        "الطاقات المتجددة في الجزائر",
      ],
    };
  }

  // Filter sensitive or off-limits content outside the Algerian national education curriculum
  const prohibitedKeywords = ["هاك", "اختراق", "عنف", "إرهاب", "مخدرات", "قمار", "احتيال"];
  const hasProhibited = prohibitedKeywords.some((word) => cleanTopic.includes(word));
  if (hasProhibited) {
    return {
      ok: false,
      normalized_topic: cleanTopic,
      scope: "sensitive",
      risks: ["الموضوع غير ملائم للمنظومة التربوية الجزائرية"],
      suggestions: [
        "تاريخ الجزائر الحديث والمعاصر",
        "الأمن الغذائي والتنمية المستدامة",
        "الفيزياء وتطبيقات الطاقة النظيفة",
      ],
    };
  }

  // Detect overly broad topics (e.g. just "التاريخ" or "العلوم")
  const tooBroadKeywords = ["تاريخ", "علوم", "فيزياء", "رياضيات", "جغرافيا", "طبيعة"];
  if (tooBroadKeywords.includes(cleanTopic.toLowerCase())) {
    return {
      ok: true,
      normalized_topic: `${cleanTopic} - مدخل عام`,
      scope: "too_broad",
      risks: ["الموضوع واسع جداً ويستحسن تضييقه ليتناسب مع عدد الصفحات المحدد"],
      suggestions: [
        `أهم المحطات البارزة في ${cleanTopic} في الجزائر`,
        `المفاهيم والتطبيقات الأساسية لمادة ${cleanTopic}`,
        `دور ${cleanTopic} في تطور العلوم الحديثة`,
      ],
    };
  }

  return {
    ok: true,
    normalized_topic: cleanTopic,
    scope: "valid_curriculum",
    risks: [],
    suggestions: [],
  };
}
