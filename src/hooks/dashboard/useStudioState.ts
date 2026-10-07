"use client";

import { useState } from "react";
import type { ServiceDefinition } from "@/lib/constants";
import {
  EducationLevel,
  DocumentMode,
  calculateEducationPricing,
  PRESET_TOPICS,
  ALGERIAN_GRADES,
  ALGERIAN_SUBJECTS,
} from "@/lib/educationConstants";

export interface GeneratedDocPayload {
  id: string;
  title: string;
  type: string;
  customerName: string;
  salePrice: number;
  pointsCost: number;
}

export interface InvoiceItem {
  desc: string;
  qty: number;
  price: number;
}

export function useStudioState() {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState<"ar" | "fr" | "en">("ar");

  // CV Specific state
  const [cvJobTitle, setCvJobTitle] = useState("مهندس برمجيات / كاتب عمومي");
  const [cvExperience, setCvExperience] = useState(
    "3 سنوات خبرة في المعالجة الآلية للمعلومات والخدمات الإدارية"
  );

  // ID Photo specific state
  const [idPhotoCount, setIdPhotoCount] = useState<4 | 8>(8);
  const [idBgColor, setIdBgColor] = useState<"gray" | "white">("gray");

  // Invoice specific state
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { desc: "تصميم وإنجاز سيرة ذاتية احترافية", qty: 1, price: 250 },
    { desc: "طباعة ملونة صور هوية بيومترية (8 صور)", qty: 1, price: 200 },
  ]);

  // School Research & Exams state (التعليم الجزائري - PRD v2.0)
  const [eduSubTab, setEduSubTab] = useState<"BUILDER" | "LIBRARY" | "PRACTICE_EXAM">("BUILDER");
  const [eduMode, setEduMode] = useState<DocumentMode>("RESEARCH");
  const [eduLevel, setEduLevel] = useState<EducationLevel>("MIDDLE");
  const [eduGradeId, setEduGradeId] = useState<string>("4AM");
  const [eduSubjectId, setEduSubjectId] = useState<string>("HISTORY_GEO");
  const [eduTopic, setEduTopic] = useState<string>(
    "الثورة التحريرية الجزائرية المباركة (1954 - 1962)"
  );
  const [eduPageCount, setEduPageCount] = useState<1 | 2 | 3 | 5 | 10>(3);
  const [eduStyleLevel, setEduStyleLevel] = useState<"SIMPLE" | "MODERATE" | "ADVANCED">("MODERATE");
  const [eduCoverTemplate, setEduCoverTemplate] = useState<"OFFICIAL" | "CLASSIC" | "MODERN">("OFFICIAL");
  const [eduIncludeReviewQuestions, setEduIncludeReviewQuestions] = useState<boolean>(true);
  const [eduSchoolName, setEduSchoolName] = useState<string>("متوسطة الشهيد زبانة");
  const [eduTeacherName, setEduTeacherName] = useState<string>("الأستاذ المشرف");
  const [eduDirectorate, setEduDirectorate] = useState<string>("مديرية التربية لولاية الجزائر (16)");
  const [eduTeacherRequirements, setEduTeacherRequirements] = useState<string>("");
  const [eduUnitId, setEduUnitId] = useState<string>("");
  const [eduUnitTitle, setEduUnitTitle] = useState<string>("");
  const [generatedPracticeExam, setGeneratedPracticeExam] = useState<any>(null);
  const [eduTrimester, setEduTrimester] = useState<1 | 2 | 3>(2);
  const [eduIncludeCover, setEduIncludeCover] = useState<boolean>(true);
  const [eduIncludeOutline, setEduIncludeOutline] = useState<boolean>(true);
  const [eduIncludeSources, setEduIncludeSources] = useState<boolean>(true);
  const [eduIncludeAnswerKey, setEduIncludeAnswerKey] = useState<boolean>(true);
  const [eduCurrentPagePreview, setEduCurrentPagePreview] = useState<number>(1);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
  const [isPlanReviewed, setIsPlanReviewed] = useState<boolean>(false);
  const [errorReportModal, setErrorReportModal] = useState<{
    isOpen: boolean;
    title: string;
    docId?: string;
    examId?: string;
  }>({ isOpen: false, title: "" });

  // 🎯 Guidance System v1.0 State
  const [currentSpec, setCurrentSpec] = useState<any | null>(null);
  const [conformanceReport, setConformanceReport] = useState<any | null>(null);
  const [isConformanceModalOpen, setIsConformanceModalOpen] = useState(false);

  const [eduCustomPlan, setEduCustomPlan] = useState<string[]>([
    "مقدمة: دوافع انطلاق الثورة التحريرية وبيان أول نوفمبر 1954",
    "المبحث الأول: المراحل الكبرى للثورة ومؤتمر الصومام 1956",
    "المبحث الثاني: المظاهرات الشعبية ومفاوضات إيفيان واسترجاع السيادة",
    "خاتمة: تضحيات الشهداء ومكانة الجزائر الدولية بعد الاستقلال",
    "قائمة المراجع: تاريخ الثورة الجزائرية - ديوان المطبوعات المدرسية",
  ]);

  // تجميع المواصفة الدقيقة وعقد المخرجات (PRD Section 4 & Spec Card)
  const fetchSpecForCurrentState = async () => {
    try {
      const res = await fetch("/api/v1/briefs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: eduMode === "RESEARCH" ? "research" : "exam",
          context: {
            stage: eduLevel.toLowerCase(),
            level: parseInt(eduGradeId) || 3,
            grade_code: eduGradeId,
            subject: eduSubjectId,
          },
          topic: {
            topic_text: eduTopic || "موضوع البحث المدرسي",
            unit_id: eduUnitId,
            unit_title: eduUnitTitle,
          },
          specs: eduMode === "RESEARCH" ? {
            pages: eduPageCount,
            language,
            style: eduStyleLevel.toLowerCase(),
          } : {
            exam_type: "exam",
            difficulty: "official",
            with_solution: eduIncludeAnswerKey,
            variants_count: 2,
          },
          teacher_requirements: eduTeacherRequirements,
        }),
      });
      const data = await res.json();
      if (data.spec) {
        setCurrentSpec(data.spec);
      }
    } catch {
      // Non-blocking fallback
    }
  };

  // Step 1: توليد خطة البحث أولاً ومراجعتها مجاناً (PRD Section 5.1 & v2.0 Teacher Requirements)
  const generatePlanAsync = async () => {
    setIsGeneratingPlan(true);
    const effectiveTopic =
      (eduTopic || "").trim() ||
      (ALGERIAN_SUBJECTS[eduSubjectId]?.nameAr
        ? `بحث مدرسي في مادة ${ALGERIAN_SUBJECTS[eduSubjectId].nameAr}`
        : "الثورة التحريرية الجزائرية المباركة (1954 - 1962)");

    try {
      // Non-blocking compile of the spec contract in background
      fetchSpecForCurrentState().catch(() => {});

      const res = await fetch("/api/v1/research/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: eduLevel.toLowerCase(),
          level: eduGradeId,
          subject: eduSubjectId,
          topic: effectiveTopic,
          pages: eduPageCount,
          style: eduStyleLevel.toLowerCase(),
          options: {
            teacher_requirements: eduTeacherRequirements,
            unit_id: eduUnitId,
            unit_title: eduUnitTitle,
            directorate: eduDirectorate,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.outline) && data.outline.length > 0) {
          const titles = data.outline.map((o: any) =>
            typeof o === "string" ? o : o.title || "محور بحث"
          );
          setEduCustomPlan(titles);
          setIsPlanReviewed(true);
          return;
        }
      }
      throw new Error("Could not parse outline from API response");
    } catch {
      // Guaranteed Algerian curriculum fallback synthesis
      const stage = eduLevel.toLowerCase();
      const teacherParts = eduTeacherRequirements
        ? eduTeacherRequirements
            .split(/[\n,;،•\-\*]/)
            .map((s) => s.trim())
            .filter((s) => s.length > 2)
        : [];

      let fallbackOutline: string[] = [];
      if (stage === "primary") {
        fallbackOutline = [
          `مقدمة مبسطة وشيقة حول ${effectiveTopic}`,
          `المحور الأول: ما هو ${effectiveTopic}؟ (المفاهيم الأساسية)`,
          `المحور الثاني: كيف نطبقه في حياتنا اليومية ومدرستنا الجزائرية؟`,
          `الخاتمة: ماذا تعلمنا ونصائح مفيدة للتفوق والتعاون`,
          `قائمة المراجع: الكتاب المدرسي المقرر (الديوان الوطني للمطبوعات المدرسية)`,
        ];
      } else if (stage === "secondary") {
        fallbackOutline = [
          `المقدمة: الإطار المنهجي وطرح الإشكالية الجوهرية لـ ${effectiveTopic}`,
          `المبحث الأول: التأسيس النظري والأبعاد المفاهيمية والعلمية`,
          ...(teacherParts.length > 0
            ? teacherParts.map((req, i) => `المبحث ${i + 2}: ${req} (مطلوب من الأستاذ المشرف)`)
            : [
                `المبحث الثاني: التحليل الميداني والإحصائي والتطبيقات في الجزائر`,
                `المبحث الثالث: الرؤية الاستشرافية والحلول في ضوء السياسات العامة`,
              ]),
          `الخاتمة: التركيب النهائي، حوصلة النتائج وآفاق البحث المنهجي`,
          `قائمة المصادر والمراجع الرسمية المعتمدة (ONPS / OPU)`,
        ];
      } else {
        // Middle school (التعليم المتوسط)
        fallbackOutline = [
          `المقدمة: الإطار العام والأهمية لموضوع ${effectiveTopic}`,
          `المبحث الأول: المفاهيم والنشأة التاريخية / العلمية`,
          ...(teacherParts.length > 0
            ? teacherParts.map((req, i) => `المبحث ${i + 2}: ${req} (مطلوب من الأستاذ المشرف)`)
            : [
                `المبحث الثاني: دراسة تفصيلية وتحليل واقعي للظاهرة في الجزائر`,
                `المبحث الثالث: التحديات والحلول وتوجيهات وزارة التربية الوطنية`,
              ]),
          `الخاتمة: الاستنتاجات العامة والتوصيات التربوية`,
          `قائمة المراجع والمصادر الرسمية المعتمدة (ديوان المطبوعات المدرسية ONPS)`,
        ];
      }
      setEduCustomPlan(fallbackOutline);
      setIsPlanReviewed(true);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // تحميل موضوع مقترح تلقائياً
  const applyPresetTopic = (presetId: string) => {
    const found = PRESET_TOPICS.find((p) => p.id === presetId);
    if (!found) return;

    setEduMode(found.mode);
    setEduLevel(found.level);
    setEduSubjectId(found.subjectId);
    setEduTopic(found.title);
    setEduCustomPlan(found.plan);
    setIsPlanReviewed(true);

    // اختيار سنة دراسية متوافقة
    const matchingGrade = ALGERIAN_GRADES.find((g) => g.level === found.level);
    if (matchingGrade) setEduGradeId(matchingGrade.id);

    // اختيار اللغة الافتراضية للمادة
    const subjectInfo = ALGERIAN_SUBJECTS[found.subjectId];
    if (subjectInfo) {
      setLanguage(subjectInfo.defaultLang);
    }

  };

  const calculateInvoiceTotal = () => {
    const subtotal = invoiceItems.reduce((acc, item) => acc + item.qty * item.price, 0);
    const tva = Math.round(subtotal * 0.19);
    const timbre = 50;
    return { subtotal, tva, timbre, total: subtotal + tva + timbre };
  };

  const getDynamicPricing = (serviceCode: string) => {
    if (serviceCode === "SCHOOL_RESEARCH" || serviceCode === "EXAMS") {
      return calculateEducationPricing(eduPageCount, eduMode, eduIncludeAnswerKey);
    }
    return { pointsCost: 10, defaultSaleDZD: 150 };
  };

  const generateDocument = (
    service: ServiceDefinition,
    points: number,
    onSuccess: (doc: GeneratedDocPayload) => void,
    onClose: () => void
  ) => {
    const pricing = getDynamicPricing(service.code);
    const cost = pricing.pointsCost;
    const isInsufficient = points < cost && !service.isFree;

    if (isInsufficient) {
      alert("رصيد نقاطك غير كافٍ. يُرجى شحن الرصيد أولاً.");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);

      const docType =
        service.code === "SCHOOL_RESEARCH" || service.code === "EXAMS"
          ? eduMode === "RESEARCH"
            ? "SCHOOL_RESEARCH"
            : "EXAM"
          : "SCHOOL_RESEARCH";

      const title =
        service.code === "SCHOOL_RESEARCH" || service.code === "EXAMS"
          ? `${eduMode === "RESEARCH" ? "بحث مدرسي" : "امتحان نموذجي"}: ${eduTopic} (${eduPageCount} ص)`
          : `${service.nameAr} (${customerName.trim() || "زبون المحل"})`;

      onSuccess({
        id: `doc_${Date.now()}`,
        title,
        type: docType,
        customerName: customerName.trim() || "تلميذ / زبون المحل",
        salePrice: pricing.defaultSaleDZD,
        pointsCost: cost,
      });

      onClose();
      // Trigger browser print queue
      setTimeout(() => {
        window.print();
      }, 400);
    }, 800);
  };

  const resetFields = () => {
    setCustomerName("");
    setPhone("");
    setDetails("");
  };

  return {
    customerName,
    setCustomerName,
    phone,
    setPhone,
    details,
    setDetails,
    isProcessing,
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
    calculateInvoiceTotal,
    // School Research & Exams (PRD v1.0)
    eduSubTab,
    setEduSubTab,
    eduMode,
    setEduMode,
    eduLevel,
    setEduLevel,
    eduGradeId,
    setEduGradeId,
    eduSubjectId,
    setEduSubjectId,
    eduTopic,
    setEduTopic,
    eduPageCount,
    setEduPageCount,
    eduStyleLevel,
    setEduStyleLevel,
    eduCoverTemplate,
    setEduCoverTemplate,
    eduIncludeReviewQuestions,
    setEduIncludeReviewQuestions,
    eduSchoolName,
    setEduSchoolName,
    eduTeacherName,
    setEduTeacherName,
    eduDirectorate,
    setEduDirectorate,
    eduTeacherRequirements,
    setEduTeacherRequirements,
    eduUnitId,
    setEduUnitId,
    eduUnitTitle,
    setEduUnitTitle,
    generatedPracticeExam,
    setGeneratedPracticeExam,
    eduTrimester,
    setEduTrimester,
    eduIncludeCover,
    setEduIncludeCover,
    eduIncludeOutline,
    setEduIncludeOutline,
    eduIncludeSources,
    setEduIncludeSources,
    eduIncludeAnswerKey,
    setEduIncludeAnswerKey,
    eduCurrentPagePreview,
    setEduCurrentPagePreview,
    eduCustomPlan,
    setEduCustomPlan,
    isGeneratingPlan,
    isPlanReviewed,
    generatePlanAsync,
    errorReportModal,
    setErrorReportModal,
    applyPresetTopic,
    getDynamicPricing,
    generateDocument,
    resetFields,
    // Guidance System Props
    currentSpec,
    setCurrentSpec,
    conformanceReport,
    setConformanceReport,
    isConformanceModalOpen,
    setIsConformanceModalOpen,
    fetchSpecForCurrentState,

  };
}
