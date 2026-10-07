import { NextRequest, NextResponse } from "next/server";
import { AIProviderRouter } from "@/server/ai/providers/providerRouter";

export const dynamic = "force-dynamic";

/**
 * 🔄 POST /api/v1/admin/ai/providers/switch
 * Sets the specified AI provider as the primary active engine.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "معرف المزود غير صالح للتبديل" },
        { status: 400 }
      );
    }

    const ip = req.headers.get("x-forwarded-for") || undefined;
    const switched = AIProviderRouter.setPrimaryProvider(id, "super_admin", ip);
    if (!switched.success) {
      return NextResponse.json(
        { success: false, error: switched.error || "فشل تعيين المزود الأساسي" },
        { status: 400 }
      );
    }

    const providers = AIProviderRouter.getProviders();
    return NextResponse.json({
      success: true,
      message_ar: `تم تعيين المزود كمحرك أساسي للمنظومة بنجاح`,
      providers,
    });
  } catch (err: any) {
    console.error("[API:AI:Providers:Switch] error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "فشل تبديل المزود الأساسي",
      },
      { status: 500 }
    );
  }
}
