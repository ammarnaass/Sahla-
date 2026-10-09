import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { DEFAULT_SHOP_ID } from "@/server/config/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      exam_ids = [],
      include_solutions = false,
      watermark_text = "منصة سهلة · حزمة الامتحانات النموذجية",
      shop_id = DEFAULT_SHOP_ID,
    } = body;

    if (!Array.isArray(exam_ids) || exam_ids.length === 0) {
      return NextResponse.json(
        { error: { code: "invalid_input", message: "يرجى اختيار امتحان واحد على الأقل لإنشاء الحزمة" } },
        { status: 400 }
      );
    }

    if (exam_ids.length > 20) {
      return NextResponse.json(
        { error: { code: "limit_exceeded", message: "الحد الأقصى للامتحانات في الحزمة الواحدة هو 20 امتحاناً" } },
        { status: 400 }
      );
    }

    // Fetch all selected exams
    const placeholders = exam_ids.map(() => "?").join(",");
    const exams: any[] = db
      .prepare(`SELECT * FROM exams WHERE id IN (${placeholders}) ORDER BY year DESC, id ASC`)
      .all(...exam_ids);

    if (exams.length === 0) {
      return NextResponse.json(
        { error: { code: "not_found", message: "لم يتم العثور على أي من الامتحانات المحددة" } },
        { status: 404 }
      );
    }

    const bundleId = `bnd_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const totalPagesEstimated = exams.reduce(
      (sum, e) => sum + (e.pages_count || 2) + (include_solutions && e.has_solution ? 2 : 0),
      1 // cover page
    );

    // Generate bundle preview HTML
    const bundleHtml = `
      <div class="sahla-bundle-doc" dir="rtl" style="font-family: 'Amiri', 'Traditional Arabic', serif;">
        <div style="page-break-after: always; text-align: center; padding: 50px 20px; border: 4px double #1e40af;">
          <h2 style="margin: 0; color: #1e3a8a;">الجمهورية الجزائرية الديمقراطية الشعبية</h2>
          <h3 style="margin: 5px 0 30px 0; color: #2563eb;">سلسلة المواضيع والامتحانات المجمّعة</h3>
          
          <div style="background-color: #eff6ff; border: 2px solid #3b82f6; padding: 25px; border-radius: 12px; margin: 40px auto; max-width: 600px;">
            <h1 style="font-size: 26px; color: #1e40af; margin: 0 0 10px 0;">حزمة امتحانات ونماذج (${exams.length} موضوع)</h1>
            <p style="color: #475569; margin: 0; font-size: 15px;">
              ${exams[0]?.grade || ""} · مادة ${exams[0]?.subject || "متنوعة"}
            </p>
          </div>

          <div style="margin-top: 50px; text-align: right; max-width: 600px; margin-right: auto; margin-left: auto;">
            <h4 style="color: #1e3a8a; border-bottom: 2px solid #cbd5e1; padding-bottom: 5px;">فهرس محتويات الحزمة:</h4>
            <ol style="line-height: 1.8; color: #334155;">
              ${exams.map((e) => `<li><strong>${e.title}</strong> (${e.year} - ${e.pages_count || 2} صفحات)</li>`).join("")}
            </ol>
          </div>

          <div style="margin-top: 60px; font-size: 13px; color: #64748b;">
            طبع عبر: ${watermark_text} · كود الحزمة: ${bundleId}
          </div>
        </div>

        ${exams
          .map(
            (e, idx) => `
          <div style="page-break-after: always; padding: 20px;">
            <div style="border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 15px; display: flex; justify-content: space-between;">
              <span style="font-weight: bold; color: #1e40af;">الموضوع رقم ${idx + 1}: ${e.title}</span>
              <span style="color: #64748b;">السنة: ${e.year}</span>
            </div>
            <div style="white-space: pre-wrap; line-height: 1.8; font-size: 14px; color: #1e293b;">
              ${e.exam_content || "نص الامتحان مرفق بالملف المطبوع."}
            </div>
            ${
              include_solutions && e.has_solution && e.solution_content
                ? `
              <div style="margin-top: 30px; padding: 15px; background-color: #f8fafc; border-right: 4px solid #10b981;">
                <h4 style="color: #065f46; margin: 0 0 10px 0;">الإجابة النموذجية وسلم التنقيط:</h4>
                <div style="white-space: pre-wrap; font-size: 13px; color: #334155;">${e.solution_content}</div>
              </div>
            `
                : ""
            }
          </div>
        `
          )
          .join("")}
      </div>
    `;

    return NextResponse.json({
      bundle_id: bundleId,
      exams_count: exams.length,
      include_solutions,
      pages_estimated: totalPagesEstimated,
      exams: exams.map((e) => ({
        id: e.id,
        title: e.title,
        year: e.year,
        subject: e.subject,
        grade: e.grade,
      })),
      bundle_html: bundleHtml,
      download_url: `/api/v1/exams/bundles/${bundleId}/download`,
      message: "تم تجهيز ملف الطباعة المجمّع بنجاح",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "bundle_failed", message: error?.message || "فشل إنشاء حزمة الامتحانات" } },
      { status: 500 }
    );
  }
}
