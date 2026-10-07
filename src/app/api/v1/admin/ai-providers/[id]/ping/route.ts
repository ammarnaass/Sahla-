import { NextRequest, NextResponse } from "next/server";
import { AIProviderRouter } from "@/server/ai/providers/providerRouter";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * ⚡ POST /v1/admin/ai-providers/{id}/ping
 * Technical Spec v1.0 Section 4.2
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    let overrideApiKey: string | undefined;
    let overrideModelId: string | undefined;

    try {
      const body = await req.json();
      overrideApiKey = body.api_key || body.apiKey;
      overrideModelId = body.model || body.modelId;
    } catch {
      // Empty body is valid (uses saved DB credentials)
    }

    const pingResult = await AIProviderRouter.pingProvider(id, overrideApiKey, overrideModelId);

    return NextResponse.json({
      success: pingResult.status === "ok",
      ...pingResult,
      check: {
        ...pingResult,
        success: pingResult.status === "ok",
        providerId: id,
        modelId: pingResult.model,
      },
    });
  } catch (err: any) {
    console.error("[API:AI-Providers:Ping] error:", err);
    return NextResponse.json(
      {
        success: false,
        status: "error",
        message_ar: `تعذر فحص الاتصال: ${err.message}`,
        error: err.message,
      },
      { status: 500 }
    );
  }
}
