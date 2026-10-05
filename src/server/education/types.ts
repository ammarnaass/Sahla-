/**
 * 🎓 Sahla Educational Engine & Skills Types (Technical Spec v1.0)
 * Strict JSON schema contracts between skills, orchestrator, and API endpoints.
 */

export type EducationStage = "primary" | "middle" | "secondary" | "university";
export type StyleLevel = "simple" | "moderate" | "advanced";
export type Language = "ar" | "fr" | "en";

export type JobStatus =
  | "queued"
  | "planning"
  | "writing"
  | "reviewing"
  | "rendering"
  | "done"
  | "failed";

export interface PlanOutlineItem {
  id: string;
  title: string;
  type: "intro" | "body" | "conclusion" | "reference";
  target_words?: number;
  key_points?: string[];
}

export interface ResearchPlan {
  id: string;
  shop_id: string;
  stage: EducationStage;
  level: number;
  subject: string;
  topic: string;
  language: Language;
  pages: number;
  style: StyleLevel;
  options?: {
    images?: number;
    table?: boolean;
    math_latex?: boolean;
    teacher_requirements?: string; // F4: عناصر مطلوبة من الأستاذ
    unit_id?: string; // F1: المقطع التعليمي
    unit_title?: string;
    directorate?: string; // مديرية التربية
    school_name?: string;
    student_name?: string;
    teacher_name?: string;
    catalog_version?: string;
  };
  outline: PlanOutlineItem[];
  cost_points: number;
  estimate_points: number;
  status: "ready" | "in_use" | "expired";
  catalog_version?: string;
  created_at: string;
}

export interface BlockContent {
  type: "paragraph" | "list" | "term" | "image_request" | "table" | "latex";
  text?: string;
  items?: string[];
  term?: string;
  definition?: string;
  caption?: string;
  image_ref?: string;
  rows?: string[][];
  latex?: string;
}

export interface SectionContent {
  id: string;
  title: string;
  type: "intro" | "body" | "conclusion";
  blocks: BlockContent[];
}

export interface VerifiedReference {
  type: "textbook" | "encyclopedia" | "official_document";
  title: string;
  publisher?: string;
  verified: boolean;
}

export interface QualityReviewResult {
  score: number;
  pass: boolean;
  issues: Array<{
    section: string;
    type: "repetition" | "spelling" | "level_mismatch" | "too_short" | "forbidden_word";
    fix: string;
  }>;
}

export interface StudyAidsResult {
  questions: string[];
  glossary: Array<{ term: string; explanation: string }>;
  summary: string;
}

export interface FinalResearchDocument {
  meta: {
    stage: EducationStage;
    level: number;
    subject: string;
    language: Language;
    pages: number;
    style: StyleLevel;
    unit_id?: string;
    unit_title?: string;
    teacher_requirements?: string;
    catalog_version?: string;
  };
  cover: {
    template: "official" | "classic" | "modern";
    title: string;
    directorate?: string;
    student?: string;
    school?: string;
    teacher?: string;
    year?: string;
    language?: Language;
  };
  outline: PlanOutlineItem[];
  sections: SectionContent[];
  references: VerifiedReference[];
  study_aids?: StudyAidsResult;
  quality: QualityReviewResult;
  rendered_at: string;
}

export interface ResearchJob {
  id: string;
  plan_id: string;
  shop_id: string;
  status: JobStatus;
  progress: number;
  current_step: string;
  reserved_points: number;
  settled_points: number;
  idempotency_key?: string;
  cover: {
    template: "official" | "classic" | "modern";
    directorate?: string;
    student?: string;
    school?: string;
    teacher?: string;
    year?: string;
    language?: Language;
  };
  result?: FinalResearchDocument;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  created_at: string;
  updated_at: string;
}

/**
 * 📝 Practice Exam Types (مولّد الاختبارات التدريبية v2.0)
 */
export interface PracticeExamExercise {
  ex_ref: string; // e.g. "التمرين الأول"
  title: string;
  points: number;
  content: string;
  sub_questions?: string[];
  latex_formulas?: string[];
}

export interface SituationIntegration {
  title: string;
  points: number; // e.g. 8 points
  context: string; // سياق الوضعية المركبة
  support_documents: string[]; // السندات
  instructions: string[]; // التعليمات
  criteria_rubric: Array<{
    criterion: "الوجاهة (ملائمة المنتوج)" | "الاستعمال السليم لأدوات المادة" | "الانسجام" | "الإتقان والتمايز";
    description: string;
    points: number;
  }>;
}

export interface PracticeExamModel {
  id: string;
  title: string;
  stage: EducationStage;
  level: string; // e.g. 4AM, 3AS
  subject: string;
  stream?: string;
  trimester: 1 | 2 | 3;
  coefficient: number;
  duration_hours: number;
  header: {
    country: string; // الجمهورية الجزائرية الديمقراطية الشعبية
    ministry: string; // وزارة التربية الوطنية
    directorate: string; // مديرية التربية لولاية ...
    school: string;
    school_year: string; // 2026/2027
    exam_title: string; // اختبار الفصل الأول
    level_stream: string;
    duration: string;
    coefficient: string;
  };
  parts: Array<{
    part_number: number;
    part_title: string;
    points: number;
    exercises: PracticeExamExercise[];
  }>;
  situation_integration?: SituationIntegration;
  solution: {
    steps: Array<{
      ex_ref: string;
      step_solution: string;
      points_allocated: number;
    }>;
    situation_solution?: string;
  };
  marking_rubric_summary: string;
  watermark: string; // اختبار تدريبي غير رسمي، مولّد للمراجعة
  catalog_version: string;
  created_at: string;
}
