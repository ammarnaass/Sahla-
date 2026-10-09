import { NextRequest, NextResponse } from "next/server";
import { ThesisService } from "@/server/education/thesis/thesisService";
import { trackEvent } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { guide_text, university_hint, faculty_hint, degree_hint } = body;

    if (!guide_text || typeof guide_text !== "string" || guide_text.trim().length < 50) {
      return NextResponse.json(
        { error: "يرجى تقديم نص دليل المذكرة (50 حرفاً على الأقل) لاستخراج القواعد الأكاديمية" },
        { status: 400 }
      );
    }

    const profile = await ThesisService.extractProfileFromGuide(guide_text, {
      university: university_hint,
      faculty: faculty_hint,
      degree: degree_hint,
    });

    trackEvent("institution_profile_extracted", {
      profileId: profile.profile_id,
      university: profile.institution_name,
    });

    return NextResponse.json({
      success: true,
      profile,
      note: "تم استخراج قواعد الهيكل والتوثيق من دليل المذكرة بنجاح. يمكنك مراجعتها واعتمادها لمشروعك.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "تعذر استخراج القواعد من دليل المذكرة" },
      { status: 500 }
    );
  }
}
