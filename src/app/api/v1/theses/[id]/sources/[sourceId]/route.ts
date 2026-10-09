import { NextRequest, NextResponse } from "next/server";
import { ThesisService } from "@/server/education/thesis/thesisService";
import { trackEvent } from "@/lib/analytics";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string; sourceId: string }> }
) {
  try {
    const { id, sourceId } = await context.params;
    if (!id || !sourceId) {
      return NextResponse.json({ error: "المعرفات المطلوبة مفقودة" }, { status: 400 });
    }

    const body = await req.json();
    const updated = ThesisService.updateSource(id, sourceId, body);

    if (!updated) {
      return NextResponse.json({ error: "المرجع غير موجود" }, { status: 404 });
    }

    trackEvent("thesis_source_updated", { thesisId: id, sourceId });

    return NextResponse.json({
      success: true,
      source: updated,
      note: "تم تحديث بيانات المرجع بنجاح.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "تعذر تحديث المرجع" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string; sourceId: string }> }
) {
  try {
    const { id, sourceId } = await context.params;
    if (!id || !sourceId) {
      return NextResponse.json({ error: "المعرفات المطلوبة مفقودة" }, { status: 400 });
    }

    const ok = ThesisService.deleteSource(id, sourceId);
    if (!ok) {
      return NextResponse.json({ error: "المرجع غير موجود أو تم حذفه مسبقاً" }, { status: 404 });
    }

    trackEvent("thesis_source_deleted", { thesisId: id, sourceId });

    return NextResponse.json({
      success: true,
      note: "تم حذف المرجع بنجاح.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "تعذر حذف المرجع" },
      { status: 500 }
    );
  }
}
