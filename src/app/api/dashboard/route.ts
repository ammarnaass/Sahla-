import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { SERVICES_CATALOG } from "@/lib/constants";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get("shop_id") || "shop_1791222058320";

    // 1. Fetch real shop points
    const shopRow: any = db.prepare("SELECT id, name, points FROM shops WHERE id = ?").get(shopId);
    const balancePoints = shopRow ? shopRow.points : 0;

    // 2. Fetch real recent documents for this shop
    const docsRows: any[] = db
      .prepare(`
        SELECT id, title, type, student_name as customerName, sale_price_dzd as salePrice, created_at as createdAt
        FROM research_docs
        WHERE shop_id = ?
        ORDER BY created_at DESC
        LIMIT 10
      `)
      .all(shopId);

    const recentDocuments = docsRows.map((d) => ({
      id: d.id,
      title: d.title,
      type: d.type || "SCHOOL_RESEARCH",
      customerName: d.customerName || "تلميذ المؤسسة",
      createdAt: d.createdAt,
      salePrice: d.salePrice || 250,
    }));

    // 3. Fetch real ledger transactions for this shop
    const ledgerRows: any[] = db
      .prepare(`
        SELECT id, description, points_change, balance_after, created_at
        FROM ledger
        WHERE shop_id = ?
        ORDER BY id DESC
        LIMIT 15
      `)
      .all(shopId);

    const ledger = ledgerRows.map((t) => {
      const delta = parseInt(t.points_change, 10) || 0;
      return {
        id: t.id,
        description: t.description,
        pointsDelta: delta,
        balanceAfter: t.balance_after,
        type: delta >= 0 ? ("CREDIT" as const) : ("DEBIT" as const),
        createdAt: t.created_at,
      };
    });

    // 4. Calculate real daily stats (created today)
    const todayDocStats: any = db
      .prepare(`
        SELECT count(*) as count, coalesce(sum(sale_price_dzd), 0) as totalProfit
        FROM research_docs
        WHERE shop_id = ? AND date(created_at) = date('now')
      `)
      .get(shopId);

    const todayLedgerStats: any = db
      .prepare(`
        SELECT coalesce(sum(abs(cast(points_change as integer))), 0) as pointsUsed
        FROM ledger
        WHERE shop_id = ? AND cast(points_change as integer) < 0 AND date(created_at) = date('now')
      `)
      .get(shopId);

    const dailySummary = {
      docsCount: todayDocStats ? todayDocStats.count : 0,
      pointsUsed: todayLedgerStats ? todayLedgerStats.pointsUsed : 0,
      estimatedProfitDZD: todayDocStats ? todayDocStats.totalProfit : 0,
    };

    return NextResponse.json({
      success: true,
      shopId,
      balancePoints,
      frequentServices: SERVICES_CATALOG.slice(0, 4),
      recentDocuments,
      ledger,
      dailySummary,
    });
  } catch (err: unknown) {
    console.error("Dashboard API error:", err);
    return NextResponse.json(
      { success: false, error: "تعذر تحميل بيانات لوحة التحكم" },
      { status: 500 }
    );
  }
}
