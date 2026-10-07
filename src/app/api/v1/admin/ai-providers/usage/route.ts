import { NextResponse } from "next/server";
import { AIProviderRouter } from "@/server/ai/providers/providerRouter";

export const dynamic = "force-dynamic";

/**
 * 📊 GET /v1/admin/ai-providers/usage
 * Technical Spec v1.0 Section 3.4 & 4
 */
export async function GET() {
  try {
    const stats = AIProviderRouter.getUsageStats();
    return NextResponse.json({ success: true, stats });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
