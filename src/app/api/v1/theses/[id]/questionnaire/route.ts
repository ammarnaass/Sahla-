import { NextRequest, NextResponse } from "next/server";
import { ThesisService } from "@/server/education/thesis/thesisService";
import { QuestionnaireDesigner } from "@/server/education/thesis/skills/questionnaireDesigner";
import { trackEvent } from "@/lib/analytics";

export async function POST(
  _req: NextRequest,
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

    const plan = ThesisService.getPlan(id);
    if (!plan) {
      return NextResponse.json({ error: "يجب توليد خطة المذكرة أولاً لتصميم أداة الدراسة" }, { status: 400 });
    }

    const tool = await QuestionnaireDesigner.designTool({
      project: thesis,
      plan,
    });

    trackEvent("thesis_questionnaire_designed", { thesisId: id });

    return NextResponse.json({
      success: true,
      tool,
      note: "تم تصميم استمارة الاستبيان بمحاورها ومقاييس ليكرت الخماسية وإرشادات التحكيم بنجاح.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "تعذر تصميم أداة الدراسة" },
      { status: 500 }
    );
  }
}
