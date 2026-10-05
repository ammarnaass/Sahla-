import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { WalletGuard } from "@/server/education/walletGuard";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { shop_id = "shop_1" } = body;

    const exam: any = db.prepare("SELECT * FROM exams WHERE id = ?").get(id);
    if (!exam) {
      return NextResponse.json(
        { error: { code: "not_found", message: "الامتحان غير موجود" } },
        { status: 404 }
      );
    }

    if (!exam.has_solution) {
      return NextResponse.json(
        { error: { code: "no_solution", message: "لا يتوفر حل نموذجي لهذا الامتحان حالياً" } },
        { status: 400 }
      );
    }

    // Check if already unlocked
    const isFree = Boolean(exam.is_free);
    const existingUnlock: any = db
      .prepare("SELECT id FROM ledger WHERE shop_id = ? AND description LIKE ?")
      .get(shop_id, `%فتح حل الامتحان: ${id}%`);

    if (isFree || existingUnlock) {
      return NextResponse.json({
        success: true,
        already_unlocked: true,
        points_deducted: 0,
        solution_content: exam.solution_content,
        marking_rubric: exam.marking_rubric,
        message: "الحل النموذجي متاح ومفتوح مسبقاً",
      });
    }

    const costPoints = exam.points_cost || 2;

    // Atomic points deduction via WalletGuard
    const reservation = WalletGuard.reservePoints(
      shop_id,
      costPoints,
      `فتح حل الامتحان: ${id} (${exam.title})`
    );

    if (!reservation.ok) {
      return NextResponse.json(
        {
          error: {
            code: "insufficient_points",
            message: reservation.error || `رصيد النقاط لا يكفي لفتح الحل. مطلوب: ${costPoints} نقاط، متوفر: ${reservation.newBalance}`,
          },
        },
        { status: 402 }
      );
    }

    WalletGuard.settlePoints(
      shop_id,
      costPoints,
      `فتح حل الامتحان: ${id} (${exam.title})`
    );

    return NextResponse.json({
      success: true,
      points_deducted: costPoints,
      solution_content: exam.solution_content,
      marking_rubric: exam.marking_rubric,
      message: `تم فتح الحل النموذجي بنجاح وخصم ${costPoints} نقاط.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "unlock_failed", message: error?.message || "فشل فتح الحل" } },
      { status: 500 }
    );
  }
}
