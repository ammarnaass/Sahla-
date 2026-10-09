import { NextRequest, NextResponse } from "next/server";
import { ThesisService } from "@/server/education/thesis/thesisService";
import { trackEvent } from "@/lib/analytics";

export async function POST(
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

    const assembled = await ThesisService.assembleThesis(id);

    trackEvent("thesis_assembled", {
      thesisId: id,
      totalWords: assembled.total_words,
      totalPages: assembled.total_pages_estimate,
      chaptersCount: assembled.chapters_count,
    });

    return NextResponse.json({
      success: true,
      document: assembled,
      note: `تم تجميع المذكرة الأكاديمية بنجاح (${assembled.total_words} كلمة / ~${assembled.total_pages_estimate} صفحة A4). الوثيقة جاهزة للمراجعة والطباعة والتصدير.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "حدث خطأ أثناء تجميع المذكرة الأكاديمية" },
      { status: 500 }
    );
  }
}
