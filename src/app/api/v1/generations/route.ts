import { NextRequest, NextResponse } from "next/server";
import { GuidanceOrchestrator } from "@/server/education/guidance/guidanceOrchestrator";

export async function POST(req: NextRequest) {
  try {
    const idempotencyKey = req.headers.get("idempotency-key") || req.headers.get("Idempotency-Key") || undefined;
    const body = await req.json();
    const { spec_id, shop_id = "shop_1", cover } = body;

    if (!spec_id) {
      return NextResponse.json(
        { error: { code: "spec_incomplete", message: "معرف المواصفة spec_id إلزامي لبدء التوليد" } },
        { status: 400 }
      );
    }

    const generation = await GuidanceOrchestrator.executeGuidedGeneration({
      spec_id,
      shop_id,
      idempotency_key: idempotencyKey,
      cover_overrides: cover,
    });

    return NextResponse.json(generation, { status: 201 });
  } catch (err: any) {
    const code = err?.message?.includes("نقاط") ? "insufficient_points" : "conformance_failed";
    return NextResponse.json(
      { error: { code, message: err?.message || "فشل التوليد الموجه" } },
      { status: 422 }
    );
  }
}
