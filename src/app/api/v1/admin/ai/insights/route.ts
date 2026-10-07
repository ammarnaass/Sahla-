import { NextRequest, NextResponse } from "next/server";
import { AdminAIOrchestrator } from "@/server/ai/adminAIOrchestrator";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * 💡 GET /api/v1/admin/ai/insights
 * Returns AI-generated operational and business insights with caching.
 * Query param ?refresh=true forces a cache bust and re-generation.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const refresh = searchParams.get("refresh") === "true";

    if (refresh) {
      try {
        db.prepare(`DELETE FROM ai_insights_cache WHERE id = 'latest'`).run();
      } catch {
        // Non-blocking
      }
    }

    const result = await AdminAIOrchestrator.generateInsights();

    return NextResponse.json({
      success: true,
      insights: result.insights,
      cached: result.cached,
      generated_at: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("[API:AI:Insights] Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "فشل توليد الرؤى الذكية",
      },
      { status: 500 }
    );
  }
}
