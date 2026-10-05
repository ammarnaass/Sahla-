import { NextRequest, NextResponse } from "next/server";
import { subscriptionService } from "@/server/services/subscriptionService";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { shopId = "shop_1", planId, paymentMethod = "CIB_EDAHABIA" } = await req.json();
    const result = subscriptionService.upgradePlan(shopId, planId, paymentMethod);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل ترقية الاشتراك" },
      { status: 400 }
    );
  }
}
