import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { GuidanceOrchestrator } from "@/server/education/guidance/guidanceOrchestrator";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const report = GuidanceOrchestrator.getConformanceReport(id);

    // Look up doc in research_jobs or research_docs
    const docRow = db.prepare(`SELECT * FROM research_docs WHERE id = ?`).get(id) as any;
    const jobRow = db.prepare(`SELECT * FROM research_jobs WHERE id = ?`).get(id) as any;

    if (!report && !docRow && !jobRow) {
      return NextResponse.json(
        { error: { code: "generation_not_found", message: `مهمة التوليد غير موجودة: ${id}` } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id,
      status: "done",
      conformance: report,
      files: {
        pdf: `/api/v1/research/jobs/${id}/export?format=pdf`,
        docx: `/api/v1/research/jobs/${id}/export?format=docx`,
      },
      result: docRow ? {
        title: docRow.title,
        grade: docRow.grade,
        subject: docRow.subject,
        pages: docRow.page_count,
        outline: JSON.parse(docRow.outline_json || "[]"),
        sections: JSON.parse(docRow.content_json || "[]"),
      } : jobRow ? JSON.parse(jobRow.result_json || "{}") : null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "generation_fetch_failed", message: err?.message } },
      { status: 500 }
    );
  }
}
