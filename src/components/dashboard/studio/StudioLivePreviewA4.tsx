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
  eduCoverTemplate?: "OFFICIAL" | "CLASSIC" | "MODERN";
  eduStyleLevel?: "SIMPLE" | "MODERATE" | "ADVANCED";
  eduIncludeReviewQuestions?: boolean;
  eduDirectorate?: string;
  eduTeacherRequirements?: string;
  eduUnitTitle?: string;
  onExportWord?: () => void;
  onReportError?: () => void;
  conformanceScore?: number;
  onViewConformance?: () => void;
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
  eduLevel = "MIDDLE",
  eduGradeId = "4AM",
  eduSubjectId = "HISTORY_GEO",
  eduTopic = "الثورة التحريرية الجزائرية المباركة (1954 - 1962)",
  eduPageCount = 3,
  eduSchoolName = "متوسطة الشهيد زبانة",
  eduTeacherName = "الأستاذ المشرف",
  eduDirectorate = "مديرية التربية لولاية الجزائر (16)",
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
  eduCoverTemplate = "OFFICIAL",
  eduStyleLevel = "MODERATE",
  eduIncludeReviewQuestions = true,
  onExportWord,
  onReportError,
  conformanceScore = 0.94,
  onViewConformance,
}: StudioLivePreviewA4Props) {
  const isSchoolService = service.code === "SCHOOL_RESEARCH";

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

              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-xs sm:text-sm">
                الصفحة {activePage} من {eduPageCount}
              </span>

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

            {/* Quick Export & Actions Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] px-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {onExportWord && (
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

        {/* Simulated White Paper Document (A4 Aspect Ratio with Dynamic Zoom) */}
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
          {/* 🎓 SCHOOL RESEARCH: A4 COVER PAGE (Page 1)               */}
          {/* ======================================================== */}
          {isSchoolService && eduMode === "RESEARCH" && activePage === 1 && eduIncludeCover && (
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
                  {eduLevel === "UNIVERSITY"
                    ? "وزارة التعليم العالي والبحث العلمي"
                    : "وزارة التربية الوطنية"}
                </div>
                <div className="text-[10px] text-slate-600 font-medium">
                  {eduDirectorate || "مديرية التربية لولاية الجزائر (16)"} · {eduSchoolName || "المؤسسة التعليمية"}
                </div>
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
                  بحث مـدرسي في مادة: {subjectInfo.nameAr}
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-950 leading-snug">
                  {eduTopic || "عنوان البحث المدرسي"}
                </h2>
                <div className="text-[10px] text-slate-600 font-bold mt-1">
                  المستوى: {gradeInfo?.nameAr || "السنة الدراسية"} · أسلوب: {eduStyleLevel === "SIMPLE" ? "مبسط" : eduStyleLevel === "MODERATE" ? "متوسط" : "متقدم"}
                </div>
                {eduUnitTitle && (
                  <div className="mt-2 inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold border border-emerald-300">
                    ✓ يوافق المنهاج الوطني الجزائري · مقطع: {eduUnitTitle}
                  </div>
                )}
                {eduTeacherRequirements && (
                  <div className="mt-2 text-[9px] text-slate-600 bg-white/70 p-1.5 rounded border border-slate-200 text-right">
                    <strong>العناصر المطلوبة من الأستاذ:</strong> {eduTeacherRequirements}
                  </div>
                )}
              </div>

              {/* Prepared by & Supervised by */}
              <div className="grid grid-cols-2 gap-2 text-right pt-2 border-t border-slate-300 text-[10px]">
                <div>
                  <span className="font-bold text-slate-900 block">إعداد التلميذ(ة):</span>
                  <span className="text-emerald-900 font-extrabold">{customerName || "تلميذ المؤسسة"}</span>
                </div>
                <div className="text-left">
                  <span className="font-bold text-slate-900 block">تحت إشراف:</span>
                  <span className="text-slate-800 font-bold">{eduTeacherName || "الأستاذ المشرف"}</span>
                </div>
              </div>

              {/* Academic Year */}
              <div className="text-center text-[9px] text-slate-500 font-mono pt-1">
                الموسم الدراسي: 2026 / 2027 م
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 🎓 SCHOOL RESEARCH: CONTENT / OUTLINE (Page 2+)          */}
          {/* ======================================================== */}
          {isSchoolService && eduMode === "RESEARCH" && (activePage > 1 || !eduIncludeCover) && (
            <div className="space-y-3.5 text-right">
              {/* Document Header Line */}
              <div className="flex justify-between items-center border-b pb-1.5 text-[9px] text-slate-500 font-bold">
                <span>{eduSchoolName}</span>
                <span className="truncate max-w-[200px]">{eduTopic}</span>
                <span className="font-mono">ص {activePage}</span>
              </div>

              {/* If Page 2 or Outline page */}
              {activePage === (eduIncludeCover ? 2 : 1) && eduIncludeOutline && (
                <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-2">
                  <h4 className="font-black text-slate-900 text-xs border-b pb-1 flex items-center gap-1">
                    <span>📌</span>
                    <span>خطة البحث والفهرس المعتمد:</span>
                  </h4>
                  <ul className="space-y-1.5 text-[10px] text-slate-800 pr-2">
                    {eduCustomPlan.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-snug">
                        <span className="text-emerald-700 font-bold shrink-0">▪</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sample Content Paragraphs */}
              <div className="space-y-2.5 text-[11px] text-slate-800 leading-relaxed">
                <div className="font-bold text-slate-900 text-xs text-emerald-800">
                  {activePage === eduPageCount
                    ? "الخاتمة والاستنتاجات النهائية:"
                    : `المبحث ${activePage - 1}: العرض والتحليل المفصل`}
                </div>
                <p className="text-justify text-[10px] text-slate-700 leading-relaxed">
                  {activePage === eduPageCount
                    ? "وفي ختام هذا البحث المتواضع، نستنتج أن دراسة هذا الموضوع تبرز مدى الأهمية البالغة التي توليها المنظومة التربوية والوطنية لهذه القضية، مع التأكيد على ضرورة ترسيخ هذه المعارف ونقلها للأجيال الصاعدة وتطبيقها في الحياة العملية."
                    : "يعتبر هذا الموضوع من أهم المحاور المقررة في المنهاج الدراسي، حيث يتناول الأسس النظرية والمفاهيم الجوهرية التي تمكن المتعلم من استيعاب الظواهر المعنية بدقة، مع ربطها بالأمثلة التطبيقية والشواهد الواقعية المستمدة من البيئة الجزائرية الأصيلة."}
                </p>

                {/* Educational Review Questions (PRD Section 8: النزاهة الأكاديمية) */}
                {activePage === eduPageCount && eduIncludeReviewQuestions && (
                  <div className="mt-2.5 p-2.5 bg-blue-50/80 rounded border border-blue-200 text-[9.5px] text-blue-900 space-y-1">
                    <span className="font-bold text-blue-950 block">💡 أسئلة مراجعة ومفردات الدرس (لتحفيز الفهم وتجنب الغش):</span>
                    <ul className="list-disc list-inside space-y-0.5 text-blue-800 pr-1">
                      <li>ما هي الفكرة الأساسية التي يعالجها موضوع "{eduTopic}" بأسلوبك الخاص؟</li>
                      <li>استخرج مثالين واقعيين وردا في البحث يربطان المفاهيم بالمنهاج الدراسي.</li>
                      <li>لخص أهم ما توصلت إليه الخاتمة في جملتين لدعم مشاركتك في القسم.</li>
                    </ul>
                  </div>
                )}

                {/* Verified ONPS References (PRD Section 5.4) */}
                {activePage === eduPageCount && eduIncludeSources && (
                  <div className="mt-2.5 p-2 bg-slate-50 rounded border border-slate-200 text-[9px] text-slate-600 space-y-1">
                    <span className="font-bold text-slate-900 block">قائمة المراجع والمصادر الرسمية المعتمدة:</span>
                    <div>1. الكتاب المدرسي المقرر لوزارة التربية الوطنية لمادة {subjectInfo.nameAr} - ديوان المطبوعات المدرسية (ONPS).</div>
                    <div>2. المنهاج والوثيقة المرافقة لمادة {subjectInfo.nameAr}، المعهد الوطني للبحث في التربية (INRE).</div>
                    <div>3. الموسوعة الجزائرية للتاريخ والجغرافيا والعلوم، منشورات ديوان المطبوعات الجامعية (OPU).</div>
                  </div>
                )}
              </div>

              {/* Page Footer */}
              <div className="pt-3 border-t text-center text-[9px] text-slate-400 font-mono">
                منصة سهلة · معتمد للطباعة والتسليم المدرسي
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
            service.code !== "SCHOOL_RESEARCH" && (
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
