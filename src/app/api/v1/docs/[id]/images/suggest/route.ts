import { NextRequest, NextResponse } from "next/server";
import { LayoutService } from "@/server/education/formatting/layoutService";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "معرّف المستند مفقود" }, { status: 400 });
    }

    const body = await req.json();
    const { section_id, purpose, kind, query, caption_hint } = body;

    if (!query) {
      return NextResponse.json({ error: "استعلام البحث عن الصورة مطلوب (query)" }, { status: 400 });
    }

    const result = await LayoutService.suggestImages(id, {
      section_id: section_id || "s1",
      purpose: purpose || "illustrate_event",
      kind: kind || "photo",
      query,
      caption_hint: caption_hint || query,
    });

    return NextResponse.json({
      success: true,
      candidates: result.candidates,
      auto_selected: result.auto_selected,
      in_text_reference: result.in_text_reference,
      note: "تم اقتراح الصور ذات الترخيص الحر المعتمد والمخططات بنجاح.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "تعذر اقتراح الصور" },
      { status: 500 }
    );
  }
}
