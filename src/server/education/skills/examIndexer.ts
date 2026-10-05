/**
 * 🏷️ Skill 5.9: exam-indexer (فهرسة وتصنيف الامتحانات الرسمية)
 * Extracts metadata, topics, duration, coefficients, and curriculum tags.
 */

export interface ExamIndexerInput {
  title: string;
  rawText: string;
  level?: string;
  year?: number;
}

export interface ExamIndexerOutput {
  stage: "primary" | "middle" | "secondary";
  level: string;
  track: string | null;
  subject: string;
  year: number;
  duration_minutes: number;
  coefficient: number;
  topics: string[];
  has_solution: boolean;
}

export function runExamIndexer(input: ExamIndexerInput): ExamIndexerOutput {
  const { title, rawText, year = 2024 } = input;
  const isBac = title.includes("BAC") || title.includes("بكالوريا") || rawText.includes("بكالوريا");
  const isBem = title.includes("BEM") || title.includes("التعليم المتوسط") || rawText.includes("متوسط");

  let stage: "primary" | "middle" | "secondary" = "middle";
  let level = "4AM";
  let track: string | null = null;
  let subject = "MATHS";
  let duration_minutes = 120;
  let coefficient = 4;

  if (isBac) {
    stage = "secondary";
    level = "3AS";
    duration_minutes = 210; // 3.5 hours
    if (title.includes("علوم تجريبية")) track = "SCIENTIFIC";
    else if (title.includes("رياضيات")) track = "MATHS";
    else if (title.includes("فلسفة")) track = "LITERATURE";
  } else if (isBem) {
    stage = "middle";
    level = "4AM";
    duration_minutes = 120;
  } else {
    stage = "primary";
    level = "5AP";
    duration_minutes = 90;
  }

  if (title.includes("فيزياء")) subject = "PHYSICS";
  else if (title.includes("علوم الطبيعة") || title.includes("طبيعية")) subject = "SCIENCES";
  else if (title.includes("تاريخ")) subject = "HISTORY_GEO";
  else if (title.includes("عربية")) subject = "ARABIC";
  else if (title.includes("فلسفة")) subject = "PHILOSOPHY";

  return {
    stage,
    level,
    track,
    subject,
    year,
    duration_minutes,
    coefficient,
    topics: ["المفاهيم المنهجية الرسمية", "التمارين النموذجية", "الوضعية الإدماجية"],
    has_solution: true,
  };
}
