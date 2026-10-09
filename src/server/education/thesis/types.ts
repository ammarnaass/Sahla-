/**
 * 🎓 Sahla Academic Thesis & University Research Studio Types
 * مواصفة نماذج مذكرات التخرج واستوديو البحث الأكاديمي (النسخة 1.0 - الجزائر)
 */

export type ThesisDegree =
  | "LICENSE"
  | "MASTER_ACADEMIC"
  | "MASTER_PROFESSIONAL"
  | "TECH_SUPERIEUR"
  | "STAGE_REPORT";

export type ThesisType =
  | "THEORETICAL"
  | "FIELD_STUDY"
  | "CASE_STUDY"
  | "INTERNSHIP_REPORT";

export type CitationStyle = "APA7" | "ISO690" | "IEEE" | "VANCOUVER";

export type ThesisStatus =
  | "draft"
  | "planned"
  | "plan_approved"
  | "researching"
  | "sources_review"
  | "writing"
  | "analyzing"
  | "assembling"
  | "quality_review"
  | "ready"
  | "failed"
  | "needs_input";

/**
 * 🏛️ ملف المؤسسة الأكاديمية (Institution Profile)
 * يحدد كل ما يتغير بين الجامعات والكليات ومراكز التكوين المهني
 */
export interface InstitutionProfile {
  profile_id: string; // e.g. "UNIV-ALGER1-DROIT@2026", "UNIV-USTHB-INFO@2026"
  institution_name: string; // "جامعة الجزائر 1 - بن يوسف بن خدة"
  faculty: string; // "كلية الحقوق والعلوم السياسية"
  department?: string; // "قسم القانون العام"
  degree: ThesisDegree;
  degree_title_ar: string; // "مذكرة ماستر أكاديمي في الحقوق"
  language: "ar" | "fr" | "en";
  cover: {
    header: string[];
    fields: string[];
    logo_url?: string;
  };
  front_matter: Array<
    | "dedication"
    | "acknowledgments"
    | "abstract_ar"
    | "abstract_fr"
    | "abstract_en"
    | "toc"
    | "list_tables"
    | "list_figures"
    | "abbreviations"
  >;
  structure: {
    general_intro: {
      required: string[]; // [context, problem, hypotheses, importance, objectives, reasons_for_choice, methodology, scope, previous_studies, outline]
    };
    chapters: {
      min: number;
      max: number;
      theoretical_first: boolean;
      applied_required: boolean;
    };
    general_conclusion: string[]; // [findings, recommendations, future_work]
    back_matter: string[]; // [references, appendices]
  };
  pages: {
    min: number;
    max: number;
  };
  citation: {
    style: CitationStyle;
    in_text: "author-year" | "numeric";
    numbering: "arabic";
  };
  format: {
    paper: "A4";
    margins_mm: { top: number; bottom: number; start: number; end: number };
    font: {
      family: string;
      body_pt: number;
      heading_pt: number[];
      line_spacing: number;
    };
    page_numbers: {
      front: "abjad" | "roman" | "none";
      body: "arabic";
    };
  };
  is_verified?: boolean;
  notes?: string;
}

/**
 * 📑 مشروع المذكرة (Thesis Project)
 */
export interface ThesisProject {
  id: string;
  shop_id: string;
  profile_id: string;
  title: string;
  clean_title?: string;
  student_name: string;
  supervisor_name: string;
  jury_members?: string[];
  university: string;
  faculty: string;
  department?: string;
  specialty: string;
  degree: ThesisDegree;
  language: "ar" | "fr" | "en";
  academic_year: string;
  type: ThesisType;
  target_pages: number;
  citation_style: CitationStyle;
  methodology_type: string;
  has_dataset: boolean;
  dataset_filename?: string;
  teacher_requirements?: string;
  status: ThesisStatus;
  quality_score?: number;
  points_cost: number;
  created_at: string;
  updated_at: string;
}

/**
 * 📐 خطة المذكرة الأكاديمية (Thesis Plan)
 */
export interface ThesisPlan {
  id: string;
  thesis_id: string;
  title: string;
  problem: string; // الإشكالية المركزية
  sub_questions: string[]; // التساؤلات الفرعية
  hypotheses: string[]; // الفرضيات العلمية
  methodology: {
    type: string; // الوصفي التحليلي، دراسة حالة، تجريبي
    tools: string[]; // استبيان، مقابلة، تحليل وثائقي
    sample?: string; // مجتمع وعينة الدراسة
    dataset_summary?: string;
  };
  chapters: ThesisChapterPlan[];
  total_target_pages: number;
  summary_ar: string;
  is_approved: boolean;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ThesisChapterPlan {
  id: string; // "c1", "c2"...
  number: number;
  title: string;
  kind: "theoretical" | "applied" | "methodological";
  target_pages: number;
  needs_data: boolean;
  sections: Array<{
    id: string; // "c1s1"...
    title: string;
    key_points: string[];
  }>;
}

/**
 * 📚 المصادر المعتمدة والمتحقق منها (Sources)
 */
export interface ThesisSource {
  id: string; // "S1", "S2"...
  thesis_id: string;
  chapter_id?: string;
  title: string;
  authors: string[];
  year: number;
  publisher_or_journal: string;
  url?: string;
  doi?: string;
  status: "verified" | "unverified" | "user_uploaded" | "rejected";
  credibility_score: number; // 0.0 to 1.0
  source_type:
    | "asjp"
    | "university_repo"
    | "official_stats"
    | "book"
    | "international"
    | "user";
  accessed_at?: string;
  created_at: string;
}

/**
 * 🔍 ورقة الحقائق الموثقة (Fact Sheet)
 */
export interface ChapterFactSheet {
  id: string;
  thesis_id: string;
  chapter_id: string;
  facts: Array<{
    id: string;
    claim: string;
    evidence_snippet_summary: string;
    source_id: string; // Reference to S1..Sn
    confidence: number;
    type: "definition" | "statistic" | "historical" | "case_study" | "legal";
  }>;
  gaps: string[]; // فجوات معرفية صريحة
  queries_used: string[];
  created_at: string;
}

/**
 * ✍️ محتوى الفصل المكتوب (Written Chapter)
 */
export interface WrittenChapter {
  id: string;
  thesis_id: string;
  chapter_id: string;
  title: string;
  sections: Array<{
    id: string;
    title: string;
    paragraphs: Array<{
      text: string;
      cites: string[]; // ["S1", "S3"]
      claims?: string[]; // ["F1", "F2"]
    }>;
  }>;
  word_count: number;
  page_count_estimate: number;
  status: "draft" | "validated" | "needs_revision";
  created_at: string;
  updated_at: string;
}

/**
 * 📊 تقرير الجودة والمدققات (Quality Report)
 */
export interface ThesisQualityReport {
  thesis_id: string;
  score: number; // 0 to 1
  passed: boolean;
  checks: Array<{
    id: string; // T01, T02... T16
    name: string;
    severity: "critical" | "high" | "medium";
    passed: boolean;
    details?: string;
  }>;
  verified_sources_ratio: number;
  unattributed_claims_ratio: number;
  stats_accuracy_ratio: number;
  evaluated_at: string;
}
