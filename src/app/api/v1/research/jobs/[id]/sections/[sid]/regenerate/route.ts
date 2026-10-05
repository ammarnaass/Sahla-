import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { runSectionWriter } from "@/server/education/skills/sectionWriter";
import { WalletGuard } from "@/server/education/walletGuard";
import { SectionContent, FinalResearchDocument } from "@/server/education/types";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; sid: string }> }
) {
  try {
    const { id: jobId, sid: sectionId } = await params;
    const body = await req.json().catch(() => ({}));
    const { feedback, style } = body;

    // 1. Fetch Job
    const job: any = db.prepare("SELECT * FROM research_jobs WHERE id = ?").get(jobId);
    if (!job) {
      return NextResponse.json(
        { error: { code: "not_found", message: "المهمة غير موجودة" } },
        { status: 404 }
      );
    }

    if (job.status !== "done" || !job.result_json) {
      return NextResponse.json(
        { error: { code: "job_not_ready", message: "لا يمكن إعادة توليد فقرة قبل اكتمال توليد البحث" } },
        { status: 400 }
      );
    }

    const document: FinalResearchDocument = JSON.parse(job.result_json);
    const targetSection = document.sections.find((s) => s.id === sectionId);
    if (!targetSection) {
      return NextResponse.json(
        { error: { code: "section_not_found", message: "الفقرة المطلوبة غير موجودة في هذا البحث" } },
        { status: 404 }
      );
    }

    // 2. Check regeneration count (Limit 3 free)
    const runRows: any[] = db
      .prepare("SELECT COUNT(*) as count FROM skill_runs WHERE job_id = ? AND skill_name = 'section-regenerate'")
      .all(jobId);
    const currentRegenCount = runRows[0]?.count || 0;

    let pointsCharged = 0;
    const shopId = job.shop_id || "shop_1";

    if (currentRegenCount >= 3) {
      // Cost 2 points for subsequent regenerations
      pointsCharged = 2;
      const reservation = WalletGuard.reservePoints(
        shopId,
        pointsCharged,
        `إعادة توليد فقرة مدفوعة (${targetSection.title})`
      );
      if (!reservation.ok) {
        return NextResponse.json(
          {
            error: {
              code: "insufficient_points",
              message: reservation.error || `رصيد النقاط لا يكفي لإعادة التوليد. مطلوب: ${pointsCharged} نقاط، متوفر: ${reservation.newBalance}`,
            },
          },
          { status: 402 }
        );
      }
      WalletGuard.settlePoints(shopId, pointsCharged, `تثبيت خصم إعادة توليد الفقرة (${targetSection.title})`);
    }

    // 3. Re-run SectionWriter
    const outlineItem = document.outline.find((o) => o.id === sectionId) || {
      id: sectionId,
      title: targetSection.title,
      type: "body" as const,
      target_words: 180,
      key_points: [targetSection.title, feedback || "إعادة صياغة موسعة ومفصلة"],
    };

    const existingKeyPoints = Array.isArray(outlineItem.key_points) ? outlineItem.key_points : [targetSection.title];
    const updatedKeyPoints = feedback ? [...existingKeyPoints, feedback] : existingKeyPoints;

    const startTime = Date.now();
    const newSectionContent: SectionContent = runSectionWriter({
      section: {
        ...outlineItem,
        key_points: updatedKeyPoints,
      },
      topic: document.cover.title,
      stage: document.meta.stage,
      level: document.meta.level,
      style: style || document.meta.style,
      language: document.meta.language,
    });

    // 4. Update the document sections
    document.sections = document.sections.map((sec) =>
      sec.id === sectionId ? { ...newSectionContent, id: sectionId } : sec
    );

    // 5. Save back to database
    db.prepare(`
      UPDATE research_jobs 
      SET result_json = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(JSON.stringify(document), jobId);

    // 6. Record in skill_runs
    const durationMs = Date.now() - startTime;
    db.prepare(`
      INSERT INTO skill_runs (id, skill_name, job_id, model, input_json, output_json, duration_ms, created_at)
      VALUES (?, 'section-regenerate', ?, 'claude-sonnet-5-5', ?, ?, ?, datetime('now'))
    `).run(
      `sr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      jobId,
      JSON.stringify({ sectionId, feedback, style }),
      JSON.stringify(newSectionContent),
      durationMs
    );

    const freeRemaining = Math.max(0, 3 - (currentRegenCount + 1));

    return NextResponse.json({
      id: sectionId,
      title: targetSection.title,
      blocks: newSectionContent.blocks,
      free_remaining: freeRemaining,
      points_charged: pointsCharged,
      message: pointsCharged > 0 ? `تمت إعادة التوليد بخصم ${pointsCharged} نقاط.` : `تمت إعادة التوليد مجاناً (${freeRemaining} متبقية).`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "regeneration_failed", message: error?.message || "فشلت إعادة توليد الفقرة" } },
      { status: 500 }
    );
  }
}
