import { NextRequest, NextResponse } from "next/server";
import { LayoutService } from "@/server/education/formatting/layoutService";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blocks = LayoutService.getBlocks(id);
    const settings = LayoutService.getLayoutSettings(id);
    const assets = LayoutService.getAssets(id);
    const issues = LayoutService.auditLayout(id);

    return NextResponse.json({
      success: true,
      docId: id,
      blocks,
      settings,
      assets,
      issues,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "فشل جلب بيانات المعاينة" },
      { status: 500 }
    );
  }
}
