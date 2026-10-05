import { NextResponse } from "next/server";
import { adminService } from "@/server/services/adminService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = adminService.getDeepAnalytics();
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل جلب التحليلات المتقدمة" },
      { status: 500 }
    );
  }
}
