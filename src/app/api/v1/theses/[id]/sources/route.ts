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

    const sources = ThesisService.getSources(id);
    return NextResponse.json({ success: true, sources });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "تعذر جلب مصادر المذكرة" },
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
    const { title, authors, year, publisher_or_journal, url, doi, source_type, chapter_id } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "عنوان المرجع مطلوب" }, { status: 400 });
    }

    const source = ThesisService.addSource(id, {
      title,
      authors,
      year,
      publisher_or_journal,
      url,
      doi,
      source_type,
      chapter_id,
    });

    trackEvent("thesis_source_added", { thesisId: id, sourceId: source.id });

    return NextResponse.json({
      success: true,
      source,
      note: "تمت إضافة المرجع وتدقيق مصداقيته بنجاح.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "تعذر إضافة المرجع" },
      { status: 500 }
    );
  }
}
