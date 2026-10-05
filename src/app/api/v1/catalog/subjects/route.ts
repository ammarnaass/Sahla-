import { NextRequest, NextResponse } from "next/server";
import {
  CURRICULUM_CATALOG,
  CATALOG_VERSION,
  ALGERIAN_WILAYAS_DIRECTORATES,
  getCurriculumUnits,
} from "@/server/education/curriculumCatalog";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const stage = searchParams.get("stage");
  const level = searchParams.get("level");
  const subject = searchParams.get("subject");
  const track = searchParams.get("track") || searchParams.get("stream");

  // If specific filters are provided, return the matching curriculum units
  if (stage && level && subject) {
    const units = getCurriculumUnits(stage, level, subject, track || undefined);
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

  // Full catalog response
  return NextResponse.json({
    catalog_version: CATALOG_VERSION,
    official_source: "وزارة التربية الوطنية · المناهج والوثائق المرافقة الرسمية والكتب المدرسية (ONPS)",
    directorates: ALGERIAN_WILAYAS_DIRECTORATES,
    stages: [
      {
        id: "primary",
        name: "التعليم الابتدائي",
        levels: CURRICULUM_CATALOG.stages.primary.map((l) => ({
          id: l.id,
          code: l.code,
          name: l.name,
          is_official_exam: l.is_official_exam_year || false,
          exam_title: l.exam_title || null,
          subjects: l.subjects?.map((s) => ({
            id: s.id,
            name: s.name,
            coefficient: s.coefficient,
            weekly_hours: s.weekly_hours,
            exam_duration_hours: s.exam_duration_hours,
            has_situation_integration: s.has_situation_integration,
            units_count: s.units.length,
          })),
        })),
      },
      {
        id: "middle",
        name: "التعليم المتوسط (BEM)",
        levels: CURRICULUM_CATALOG.stages.middle.map((l) => ({
          id: l.id,
          code: l.code,
          name: l.name,
          is_official_exam: l.is_official_exam_year || false,
          exam_title: l.exam_title || null,
          subjects: l.subjects?.map((s) => ({
            id: s.id,
            name: s.name,
            coefficient: s.coefficient,
            weekly_hours: s.weekly_hours,
            exam_duration_hours: s.exam_duration_hours,
            has_situation_integration: s.has_situation_integration,
            units_count: s.units.length,
          })),
        })),
      },
      {
        id: "secondary",
        name: "التعليم الثانوي (BAC)",
        levels: CURRICULUM_CATALOG.stages.secondary.map((l) => ({
          id: l.id,
          code: l.code,
          name: l.name,
          is_official_exam: l.is_official_exam_year || false,
          exam_title: l.exam_title || null,
          tracks: l.tracks?.map((t) => ({
            id: t.id,
            name: t.name,
            subjects: t.subjects.map((s) => ({
              id: s.id,
              name: s.name,
              coefficient: s.coefficient,
              weekly_hours: s.weekly_hours,
              exam_duration_hours: s.exam_duration_hours,
              has_situation_integration: s.has_situation_integration,
              units_count: s.units.length,
            })),
          })),
        })),
      },
    ],
  });
}
