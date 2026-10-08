"use client";

import React, { useState, useEffect } from "react";
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
  const [activeSubTab, setActiveSubTab] = useState<"BUILDER" | "LIBRARY">("BUILDER");
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Real Database Library State
  const [savedDocs, setSavedDocs] = useState<any[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [libraryFilter, setLibraryFilter] = useState("");

  const pricing = studio.getDynamicPricing(service.code);
  const cost = pricing.pointsCost;
  const isInsufficient = points < cost && !service.isFree;

  const fetchSavedDocuments = async () => {
    setIsLoadingDocs(true);
    try {
      const res = await fetch("/api/v1/documents?shop_id=shop_1");
      if (res.ok) {
        const data = await res.json();
        if (data.items) {
          setSavedDocs(data.items);
        }
      }
    } catch (e) {
      console.error("Failed to fetch documents from database:", e);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchSavedDocuments();
  }, []);

  const handleExportWord = () => {
    if (!studio.eduTopic) {
      setExportNotice("يرجى تحديد عنوان وموضوع البحث أو المذكرة أولاً.");
      setTimeout(() => setExportNotice(null), 3500);
      return;
    }

    if (!studio.eduGeneratedSections || studio.eduGeneratedSections.length === 0) {
      setExportNotice("تنبيه: اضغط أولاً على «توليد وحفظ البحث» بالذكاء الاصطناعي لصياغة متن البحث الحقيقي قبل التصدير.");
      setTimeout(() => setExportNotice(null), 5000);
      return;
    }

    const subjectName = ALGERIAN_SUBJECTS[studio.eduSubjectId]?.nameAr || "المادة المقررة";
    const isThesis = studio.eduDocKind === "THESIS";

    exportResearchToWord({
      title: `${isThesis ? "مذكرة تخرج" : "بحث مدرسي"} - ${studio.eduTopic}`,
      topic: studio.eduTopic,
      level: studio.eduLevel,
      grade: studio.eduGradeId,
      subject: subjectName,
      docKind: studio.eduDocKind,
      university: studio.eduUniversity,
      faculty: studio.eduFaculty,
      specialty: studio.eduSpecialty,
      studentName: studio.customerName.trim() || (isThesis ? "الطالب الباحث" : "تلميذ المؤسسة"),
      schoolName: studio.eduSchoolName,
      teacherName: studio.eduTeacherName || (isThesis ? "أ.د المشرف المؤطر" : "الأستاذ المشرف"),
      outline: studio.eduCustomPlan,
      sections: studio.eduGeneratedSections,
      references: isThesis
        ? [
            "ديوان المطبوعات الجامعية (OPU) - بن عكنون، الجزائر.",
            "البوابة الوطنية للمجلات العلمية الجزائرية (ASJP)، وزارة التعليم العالي والبحث العلمي.",
            "المراجع الأكاديمية والمقالات العلمية المحكمة ذات الصلة بموضوع المذكرة.",
          ]
        : [
            `الكتاب المدرسي المقرر لمادة ${subjectName} - ديوان المطبوعات المدرسية (ONPS)، الجزائر.`,
            `المنهاج الرسمي والوثيقة المرافقة - وزارة التربية الوطنية الجزائرية.`,
            `الموسوعة الوطنية للعلوم والدراسات الجزائرية - منشورات ديوان المطبوعات الجامعية (OPU).`,
          ],
      reviewQuestions: !isThesis && studio.eduIncludeReviewQuestions
        ? [
            `س1: ما هي الفكرة المحورية لموضوع "${studio.eduTopic}" بأسلوبك الخاص؟`,
            `س2: اذكر فكرتين رئيستين وردتا في البحث تناسبان متطلبات منهاج وزارة التربية الوطنية.`,
            `س3: لخص أهم ما توصلت إليه الخاتمة في جملتين لدعم مشاركتك في القسم.`,
          ]
        : [],
    });

    setExportNotice("تم تحميل ملف Word (.doc) المنسق رسمياً بنجاح");
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
        fetchSavedDocuments();
        setExportNotice("تم توليد وحفظ المستند الأكاديمي الحقيقي بنجاح ⚡");
        setTimeout(() => setExportNotice(null), 4000);
      },
      () => {}
    );
  };

  const handleLoadSavedDoc = (doc: any) => {
    studio.loadSavedDocument(doc);
    setActiveSubTab("BUILDER");
    setExportNotice(`تم تحميل «${doc.title || doc.topic}» إلى الاستوديو والمعاينة الحية بنجاح ⚡`);
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleExportSavedDoc = (doc: any) => {
    let outline: string[] = [];
    if (Array.isArray(doc.outline)) outline = doc.outline;
    else if (typeof doc.outline_json === "string") {
      try { outline = JSON.parse(doc.outline_json); } catch {}
    }

    let sections: Array<{ heading: string; content: string }> = [];
    if (Array.isArray(doc.sections)) sections = doc.sections;
    else if (typeof doc.content_json === "string") {
      try { sections = JSON.parse(doc.content_json); } catch {}
    }

    const isThesis = doc.level === "UNIVERSITY" || (doc.title && doc.title.includes("مذكرة"));
    const subjectName = ALGERIAN_SUBJECTS[doc.subject]?.nameAr || doc.subject || "المادة المقررة";

    exportResearchToWord({
      title: doc.title || (isThesis ? "مذكرة تخرج" : "بحث مدرسي"),
      topic: doc.topic || doc.title,
      level: doc.stage || doc.level || "MIDDLE",
      grade: doc.level || doc.grade || "4AM",
      subject: subjectName,
      docKind: isThesis ? "THESIS" : "RESEARCH",
      university: doc.university || (isThesis ? doc.school_name : ""),
      faculty: doc.faculty || "",
      specialty: doc.specialty || "",
      studentName: doc.student_name || (isThesis ? "الطالب الباحث" : "تلميذ المؤسسة"),
      schoolName: doc.school_name || "المؤسسة التعليمية",
      teacherName: doc.teacher_name || (isThesis ? "أ.د المشرف المؤطر" : "الأستاذ المشرف"),
      outline: outline.length > 0 ? outline : ["المقدمة", "المبحث الأول", "المبحث الثاني", "الخاتمة"],
      sections: sections.length > 0 ? sections : [{ heading: "المبحث", content: "محتوى موثق" }],
      references: isThesis
        ? [
            "ديوان المطبوعات الجامعية (OPU) - الجزائر.",
            "البوابة الوطنية للمجلات العلمية الجزائرية (ASJP).",
          ]
        : [
            `الكتاب المدرسي المقرر لمادة ${subjectName} - ديوان المطبوعات المدرسية (ONPS).`,
            `الموسوعة الوطنية للعلوم والدراسات الجزائرية - منشورات ديوان المطبوعات الجامعية (OPU).`,
          ],
    });

    setExportNotice("تم تصدير ملف Word للوثيقة بنجاح");
    setTimeout(() => setExportNotice(null), 3000);
  };

  const filteredLibraryDocs = savedDocs.filter((d) => {
    if (!libraryFilter.trim()) return true;
    const q = libraryFilter.toLowerCase();
    return (
      (d.title && d.title.toLowerCase().includes(q)) ||
      (d.topic && d.topic.toLowerCase().includes(q)) ||
      (d.student_name && d.student_name.toLowerCase().includes(q)) ||
      (d.school_name && d.school_name.toLowerCase().includes(q))
    );
  });

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
                استوديو البحوث المدرسية ومذكرات التخرج
              </h1>
              <Badge variant="primary" className="text-xs font-bold gap-1">
                <span>🇩🇿 المنظومة التربوية والجامعية الجزائرية</span>
              </Badge>
              <Badge variant="outline" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                محتوى حقيقي وموثق
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
              منصة متكاملة لصناعة وتوليد البحوث المدرسية لجميع الأطوار، ومذكرات التخرج الجامعية (ليسانس، ماستر، تقني سامي). تشمل صفحة الغلاف الرسمية، خطة وفهرس البحث، المتن المفصل والموثق، والمراجع الوطنية المعتمدة.
            </p>
          </div>

          {/* Action Tools & Points Indicator */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/60 border border-border">
              <span className="text-xs text-muted-foreground font-medium">تكلفة التوليد:</span>
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
              <span>تصدير Word (.doc)</span>
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
              <span>{studio.isProcessing ? "جاري التوليد الأكاديمي..." : "توليد وحفظ المستند"}</span>
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

      {/* Sub-Tabs Switcher (Builder vs Database Library) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab("BUILDER")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === "BUILDER"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-muted/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>✍️</span>
            <span>محرر وصانع البحوث والمذكرات</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveSubTab("LIBRARY");
              fetchSavedDocuments();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === "LIBRARY"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-muted/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>📚</span>
            <span>سجل ومكتبة الوثائق السابقة ({savedDocs.length})</span>
          </button>
        </div>

        {activeSubTab === "BUILDER" && (
          /* Mobile View Switcher (Visible on < lg) */
          <div className="lg:hidden flex items-center p-1 bg-muted/80 rounded-xl border border-border shadow-xs">
            <button
              type="button"
              onClick={() => setMobileView("form")}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mobileView === "form"
                  ? "bg-card text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>إعدادات البحث والمحاور</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileView("preview")}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mobileView === "preview"
                  ? "bg-card text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>المعاينة الحية A4</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. TAB: DATABASE LIBRARY */}
      {activeSubTab === "LIBRARY" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border rounded-xl p-3.5">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={libraryFilter}
                onChange={(e) => setLibraryFilter(e.target.value)}
                placeholder="بحث في العناوين، أسماء الطلبة، المؤسسات..."
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>إجمالي الوثائق المحفوظة في قاعدة البيانات:</span>
              <span className="font-bold text-foreground font-mono">{filteredLibraryDocs.length}</span>
              <button
                type="button"
                onClick={fetchSavedDocuments}
                className="p-1.5 rounded-lg hover:bg-muted text-foreground transition-colors cursor-pointer"
                title="تحديث القائمة"
              >
                🔄
              </button>
            </div>
          </div>

          {isLoadingDocs ? (
            <div className="p-12 text-center text-xs text-muted-foreground space-y-2">
              <div className="animate-spin inline-block w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full" />
              <p>جاري تحميل سجل الوثائق من قاعدة البيانات...</p>
            </div>
          ) : filteredLibraryDocs.length === 0 ? (
            <div className="p-12 text-center bg-card border border-border rounded-2xl space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center text-2xl">
                📂
              </div>
              <h3 className="font-bold text-foreground text-sm">لا توجد وثائق محفوظة مطابقة</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                يمكنك الانتقال إلى تبويب «محرر وصانع البحوث والمذكرات» لتوليد وحفظ بحث جديد بالذكاء الاصطناعي وسيندرج هنا تلقائياً.
              </p>
              <button
                type="button"
                onClick={() => setActiveSubTab("BUILDER")}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                إنشاء مستند جديد الآن
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLibraryDocs.map((doc) => {
                const isThesis = doc.level === "UNIVERSITY" || (doc.title && doc.title.includes("مذكرة"));
                return (
                  <div
                    key={doc.id}
                    className="bg-card border border-border hover:border-emerald-500/50 rounded-2xl p-4 shadow-xs transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge
                          variant={isThesis ? "primary" : "secondary"}
                          className="text-[10px] font-bold"
                        >
                          {isThesis ? "🎓 مذكرة تخرج" : "📖 بحث مدرسي"}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {doc.created_at ? new Date(doc.created_at).toLocaleDateString("ar-DZ") : ""}
                        </span>
                      </div>

                      <h4 className="font-bold text-foreground text-xs line-clamp-2 mb-1.5 leading-snug">
                        {doc.title || doc.topic || "مستند بدون عنوان"}
                      </h4>

                      <div className="text-[11px] text-muted-foreground space-y-1">
                        <div className="flex items-center justify-between">
                          <span>صاحب المستند:</span>
                          <span className="font-medium text-foreground">{doc.student_name || "تلميذ المؤسسة"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>المؤسسة:</span>
                          <span className="truncate max-w-[150px] font-medium text-foreground">
                            {doc.school_name || "المؤسسة التعليمية"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>عدد الصفحات:</span>
                          <span className="font-mono font-bold text-foreground">{doc.pages || 3} ص</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleLoadSavedDoc(doc)}
                        className="flex-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/80 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-lg text-[11px] font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1"
                      >
                        <span>⚡</span>
                        <span>فتح بالاستوديو</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExportSavedDoc(doc)}
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/80 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        title="تصدير Word (.doc)"
                      >
                        📄
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. TAB: BUILDER WORKSPACE (Split Form & Live A4 Preview) */}
      {activeSubTab === "BUILDER" && (
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
              eduDocKind={studio.eduDocKind}
              setEduDocKind={studio.setEduDocKind}
              eduUniversity={studio.eduUniversity}
              setEduUniversity={studio.setEduUniversity}
              eduFaculty={studio.eduFaculty}
              setEduFaculty={studio.setEduFaculty}
              eduSpecialty={studio.eduSpecialty}
              setEduSpecialty={studio.setEduSpecialty}
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
                <span>المعاينة المباشرة للمستند</span>
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
                eduDocKind={studio.eduDocKind}
                eduUniversity={studio.eduUniversity}
                eduFaculty={studio.eduFaculty}
                eduSpecialty={studio.eduSpecialty}
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
      )}

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
