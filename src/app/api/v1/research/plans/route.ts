import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
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

    // 2. Skill: research-planner (v2.0 with teacher requirements and unit grounding)
    const teacherRequirements = options?.teacher_requirements || body.teacher_requirements;
    const unitId = options?.unit_id || body.unit_id;
    const unitTitle = options?.unit_title || body.unit_title;

    const planResult = runResearchPlanner({
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
      scope_note: intake.scope === "too_broad" ? "الموضوع واسع ويمكن تضييقه لنتائج أدق" : undefined,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "server_error", message: error?.message || "فشل إنشاء الخطة" } },
      { status: 500 }
    );
  }
}
