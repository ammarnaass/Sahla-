import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { EducationOrchestrator } from "@/server/education/orchestrator";
import { ResearchPlan } from "@/server/education/types";
import { calculateJobPoints } from "@/server/education/config";
import { DEFAULT_SHOP_ID } from "@/server/config/constants";

export async function POST(req: NextRequest) {
  try {
    const idempotencyKey = req.headers.get("Idempotency-Key") || undefined;
    const body = await req.json();
    const {
      plan_id,
      cover = { template: "official", student: "تلميذ المؤسسة", school: "المؤسسة التعليمية" },
      shop_id = DEFAULT_SHOP_ID,
    } = body;

    if (!plan_id) {
      return NextResponse.json(
        { error: { code: "invalid_input", message: "معرف خطة البحث (plan_id) مطلوب" } },
        { status: 400 }
      );
    }

    // 1. Idempotency Check: prevent duplicate charges
    if (idempotencyKey) {
      const existingJob: any = db
        .prepare("SELECT * FROM research_jobs WHERE idempotency_key = ?")
        .get(idempotencyKey);

      if (existingJob) {
        return NextResponse.json({
          id: existingJob.id,
          status: existingJob.status,
          progress: existingJob.progress,
          reserved_points: existingJob.reserved_points,
          settled_points: existingJob.settled_points,
          reused: true,
        });
      }
    }

    // 2. Fetch the approved plan
    const planRow: any = db.prepare("SELECT * FROM research_plans WHERE id = ?").get(plan_id);
    if (!planRow) {
      return NextResponse.json(
        { error: { code: "not_found", message: "خطة البحث غير موجودة" } },
        { status: 404 }
      );
    }

    const plan: ResearchPlan = {
      id: planRow.id,
      shop_id: planRow.shop_id,
      stage: planRow.stage,
      level: planRow.level,
      subject: planRow.subject,
      topic: planRow.topic,
      language: planRow.language,
      pages: planRow.pages,
      style: planRow.style,
      options: planRow.options_json ? JSON.parse(planRow.options_json) : {},
      outline: JSON.parse(planRow.outline_json),
      cost_points: planRow.cost_points,
      estimate_points: planRow.estimate_points,
      status: "ready",
      created_at: planRow.created_at,
    };

    const jobId = `jb_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const costPoints = calculateJobPoints(plan.pages, plan.options);

    // 3. Register job in queued state
    db.prepare(`
      INSERT INTO research_jobs (
        id, plan_id, shop_id, status, progress, current_step,
        reserved_points, settled_points, idempotency_key, cover_json, created_at, updated_at
      )
      VALUES (?, ?, ?, 'queued', 0, 'queued', ?, 0, ?, ?, datetime('now'), datetime('now'))
    `).run(
      jobId,
      plan_id,
      shop_id,
      costPoints,
      idempotencyKey || null,
      JSON.stringify(cover)
    );

    // 4. Trigger synchronous or background orchestrator pipeline
    // For instant server response, we run the orchestration and return the completed job result
    const completedJob = await EducationOrchestrator.executeResearchJob(
      jobId,
      plan,
      shop_id,
      cover
    );

    return NextResponse.json({
      id: completedJob.id,
      status: completedJob.status,
      progress: completedJob.progress,
      reserved_points: completedJob.reserved_points,
      settled_points: completedJob.settled_points,
      result: completedJob.result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "generation_failed", message: error?.message || "فشل تنفيذ مهمة التوليد" } },
      { status: 500 }
    );
  }
}
