import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RepairLoopEngine } from "@/server/education/guidance/repairLoop";
import { GuidanceValidators } from "@/server/education/guidance/validators";
import { SpecCompiler } from "@/server/education/guidance/specCompiler";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { section_id, user_feedback } = body;

    // Load doc from db
    const docRow = db.prepare(`SELECT * FROM research_docs WHERE id = ?`).get(id) as any;
    if (!docRow) {
      return NextResponse.json(
        { error: { code: "generation_not_found", message: `المستند غير موجود: ${id}` } },
        { status: 404 }
      );
    }

    const doc = {
      meta: { topic: docRow.topic, pages: docRow.page_count },
      cover: { template: docRow.cover_template, title: docRow.title },
      sections: JSON.parse(docRow.content_json || "[]"),
      references: JSON.parse(docRow.references_json || "[]"),
    };

    // Re-resolve or build dummy spec for repair
    const spec = SpecCompiler.compileBrief({
      id: `br_rep_${id}`,
      shop_id: docRow.shop_id,
      kind: "research",
      context: {
        stage: docRow.level?.toLowerCase() === "primary" ? "primary" : docRow.level?.toLowerCase() === "secondary" ? "secondary" : "middle",
        level: parseInt(docRow.grade) || 3,
        grade_code: docRow.grade,
        subject: docRow.subject,
      },
      topic: { topic_text: docRow.topic },
      specs: { pages: docRow.page_count, language: "ar", style: "moderate" },
      created_at: new Date().toISOString(),
    });

    const val = GuidanceValidators.validate({
      kind: "research",
      document: doc,
      spec,
      attempts: 1,
    });

    const repairRes = RepairLoopEngine.executeRepair({
      spec,
      document: doc,
      report: val.report,
      attemptsCount: 1,
    });

    // Save updated doc in DB
    db.prepare(`
      UPDATE research_docs
      SET content_json = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(JSON.stringify(repairRes.document.sections), id);

    return NextResponse.json({
      id,
      status: repairRes.status,
      repaired_sections: repairRes.repairedSectionIds,
      conformance: repairRes.conformance,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "repair_failed", message: err?.message } },
      { status: 500 }
    );
  }
}
