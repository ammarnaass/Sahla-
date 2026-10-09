import { NextRequest, NextResponse } from "next/server";
import { LayoutService } from "@/server/education/formatting/layoutService";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "معرّف الوثيقة مفقود" }, { status: 400 });
    }

    const blocks = LayoutService.getBlocks(id);
    return NextResponse.json({
      success: true,
      docId: id,
      count: blocks.length,
      blocks,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "فشل جلب كتل الوثيقة" },
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
    const body = await req.json();

    if (!body || !body.type) {
      return NextResponse.json({ error: "نوع الكتلة مطلوب" }, { status: 400 });
    }

    const blocks = LayoutService.getBlocks(id);
    const order_num = body.order_num ?? blocks.length + 1;
    const blockId = body.id || `b_${id}_${Date.now()}`;

    const newBlock = LayoutService.upsertBlock(id, {
      id: blockId,
      order_num,
      type: body.type,
      content: body.content || {},
      style: body.style,
      page_break_before: Boolean(body.page_break_before),
      keep_with_next: Boolean(body.keep_with_next),
    });

    return NextResponse.json({
      success: true,
      block: newBlock,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "فشل إنشاء الكتلة" },
      { status: 500 }
    );
  }
}
