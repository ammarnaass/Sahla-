import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { runPracticeExamGenerator } from "@/server/education/skills/practiceExamGenerator";
import { WalletGuard } from "@/server/education/walletGuard";
import { trackEvent } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      stage = "middle",
      level = "4AM",
      subject = "MATHS",
      stream,
      trimester = 1,
      directorate = "مديرية التربية لولاية الجزائر (16)",
      school_name = "المؤسسة التعليمية النموذجية",
      exam_type = "exam",
      unit_ids = [],
      shop_id = "shop_1",
    } = body;

    const pointsCost = 5; // تكلفة توليد موضوع تدريبي كامل مع الحل النموذجي وسلم التنقيط

    // 1. Atomic wallet point reservation
    const reservation = WalletGuard.reservePoints(
      shop_id,
      pointsCost,
      `توليد اختبار تدريبي: ${subject} (${level})`
    );

    if (!reservation.ok) {
      return NextResponse.json(
        {
          error: {
            code: "insufficient_points",
            message: reservation.error || `رصيد النقاط لا يكفي لتوليد الاختبار التدريبي. مطلوب: ${pointsCost} نقاط، متوفر: ${reservation.newBalance}`,
          },
        },
        { status: 402 }
      );
    }

    const startTime = Date.now();

    // 2. Generate Practice Exam Model
    const practiceExam = runPracticeExamGenerator({
      stage,
      level,
      subject,
      stream,
      trimester,
      directorate,
      school_name,
      exam_type,
      unit_ids,
    });

    // 3. Settle wallet points
    WalletGuard.settlePoints(
      shop_id,
      pointsCost,
      `تثبيت خصم توليد الاختبار التدريبي: ${practiceExam.title}`
    );

    // 4. Save into exams table as PRACTICE
    const examContentFormatted = JSON.stringify({
      header: practiceExam.header,
      parts: practiceExam.parts,
      situation_integration: practiceExam.situation_integration,
      watermark: practiceExam.watermark,
      catalog_version: practiceExam.catalog_version,
    });

    const solutionContentFormatted = JSON.stringify({
      steps: practiceExam.solution.steps,
      situation_solution: practiceExam.solution.situation_solution,
    });

    db.prepare(`
      INSERT INTO exams (
        id, title, level, grade, stream, subject, trimester, year, session, type,
        pages_count, has_solution, exam_content, solution_content, marking_rubric,
        is_free, points_cost, downloads_count, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 2026, 'PRACTICE', 'PRACTICE', 2, 1, ?, ?, ?, 0, 2, 0, datetime('now'))
    `).run(
      practiceExam.id,
      practiceExam.title,
      stage.toUpperCase(),
      level.toUpperCase(),
      stream ? stream.toUpperCase() : null,
      subject.toUpperCase(),
      trimester,
      examContentFormatted,
      solutionContentFormatted,
      practiceExam.marking_rubric_summary
    );

    // 5. Record in skill_runs
    const durationMs = Date.now() - startTime;
    db.prepare(`
      INSERT INTO skill_runs (id, skill_name, job_id, model, input_json, output_json, duration_ms, created_at)
      VALUES (?, 'practice-exam-generator', ?, 'claude-sonnet-5-5', ?, ?, ?, datetime('now'))
    `).run(
      `sr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      practiceExam.id,
      JSON.stringify({ stage, level, subject, stream, trimester, exam_type }),
      JSON.stringify({ exam_id: practiceExam.id, title: practiceExam.title }),
      durationMs
    );

    trackEvent("practice_exam_generated", {
      examId: practiceExam.id,
      subject,
      level,
      stage,
      pointsCost,
    });

    return NextResponse.json({
      success: true,
      exam: practiceExam,
      points_charged: pointsCost,
      message: "تم توليد الاختبار التدريبي النموذجي مع الحل وسلم التنقيط بنجاح",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "generation_failed", message: error?.message || "فشل توليد الاختبار التدريبي" } },
      { status: 500 }
    );
  }
}
