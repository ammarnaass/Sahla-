import { NextRequest, NextResponse } from "next/server";
import { LayoutService } from "@/server/education/formatting/layoutService";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "معرّف الوثيقة مفقود" }, { status: 400 });
    }

    const blocks = LayoutService.getBlocks(id);
    const settings = LayoutService.getLayoutSettings(id);
    const assets = LayoutService.getAssets(id);
    const issues = LayoutService.auditLayout(id);

    // Estimate pages based on word counts, headings, tables, and figures
    let totalWords = 0;
    let headingCount = 0;
    let figureCount = 0;
    let tableCount = 0;

    blocks.forEach((b) => {
      if (b.type === "paragraph" && b.content.text) {
        totalWords += b.content.text.trim().split(/\s+/).length;
      } else if (b.type === "heading") {
        headingCount++;
      } else if (b.type === "figure") {
        figureCount++;
      } else if (b.type === "table") {
        tableCount++;
      }
    });

    // Approximate words per A4 page with 1.5 line spacing ≈ 250 words
    const estimatedPages = Math.max(
      1,
      1 + // cover
      1 + // TOC
      Math.ceil(totalWords / 250) +
      Math.ceil(figureCount * 0.4) +
      Math.ceil(tableCount * 0.5)
    );

    return NextResponse.json({
      doc_id: id,
      estimated_pages: estimatedPages,
      block_count: blocks.length,
      figure_count: figureCount,
      table_count: tableCount,
      settings,
      blocks,
      assets,
      issues_summary: {
        total: issues.length,
        critical: issues.filter((i) => i.severity === "critical").length,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "تعذر جلب بيانات المعاينة" },
      { status: 500 }
    );
  }
}
