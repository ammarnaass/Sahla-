import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureFormattingTables } from "@/server/education/formatting/dbMigration";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string; aid: string }> }
) {
  try {
    ensureFormattingTables();
    const { id, aid } = await context.params;
    if (!id || !aid) {
      return NextResponse.json({ error: "المعرفات المطلوبة مفقودة" }, { status: 400 });
    }

    let updates: any = {};
    try {
      updates = await req.json();
    } catch {}

    const caption = updates.caption;
    const figureNumber = updates.figure_number;

    db.prepare(`
      UPDATE document_assets SET
        status = 'selected',
        caption = COALESCE(?, caption),
        figure_number = COALESCE(?, figure_number)
      WHERE id = ? AND doc_id = ?
    `).run(caption || null, figureNumber || null, aid, id);

    return NextResponse.json({
      success: true,
      asset_id: aid,
      note: "تم اعتماد الشكل وإدراجه ضمن وثيقة البحث.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "تعذر اعتماد الصورة" },
      { status: 500 }
    );
  }
}
