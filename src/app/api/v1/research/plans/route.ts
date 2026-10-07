import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AIProviderRouter } from "@/server/ai/providers/providerRouter";
import { runResearchPlanner } from "@/server/education/skills/researchPlanner";
import { runTopicIntake } from "@/server/education/skills/topicIntake";
import { calculateJobPoints } from "@/server/education/config";
import { trackEvent } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      stage = "middle",
      level = 3,
      subject = "HISTORY_GEO",
      topic,
      language = "ar",
      pages = 5,
      style = "moderate",
      options = { images: 2, table: true },
      shop_id = "shop_1",
    } = body;

    const effectiveTopic =
      topic && typeof topic === "string" && topic.trim().length > 0
        ? topic.trim()
        : "بحث مدرسي شامل في مادة " + subject;

    const numericLevel =
      typeof level === "number" ? level : parseInt(String(level)) || 3;

    // 1. Skill: topic-intake
    const intake = runTopicIntake({
      stage,
      level: numericLevel,
      subject,
      topic: effectiveTopic,
      language,
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

    const normalizedTopic = intake.normalized_topic || effectiveTopic;

    // 2. Skill: research-planner (AI Gateway with Algerian curriculum fallback)
    const teacherRequirements = options?.teacher_requirements || body.teacher_requirements;
    const unitId = options?.unit_id || body.unit_id;
    const unitTitle = options?.unit_title || body.unit_title;

    let planResult: any = null;
    let providerUsed = "curriculum-rules";
    let summaryAr = "";

    try {
      const stageName = stage === "primary" ? "الابتدائي" : stage === "secondary" ? "الثانوي" : "المتوسط";
      const aiResponse = await AIProviderRouter.run({
        system: `أنت خبير تربوي ومفتش مناهج معتمد في المنظومة التربوية الجزائرية (وزارة التربية الوطنية). مهمتك وضع خطة بحث وفهرس محاور أكاديمي متناسق ومتدرج لمنهاج الجيل الثاني. ركّز على الشواهد والأمثلة من الواقع الجزائري، والتزم بأي عناصر وتوجيهات يطلبها الأستاذ المشرف.`,
        messages: [
          {
            role: "user",
            content: `المطلوب: إعداد خطة وفهرس بحث مدرسي متكامل لموضوع: "${normalizedTopic}"
- الطور: ${stageName} (المستوى: ${numericLevel})
- المادة: ${subject}
- عدد الصفحات المقدرة: ${pages}
${teacherRequirements ? `- توجيهات وعناصر الأستاذ المشرف الإلزامية: "${teacherRequirements}"` : ""}
${unitTitle ? `- المقطع التعليمي: "${unitTitle}"` : ""}

أرجع النتيجة بصيغة JSON حصراً بالشكل التالي:
{
  "summary_ar": "ملخص منهجي موجز عن محاور الخطة وانسجامها مع المنهاج الجزائري",
  "outline": [
    { "id": "s1", "title": "المقدمة: ...", "type": "intro", "target_words": 150 },
    { "id": "s2", "title": "المبحث الأول: ...", "type": "body", "target_words": 300 },
    { "id": "s3", "title": "المبحث الثاني: ...", "type": "body", "target_words": 300 },
    { "id": "s4", "title": "الخاتمة: ...", "type": "conclusion", "target_words": 150 }
  ]
}`,
          },
        ],
        maxTokens: 1400,
        temperature: 0.3,
        metadata: { skill: "section-writer", jobId: "plan_gen" },
      });

      if (aiResponse && aiResponse.text) {
        let cleanText = aiResponse.text.trim();
        if (cleanText.startsWith("```json")) cleanText = cleanText.substring(7);
        if (cleanText.startsWith("```")) cleanText = cleanText.substring(3);
        if (cleanText.endsWith("```")) cleanText = cleanText.substring(0, cleanText.length - 3);
        const parsed = JSON.parse(cleanText.trim());
        if (Array.isArray(parsed.outline) && parsed.outline.length > 0) {
          planResult = {
            outline: parsed.outline,
            total_target_words: parsed.outline.reduce((acc: number, item: any) => acc + (item.target_words || 200), 0),
          };
          summaryAr = parsed.summary_ar || "تمت صياغة الخطة بواسطة الذكاء الاصطناعي وفق المنهاج الجزائري";
          providerUsed = aiResponse.providerId;
        }
      }
    } catch (aiErr) {
      console.warn("[ResearchPlansAPI] AI Provider fallback to rules:", (aiErr as any)?.message);
    }

    if (!planResult) {
      planResult = runResearchPlanner({
        topic: normalizedTopic,
        stage,
        level: numericLevel,
        pages,
        style,
        language,
        teacher_requirements: teacherRequirements,
        unit_id: unitId,
        unit_title: unitTitle,
      });
      summaryAr = "تمت صياغة الخطة وفق معايير المنهاج الوطني الجزائري الرسمي (الجيل الثاني)";
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
        shop_id || "shop_1",
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

    return NextResponse.json({
      id: planId,
      status: "ready",
      cost_points: 0,
      estimate_points: estimatedPoints,
      outline: planResult.outline,
      summary_ar: summaryAr,
      provider: providerUsed,
      scope_note: intake.scope === "too_broad" ? "الموضوع واسع ويمكن تضييقه لنتائج أدق" : undefined,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "server_error", message: error?.message || "فشل إنشاء الخطة" } },
      { status: 500 }
    );
  }
}
