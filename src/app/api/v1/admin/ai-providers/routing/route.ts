import { NextRequest, NextResponse } from "next/server";
import { AIProviderRouter } from "@/server/ai/providers/providerRouter";

export const dynamic = "force-dynamic";

/**
 * 🎯 GET /v1/admin/ai-providers/routing
 * Technical Spec v1.0 Section 4 & 6.4
 */
export async function GET() {
  try {
    const rules = AIProviderRouter.getRoutingRules();
    return NextResponse.json({ success: true, rules });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * 🎯 PUT /v1/admin/ai-providers/routing
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { skill, provider_id, min_capabilities } = body;

    if (!skill || !provider_id) {
      return NextResponse.json({ success: false, error: "المهارة والمعرف مطلوبان" }, { status: 400 });
    }

    const ok = AIProviderRouter.updateRoutingRule(skill, provider_id, min_capabilities, "super_admin");
    if (!ok) {
      return NextResponse.json({ success: false, error: "فشل حفظ قاعدة التوجيه" }, { status: 400 });
    }

    const rules = AIProviderRouter.getRoutingRules();
    return NextResponse.json({ success: true, rules });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
