import { NextRequest, NextResponse } from "next/server";
import { LayoutService } from "@/server/education/formatting/layoutService";
import { ImageCandidateRequest } from "@/server/education/formatting/types";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body || !body.query) {
      return NextResponse.json({ error: "الاستعلام query مطلوب لاقتراح الصور" }, { status: 400 });
    }

    const request: ImageCandidateRequest = {
      section_id: body.section_id || "sec_main",
      purpose: body.purpose || "illustrate_event",
      kind: body.kind || "photo",
      query: body.query,
      caption_hint: body.caption_hint || body.query,
      max_count: body.max_count || 3,
    };

    const result = await LayoutService.suggestImages(id, request);
    return NextResponse.json({
      success: true,
      docId: id,
      result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "فشل اقتراح الصور المرشحة" },
      { status: 500 }
    );
  }
}
