import { NextRequest, NextResponse } from "next/server";
import { AIProviderRouter } from "@/server/ai/providers/providerRouter";

export const dynamic = "force-dynamic";

/**
 * 🔌 GET /api/v1/admin/ai/providers
 * Returns all configured AI providers with masked API keys and health status.
 */
export async function GET() {
  try {
    const providers = AIProviderRouter.getProviders();
    return NextResponse.json({
      success: true,
      providers,
    });
  } catch (err: any) {
    console.error("[API:AI:Providers:GET] error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "فشل جلب قائمة المزودين" },
      { status: 500 }
    );
  }
}

/**
 * 💾 POST /api/v1/admin/ai/providers
 * Updates a provider's configuration (API key, default model, enabled state, etc.)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, apiKey, default_model, model, is_enabled, enabled, base_url, name } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "معرف المزود مطلوب" },
        { status: 400 }
      );
    }

    const updated = AIProviderRouter.updateProvider(id, {
      api_key: apiKey,
      model: model || default_model,
      name,
      base_url,
      enabled: is_enabled !== undefined ? is_enabled : enabled,
    }, "super_admin", req.headers.get("x-forwarded-for") || undefined);

    if (!updated.success) {
      return NextResponse.json(
        { success: false, error: updated.error || "فشل حفظ إعدادات المزود" },
        { status: 400 }
      );
    }

    const providers = AIProviderRouter.getProviders();
    return NextResponse.json({
      success: true,
      message_ar: "تم حفظ الإعدادات وتحديث المفتاح بنجاح",
      providers,
    });
  } catch (err: any) {
    console.error("[API:AI:Providers:POST] error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "حدث خطأ غير متوقع أثناء تحديث إعدادات المزود",
      },
      { status: 500 }
    );
  }
}
