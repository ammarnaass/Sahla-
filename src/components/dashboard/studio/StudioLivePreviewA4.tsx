"use client";

import React, { useState } from "react";
import type { ServiceDefinition } from "@/lib/constants";
import type { InvoiceItem } from "@/hooks/dashboard/useStudioState";
import {
  EducationLevel,
  DocumentMode,
  ALGERIAN_GRADES,
  ALGERIAN_SUBJECTS,
} from "@/lib/educationConstants";
import {
  SchoolCapIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  DocCvIcon,
} from "@/components/ui/Icons";
import { BlockEditor } from "./BlockEditor";
import { LayoutSettingsPanel } from "./LayoutSettingsPanel";
import type {
  DocumentBlock,
  DocumentAsset,
  LayoutSettings,
  LayoutIssue,
} from "@/server/education/formatting/types";
import { Sparkles, Sliders, AlertTriangle, CheckCircle, RefreshCw, FileText } from "lucide-react";

interface StudioLivePreviewA4Props {
  service: ServiceDefinition;
  customerName: string;
  phone: string;
  language?: "ar" | "fr" | "en";
  cvJobTitle: string;
  cvExperience: string;
  idPhotoCount: 4 | 8;
  idBgColor: "gray" | "white";
  invoiceItems: InvoiceItem[];
  calculateInvoiceTotal: () => { subtotal: number; tva: number; timbre: number; total: number };
  details: string;
  // School research & exams props
  eduMode?: DocumentMode;
  eduLevel?: EducationLevel;
  eduGradeId?: string;
  eduSubjectId?: string;
  eduTopic?: string;
  eduPageCount?: 1 | 2 | 3 | 5 | 10;
  eduSchoolName?: string;
  eduTeacherName?: string;
  eduTrimester?: 1 | 2 | 3;
  eduIncludeCover?: boolean;
  eduIncludeOutline?: boolean;
  eduIncludeSources?: boolean;
  eduIncludeAnswerKey?: boolean;
  eduCurrentPagePreview?: number;
  setEduCurrentPagePreview?: (p: number) => void;
  eduCustomPlan?: string[];
  // PRD additions
  eduDocKind?: "RESEARCH" | "THESIS" | "SUMMARY" | "PEDAGOGIC";
  eduUniversity?: string;
  eduFaculty?: string;
  eduSpecialty?: string;
  eduCoverTemplate?: "OFFICIAL" | "CLASSIC" | "MODERN";
  eduStyleLevel?: "SIMPLE" | "MODERATE" | "ADVANCED";
  eduIncludeReviewQuestions?: boolean;
  eduDirectorate?: string;
  eduTeacherRequirements?: string;
  eduUnitTitle?: string;
  eduGeneratedSections?: Array<{ id: string; heading: string; content: string }>;
  docId?: string;
  onExportWord?: () => void;
  onExportHtml?: () => void;
  onExportDocx?: () => void;
  onExportPdf?: () => void;
  isExportingDocx?: boolean;
  isExportingPdf?: boolean;
  onReportError?: () => void;
  conformanceScore?: number;
  onViewConformance?: () => void;
  onGenerateFullDocument?: () => void;
}

/**
 * Distribute N plan items across K content pages fairly and deterministically,
 * ensuring zero omitted items, zero gaps, and following official academic structure.
 */
function getPageItemIndices(pageIdx: number, K: number, N: number): number[] {
  if (N <= 0 || K <= 0 || pageIdx < 0 || pageIdx >= K) return [];
  if (K === 1) return Array.from({ length: N }, (_, i) => i);

  if (K >= N) {
    return pageIdx < N ? [pageIdx] : [];
  }

  if (K === 2) {
    const mid = Math.ceil(N / 2);
    return pageIdx === 0
      ? Array.from({ length: mid }, (_, i) => i)
      : Array.from({ length: N - mid }, (_, i) => mid + i);
  }

  // K >= 3 and N > K:
  // First content page has TOC card and gets Intro (item 0)
  // Last content page gets Conclusion & References
  const lastCount = N - 1 >= K ? (N >= 5 ? 2 : 1) : 1;
  const firstCount = 1;
  const middleItemsCount = N - firstCount - lastCount;
  const middlePagesCount = K - 2;

  if (pageIdx === 0) {
    return Array.from({ length: firstCount }, (_, i) => i);
  }

  if (pageIdx === K - 1) {
    return Array.from({ length: lastCount }, (_, i) => N - lastCount + i);
  }

  // Middle pages (pageIdx from 1 to K - 2)
  const middlePageIdx = pageIdx - 1;
  const startOffset = firstCount;

  const q = Math.floor(middleItemsCount / middlePagesCount);
  const r = middleItemsCount % middlePagesCount;

  const mySize = q + (middlePageIdx < r ? 1 : 0);
  const myStart = startOffset + middlePageIdx * q + Math.min(middlePageIdx, r);

  return Array.from({ length: mySize }, (_, i) => myStart + i);
}

export function StudioLivePreviewA4({
  service,
  customerName,
  phone,
  language = "ar",
  cvJobTitle,
  cvExperience,
  idPhotoCount,
  idBgColor,
  invoiceItems,
  calculateInvoiceTotal,
  details,
  // Educational props
  eduMode = "RESEARCH",
  eduDocKind = "RESEARCH",
  eduUniversity = "",
  eduFaculty = "",
  eduSpecialty = "",
  eduLevel = "MIDDLE",
  eduGradeId = "4AM",
  eduSubjectId = "HISTORY_GEO",
  eduTopic = "",
  eduPageCount = 3,
  eduSchoolName = "",
  eduTeacherName = "",
  eduDirectorate = "",
  eduTeacherRequirements = "",
  eduUnitTitle = "",
  eduTrimester = 2,
  eduIncludeCover = true,
  eduIncludeOutline = true,
  eduIncludeSources = true,
  eduIncludeAnswerKey = true,
  eduCurrentPagePreview = 1,
  setEduCurrentPagePreview,
  eduCustomPlan = [],
  eduGeneratedSections = [],
  eduCoverTemplate = "OFFICIAL",
  eduStyleLevel = "MODERATE",
  eduIncludeReviewQuestions = true,
  docId,
  onExportWord,
  onExportHtml,
  onExportDocx,
  onExportPdf,
  isExportingDocx = false,
  isExportingPdf = false,
  onReportError,
  conformanceScore = 0.94,
  onViewConformance,
  onGenerateFullDocument,
}: StudioLivePreviewA4Props) {
  const isSchoolService = service.code === "SCHOOL_RESEARCH" || service.code === "EXAMS";

  const [activeTab, setActiveTab] = useState<"PREVIEW" | "BLOCKS" | "LAYOUT" | "AUDIT">("PREVIEW");
  const [blocks, setBlocks] = useState<DocumentBlock[]>([]);
  const [assets, setAssets] = useState<DocumentAsset[]>([]);
  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings | null>(null);
  const [layoutIssues, setLayoutIssues] = useState<LayoutIssue[]>([]);
  const [isAutoFixing, setIsAutoFixing] = useState(false);

  // Load document blocks, assets, settings, and layout issues
  React.useEffect(() => {
    if (!docId) return;
    fetch(`/api/docs/${docId}/preview`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          if (data.blocks) setBlocks(data.blocks);
          if (data.assets) setAssets(data.assets);
          if (data.settings) setLayoutSettings(data.settings);
          if (data.issues) setLayoutIssues(data.issues);
        }
      })
      .catch((err) => console.warn("Failed to fetch doc preview data:", err));
  }, [docId]);

  const handleAutoFix = async () => {
    if (!docId) return;
    setIsAutoFixing(true);
    try {
      const res = await fetch(`/api/docs/${docId}/layout/issues`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setLayoutIssues(data.remainingIssues || []);
        // Refresh blocks and settings
        const prevRes = await fetch(`/api/docs/${docId}/preview`);
        const prevData = await prevRes.json();
        if (prevData.success && prevData.blocks) setBlocks(prevData.blocks);
        if (prevData.success && prevData.settings) setLayoutSettings(prevData.settings);
      }
    } catch (err) {
      console.error("Auto fix failed:", err);
    } finally {
      setIsAutoFixing(false);
    }
  };

  const [zoomLevel, setZoomLevel] = useState<"fit" | "75" | "100">("fit");
  const [localPage, setLocalPage] = useState<number>(eduCurrentPagePreview || 1);
  const activePage = setEduCurrentPagePreview ? eduCurrentPagePreview : localPage;
  const updatePage = (p: number) => {
    if (setEduCurrentPagePreview) {
      setEduCurrentPagePreview(p);
    } else {
      setLocalPage(p);
    }
  };

  const gradeInfo = ALGERIAN_GRADES.find((g) => g.id === eduGradeId);
  const subjectInfo = ALGERIAN_SUBJECTS[eduSubjectId] || {
    nameAr: "العلوم العامة",
    nameFr: "Sciences Générales",
  };

  const defaultPlanItems =
    eduDocKind === "THESIS"
      ? [
          "المقدمة العامة وطرح الإشكالية",
          "الفصل الأول: الإطار المفاهيمي والنظري",
          "الفصل الثاني: واقع وتحديات التطبيق في الجزائر",
          "الفصل الثالث: الدراسة التطبيقية ومناقشة النتائج",
          "الخاتمة العامة والتوصيات",
        ]
      : [
          "مقدمة وطرح الإشكالية",
          "المبحث الأول: المفاهيم والشواهد التاريخية",
          "المبحث الثاني: حركة التحرر والواقع الوطني",
          "الخاتمة والاستنتاجات والتوصيات",
        ];

  const planItems: string[] =
    eduCustomPlan && eduCustomPlan.length > 0
      ? eduCustomPlan
      : eduGeneratedSections && eduGeneratedSections.length > 0
      ? eduGeneratedSections.map((s) => s.heading)
      : defaultPlanItems;

  const isRTL = language === "ar";

  return (
    <div className="bg-slate-100/90 dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xl transition-colors">
      <div>
        {/* Header with Title and Zoom Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>معاينة فورية مطابقة للطباعة (A4 300DPI)</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center bg-white dark:bg-slate-950 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px]">
              <button
                type="button"
                onClick={() => setZoomLevel("fit")}
                className={`px-2 py-0.5 rounded font-medium cursor-pointer transition-colors ${
                  zoomLevel === "fit"
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                احتواء
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel("75")}
                className={`px-2 py-0.5 rounded font-medium cursor-pointer transition-colors ${
                  zoomLevel === "75"
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                75%
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel("100")}
                className={`px-2 py-0.5 rounded font-medium cursor-pointer transition-colors ${
                  zoomLevel === "100"
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                100%
              </button>
            </div>

            <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] hidden sm:inline">
              🇩🇿 المعيار الوطني
            </span>
          </div>
        </div>

        {/* Pager & Action Toolbar for School Research & Exams (PRD v1.0) */}
        {isSchoolService && (
          <div className="mb-3 space-y-2">
            <div className="flex items-center justify-between bg-white dark:bg-slate-950 p-1.5 sm:p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs shadow-xs">
              <button
                type="button"
                disabled={activePage <= 1}
                onClick={() => updatePage(Math.max(1, activePage - 1))}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors min-h-[38px]"
              >
                <ArrowRightIcon size={12} />
                <span>الصفحة السابقة</span>
              </button>

              {/* Direct Jump Buttons for Pages */}
              <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-[260px] sm:max-w-none">
                {Array.from({ length: eduPageCount }, (_, i) => i + 1).map((p) => {
                  const isCover = p === 1 && eduIncludeCover && eduPageCount > 1;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => updatePage(p)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        activePage === p
                          ? "bg-emerald-600 text-white shadow-xs font-black scale-105"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {isCover ? "🇩🇿 الغلاف" : `ص ${p}`}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={activePage >= eduPageCount}
                onClick={() => updatePage(Math.min(eduPageCount, activePage + 1))}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors min-h-[38px]"
              >
                <span>الصفحة التالية</span>
                <ArrowLeftIcon size={12} />
              </button>
            </div>

            {/* Plan Distribution Notification Banner */}
            {eduMode === "RESEARCH" && planItems.length > 0 && (!eduGeneratedSections || eduGeneratedSections.length === 0) && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between gap-2 shadow-2xs animate-fade-in">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="shrink-0">💡</span>
                  <span className="truncate">
                    تم توزيع محاور الخطة ({planItems.length}) على صفحات المستند ({eduPageCount}). انقر لصياغة المتن بالذكاء الاصطناعي:
                  </span>
                </div>
                {onGenerateFullDocument && (
                  <button
                    type="button"
                    onClick={onGenerateFullDocument}
                    className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-[10px] font-black cursor-pointer shadow-xs transition-colors shrink-0 flex items-center gap-1"
                  >
                    <span>🚀</span>
                    <span>توليد وصياغة المتن</span>
                  </button>
                )}
              </div>
            )}

            {/* 🎨 Navigation Tabs for Academic Formatting & Blocks */}
            {isSchoolService && (
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab("PREVIEW")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === "PREVIEW"
                      ? "bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-300 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>معاينة A4 المطبوعة</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("BLOCKS")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === "BLOCKS"
                      ? "bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-300 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>محرر الكتل والصور ({blocks.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("LAYOUT")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === "LAYOUT"
                      ? "bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-300 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>تخطيط وهوامش A4</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("AUDIT")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === "AUDIT"
                      ? "bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-300 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>تدقيق التنسيق</span>
                  {layoutIssues.length > 0 ? (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono">
                      {layoutIssues.length} تنبيه
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono">
                      مطابق 100%
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Quick Export & Actions Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] px-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {onExportDocx && (
                  <button
                    type="button"
                    onClick={onExportDocx}
                    disabled={isExportingDocx}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-all font-bold cursor-pointer min-h-[34px] shadow-sm disabled:opacity-50"
                    title="تحميل ملف Microsoft Word (.docx) أصلي منسق بالصور والفهارس"
                  >
                    <span>📄</span>
                    <span>{isExportingDocx ? "جاري التصدير..." : "Word أصلي (.docx)"}</span>
                  </button>
                )}
                {onExportPdf && (
                  <button
                    type="button"
                    onClick={onExportPdf}
                    disabled={isExportingPdf}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 transition-all font-bold cursor-pointer min-h-[34px] shadow-sm disabled:opacity-50"
                    title="تحميل ملف PDF رسمي عبر محرك LibreOffice Headless"
                  >
                    <span>📕</span>
                    <span>{isExportingPdf ? "جاري التحويل..." : "PDF رسمي (.pdf)"}</span>
                  </button>
                )}
                {onExportWord && !onExportDocx && (
                  <button
                    type="button"
                    onClick={onExportWord}
                    className="px-2.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/80 dark:hover:bg-sky-900 border border-sky-200 dark:border-sky-800/60 text-sky-700 dark:text-sky-300 flex items-center gap-1.5 transition-all font-medium cursor-pointer min-h-[34px]"
                    title="تحميل نسخة قابلة للتعديل ببرنامج Microsoft Word"
                  >
                    <span>📄</span>
                    <span>تصدير Word (.doc)</span>
                  </button>
                )}
                {onExportHtml && (
                  <button
                    type="button"
                    onClick={onExportHtml}
                    className="px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/80 dark:hover:bg-teal-900 border border-teal-200 dark:border-teal-800/60 text-teal-700 dark:text-teal-300 flex items-center gap-1.5 transition-all font-medium cursor-pointer min-h-[34px]"
                    title="تنزيل ملف HTML المصمم للبحث"
                  >
                    <span>🌐</span>
                    <span>ملف HTML</span>
                  </button>
                )}
                {onReportError && (
                  <button
                    type="button"
                    onClick={onReportError}
                    className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1 transition-all cursor-pointer min-h-[34px]"
                    title="الإبلاغ عن خطأ علمي أو لغوي"
                  >
                    <ShieldCheckIcon className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                    <span>أبلغ عن خطأ</span>
                  </button>
                )}
                {onViewConformance && (
                  <button
                    type="button"
                    onClick={onViewConformance}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/80 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 flex items-center gap-1 transition-all font-bold cursor-pointer min-h-[34px]"
                    title="عرض تقرير المطابقة والمدققات الوطنية"
                  >
                    <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-500" />
                    <span>مطابقة {Math.round(conformanceScore * 100)}%</span>
                  </button>
                )}
              </div>

              <span className="text-[10px] text-slate-500 font-mono">
                A4 · 300 DPI جاهز للطباعة
              </span>
            </div>
          </div>
        )}

        {/* Block Editor View */}
        {activeTab === "BLOCKS" && (
          <div className="w-full">
            <BlockEditor
              docId={docId || "doc_preview"}
              blocks={blocks}
              assets={assets}
              onBlocksChange={setBlocks}
              onAssetsChange={setAssets}
            />
          </div>
        )}

        {/* Layout Settings View */}
        {activeTab === "LAYOUT" && (
          <div className="w-full">
            <LayoutSettingsPanel
              docId={docId || "doc_preview"}
              settings={
                layoutSettings || {
                  doc_id: docId || "doc_preview",
                  paper: "A4",
                  margins_mm: { top: 25, bottom: 25, right: 30, left: 20 },
                  font_family: "Traditional Arabic",
                  font_size_pt: 14,
                  line_spacing: 1.5,
                  page_numbering: {
                    position: "bottom_center",
                    format_front: "abjad",
                    format_body: "decimal",
                    start_body_at: 1,
                  },
                  header_mode: "chapter_title",
                  decorative_frame: false,
                  updated_at: new Date().toISOString(),
                }
              }
              onSettingsChange={setLayoutSettings}
            />
          </div>
        )}

        {/* Audit & Issues View */}
        {activeTab === "AUDIT" && (
          <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 sm:p-6 space-y-4 text-right" dir="rtl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  تقرير تدقيق ومطابقة التنسيق والصور (النسخة 1.0 - الجزائر)
                </h3>
              </div>
              <button
                type="button"
                onClick={handleAutoFix}
                disabled={isAutoFixing || layoutIssues.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAutoFixing ? "animate-spin" : ""}`} />
                <span>{isAutoFixing ? "جاري التطبيق..." : "⚡ تطبيق الإصلاح التلقائي لجميع التنبيهات"}</span>
              </button>
            </div>

            {layoutIssues.length === 0 ? (
              <div className="p-6 text-center bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="font-bold text-emerald-900 dark:text-emerald-200">
                  الوثيقة مطابقة 100% لمعايير التنسيق والأرقام والصور الأكاديمية!
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  تم استيفاء جميع معايير الصور (I01-I10) والتخطيط والترقيم (F01-F14). الملف جاهز للطباعة والتصدير.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {layoutIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className="p-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/70 rounded-xl space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200">
                          {issue.code}
                        </span>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {issue.location}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          issue.severity === "critical"
                            ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                            : issue.severity === "high"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                        }`}
                      >
                        {issue.severity === "critical" ? "حرج" : issue.severity === "high" ? "عالٍ" : "متوسط"}
                      </span>
                    </div>
                    <p className="text-zinc-700 dark:text-zinc-300">{issue.message}</p>
                    <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                      💡 الاقتراح: {issue.suggestion}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Simulated White Paper Document (A4 Aspect Ratio with Dynamic Zoom) */}
        {activeTab === "PREVIEW" && (
          <div
            dir={isRTL ? "rtl" : "ltr"}
            className={`bg-white text-slate-900 p-4 sm:p-6 rounded-xl shadow-2xl min-h-[380px] text-right font-sans text-xs transition-all select-none border border-slate-300 ${
              zoomLevel === "75"
                ? "max-w-[85%] mx-auto"
                : zoomLevel === "100"
                ? "w-full min-w-[320px] max-w-[560px] mx-auto shadow-2xl"
                : "w-full"
            }`}
          >
          {/* ======================================================== */}
          {/* 🎓 SCHOOL RESEARCH & THESIS: UNIFIED 1-PAGE DOCUMENT     */}
          {/* ======================================================== */}
          {isSchoolService && eduMode === "RESEARCH" && eduPageCount === 1 && (
            <div className="space-y-3 text-right">
              {/* Institutional Header Banner */}
              <div className="border-b-2 border-emerald-800 pb-2 flex justify-between items-start text-[9.5px] text-slate-700">
                <div className="space-y-0.5">
                  <div className="font-extrabold text-slate-900 text-[10.5px]">الجمهورية الجزائرية الديمقراطية الشعبية</div>
                  <div className="font-bold text-emerald-800">
                    {eduDocKind === "THESIS" ? "وزارة التعليم العالي والبحث العلمي" : "وزارة التربية الوطنية"}
                  </div>
                  <div className="text-slate-600 font-medium">
                    {eduDocKind === "THESIS"
                      ? `${eduUniversity || "الجامعة الجزائرية"}${eduFaculty ? ` · ${eduFaculty}` : ""}`
                      : `${eduDirectorate || "مديرية التربية والتعليم"} · ${eduSchoolName || "المؤسسة التعليمية"}`}
                  </div>
                </div>
                <div className="text-left space-y-0.5 text-slate-500 font-mono text-[9px]">
                  <div>الموسم: 2025/2026 م</div>
                  <div>المستوى: {gradeInfo?.nameAr || "السنة الدراسية"}</div>
                  <div className="text-emerald-700 font-bold">ورقة بحثية موثقة (A4)</div>
                </div>
              </div>

              {/* Title & Topic Box */}
              <div className="bg-emerald-50/70 border border-emerald-400 p-2.5 rounded-xl text-center space-y-1">
                <span className="text-[9px] font-black uppercase text-emerald-800 block">
                  {eduDocKind === "THESIS" ? "مذكرة أكاديمية موجزة" : `بحث مدرسي في مادة: ${subjectInfo.nameAr}`}
                </span>
                <h2 className="text-sm sm:text-base font-black text-slate-950">
                  {eduTopic || "عنوان البحث المدرسي"}
                </h2>
                <div className="flex justify-between items-center text-[9.5px] text-slate-700 pt-1 border-t border-emerald-200">
                  <span><strong>إعداد:</strong> {customerName || (eduDocKind === "THESIS" ? "الطالب الباحث" : "تلميذ المؤسسة")}</span>
                  <span><strong>تحت إشراف:</strong> {eduTeacherName || "الأستاذ المشرف"}</span>
                </div>
              </div>

              {/* Compact Outline Summary */}
              {eduIncludeOutline && planItems.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 flex flex-wrap items-center gap-1.5 text-[9px] text-slate-700 font-medium">
                  <span className="font-bold text-emerald-800 shrink-0">📌 محاور الخطة:</span>
                  {planItems.map((item, idx) => (
                    <span key={idx} className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800 font-bold">
                      {idx + 1}. {item}
                    </span>
                  ))}
                </div>
              )}

              {/* All Sections for 1-Page Document */}
              <div className="space-y-2.5">
                {planItems.map((planHeading, itemIdx) => {
                  const genSection =
                    eduGeneratedSections &&
                    (eduGeneratedSections[itemIdx] ||
                      eduGeneratedSections.find((s) => s.heading === planHeading));
                  const heading = genSection?.heading || planHeading;
                  const hasContent = Boolean(genSection?.content);

                  return (
                    <div key={itemIdx} className="space-y-1 text-[10.5px]">
                      <div className="flex items-center justify-between border-b border-emerald-100 pb-0.5 font-bold text-slate-900">
                        <span className="text-emerald-900 font-extrabold text-[11px]">{heading}</span>
                        {hasContent ? (
                          <span className="text-[8px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-mono font-bold">
                            AI ⚡ موثق
                          </span>
                        ) : (
                          <span className="text-[8px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200">
                            📋 معتمد في الخطة
                          </span>
                        )}
                      </div>
                      {hasContent ? (
                        <div className="text-justify text-[10px] text-slate-800 leading-relaxed whitespace-pre-line">
                          {genSection!.content}
                        </div>
                      ) : (
                        <p className="text-[9.5px] text-slate-600 bg-emerald-50/30 p-2 rounded border border-dashed border-emerald-300 leading-relaxed">
                          {itemIdx === 0
                            ? `مقدمة وطرح الإشكالية لموضوع «${eduTopic || "البحث"}» وفق منهاج الجيل الثاني المعتمد.`
                            : itemIdx === planItems.length - 1
                            ? "الخاتمة والاستنتاجات والتوصيات الختامية المعتمدة."
                            : `العرض والتحليل المفصل لمبحث «${heading}» مع الشواهد والأمثلة التاريخية الجزائرية.`}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Official References */}
              {eduIncludeSources && (
                <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[8.5px] text-slate-600 space-y-0.5">
                  <span className="font-bold text-slate-900 block">📚 المراجع الوطنية المعتمدة:</span>
                  <div>• الكتاب المدرسي المقرر لمادة {subjectInfo.nameAr} - ديوان المطبوعات المدرسية (ONPS).</div>
                  <div>• المنهاج الرسمي والوثيقة المرافقة - منشورات ديوان المطبوعات الجامعية (OPU).</div>
                </div>
              )}

              {/* Educational Review Question */}
              {eduIncludeReviewQuestions && eduDocKind !== "THESIS" && (
                <div className="p-2 bg-blue-50/80 rounded border border-blue-200 text-[8.5px] text-blue-900">
                  <strong>💡 سؤال مراجعة وتثبيت الفهم:</strong> ما هي الفكرة الأساسية لموضوع «{eduTopic || "هذا البحث"}» بأسلوبك الخاص؟
                </div>
              )}

              <div className="pt-1.5 border-t text-center text-[8.5px] text-slate-400 font-mono">
                منصة سهلة · معتمد للطباعة والتسليم المدرسي (A4 · 300 DPI)
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 🎓 SCHOOL RESEARCH & THESIS: A4 COVER PAGE (Page 1)       */}
          {/* ======================================================== */}
          {isSchoolService && eduMode === "RESEARCH" && eduPageCount > 1 && activePage === 1 && eduIncludeCover && (
            <div
              className={`p-4 h-full flex flex-col justify-between text-center space-y-4 ${
                eduCoverTemplate === "OFFICIAL"
                  ? "border-4 border-double border-emerald-800 bg-emerald-50/10"
                  : eduCoverTemplate === "CLASSIC"
                  ? "border-4 border-double border-slate-900 bg-slate-50/20"
                  : "border-2 border-emerald-600 rounded-2xl bg-gradient-to-b from-emerald-50/30 to-white"
              }`}
            >
              {/* Header */}
              <div className="space-y-1">
                <div className="font-extrabold text-[11px] text-slate-900">
                  الجمهورية الجزائرية الديمقراطية الشعبية
                </div>
                <div className="text-[10px] text-slate-700 font-bold">
                  {eduDocKind === "THESIS"
                    ? "وزارة التعليم العالي والبحث العلمي"
                    : "وزارة التربية الوطنية"}
                </div>
                <div className="text-[10px] text-slate-600 font-medium">
                  {eduDocKind === "THESIS"
                    ? `${eduUniversity || "الجامعة الجزائرية"}${eduFaculty ? ` · ${eduFaculty}` : ""}`
                    : `${eduDirectorate || "مديرية التربية لولاية الجزائر (16)"} · ${eduSchoolName || "المؤسسة التعليمية"}`}
                </div>
                {eduDocKind === "THESIS" && eduSpecialty && (
                  <div className="text-[9.5px] text-slate-500 font-medium">
                    قسم / تخصص: {eduSpecialty}
                  </div>
                )}
              </div>

              {/* Title & Topic Box */}
              <div
                className={`my-auto py-5 px-3 rounded-xl ${
                  eduCoverTemplate === "OFFICIAL"
                    ? "bg-emerald-50/80 border-2 border-emerald-600"
                    : eduCoverTemplate === "CLASSIC"
                    ? "bg-slate-100 border-2 border-slate-800"
                    : "bg-gradient-to-r from-emerald-100/80 to-teal-50 border border-emerald-400 shadow-sm"
                }`}
              >
                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-800 block mb-1">
                  {eduDocKind === "THESIS"
                    ? "مذكرة تخرج لنيل شهادة التخرج الجامعية (ليسانس / ماستر / تقني سامي)"
                    : eduDocKind === "SUMMARY"
                    ? "ملخص تعليمي شامل"
                    : eduDocKind === "PEDAGOGIC"
                    ? "مذكرة بيداغوجية لتحضير الدروس"
                    : `بحث مدرسي في مادة: ${subjectInfo.nameAr}`}
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-950 leading-snug">
                  {eduTopic || (eduDocKind === "THESIS" ? "عنوان مذكرة التخرج الجامعية" : "عنوان البحث المدرسي")}
                </h2>
                <div className="text-[10px] text-slate-600 font-bold mt-1">
                  {eduDocKind === "THESIS"
                    ? `الميدان والفرع: ${subjectInfo.nameAr}`
                    : `المستوى: ${gradeInfo?.nameAr || "السنة الدراسية"} · أسلوب: ${eduStyleLevel === "SIMPLE" ? "مبسط" : eduStyleLevel === "MODERATE" ? "متوسط" : "متقدم"}`}
                </div>
                {eduUnitTitle && eduDocKind !== "THESIS" && (
                  <div className="mt-2 inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold border border-emerald-300">
                    ✓ يوافق المنهاج الوطني الجزائري · مقطع: {eduUnitTitle}
                  </div>
                )}
                {eduTeacherRequirements && (
                  <div className="mt-2 text-[9px] text-slate-600 bg-white/70 p-1.5 rounded border border-slate-200 text-right">
                    <strong>توجيهات المشرف:</strong> {eduTeacherRequirements}
                  </div>
                )}
              </div>

              {/* Prepared by & Supervised by */}
              <div className="grid grid-cols-2 gap-2 text-right pt-2 border-t border-slate-300 text-[10px]">
                <div>
                  <span className="font-bold text-slate-900 block">
                    {eduDocKind === "THESIS" ? "إعداد الطالب(ة) الباحث:" : "إعداد التلميذ(ة):"}
                  </span>
                  <span className="text-emerald-900 font-extrabold">
                    {customerName || (eduDocKind === "THESIS" ? "اسم الطالب(ة)" : "تلميذ المؤسسة")}
                  </span>
                </div>
                <div className="text-left">
                  <span className="font-bold text-slate-900 block">
                    {eduDocKind === "THESIS" ? "تحت إشراف الأستاذ المؤطر:" : "تحت إشراف:"}
                  </span>
                  <span className="text-slate-800 font-bold">
                    {eduTeacherName || (eduDocKind === "THESIS" ? "أ.د المشرف والمؤطر" : "الأستاذ المشرف")}
                  </span>
                </div>
              </div>

              {/* Academic Year */}
              <div className="text-center text-[9px] text-slate-500 font-mono pt-1">
                {eduDocKind === "THESIS" ? "السنة الجامعية: 2025 / 2026 م" : "الموسم الدراسي: 2025 / 2026 م"}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 🎓 SCHOOL RESEARCH & THESIS: CONTENT (Multi-Page)         */}
          {/* ======================================================== */}
          {isSchoolService &&
            eduMode === "RESEARCH" &&
            eduPageCount > 1 &&
            (activePage > 1 || !eduIncludeCover) && (
              <div className="space-y-3.5 text-right">
                {/* Document Header Line */}
                <div className="flex justify-between items-center border-b pb-1.5 text-[9px] text-slate-500 font-bold">
                  <span>
                    {eduDocKind === "THESIS"
                      ? eduUniversity || "الجامعة الجزائرية"
                      : eduSchoolName || "المؤسسة التعليمية"}
                  </span>
                  <span className="truncate max-w-[200px] text-slate-800 font-black">{eduTopic || "مستند تعليمي"}</span>
                  <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-emerald-800 font-bold">
                    ص {activePage} من {eduPageCount}
                  </span>
                </div>

                {(() => {
                  const hasCover = eduIncludeCover && eduPageCount > 1;
                  const totalContentPages = hasCover ? eduPageCount - 1 : eduPageCount;
                  const contentPageIdx = hasCover ? activePage - 2 : activePage - 1;
                  const isFirstContentPage = contentPageIdx === 0;
                  const isLastDocPage = activePage === eduPageCount;

                  const assignedIndices = getPageItemIndices(
                    contentPageIdx,
                    totalContentPages,
                    planItems.length
                  );

                  return (
                    <div className="space-y-3">
                      {/* Table of Contents Card on First Content Page */}
                      {isFirstContentPage && eduIncludeOutline && (
                        <div className="bg-gradient-to-b from-slate-50 to-emerald-50/20 p-3 rounded-xl border border-emerald-200/80 space-y-2 shadow-2xs">
                          <div className="flex items-center justify-between border-b border-emerald-200/60 pb-1.5">
                            <h4 className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                                📌
                              </span>
                              <span>
                                {eduDocKind === "THESIS"
                                  ? "خطة وفهرس مذكرة التخرج المعتمدة:"
                                  : "خطة وفهرس البحث المعتمدة:"}
                              </span>
                            </h4>
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                              {planItems.length} محاور · مصممة لـ {eduPageCount} صفحات
                            </span>
                          </div>

                          {planItems.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[9.5px] text-slate-800 pr-1">
                              {planItems.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-1.5 bg-white/80 p-1 rounded border border-slate-200/60"
                                >
                                  <span className="w-4 h-4 rounded bg-emerald-100 text-emerald-800 font-mono font-bold flex items-center justify-center text-[9px] shrink-0">
                                    {idx + 1}
                                  </span>
                                  <span className="truncate">{item}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[10px] text-slate-500 italic">
                              اضغط على «توليد الخطة بالذكاء الاصطناعي» لإنشاء خطة منهجية متوافقة.
                            </p>
                          )}
                        </div>
                      )}

                      {/* If no sections are assigned to this page (edge case fallback) */}
                      {assignedIndices.length === 0 && (
                        <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center text-slate-500 text-xs">
                          هذه الصفحة مخصصة للمتن والتوسع الأكاديمي.
                        </div>
                      )}

                      {/* Render Assigned Sections for this page */}
                      {assignedIndices.map((itemIdx) => {
                        const planHeading = planItems[itemIdx];
                        const genSection =
                          eduGeneratedSections &&
                          (eduGeneratedSections[itemIdx] ||
                            eduGeneratedSections.find((s) => s.heading === planHeading));

                        const isIntro = itemIdx === 0 || planHeading.includes("مقدمة");
                        const isConclusion =
                          itemIdx === planItems.length - 1 ||
                          planHeading.includes("خاتمة") ||
                          (itemIdx === planItems.length - 2 &&
                            planItems[planItems.length - 1].includes("مراجع"));
                        const isRef = planHeading.includes("مراجع") || planHeading.includes("مصادر");

                        const heading =
                          genSection?.heading ||
                          planHeading ||
                          (isIntro
                            ? "المقدمة وطرح الإشكالية"
                            : isConclusion
                            ? "الخاتمة والاستنتاجات والتوصيات"
                            : `المبحث ${itemIdx}: العرض والتحليل المفصل`);

                        const hasContent = Boolean(genSection?.content);

                        return (
                          <div
                            key={itemIdx}
                            className="space-y-2 text-[11px] text-slate-800 leading-relaxed border-b border-slate-100 dark:border-slate-800 pb-3 last:border-b-0"
                          >
                            <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-800/40 pb-1">
                              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                                <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0">
                                  {itemIdx + 1}
                                </span>
                                <span className="text-emerald-950 font-black">{heading}</span>
                              </div>
                              {hasContent ? (
                                <span className="text-[8.5px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold border border-emerald-300">
                                  AI ⚡ نص موثق
                                </span>
                              ) : (
                                <span className="text-[8.5px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200">
                                  📋 معتمد في الخطة
                                </span>
                              )}
                            </div>

                            {hasContent ? (
                              <div className="text-justify text-[10.5px] text-slate-800 leading-relaxed whitespace-pre-line space-y-2">
                                {genSection!.content}
                              </div>
                            ) : (
                              <div className="p-3 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/40 text-right space-y-1.5">
                                <div className="text-[10px] text-emerald-900 font-bold flex items-center justify-between">
                                  <span>
                                    {isIntro
                                      ? "📌 الإطار التمهيدي وطرح الإشكالية العلمية"
                                      : isConclusion
                                      ? "📌 خلاصة النتائج والتوصيات المعتمدة"
                                      : isRef
                                      ? "📌 التوثيق الأكاديمي والمصادر الوطنية"
                                      : `📌 العرض التحليلي والشواهد لمحور «${heading}»`}
                                  </span>
                                  <span className="text-[9px] text-emerald-700 font-mono">جاهز للتوليد</span>
                                </div>
                                <p className="text-[10px] text-slate-600 leading-relaxed">
                                  {isIntro
                                    ? `يتناول هذا القسم التمهيد العلمي والمنهجي لموضوع «${eduTopic || "هذا البحث"}»، وطرح الإشكالية والتساؤلات الفرعية وفق منهاج الجيل الثاني المعتمد.`
                                    : isConclusion
                                    ? `يستعرض هذا القسم أهم الاستنتاجات العلمية والنتائج المستخلصة من البحث، مع تقديم التوصيات التربوية والعملية.`
                                    : isRef
                                    ? `يحتوي هذا القسم على المراجع والمصادر الوطنية المعتمدة من ديوان المطبوعات المدرسية والجامعية.`
                                    : `يتناول هذا المبحث العرض المفصل لعنصر «${heading}»، مدعماً بالشواهد والأمثلة التاريخية والجغرافية من البيئة الجزائرية.`}
                                </p>
                                <div className="text-[9px] text-emerald-800/80 font-medium pt-0.5 flex items-center gap-1">
                                  <span>⚡</span>
                                  <span>انقر على «توليد وحفظ المستند كاملاً» لصياغة هذا المحور نصاً كاملاً وموثقاً.</span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Educational Review Questions on Last Page */}
                      {isLastDocPage && eduIncludeReviewQuestions && eduDocKind !== "THESIS" && (
                        <div className="mt-3 p-2.5 bg-blue-50/80 rounded-xl border border-blue-200 text-[9.5px] text-blue-900 space-y-1.5">
                          <span className="font-bold text-blue-950 flex items-center gap-1">
                            <span>💡</span>
                            <span>أسئلة مراجعة ومفردات الدرس (لتحفيز الفهم وتجنب الغش الأكاديمي):</span>
                          </span>
                          <ul className="list-disc list-inside space-y-0.5 text-blue-800 pr-1 leading-relaxed">
                            <li>ما هي الفكرة الأساسية التي يعالجها موضوع "{eduTopic || "هذا البحث"}" بأسلوبك الخاص؟</li>
                            <li>استخرج مثالين واقعيين وردا في البحث يربطان المفاهيم بالمنهاج الدراسي الوطني.</li>
                            <li>لخص أهم ما توصلت إليه الخاتمة في جملتين لدعم مشاركتك وتفوقك في القسم.</li>
                          </ul>
                        </div>
                      )}

                      {/* Official References on Last Page */}
                      {isLastDocPage && eduIncludeSources && (
                        <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[9px] text-slate-700 space-y-1">
                          <span className="font-bold text-slate-900 block border-b border-slate-200 pb-1">
                            {eduDocKind === "THESIS"
                              ? "📚 قائمة المراجع والمصادر الأكاديمية المعتمدة:"
                              : "📚 قائمة المراجع والمصادر الرسمية المعتمدة:"}
                          </span>
                          {eduDocKind === "THESIS" ? (
                            <div className="space-y-0.5 pr-1">
                              <div>1. منشورات ديوان المطبوعات الجامعية (OPU) - بن عكنون، الجزائر.</div>
                              <div>2. البوابة الوطنية للمجلات العلمية الجزائرية (ASJP)، وزارة التعليم العالي والبحث العلمي.</div>
                              <div>3. المنشورات الأكاديمية والمراجع العلمية المتخصصة في الميدان.</div>
                            </div>
                          ) : (
                            <div className="space-y-0.5 pr-1">
                              <div>1. الكتاب المدرسي المقرر لوزارة التربية الوطنية لمادة {subjectInfo.nameAr} - ديوان المطبوعات المدرسية (ONPS).</div>
                              <div>2. المنهاج والوثيقة المرافقة لمادة {subjectInfo.nameAr}، المعهد الوطني للبحث في التربية (INRE).</div>
                              <div>3. الموسوعة الجزائرية للتاريخ والجغرافيا والعلوم، منشورات ديوان المطبوعات الجامعية (OPU).</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Page Footer */}
                <div className="pt-3 border-t text-center text-[9px] text-slate-400 font-mono">
                  {eduDocKind === "THESIS"
                    ? "منصة سهلة · معتمد لمذكرات التخرج والأطروحات الجامعية (A4 · 300 DPI)"
                    : "منصة سهلة · معتمد للطباعة والتسليم المدرسي (A4 · 300 DPI)"}
                </div>
              </div>
            )}

          {/* ======================================================== */}
          {/* 📝 EXAM / TEST MODE (Page 1)                             */}
          {/* ======================================================== */}
          {isSchoolService && eduMode === "EXAM" && activePage === 1 && (
            <div className="space-y-3 text-right">
              {/* Official Ministry Exam Header */}
              <div className="border-2 border-slate-900 p-2.5 rounded text-center space-y-1 bg-slate-50">
                <div className="flex justify-between items-center text-[9px] font-bold text-slate-800">
                  <span>الجمهورية الجزائرية الديمقراطية الشعبية</span>
                  <span>وزارة التربية الوطنية</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black border-t border-slate-300 pt-1">
                  <span>{eduSchoolName}</span>
                  <span>اختبار الفصل {eduTrimester === 1 ? "الأول" : eduTrimester === 2 ? "الثاني" : "الثالث"}</span>
                  <span>السنة الدراسية: 2025/2026</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-800 border-t border-slate-300 pt-1 font-bold">
                  <span>المستوى: {gradeInfo?.nameAr}</span>
                  <span className="font-black text-emerald-800">المادة: {subjectInfo.nameAr}</span>
                  <span>المدة: ساعتان • المعامل: 03</span>
                </div>
              </div>

              {/* Title */}
              <div className="text-center font-black text-xs text-slate-950 py-0.5">
                {eduTopic}
              </div>

              {/* Part 1: Exercises (12 pts) */}
              <div className="space-y-2 text-[10px] text-slate-800">
                <div className="flex justify-between items-center font-bold text-slate-900 border-b pb-0.5">
                  <span className="text-emerald-800 font-black">الجزء الأول: (12 نقطة)</span>
                  <span className="font-mono text-[9px]">التمرين 01 (06 ن) + التمرين 02 (06 ن)</span>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-900">التمرين الأول (06 نقاط):</span>
                  <p className="text-slate-700 leading-snug">
                    1. عرّف المفاهيم والمصطلحات الأساسية الواردة في السند مبيناً خصائصها.
                    <br />
                    2. أجب بصح أو خطأ مع تصحيح الخطأ في العبارات العلمية/التاريخية المعطاة.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-900">التمرين الثاني (06 نقاط):</span>
                  <p className="text-slate-700 leading-snug">
                    قم بتحليل الوثيقة المرفقة واستنتج العلاقة بين المتغيرات مع التعليل الدقيق.
                  </p>
                </div>
              </div>

              {/* Part 2: Situation d'intégration (08 pts) */}
              <div className="space-y-1.5 pt-1 border-t text-[10px] text-slate-800">
                <div className="flex justify-between items-center font-bold text-slate-900">
                  <span className="text-emerald-800 font-black">الجزء الثاني: الوضعية الإدماجية (08 نقاط)</span>
                </div>
                <p className="text-slate-700 leading-snug">
                  <span className="font-bold">السياق:</span> خلال نقاش مدرسي، طُلب منك تقديم حلول واقعية مدعومة بالحجج والبراهين لمعالجة الإشكالية المطروحة.
                  <br />
                  <span className="font-bold">التعليمات:</span> اعتماداً على السندات ومكتسباتك القبلية، حرّر فقرة لا تتجاوز 12 سطراً تُفصل فيها منهجية المعالجة.
                </p>
              </div>

              {/* Exam Page Footer */}
              <div className="pt-2 border-t flex justify-between items-center text-[9px] text-slate-500 font-mono">
                <span>الصفحة 1 من {eduPageCount}</span>
                <span className="font-bold text-slate-700">بالتوفيق والنجاح لجميع التلاميذ 🇩🇿</span>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 📝 EXAM MODE: ANSWER KEY / CORRIGÉ-TYPE (Page 2+)        */}
          {/* ======================================================== */}
          {isSchoolService && eduMode === "EXAM" && activePage > 1 && (
            <div className="space-y-3 text-right">
              <div className="border-b-2 border-emerald-600 pb-1.5 text-center">
                <h4 className="font-black text-xs text-slate-950">
                  شبكة التقويم والحل النموذجي الرسمي (Corrigé-type)
                </h4>
                <div className="text-[10px] text-slate-600 font-bold">
                  {subjectInfo.nameAr} • {gradeInfo?.nameAr} • العلامة الكاملة: 20/20
                </div>
              </div>

              <div className="space-y-2 text-[10px]">
                <div className="bg-slate-50 p-2 rounded border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold text-slate-900 border-b pb-1">
                    <span>عناصر الإجابة - الجزء الأول</span>
                    <span className="font-mono">العلامة / الجزئية</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>1. التعريف الدقيق للمصطلحات والمفاهيم</span>
                    <span className="font-mono font-bold">03.00 ن (1.5 × 2)</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>2. التعليل والبرهان المنطقي للتمرين الثاني</span>
                    <span className="font-mono font-bold">03.00 ن</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>3. صحة النتيجة وتطبيق القواعد المنهجية</span>
                    <span className="font-mono font-bold">06.00 ن</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-2 rounded border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold text-slate-900 border-b pb-1">
                    <span>شبكة تقويم الوضعية الإدماجية</span>
                    <span className="font-mono">العلامة</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>• معيار الوجاهة والملاءمة مع الموضوع</span>
                    <span className="font-mono">02.50 ن</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>• معيار الاستعمال السليم لأدوات المادة</span>
                    <span className="font-mono">03.00 ن</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>• معيار الانسجام وتناسق الأفكار وسلامة اللغة</span>
                    <span className="font-mono">02.50 ن</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t text-center text-[9px] text-slate-400 font-mono">
                سلم التنقيط معتمد ومطابق لشبكات التصحيح بوزارة التربية الوطنية
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 📄 CV PREVIEW                                            */}
          {/* ======================================================== */}
          {service.code === "CV_GEN" && (
            <div>
              <div className="border-b-2 border-emerald-600 pb-3 mb-3">
                <h3 className="text-base font-extrabold text-slate-900">
                  {customerName || "الاسم واللقب"}
                </h3>
                <div className="text-xs text-emerald-700 font-bold">{cvJobTitle}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5" dir="ltr">
                  {phone || "0555 12 34 56"} • Algeria
                </div>
              </div>
              <div className="text-[11px] leading-relaxed text-slate-700 mb-3">
                <span className="font-bold text-slate-900">الملف المهني: </span>
                {cvExperience}
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-[10px] space-y-1">
                <div className="font-bold text-slate-800">المهارات والكفاءات:</div>
                <div>• إتقان برامج الأوفيس والمعالجة المكتبية المتقدمة</div>
                <div>• التواصل المؤسساتي باللغات العربية والفرنسية</div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 📸 ID PHOTO PREVIEW                                      */}
          {/* ======================================================== */}
          {service.code === "ID_PHOTO" && (
            <div>
              <div className="text-center font-bold text-[11px] text-slate-700 mb-3">
                شبكة صور الهوية الرسمية (35×45 مم)
              </div>
              <div className={`grid ${idPhotoCount === 4 ? "grid-cols-2" : "grid-cols-4"} gap-2`}>
                {Array.from({ length: idPhotoCount }).map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-[35/45] rounded border border-dashed border-slate-400 flex flex-col items-center justify-center p-1.5 ${
                      idBgColor === "gray" ? "bg-slate-200" : "bg-white"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 text-[10px]">
                      👤
                    </div>
                    <span className="text-[8px] text-slate-500 mt-1 font-mono">35×45 mm</span>
                  </div>
                ))}
              </div>
              <div className="text-center text-[9px] text-slate-500 mt-3 font-mono">
                جاهزة للقص والطباعة الفورية على طابعات Epson / Canon
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 🧾 INVOICE PREVIEW                                       */}
          {/* ======================================================== */}
          {service.code === "INVOICE" && (
            <div>
              <div className="flex justify-between items-start border-b pb-2 mb-2">
                <div>
                  <div className="font-extrabold text-sm">
                    فاتورة رقم #1024
                  </div>
                  <div className="text-[9px] text-slate-500">
                    التاريخ: {new Date().toLocaleDateString("ar-DZ")}
                  </div>
                </div>
                <div className="text-left text-[9px] text-slate-600">
                  <div>NIF: 001916001234567</div>
                  <div>RC: 16/00-1234567A20</div>
                </div>
              </div>
              <div className="text-[10px] mb-2 font-bold">
                الزبون: {customerName || "زبون المحل"}
              </div>
              <div className="text-[10px] space-y-1 mb-3">
                {invoiceItems.map((item, i) => (
                  <div key={i} className="flex justify-between border-b border-slate-100 pb-1">
                    <span>
                      {item.desc} (×{item.qty})
                    </span>
                    <span className="font-mono">{item.qty * item.price} دج</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 text-[10px] font-bold flex justify-between text-emerald-800">
                <span>المجموع الإجمالي TTC:</span>
                <span className="font-mono">{calculateInvoiceTotal().total} دج</span>
              </div>
            </div>
          )}

          {/* General Fallback Service */}
          {service.code !== "CV_GEN" &&
            service.code !== "ID_PHOTO" &&
            service.code !== "INVOICE" &&
            service.code !== "SCHOOL_RESEARCH" &&
            service.code !== "EXAMS" && (
              <div className="space-y-3">
                <div className="text-center border-b pb-2">
                  <div className="font-bold text-sm">
                    الجمهورية الجزائرية الديمقراطية الشعبية
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{service.nameAr}</div>
                </div>
                <div className="space-y-2 text-[11px]">
                  <div>
                    الاسم واللقب: <span className="font-bold">{customerName || "..."}</span>
                  </div>
                  <div>
                    رقم الهاتف: <span className="font-mono">{phone || "..."}</span>
                  </div>
                  <div>البيانات الإضافية: {details || "طلب رسمي نظامي"}</div>
                </div>
                <div className="pt-4 text-left font-mono text-[9px] text-slate-400">
                  معرف الوثيقة: DZ-{Date.now().toString().slice(-8)}
                </div>
              </div>
            )}
        </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>جاهز للإرسال الفوري لدرج الطابعة A4</span>
        </span>
        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">⚡ 300 DPI High-Res</span>
      </div>
    </div>
  );
}
