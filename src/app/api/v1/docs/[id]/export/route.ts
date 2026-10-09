import { NextRequest, NextResponse } from "next/server";
import { LayoutService } from "@/server/education/formatting/layoutService";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "معرّف الوثيقة مفقود" }, { status: 400 });
    }

    let format = "docx";
    let title = "وثيقة_بحث_أكاديمية";

    try {
      const body = await req.json();
      if (body?.format) format = body.format;
      if (body?.title) title = body.title;
    } catch {
      // default docx
    }

    const safeTitle = encodeURIComponent(title.replace(/\s+/g, "_"));

    if (format === "docx") {
      const docxBuffer = await LayoutService.exportDocx(id, title);

      return new NextResponse(docxBuffer as any, {
        status: 200,
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename*=UTF-8''${safeTitle}.docx`,
          "Content-Length": String(docxBuffer.length),
        },
      });
    }

    return NextResponse.json(
      { error: "الصيغة غير مدعومة حالياً، يرجى اختيار docx" },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "تعذر تصدير الوثيقة بصيغة DOCX" },
      { status: 500 }
    );
  }
}
