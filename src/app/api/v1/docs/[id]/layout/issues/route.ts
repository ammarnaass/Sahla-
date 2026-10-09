import { NextRequest, NextResponse } from "next/server";
import { LayoutService } from "@/server/education/formatting/layoutService";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "معرّف الوثيقة مفقود" }, { status: 400 });
    }

    const issues = LayoutService.auditLayout(id);

    return NextResponse.json({
      doc_id: id,
      total_issues: issues.length,
      critical_count: issues.filter((i) => i.severity === "critical").length,
      high_count: issues.filter((i) => i.severity === "high").length,
      medium_count: issues.filter((i) => i.severity === "medium").length,
      issues,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "تعذر فحص مشكلات التنسيق" },
      { status: 500 }
    );
  }
}
