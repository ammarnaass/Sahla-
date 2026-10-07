import { NextRequest, NextResponse } from "next/server";
import { AIProviderRouter } from "@/server/ai/providers/providerRouter";

export const dynamic = "force-dynamic";

/**
 * 🔄 PUT /v1/admin/ai-providers/fallbacks
 * Technical Spec v1.0 Section 4.5
 * Reorder fallback engines
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const order: string[] = Array.isArray(body.order) ? body.order : [];
    const ip = req.headers.get("x-forwarded-for") || undefined;

    const result = AIProviderRouter.setFallbackOrder(order, "super_admin", ip);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    const providers = AIProviderRouter.getProviders();
    return NextResponse.json({
      success: true,
      message_ar: "تم تحديث ترتيب المحركات الاحتياطية بنجاح",
      providers,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
