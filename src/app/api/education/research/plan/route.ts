import { NextRequest, NextResponse } from "next/server";
import { PRESET_TOPICS, ALGERIAN_SUBJECTS } from "@/lib/educationConstants";
import { trackEvent } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { level, grade, subject, topic, language = "ar", styleLevel = "MODERATE", pageCount = 3 } = body;

    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return NextResponse.json({ error: "يرجى تحديد عنوان أو موضوع البحث" }, { status: 400 });
    }

    const cleanTopic = topic.trim();

    // Check if topic matches one of our rich preset plans
    const matchedPreset = PRESET_TOPICS.find(
      (p) => p.title.toLowerCase().includes(cleanTopic.toLowerCase()) || cleanTopic.toLowerCase().includes(p.title.toLowerCase())
    );

    let outline: string[] = [];

    const { getAlgerianKnowledge, buildDynamicCurriculumContent } = await import("@/server/education/algerianCurriculumKnowledge");
    const matchedKnowledge = getAlgerianKnowledge(cleanTopic);

    if (matchedKnowledge && matchedKnowledge.plansByPages) {
      const targetPageKey = pageCount <= 1 ? 1 : pageCount === 2 ? 2 : pageCount === 3 ? 3 : pageCount <= 5 ? 5 : 10;
      outline = matchedKnowledge.plansByPages[targetPageKey] || matchedKnowledge.plansByPages[5] || matchedKnowledge.plansByPages[3];
    } else if (matchedPreset && matchedPreset.plan) {
      outline = [...matchedPreset.plan];
    } else {
      const subjectName = ALGERIAN_SUBJECTS[subject]?.nameAr || "المادة المقررة";
      const dynamic = buildDynamicCurriculumContent(cleanTopic, level?.toLowerCase() || "middle", pageCount, subjectName);
      outline = dynamic.outline;
    }

    trackEvent("research_plan_created", {
      topic: cleanTopic,
      level,
      grade,
      subject,
      pageCount,
      styleLevel,
    });

    return NextResponse.json({
      success: true,
      topic: cleanTopic,
      outline,
      estimatedPointsCost: pageCount <= 2 ? 10 : pageCount === 3 ? 15 : pageCount === 5 ? 20 : 30,
      note: "تم توليد الخطة للمراجعة مجاناً دون خصم النقاط. اضغط على تأكيد التوليد لإنتاج البحث كاملاً.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "حدث خطأ أثناء توليد الخطة" }, { status: 500 });
  }
}
