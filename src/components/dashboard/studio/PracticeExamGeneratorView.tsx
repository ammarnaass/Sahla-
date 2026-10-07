"use client";

import React, { useState } from "react";
// Native SVG icon components to eliminate third-party runtime dependencies
function FileText({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function Sparkles({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
    </svg>
  );
}

function Printer({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}

function CheckCircle2({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function AlertCircle({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function Clock({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function Award({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

function BookOpen({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function Send({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function Loader2({ className = "w-4 h-4 animate-spin" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
import { ALGERIAN_WILAYAS_DIRECTORATES } from "@/server/education/curriculumCatalog";

export interface PracticeExamGeneratorViewProps {
  points: number;
  onPrintExam: (exam: any, withSolution: boolean) => void;
  onGenerated?: (exam: any) => void;
}

export function PracticeExamGeneratorView({
  points,
  onPrintExam,
  onGenerated,
}: PracticeExamGeneratorViewProps) {
  const [stage, setStage] = useState<"primary" | "middle" | "secondary">("middle");
  const [level, setLevel] = useState<string>("4AM");
  const [stream, setStream] = useState<string>("");
  const [subject, setSubject] = useState<string>("MATHS");
  const [trimester, setTrimester] = useState<1 | 2 | 3>(1);
  const [examType, setExamType] = useState<"exam" | "test" | "blanc">("exam");
  const [directorate, setDirectorate] = useState<string>("مديرية التربية لولاية الجزائر - وسط (16)");
  const [schoolName, setSchoolName] = useState<string>("متوسطة الشهيد زبانة");

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedExam, setGeneratedExam] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"EXAM" | "SOLUTION">("EXAM");

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/v1/exams/generate-practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage,
          level,
          subject,
          stream: stage === "secondary" ? stream || "SCIENTIFIC" : undefined,
          trimester,
          exam_type: examType,
          directorate,
          school_name: schoolName,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setErrorMsg(data.error?.message || "فشل توليد الاختبار التدريبي");
      } else if (data.success && data.exam) {
        setGeneratedExam(data.exam);
        if (onGenerated) onGenerated(data.exam);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "حدث خطأ غير متوقع أثناء الاتصال بالخادم");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-slate-100 to-indigo-50 dark:from-blue-950/60 dark:via-slate-900 dark:to-indigo-950/60 border border-blue-200 dark:border-blue-800/40 rounded-2xl p-4 sm:p-5 relative overflow-hidden transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold border border-blue-500/20">
                المنهاج الجزائري الرسمي v2.0
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">شبكة تقويم / 20 مع الوضعية الإدماجية</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500 dark:text-blue-400 animate-pulse" />
              مولّد الاختبارات والتمارين التدريبية النموذجية
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              توليد فوري لاختبارات فصلية وفروض محروسة مطابقة للترقيم الجزائري وسلم التنقيط مع الحل التفصيلي.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 border border-blue-200 dark:border-blue-500/30 rounded-xl px-3 py-2 text-right self-stretch sm:self-auto transition-colors">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">تكلفة التوليد الشامل</span>
            <div className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center justify-end gap-1">
              <span>5 نقاط</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">/ موضوع + حل كامل</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 transition-colors">
        {/* الطور والمستوى */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-400 mb-1.5">الطور والمستوى الدراسي</label>
          <select
            value={level}
            onChange={(e) => {
              const val = e.target.value;
              setLevel(val);
              if (val.endsWith("AP")) setStage("primary");
              else if (val.endsWith("AM")) setStage("middle");
              else if (val.endsWith("AS")) setStage("secondary");
            }}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-blue-500 transition-colors"
          >
            <optgroup label="التعليم الابتدائي">
              <option value="4AP">السنة الرابعة ابتدائي (4AP)</option>
              <option value="5AP">السنة الخامسة ابتدائي (5AP - امتحان التقييم)</option>
            </optgroup>
            <optgroup label="التعليم المتوسط (BEM)">
              <option value="1AM">السنة الأولى متوسط (1AM)</option>
              <option value="2AM">السنة الثانية متوسط (2AM)</option>
              <option value="3AM">السنة الثالثة متوسط (3AM)</option>
              <option value="4AM">السنة الرابعة متوسط (4AM - شهادة BEM)</option>
            </optgroup>
            <optgroup label="التعليم الثانوي (BAC)">
              <option value="1AS">السنة الأولى ثانوي (1AS)</option>
              <option value="2AS">السنة الثانية ثانوي (2AS)</option>
              <option value="3AS">السنة الثالثة ثانوي (3AS - شهادة البكالوريا BAC)</option>
            </optgroup>
          </select>
        </div>

        {/* المادة */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-400 mb-1.5">المادة المقررة</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="MATHS">الرياضيات (معادلات + هندسة + وضعية مركبة)</option>
            <option value="PHYSICS">العلوم الفيزيائية والتكنولوجيا (مادة وميكانيك وأمن)</option>
            <option value="SCIENCES">علوم الطبيعة والحياة (استدلال واسترجاع معارف)</option>
            <option value="ARABIC">اللغة العربية ولواحقها (بناء فكري ولغوي وإنتاج)</option>
            <option value="HISTORY_GEO">التاريخ والجغرافيا</option>
            <option value="PHILOSOPHY">الفلسفة (طريقة مقارنة / جدلية)</option>
          </select>
        </div>

        {/* الشعبة للثانوي */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-400 mb-1.5">
            الشعبة (للتعليم الثانوي)
          </label>
          <select
            value={stream}
            onChange={(e) => setStream(e.target.value)}
            disabled={stage !== "secondary"}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-blue-500 disabled:opacity-40 transition-colors"
          >
            <option value="SCIENTIFIC">شعبة علوم تجريبية</option>
            <option value="MATHS">شعبة رياضيات</option>
            <option value="TECHNO">شعبة تقني رياضي</option>
            <option value="LITERATURE">شعبة آداب وفلسفة</option>
            <option value="MANAGEMENT">شعبة تسيير واقتصاد</option>
          </select>
        </div>

        {/* الفصل الدراسي */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-400 mb-1.5">الفصل الدراسي</label>
          <select
            value={trimester}
            onChange={(e) => setTrimester(Number(e.target.value) as 1 | 2 | 3)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value={1}>الثلاثي الأول (برنامج الفصل 1)</option>
            <option value={2}>الثلاثي الثاني (برنامج الفصل 2)</option>
            <option value={3}>الثلاثي الثالث (شامل ونهاية السنة)</option>
          </select>
        </div>

        {/* نوع الوثيقة */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-400 mb-1.5">نوع الاختبار</label>
          <select
            value={examType}
            onChange={(e) => setExamType(e.target.value as any)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="exam">اختبار فصلي رسمي (مدة 2 سا - سلم 20 ن)</option>
            <option value="test">فرض محروس للمراقبة المستمرة (مدة 1 سا)</option>
            <option value="blanc">امتحان تجريبي موحد تحضيراً للشهادة</option>
          </select>
        </div>

        {/* مديرية التربية */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-400 mb-1.5">مديرية التربية لولاية</label>
          <select
            value={directorate}
            onChange={(e) => setDirectorate(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-blue-500 transition-colors"
          >
            {ALGERIAN_WILAYAS_DIRECTORATES.slice(0, 20).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          <span>المحتوى يتضمن الوضعية الإدماجية وشبكة معايير التصحيح الوزارية الرسمية.</span>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating || points < 5}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer min-h-[44px]"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جاري صياغة الاختبار والحل النموذجي...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>توليد الاختبار التدريبي النموذجي (5 نقاط)</span>
            </>
          )}
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl text-red-700 dark:text-red-300 text-xs flex items-center gap-2 transition-colors">
          <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Generated Exam Preview Area */}
      {generatedExam && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-blue-900/50 rounded-2xl overflow-hidden shadow-2xl transition-colors">
          {/* SubTab Switcher between Exam and Model Solution */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-2.5 sm:px-4 sm:py-2.5 transition-colors">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("EXAM")}
                className={`flex-1 sm:flex-initial px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[40px] flex items-center justify-center ${
                  activeTab === "EXAM"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                نص موضوع الاختبار (للطباعة)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("SOLUTION")}
                className={`flex-1 sm:flex-initial px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[40px] flex items-center justify-center ${
                  activeTab === "SOLUTION"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                الإجابة النموذجية وسلّم التنقيط
              </button>
            </div>

            <button
              type="button"
              onClick={() => onPrintExam(generatedExam, activeTab === "SOLUTION")}
              className="px-3.5 py-2 sm:py-1.5 rounded-lg bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer shadow-xs min-h-[40px]"
            >
              <Printer className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
              <span>طباعة A4 فورية</span>
            </button>
          </div>

          {/* Document Content View */}
          <div className="p-6 bg-white text-slate-900 font-serif leading-relaxed" dir="rtl">
            {/* Algerian Official Header */}
            <div className="border-4 double border-blue-900 p-4 rounded-lg text-center mb-6">
              <div className="text-xs font-bold text-slate-700">{generatedExam.header.country}</div>
              <div className="text-xs font-semibold text-blue-900">{generatedExam.header.ministry}</div>
              <div className="text-[11px] text-slate-600 mt-1">
                {generatedExam.header.directorate} · {generatedExam.header.school}
              </div>

              <div className="my-3 py-2 bg-blue-50 border-y-2 border-blue-800">
                <h2 className="text-base font-bold text-blue-950 m-0">{generatedExam.header.exam_title}</h2>
                <div className="text-xs text-slate-700 mt-1">
                  المستوى: <strong>{generatedExam.header.level_stream}</strong> · المدة:{" "}
                  <strong>{generatedExam.header.duration}</strong> · المعامل:{" "}
                  <strong>{generatedExam.header.coefficient}</strong>
                </div>
              </div>

              {/* Student and Grade box */}
              <div className="grid grid-cols-2 gap-4 text-xs mt-3 pt-2 border-t border-slate-300">
                <div className="text-right">
                  اللقب والاسم: ................................................ القسم: .............
                </div>
                <div className="text-left font-bold text-blue-900">العلامة: .......... / 20</div>
              </div>
            </div>

            {/* Watermark Banner */}
            <div className="mb-4 py-1 text-center text-[10px] font-sans font-bold bg-amber-50 text-amber-800 border border-amber-200 rounded">
              ⚠️ {generatedExam.watermark} · الإصدار الوزاري المرجعي: {generatedExam.catalog_version}
            </div>

            {activeTab === "EXAM" ? (
              <div className="space-y-6">
                {/* Part 1: Exercises */}
                {generatedExam.parts.map((p: any) => (
                  <div key={p.part_number} className="space-y-4">
                    <h3 className="text-sm font-bold text-blue-900 border-b-2 border-blue-600 pb-1">
                      {p.part_title}
                    </h3>

                    {p.exercises.map((ex: any) => (
                      <div key={ex.ex_ref} className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                        <div className="flex justify-between items-center mb-1.5 font-bold text-xs text-slate-900">
                          <span>{ex.ex_ref}: {ex.title}</span>
                          <span className="text-blue-800 bg-blue-100 px-2 py-0.5 rounded text-[11px]">
                            ({ex.points} نقاط)
                          </span>
                        </div>
                        <div className="text-xs whitespace-pre-line text-slate-800 leading-relaxed">
                          {ex.content}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                {/* Part 2: Situation d'Intégration */}
                {generatedExam.situation_integration && (
                  <div className="mt-6 border-t-2 border-slate-300 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-bold text-emerald-900">
                        {generatedExam.situation_integration.title}
                      </h3>
                      <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-xs font-bold">
                        ({generatedExam.situation_integration.points} نقاط)
                      </span>
                    </div>

                    <div className="bg-emerald-50/60 p-4 rounded-lg border border-emerald-200 text-xs space-y-3">
                      <div>
                        <strong>السياق: </strong>
                        <span>{generatedExam.situation_integration.context}</span>
                      </div>

                      <div>
                        <strong>السندات المعتمدة:</strong>
                        <ul className="list-disc pr-5 mt-1 space-y-0.5 text-slate-700">
                          {generatedExam.situation_integration.support_documents.map((d: string, idx: number) => (
                            <li key={idx}>{d}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <strong>التعليمات والمطلوب:</strong>
                        <ul className="list-decimal pr-5 mt-1 space-y-1 font-semibold text-slate-900">
                          {generatedExam.situation_integration.instructions.map((ins: string, idx: number) => (
                            <li key={idx}>{ins}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Assessment matrix */}
                      <div className="mt-3 pt-3 border-t border-emerald-200">
                        <span className="text-[11px] font-bold text-emerald-950 block mb-1">
                          معايير شبكة التقويم المعتمدة:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-center">
                          {generatedExam.situation_integration.criteria_rubric.map((c: any, idx: number) => (
                            <div key={idx} className="bg-white p-1.5 rounded border border-emerald-300">
                              <span className="font-bold text-emerald-900 block">{c.criterion}</span>
                              <span className="text-slate-600">({c.points} ن)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Solution Tab */
              <div className="space-y-6">
                <div className="p-3 bg-emerald-100 text-emerald-950 rounded-lg text-xs font-bold flex justify-between items-center">
                  <span>الإجابة النموذجية وسلم التنقيط المعتمد</span>
                  <span>{generatedExam.marking_rubric_summary}</span>
                </div>

                <div className="space-y-4">
                  {generatedExam.solution.steps.map((s: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="flex justify-between items-center font-bold text-xs text-emerald-900 mb-2 border-b pb-1">
                        <span>{s.ex_ref}</span>
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[11px]">
                          سلم التنقيط: {s.points_allocated} نقاط
                        </span>
                      </div>
                      <div className="text-xs whitespace-pre-line text-slate-800 leading-relaxed font-sans">
                        {s.step_solution}
                      </div>
                    </div>
                  ))}

                  {generatedExam.solution.situation_solution && (
                    <div className="bg-emerald-50/80 p-4 rounded-lg border border-emerald-200">
                      <div className="font-bold text-xs text-emerald-900 mb-2 border-b border-emerald-300 pb-1">
                        حل وتصحيح الوضعية الإدماجية
                      </div>
                      <div className="text-xs whitespace-pre-line text-slate-800 leading-relaxed font-sans">
                        {generatedExam.solution.situation_solution}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
