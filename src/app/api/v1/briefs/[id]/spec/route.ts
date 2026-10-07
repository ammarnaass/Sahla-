import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Brief } from "@/server/education/guidance/types";
import { SpecCompiler } from "@/server/education/guidance/specCompiler";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const row = db.prepare(`SELECT * FROM briefs WHERE id = ?`).get(id) as any;
    if (!row) {
      return NextResponse.json(
        { error: { code: "brief_not_found", message: `الـ Brief المطلوب غير موجود: ${id}` } },
        { status: 404 }
      );
    }

    const brief: Brief = {
      id: row.id,
      shop_id: row.shop_id,
      kind: row.kind,
      context: JSON.parse(row.context_json),
      topic: JSON.parse(row.topic_json),
      specs: JSON.parse(row.specs_json),
      teacher_requirements: row.teacher_requirements,
      cover: row.cover_json ? JSON.parse(row.cover_json) : undefined,
      created_at: row.created_at,
    };

    const spec = SpecCompiler.compileBrief(brief);

    return NextResponse.json({
      spec_id: spec.spec_id,
      pack_id: spec.pack_id,
      summary_ar: spec.summary_ar,
      constraints: spec.constraints,
      structure: spec.structure,
      estimate_points: spec.estimate_points,
      warnings: spec.warnings,
      label: spec.label,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "spec_compilation_failed", message: err?.message || "خطأ أثناء تجميع المواصفة" } },
      { status: 500 }
    );
  }
}
