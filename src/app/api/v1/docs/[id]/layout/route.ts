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

    const settings = LayoutService.getLayoutSettings(id);
    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "تعذر جلب إعدادات التنسيق" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "معرّف الوثيقة مفقود" }, { status: 400 });
    }

    const body = await req.json();
    const updated = LayoutService.updateLayoutSettings(id, body);

    return NextResponse.json({
      success: true,
      settings: updated,
      message: "تم تحديث إعدادات التنسيق بنجاح",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "تعذر تحديث إعدادات التنسيق" },
      { status: 500 }
    );
  }
}
