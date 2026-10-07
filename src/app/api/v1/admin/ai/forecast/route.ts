import { NextRequest, NextResponse } from "next/server";
import { AdminAIOrchestrator } from "@/server/ai/adminAIOrchestrator";

export const dynamic = "force-dynamic";

/**
 * 📈 GET /api/v1/admin/ai/forecast
 * Returns business predictions (MRR, shop growth, document volumes).
 */
export async function GET() {
  try {
    const forecasts = await AdminAIOrchestrator.generateForecasts();

    return NextResponse.json({
      success: true,
      forecasts,
      generated_at: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("[API:AI:Forecast] Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "فشل توليد التوقعات الذكية",
      },
      { status: 500 }
    );
  }
}
