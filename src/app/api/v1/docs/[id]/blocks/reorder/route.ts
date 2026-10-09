import { NextRequest, NextResponse } from "next/server";
import { LayoutService } from "@/server/education/formatting/layoutService";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "معرّف الوثيقة مفقود" }, { status: 400 });
    }

    const body = await req.json();
    const blockIds: string[] = body?.block_ids || body?.blockIds;

    if (!Array.isArray(blockIds) || blockIds.length === 0) {
      return NextResponse.json(
        { error: "يجب تمرير مصفوفة معرفات الكتل block_ids للترتيب" },
        { status: 400 }
      );
    }

    const updatedBlocks = LayoutService.reorderBlocks(id, blockIds);

    return NextResponse.json({
      success: true,
      blocks: updatedBlocks,
      message: "تم تحديث ترتيب الكتل بنجاح",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "تعذر إعادة ترتيب الكتل" },
      { status: 500 }
    );
  }
}
