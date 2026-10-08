import { NextRequest, NextResponse } from "next/server";
import { AIProviderRouter } from "@/server/ai/providers/providerRouter";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * 🔍 GET /v1/admin/ai-providers/{id}
 */
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const provider = AIProviderRouter.getProviderById(id);
    if (!provider) {
      return NextResponse.json({ success: false, error: "المزوّد غير موجود" }, { status: 404 });
    }
    return NextResponse.json({ success: true, provider });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * ✏️ PATCH /v1/admin/ai-providers/{id}
 * Technical Spec v1.0 Section 4.3
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      name,
      model,
      base_url,
      api_key,
      enabled,
      preset_id,
      custom_headers,
      advanced_config,
      custom_models,
      capabilities,
    } = body;

    const result = AIProviderRouter.updateProvider(
      id,
      {
        name,
        model,
        base_url,
        api_key,
        enabled,
        preset_id,
        custom_headers,
        advanced_config,
        custom_models,
        capabilities,
      },
      "super_admin",
      req.headers.get("x-forwarded-for") || undefined
    );

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, provider: result.provider });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * 🗑️ DELETE /v1/admin/ai-providers/{id}
 * Technical Spec v1.0 Section 4
 * Cannot delete primary provider
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const result = AIProviderRouter.deleteProvider(
      id,
      "super_admin",
      req.headers.get("x-forwarded-for") || undefined
    );

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "تم حذف المزوّد بنجاح" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
