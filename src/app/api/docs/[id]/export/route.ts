import { NextRequest, NextResponse } from "next/server";
import { LayoutService } from "@/server/education/formatting/layoutService";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Body can be empty
    }

    const format = body?.format || "docx";
    const title = body?.title;
    const exportOptions = body?.options || {};

    const cleanSafeFileName = encodeURIComponent(
      (title || "بحث_سهلة_الأكاديمي").replace(/[^\w\s\u0600-\u06FF-]/g, "_")
    );

    if (format === "pdf") {
      const pdfRes = await LayoutService.exportPdf(id, title, exportOptions);
      return new NextResponse(new Uint8Array(pdfRes.pdfBuffer), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${cleanSafeFileName}.pdf"; filename*=UTF-8''${cleanSafeFileName}.pdf`,
          "Content-Length": pdfRes.pdfBuffer.length.toString(),
        },
      });
    }

    // Default DOCX
    const docxBuffer = await LayoutService.exportDocx(id, title, exportOptions);
    return new NextResponse(new Uint8Array(docxBuffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${cleanSafeFileName}.docx"; filename*=UTF-8''${cleanSafeFileName}.docx`,
        "Content-Length": docxBuffer.length.toString(),
      },
    });
  } catch (err: any) {
    console.error("[ExportAPI] export failed:", err);
    return NextResponse.json(
      { error: err?.message || "فشل تصدير الوثيقة" },
      { status: 500 }
    );
  }
}
