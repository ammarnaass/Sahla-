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

    let format = "doc";
    try {
      const body = await req.json();
      if (body?.format === "html") format = "html";
    } catch {
      // body empty -> default doc
    }

    const assembled = await ThesisService.assembleThesis(id);

    trackEvent("thesis_exported", {
      thesisId: id,
      format,
      totalPages: assembled.total_pages_estimate,
    });

    const safeTitle = encodeURIComponent(
      (thesis.clean_title || thesis.title || "مذكرة_تخرج").replace(/\s+/g, "_")
    );

    if (format === "html") {
      return new NextResponse(assembled.html_document, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Disposition": `attachment; filename*=UTF-8''${safeTitle}.html`,
        },
      });
    }

    // Default Word format (.doc compliant with Office Word XML)
    return new NextResponse(assembled.html_document, {
      status: 200,
      headers: {
        "Content-Type": "application/msword; charset=utf-8",
        "Content-Disposition": `attachment; filename*=UTF-8''${safeTitle}.doc`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "تعذر تصدير المذكرة" },
      { status: 500 }
    );
  }
}
