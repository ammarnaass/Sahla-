/**
 * 🎯 Sahla Guidance System Types (PRD v1.0)
 * نظام التوجيه للحصول على مخرجات دقيقة عبر الـ API
 */

import { EducationStage, Language, StyleLevel } from "../types";

export type DocumentKind = "research" | "exam";

export interface BriefContext {
  stage: EducationStage;
  level: number;
  grade_code: string; // e.g. "3AM", "4AM", "1AS", "3AS"
  stream?: string; // "SCIENTIFIC", "LITERATURE", etc.
  subject: string;
}

export interface BriefTopic {
  unit_id?: string;
  unit_title?: string;
  topic_text: string;
  is_catalog_preset?: boolean;
}

export interface BriefResearchSpecs {
  pages: number;
  language: Language;
  style: StyleLevel;
  has_images?: boolean;
  has_tables?: boolean;
  has_latex?: boolean;
}

export interface BriefExamSpecs {
  trimester?: 1 | 2 | 3;
  exam_type: "exam" | "test" | "blanc"; // فرض، اختبار فصلي، امتحان تجريبي
  difficulty: "easy" | "medium" | "hard" | "official";
  with_solution: boolean;
  variants_count: number; // 1 or 2 (A/B)
  unit_ids?: string[];
}

export interface BriefCover {
  template: "dz_official_ar" | "classic" | "modern";
  directorate?: string;
  school_name?: string;
  student_name?: string;
  teacher_name?: string;
  school_year?: string;
}

export interface Brief {
  id: string;
  shop_id: string;
  kind: DocumentKind;
  context: BriefContext;
  topic: BriefTopic;
  specs: BriefResearchSpecs | BriefExamSpecs;
  teacher_requirements?: string;
  cover?: BriefCover;
  created_at: string;
}

export interface CurriculumUnit {
  id: string;
  title: string;
  competencies: string[];
  key_terms: string[];
  out_of_scope: string[];
}

export interface StandardsPack {
  pack_id: string; // e.g. "AM3-HIST@2026.1"
  stage: EducationStage;
  level: number;
  subject: string;
  language: Language;
  research: {
    pages: { min: number; max: number };
    words_per_page: { min: number; max: number };
    structure: Array<"cover" | "toc" | "intro" | "body" | "conclusion" | "references">;
    body_sections: { min: number; max: number };
    style: "simple_clear" | "standard" | "academic";
    vocabulary_level: "primary" | "middle" | "secondary" | "advanced";
    numerals: "western" | "arabic";
    references: {
      allow: string[];
      forbid_invented: boolean;
    };
  };
  cover_template: string;
  curriculum: {
    units: CurriculumUnit[];
  };
  exam: {
    duration_minutes: number;
    total_points: number; // Strictly 20 in Algerian system
    structure: string[];
    integrated_situation: {
      required: boolean;
      points: { min: number; max: number };
    };
    difficulty_mix: {
      easy: number;
      medium: number;
      hard: number;
    };
  };
  terminology: {
    preferred: Record<string, string>;
    forbidden: string[];
  };
}

export interface SpecWarning {
  code: "topic_broad" | "level_mismatch" | "length_out_of_range" | "unit_unspecified" | "custom_req_note";
  message: string;
  suggestions?: string[];
}

export interface SpecStructureItem {
  id: string;
  title: string;
  role: "cover" | "toc" | "intro" | "body" | "conclusion" | "references" | "exercise" | "integrated_situation";
  target_words?: { min: number; max: number };
  points?: number;
  competency?: string;
  key_terms?: string[];
}

export interface Spec {
  spec_id: string;
  brief_id?: string;
  pack_id: string;
  kind: DocumentKind;
  summary_ar: string;
  constraints: {
    sections?: { min: number; max: number };
    words_per_section?: { min: number; max: number };
    numerals: "western" | "arabic";
    pages?: number;
    total_points?: number;
    duration_minutes?: number;
    style?: string;
    vocabulary_level?: string;
  };
  structure: SpecStructureItem[];
  estimate_points: number;
  warnings: SpecWarning[];
  difficulty_mix?: { easy: number; medium: number; hard: number };
  with_solution?: boolean;
  variants?: number;
  label?: string; // "اختبار تدريبي غير رسمي"
  status: "ready" | "in_use" | "expired";
  created_at: string;
}

export type ValidatorSeverity = "critical" | "high" | "medium";
export type ValidatorStatus = "ok" | "fixed" | "failed" | "skipped";

export interface ConformanceCheck {
  id: "V01" | "V02" | "V03" | "V04" | "V05" | "V06" | "V07" | "V08" | "V09" | "V10" | "V11" | "V12" | "V13" | "V14" | "V15" | "V16";
  name: string;
  severity: ValidatorSeverity;
  status: ValidatorStatus;
  detail?: string;
  fix_applied?: string;
}

export interface ConformanceReport {
  score: number; // 0.0 - 1.0
  pass: boolean; // score >= 0.85 and no critical errors
  weights: {
    structure: number;
    level_fit: number;
    curriculum: number;
    language: number;
    factual_safety: number;
    format: number;
  };
  checks: ConformanceCheck[];
  attempts: number;
  evaluated_at: string;
}

export interface RepairTarget {
  section_or_part_id: string;
  title: string;
  role: string;
  issues: string[];
  unit_id?: string;
  min_words?: number;
  max_words?: number;
  out_of_scope?: string[];
}

export interface GenerationRecord {
  id: string;
  spec_id: string;
  shop_id: string;
  kind: DocumentKind;
  status: "queued" | "compiling" | "generating" | "validating" | "repairing" | "rendering" | "done" | "needs_review" | "failed";
  reserved_points: number;
  cost_points: number;
  pack_version: string;
  prompt_version: string;
  validator_version: string;
  attempts: number;
  conformance?: ConformanceReport;
  document_payload?: any;
  files?: {
    pdf?: string;
    docx?: string;
  };
  created_at: string;
  updated_at: string;
}
