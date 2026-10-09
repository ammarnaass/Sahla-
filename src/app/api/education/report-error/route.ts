import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trackEvent } from "@/lib/analytics";
import { DEFAULT_SHOP_ID } from "@/server/config/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      shopId = DEFAULT_SHOP_ID,
      docId = null,
      examId = null,
      issueType = "SCIENTIFIC_ERROR",
      description,
    } = body;

    if (!description || typeof description !== "string" || description.trim().length === 0) {
      return NextResponse.json({ error: "يرجى كتابة وصف للخطأ الملاحظ" }, { status: 400 });
    }

    const reportId = `rep_${Date.now()}`;
    db.prepare(`
      INSERT INTO error_reports (id, shop_id, doc_id, exam_id, issue_type, description, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'PENDING', datetime('now'))
    `).run(reportId, shopId, docId, examId, issueType, description.trim());

    trackEvent("error_reported", { reportId, issueType, shopId, docId, examId });

    return NextResponse.json({
      success: true,
      message: "تم إرسال البلاغ بنجاح إلى الفريق الأكاديمي لمراجعته فورياً. شكراً لمساهمتك في رفع جودة المحتوى.",
      reportId,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "حدث خطأ أثناء إرسال البلاغ" }, { status: 500 });
  }
}
