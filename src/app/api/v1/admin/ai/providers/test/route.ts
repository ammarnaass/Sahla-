import { NextRequest, NextResponse } from "next/server";
import { AIProviderRouter } from "@/server/ai/providers/providerRouter";

export const dynamic = "force-dynamic";

/**
 * ⚡ POST /api/v1/admin/ai/providers/test
 * Tests live connection (Ping) to a provider
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, apiKey, modelId } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "معرف المزود مطلوب للاختبار" },
        { status: 400 }
      );
    }

    const pingResult = await AIProviderRouter.pingProvider(id, apiKey, modelId);

    return NextResponse.json({
      success: pingResult.status === "ok",
      check: {
        ...pingResult,
        success: pingResult.status === "ok",
        providerId: id,
        modelId: pingResult.model,
      },
    });
  } catch (err: any) {
    console.error("[API:AI:Providers:Test] error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "حدث خطأ غير متوقع أثناء فحص الاتصال بالمزود",
      },
      { status: 500 }
    );
  }
}
