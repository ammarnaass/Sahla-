import { NextRequest, NextResponse } from "next/server";
import { walletService } from "@/server/services/walletService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get("shopId") || searchParams.get("shop_id") || "shop_1791222058320";
    const ledger = walletService.getLedger(shopId);
    return NextResponse.json({ success: true, ledger });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل جلب سجل العمليات" },
      { status: 400 }
    );
  }
}
