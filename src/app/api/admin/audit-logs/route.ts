import { NextRequest, NextResponse } from "next/server";
import { adminAuditLogRepository } from "@/server/repositories/adminAuditLogRepository";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 50;
    const type = searchParams.get("type");

    let logs = adminAuditLogRepository.getAll();

    if (type && type !== "ALL") {
      logs = logs.filter((l) => l.targetType === type);
    }

    return NextResponse.json({
      success: true,
      logs: logs.slice(0, limit),
      totalCount: logs.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل جلب سجلات التدقيق" },
      { status: 500 }
    );
  }
}
