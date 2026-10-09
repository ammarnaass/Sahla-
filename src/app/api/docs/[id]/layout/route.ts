import { NextRequest, NextResponse } from "next/server";
import { LayoutService } from "@/server/education/formatting/layoutService";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const settings = LayoutService.getLayoutSettings(id);
    return NextResponse.json({
      success: true,
      docId: id,
      settings,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "فشل جلب إعدادات التنسيق" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = LayoutService.updateLayoutSettings(id, body);
    return NextResponse.json({
      success: true,
      settings: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "فشل تحديث إعدادات التنسيق" },
      { status: 500 }
    );
  }
}
