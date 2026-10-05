import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trackEvent } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { examIds = [], shopId = "shop_1", watermark = true } = body;

    if (!Array.isArray(examIds) || examIds.length === 0) {
      return NextResponse.json({ error: "يرجى اختيار موضوع واحد على الأقل للطباعة المجمعة" }, { status: 400 });
    }

    const placeholders = examIds.map(() => "?").join(",");
    const rows: any[] = db.prepare(`SELECT * FROM exams WHERE id IN (${placeholders})`).all(...examIds);

    const shop: any = db.prepare("SELECT name, phone, wilaya FROM shops WHERE id = ?").get(shopId) || {
      name: "منصة سهلة - فضاء الخدمات الرقمية",
      phone: "0550000000",
      wilaya: "الجزائر",
    };

    const bundle = rows.map((r) => {
      let contentParsed = null;
      let solutionParsed = null;
      try {
        contentParsed = JSON.parse(r.exam_content);
      } catch {
        contentParsed = { text: r.exam_content };
      }
      try {
        solutionParsed = r.solution_content ? JSON.parse(r.solution_content) : null;
      } catch {
        solutionParsed = { text: r.solution_content };
      }

      return {
        id: r.id,
        title: r.title,
        level: r.level,
        grade: r.grade,
        year: r.year,
        subject: r.subject,
        pagesCount: r.pages_count,
        content: contentParsed,
        solution: solutionParsed,
        markingRubric: r.marking_rubric,
      };
    });

    const totalPages = bundle.reduce((acc, curr) => acc + (curr.pagesCount || 2), 0);

    trackEvent("exam_printed", {
      count: examIds.length,
      totalPages,
      shopId,
      isBundle: true,
    });

    return NextResponse.json({
      success: true,
      bundleTitle: `حزمة المراجعة الشاملة (${bundle.length} مواضيع - ${totalPages} صفحات)`,
      watermarkText: watermark ? `طُبع لدى: ${shop.name} · هاتف: ${shop.phone}` : null,
      totalPages,
      exams: bundle,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "حدث خطأ أثناء إعداد الطباعة المجمعة" }, { status: 500 });
  }
}
