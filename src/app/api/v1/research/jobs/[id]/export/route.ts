import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { runFormatterRenderer } from "@/server/education/skills/formatterRenderer";
import { FinalResearchDocument } from "@/server/education/types";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const body = await req.json().catch(() => ({}));
    const { format = "pdf", watermark = false } = body;

    const job: any = db.prepare("SELECT * FROM research_jobs WHERE id = ?").get(jobId);
    if (!job) {
      return NextResponse.json(
        { error: { code: "not_found", message: "المهمة غير موجودة" } },
        { status: 404 }
      );
    }

    if (!job.result_json) {
      return NextResponse.json(
        { error: { code: "not_ready", message: "محتوى البحث غير مكتمل بعد للتصدير" } },
        { status: 400 }
      );
    }

    const document: FinalResearchDocument = JSON.parse(job.result_json);

    // Call Formatter Renderer skill
    const renderResult = runFormatterRenderer({
      document,
      watermark: watermark ? "منصة سهلة · جاهز للطباعة" : undefined,
    });

    const exportFileName = `sahla_${document.meta.subject}_${document.meta.stage}_${jobId}`;

    return NextResponse.json({
      job_id: jobId,
      format,
      pages: renderResult.pages_estimated,
      title: document.cover.title,
      html_preview: renderResult.html,
      pdf_url: `/api/v1/research/jobs/${jobId}/download?format=pdf`,
      docx_url: `/api/v1/research/jobs/${jobId}/download?format=docx`,
      download_filename: `${exportFileName}.${format}`,
      status: "ready",
      message: "تم تجهيز ملف التصدير بنجاح",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "export_failed", message: error?.message || "فشل تصدير الوثيقة" } },
      { status: 500 }
    );
  }
}
