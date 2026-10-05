import { NextRequest, NextResponse } from "next/server";
import { subscriptionService } from "@/server/services/subscriptionService";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { points = 100, count = 20, priceDZD = 1000 } = await req.json();
    const batch = subscriptionService.generateWholesaleBatch(
      Number(points),
      Number(count),
      Number(priceDZD)
    );
    return NextResponse.json({ success: true, batch });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل توليد دفعة بطاقات الشحن بالجملة" },
      { status: 400 }
    );
  }
}
