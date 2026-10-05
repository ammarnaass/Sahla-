import { NextRequest, NextResponse } from "next/server";
import { adminService } from "@/server/services/adminService";
import { subscriptionService } from "@/server/services/subscriptionService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const overview = adminService.getNationalOverview();
    const saasMetrics = subscriptionService.getMetrics();

    return NextResponse.json({
      ...overview,
      saasMetrics,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل جلب المؤشرات الوطنية" },
      { status: 500 }
    );
  }
}
