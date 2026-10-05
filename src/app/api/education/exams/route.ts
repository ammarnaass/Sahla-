import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trackEvent } from "@/lib/analytics";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const level = searchParams.get("level");
    const grade = searchParams.get("grade");
    const stream = searchParams.get("stream");
    const subject = searchParams.get("subject");
    const year = searchParams.get("year");
    const trimester = searchParams.get("trimester");
    const type = searchParams.get("type"); // OFFICIAL, TERM_EXAM, QUIZ
    const query = searchParams.get("q");

    let sql = "SELECT * FROM exams WHERE 1=1";
    const params: any[] = [];

    if (level) {
      sql += " AND level = ?";
      params.push(level);
    }
    if (grade) {
      sql += " AND grade = ?";
      params.push(grade);
    }
    if (stream) {
      sql += " AND (stream = ? OR stream IS NULL)";
      params.push(stream);
    }
    if (subject) {
      sql += " AND subject = ?";
      params.push(subject);
    }
    if (year) {
      sql += " AND year = ?";
      params.push(parseInt(year, 10));
    }
    if (trimester) {
      sql += " AND trimester = ?";
      params.push(parseInt(trimester, 10));
    }
    if (type) {
      sql += " AND type = ?";
      params.push(type);
    }
    if (query && query.trim().length > 0) {
      sql += " AND (title LIKE ? OR exam_content LIKE ?)";
      params.push(`%${query.trim()}%`, `%${query.trim()}%`);
    }

    sql += " ORDER BY year DESC, created_at DESC LIMIT 50";

    const rows: any[] = db.prepare(sql).all(...params);

    const formatted = rows.map((r) => {
      let contentParsed = null;
      let solutionParsed = null;
      try {
        contentParsed = JSON.parse(r.exam_content);
      } catch {
        contentParsed = { text: r.exam_content };
      }
      try {
        solutionParsed = r.solution_content ? JSON.parse(r.solution_content) : null;
      } catch {
        solutionParsed = { text: r.solution_content };
      }

      return {
        id: r.id,
        title: r.title,
        level: r.level,
        grade: r.grade,
        stream: r.stream,
        subject: r.subject,
        trimester: r.trimester,
        year: r.year,
        session: r.session,
        type: r.type,
        pagesCount: r.pages_count,
        hasSolution: Boolean(r.has_solution),
        examContent: contentParsed,
        solutionContent: solutionParsed,
        markingRubric: r.marking_rubric,
        isFree: Boolean(r.is_free),
        pointsCost: r.points_cost,
        downloadsCount: r.downloads_count,
      };
    });

    trackEvent("exam_viewed", { count: formatted.length, filters: { level, grade, subject, year } });

    return NextResponse.json({
      success: true,
      total: formatted.length,
      exams: formatted,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "حدث خطأ أثناء جلب قائمة الامتحانات" }, { status: 500 });
  }
}
