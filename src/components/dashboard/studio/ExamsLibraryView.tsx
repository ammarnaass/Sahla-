"use client";

import React, { useState, useEffect } from "react";
import {
  SchoolCapIcon,
  SparklesIcon,
  CheckCircleIcon,
  WirelessPrintIcon,
  ShieldCheckIcon,
  BoltIcon,
} from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";

export interface ExamItem {
  id: string;
  title: string;
  level: string;
  grade: string;
  stream: string | null;
  subject: string;
  trimester: number | null;
  year: number;
  session: string | null;
  type: string;
  pagesCount: number;
  hasSolution: boolean;
  examContent: any;
  solutionContent: any;
  markingRubric: string | null;
  isFree: boolean;
  pointsCost: number;
  downloadsCount: number;
}

interface ExamsLibraryViewProps {
  points: number;
  onPrintExam: (exam: ExamItem, withSolution: boolean) => void;
  onBundlePrint: (selectedExams: ExamItem[], watermark: boolean) => void;
  onReportError: (examId: string, title: string) => void;
}

export function ExamsLibraryView({
  points,
  onPrintExam,
  onBundlePrint,
  onReportError,
}: ExamsLibraryViewProps) {
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedStream, setSelectedStream] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Bundle selection
  const [selectedExamIds, setSelectedExamIds] = useState<string[]>([]);
  const [enableWatermark, setEnableWatermark] = useState<boolean>(true);

  // Active preview exam modal
  const [viewingExam, setViewingExam] = useState<ExamItem | null>(null);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);

  const fetchExams = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedLevel) params.append("level", selectedLevel);
      if (selectedGrade) params.append("grade", selectedGrade);
      if (selectedStream) params.append("stream", selectedStream);
      if (selectedSubject) params.append("subject", selectedSubject);
      if (selectedYear) params.append("year", selectedYear);
      if (searchQuery.trim()) params.append("q", searchQuery.trim());

      const res = await fetch(`/api/education/exams?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.exams)) {
        setExams(data.exams);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [selectedLevel, selectedGrade, selectedStream, selectedSubject, selectedYear]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchExams();
  };

  const toggleSelectExam = (id: string) => {
    setSelectedExamIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedExamsList = exams.filter((e) => selectedExamIds.includes(e.id));
  const totalSelectedPages = selectedExamsList.reduce((acc, curr) => acc + (curr.pagesCount || 2), 0);

  const handleUnlockSolution = async (exam: ExamItem) => {
    if (exam.pointsCost > points) {
      alert(`رصيدك الحالي (${points} نقطة) غير كافٍ لفتح الحل (${exam.pointsCost} نقطة). يُرجى شحن الرصيد.`);
      return;
    }

    setIsUnlocking(true);
    try {
      const res = await fetch("/api/education/exams/unlock-solution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId: exam.id }),
      });
      const data = await res.json();
      if (data.success) {
        setShowSolution(true);
        // Update local exam state
        setExams((prev) =>
          prev.map((e) => (e.id === exam.id ? { ...e, isFree: true, pointsCost: 0 } : e))
        );
      } else {
        alert(data.error || "فشل فتح الحل");
      }
    } catch {
      alert("تعذر الاتصال بالخادم");
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Search and Filters Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث برقم التمرين أو الكلمات الدلالية (مثال: متتاليات، دالة لوغاريتمية، هجومات الشمال القسنطيني)..."
            className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
          />
          <Button type="submit" variant="primary" className="text-xs px-5">
            بحث
          </Button>
        </form>

        {/* Filters grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-xs">
          {/* الطور */}
          <select
            value={selectedLevel}
            onChange={(e) => {
              setSelectedLevel(e.target.value);
              setSelectedGrade("");
              setSelectedStream("");
            }}
            className="px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-emerald-500 text-[11px]"
          >
            <option value="">جميع الأطوار</option>
            <option value="MIDDLE">التعليم المتوسط (BEM)</option>
            <option value="SECONDARY">التعليم الثانوي (BAC)</option>
            <option value="PRIMARY">التعليم الابتدائي</option>
          </select>

          {/* الشعبة (إذا كان ثانوي) */}
          <select
            value={selectedStream}
            onChange={(e) => setSelectedStream(e.target.value)}
            disabled={selectedLevel === "MIDDLE" || selectedLevel === "PRIMARY"}
            className="px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-emerald-500 text-[11px] disabled:opacity-40"
          >
            <option value="">جميع الشعب</option>
            <option value="SCIENTIFIC">علوم تجريبية</option>
            <option value="MATHS">رياضيات</option>
            <option value="TECHNO">تقني رياضي</option>
            <option value="MANAGEMENT">تسيير واقتصاد</option>
            <option value="LITERATURE">آداب وفلسفة</option>
            <option value="LANGUAGES">لغات أجنبية</option>
          </select>

          {/* المادة */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-emerald-500 text-[11px]"
          >
            <option value="">جميع المواد</option>
            <option value="MATHS">الرياضيات</option>
            <option value="PHYSICS">العلوم الفيزيائية</option>
            <option value="SCIENCES">علوم الطبيعة والحياة</option>
            <option value="ARABIC">اللغة العربية</option>
            <option value="HISTORY_GEO">التاريخ والجغرافيا</option>
            <option value="PHILOSOPHY">الفلسفة</option>
          </select>

          {/* السنة */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-emerald-500 text-[11px]"
          >
            <option value="">جميع السنوات</option>
            <option value="2024">دورة 2024</option>
            <option value="2023">دورة 2023</option>
            <option value="2022">دورة 2022</option>
            <option value="2021">دورة 2021</option>
            <option value="2020">دورة 2020</option>
          </select>

          {/* زر إعادة التعيين */}
          <button
            type="button"
            onClick={() => {
              setSelectedLevel("");
              setSelectedGrade("");
              setSelectedStream("");
              setSelectedSubject("");
              setSelectedYear("");
              setSearchQuery("");
            }}
            className="px-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[11px] font-medium text-center"
          >
            إعادة تعيين المرشحات
          </button>
        </div>
      </div>

      {/* 2. Bundle Print Action Bar (Sticky if items selected) */}
      {selectedExamIds.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              {selectedExamIds.length}
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                حزمة مراجعة مجمّعة ({selectedExamIds.length} مواضيع · {totalSelectedPages} صفحات)
              </p>
              <label className="flex items-center gap-2 mt-1 text-[11px] text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableWatermark}
                  onChange={(e) => setEnableWatermark(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 bg-slate-900"
                />
                <span>إدراج ختم المحل (علامة مائية خفيفة للتسويق)</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setSelectedExamIds([])}
              className="text-xs text-slate-400 hover:text-white"
            >
              إلغاء التحديد
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => onBundlePrint(selectedExamsList, enableWatermark)}
              className="text-xs px-4 py-2 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30"
            >
              <WirelessPrintIcon className="w-4 h-4" />
              <span>طباعة الحزمة دفعة واحدة</span>
            </Button>
          </div>
        </div>
      )}

      {/* 3. Exams List */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-400 text-xs">
          <span className="inline-block w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-2"></span>
          <p>جاري البحث في قاعدة الامتحانات الرسمية والمواضيع المعتمدة...</p>
        </div>
      ) : exams.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-400 text-xs">
          <p className="font-bold text-white mb-1">لا توجد مواضيع تطابق معايير البحث الحالية</p>
          <p className="text-slate-500">جرب تغيير المادة أو السنة أو تفريغ خانة البحث.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {exams.map((exam) => {
            const isSelected = selectedExamIds.includes(exam.id);

            return (
              <div
                key={exam.id}
                className={`p-4 rounded-2xl border transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? "bg-slate-900/90 border-emerald-500/60 shadow-md shadow-emerald-950/20"
                    : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700"
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold text-[10px] border border-emerald-500/20">
                        {exam.type === "OFFICIAL" ? "امتحان رسمي" : "اختبار فصلي"}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px]">
                        دورة {exam.year}
                      </span>
                      {exam.stream && (
                        <span className="px-2 py-0.5 rounded-md bg-sky-950/60 text-sky-300 text-[10px] border border-sky-800/40">
                          {exam.stream === "SCIENTIFIC" ? "علوم تجريبية" : exam.stream === "MATHS" ? "رياضيات" : exam.stream}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 text-[10px]">
                        {exam.pagesCount} صفحات
                      </span>
                    </div>

                    <label className="flex items-center gap-1 cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectExam(exam.id)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 bg-slate-900"
                      />
                      <span className="text-[10px] text-slate-400 font-medium">حزمة</span>
                    </label>
                  </div>

                  {/* Title */}
                  <h4 className="font-bold text-white text-sm mb-2 leading-snug">
                    {exam.title}
                  </h4>

                  {/* Indicators */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-3">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircleIcon size={13} />
                      <span>متوفر بالحل وسلم التنقيط</span>
                    </span>
                    <span className="text-slate-500">·</span>
                    <span>{exam.downloadsCount} طباعة</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/70 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setViewingExam(exam);
                      setShowSolution(false);
                    }}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>معاينة الموضوع</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => onReportError(exam.id, exam.title)}
                      className="text-[10px] px-2 py-1 text-slate-400 hover:text-amber-400"
                      title="أبلغ عن خطأ في هذا الموضوع"
                    >
                      أبلغ عن خطأ
                    </Button>

                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => onPrintExam(exam, false)}
                      className="text-[11px] px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5"
                    >
                      <WirelessPrintIcon className="w-3.5 h-3.5" />
                      <span>طباعة فورية</span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Exam & Solution Full Inspection Modal */}
      {viewingExam && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl text-xs text-slate-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm">{viewingExam.title}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  الجمهورية الجزائرية الديمقراطية الشعبية · وزارة التربية الوطنية · دورة {viewingExam.year}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingExam(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Modal Content Tabs */}
            <div className="p-4 overflow-y-auto flex-1 space-y-4">
              <div className="flex gap-2 border-b border-slate-800 pb-2">
                <button
                  type="button"
                  onClick={() => setShowSolution(false)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs ${
                    !showSolution ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  نص الموضوع والتمارين (مجاني)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (viewingExam.isFree || viewingExam.pointsCost === 0) {
                      setShowSolution(true);
                    } else {
                      handleUnlockSolution(viewingExam);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 ${
                    showSolution ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <SparklesIcon size={14} />
                  <span>
                    الحل النموذجي وسلم التنقيط {viewingExam.pointsCost > 0 && !showSolution ? `(${viewingExam.pointsCost} نقاط)` : ""}
                  </span>
                </button>
              </div>

              {!showSolution ? (
                <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800/80 leading-relaxed font-sans">
                  <div className="text-center font-bold text-emerald-400 border-b border-slate-800 pb-2">
                    {viewingExam.examContent?.header || viewingExam.title}
                  </div>
                  {viewingExam.examContent?.part1?.map((item: any, i: number) => (
                    <div key={i} className="pt-2">
                      <h5 className="font-bold text-white mb-1">{item.title}</h5>
                      <p className="text-slate-300 whitespace-pre-line text-[11.5px]">{item.content}</p>
                    </div>
                  ))}
                  {viewingExam.examContent?.part2 && (
                    <div className="pt-3 border-t border-slate-800">
                      <h5 className="font-bold text-amber-300 mb-1">{viewingExam.examContent.part2.title}</h5>
                      <p className="text-slate-300 whitespace-pre-line text-[11.5px]">
                        {viewingExam.examContent.part2.content}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-2xl">
                  <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                    <span className="font-bold text-emerald-300">عناصر الإجابة وسلم التنقيط الوزاري الرسمي:</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">معتمد</span>
                  </div>
                  <ol className="space-y-2 list-decimal list-inside text-slate-200">
                    {viewingExam.solutionContent?.steps?.map((step: string, idx: number) => (
                      <li key={idx} className="leading-relaxed text-[11.5px]">{step}</li>
                    ))}
                  </ol>
                  {viewingExam.markingRubric && (
                    <div className="mt-3 p-2.5 bg-slate-900/80 rounded-xl text-[11px] text-amber-300 border border-amber-500/20">
                      <span className="font-bold">توزيع العلامات: </span>
                      {viewingExam.markingRubric}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onReportError(viewingExam.id, viewingExam.title)}
                className="text-xs text-slate-400 hover:text-amber-400"
              >
                أبلغ عن خطأ
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={() => setViewingExam(null)}>
                  إغلاق
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => {
                    onPrintExam(viewingExam, showSolution);
                    setViewingExam(null);
                  }}
                  className="text-xs flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  <WirelessPrintIcon className="w-3.5 h-3.5" />
                  <span>طباعة فورية للموضوع {showSolution ? "مع الحل" : ""}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
