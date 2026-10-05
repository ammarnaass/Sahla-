import { NextRequest, NextResponse } from "next/server";
import { adminService } from "@/server/services/adminService";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { shopId } = await req.json();
    const result = adminService.toggleShopStatus(shopId);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل تغيير حالة المحل" },
      { status: 400 }
    );
  }
}
