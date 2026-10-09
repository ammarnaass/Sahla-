"use client";

import React, { useState, useEffect } from "react";
import type { ServiceDefinition } from "@/lib/constants";
import type { InvoiceItem } from "@/hooks/dashboard/useStudioState";
import {
  EducationLevel,
  DocumentMode,
  EDUCATION_DOC_KINDS,
  ALGERIAN_UNIVERSITIES,
  EDUCATION_LEVELS,
  ALGERIAN_GRADES,
  ALGERIAN_SUBJECTS,
  PRESET_TOPICS,
} from "@/lib/educationConstants";
import {
  SchoolCapIcon,
  SparklesIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  BoltIcon,
} from "@/components/ui/Icons";
import { ALGERIAN_WILAYAS_DIRECTORATES } from "@/server/education/curriculumCatalog";

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
  eduSubTab?: "BUILDER" | "LIBRARY" | "PRACTICE_EXAM";
  setEduSubTab?: (t: "BUILDER" | "LIBRARY" | "PRACTICE_EXAM") => void;
  eduDocKind?: "RESEARCH" | "THESIS" | "SUMMARY" | "PEDAGOGIC";
  setEduDocKind?: (k: "RESEARCH" | "THESIS" | "SUMMARY" | "PEDAGOGIC") => void;
  eduUniversity?: string;
  setEduUniversity?: (u: string) => void;
  eduFaculty?: string;
  setEduFaculty?: (f: string) => void;
  eduSpecialty?: string;
  setEduSpecialty?: (s: string) => void;
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
  planErrorNotice?: string | null;
  onDismissPlanError?: () => void;
  genErrorNotice?: string | null;
  onDismissGenError?: () => void;
  onSubmitFullDocument?: () => void;
  isProcessing?: boolean;
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
  eduDocKind = "RESEARCH",
  setEduDocKind,
  eduUniversity = "",
  setEduUniversity,
  eduFaculty = "",
  setEduFaculty,
  eduSpecialty = "",
  setEduSpecialty,
  eduMode = "RESEARCH",
  setEduMode,
  eduLevel = "MIDDLE",
  setEduLevel,
  eduGradeId = "4AM",
  setEduGradeId,
  eduSubjectId = "HISTORY_GEO",
  setEduSubjectId,
  eduTopic = "",
  setEduTopic,
  eduPageCount = 3,
  setEduPageCount,
  eduSchoolName = "",
  setEduSchoolName,
  eduTeacherName = "",
  setEduTeacherName,
  eduDirectorate = "",
  setEduDirectorate,
  eduTeacherRequirements = "",
  setEduTeacherRequirements,
  applyPresetTopic,
  getDynamicPricing,
  eduStyleLevel = "MODERATE",
  setEduStyleLevel,
  eduCoverTemplate = "OFFICIAL",
  setEduCoverTemplate,
  eduIncludeReviewQuestions = true,
  setEduIncludeReviewQuestions,
  isGeneratingPlan = false,
  generatePlanAsync,
  planSummary = "",
  planProviderUsed = "",
  planSuccessNotice = null,
  onDismissPlanNotice,
  planErrorNotice = null,
  onDismissPlanError,
  genErrorNotice = null,
  onDismissGenError,
  onSubmitFullDocument,
  isProcessing = false,
  eduCustomPlan = [],
  setEduCustomPlan,
  points = 50,
}: StudioDynamicFormProps) {
  const isSchoolService = service.code === "SCHOOL_RESEARCH";

  // Grades filtered by selected level
  const filteredGrades = ALGERIAN_GRADES.filter((g) => g.level === eduLevel);
  const currentGrade =
    filteredGrades.find((g) => g.id === eduGradeId) || filteredGrades[0];

  const availableSubjectIds = currentGrade?.defaultSubjects || [
    "ARABIC",
    "MATH",
    "PHYSICS",
    "SCIENCES",
    "HISTORY_GEO",
  ];

  // Presets filtered by mode & level
  const availablePresets = PRESET_TOPICS.filter(
    (p) => p.mode === eduMode && p.level === eduLevel
  );

  const pricing = getDynamicPricing
    ? getDynamicPricing(service.code)
    : { pointsCost: 15, defaultSaleDZD: 250 };

  // Real-time animated progress counters with percentage numbers
  const [planProgress, setPlanProgress] = useState(0);
  const [planStageText, setPlanStageText] = useState("");

  useEffect(() => {
    if (!isGeneratingPlan) {
      if (planProgress > 0) {
        setPlanProgress(100);
        setPlanStageText("اكتملت صياغة الخطة واعتماد المحاور بنجاح ⚡");
        const t = setTimeout(() => {
          setPlanProgress(0);
          setPlanStageText("");
        }, 800);
        return () => clearTimeout(t);
      }
      return;
    }

    setPlanProgress(15);
    setPlanStageText("تحليل الموضوع ومطابقته مع المنهاج الجزائري...");

    const interval = setInterval(() => {
      setPlanProgress((prev) => {
        if (prev < 38) {
          setPlanStageText("طرح الإشكالية وضبط أهداف التعلم المعتمدة...");
          return prev + 6;
        }
        if (prev < 68) {
          setPlanStageText(`تكييف وتوزيع الفصول والمحاور لـ (${eduPageCount} صفحات)...`);
          return prev + 5;
        }
        if (prev < 88) {
          setPlanStageText("تدقيق محاور الخطة وتوثيق المراجع الرسمية (ONPS / OPU)...");
          return prev + 3;
        }
        if (prev < 95) {
          setPlanStageText("اللمسات الأخيرة واعتماد بطاقة خطة البحث...");
          return prev + 1;
        }
        return prev;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [isGeneratingPlan, eduPageCount]);

  const [docProgress, setDocProgress] = useState(0);
  const [docStageText, setDocStageText] = useState("");

  useEffect(() => {
    if (!isProcessing) {
      if (docProgress > 0) {
        setDocProgress(100);
        setDocStageText("تم توليد وحفظ المستند كاملاً بنجاح ⚡");
        const t = setTimeout(() => {
          setDocProgress(0);
          setDocStageText("");
        }, 900);
        return () => clearTimeout(t);
      }
      return;
    }

    setDocProgress(12);
    setDocStageText("بناء الغلاف الرسمي الجزائري وترتيب محاور الخطة...");

    const interval = setInterval(() => {
      setDocProgress((prev) => {
        if (prev < 28) {
          setDocStageText("صياغة المقدمة وطرح الإشكالية وفق المنهاج الوطني...");
          return prev + 4;
        }
        if (prev < 52) {
          setDocStageText("كتابة وتحرير المباحث التفصيلية والشواهد بالذكاء الاصطناعي...");
          return prev + 4;
        }
        if (prev < 74) {
          setDocStageText("تحليل المعطيات وتدعيم الأفكار بالأمثلة الجزائرية الموثقة...");
          return prev + 3;
        }
        if (prev < 88) {
          setDocStageText("صياغة الخاتمة وتوثيق قائمة المراجع الرسمية (ONPS / OPU)...");
          return prev + 2;
        }
        if (prev < 96) {
          setDocStageText(
            eduIncludeReviewQuestions
              ? "إدراج أسئلة مراجعة وتثبيت الفهم وفحص النزاهة الأكاديمية..."
              : "مراجعة المطابقة الأكاديمية وضبط تنسيق الصفحات A4..."
          );
          return prev + 1;
        }
        return prev;
      });
    }, 350);

    return () => clearInterval(interval);
  }, [isProcessing, eduIncludeReviewQuestions]);

  return (
    <div className="space-y-4">
      {/* ======================================================== */}
      {/* 💼 GENERAL SERVICES (CV, ID Photo, Invoices, General)   */}
      {/* ======================================================== */}
      {!isSchoolService && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                اسم الزبون الكامل *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="مثال: محمد بن عيسى"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
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
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-emerald-500 text-right font-mono transition-colors"
              />
            </div>
          </div>

          {/* Service: CV */}
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
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {lang === "ar" ? "العربية" : lang === "fr" ? "Français" : "English"}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  المسمى الوظيفي
                </label>
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

          {/* Service: ID Photo */}
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
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
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
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
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
                        ? "border-emerald-500 bg-emerald-50 dark:bg-slate-900 text-emerald-800 dark:text-white"
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
                        ? "border-emerald-500 bg-emerald-50 dark:bg-slate-900 text-emerald-800 dark:text-white"
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

          {/* Service: Invoice */}
          {service.code === "INVOICE" && (
            <div className="space-y-3 pt-1">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">بنود الفاتورة التجارية</div>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {invoiceItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-2 items-center bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800"
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
                      className="w-12 bg-slate-100 dark:bg-slate-800 text-center text-xs text-slate-900 dark:text-white rounded py-1"
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
                      className="w-16 bg-slate-100 dark:bg-slate-800 text-center text-xs text-slate-900 dark:text-white rounded py-1"
                    />
                    <span className="text-[10px] text-slate-500">دج</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes for general services */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              ملاحظات أو شروط خاصة بالزبون
            </label>
            <textarea
              rows={2}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="أي شروط خاصة أو بيانات إضافية..."
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white text-xs resize-none"
            />
          </div>
        </>
      )}

      {/* ======================================================== */}
      {/* 🎓 SCHOOL RESEARCH & THESIS STUDIO: HIGH-END WORKFLOW   */}
      {/* ======================================================== */}
      {isSchoolService && (
        <div className="space-y-4 pt-1">
          {/* ========================================================= */}
          {/* الخطوة 1: نوع الوثيقة والطور الأكاديمي                    */}
          {/* ========================================================= */}
          <div className="bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/90 shadow-2xs space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <span>نوع الوثيقة الأكاديمية:</span>
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                  {eduDocKind === "THESIS"
                    ? "مذكرة تخرج جامعية / تقني سامي"
                    : eduDocKind === "PEDAGOGIC"
                    ? "مذكرة بيداغوجية للأستاذ"
                    : eduDocKind === "SUMMARY"
                    ? "ملخص ومراجعة درس"
                    : "بحث مدرسي رسمي"}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {EDUCATION_DOC_KINDS.map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => {
                      if (setEduDocKind) setEduDocKind(k.id);
                      if (k.id === "THESIS") {
                        if (setEduLevel) setEduLevel("UNIVERSITY");
                        if (setEduGradeId) setEduGradeId("UNIV_M");
                        if (setEduCoverTemplate) setEduCoverTemplate("OFFICIAL");
                        if (!eduUniversity && setEduUniversity) {
                          setEduUniversity("جامعة هواري بومدين للعلوم والتكنولوجيا (USTHB) - باب الزوار");
                        }
                      } else if (eduLevel === "UNIVERSITY") {
                        if (setEduLevel) setEduLevel("MIDDLE");
                        if (setEduGradeId) setEduGradeId("4AM");
                      }
                    }}
                    className={`p-2.5 rounded-xl text-right transition-all border cursor-pointer ${
                      eduDocKind === k.id
                        ? "bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-950/20"
                        : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500/40"
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      <span>{k.icon}</span>
                      <span className="truncate">{k.nameAr}</span>
                    </div>
                    <div
                      className={`text-[9.5px] mt-1 truncate ${
                        eduDocKind === k.id ? "text-emerald-100" : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {k.badge}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Level & Specialty / Subject selection */}
            {eduDocKind === "THESIS" ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الجامعة أو المركز الجامعي:
                  </label>
                  <select
                    value={eduUniversity}
                    onChange={(e) => setEduUniversity && setEduUniversity(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">-- اختر الجامعة المعتمدة --</option>
                    {ALGERIAN_UNIVERSITIES.map((uni) => (
                      <option key={uni} value={uni}>
                        {uni}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الكلية أو المعهد:
                  </label>
                  <input
                    type="text"
                    value={eduFaculty}
                    onChange={(e) => setEduFaculty && setEduFaculty(e.target.value)}
                    placeholder="مثال: كلية العلوم الاقتصادية"
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    القسم والتخصص العلمي:
                  </label>
                  <input
                    type="text"
                    value={eduSpecialty}
                    onChange={(e) => setEduSpecialty && setEduSpecialty(e.target.value)}
                    placeholder="مثال: إدارة أعمال / إعلام آلي"
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الطور التعليمي:
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {EDUCATION_LEVELS.filter((l) => l.id !== "UNIVERSITY").map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => {
                          if (setEduLevel) setEduLevel(lvl.id);
                          const matching = ALGERIAN_GRADES.find((g) => g.level === lvl.id);
                          if (matching && setEduGradeId) setEduGradeId(matching.id);
                        }}
                        className={`py-1.5 px-2 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer ${
                          eduLevel === lvl.id
                            ? "bg-emerald-600 border-emerald-500 text-white shadow-xs"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-500/30"
                        }`}
                      >
                        {lvl.nameAr}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    السنة الدراسية / الشعبة:
                  </label>
                  <select
                    value={eduGradeId}
                    onChange={(e) => setEduGradeId && setEduGradeId(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    {filteredGrades.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.nameAr} ({g.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    المادة الدراسية المقررة:
                  </label>
                  <select
                    value={eduSubjectId}
                    onChange={(e) => {
                      const sId = e.target.value;
                      if (setEduSubjectId) setEduSubjectId(sId);
                      const sub = ALGERIAN_SUBJECTS[sId];
                      if (sub && setLanguage) setLanguage(sub.defaultLang);
                    }}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    {availableSubjectIds.map((sId) => {
                      const sub = ALGERIAN_SUBJECTS[sId];
                      return sub ? (
                        <option key={sId} value={sId}>
                          {sub.nameAr}
                        </option>
                      ) : null;
                    })}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* الخطوة 2 (المحور الأساسي): موضوع البحث وخطة العمل الذكية    */}
          {/* ========================================================= */}
          <div className="bg-gradient-to-b from-emerald-500/10 via-white to-white dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 p-4 sm:p-5 rounded-2xl border-2 border-emerald-500/40 dark:border-emerald-500/30 shadow-md space-y-3.5">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                  2
                </span>
                <SparklesIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>موضوع البحث وخطة العمل بالذكاء الاصطناعي:</span>
              </span>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-2xs">
                ⚡ توليد ومراجعة مجانية للخطة
              </span>
            </div>

            {/* Topic Input with AI Button Integrated */}
            <div className="space-y-2.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  {eduDocKind === "THESIS"
                    ? "عنوان مذكرة التخرج أو الأطروحة الجامعية *"
                    : eduDocKind === "SUMMARY"
                    ? "عنوان ملخص الدرس أو الوحدة *"
                    : eduDocKind === "PEDAGOGIC"
                    ? "عنوان المذكرة البيداغوجية / درس الأستاذ *"
                    : "عنوان وموضوع البحث المدرسي *"}
                </label>
                <input
                  type="text"
                  required
                  value={eduTopic}
                  onChange={(e) => {
                    if (setEduTopic) setEduTopic(e.target.value);
                    if (onDismissPlanError) onDismissPlanError();
                  }}
                  placeholder={
                    eduDocKind === "THESIS"
                      ? "مثال: أثر الرقمنة والشمول المالي على أداء المؤسسات المصرفية في الجزائر"
                      : eduDocKind === "SUMMARY"
                      ? "مثال: ملخص شامل لقواعد اللغة والتحليل الأدبي للثلاثي الأول"
                      : eduDocKind === "PEDAGOGIC"
                      ? "مثال: مذكرة نموذجية لتحضير درس الطاقة الحركية وتطبيقاتها"
                      : "مثال: المقاومة الشعبية الجزائرية ومحطات الثورة التحريرية 1954-1962"
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm font-bold focus:outline-none focus:border-emerald-500 shadow-2xs transition-all"
                />
              </div>

              {/* مواصفات المستند والخطة (حجم الصفحات، الصياغة، الغلاف، اللغة) */}
              <div className="p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-emerald-500/20 space-y-3">
                {/* حجم المستند وعدد الصفحات */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>حجم المستند وعدد الصفحات:</span>
                    </label>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 font-mono">
                      {pricing.pointsCost} نقطة · سعر البيع: {pricing.defaultSaleDZD} دج
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {([1, 2, 3, 5, 10] as const).map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => {
                          if (setEduPageCount) setEduPageCount(num);
                        }}
                        className={`py-2 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer ${
                          eduPageCount === num
                            ? "bg-emerald-600 border-emerald-500 text-white shadow-xs font-black"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500/40"
                        }`}
                      >
                        <span>
                          {num} {num === 1 ? "صفحة" : num === 2 ? "صفحتين" : "صفحات"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* مستوى الصياغة + قالب الغلاف + لغة المستند والطباعة */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* مستوى الصياغة */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      مستوى الصياغة:
                    </label>
                    <select
                      value={eduStyleLevel}
                      onChange={(e) => setEduStyleLevel && setEduStyleLevel(e.target.value as any)}
                      className="w-full px-2.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      <option value="SIMPLE">بسيط (جمل واضحة للتلاميذ)</option>
                      <option value="MODERATE">متوسط (غني بالأمثلة والشواهد)</option>
                      <option value="ADVANCED">متقدم (تحليلي ومصطلحات تخصصية)</option>
                    </select>
                  </div>

                  {/* قالب الغلاف */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      قالب صفحة الغلاف:
                    </label>
                    <select
                      value={eduCoverTemplate}
                      onChange={(e) => setEduCoverTemplate && setEduCoverTemplate(e.target.value as any)}
                      className="w-full px-2.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      <option value="OFFICIAL">🇩🇿 رسمي جزائري (شعار الجمهورية)</option>
                      <option value="CLASSIC">كلاسيكي أنيق (إطار أكاديمي)</option>
                      <option value="MODERN">عصري ملوّن (تصميم حديث)</option>
                    </select>
                  </div>

                  {/* لغة المستند والطباعة */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      لغة المستند والطباعة:
                    </label>
                    <div className="flex gap-1">
                      {(["ar", "fr", "en"] as const).map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setLanguage(l)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                            language === l
                              ? "bg-emerald-600 border-emerald-500 text-white font-black"
                              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          {l === "ar" ? "عربي" : l === "fr" ? "Fr" : "En"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Optional Teacher Requirements */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center justify-between">
                    <span>توجيهات أو عناصر خاصة من الأستاذ المشرف (اختياري):</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      يلتزم الذكاء الاصطناعي بإدراجها في الخطة والمتن
                    </span>
                  </label>
                  <input
                    type="text"
                    value={eduTeacherRequirements}
                    onChange={(e) => setEduTeacherRequirements && setEduTeacherRequirements(e.target.value)}
                    placeholder="مثال: التركيز على بيان أول نوفمبر، إدراج دور الحركة الوطنية، استخدام مراجع رسمية..."
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-800 dark:text-slate-200 text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Action Bar: Generate AI Plan + Quick Preset dropdown */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                {isGeneratingPlan ? (
                  <div className="flex-1 p-3 bg-slate-900 border border-emerald-500/60 rounded-xl shadow-lg space-y-2 animate-fade-in text-right">
                    <div className="flex items-center justify-between text-xs font-black">
                      <div className="flex items-center gap-2 text-emerald-400 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                        <span className="truncate">{planStageText || `جاري صياغة الخطة بالذكاء الاصطناعي (${eduPageCount} صفحات)...`}</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono text-emerald-300 font-black text-sm shrink-0 bg-slate-800 px-2 py-0.5 rounded border border-emerald-500/30">
                        <span>{Math.min(100, Math.round(planProgress))}</span>
                        <span className="text-[10px] text-emerald-400">%</span>
                      </div>
                    </div>
                    {/* Progress Bar Track & Fill */}
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-300 rounded-full transition-all duration-300 shadow-sm shadow-emerald-400/50"
                        style={{ width: `${Math.min(100, Math.max(8, planProgress))}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => generatePlanAsync && generatePlanAsync()}
                    className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-950/20 active:scale-98"
                  >
                    <SparklesIcon className="w-4 h-4 text-emerald-200" />
                    <span>
                      ✨ اضغط هنا لتوليد الخطة بالذكاء الاصطناعي ({eduPageCount} {eduPageCount === 1 ? "صفحة" : eduPageCount === 2 ? "صفحتين" : "صفحات"} · {language === "ar" ? "عربي" : language === "fr" ? "Français" : "English"})
                    </span>
                  </button>
                )}

                {availablePresets.length > 0 && (
                  <select
                    onChange={(e) => {
                      if (e.target.value && applyPresetTopic) {
                        applyPresetTopic(e.target.value);
                      }
                    }}
                    className="sm:w-64 px-3 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-emerald-500 transition-colors font-medium cursor-pointer"
                  >
                    <option value="">💡 مواضيع جزائرية نموذجية جاهزة...</option>
                    {availablePresets.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Error Notification Alert (Inline, No Browser Alert!) */}
            {planErrorNotice && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center justify-between animate-fade-in shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 text-base">⚠️</span>
                  <span>{planErrorNotice}</span>
                </div>
                {onDismissPlanError && (
                  <button
                    type="button"
                    onClick={onDismissPlanError}
                    className="text-amber-700 dark:text-amber-400 hover:underline text-xs cursor-pointer px-1"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}

            {/* Success Notification Alert */}
            {planSuccessNotice && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between animate-fade-in shadow-2xs">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{planSuccessNotice}</span>
                </div>
                {onDismissPlanNotice && (
                  <button
                    type="button"
                    onClick={onDismissPlanNotice}
                    className="text-emerald-700 dark:text-emerald-400 hover:underline text-xs cursor-pointer px-1"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}

            {/* ===================================================== */}
            {/* Outline Editor: Shows generated plan or invite card   */}
            {/* ===================================================== */}
            {eduCustomPlan.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/10 text-center space-y-2">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  لم يتم إنشاء خطة وفهرس لهذا البحث بعد.
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  اكتب عنوان البحث أعلاه واضغط على زر «✨ اضغط هنا لتوليد الخطة بالذكاء الاصطناعي» للحصول على هيكل وفهرس أكاديمي فوري مجاناً.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-emerald-500/30 bg-white dark:bg-slate-900 p-3.5 space-y-3 shadow-2xs">
                {/* Header of outline */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      محاور خطة البحث المعتمدة
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                      {eduCustomPlan.length} محاور · مصممة لـ {eduPageCount} {eduPageCount === 1 ? "صفحة" : eduPageCount === 2 ? "صفحتين" : "صفحات"}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    ⚡ {planProviderUsed || "الذكاء الاصطناعي"}
                  </span>
                </div>

                {/* Plan Summary */}
                {planSummary && (
                  <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">💡 ملخص منهجي:</span>
                    <p className="font-medium leading-relaxed">{planSummary}</p>
                  </div>
                )}

                {/* Chapter List */}
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {eduCustomPlan.map((heading, idx) => {
                    const isIntro = idx === 0 || heading.includes("مقدمة");
                    const isConclusion = idx === eduCustomPlan.length - 1 || heading.includes("خاتمة");
                    const isRef = heading.includes("مراجع") || heading.includes("مصادر");
                    const tag = isIntro ? "مقدمة" : isConclusion ? "خاتمة" : isRef ? "مراجع" : `مبحث ${idx}`;

                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 text-[11px] transition-all hover:border-emerald-500/40 group"
                      >
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono font-black text-[10px] flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold">
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
                              className="w-5 h-5 flex items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 text-[10px] cursor-pointer"
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
                              className="w-5 h-5 flex items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 text-[10px] cursor-pointer"
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

                {/* Chapter Controls (+ Add Chapter / Reload) */}
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
                    className="flex-1 py-1.5 text-[11px] border border-dashed border-emerald-500/40 text-emerald-700 dark:text-emerald-400 rounded-xl font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>+</span>
                    <span>إضافة محور جديد للخطة</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => generatePlanAsync && generatePlanAsync()}
                    disabled={isGeneratingPlan}
                    className="py-1.5 px-3 text-[11px] bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-200 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-emerald-400/30 shadow-2xs"
                  >
                    <span>🔄</span>
                    <span>إعادة تكييف الخطة مع ({eduPageCount} صفحات)</span>
                  </button>
                </div>

                {/* Plan to Document Generation Action Strip */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
                    <CheckCircleIcon size={14} className="shrink-0" />
                    <span>تم توزيع محاور الخطة ({eduCustomPlan.length}) على صفحات المستند ({eduPageCount})</span>
                  </div>
                  {onSubmitFullDocument && (
                    isProcessing ? (
                      <div className="py-2 px-3.5 bg-slate-900 border border-emerald-500/60 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2 shrink-0 animate-fade-in shadow-xs">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                        <span>جاري صياغة المتن...</span>
                        <span className="font-mono text-emerald-300 font-black text-xs bg-slate-800 px-2 py-0.5 rounded border border-emerald-500/30">
                          {Math.min(100, Math.round(docProgress))}%
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={onSubmitFullDocument}
                        className="py-1.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
                      >
                        <span>🚀</span>
                        <span>توليد وحفظ المستند كاملاً ({pricing.pointsCost} ن · {pricing.defaultSaleDZD} دج)</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* الخطوة 3: بيانات الغلاف وإعدادات الطباعة والتصدير          */}
          {/* ========================================================= */}
          <div className="bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/90 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-lg bg-slate-700 text-white font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <span>بيانات الغلاف والطباعة والتصدير:</span>
              </span>
            </div>

            {/* Student & Supervisor Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {eduDocKind === "THESIS" ? "اسم الطالب(ة) الباحث *" : "اسم التلميذ / الطالب *"}
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={
                    eduDocKind === "THESIS"
                      ? "مثال: اسم الطالب الباحث / فريق البحث"
                      : "مثال: اسم التلميذ(ة)"
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {eduDocKind === "THESIS" ? "الأستاذ المؤطر المشرف:" : "الأستاذ المشرف:"}
                </label>
                <input
                  type="text"
                  value={eduTeacherName}
                  onChange={(e) => setEduTeacherName && setEduTeacherName(e.target.value)}
                  placeholder="مثال: أ.د. الأستاذ المشرف"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* School / Directorate (if not Thesis) */}
            {eduDocKind !== "THESIS" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    اسم المؤسسة التعليمية (الثانوية / المتوسطة):
                  </label>
                  <input
                    type="text"
                    value={eduSchoolName}
                    onChange={(e) => setEduSchoolName && setEduSchoolName(e.target.value)}
                    placeholder="مثال: ثانوية حسيبة بن بوعلي / متوسطة الأمير عبد القادر"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    مديرية التربية لولاية:
                  </label>
                  <select
                    value={eduDirectorate}
                    onChange={(e) => setEduDirectorate && setEduDirectorate(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    {ALGERIAN_WILAYAS_DIRECTORATES.slice(0, 58).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Document Size & Pages */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  حجم المستند وعدد الصفحات:
                </label>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  {pricing.pointsCost} نقطة · سعر البيع: {pricing.defaultSaleDZD} دج
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {([1, 2, 3, 5, 10] as const).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setEduPageCount && setEduPageCount(num)}
                    className={`py-2 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer ${
                      eduPageCount === num
                        ? "bg-emerald-600 border-emerald-500 text-white shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500/30"
                    }`}
                  >
                    <span>
                      {num} {num === 1 ? "صفحة" : num === 2 ? "صفحتين" : "صفحات"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Style Level + Cover Template + Language */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Style level */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  مستوى الصياغة:
                </label>
                <select
                  value={eduStyleLevel}
                  onChange={(e) => setEduStyleLevel && setEduStyleLevel(e.target.value as any)}
                  className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="SIMPLE">بسيط (جمل واضحة للتلاميذ)</option>
                  <option value="MODERATE">متوسط (غني بالأمثلة والشواهد)</option>
                  <option value="ADVANCED">متقدم (تحليلي ومصطلحات تخصصية)</option>
                </select>
              </div>

              {/* Cover Template */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  قالب صفحة الغلاف:
                </label>
                <select
                  value={eduCoverTemplate}
                  onChange={(e) => setEduCoverTemplate && setEduCoverTemplate(e.target.value as any)}
                  className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="OFFICIAL">🇩🇿 رسمي جزائري (شعار الجمهورية)</option>
                  <option value="CLASSIC">كلاسيكي أنيق (إطار أكاديمي)</option>
                  <option value="MODERN">عصري ملوّن (تصميم حديث)</option>
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  لغة المستند والطباعة:
                </label>
                <div className="flex gap-1">
                  {(["ar", "fr", "en"] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLanguage(l)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        language === l
                          ? "bg-emerald-600 border-emerald-500 text-white"
                          : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {l === "ar" ? "عربي" : l === "fr" ? "Fr" : "En"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Educational Review Questions Toggle */}
            <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={eduIncludeReviewQuestions}
                onChange={(e) =>
                  setEduIncludeReviewQuestions && setEduIncludeReviewQuestions(e.target.checked)
                }
                className="accent-emerald-500 rounded"
              />
              <span>إدراج أسئلة مراجعة وتثبيت الفهم في نهاية البحث (لتجنب الغش وتحفيز الاستيعاب)</span>
            </label>
          </div>

          {/* Error Notification Alert for Generation (Inline, No Browser Alert!) */}
          {genErrorNotice && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center justify-between animate-fade-in shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="text-rose-500 text-base">❌</span>
                <span>{genErrorNotice}</span>
              </div>
              {onDismissGenError && (
                <button
                  type="button"
                  onClick={onDismissGenError}
                  className="text-rose-700 dark:text-rose-400 hover:underline text-xs cursor-pointer px-1"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* Primary Action Button or High-Tech Progress Bar at Bottom of Form */}
          {onSubmitFullDocument && (
            isProcessing ? (
              <div className="w-full p-4 bg-slate-900 border-2 border-emerald-500/70 rounded-2xl shadow-xl shadow-emerald-950/40 space-y-3 animate-fade-in text-right">
                <div className="flex items-center justify-between text-xs sm:text-sm font-black">
                  <div className="flex items-center gap-2 text-emerald-400 min-w-0">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping shrink-0" />
                    <span className="truncate">{docStageText || "جاري توليد وصياغة متن البحث بالذكاء الاصطناعي..."}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 font-mono text-emerald-300 font-black text-base sm:text-lg bg-slate-800/80 px-2.5 py-0.5 rounded-lg border border-emerald-500/30 shadow-inner">
                    <span>{Math.min(100, Math.round(docProgress))}</span>
                    <span className="text-xs text-emerald-400">%</span>
                  </div>
                </div>

                {/* Progress Bar Track & Fill with Glowing Gradient */}
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/80">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-300 rounded-full transition-all duration-300 shadow-md shadow-emerald-400/60"
                    style={{ width: `${Math.min(100, Math.max(6, docProgress))}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10.5px] text-slate-400 font-medium pt-0.5">
                  <span className="truncate">الموضوع: {eduTopic || "مستند تعليمي"} · ({eduPageCount} صفحات)</span>
                  <span className="font-mono text-emerald-400/90 shrink-0 font-bold">A4 · 300 DPI · معتمد وطنياً</span>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={onSubmitFullDocument}
                className="w-full py-3.5 px-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-emerald-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-99"
              >
                <BoltIcon className="w-5 h-5 text-emerald-200" />
                <span>
                  🚀 توليد وحفظ المستند كاملاً بالذكاء الاصطناعي ({pricing.pointsCost} ن · {pricing.defaultSaleDZD} دج)
                </span>
              </button>
            )
          )}

          {/* Subtle Footnote */}
          <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>مطابق لمعايير وزارة التربية الوطنية والتعليم العالي والبحث العلمي (الجزائر).</span>
          </div>
        </div>
      )}
    </div>
  );
}
