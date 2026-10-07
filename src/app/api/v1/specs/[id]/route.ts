import { NextRequest, NextResponse } from "next/server";
import { SpecCompiler } from "@/server/education/guidance/specCompiler";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = SpecCompiler.updateSpec(id, body);
    if (!updated) {
      return NextResponse.json(
        { error: { code: "spec_not_found", message: `المواصفة المطلوبة غير موجودة: ${id}` } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      spec_id: updated.spec_id,
      pack_id: updated.pack_id,
      summary_ar: updated.summary_ar,
      constraints: updated.constraints,
      estimate_points: updated.estimate_points,
      warnings: updated.warnings,
      status: updated.status,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "spec_update_failed", message: err?.message || "خطأ أثناء تحديث المواصفة" } },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const spec = SpecCompiler.getSpecById(id);
    if (!spec) {
      return NextResponse.json(
        { error: { code: "spec_not_found", message: `المواصفة المطلوبة غير موجودة: ${id}` } },
        { status: 404 }
      );
    }

    return NextResponse.json(spec);
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "spec_fetch_failed", message: err?.message } },
      { status: 500 }
    );
  }
}
