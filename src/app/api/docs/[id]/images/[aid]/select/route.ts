import { NextRequest, NextResponse } from "next/server";
import { LayoutService } from "@/server/education/formatting/layoutService";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; aid: string }> }
) {
  try {
    const { id, aid } = await params;
    let blockId: string | undefined = undefined;

    try {
      const body = await req.json();
      blockId = body?.blockId;
    } catch {
      // Body may be empty
    }

    const selectedAsset = LayoutService.selectAsset(id, aid, blockId);
    if (!selectedAsset) {
      return NextResponse.json(
        { error: "الصورة المحددة غير موجودة في أصول الوثيقة" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      selectedAsset,
      boundBlockId: blockId,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "فشل اعتماد الصورة" },
      { status: 500 }
    );
  }
}
