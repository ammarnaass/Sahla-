import { NextRequest, NextResponse } from "next/server";
import { adminService } from "@/server/services/adminService";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { shopId, points = 50 } = await req.json();
    const result = adminService.topupShop(shopId, Number(points));
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل شحن رصيد المحل" },
      { status: 400 }
    );
  }
}
