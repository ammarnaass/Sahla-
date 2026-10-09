import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { renderResearchHtmlDocument } from "@/server/education/researchHtmlEngine";
import { ALGERIAN_SUBJECTS } from "@/lib/educationConstants";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "word"; // "word" (.doc) or "html"

    if (!id) {
      return NextResponse.json({ error: "معرف الوثيقة مفقود" }, { status: 400 });
    }

    // Find in research_docs
    const docRow = db.prepare(`SELECT * FROM research_docs WHERE id = ?`).get(id) as any;
    if (!docRow) {
      return NextResponse.json({ error: "الوثيقة غير موجودة أو انتهت صلاحيتها (72 ساعة)" }, { status: 404 });
    }

    let outline: string[] = [];
    if (docRow.outline_json) {
      try {
        outline = JSON.parse(docRow.outline_json);
      } catch {}
    }

    let sections: any[] = [];
    let savedHtml: string | null = null;
    if (docRow.content_json) {
      try {
        const parsed = JSON.parse(docRow.content_json);
        if (Array.isArray(parsed)) {
          sections = parsed;
        } else if (parsed && typeof parsed === "object") {
          if (Array.isArray(parsed.sections)) sections = parsed.sections;
          if (typeof parsed.htmlContent === "string") savedHtml = parsed.htmlContent;
        }
      } catch {}
    }

    let references: string[] = [];
    if (docRow.references_json) {
      try {
        references = JSON.parse(docRow.references_json);
      } catch {}
    }

    let reviewQuestions: string[] = [];
    if (docRow.review_questions_json) {
      try {
        reviewQuestions = JSON.parse(docRow.review_questions_json);
      } catch {}
    }

    const subjectName = ALGERIAN_SUBJECTS[docRow.subject]?.nameAr || docRow.subject || "المادة المقررة";
    const cleanTopic = docRow.topic || docRow.title || "بحث مدرسي";
    const safeFilename = cleanTopic.replace(/[/\\?%*:|"<>]/g, "-").trim() || "document";

    const finalHtml =
      savedHtml ||
      renderResearchHtmlDocument({
        topic: cleanTopic,
        title: docRow.title,
        docKind: docRow.type === "THESIS" ? "THESIS" : "RESEARCH",
        level: docRow.level,
        grade: docRow.grade,
        subject: docRow.subject,
        subjectName,
        pageCount: docRow.page_count || 10,
        styleLevel: docRow.style_level,
        coverTemplate: docRow.cover_template,
        language: docRow.language || "ar",
        studentName: docRow.student_name,
        schoolName: docRow.school_name,
        teacherName: docRow.teacher_name,
        outline,
        sections,
        references,
        reviewQuestions,
      });

    if (format === "html") {
      return new Response(finalHtml, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Disposition": `attachment; filename="${encodeURIComponent(safeFilename)}.html"; filename*=UTF-8''${encodeURIComponent(safeFilename)}.html`,
        },
      });
    }

    // Default: Microsoft Word (.doc with Word XML namespaces & UTF-8 BOM)
    const wordContent = "\ufeff" + finalHtml;
    return new Response(wordContent, {
      status: 200,
      headers: {
        "Content-Type": "application/msword; charset=utf-8",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(safeFilename)}.doc"; filename*=UTF-8''${encodeURIComponent(safeFilename)}.doc`,
      },
    });
  } catch (error: any) {
    console.error("Export document error:", error);
    return NextResponse.json({ error: error?.message || "حدث خطأ أثناء تصدير المستند" }, { status: 500 });
  }
}
