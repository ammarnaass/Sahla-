import { NextRequest, NextResponse } from "next/server";
import { ThesisService } from "@/server/education/thesis/thesisService";
import { getInstitutionProfile } from "@/server/education/thesis/institutionProfiles";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "معرّف المذكرة مفقود" }, { status: 400 });
    }

    const thesis = ThesisService.getThesis(id);
    if (!thesis) {
      return NextResponse.json({ error: "مشروع المذكرة غير موجود" }, { status: 404 });
    }

    const profile = getInstitutionProfile(thesis.profile_id);
    const plan = ThesisService.getPlan(id);

    // Calculate workflow progress based on state machine
    const statusOrder = [
      "draft",
      "planned",
      "plan_approved",
      "researching",
      "sources_review",
      "writing",
      "analyzing",
      "assembling",
      "quality_review",
      "ready",
    ];
    const currentIdx = statusOrder.indexOf(thesis.status);
    const progressPercent =
      currentIdx >= 0 ? Math.round(((currentIdx + 1) / statusOrder.length) * 100) : 0;

    return NextResponse.json({
      success: true,
      thesis,
      profile,
      plan,
      progressPercent,
      can_write_chapters: thesis.status === "plan_approved" || currentIdx > 2,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "حدث خطأ أثناء جلب تفاصيل المذكرة" },
      { status: 500 }
    );
  }
}
