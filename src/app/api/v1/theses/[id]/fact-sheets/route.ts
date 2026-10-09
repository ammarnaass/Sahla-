import { NextRequest, NextResponse } from "next/server";
import { ThesisService } from "@/server/education/thesis/thesisService";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "معرّف المذكرة مفقود" }, { status: 400 });
    }

    const thesis = ThesisService.getThesis(id);
    if (!thesis) {
      return NextResponse.json({ error: "مشروع المذكرة غير موجود" }, { status: 404 });
    }

    const factSheets = ThesisService.getFactSheets(id);
    return NextResponse.json({ success: true, factSheets });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "تعذر جلب أوراق الحقائق" },
      { status: 500 }
    );
  }
}
