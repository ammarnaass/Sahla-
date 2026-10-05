import { NextRequest, NextResponse } from "next/server";
import { getCurriculumUnits, CATALOG_VERSION } from "@/server/education/curriculumCatalog";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const stage = searchParams.get("stage") || "middle";
  const level = searchParams.get("level") || "4AM";
  const subject = searchParams.get("subject") || "MATHS";
  const track = searchParams.get("track") || searchParams.get("stream") || undefined;

  const units = getCurriculumUnits(stage, level, subject, track);

  return NextResponse.json({
    catalog_version: CATALOG_VERSION,
    stage,
    level,
    subject,
    track: track || null,
    units,
    count: units.length,
  });
}
