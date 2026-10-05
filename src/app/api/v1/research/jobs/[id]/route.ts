import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const job: any = db.prepare("SELECT * FROM research_jobs WHERE id = ?").get(id);

    if (!job) {
      return NextResponse.json(
        { error: { code: "not_found", message: "المهمة غير موجودة" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: job.id,
      plan_id: job.plan_id,
      shop_id: job.shop_id,
      status: job.status,
      progress: job.progress,
      current_step: job.current_step,
      reserved_points: job.reserved_points,
      settled_points: job.settled_points,
      result: job.result_json ? JSON.parse(job.result_json) : null,
      error: job.error_json ? JSON.parse(job.error_json) : null,
      created_at: job.created_at,
      updated_at: job.updated_at,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "server_error", message: error?.message || "فشل جلب حالة المهمة" } },
      { status: 500 }
    );
  }
}
