/**
 * 🎨 Sahla Formatting, Images & Layout Types
 * مواصفة الصور والترقيم والتنسيق للبحوث والمذكرات (النسخة 1.0 - الجزائر)
 */

export type AssetKind =
  | "photo" // صورة فوتوغرافية / تاريخية
  | "chart" // رسم بياني إحصائي (كود)
  | "diagram" // مخطط توضيحي (Mermaid / SVG)
  | "map" // خريطة جغرافية / تاريخية
  | "illustration" // رسم توضيحي
  | "user_upload"; // صورة رفعها المستخدم

export type AssetSource =
  | "commons" // Wikimedia Commons
  | "code_generated" // Python / Matplotlib / Mermaid
  | "openstreetmap"
  | "ai_illustration"
  | "user";

export interface DocumentAsset {
  id: string; // "a1", "a2"...
  doc_id: string;
  kind: AssetKind;
  source: AssetSource;
  license: string; // e.g. "CC BY-SA 4.0", "PD", "User Owned"
  author: string;
  url?: string;
  file_url?: string; // Local or data URL
  width_px: number;
  height_px: number;
  dpi: number; // >= 150, preferred 300
  alt_text: string;
  caption: string;
  source_attribution: string;
  figure_number?: number;
  section_id?: string;
  status: "candidate" | "selected" | "rejected";
  created_at: string;
}

export type DocumentBlockType =
  | "cover"
  | "heading"
  | "paragraph"
  | "figure"
  | "table"
  | "list"
  | "quote"
  | "divider";

export interface DocumentBlock {
  id: string;
  doc_id: string;
  order_num: number;
  type: DocumentBlockType;
  content: {
    text?: string;
    level?: 1 | 2 | 3 | 4;
    asset_id?: string;
    figure_number?: number;
    caption?: string;
    source_attribution?: string;
    table_data?: {
      headers: string[];
      rows: Array<Array<string | number>>;
    };
    list_items?: string[];
    is_ordered?: boolean;
  };
  style?: {
    alignment?: "right" | "center" | "left" | "justify";
    size_ratio?: "small" | "medium" | "full"; // 40%, 65%, 100%
    bold?: boolean;
    italic?: boolean;
  };
  page_break_before?: boolean;
  keep_with_next?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LayoutSettings {
  doc_id: string;
  paper: "A4";
  margins_mm: {
    top: number;
    bottom: number;
    right: number; // هامش التجليد يميناً في العربية
    left: number;
  };
  font_family: string; // "Traditional Arabic" or "Amiri"
  font_size_pt: number; // 13 or 14
  line_spacing: number; // 1.5
  page_numbering: {
    position: "bottom_center" | "bottom_right" | "top_center";
    format_front: "abjad" | "roman" | "none";
    format_body: "decimal"; // 1, 2, 3...
    start_body_at: number; // 1
  };
  header_mode: "chapter_title" | "doc_title" | "none";
  decorative_frame: boolean; // إطار زخرفي للصفحة في البحوث المدرسية
  updated_at: string;
}

export interface LayoutIssue {
  id: string;
  doc_id: string;
  code: string; // I01..I10 or F01..F14
  severity: "critical" | "high" | "medium";
  location: string;
  message: string;
  suggestion: string;
  created_at: string;
}

export interface ImageCandidateRequest {
  section_id: string;
  purpose: "illustrate_event" | "conceptual_diagram" | "data_chart" | "portrait" | "map";
  kind: AssetKind;
  query: string;
  caption_hint: string;
  max_count?: number;
}

export type CoverTemplateType =
  | "primary"
  | "middle"
  | "secondary"
  | "university_license"
  | "university_master"
  | "vocational";

export interface CoverTemplateData {
  template_type: CoverTemplateType;
  republic_header?: string; // الجمهورية الجزائرية الديمقراطية الشعبية
  ministry_header?: string; // وزارة التعليم العالي / التربية الوطنية / التكوين
  institution_name: string; // اسم الجامعة / الثانوية / المتوسطة / المركز
  faculty_or_division?: string; // كلية العلوم أو الشعبة
  department_or_year?: string; // قسم التاريخ أو السنة الرابعة متوسط
  specialty?: string; // التخصص الدقيق
  title: string; // عنوان البحث أو المذكرة
  subtitle?: string; // عنوان فرعي أو تخصص
  doc_classification?: string; // مذكرة تخرج لنيل شهادة الماستر / بحث مدرسي فصلي
  student_names: string[]; // أسماء الطلبة / التلاميذ
  supervisor_name?: string; // اسم الأستاذ المشرف
  co_supervisor_name?: string; // الأستاذ المساعد
  jury_members?: Array<{ role: string; name: string; title: string }>; // لجنة المناقشة
  academic_year: string; // 2025 / 2026 م
  wilaya?: string; // الولاية
  logo_url?: string; // شعار المؤسسة
}

export type ExportFormat = "docx" | "pdf";

export interface ExportOptions {
  format: ExportFormat;
  include_toc?: boolean;
  include_figures_list?: boolean;
  include_tables_list?: boolean;
  cover_data?: Partial<CoverTemplateData>;
}

