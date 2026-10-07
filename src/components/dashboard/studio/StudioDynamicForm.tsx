"use client";

import React from "react";
import type { ServiceDefinition } from "@/lib/constants";
import type { InvoiceItem } from "@/hooks/dashboard/useStudioState";
import {
  EducationLevel,
  DocumentMode,
  EDUCATION_LEVELS,
  ALGERIAN_GRADES,
  ALGERIAN_SUBJECTS,
  PRESET_TOPICS,
} from "@/lib/educationConstants";
import {
  SchoolCapIcon,
  SparklesIcon,
  CheckCircleIcon,
  DocCvIcon,
  ShieldCheckIcon,
  BoltIcon,
  WirelessPrintIcon,
} from "@/components/ui/Icons";

import { SpecCard } from "./SpecCard";
import { ALGERIAN_WILAYAS_DIRECTORATES, getCurriculumUnits } from "@/server/education/curriculumCatalog";


interface StudioDynamicFormProps {
  service: ServiceDefinition;
  customerName: string;
  setCustomerName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  language: "ar" | "fr" | "en";
  setLanguage: (l: "ar" | "fr" | "en") => void;
  cvJobTitle: string;
  setCvJobTitle: (v: string) => void;
  cvExperience: string;
  setCvExperience: (v: string) => void;
  idPhotoCount: 4 | 8;
  setIdPhotoCount: (c: 4 | 8) => void;
  idBgColor: "gray" | "white";
  setIdBgColor: (c: "gray" | "white") => void;
  invoiceItems: InvoiceItem[];
  setInvoiceItems: (items: InvoiceItem[]) => void;
  details: string;
  setDetails: (v: string) => void;
  // Educational props
  eduMode?: DocumentMode;
  setEduMode?: (m: DocumentMode) => void;
  eduLevel?: EducationLevel;
  setEduLevel?: (l: EducationLevel) => void;
  eduGradeId?: string;
  setEduGradeId?: (g: string) => void;
  eduSubjectId?: string;
  setEduSubjectId?: (s: string) => void;
  eduTopic?: string;
  setEduTopic?: (t: string) => void;
  eduPageCount?: 1 | 2 | 3 | 5 | 10;
  setEduPageCount?: (p: 1 | 2 | 3 | 5 | 10) => void;
  eduSchoolName?: string;
  setEduSchoolName?: (s: string) => void;
  eduTeacherName?: string;
  setEduTeacherName?: (t: string) => void;
  eduTrimester?: 1 | 2 | 3;
  setEduTrimester?: (t: 1 | 2 | 3) => void;
  eduIncludeCover?: boolean;
  setEduIncludeCover?: (c: boolean) => void;
  eduIncludeOutline?: boolean;
  setEduIncludeOutline?: (o: boolean) => void;
  eduIncludeSources?: boolean;
  setEduIncludeSources?: (s: boolean) => void;
  eduIncludeAnswerKey?: boolean;
  setEduIncludeAnswerKey?: (k: boolean) => void;
  applyPresetTopic?: (id: string) => void;
  getDynamicPricing?: (code: string) => { pointsCost: number; defaultSaleDZD: number };
  // PRD v2.0 additions
  eduSubTab?: "BUILDER" | "LIBRARY" | "PRACTICE_EXAM";
  setEduSubTab?: (t: "BUILDER" | "LIBRARY" | "PRACTICE_EXAM") => void;
  eduStyleLevel?: "SIMPLE" | "MODERATE" | "ADVANCED";
  setEduStyleLevel?: (l: "SIMPLE" | "MODERATE" | "ADVANCED") => void;
  eduCoverTemplate?: "OFFICIAL" | "CLASSIC" | "MODERN";
  setEduCoverTemplate?: (c: "OFFICIAL" | "CLASSIC" | "MODERN") => void;
  eduIncludeReviewQuestions?: boolean;
  setEduIncludeReviewQuestions?: (q: boolean) => void;
  eduDirectorate?: string;
  setEduDirectorate?: (d: string) => void;
  eduTeacherRequirements?: string;
  setEduTeacherRequirements?: (r: string) => void;
  eduUnitId?: string;
  setEduUnitId?: (u: string) => void;
  eduUnitTitle?: string;
  setEduUnitTitle?: (t: string) => void;
  onPracticeExamGenerated?: (exam: any) => void;
  isGeneratingPlan?: boolean;
  isPlanReviewed?: boolean;
  generatePlanAsync?: () => Promise<void>;
  planSummary?: string;
  planProviderUsed?: string;
  planSuccessNotice?: string | null;
  onDismissPlanNotice?: () => void;
  eduCustomPlan?: string[];
  setEduCustomPlan?: (p: string[]) => void;
  points?: number;
  onPrintExam?: (exam: any, withSolution: boolean) => void;
  onBundlePrint?: (exams: any[], watermark: boolean) => void;
  onReportError?: (id: string, title: string) => void;
  currentSpec?: any;
  onApproveSpec?: () => void;
}


export function StudioDynamicForm({
  service,
  customerName,
  setCustomerName,
  phone,
  setPhone,
  language,
  setLanguage,
  cvJobTitle,
  setCvJobTitle,
  cvExperience,
  setCvExperience,
  idPhotoCount,
  setIdPhotoCount,
  idBgColor,
  setIdBgColor,
  invoiceItems,
  setInvoiceItems,
  details,
  setDetails,
  // Educational props
  eduMode = "RESEARCH",
  setEduMode,
  eduLevel = "MIDDLE",
  setEduLevel,
  eduGradeId = "4AM",
  setEduGradeId,
  eduSubjectId = "HISTORY_GEO",
  setEduSubjectId,
  eduTopic = "الثورة التحريرية الجزائرية المباركة (1954 - 1962)",
  setEduTopic,
  eduPageCount = 3,
  setEduPageCount,
  eduSchoolName = "متوسطة الشهيد زبانة",
  setEduSchoolName,
  eduTeacherName = "الأستاذ المشرف",
  setEduTeacherName,
  eduTrimester = 2,
  setEduTrimester,
  eduIncludeCover = true,
  setEduIncludeCover,
  eduIncludeOutline = true,
  setEduIncludeOutline,
  eduIncludeSources = true,
  setEduIncludeSources,
  eduIncludeAnswerKey = true,
  setEduIncludeAnswerKey,
  applyPresetTopic,
  getDynamicPricing,
  eduSubTab = "BUILDER",
  setEduSubTab,
  eduStyleLevel = "MODERATE",
  setEduStyleLevel,
  eduCoverTemplate = "OFFICIAL",
  setEduCoverTemplate,
  eduIncludeReviewQuestions = true,
  setEduIncludeReviewQuestions,
  eduDirectorate = "مديرية التربية لولاية الجزائر (16)",
  setEduDirectorate,
  eduTeacherRequirements = "",
  setEduTeacherRequirements,
  eduUnitId = "",
  setEduUnitId,
  eduUnitTitle = "",
  setEduUnitTitle,
  onPracticeExamGenerated,
  isGeneratingPlan = false,
  isPlanReviewed = false,
  generatePlanAsync,
  planSummary = "",
  planProviderUsed = "",
  planSuccessNotice = null,
  onDismissPlanNotice,
  eduCustomPlan = [],
  setEduCustomPlan,
  points = 50,

  onPrintExam,
  onBundlePrint,
  onReportError,
  currentSpec,
  onApproveSpec,
}: StudioDynamicFormProps) {

  const isSchoolService = service.code === "SCHOOL_RESEARCH";


  // Grades filtered by selected level
  const filteredGrades = ALGERIAN_GRADES.filter((g) => g.level === eduLevel);

  // Active grade item to filter subjects
  const currentGrade =
    filteredGrades.find((g) => g.id === eduGradeId) || filteredGrades[0];

  const availableSubjectIds = currentGrade?.defaultSubjects || [
    "ARABIC",
    "MATH",
    "PHYSICS",
    "SCIENCES",
    "HISTORY_GEO",
  ];

  // PRD v2.0: Available curriculum units for current level and subject
  const availableUnits = getCurriculumUnits(
    eduLevel.toLowerCase(),
    eduGradeId,
    eduSubjectId
  );

  // Presets filtered by mode & level
  const availablePresets = PRESET_TOPICS.filter(
    (p) => p.mode === eduMode && p.level === eduLevel
  );

  const pricing = getDynamicPricing
    ? getDynamicPricing(service.code)
    : { pointsCost: 15, defaultSaleDZD: 250 };

  return (
    <div className="space-y-4">
      {/* Customer Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            {isSchoolService ? "اسم التلميذ / الطالب *" : "اسم الزبون الكامل *"}
          </label>
          <input
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder={isSchoolService ? "مثال: أمين بن مهيدي" : "مثال: محمد بن عبد الرحمن"}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            رقم الهاتف (لإرسال PDF بالواتساب)
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0555 12 34 56"
            dir="ltr"
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-none focus:border-emerald-500 text-right font-mono transition-colors"
          />
        </div>
      </div>

      {/* ======================================================== */}
      {/* 🎓 SCHOOL RESEARCH CONFIGURATION SECTION                 */}
      {/* ======================================================== */}
      {isSchoolService && (
        <div className="space-y-4 pt-1 bg-slate-100/70 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800/90 shadow-sm transition-colors">

          {/* Quick Presets Dropdown */}
          {availablePresets.length > 0 && (
            <div>
              <label className="block text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
                <SparklesIcon className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                <span>مواضيع جزائرية نموذجية جاهزة (بنقرة واحدة):</span>
              </label>
              <select
                onChange={(e) => {
                  if (e.target.value && applyPresetTopic) {
                    applyPresetTopic(e.target.value);
                  }
                }}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-emerald-500/40 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="">-- اختر موضوعاً جاهزاً لملء الخطة تلقائياً --</option>
                {availablePresets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 2. Educational Level Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              الطور التعليمي:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {EDUCATION_LEVELS.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => {
                    if (setEduLevel) setEduLevel(lvl.id);
                    const firstG = ALGERIAN_GRADES.find((g) => g.level === lvl.id);
                    if (firstG && setEduGradeId) setEduGradeId(firstG.id);
                  }}
                  className={`p-2 rounded-xl text-[11px] font-bold border text-center transition-all cursor-pointer ${
                    eduLevel === lvl.id
                      ? "bg-emerald-50 dark:bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-sm"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className="truncate">{lvl.nameAr.split(" ")[1] || lvl.nameAr}</div>
                  <div className="text-[9px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{lvl.badge}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Grade & Subject Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                السنة الدراسية / الشعبة:
              </label>
              <select
                value={eduGradeId}
                onChange={(e) => setEduGradeId && setEduGradeId(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {filteredGrades.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nameAr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                المادة الدراسية:
              </label>
              <select
                value={eduSubjectId}
                onChange={(e) => {
                  const sId = e.target.value;
                  if (setEduSubjectId) setEduSubjectId(sId);
                  const subInfo = ALGERIAN_SUBJECTS[sId];
                  if (subInfo && setLanguage) setLanguage(subInfo.defaultLang);
                }}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {availableSubjectIds.map((sId) => {
                  const s = ALGERIAN_SUBJECTS[sId];
                  return (
                    <option key={sId} value={sId}>
                      {s?.nameAr || sId}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* PRD v2.0: المقطع التعليمي من الكتالوج الرسمي */}
          {eduMode === "RESEARCH" && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  المقطع التعليمي المقرّر (خريطة المنهاج الجزائري):
                </label>
                {eduUnitTitle && (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                    ✓ يوافق المنهاج الجزائري
                  </span>
                )}
              </div>
              <select
                value={eduUnitId}
                onChange={(e) => {
                  const uId = e.target.value;
                  if (setEduUnitId) setEduUnitId(uId);
                  const foundU = availableUnits.find((u) => u.id === uId);
                  if (foundU) {
                    if (setEduUnitTitle) setEduUnitTitle(foundU.title);
                    if (setEduTopic && (!eduTopic || eduTopic.includes("الثورة التحريرية"))) {
                      setEduTopic(foundU.title);
                    }
                  } else {
                    if (setEduUnitTitle) setEduUnitTitle("");
                  }
                }}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="">-- بدون مقطع محدد (موضوع عام) --</option>
                {availableUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    [{u.code}] {u.title} (الثلاثي {u.trimester})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 4. Language Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              لغة المستند والطباعة:
            </label>
            <div className="flex gap-2">
              {(["ar", "fr", "en"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    language === lang
                      ? "bg-emerald-600 border-emerald-500 text-white shadow-sm"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {lang === "ar" ? "العربية (RTL)" : lang === "fr" ? "Français" : "English"}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Page Count & Pricing Pill */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                عدد الصفحات وحجم المستند:
              </label>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {pricing.pointsCost} نقطة · سعر البيع: {pricing.defaultSaleDZD} دج
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {([1, 2, 3, 5, 10] as const).map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setEduPageCount && setEduPageCount(cnt)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    eduPageCount === cnt
                      ? "bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-950/20"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span>{cnt} {cnt === 1 ? "صفحة" : cnt === 2 ? "صفحتين" : "صفحات"}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 6. Title / Topic Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {eduMode === "RESEARCH" ? "عنوان وموضوع البحث *" : "عنوان الاختبار أو الفرض *"}
            </label>
            <input
              type="text"
              required
              value={eduTopic}
              onChange={(e) => setEduTopic && setEduTopic(e.target.value)}
              placeholder="مثال: الثورة التحريرية الجزائرية / فرض الفصل الثاني في مادة الرياضيات"
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-none focus:border-emerald-500 font-bold transition-colors"
            />
          </div>

          {/* 7. Directorate, School and Teacher info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                مديرية التربية لولاية:
              </label>
              <select
                value={eduDirectorate}
                onChange={(e) => setEduDirectorate && setEduDirectorate(e.target.value)}
                className="w-full px-2 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {ALGERIAN_WILAYAS_DIRECTORATES.slice(0, 30).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                اسم المؤسسة التعليمية:
              </label>
              <input
                type="text"
                value={eduSchoolName}
                onChange={(e) => setEduSchoolName && setEduSchoolName(e.target.value)}
                placeholder="ثانوية العقيد لطفي / متوسطة زبانة"
                className="w-full px-2.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                اسم الأستاذ المشرف:
              </label>
              <input
                type="text"
                value={eduTeacherName}
                onChange={(e) => setEduTeacherName && setEduTeacherName(e.target.value)}
                placeholder="الأستاذ المشرف"
                className="w-full px-2.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs transition-colors"
              />
            </div>
          </div>

          {/* PRD v2.0 F4: عناصر وتوجيهات مطلوبة من الأستاذ */}
          {eduMode === "RESEARCH" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>عناصر وتوجيهات مطلوبة من الأستاذ المشرف (F4):</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">اختياري - يُلزم الهيكل بها</span>
              </label>
              <textarea
                value={eduTeacherRequirements}
                onChange={(e) => setEduTeacherRequirements && setEduTeacherRequirements(e.target.value)}
                placeholder="مثال: التركيز على بيان أول نوفمبر، إدراج خريطة الولايات التاريخية، كتابة فقرة خاصة بدور المرأة في الثورة..."
                rows={2}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none transition-colors"
              />
            </div>
          )}

          {/* PRD v1.0 Guidance System: Spec Card (بطاقة المواصفة وعقد المخرجات) */}
          {currentSpec && (
            <div className="pt-1">
              <SpecCard
                spec={currentSpec}
                pointsBalance={points}
                onModifyField={(f, v) => {
                  if (f === "topic" && setEduTopic) setEduTopic(v);
                }}
                onApproveAndGenerate={onApproveSpec}
              />
            </div>
          )}

          {/* 8. Step 1: Interactive Outline Editor & AI Plan Result (PRD Section 5.1) */}
          {eduMode === "RESEARCH" && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
              {/* Header & Trigger */}
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <SparklesIcon className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                  <span>الخطوة 1: خطة وفهرس البحث بالذكاء الاصطناعي (توليد ومراجعة مجانية):</span>
                </label>
                <button
                  type="button"
                  onClick={() => generatePlanAsync && generatePlanAsync()}
                  disabled={isGeneratingPlan}
                  className="text-[10.5px] px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  {isGeneratingPlan ? (
                    <>
                      <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>جاري الصياغة بالذكاء الاصطناعي...</span>
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      <span>توليد الخطة بالذكاء الاصطناعي</span>
                    </>
                  )}
                </button>
              </div>

              {/* Success Feedback Alert */}
              {planSuccessNotice && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-between animate-fade-in shadow-2xs">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{planSuccessNotice}</span>
                  </div>
                  {onDismissPlanNotice && (
                    <button
                      type="button"
                      onClick={onDismissPlanNotice}
                      className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 text-xs px-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}

              {/* Prominent Plan Result Container */}
              {eduCustomPlan.length === 0 ? (
                <div className="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
                  <p className="font-medium">لم يتم إنشاء خطة وفهرس لهذا البحث بعد.</p>
                  <button
                    type="button"
                    onClick={() => generatePlanAsync && generatePlanAsync()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 cursor-pointer shadow-xs transition-all"
                  >
                    <span>✨</span>
                    <span>اضغط هنا لتوليد خطة فورية بالذكاء الاصطناعي</span>
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 p-3.5 space-y-3 shadow-2xs">
                  {/* Status & Engine Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-emerald-500/20">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        نتيجة خطة البحث المعتمدة
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                        {eduCustomPlan.length} محاور
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                        ⚡ {planProviderUsed || "محرك الذكاء الاصطناعي"}
                      </span>
                    </div>
                  </div>

                  {/* Methodology Summary Box */}
                  {planSummary && (
                    <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-500/20 text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-2 shadow-2xs">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">💡 التوجيه المنهجي:</span>
                      <p className="leading-relaxed font-medium">{planSummary}</p>
                    </div>
                  )}

                  {/* Interactive Chapter List */}
                  <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                    {eduCustomPlan.map((heading, idx) => {
                      const isIntro = idx === 0 || heading.includes("مقدمة");
                      const isConclusion = idx === eduCustomPlan.length - 1 || heading.includes("خاتمة");
                      const isRef = heading.includes("مراجع") || heading.includes("مصادر");
                      const tag = isIntro ? "مقدمة" : isConclusion ? "خاتمة" : isRef ? "مراجع" : `مبحث ${idx}`;

                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] transition-all hover:border-emerald-500/40 shadow-2xs group"
                        >
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono font-black text-[10px] flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                              {tag}
                            </span>
                          </div>

                          <input
                            type="text"
                            value={heading}
                            onChange={(e) => {
                              if (setEduCustomPlan) {
                                const updated = [...eduCustomPlan];
                                updated[idx] = e.target.value;
                                setEduCustomPlan(updated);
                              }
                            }}
                            className="flex-1 bg-transparent text-slate-800 dark:text-slate-200 outline-none focus:text-slate-950 dark:focus:text-white text-[11px] font-medium"
                          />

                          {/* Reorder Buttons */}
                          <div className="flex items-center gap-0.5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (setEduCustomPlan) {
                                    const updated = [...eduCustomPlan];
                                    const temp = updated[idx];
                                    updated[idx] = updated[idx - 1];
                                    updated[idx - 1] = temp;
                                    setEduCustomPlan(updated);
                                  }
                                }}
                                className="w-5 h-5 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 text-[10px] cursor-pointer"
                                title="تحريك لأعلى"
                              >
                                ▲
                              </button>
                            )}
                            {idx < eduCustomPlan.length - 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (setEduCustomPlan) {
                                    const updated = [...eduCustomPlan];
                                    const temp = updated[idx];
                                    updated[idx] = updated[idx + 1];
                                    updated[idx + 1] = temp;
                                    setEduCustomPlan(updated);
                                  }
                                }}
                                className="w-5 h-5 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 text-[10px] cursor-pointer"
                                title="تحريك لأسفل"
                              >
                                ▼
                              </button>
                            )}
                          </div>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (setEduCustomPlan && eduCustomPlan.length > 1) {
                                setEduCustomPlan(eduCustomPlan.filter((_, i) => i !== idx));
                              }
                            }}
                            className="text-slate-400 hover:text-rose-500 shrink-0 text-xs px-1 cursor-pointer transition-colors"
                            title="حذف هذا المحور"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (setEduCustomPlan) {
                          setEduCustomPlan([
                            ...eduCustomPlan,
                            `المبحث ${eduCustomPlan.length}: محور إضافي مخصص`,
                          ]);
                        }
                      }}
                      className="flex-1 py-1.5 text-[10.5px] border border-dashed border-emerald-500/40 text-emerald-700 dark:text-emerald-400 rounded-xl font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>+</span>
                      <span>إضافة محور جديد للخطة</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => generatePlanAsync && generatePlanAsync()}
                      disabled={isGeneratingPlan}
                      className="py-1.5 px-3 text-[10.5px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <span>🔄</span>
                      <span>إعادة التوليد</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 9. Style Level Selector (PRD Section 5.3) */}
          {eduMode === "RESEARCH" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                مستوى الأسلوب والصياغة (تكييف المستوى):
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "SIMPLE", label: "بسيط", desc: "جمل واضحة للتلاميذ" },
                  { id: "MODERATE", label: "متوسط", desc: "فقرات وأمثلة محلية" },
                  { id: "ADVANCED", label: "متقدم", desc: "تحليل ومصطلحات علمية" },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setEduStyleLevel && setEduStyleLevel(lvl.id as any)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      eduStyleLevel === lvl.id
                        ? "bg-emerald-600 border-emerald-500 text-white font-bold shadow-md shadow-emerald-950/20"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <div className="text-xs font-bold">{lvl.label}</div>
                    <div className="text-[9.5px] opacity-80 mt-0.5">{lvl.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 10. Cover Page Template Selector (PRD Section 5.2) */}
          {eduMode === "RESEARCH" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                قالب وتصميم صفحة الغلاف:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "OFFICIAL", label: "رسمي جزائري", desc: "شعار الجمهورية والوزارة" },
                  { id: "CLASSIC", label: "كلاسيكي أنيق", desc: "إطار أكاديمي هادئ" },
                  { id: "MODERN", label: "عصري ملوّن", desc: "تصميم حديث متباين" },
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setEduCoverTemplate && setEduCoverTemplate(tpl.id as any)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      eduCoverTemplate === tpl.id
                        ? "bg-emerald-600 border-emerald-500 text-white font-bold shadow-md shadow-emerald-950/20"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <div className="text-xs font-bold">{tpl.label}</div>
                    <div className="text-[9.5px] opacity-80 mt-0.5">{tpl.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 11. Feature Checkboxes & Options */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">خصائص ومكونات المستند:</span>

            {eduMode === "RESEARCH" ? (
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={eduIncludeCover}
                      onChange={(e) => setEduIncludeCover && setEduIncludeCover(e.target.checked)}
                      className="accent-emerald-500 rounded"
                    />
                    <span>واجهة بحث رسمية</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={eduIncludeOutline}
                      onChange={(e) => setEduIncludeOutline && setEduIncludeOutline(e.target.checked)}
                      className="accent-emerald-500 rounded"
                    />
                    <span>خطة البحث والفهرس</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={eduIncludeSources}
                      onChange={(e) => setEduIncludeSources && setEduIncludeSources(e.target.checked)}
                      className="accent-emerald-500 rounded"
                    />
                    <span>مراجع ديوان المطبوعات</span>
                  </label>
                </div>

                {/* Academic Integrity: Educational review questions */}
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={eduIncludeReviewQuestions}
                    onChange={(e) => setEduIncludeReviewQuestions && setEduIncludeReviewQuestions(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  <span>إدراج أسئلة مراجعة ومفردات الدرس (لتحفيز الفهم وتجنب الغش والاعتماد الأعمى)</span>
                </label>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={eduIncludeAnswerKey}
                    onChange={(e) => setEduIncludeAnswerKey && setEduIncludeAnswerKey(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  <span>سلم التنقيط والحل النموذجي</span>
                </label>

                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 transition-colors">
                  <span>الفصل:</span>
                  <select
                    value={eduTrimester}
                    onChange={(e) => setEduTrimester && setEduTrimester(Number(e.target.value) as 1 | 2 | 3)}
                    className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-900 dark:text-white text-xs outline-none"
                  >
                    <option value={1}>الفصل الأول</option>
                    <option value={2}>الفصل الثاني</option>
                    <option value={3}>الفصل الثالث</option>
                  </select>
                </div>
              </div>
            )}

            {/* Law 18-07 Privacy Notice */}
            <div className="flex items-center gap-2 p-2 bg-slate-200/60 dark:bg-slate-900/60 border border-slate-300/70 dark:border-slate-800/80 rounded-xl text-[10px] text-slate-600 dark:text-slate-400 transition-colors">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>حماية بيانات القاصرين: تُحذف الأسماء وبيانات التلاميذ آلياً بعد 72 ساعة امتثالاً للقانون 18-07.</span>
            </div>
          </div>
        </div>
      )}

      {/* Service-Specific Field: CV */}
      {service.code === "CV_GEN" && (
        <div className="space-y-3 pt-1">
          <div className="flex gap-2">
            {(["ar", "fr", "en"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  language === lang
                    ? "bg-emerald-600 border-emerald-500 text-white shadow-sm"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {lang === "ar" ? "العربية" : lang === "fr" ? "Français" : "English"}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">المسمى الوظيفي</label>
            <input
              type="text"
              value={cvJobTitle}
              onChange={(e) => setCvJobTitle(e.target.value)}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white text-xs transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              الخبرات المهنية / الملاحظات
            </label>
            <textarea
              rows={3}
              value={cvExperience}
              onChange={(e) => setCvExperience(e.target.value)}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white text-xs resize-none transition-colors"
            />
          </div>
        </div>
      )}

      {/* Service-Specific Field: ID Photo */}
      {service.code === "ID_PHOTO" && (
        <div className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              عدد الصور في الورقة A4 / A6
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIdPhotoCount(4)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  idPhotoCount === 4
                    ? "bg-emerald-600 border-emerald-500 text-white shadow-sm"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                4 صور هوية (35×45 مم)
              </button>
              <button
                type="button"
                onClick={() => setIdPhotoCount(8)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  idPhotoCount === 8
                    ? "bg-emerald-600 border-emerald-500 text-white shadow-sm"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                8 صور هوية (شبكة كاملة)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              لون الخلفية البيومترية الرسمية
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIdBgColor("gray")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  idBgColor === "gray"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-slate-900 text-emerald-800 dark:text-white shadow-sm"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-slate-400 inline-block border border-slate-300"></span>
                <span>رمادي فاتح (جواز وبطاقة هوية)</span>
              </button>
              <button
                type="button"
                onClick={() => setIdBgColor("white")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  idBgColor === "white"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-slate-900 text-emerald-800 dark:text-white shadow-sm"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-white inline-block border border-slate-300"></span>
                <span>أبيض ناصع (ملفات الفيزا)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service-Specific Field: Invoice */}
      {service.code === "INVOICE" && (
        <div className="space-y-3 pt-1">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">بنود الفاتورة التجارية</div>
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {invoiceItems.map((item, idx) => (
              <div
                key={idx}
                className="flex gap-2 items-center bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors"
              >
                <input
                  type="text"
                  value={item.desc}
                  onChange={(e) => {
                    const updated = [...invoiceItems];
                    updated[idx].desc = e.target.value;
                    setInvoiceItems(updated);
                  }}
                  className="flex-1 bg-transparent text-xs text-slate-900 dark:text-white outline-none"
                />
                <input
                  type="number"
                  min="1"
                  value={item.qty}
                  onChange={(e) => {
                    const updated = [...invoiceItems];
                    updated[idx].qty = parseInt(e.target.value) || 1;
                    setInvoiceItems(updated);
                  }}
                  className="w-12 bg-slate-100 dark:bg-slate-800 text-center text-xs text-slate-900 dark:text-white rounded py-1 border border-slate-200 dark:border-transparent"
                />
                <input
                  type="number"
                  min="0"
                  value={item.price}
                  onChange={(e) => {
                    const updated = [...invoiceItems];
                    updated[idx].price = parseInt(e.target.value) || 0;
                    setInvoiceItems(updated);
                  }}
                  className="w-16 bg-slate-100 dark:bg-slate-800 text-center text-xs text-slate-900 dark:text-white rounded py-1 border border-slate-200 dark:border-transparent"
                />
                <span className="text-[10px] text-slate-500 dark:text-slate-400">دج</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes or details */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
          {isSchoolService ? "تعليمات خاصة بالأستاذ أو التلميذ" : "ملاحظات أو متطلبات خاصة بالزبون"}
        </label>
        <textarea
          rows={2}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder={
            isSchoolService
              ? "أي عناصر إضافية يطلبها الأستاذ، أو ملاحظات تنسيق خاصة..."
              : "أي شروط خاصة أو بيانات إضافية..."
          }
          className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs resize-none transition-colors"
        />
      </div>
    </div>
  );
}
