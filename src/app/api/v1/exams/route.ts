import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const stage = searchParams.get("stage") || searchParams.get("level"); // e.g. middle, secondary, primary
    const grade = searchParams.get("grade"); // e.g. 4AM, 3AS
    const track = searchParams.get("track") || searchParams.get("stream"); // e.g. scientific, literature
    const subject = searchParams.get("subject");
    const year = searchParams.get("year");
    const session = searchParams.get("session");
    const type = searchParams.get("type");
    const hasSolution = searchParams.get("has_solution");
    const q = searchParams.get("q");
    const shopId = searchParams.get("shop_id") || "shop_1";

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const offset = (page - 1) * limit;

    let whereClauses: string[] = ["1=1"];
    let params: any[] = [];

    if (stage) {
      whereClauses.push("(UPPER(level) = ? OR LOWER(level) = ?)");
      params.push(stage.toUpperCase(), stage.toLowerCase());
    }

    if (grade) {
      whereClauses.push("UPPER(grade) = ?");
      params.push(grade.toUpperCase());
    }

    if (track) {
      whereClauses.push("UPPER(stream) = ?");
      params.push(track.toUpperCase());
    }

    if (subject) {
      whereClauses.push("UPPER(subject) = ?");
      params.push(subject.toUpperCase());
    }

    if (year) {
      whereClauses.push("year = ?");
      params.push(parseInt(year, 10));
    }

    if (session) {
      whereClauses.push("LOWER(session) = ?");
      params.push(session.toLowerCase());
    }

    if (type) {
      whereClauses.push("UPPER(type) = ?");
      params.push(type.toUpperCase());
    }

    if (hasSolution !== null && hasSolution !== undefined) {
      whereClauses.push("has_solution = ?");
      params.push(hasSolution === "true" || hasSolution === "1" ? 1 : 0);
    }

    if (q && q.trim()) {
      whereClauses.push("(title LIKE ? OR exam_content LIKE ?)");
      params.push(`%${q.trim()}%`, `%${q.trim()}%`);
    }

    const whereSql = whereClauses.join(" AND ");

    // Count total matches
    const countRow: any = db
      .prepare(`SELECT COUNT(*) as total FROM exams WHERE ${whereSql}`)
      .get(...params);
    const total = countRow?.total || 0;

    // Fetch favorites for this shop to annotate results
    const favorites: any[] = db
      .prepare("SELECT exam_id FROM exam_favorites WHERE shop_id = ?")
      .all(shopId);
    const favSet = new Set(favorites.map((f) => f.exam_id));

    // Fetch page items
    const rows: any[] = db
      .prepare(`
        SELECT id, title, level, grade, stream, subject, trimester, year, session, type,
               pages_count, has_solution, is_free, points_cost, downloads_count, created_at
        FROM exams
        WHERE ${whereSql}
        ORDER BY year DESC, id DESC
        LIMIT ? OFFSET ?
      `)
      .all(...params, limit, offset);

    const items = rows.map((r) => ({
      id: r.id,
      title: r.title,
      stage: (r.level || "").toLowerCase(),
      level: r.grade,
      track: r.stream,
      subject: r.subject,
      trimester: r.trimester,
      year: r.year,
      session: r.session || "main",
      type: (r.type || "exam").toLowerCase(),
      pages_count: r.pages_count || 2,
      has_solution: Boolean(r.has_solution),
      is_free: Boolean(r.is_free),
      points_cost: r.points_cost || 2,
      downloads_count: r.downloads_count || 0,
      is_favorite: favSet.has(r.id),
      created_at: r.created_at,
    }));

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "fetch_failed", message: error?.message || "فشل جلب قائمة الامتحانات" } },
      { status: 500 }
    );
  }
}
