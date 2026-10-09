import { NextRequest, NextResponse } from "next/server";
import { ThesisService } from "@/server/education/thesis/thesisService";
import { trackEvent } from "@/lib/analytics";

export async function POST(
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

    const plan = await ThesisService.generatePlan(id);

    trackEvent("thesis_plan_generated", {
      thesisId: id,
      chaptersCount: plan.chapters.length,
      totalPages: plan.total_target_pages,
    });

    return NextResponse.json({
      success: true,
      plan,
      note: "تم توليد خطة المذكرة بنجاح. يرجى مراجعتها واعتمادها لمتابعة مرحلة جمع المصادر.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "حدث خطأ أثناء توليد خطة المذكرة" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "معرّف المذكرة مفقود" }, { status: 400 });
    }

    const body = await req.json();
    const { title, problem, sub_questions, hypotheses, methodology, chapters } = body;

    const approvedPlan = ThesisService.approvePlan(id, {
      title,
      problem,
      sub_questions,
      hypotheses,
      methodology,
      chapters,
    });

    trackEvent("thesis_plan_approved", {
      thesisId: id,
      chaptersCount: approvedPlan.chapters.length,
    });

    return NextResponse.json({
      success: true,
      plan: approvedPlan,
      status: "plan_approved",
      next_action: "research",
      note: "تم اعتماد خطة المذكرة رسمياً ⚡ يمكنك الآن بدء مرحلة البحث وجمع المصادر الأكاديمية.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "حدث خطأ أثناء اعتماد خطة المذكرة" },
      { status: 500 }
    );
  }
}
