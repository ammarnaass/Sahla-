import { NextRequest, NextResponse } from "next/server";
import { ThesisService } from "@/server/education/thesis/thesisService";
import { trackEvent } from "@/lib/analytics";

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

    const chapters = ThesisService.getChapters(id);
    return NextResponse.json({ success: true, chapters });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "تعذر جلب فصول المذكرة" },
      { status: 500 }
    );
  }
}

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

    const body = await req.json();
    const { chapterId } = body;

    if (!chapterId || typeof chapterId !== "string") {
      return NextResponse.json({ error: "معرّف الفصل المراد صياغته مطلوب (chapterId)" }, { status: 400 });
    }

    const written = await ThesisService.writeChapter(id, chapterId);

    trackEvent("thesis_chapter_written", {
      thesisId: id,
      chapterId,
      wordCount: written.word_count,
      pageCountEstimate: written.page_count_estimate,
    });

    return NextResponse.json({
      success: true,
      chapter: written,
      note: `تمت كتابة وتوثيق الفصل "${written.title}" (${written.word_count} كلمة / ~${written.page_count_estimate} صفحة) استناداً إلى ورقة الحقائق.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "حدث خطأ أثناء كتابة الفصل الأكاديمي" },
      { status: 500 }
    );
  }
}
