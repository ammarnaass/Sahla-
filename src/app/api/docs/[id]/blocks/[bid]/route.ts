import { NextRequest, NextResponse } from "next/server";
import { LayoutService } from "@/server/education/formatting/layoutService";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; bid: string }> }
) {
  try {
    const { id, bid } = await params;
    const body = await req.json();

    const updated = LayoutService.patchBlock(id, bid, body);
    if (!updated) {
      return NextResponse.json({ error: "الكتلة غير موجودة" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      block: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "فشل تعديل الكتلة" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; bid: string }> }
) {
  try {
    const { id, bid } = await params;
    const ok = LayoutService.deleteBlock(id, bid);
    if (!ok) {
      return NextResponse.json({ error: "تعذر حذف الكتلة أو أنها غير موجودة" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      deletedBlockId: bid,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "فشل حذف الكتلة" },
      { status: 500 }
    );
  }
}
