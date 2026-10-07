import { NextRequest, NextResponse } from "next/server";
import { AIProviderRouter } from "@/server/ai/providers/providerRouter";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * 📚 GET /v1/admin/ai-providers/{id}/models
 * Technical Spec v1.0 Section 4.6
 * Dynamic models list with 10-minute cache
 */
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const models = await AIProviderRouter.getModelsForProvider(id);
    return NextResponse.json({
      success: true,
      models,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
