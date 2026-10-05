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

    if (matchedPreset && matchedPreset.plan) {
      outline = [...matchedPreset.plan];
    } else {
      // Intelligent curriculum-based outline generator
      const subjectName = ALGERIAN_SUBJECTS[subject]?.nameAr || "المادة المقررة";

      if (level === "PRIMARY") {
        outline = [
          `مقدمة مبسطة حول ${cleanTopic}`,
          `المحور الأول: ما هو ${cleanTopic} وما أهميته في حياتنا اليومية؟`,
          `المحور الثاني: أمثلة ورسومات توضيحية من الكتاب المدرسي`,
          `خاتمة: نصائح وإرشادات عامة للتلاميذ`,
          `المراجع: كتاب ${subjectName} للتعليم الابتدائي - ديوان المطبوعات المدرسية (ONPS)`,
        ];
      } else if (level === "MIDDLE") {
        outline = [
          `المقدمة: الإشكالية العامة لـ ${cleanTopic} في المنهاج الجزائري`,
          `المبحث الأول: المفاهيم الأساسية والنشأة التاريخية/العلمية`,
          `المبحث الثاني: دراسة تفصيلية وتطبيقات واقعية في الجزائر`,
          `المبحث الثالث: التحديات والحلول المقترحة وفق برامج وزارة التربية الوطنية`,
          `الخاتمة: استنتاجات ونتائج البحث`,
          `قائمة المراجع والمصادر الرسمية المعتمدة`,
        ];
      } else {
        // SECONDARY or UNIVERSITY
        outline = [
          `المقدمة: طرح الإشكالية وضبط المفاهيم النظرية لـ ${cleanTopic}`,
          `المبحث الأول: الإطار المفاهيمي والتاريخي / النظريات المؤسسة`,
          `المبحث الثاني: التحليل المعمق والأبعاد التطبيقية والاقتصادية / العلمية`,
          `المبحث الثالث: الواقع الجزائري والآفاق المستقبلية في ظل التنمية المستدامة`,
          `الخاتمة: تركيب شامل والإجابة عن إشكالية البحث`,
          `قائمة المراجع: وثائق وزارة التربية والتعليم العالي والديوان الوطني للمطبوعات المدرسية`,
        ];
      }

      // Expand outline if pageCount >= 5
      if (pageCount >= 5 && outline.length < 7) {
        outline.splice(3, 0, `المبحث التكميلي: مقارنة وتحليل إحصائي ودراسة حالة نموذجية`);
      }
      if (pageCount >= 10 && outline.length < 9) {
        outline.splice(4, 0, `المبحث الميداني: الاستراتيجية الوطنية الجزائرية والمشاريع الكبرى`);
      }
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
