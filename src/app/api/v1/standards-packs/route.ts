import { NextRequest, NextResponse } from "next/server";
import { StandardsPackRepository } from "@/server/education/guidance/standardsPacks";

export async function GET() {
  try {
    const packs = StandardsPackRepository.listPacks();
    return NextResponse.json({
      packs: packs.map((p) => ({
        pack_id: p.pack_id,
        stage: p.stage,
        level: p.level,
        subject: p.subject,
        language: p.language,
        units_count: p.curriculum.units.length,
        units: p.curriculum.units.map((u) => ({ id: u.id, title: u.title })),
      })),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "packs_fetch_failed", message: err?.message } },
      { status: 500 }
    );
  }
}
