import { NextRequest, NextResponse } from "next/server";
import { AdminAIOrchestrator } from "@/server/ai/adminAIOrchestrator";
import type { AIActionRequest, AdminAITool } from "@/server/ai/types";

export const dynamic = "force-dynamic";

const VALID_TOOLS: AdminAITool[] = [
  "get_national_overview",
  "get_shop_details",
  "get_wilaya_stats",
  "topup_shop",
  "toggle_shop_status",
  "get_revenue_trends",
  "get_document_stats",
  "search_shops",
];

/**
 * ⚡ POST /api/v1/admin/ai/actions
 * Execute administrative commands through the AI Engine.
 * Write actions (topup, toggle status) strictly require explicit confirmation (confirmed: true).
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AIActionRequest;
    const { action, params = {}, confirmed = false } = body;

    if (!action || !VALID_TOOLS.includes(action)) {
      return NextResponse.json(
        {
          success: false,
          error: `الأمر الإداري غير معروف: '${action}'. الأوامر المتاحة: ${VALID_TOOLS.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const result = AdminAIOrchestrator.executeAction(
      action,
      params,
      confirmed,
      "user_super_admin"
    );

    return NextResponse.json({
      success: result.success,
      result: {
        action,
        executed: result.success,
        summary_ar: result.summary_ar,
        data: result.data,
      },
    });
  } catch (err: any) {
    console.error("[API:AI:Actions] Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "فشل تنفيذ الأمر الإداري",
      },
      { status: 500 }
    );
  }
}
