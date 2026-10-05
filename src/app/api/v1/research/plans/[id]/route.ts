import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { outline } = body;

    if (!Array.isArray(outline)) {
      return NextResponse.json(
        { error: { code: "invalid_input", message: "يجب تقديم مصفوفة العناوين المعدلة (outline)" } },
        { status: 400 }
      );
    }

    const plan: any = db.prepare("SELECT * FROM research_plans WHERE id = ?").get(id);
    if (!plan) {
      return NextResponse.json(
        { error: { code: "not_found", message: "خطة البحث غير موجودة" } },
        { status: 404 }
      );
    }

    db.prepare(`
      UPDATE research_plans
      SET outline_json = ?
      WHERE id = ?
    `).run(JSON.stringify(outline), id);

    return NextResponse.json({
      id,
      status: "ready",
      outline,
      updated: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "server_error", message: error?.message || "فشل تعديل الخطة" } },
      { status: 500 }
    );
  }
}
