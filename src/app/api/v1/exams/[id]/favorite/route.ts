import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { DEFAULT_SHOP_ID } from "@/server/config/constants";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { shop_id = DEFAULT_SHOP_ID } = body;

    const exam: any = db.prepare("SELECT id FROM exams WHERE id = ?").get(id);
    if (!exam) {
      return NextResponse.json(
        { error: { code: "not_found", message: "الامتحان غير موجود" } },
        { status: 404 }
      );
    }

    const existing: any = db
      .prepare("SELECT id FROM exam_favorites WHERE shop_id = ? AND exam_id = ?")
      .get(shop_id, id);

    let isFavorite: boolean;

    if (existing) {
      db.prepare("DELETE FROM exam_favorites WHERE shop_id = ? AND exam_id = ?").run(shop_id, id);
      isFavorite = false;
    } else {
      const favId = `fav_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
      db.prepare("INSERT INTO exam_favorites (id, shop_id, exam_id, created_at) VALUES (?, ?, ?, datetime('now'))").run(
        favId,
        shop_id,
        id
      );
      isFavorite = true;
    }

    return NextResponse.json({
      success: true,
      exam_id: id,
      is_favorite: isFavorite,
      message: isFavorite ? "تمت إضافة الامتحان إلى المفضلة" : "تمت إزالة الامتحان من المفضلة",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "favorite_failed", message: error?.message || "فشل تعديل المفضلة" } },
      { status: 500 }
    );
  }
}
