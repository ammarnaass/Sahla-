import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Brief } from "@/server/education/guidance/types";
import { SpecCompiler } from "@/server/education/guidance/specCompiler";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      shop_id = "shop_1",
      kind = "research",
      context,
      topic,
      specs,
      teacher_requirements,
      cover,
    } = body;

    if (!context || !topic || !specs) {
      return NextResponse.json(
        { error: { code: "spec_incomplete", message: "بيانات السياق والموضوع والمواصفات إلزامية" } },
        { status: 400 }
      );
    }

    const briefId = `br_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

    const brief: Brief = {
      id: briefId,
      shop_id,
      kind,
      context,
      topic: typeof topic === "string" ? { topic_text: topic } : topic,
      specs,
      teacher_requirements,
      cover,
      created_at: new Date().toISOString(),
    };

    // Save Brief in DB
    db.prepare(`
      INSERT INTO briefs (
        id, shop_id, kind, context_json, topic_json, specs_json, teacher_requirements, cover_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(
      brief.id,
      brief.shop_id,
      brief.kind,
      JSON.stringify(brief.context),
      JSON.stringify(brief.topic),
      JSON.stringify(brief.specs),
      brief.teacher_requirements || null,
      brief.cover ? JSON.stringify(brief.cover) : null
    );

    // Also auto-compile a preliminary Spec for convenience
    const spec = SpecCompiler.compileBrief(brief);

    return NextResponse.json({
      brief_id: brief.id,
      spec_id: spec.spec_id,
      spec,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "brief_creation_failed", message: err?.message || "خطأ أثناء إنشاء الـ Brief" } },
      { status: 500 }
    );
  }
}
