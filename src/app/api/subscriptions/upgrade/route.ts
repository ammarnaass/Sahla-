import { NextRequest, NextResponse } from "next/server";
import { subscriptionService } from "@/server/services/subscriptionService";
import { DEFAULT_SHOP_ID } from "@/server/config/constants";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { shopId = DEFAULT_SHOP_ID, planId, paymentMethod = "CIB_EDAHABIA" } = await req.json();
    const result = subscriptionService.upgradePlan(shopId, planId, paymentMethod);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل ترقية الاشتراك" },
      { status: 400 }
    );
  }
}
