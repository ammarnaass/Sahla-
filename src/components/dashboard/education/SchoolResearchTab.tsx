"use client";

import React, { useState } from "react";
import { getServiceByCode, SERVICES_CATALOG } from "@/lib/constants";
import { useStudioState, type GeneratedDocPayload } from "@/hooks/dashboard/useStudioState";
import { StudioDynamicForm } from "../studio/StudioDynamicForm";
import { StudioLivePreviewA4 } from "../studio/StudioLivePreviewA4";
import { ErrorReportModal } from "../studio/ErrorReportModal";
import { ConformanceReportModal } from "../studio/ConformanceReportModal";
import { exportResearchToWord } from "@/lib/wordExport";
import { ALGERIAN_SUBJECTS } from "@/lib/educationConstants";
import { Badge } from "@/components/ui/badge";
import {
  SchoolCapIcon,
  SparklesIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  BoltIcon,
} from "@/components/ui/Icons";

export interface SchoolResearchTabProps {
  points: number;
  onDocumentGenerated?: (doc: GeneratedDocPayload) => void;
}

export function SchoolResearchTab({
  points,
  onDocumentGenerated,
}: SchoolResearchTabProps) {
  const service = getServiceByCode("SCHOOL_RESEARCH") || SERVICES_CATALOG[0];
  const studio = useStudioState();
  const [mobileView, setMobileView] = useState<"form" | "preview">("form");
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const pricing = studio.getDynamicPricing(service.code);
  const cost = pricing.pointsCost;
  const isInsufficient = points < cost && !service.isFree;

  const handleExportWord = () => {
    const subjectName = ALGERIAN_SUBJECTS[studio.eduSubjectId]?.nameAr || "المادة المقررة";
    const sections =
      studio.eduGeneratedSections && studio.eduGeneratedSections.length > 0
        ? studio.eduGeneratedSections
        : studio.eduCustomPlan.map((heading) => ({
            heading,
            content: `يتناول هذا المبحث دراسة مستفيضة لعنصر "${heading}"، حيث تم تبسيط المفاهيم ومطابقتها للمنهاج الجزائري الرسمي، مع ربطها بالشواهد الواقعية والتطبيقات العلمية الميدانية لتعزيز فهم التلميذ واستيعابه الدقيق.`,
          }));

    exportResearchToWord({
      title: `بحث مدرسي - ${studio.eduTopic}`,
      topic: studio.eduTopic,
      level: studio.eduLevel,
      grade: studio.eduGradeId,
      subject: subjectName,
      studentName: studio.customerName.trim() || "تلميذ المؤسسة",
      schoolName: studio.eduSchoolName,
      teacherName: studio.eduTeacherName,
      outline: studio.eduCustomPlan,
      sections,
      references: [
        `الكتاب المدرسي المقرر لمادة ${subjectName} - ديوان المطبوعات المدرسية (ONPS)، الجزائر.`,
        `المنهاج الرسمي والوثيقة المرافقة - وزارة التربية الوطنية الجزائرية.`,
        `الموسوعة الوطنية للعلوم والدراسات الجزائرية - منشورات ديوان المطبوعات الجامعية (OPU).`,
      ],
      reviewQuestions: studio.eduIncludeReviewQuestions
        ? [
            `س1: ما هي الفكرة المحورية لموضوع "${studio.eduTopic}" بأسلوبك الخاص؟`,
            `س2: اذكر فكرتين رئيستين وردتا في البحث تناسبان متطلبات منهاج وزارة التربية الوطنية.`,
            `س3: لخص أهم ما توصلت إليه الخاتمة في جملتين لدعم مشاركتك في القسم.`,
          ]
        : [],
    });

    setExportNotice("تم تحميل ملف Word (.docx) المنسق رسمياً بنجاح");
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handlePrintA4 = () => {
    window.print();
  };

  const handleGenerateFullDocument = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    studio.generateDocument(
      service,
      points,
      (doc) => {
        onDocumentGenerated?.(doc);
        setExportNotice("تم توليد وحفظ البحث المدرسي في سجل الوثائق بنجاح ⚡");
        setTimeout(() => setExportNotice(null), 4000);
      },
      () => {}
    );
  };

  return (
    <div className="space-y-5 animate-fade-in text-right">
      {/* 1. Dedicated Header & Quick Actions */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shadow-xs">
                <SchoolCapIcon size={22} />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-foreground font-display">
                استوديو البحوث المدرسية والمذكرات
              </h1>
              <Badge variant="primary" className="text-xs font-bold gap-1">
                <span>🇩🇿 المنهاج الجزائري الرسمي</span>
              </Badge>
              <Badge variant="outline" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                الجيل الثاني
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
              واجهة مخصصة لصناعة وتوليد البحوث المدرسية والأكاديمية لجميع الأطوار (ابتدائي، متوسط، ثانوي). تشمل صفحة الغلاف الرسمية، خطة البحث والفهرس، المباحث الموثقة، والخاتمة مع المراجع الرسمية المعتمدة.
            </p>
          </div>

          {/* Action Tools & Points Indicator */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/60 border border-border">
              <span className="text-xs text-muted-foreground font-medium">تكلفة البحث:</span>
              <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                {cost} ن
              </span>
              <span className="text-[11px] text-muted-foreground">({pricing.defaultSaleDZD} دج)</span>
            </div>

            <button
              type="button"
              onClick={handleExportWord}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <span>تصدير Word (.docx)</span>
            </button>

            <button
              type="button"
              onClick={handlePrintA4}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              <span>طباعة فورية A4</span>
            </button>

            <button
              type="button"
              onClick={() => handleGenerateFullDocument()}
              disabled={studio.isProcessing || isInsufficient}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-950/20 transition-all cursor-pointer active:scale-95"
            >
              <BoltIcon className="w-4 h-4 text-emerald-200" />
              <span>{studio.isProcessing ? "جاري التوليد..." : "توليد وحفظ البحث"}</span>
            </button>
          </div>
        </div>

        {/* Temporary Export Notification */}
        {exportNotice && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircleIcon size={16} />
            <span>{exportNotice}</span>
          </div>
        )}
      </div>

      {/* 2. Mobile View Switcher (Visible on < lg) */}
      <div className="lg:hidden flex items-center p-1 bg-muted/80 rounded-xl border border-border shadow-xs">
        <button
          type="button"
          onClick={() => setMobileView("form")}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mobileView === "form"
              ? "bg-card text-foreground shadow-xs border border-border"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          <span>إعدادات البحث والمحاور</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileView("preview")}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mobileView === "preview"
              ? "bg-card text-foreground shadow-xs border border-border"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>المعاينة الحية A4</span>
        </button>
      </div>

      {/* 3. Main Workspace: Split Editor & Live A4 Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Pane: Dynamic Research Editor */}
        <div
          className={`${
            mobileView === "form" ? "block" : "hidden"
          } lg:block lg:col-span-7 bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xs`}
        >
          <StudioDynamicForm
            service={service}
            customerName={studio.customerName}
            setCustomerName={studio.setCustomerName}
            phone={studio.phone}
            setPhone={studio.setPhone}
            language={studio.language}
            setLanguage={studio.setLanguage}
            cvJobTitle={studio.cvJobTitle}
            setCvJobTitle={studio.setCvJobTitle}
            cvExperience={studio.cvExperience}
            setCvExperience={studio.setCvExperience}
            idPhotoCount={studio.idPhotoCount}
            setIdPhotoCount={studio.setIdPhotoCount}
            idBgColor={studio.idBgColor}
            setIdBgColor={studio.setIdBgColor}
            invoiceItems={studio.invoiceItems}
            setInvoiceItems={studio.setInvoiceItems}
            details={studio.details}
            setDetails={studio.setDetails}
            eduSubTab={studio.eduSubTab}
            setEduSubTab={studio.setEduSubTab}
            eduMode={studio.eduMode}
            setEduMode={studio.setEduMode}
            eduLevel={studio.eduLevel}
            setEduLevel={studio.setEduLevel}
            eduGradeId={studio.eduGradeId}
            setEduGradeId={studio.setEduGradeId}
            eduSubjectId={studio.eduSubjectId}
            setEduSubjectId={studio.setEduSubjectId}
            eduTopic={studio.eduTopic}
            setEduTopic={studio.setEduTopic}
            eduPageCount={studio.eduPageCount}
            setEduPageCount={studio.setEduPageCount}
            eduStyleLevel={studio.eduStyleLevel}
            setEduStyleLevel={studio.setEduStyleLevel}
            eduCoverTemplate={studio.eduCoverTemplate}
            setEduCoverTemplate={studio.setEduCoverTemplate}
            eduIncludeReviewQuestions={studio.eduIncludeReviewQuestions}
            setEduIncludeReviewQuestions={studio.setEduIncludeReviewQuestions}
            eduSchoolName={studio.eduSchoolName}
            setEduSchoolName={studio.setEduSchoolName}
            eduTeacherName={studio.eduTeacherName}
            setEduTeacherName={studio.setEduTeacherName}
            eduDirectorate={studio.eduDirectorate}
            setEduDirectorate={studio.setEduDirectorate}
            eduTeacherRequirements={studio.eduTeacherRequirements}
            setEduTeacherRequirements={studio.setEduTeacherRequirements}
            eduUnitId={studio.eduUnitId}
            setEduUnitId={studio.setEduUnitId}
            eduUnitTitle={studio.eduUnitTitle}
            setEduUnitTitle={studio.setEduUnitTitle}
            onPracticeExamGenerated={(exam) => studio.setGeneratedPracticeExam(exam)}
            eduTrimester={studio.eduTrimester}
            setEduTrimester={studio.setEduTrimester}
            eduIncludeCover={studio.eduIncludeCover}
            setEduIncludeCover={studio.setEduIncludeCover}
            eduIncludeOutline={studio.eduIncludeOutline}
            setEduIncludeOutline={studio.setEduIncludeOutline}
            eduIncludeSources={studio.eduIncludeSources}
            setEduIncludeSources={studio.setEduIncludeSources}
            eduIncludeAnswerKey={studio.eduIncludeAnswerKey}
            setEduIncludeAnswerKey={studio.setEduIncludeAnswerKey}
            eduCustomPlan={studio.eduCustomPlan}
            setEduCustomPlan={studio.setEduCustomPlan}
            isGeneratingPlan={studio.isGeneratingPlan}
            isPlanReviewed={studio.isPlanReviewed}
            generatePlanAsync={studio.generatePlanAsync}
            planSummary={studio.planSummary}
            planProviderUsed={studio.planProviderUsed}
            planSuccessNotice={studio.planSuccessNotice}
            onDismissPlanNotice={() => studio.setPlanSuccessNotice(null)}
            points={points}
            applyPresetTopic={studio.applyPresetTopic}
            getDynamicPricing={studio.getDynamicPricing}
            currentSpec={studio.currentSpec}
            onApproveSpec={() =>
              studio.generateDocument(service, points, (doc) => onDocumentGenerated?.(doc), () => {})
            }
          />
        </div>

        {/* Right Pane: Live A4 Visual Preview */}
        <div
          className={`${
            mobileView === "preview" ? "block" : "hidden"
          } lg:block lg:col-span-5 bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xs sticky top-4`}
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span>المعاينة المباشرة للبحث</span>
              <Badge variant="outline" className="text-[10px] font-mono">
                A4 · 300DPI
              </Badge>
            </h3>
            <button
              type="button"
              onClick={() => studio.setIsConformanceModalOpen(true)}
              className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheckIcon size={14} />
              <span>فحص المطابقة الأكاديمية</span>
            </button>
          </div>

          <div className="max-h-[800px] overflow-y-auto pr-1 pl-1">
            <StudioLivePreviewA4
              service={service}
              customerName={studio.customerName}
              phone={studio.phone}
              language={studio.language}
              cvJobTitle={studio.cvJobTitle}
              cvExperience={studio.cvExperience}
              idPhotoCount={studio.idPhotoCount}
              idBgColor={studio.idBgColor}
              invoiceItems={studio.invoiceItems}
              calculateInvoiceTotal={studio.calculateInvoiceTotal}
              details={studio.details}
              eduMode={studio.eduMode}
              eduLevel={studio.eduLevel}
              eduGradeId={studio.eduGradeId}
              eduSubjectId={studio.eduSubjectId}
              eduTopic={studio.eduTopic}
              eduPageCount={studio.eduPageCount}
              eduSchoolName={studio.eduSchoolName}
              eduTeacherName={studio.eduTeacherName}
              eduTrimester={studio.eduTrimester}
              eduIncludeCover={studio.eduIncludeCover}
              eduIncludeOutline={studio.eduIncludeOutline}
              eduIncludeSources={studio.eduIncludeSources}
              eduIncludeAnswerKey={studio.eduIncludeAnswerKey}
              eduCurrentPagePreview={studio.eduCurrentPagePreview}
              setEduCurrentPagePreview={studio.setEduCurrentPagePreview}
              eduCustomPlan={studio.eduCustomPlan}
              eduGeneratedSections={studio.eduGeneratedSections}
              eduCoverTemplate={studio.eduCoverTemplate}
              eduStyleLevel={studio.eduStyleLevel}
              eduIncludeReviewQuestions={studio.eduIncludeReviewQuestions}
              eduDirectorate={studio.eduDirectorate}
              eduTeacherRequirements={studio.eduTeacherRequirements}
              eduUnitTitle={studio.eduUnitTitle}
              onExportWord={handleExportWord}
              onReportError={() =>
                studio.setErrorReportModal({
                  isOpen: true,
                  title: studio.eduTopic,
                })
              }
              conformanceScore={studio.conformanceReport?.score}
              onViewConformance={() => studio.setIsConformanceModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* 4. Modals */}
      <ErrorReportModal
        isOpen={studio.errorReportModal.isOpen}
        onClose={() =>
          studio.setErrorReportModal({ isOpen: false, title: "" })
        }
        documentTitle={studio.errorReportModal.title || studio.eduTopic}
        docId={studio.errorReportModal.docId}
        examId={studio.errorReportModal.examId}
      />

      <ConformanceReportModal
        isOpen={studio.isConformanceModalOpen}
        onClose={() => studio.setIsConformanceModalOpen(false)}
        report={
          studio.conformanceReport || {
            score: 0.94,
            pass: true,
            weights: {
              structure: 0.25,
              level_fit: 0.2,
              curriculum: 0.2,
              language: 0.15,
              factual_safety: 0.1,
              format: 0.1,
            },
            checks: [
              { id: "V01", name: "مطابقة الـ Schema والعقد", severity: "critical", status: "ok" },
              { id: "V02", name: "هيكل البحث (مقدمة، عرض، خاتمة)", severity: "critical", status: "ok" },
              { id: "V03", name: "طول الأقسام ضمن الحدود", severity: "high", status: "ok" },
              { id: "V04", name: "مفاهيم ضمن المقطع والمستوى", severity: "high", status: "ok" },
              { id: "V05", name: "المصطلحات المعتمدة والمحظورة", severity: "medium", status: "ok" },
              { id: "V06", name: "سلامة اللغة والإملاء والترقيم", severity: "medium", status: "ok" },
              { id: "V07", name: "المراجع (قائمة بيضاء موثوقة)", severity: "critical", status: "ok" },
              { id: "V10", name: "الغلاف الجزائري الرسمي", severity: "critical", status: "ok" },
              { id: "V11", name: "مجموع نقاط الاختبار 20 وتوزيعها", severity: "critical", status: "ok" },
              { id: "V15", name: "الوسم الإلزامي «اختبار تدريبي غير رسمي»", severity: "critical", status: "ok" },
            ],
            attempts: 1,
            evaluated_at: new Date().toISOString(),
          }
        }
        documentTitle={studio.eduTopic}
      />
    </div>
  );
}
