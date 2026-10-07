"use client";

import React, { useState } from "react";
import type { GeneratedDocPayload } from "@/hooks/dashboard/useStudioState";
import { ExamsLibraryView, type ExamItem } from "../studio/ExamsLibraryView";
import { PracticeExamGeneratorView } from "../studio/PracticeExamGeneratorView";
import { ErrorReportModal } from "../studio/ErrorReportModal";
import { Badge } from "@/components/ui/badge";
import {
  SchoolCapIcon,
  SparklesIcon,
  CheckCircleIcon,
  WirelessPrintIcon,
  ShieldCheckIcon,
  BoltIcon,
} from "@/components/ui/Icons";

export interface ExamsHubTabProps {
  points: number;
  onDocumentGenerated?: (doc: GeneratedDocPayload) => void;
}

export function ExamsHubTab({
  points,
  onDocumentGenerated,
}: ExamsHubTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<"library" | "generator">("library");
  const [errorReportModal, setErrorReportModal] = useState<{
    isOpen: boolean;
    title: string;
    docId?: string;
    examId?: string;
  }>({ isOpen: false, title: "" });
  const [notification, setNotification] = useState<string | null>(null);

  const handlePrintExam = (exam: any, withSolution: boolean) => {
    onDocumentGenerated?.({
      id: `doc_${Date.now()}`,
      title: `${exam.title || "موضوع امتحان"} ${withSolution ? "(مع التصحيح وسلم التنقيط)" : ""}`,
      type: "EXAM",
      customerName: "تلميذ المؤسسة",
      salePrice: withSolution ? 200 : 100,
      pointsCost: withSolution ? exam.pointsCost || 2 : 0,
    });
    setNotification(`تم إرسال الموضوع للطباعة: ${exam.title || "امتحان"}`);
    setTimeout(() => setNotification(null), 4000);
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const handleBundlePrint = async (selectedExams: ExamItem[], watermark: boolean) => {
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
        onDocumentGenerated?.({
          id: `doc_${Date.now()}`,
          title: data.bundleTitle || `حزمة مراجعة مجمعة (${selectedExams.length} مواضيع)`,
          type: "EXAM",
          customerName: "تلميذ المؤسسة",
          salePrice: selectedExams.length * 120,
          pointsCost: 0,
        });
        setNotification(`تم إعداد حزمة المراجعة بنجاح (${selectedExams.length} مواضيع)`);
        setTimeout(() => setNotification(null), 4000);
        setTimeout(() => {
          window.print();
        }, 400);
      }
    } catch {
      alert("تعذر إعداد حزمة الطباعة المجمعة");
    }
  };

  const handleReportError = (id: string, title: string) => {
    setErrorReportModal({
      isOpen: true,
      title,
      examId: id,
      docId: id,
    });
  };

  const handlePracticeExamGenerated = (exam: any) => {
    onDocumentGenerated?.({
      id: `doc_${Date.now()}`,
      title: exam.title || "اختبار تدريبي مولّد بالذكاء الاصطناعي",
      type: "EXAM",
      customerName: "تلميذ المؤسسة",
      salePrice: 150,
      pointsCost: 3,
    });
    setNotification("تم توليد الاختبار النموذجي وحفظه في المستندات بنجاح ⚡");
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-5 animate-fade-in text-right">
      {/* 1. Dedicated Header & Hub Meta */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shadow-xs">
                <SchoolCapIcon size={22} />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-foreground font-display">
                بنك ومولّد الامتحانات والفروض النموذجية
              </h1>
              <Badge variant="primary" className="text-xs font-bold gap-1">
                <span>🇩🇿 بنك الـ 58 ولاية</span>
              </Badge>
              <Badge variant="outline" className="text-xs font-semibold text-blue-600 dark:text-blue-400 border-blue-500/30">
                ONEC 2026
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
              منظومة الامتحانات الوطنية المعتمدة: تصفح وطباعة مواضيع الامتحانات والفروض الرسمية مع الحلول النموذجية، أو توليد اختبارات تدريبية ذكية متدرجة الصعوبة وسلم تنقيط وزاري رسمي (/20).
            </p>
          </div>

          {/* Points & SubTab Pills */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/60 border border-border">
              <span className="text-xs text-muted-foreground font-medium">الرصيد المتاح:</span>
              <span className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400">
                {points.toLocaleString()} ن
              </span>
            </div>

            <div className="flex items-center p-1 bg-muted/80 rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setActiveSubTab("library")}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeSubTab === "library"
                    ? "bg-card text-foreground shadow-xs border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <SchoolCapIcon size={14} />
                <span>بنك الامتحانات الرسمية</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSubTab("generator")}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeSubTab === "generator"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <SparklesIcon className="w-3.5 h-3.5" />
                <span>مولّد الاختبارات الذكي</span>
                <span className="text-[10px] px-1 py-0.2 bg-blue-500/40 rounded">v2.0</span>
              </button>
            </div>
          </div>
        </div>

        {/* Temporary Notification */}
        {notification && (
          <div className="mt-3 p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircleIcon size={16} />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* 2. Main Module Body */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-xs">
        {activeSubTab === "library" ? (
          <ExamsLibraryView
            points={points}
            onPrintExam={handlePrintExam}
            onBundlePrint={handleBundlePrint}
            onReportError={handleReportError}
          />
        ) : (
          <PracticeExamGeneratorView
            points={points}
            onPrintExam={handlePrintExam}
            onGenerated={handlePracticeExamGenerated}
          />
        )}
      </div>

      {/* 3. Error Reporting Modal */}
      <ErrorReportModal
        isOpen={errorReportModal.isOpen}
        onClose={() => setErrorReportModal({ isOpen: false, title: "" })}
        documentTitle={errorReportModal.title || "موضوع امتحان"}
        docId={errorReportModal.docId}
        examId={errorReportModal.examId}
      />
    </div>
  );
}
