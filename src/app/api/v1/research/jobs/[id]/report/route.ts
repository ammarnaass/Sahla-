import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { DEFAULT_SHOP_ID } from "@/server/config/constants";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const body = await req.json().catch(() => ({}));
    const { issue_type = "academic_accuracy", description = "", section_id } = body;

    if (!description || description.trim().length === 0) {
      return NextResponse.json(
        { error: { code: "invalid_input", message: "يرجى كتابة وصف للخطأ أو الملاحظة" } },
        { status: 400 }
      );
    }

    const job: any = db.prepare("SELECT * FROM research_jobs WHERE id = ?").get(jobId);
    if (!job) {
      return NextResponse.json(
        { error: { code: "not_found", message: "المهمة غير موجودة" } },
        { status: 404 }
      );
    }

    const reportId = `rep_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const fullDescription = section_id
      ? `[فقرة: ${section_id}] ${description.trim()}`
      : description.trim();

    db.prepare(`
      INSERT INTO error_reports (id, shop_id, doc_id, exam_id, issue_type, description, status, created_at)
      VALUES (?, ?, ?, NULL, ?, ?, 'pending', datetime('now'))
    `).run(
      reportId,
      job.shop_id || DEFAULT_SHOP_ID,
      jobId,
      issue_type,
      fullDescription
    );

    return NextResponse.json({
      report_id: reportId,
      job_id: jobId,
      status: "received",
      message: "تم تسجيل البلاغ بنجاح وسيقوم الفريق الأكاديمي بمراجعته",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "report_failed", message: error?.message || "فشل تسجيل البلاغ" } },
      { status: 500 }
    );
  }
}
