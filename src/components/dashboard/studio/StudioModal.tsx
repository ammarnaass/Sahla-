"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import type { ServiceDefinition } from "@/lib/constants";
import { useStudioState, type GeneratedDocPayload } from "@/hooks/dashboard/useStudioState";
import { StudioHeader } from "./StudioHeader";
import { StudioDynamicForm } from "./StudioDynamicForm";
import { StudioLivePreviewA4 } from "./StudioLivePreviewA4";
import { StudioPrintActions } from "./StudioPrintActions";
import { ErrorReportModal } from "./ErrorReportModal";
import { exportResearchToWord } from "@/lib/wordExport";
import { ALGERIAN_SUBJECTS } from "@/lib/educationConstants";

export interface StudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceDefinition | null;
  onDocumentGenerated: (doc: GeneratedDocPayload) => void;
  points: number;
}

export function StudioModal({
  isOpen,
  onClose,
  service,
  onDocumentGenerated,
  points,
}: StudioModalProps) {
  const studio = useStudioState();

  if (!service) return null;

  const pricing = studio.getDynamicPricing(service.code);
  const cost = pricing.pointsCost;
  const isInsufficient = points < cost && !service.isFree;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    studio.generateDocument(service, points, onDocumentGenerated, onClose);
  };

  const handlePrintExam = (exam: any, withSolution: boolean) => {
    onDocumentGenerated({
      id: `doc_${Date.now()}`,
      title: `${exam.title} ${withSolution ? "(مع الحل وسلم التنقيط)" : ""}`,
      type: "EXAM",
      customerName: studio.customerName.trim() || "تلميذ المؤسسة",
      salePrice: withSolution ? 200 : 100,
      pointsCost: withSolution ? exam.pointsCost || 2 : 0,
    });
    onClose();
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const handleBundlePrint = async (selectedExams: any[], watermark: boolean) => {
    try {
      const res = await fetch("/api/education/exams/bundle-print", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examIds: selectedExams.map((e) => e.id),
          watermark,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onDocumentGenerated({
          id: `doc_${Date.now()}`,
          title: data.bundleTitle || `حزمة مراجعة مجمعة (${selectedExams.length} مواضيع)`,
          type: "EXAM",
          customerName: studio.customerName.trim() || "تلميذ المؤسسة",
          salePrice: selectedExams.length * 120,
          pointsCost: 0,
        });
        onClose();
        setTimeout(() => {
          window.print();
        }, 400);
      }
    } catch {
      alert("تعذر إعداد حزمة الطباعة المجمعة");
    }
  };

  const handleExportWord = () => {
    const subjectName = ALGERIAN_SUBJECTS[studio.eduSubjectId]?.nameAr || "المادة المقررة";
    const sections = studio.eduCustomPlan.map((heading, idx) => ({
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
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`استوديو الوثائق: ${service.nameAr}`}
        maxWidth="max-w-5xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6 text-right">
          <StudioHeader
            service={service}
            points={points}
            pointsCost={cost}
            isInsufficient={isInsufficient}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              // School Research & Exams (PRD v1.0)
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
              points={points}
              onPrintExam={handlePrintExam}
              onBundlePrint={handleBundlePrint}
              onReportError={(id, title) =>
                studio.setErrorReportModal({ isOpen: true, title, docId: id })
              }
              applyPresetTopic={studio.applyPresetTopic}
              getDynamicPricing={studio.getDynamicPricing}
            />

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
              // School Research & Exams
              eduMode={studio.eduMode}
              eduLevel={studio.eduLevel}
              eduGradeId={studio.eduGradeId}
              eduSubjectId={studio.eduSubjectId}
              eduTopic={studio.eduTopic}
              eduPageCount={studio.eduPageCount}
              eduSchoolName={studio.eduSchoolName}
              eduTeacherName={studio.eduTeacherName}
              eduDirectorate={studio.eduDirectorate}
              eduTeacherRequirements={studio.eduTeacherRequirements}
              eduUnitTitle={studio.eduUnitTitle}
              eduTrimester={studio.eduTrimester}
              eduIncludeCover={studio.eduIncludeCover}
              eduIncludeOutline={studio.eduIncludeOutline}
              eduIncludeSources={studio.eduIncludeSources}
              eduIncludeAnswerKey={studio.eduIncludeAnswerKey}
              eduCurrentPagePreview={studio.eduCurrentPagePreview}
              setEduCurrentPagePreview={studio.setEduCurrentPagePreview}
              eduCustomPlan={studio.eduCustomPlan}
              eduCoverTemplate={studio.eduCoverTemplate}
              eduStyleLevel={studio.eduStyleLevel}
              eduIncludeReviewQuestions={studio.eduIncludeReviewQuestions}
              onExportWord={handleExportWord}
              onReportError={() =>
                studio.setErrorReportModal({
                  isOpen: true,
                  title: studio.eduTopic,
                })
              }
            />
          </div>

          <StudioPrintActions
            onClose={onClose}
            isProcessing={studio.isProcessing}
            isInsufficient={isInsufficient}
          />
        </form>
      </Modal>

      {/* Error Reporting Modal */}
      <ErrorReportModal
        isOpen={studio.errorReportModal.isOpen}
        onClose={() => studio.setErrorReportModal({ isOpen: false, title: "" })}
        documentTitle={studio.errorReportModal.title || studio.eduTopic}
        docId={studio.errorReportModal.docId}
        examId={studio.errorReportModal.examId}
      />
    </>
  );
}
