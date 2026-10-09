import { NextRequest, NextResponse } from "next/server";
import { listInstitutionProfiles, getInstitutionProfile } from "@/server/education/thesis/institutionProfiles";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const query = searchParams.get("query") || searchParams.get("q") || undefined;
    const degree = searchParams.get("degree") || undefined;
    const language = searchParams.get("language") || undefined;

    if (id) {
      const profile = getInstitutionProfile(id);
      if (!profile) {
        return NextResponse.json({ error: "ملف المؤسسة غير موجود" }, { status: 404 });
      }
      return NextResponse.json({ success: true, profile });
    }

    const profiles = listInstitutionProfiles({ query, degree, language });

    return NextResponse.json({
      success: true,
      count: profiles.length,
      profiles,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "حدث خطأ أثناء جلب ملفات المؤسسات" },
      { status: 500 }
    );
  }
}
