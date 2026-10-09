import { NextRequest, NextResponse } from "next/server";
import { ThesisService } from "@/server/education/thesis/thesisService";
import { LayoutService } from "@/server/education/formatting/layoutService";
import { DocxBuilder } from "@/server/education/formatting/docxBuilder";
import { DocumentBlock } from "@/server/education/formatting/types";
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
      if (body?.format === "docx") format = "docx";
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

    if (format === "docx") {
      let blocks = LayoutService.getBlocks(id);
      const settings = LayoutService.getLayoutSettings(id);
      const assets = LayoutService.getAssets(id);

      if (blocks.length === 0) {
        const chapters = ThesisService.getChapters(id);
        const sources = ThesisService.getSources(id);

        let order = 1;
        // Cover
        blocks.push({
          id: `blk_${order}`,
          doc_id: id,
          order_num: order++,
          type: "cover",
          content: {
            text: `مذكرة تخرج لنيل شهادة ${thesis.degree || "الماستر"}\nتخصص: ${thesis.specialty}\nإعداد الطالب: ${thesis.student_name}\nإشراف الأستاذ: ${thesis.supervisor_name}`,
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        // Chapters
        chapters.forEach((chap) => {
          blocks.push({
            id: `blk_${order}`,
            doc_id: id,
            order_num: order++,
            type: "heading",
            content: { level: 1, text: chap.title },
            page_break_before: true,
            keep_with_next: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

          chap.sections.forEach((sec) => {
            blocks.push({
              id: `blk_${order}`,
              doc_id: id,
              order_num: order++,
              type: "heading",
              content: { level: 2, text: sec.title },
              keep_with_next: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

            if (Array.isArray(sec.paragraphs)) {
              sec.paragraphs.forEach((p) => {
                if (p.text && p.text.trim()) {
                  blocks.push({
                    id: `blk_${order}`,
                    doc_id: id,
                    order_num: order++,
                    type: "paragraph",
                    content: { text: p.text.trim() },
                    page_break_before: false,
                    keep_with_next: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  });
                }
              });
            }
          });
        });

        // References
        if (sources.length > 0) {
          blocks.push({
            id: `blk_${order}`,
            doc_id: id,
            order_num: order++,
            type: "heading",
            content: { level: 1, text: "قائمة المصادر والمراجع" },
            page_break_before: true,
            keep_with_next: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

          sources.forEach((src) => {
            blocks.push({
              id: `blk_${order}`,
              doc_id: id,
              order_num: order++,
              type: "paragraph",
              content: {
                text: `${src.authors.join("، ")} (${src.year}). ${src.title}. ${src.publisher_or_journal || ""}.`,
              },
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          });
        }
      }

      const docxBuffer = await DocxBuilder.buildDocxBuffer({
        title: thesis.clean_title || thesis.title || "مذكرة تخرج",
        settings,
        blocks,
        assets,
      });

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
