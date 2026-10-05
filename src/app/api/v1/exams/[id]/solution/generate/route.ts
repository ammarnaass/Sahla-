import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { runSolutionDrafter } from "@/server/education/skills/solutionDrafter";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const exam: any = db.prepare("SELECT * FROM exams WHERE id = ?").get(id);
    if (!exam) {
      return NextResponse.json(
        { error: { code: "not_found", message: "الامتحان غير موجود" } },
        { status: 404 }
      );
    }

    const startTime = Date.now();
    const drafted = runSolutionDrafter({
      examTitle: exam.title,
      examContent: exam.exam_content,
      markingRubric: exam.marking_rubric,
    });

    const solutionText = drafted.parts
      .map(
        (p) =>
          `### ${p.part_title} (${p.points} نقطة)\n` +
          p.steps.map((s) => `- **${s.step_ref}** (${s.points_allocated} ن): ${s.answer}`).join("\n")
      )
      .join("\n\n");

    const rubricText = drafted.parts
      .map((p) => `${p.part_title}: مجموع ${p.points} ن`)
      .join(" | ");

    // Update exam record
    db.prepare(`
      UPDATE exams
      SET solution_content = ?, marking_rubric = ?, has_solution = 1
      WHERE id = ?
    `).run(solutionText, rubricText, id);

    // Record skill run
    const durationMs = Date.now() - startTime;
    db.prepare(`
      INSERT INTO skill_runs (id, skill_name, job_id, model, input_json, output_json, duration_ms, created_at)
      VALUES (?, 'solution-drafter', ?, 'claude-sonnet-5-5', ?, ?, ?, datetime('now'))
    `).run(
      `sr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      id,
      JSON.stringify({ exam_id: id, title: exam.title }),
      JSON.stringify(drafted),
      durationMs
    );

    return NextResponse.json({
      success: true,
      exam_id: id,
      status: "draft",
      review_required: true,
      solution_content: solutionText,
      marking_rubric: rubricText,
      message: "تم توليد مسودة الحل والسلّم بنجاح، وهي جاهزة للاعتماد والمراجعة الأكاديمية.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "generation_failed", message: error?.message || "فشل توليد مسودة الحل" } },
      { status: 500 }
    );
  }
}
