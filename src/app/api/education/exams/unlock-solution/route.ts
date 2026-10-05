import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trackEvent } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { examId, shopId = "shop_1" } = body;

    if (!examId) {
      return NextResponse.json({ error: "معرف الامتحان مطلوب" }, { status: 400 });
    }

    const examRow: any = db.prepare("SELECT * FROM exams WHERE id = ?").get(examId);
    if (!examRow) {
      return NextResponse.json({ error: "الموضوع غير موجود" }, { status: 404 });
    }

    const cost = examRow.points_cost || 2;

    const shopRow: any = db.prepare("SELECT points, name FROM shops WHERE id = ?").get(shopId);
    if (!shopRow) {
      return NextResponse.json({ error: "المحل غير مسجل" }, { status: 404 });
    }

    if (cost > 0 && shopRow.points < cost) {
      return NextResponse.json(
        { error: "رصيد النقاط غير كافٍ لفتح الحل النموذجي", required: cost, current: shopRow.points },
        { status: 402 }
      );
    }

    let newBalance = shopRow.points;
    if (cost > 0) {
      newBalance = shopRow.points - cost;
      db.prepare("UPDATE shops SET points = ? WHERE id = ?").run(newBalance, shopId);

      const ledgerId = `tx_${Date.now()}`;
      db.prepare(`
        INSERT INTO ledger (id, shop_id, description, points_change, balance_after, created_at)
        VALUES (?, ?, ?, ?, ?, datetime('now'))
      `).run(ledgerId, shopId, `فتح الحل النموذجي لـ: ${examRow.title}`, `-${cost}`, newBalance);
    }

    // Increment downloads count
    db.prepare("UPDATE exams SET downloads_count = downloads_count + 1 WHERE id = ?").run(examId);

    trackEvent("solution_unlocked", { examId, shopId, pointsCost: cost });

    let solutionParsed = null;
    try {
      solutionParsed = examRow.solution_content ? JSON.parse(examRow.solution_content) : null;
    } catch {
      solutionParsed = { text: examRow.solution_content };
    }

    return NextResponse.json({
      success: true,
      examId,
      title: examRow.title,
      solutionContent: solutionParsed,
      markingRubric: examRow.marking_rubric,
      pointsCost: cost,
      balanceAfter: newBalance,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "حدث خطأ أثناء فتح الحل" }, { status: 500 });
  }
}
