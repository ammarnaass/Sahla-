import { NextRequest, NextResponse } from "next/server";
import { AIProviderRouter } from "@/server/ai/providers/providerRouter";

export const dynamic = "force-dynamic";

/**
 * 🌐 GET /v1/admin/ai-providers
 * Technical Spec v1.0 Section 4
 * List all providers without keys (with masked keys and status)
 */
export async function GET() {
  try {
    const providers = AIProviderRouter.getProviders();
    return NextResponse.json({
      success: true,
      providers,
    });
  } catch (err: any) {
    console.error("[API:AI-Providers:GET] error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "فشل جلب قائمة المزوّدين" },
      { status: 500 }
    );
  }
}

/**
 * ➕ POST /v1/admin/ai-providers
 * Technical Spec v1.0 Section 4.1
 * Add new AI provider with SSRF protection
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { kind, name, base_url, model, api_key } = body;

    const result = AIProviderRouter.createProvider(
      { kind, name, base_url, model, api_key },
      "super_admin",
      req.headers.get("x-forwarded-for") || undefined
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      provider: result.provider,
    });
  } catch (err: any) {
    console.error("[API:AI-Providers:POST] error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "فشل إضافة المزوّد" },
      { status: 500 }
    );
  }
}
