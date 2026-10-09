import { NextRequest, NextResponse } from "next/server";
import { LayoutService } from "@/server/education/formatting/layoutService";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const issues = LayoutService.auditLayout(id);
    return NextResponse.json({
      success: true,
      docId: id,
      count: issues.length,
      issues,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "فشل فحص مشكلات التنسيق" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = LayoutService.autoFixIssues(id);
    return NextResponse.json({
      success: true,
      docId: id,
      fixedCount: result.fixedCount,
      remainingIssues: result.remainingIssues,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "فشل تطبيق الإصلاحات الآلية للتنسيق" },
      { status: 500 }
    );
  }
}
