import { NextRequest, NextResponse } from "next/server";
import { LayoutService } from "@/server/education/formatting/layoutService";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string; bid: string }> }
) {
  try {
    const { id, bid } = await context.params;
    if (!id || !bid) {
      return NextResponse.json({ error: "معرّف الوثيقة أو الكتلة مفقود" }, { status: 400 });
    }

    const block = LayoutService.getBlock(id, bid);
    if (!block) {
      return NextResponse.json({ error: "الكتلة غير موجودة" }, { status: 404 });
    }

    return NextResponse.json({ block });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "خطأ في جلب الكتلة" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string; bid: string }> }
) {
  try {
    const { id, bid } = await context.params;
    if (!id || !bid) {
      return NextResponse.json({ error: "معرّف الوثيقة أو الكتلة مفقود" }, { status: 400 });
    }

    const body = await req.json();
    const updated = LayoutService.patchBlock(id, bid, body);
    if (!updated) {
      return NextResponse.json({ error: "الكتلة غير موجودة للتعديل" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      block: updated,
      message: "تم تعديل الكتلة بنجاح",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "تعذر تعديل الكتلة" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string; bid: string }> }
) {
  try {
    const { id, bid } = await context.params;
    if (!id || !bid) {
      return NextResponse.json({ error: "معرّف الوثيقة أو الكتلة مفقود" }, { status: 400 });
    }

    const deleted = LayoutService.deleteBlock(id, bid);
    if (!deleted) {
      return NextResponse.json({ error: "الكتلة غير موجودة للحذف" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "تم حذف الكتلة بنجاح",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "تعذر حذف الكتلة" },
      { status: 500 }
    );
  }
}
