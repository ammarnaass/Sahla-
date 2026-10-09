import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AIProviderRouter } from "@/server/ai/providers/providerRouter";
import { runResearchPlanner } from "@/server/education/skills/researchPlanner";
import { runTopicIntake } from "@/server/education/skills/topicIntake";
import { calculateJobPoints } from "@/server/education/config";
import { ALGERIAN_SUBJECTS, ALGERIAN_GRADES } from "@/lib/educationConstants";
import { trackEvent } from "@/lib/analytics";
import { dispatchNotification } from "@/server/notifications/dispatcher";
import { DEFAULT_SHOP_ID } from "@/server/config/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      stage = "middle",
      level = 3,
      grade,
      subject = "HISTORY_GEO",
      topic,
      language = "ar",
      pages = 3,
      style = "moderate",
      doc_kind,
      docKind,
      options = {},
      shop_id = DEFAULT_SHOP_ID,
    } = body;

    const docKindFinal = (
      doc_kind ||
      docKind ||
      options?.doc_kind ||
      options?.docKind ||
      "RESEARCH"
    ).toUpperCase();

    const pageCountNum = Number(pages) || 3;
    const langFinal = (language || options?.language || "ar").toLowerCase();
    const styleFinal = (style || options?.style || "moderate").toLowerCase();
    const gradeStr = String(grade || level || (stage === "middle" ? "4AM" : stage === "secondary" ? "3AS" : "5AP"));

    const subjectNameAr = (ALGERIAN_SUBJECTS as any)[subject]?.nameAr || subject;
    const gradeObj = ALGERIAN_GRADES.find((g) => g.id === gradeStr);
    const gradeNameAr = gradeObj ? `${gradeObj.nameAr} (${gradeObj.id})` : gradeStr;

    const effectiveTopic =
      topic && typeof topic === "string" && topic.trim().length > 0
        ? topic.trim()
        : "بحث مدرسي شامل في مادة " + subjectNameAr;

    const numericLevel =
      typeof level === "number" ? level : parseInt(String(level)) || 3;

    // 1. Skill: topic-intake
    const intake = runTopicIntake({
      stage,
      level: numericLevel,
      subject,
      topic: effectiveTopic,
      language: langFinal as any,
    });

    if (intake.scope === "sensitive") {
      return NextResponse.json(
        {
          error: {
            code: "topic_out_of_scope",
            message: "الموضوع غير متوافق مع منهاج وزارة التربية الوطنية",
            suggestions: intake.suggestions,
          },
        },
        { status: 422 }
      );
    }

    let normalizedTopic = intake.normalized_topic || effectiveTopic;

    // 2. Skill: research-planner (AI Gateway with Algerian curriculum fallback)
    const teacherRequirements = options?.teacher_requirements || body.teacher_requirements;
    const unitId = options?.unit_id || body.unit_id;
    const unitTitle = options?.unit_title || body.unit_title;
    const university = options?.university || body.university;
    const faculty = options?.faculty || body.faculty;
    const specialty = options?.specialty || body.specialty;

    let planResult: any = null;
    let providerUsed = "curriculum-rules";
    let summaryAr = "";
    let detectedTypoCorrection: string | undefined = undefined;

    try {
      const stageName =
        docKindFinal === "THESIS" || stage === "university"
          ? "التعليم العالي والجامعي / التكوين المهني"
          : stage === "primary"
          ? "الطور الابتدائي"
          : stage === "secondary"
          ? "الطور الثانوي"
          : "الطور المتوسط";

      const docKindNameAr =
        docKindFinal === "THESIS"
          ? "مذكرة تخرج جامعية / تقني سامي"
          : docKindFinal === "PEDAGOGIC"
          ? "مذكرة بيداغوجية للأستاذ (جذاذة تحضير درس)"
          : docKindFinal === "SUMMARY"
          ? "ملخص ومراجعة درس شاملة"
          : "بحث مدرسي رسمي متكامل";

      // Tailored system prompt based on document kind
      let systemPrompt = "";
      if (docKindFinal === "THESIS") {
        systemPrompt = `أنت أستاذ محاضر ومؤطر مذكرات تخرج في الجامعات الجزائرية (وزارة التعليم العالي والبحث العلمي).
مهمتك إعداد خطة وفهرس مذكرة تخرج أو بحث تخرج تقني سامي رصينة ومحكمة المنهجية، تتضمن الإشكالية المركزية، الفرضيات، الإطار المفاهيمي والنظري، الدراسة الميدانية التطبيقية في البيئة والمؤسسات الجزائرية، النتائج والتوصيات، وقائمة المراجع الأكاديمية الرسمية (وفق معايير التوثيق APA).`;
      } else if (docKindFinal === "PEDAGOGIC") {
        systemPrompt = `أنت مفتش تربوي معتمد بوزارة التربية الوطنية الجزائرية (مناهج الجيل الثاني).
مهمتك إعداد خطة مذكرة بيداغوجية للأستاذ (جذاذة درس) تتضمن الكفاءات المستهدفة، مراحل الانطلاق والوضعية المشكلة، مراحل بناء التعلمات والأنشطة الإدماجية، مرحلة الاستثمار والتقويم والواجب المنزلي، والسندات الرسمية المعتمدة.`;
      } else if (docKindFinal === "SUMMARY") {
        systemPrompt = `أنت أستاذ ومستشار تربوي متخصص في تبسيط المناهج الجزائرية وإعداد الملخصات الاستراتيجية للامتحانات الرسمية (BEM / BAC).
مهمتك إعداد خطة ملخص درس استراتيجي تشمل خرائط المفاهيم، القواعد الجوهرية، الجداول المقارنة، وتطبيقات وأسئلة امتحانات سابقة نموذجية.`;
      } else {
        systemPrompt = `أنت خبير تربوي ومفتش مناهج معتمد في المنظومة التربوية الجزائرية (وزارة التربية الوطنية).
مهمتك وضع خطة بحث وفهرس محاور أكاديمي متناسق ومتدرج لمنهاج الجيل الثاني يربط بين المفاهيم والشواهد والأمثلة من التاريخ والواقع الجزائري، مع التزام تام بأي عناصر يطلبها الأستاذ المشرف.`;
      }

      // Exact count and structural rules based on requested page count
      let pagesInstruction = "";
      if (pageCountNum <= 1) {
        pagesInstruction = `- حجم المستند المطلوب: صفحة واحدة فقط (1 صفحة).
- الهيكل المطلوب: خطة مركزة وموجزة جداً من 3 عناصر بالضبط في مصفوفة outline:
  1. مقدمة موجزة
  2. عرض شامل مركز
  3. خاتمة وخلاصة`;
      } else if (pageCountNum === 2) {
        pagesInstruction = `- حجم المستند المطلوب: صفحتان (2 صفحتين).
- الهيكل المطلوب: خطة متوازنة من 4 عناصر بالضبط في مصفوفة outline:
  1. مقدمة
  2. مبحث أول
  3. مبحث ثانٍ
  4. خاتمة`;
      } else if (pageCountNum === 3) {
        pagesInstruction = `- حجم المستند المطلوب: 3 صفحات.
- الهيكل المطلوب: خطة متكاملة من 5 عناصر بالضبط في مصفوفة outline:
  1. مقدمة
  2. مبحث أول
  3. مبحث ثانٍ
  4. خاتمة
  5. قائمة المراجع الرسمية المعتمدة`;
      } else if (pageCountNum === 5) {
        pagesInstruction = `- حجم المستند المطلوب: 5 صفحات.
- الهيكل المطلوب: خطة تفصيلية وغنية من 6 عناصر بالضبط في مصفوفة outline:
  1. مقدمة وطرح الإشكالية
  2. مبحث أول تفصيلي
  3. مبحث ثانٍ مدعوم بالشواهد الجزائرية
  4. مبحث ثالث تحليلي
  5. خاتمة واستنتاجات
  6. فهرس المصادر والمراجع`;
      } else {
        // 10+ pages
        pagesInstruction = `- حجم المستند المطلوب: ${pageCountNum} صفحات (مذكرة / بحث موسع).
- الهيكل المطلوب: خطة أكاديمية واسعة ومعمقة من 8 إلى 10 عناصر وفصول في مصفوفة outline: مقدمة عامة وإشكالية وفرضيات، فصول ومباحث متفرعة تغطي الجوانب النظرية والتطبيقية الميدانية في الجزائر، مناقشة النتائج، خاتمة وتوصيات عملية، وفهرس المراجع والمصادر الوطنية.`;
      }

      // Language instruction
      let langInstruction = "";
      if (langFinal === "fr") {
        langInstruction = `- لغة المستند والطباعة المطلوبة: الفرنسية (Français).
يجب أن تكون جميع عناوين العناصر في outline باللغة الفرنسية السليمة والأكاديمية (مثل: Introduction, Axe 1: ..., Conclusion).`;
      } else if (langFinal === "en") {
        langInstruction = `- لغة المستند والطباعة المطلوبة: الإنجليزية (English).
يجب أن تكون جميع عناوين العناصر في outline باللغة الإنجليزية السليمة والأكاديمية (مثل: Introduction, Section 1: ..., Conclusion).`;
      } else {
        langInstruction = `- لغة المستند والطباعة المطلوبة: اللغة العربية الفصحى السليمة.`;
      }

      const styleDescription =
        styleFinal === "simple"
          ? "بسيط (جمل واضحة ومباشرة للتلاميذ)"
          : styleFinal === "advanced"
          ? "متقدم (تحليلي ومصطلحات تخصصية رصينة)"
          : "متوسط (غني بالأمثلة والشواهد والتطبيقات الواقعية)";

      const aiResponse = await AIProviderRouter.run({
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `المطلوب: إعداد خطة وفهرس أكاديمي متكامل للموضوع: "${normalizedTopic}"
- نوع الوثيقة الأكاديمية: ${docKindNameAr}
- الطور والمستوى: ${stageName} (${gradeNameAr})
- المادة الدراسية / التخصص: ${subjectNameAr}
${university ? `- الجامعة / المعهد: "${university}"` : ""}
${faculty ? `- الكلية / القسم: "${faculty}"` : ""}
${specialty ? `- التخصص الدقيق: "${specialty}"` : ""}
- مستوى الصياغة والأسلوب: ${styleDescription}
${pagesInstruction}
${langInstruction}
${teacherRequirements ? `- توجيهات وعناصر الأستاذ المشرف الإلزامية: "${teacherRequirements}"` : ""}
${unitTitle ? `- المقطع التعليمي: "${unitTitle}"` : ""}

ملاحظة هامة جداً:
إذا كان في عنوان الموضوع خطأ إملائي أو مطبعي غير مقصود (مثل "مجمد مصالي الحاج" بدلاً من "محمد مصالي الحاج")، قم بتصحيحه تلقائياً وضع العنوان المصحح في حقل "corrected_topic"، واستخدم الاسم المصحح في صياغة المحاور.

أرجع النتيجة بصيغة JSON حصراً بالشكل التالي دون أي نصوص أو markdown قبله أو بعده:
{
  "corrected_topic": "العنوان المصحح والمدقق لغوياً (مثال: 'محمد مصالي الحاج')",
  "summary_ar": "ملخص منهجي موجز يوضح انسجام الخطة مع الحجم المختار (${pageCountNum} صفحات) والمعايير المعتمدة",
  "outline": [
    { "id": "s1", "title": "عنوان المحور...", "type": "intro", "target_words": 150 }
  ]
}`,
          },
        ],
        schema: true,
        maxTokens: 1500,
        temperature: 0.2,
        timeoutMs: 35000,
        metadata: { skill: "section-writer", jobId: "plan_gen" },
      });

      if (aiResponse && aiResponse.text) {
        let cleanText = aiResponse.text.trim();
        const firstBrace = cleanText.indexOf("{");
        const lastBrace = cleanText.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          cleanText = cleanText.substring(firstBrace, lastBrace + 1);
        }
        let parsed: any = null;
        try {
          parsed = JSON.parse(cleanText);
        } catch {
          if (aiResponse.json) parsed = aiResponse.json;
        }
        if (parsed && Array.isArray(parsed.outline) && parsed.outline.length > 0) {
          planResult = {
            outline: parsed.outline,
            total_target_words: parsed.outline.reduce((acc: number, item: any) => acc + (item.target_words || 200), 0),
          };
          summaryAr = parsed.summary_ar || `تمت صياغة الخطة بواسطة الذكاء الاصطناعي (${aiResponse.providerId}) لتناسب ${pageCountNum} صفحات.`;
          providerUsed = aiResponse.providerId;

          if (parsed.corrected_topic && typeof parsed.corrected_topic === "string" && parsed.corrected_topic.trim().length > 2) {
            const trimmed = parsed.corrected_topic.trim();
            detectedTypoCorrection = trimmed;
            normalizedTopic = trimmed;
          }
        }
      }
    } catch (aiErr) {
      console.error("[ResearchPlansAPI] AI Provider fallback to rules:", aiErr);
    }

    if (!planResult) {
      planResult = runResearchPlanner({
        topic: normalizedTopic,
        stage: stage as any,
        level: numericLevel,
        pages: pageCountNum,
        style: styleFinal as any,
        language: langFinal as any,
        teacher_requirements: teacherRequirements,
        unit_id: unitId,
        unit_title: unitTitle,
        doc_kind: docKindFinal,
      });
      summaryAr = `تمت صياغة الخطة وفق معايير المنهاج الوطني الجزائري لـ ${pageCountNum} صفحات.`;
    }

    const planId = `pl_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const estimatedPoints = calculateJobPoints(pages, options);

    const directorate = options?.directorate || body.directorate;
    const schoolName = options?.school_name || body.school_name;
    const studentName = options?.student_name || body.student_name;
    const teacherName = options?.teacher_name || body.teacher_name;

    // Merge options with PRD 2.0 metadata
    const finalOptions = {
      ...options,
      teacher_requirements: teacherRequirements,
      unit_id: unitId,
      unit_title: unitTitle,
      directorate,
      school_name: schoolName,
      student_name: studentName,
      teacher_name: teacherName,
      catalog_version: "2026.1",
    };

    // Save in research_plans table
    try {
      db.prepare(`
        INSERT INTO research_plans (
          id, shop_id, stage, level, subject, topic, language, pages, style,
          options_json, outline_json, cost_points, estimate_points, status, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, 'ready', datetime('now'))
      `).run(
        planId,
        shop_id || DEFAULT_SHOP_ID,
        stage,
        numericLevel,
        subject,
        normalizedTopic,
        language,
        pages,
        style,
        JSON.stringify(finalOptions),
        JSON.stringify(planResult.outline),
        estimatedPoints
      );
    } catch (dbErr) {
      console.error("Non-fatal: could not persist research plan to db", dbErr);
    }

    trackEvent("research_plan_created", {
      planId,
      topic: intake.normalized_topic,
      stage,
      level,
      pages,
    });

    // Dispatch real-time live notification
    dispatchNotification({
      shopId: shop_id || DEFAULT_SHOP_ID,
      type: "AI_PLAN_READY",
      priority: "NORMAL",
      title: "اكتملت خطة البحث بالذكاء الاصطناعي ⚡",
      body: `تم إعداد خطة وفهرس "${normalizedTopic}" بنجاح ومطابقتها للمنهاج الجزائري.`,
      actionUrl: "/dashboard?tab=services",
      actionLabel: "معاينة الخطة",
      meta: { planId, topic: normalizedTopic, stage, level },
    }).catch((notifErr) => console.warn("Failed to dispatch plan notification:", notifErr));

    return NextResponse.json({
      id: planId,
      status: "ready",
      cost_points: 0,
      estimate_points: estimatedPoints,
      outline: planResult.outline,
      summary_ar: summaryAr,
      provider: providerUsed,
      normalized_topic: normalizedTopic,
      corrected_topic: detectedTypoCorrection || (normalizedTopic !== effectiveTopic ? normalizedTopic : undefined),
      scope_note: intake.scope === "too_broad" ? "الموضوع واسع ويمكن تضييقه لنتائج أدق" : undefined,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "server_error", message: error?.message || "فشل إنشاء الخطة" } },
      { status: 500 }
    );
  }
}
