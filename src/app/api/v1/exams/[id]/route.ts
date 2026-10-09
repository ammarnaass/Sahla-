import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { DEFAULT_SHOP_ID } from "@/server/config/constants";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get("shop_id") || DEFAULT_SHOP_ID;

    const exam: any = db.prepare("SELECT * FROM exams WHERE id = ?").get(id);
    if (!exam) {
      return NextResponse.json(
        { error: { code: "not_found", message: "الامتحان غير موجود" } },
        { status: 404 }
      );
    }

    // Increment downloads/views count
    db.prepare("UPDATE exams SET downloads_count = downloads_count + 1 WHERE id = ?").run(id);

    // Check if favorite
    const fav: any = db
      .prepare("SELECT id FROM exam_favorites WHERE shop_id = ? AND exam_id = ?")
      .get(shopId, id);

    // Check if solution is unlocked: either is_free == 1, or unlocked in ledger
    const isFree = Boolean(exam.is_free);
    const unlockedRecord: any = db
      .prepare("SELECT id FROM ledger WHERE shop_id = ? AND description LIKE ?")
      .get(shopId, `%فتح حل الامتحان: ${id}%`);

    const solutionUnlocked = isFree || Boolean(unlockedRecord);

    return NextResponse.json({
      id: exam.id,
      title: exam.title,
      stage: (exam.level || "").toLowerCase(),
      level: exam.grade,
      track: exam.stream,
      subject: exam.subject,
      trimester: exam.trimester,
      year: exam.year,
      session: exam.session || "main",
      type: (exam.type || "exam").toLowerCase(),
      pages_count: exam.pages_count || 2,
      has_solution: Boolean(exam.has_solution),
      is_free: isFree,
      points_cost: exam.points_cost || 2,
      downloads_count: exam.downloads_count + 1,
      is_favorite: Boolean(fav),
      exam_content: exam.exam_content,
      solution_unlocked: solutionUnlocked,
      solution_content: solutionUnlocked ? exam.solution_content : null,
      marking_rubric: solutionUnlocked ? exam.marking_rubric : null,
      signed_pdf_url: `/api/v1/exams/${exam.id}/download?type=exam`,
      signed_solution_url: solutionUnlocked ? `/api/v1/exams/${exam.id}/download?type=solution` : null,
      created_at: exam.created_at,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "fetch_failed", message: error?.message || "فشل جلب تفاصيل الامتحان" } },
      { status: 500 }
    );
  }
}
