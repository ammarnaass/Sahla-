import { NextRequest, NextResponse } from "next/server";
import { shopService } from "@/server/services/shopService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get("shopId") || "shop_1";
    const staff = shopService.getStaff(shopId);
    return NextResponse.json({ success: true, staff });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل جلب قائمة الموظفين" },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { shopId = "shop_1", name, phone } = body;
    const staffMember = shopService.addStaff(shopId, { name, phone });
    return NextResponse.json({ success: true, staffMember });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل إضافة الموظف" },
      { status: 400 }
    );
  }
}
