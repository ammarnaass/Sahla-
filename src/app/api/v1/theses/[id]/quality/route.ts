import { NextRequest, NextResponse } from "next/server";
import { ThesisService } from "@/server/education/thesis/thesisService";
import { trackEvent } from "@/lib/analytics";

export async function GET(
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

    const report = ThesisService.getQualityReport(id);
    if (!report) {
      return NextResponse.json({
        success: false,
        message: "لم يتم إجراء فحص الجودة الأكاديمية لهذا المشروع بعد. أرسل طلب POST لتشغيل الفحص.",
      }, { status: 404 });
    }

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "تعذر جلب تقرير الجودة" },
      { status: 500 }
    );
  }
}

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

    const report = ThesisService.runQualityAudit(id);

    trackEvent("thesis_quality_audited", {
      thesisId: id,
      score: report.score,
      passed: report.passed,
    });

    return NextResponse.json({
      success: true,
      report,
      verdict: report.passed
        ? "المذكرة مستوفية لشروط الجودة والمطابقة الأكاديمية المعتمدة."
        : "توجد ملاحظات أو تدقيقات تتطلب المعالجة قبل الاعتماد النهائي.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "حدث خطأ أثناء إجراء تدقيق الجودة والمطابقة" },
      { status: 500 }
    );
  }
}
