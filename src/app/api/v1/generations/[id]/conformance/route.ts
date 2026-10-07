import { NextRequest, NextResponse } from "next/server";
import { GuidanceOrchestrator } from "@/server/education/guidance/guidanceOrchestrator";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const report = GuidanceOrchestrator.getConformanceReport(id);
    if (!report) {
      return NextResponse.json(
        { error: { code: "report_not_found", message: `تقرير المطابقة غير موجود للتوليد: ${id}` } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      generation_id: id,
      conformance: report,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "conformance_fetch_failed", message: err?.message } },
      { status: 500 }
    );
  }
}
