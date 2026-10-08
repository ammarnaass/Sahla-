import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get("shop_id") || "shop_1";

    const rows: any[] = db
      .prepare(`
        SELECT id, shop_id, title, type, level, grade, subject, topic, language,
               page_count, style_level, cover_template, student_name, school_name,
               teacher_name, outline_json, content_json, references_json, review_questions_json,
               points_cost, sale_price_dzd, status, expires_at, created_at
        FROM research_docs
        WHERE shop_id = ?
        ORDER BY created_at DESC
        LIMIT 50
      `)
      .all(shopId);

    const now = new Date();

    const items = rows.map((r) => {
      const isExpired = r.expires_at ? new Date(r.expires_at) < now : false;
      return {
        id: r.id,
        title: r.title,
        type: r.type,
        stage: r.level,
        level: r.grade,
        subject: r.subject,
        topic: r.topic,
        language: r.language,
        pages: r.page_count,
        style: r.style_level,
        cover_template: r.cover_template,
        teacher_name: r.teacher_name,
        outline_json: r.outline_json,
        content_json: r.content_json,
        references_json: r.references_json,
        review_questions_json: r.review_questions_json,
        // Privacy enforcement: mask student name if expired
        student_name: isExpired ? "بيانات مشفرة ومحذوفة (قانون 18-07)" : r.student_name,
        school_name: isExpired ? "المؤسسة التعليمية" : r.school_name,
        points_cost: r.points_cost,
        sale_price_dzd: r.sale_price_dzd,
        status: isExpired ? "expired" : r.status,
        expires_at: r.expires_at,
        created_at: r.created_at,
        is_expired: isExpired,
        reprint_available: !isExpired,
        reprint_url: !isExpired ? `/api/v1/research/jobs/${r.id}/export` : null,
      };
    });

    return NextResponse.json({
      items,
      count: items.length,
      privacy_notice: "يتم مسح البيانات الاسمية للطلبة تلقائياً بعد 72 ساعة امتثالاً للقانون 18-07 لحماية المعطيات ذات الطابع الشخصي.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "fetch_failed", message: error?.message || "فشل جلب سجل الوثائق" } },
      { status: 500 }
    );
  }
}
