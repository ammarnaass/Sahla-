import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { WalletGuard } from "@/server/education/walletGuard";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get("shop_id") || "shop_1791222058320";

    const currentPoints = WalletGuard.getShopPoints(shopId);

    // Get last 20 immutable ledger transactions
    const transactions: any[] = db
      .prepare(`
        SELECT id, description, points_change, balance_after, created_at
        FROM ledger
        WHERE shop_id = ?
        ORDER BY id DESC
        LIMIT 20
      `)
      .all(shopId);

    return NextResponse.json({
      shop_id: shopId,
      points: currentPoints,
      recent_transactions: transactions.map((t) => ({
        id: t.id,
        description: t.description,
        points_change: t.points_change,
        balance_after: t.balance_after,
        created_at: t.created_at,
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "wallet_error", message: error?.message || "فشل جلب بيانات المحفظة" } },
      { status: 500 }
    );
  }
}
