import { NextRequest, NextResponse } from "next/server";
import { ThesisService } from "@/server/education/thesis/thesisService";
import { DEFAULT_SHOP_ID } from "@/server/config/constants";
import { trackEvent } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      shopId = DEFAULT_SHOP_ID,
      topic,
      studentName = "الطالب(ة) الباحث",
      supervisorName = "الأستاذ المشرف",
      juryMembers = [],
      university = "الجامعة الجزائرية",
      faculty = "كلية العلوم",
      department = "",
      specialty = "علوم وتكنولوجيا",
      degree = "MASTER_ACADEMIC",
      profileId,
      language = "ar",
      academicYear = "2025 / 2026 م",
      type = "THEORETICAL",
      targetPages = 60,
      citationStyle,
      methodologyType,
      hasDataset = false,
      datasetFilename,
      teacherRequirements,
    } = body;

    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return NextResponse.json({ error: "يرجى تحديد عنوان وموضوع المذكرة" }, { status: 400 });
    }

    const project = await ThesisService.createThesis({
      shopId,
      topic,
      studentName,
      supervisorName,
      juryMembers,
      university,
      faculty,
      department,
      specialty,
      degree,
      profileId,
      language,
      academicYear,
      type,
      targetPages,
      citationStyle,
      methodologyType,
      hasDataset,
      datasetFilename,
      teacherRequirements,
    });

    trackEvent("thesis_project_created", {
      thesisId: project.id,
      degree: project.degree,
      type: project.type,
      pages: project.target_pages,
      profileId: project.profile_id,
    });

    return NextResponse.json({
      success: true,
      thesis: project,
      next_action: "plan",
      note: "تم إنشاء مشروع المذكرة بنجاح. الخطوة التالية: توليد الخطة الأكاديمية.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "حدث خطأ أثناء إنشاء مشروع المذكرة" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get("shopId") || DEFAULT_SHOP_ID;

    const list = ThesisService.listByShop(shopId);

    return NextResponse.json({
      success: true,
      count: list.length,
      theses: list,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "حدث خطأ أثناء جلب قائمة المذكرات" },
      { status: 500 }
    );
  }
}
