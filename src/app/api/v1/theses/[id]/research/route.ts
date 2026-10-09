import { NextRequest, NextResponse } from "next/server";
import { ThesisService } from "@/server/education/thesis/thesisService";
import { trackEvent } from "@/lib/analytics";

export async function POST(
  req: NextRequest,
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

    let chapterId: string | undefined;
    try {
      const body = await req.json();
      chapterId = body?.chapterId;
    } catch {
      // Body may be empty
    }

    const { sources, factSheets } = await ThesisService.runResearch(id, chapterId);

    trackEvent("thesis_research_completed", {
      thesisId: id,
      sourcesCount: sources.length,
      factSheetsCount: factSheets.length,
      chapterId: chapterId || "all",
    });

    return NextResponse.json({
      success: true,
      sources,
      factSheets,
      note: "تم استرجاع وتدقيق المصادر وإعداد ورقة الحقائق الأكاديمية بنجاح.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "حدث خطأ أثناء استرجاع وتدقيق مصادر المذكرة" },
      { status: 500 }
    );
  }
}
