import { NextRequest, NextResponse } from "next/server";
import { AIProviderRouter } from "@/server/ai/providers/providerRouter";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * 👑 POST /v1/admin/ai-providers/{id}/set-primary
 * Technical Spec v1.0 Section 4.4
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const ip = req.headers.get("x-forwarded-for") || undefined;

    const result = AIProviderRouter.setPrimaryProvider(id, "super_admin", ip);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    const providers = AIProviderRouter.getProviders();
    return NextResponse.json({
      success: true,
      message_ar: "تم تعيين المحرك كمحرك أساسي للذكاء الاصطناعي بنجاح",
      providers,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
