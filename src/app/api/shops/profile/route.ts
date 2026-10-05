import { NextRequest, NextResponse } from "next/server";
import { shopService } from "@/server/services/shopService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get("shopId") || "shop_1";
    const shop = shopService.getShop(shopId);
    return NextResponse.json({ success: true, shop });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل جلب بيانات المحل" },
      { status: 404 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { shopId = "shop_1", ...updates } = body;
    const shop = shopService.updateProfile(shopId, updates);
    return NextResponse.json({ success: true, shop });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل تحديث بيانات المحل" },
      { status: 400 }
    );
  }
}
