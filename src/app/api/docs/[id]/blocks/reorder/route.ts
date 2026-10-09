import { NextRequest, NextResponse } from "next/server";
import { LayoutService } from "@/server/education/formatting/layoutService";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body || !Array.isArray(body.blockIds)) {
      return NextResponse.json(
        { error: "يجب تقديم مصفوفة blockIds لإعادة الترتيب" },
        { status: 400 }
      );
    }

    const reordered = LayoutService.reorderBlocks(id, body.blockIds);
    return NextResponse.json({
      success: true,
      blocks: reordered,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "فشل إعادة ترتيب الكتل" },
      { status: 500 }
    );
  }
}
