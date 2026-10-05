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

  const [eduCustomPlan, setEduCustomPlan] = useState<string[]>([
    "مقدمة: دوافع انطلاق الثورة التحريرية وبيان أول نوفمبر 1954",
    "المبحث الأول: المراحل الكبرى للثورة ومؤتمر الصومام 1956",
    "المبحث الثاني: المظاهرات الشعبية ومفاوضات إيفيان واسترجاع السيادة",
    "خاتمة: تضحيات الشهداء ومكانة الجزائر الدولية بعد الاستقلال",
    "قائمة المراجع: تاريخ الثورة الجزائرية - ديوان المطبوعات المدرسية",
  ]);

  // Step 1: توليد خطة البحث أولاً ومراجعتها مجاناً (PRD Section 5.1 & v2.0 Teacher Requirements)
  const generatePlanAsync = async () => {
    setIsGeneratingPlan(true);
    try {
      const res = await fetch("/api/v1/research/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: eduLevel.toLowerCase(),
          level: eduGradeId,
          subject: eduSubjectId,
          topic: eduTopic,
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
      const data = await res.json();
      if (Array.isArray(data.outline)) {
        setEduCustomPlan(data.outline.map((o: any) => o.title));
        setIsPlanReviewed(true);
      }
    } catch {
      // Keep existing plan on error
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
    if (serviceCode === "SCHOOL_RESEARCH") {
      return calculateEducationPricing(eduPageCount, eduMode, eduIncludeAnswerKey);
    }
    if (serviceCode === "CV_GEN") return { pointsCost: 15, defaultSaleDZD: 250 };
    if (serviceCode === "ID_PHOTO") return { pointsCost: 0, defaultSaleDZD: 200 };
    if (serviceCode === "INVOICE") return { pointsCost: 10, defaultSaleDZD: 350 };
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
        service.code === "SCHOOL_RESEARCH"
          ? eduMode === "RESEARCH"
            ? "SCHOOL_RESEARCH"
            : "EXAM"
          : service.code === "CV_GEN"
          ? "CV"
          : service.code === "ID_PHOTO"
          ? "ID_PHOTO"
          : service.code === "INVOICE"
          ? "INVOICE"
          : "FORM";

      const title =
        service.code === "SCHOOL_RESEARCH"
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
  };
}
