/**
 * 📋 Skill: questionnaire-designer (مصمم أدوات البحث والاستبيانات الأكاديمية)
 * مواصفة استوديو المذكرات (PRD النسخة 1.0 - الجزائر)
 * 
 * المبدأ:
 * يساعد الطالب والباحث في بناء أداة جمع البيانات العلمية (استبيان، استمارة مقابلة، شبكة ملاحظة)،
 * ويحدد المحاور ومقاييس ليكرت (Likert) ومؤشرات الصدق والثبات وحجم العينة المقترح،
 * مع تنبيه أخلاقي صارم: الأداة لا تختلق إجابات أو بيانات وهمية أبداً.
 */

import { AIProviderRouter } from "@/server/ai/providers/providerRouter";
import { ThesisProject, ThesisPlan } from "../types";

export interface QuestionnaireTool {
  tool_type: "questionnaire" | "semi_structured_interview" | "observation_grid";
  title: string;
  target_population: string;
  sample_size_recommendation: {
    recommended_sample: number;
    sampling_technique: string; // عينة عشوائية بسيطة، عينة طبقية، عينة قصدية
    rationale: string;
  };
  measurement_scale: "likert_5" | "likert_3" | "binary" | "qualitative";
  scale_labels: string[]; // [غير موافق تماماً, غير موافق, محايد, موافق, موافق تماماً]
  dimensions: Array<{
    dimension_id: string; // d1, d2...
    name: string; // المحور الأول: ...
    hypothesis_linked: string; // الفرضية المقابلة
    items: Array<{
      item_id: string; // q1, q2...
      question_text: string;
      is_reverse_coded?: boolean; // تشفير عكسي
    }>;
  }>;
  validity_and_reliability_guidance: {
    face_validity: string; // الصدق الظاهري (تحكيم الأساتذة)
    cronbach_alpha_guideline: string; // ثبات الاتساق الداخلي (ألفا كرونباخ)
  };
  ethical_disclaimer: string;
}

export class QuestionnaireDesigner {
  public static async designTool(params: {
    project: ThesisProject;
    plan: ThesisPlan;
  }): Promise<QuestionnaireTool> {
    const { project, plan } = params;

    const systemPrompt = `[ROLE] أنت أستاذ مناهج البحث العلمي والإحصاء في الجامعات الجزائرية.
مهمتك تصميم استبيان أو أداة دراسة ميدانية محكمة علمياً لمذكرة تخرج (${project.degree}) بعنوان: "${project.title}".
التخصص: ${project.specialty}.
المنهج المقرر: ${plan.methodology.type}.

[قواعد الصدق والأمانة العلمية]
1. الأداة تُبنى وفق مقياس ليكرت الخماسي (Likert 5-point scale): غير موافق تماماً (1) إلى موافق تماماً (5).
2. توزيع المحاور (Dimensions) يجب أن يقابل بدقة الفرضيات العلمية المقررة:
${plan.hypotheses.map((h, i) => `   - المحور ${i + 1}: مقابل للفرضية: "${h}"`).join("\n")}
3. صياغة عبارات واضحة وقابلة للقياس الميداني بدون توجيه أو تحيز.
4. تحديد حجم العينة التقديري وطريقة المعاينة المناسبة للمؤسسات الجزائرية.
5. تضمين التنبيه الأخلاقي والصدق الظاهري (عرض الاستمارة على لجنة التحكيم).
6. أرجع النتيجة بصيغة JSON حصراً.`;

    const userPrompt = `موضوع المذكرة: "${project.title}"
الفرضيات المعتمدة:
${plan.hypotheses.map((h, i) => `${i + 1}. ${h}`).join("\n")}
الأدوات المقترحة بالخطة: ${plan.methodology.tools.join("، ")}
مجتمع الدراسة المتوقع: ${plan.methodology.sample || "إطارات وموظفو المؤسسات المعنية"}

أرجع JSON بالشكل التالي حصراً:
{
  "tool_type": "questionnaire",
  "title": "استمارة استبيان حول: ${project.title}",
  "target_population": "مجتمع الدراسة المحدد...",
  "sample_size_recommendation": {
    "recommended_sample": 80,
    "sampling_technique": "عينة عشوائية بسيطة / قصدية",
    "rationale": "مبررات تحديد الحجم..."
  },
  "measurement_scale": "likert_5",
  "scale_labels": ["غير موافق تماماً", "غير موافق", "محايد", "موافق", "موافق تماماً"],
  "dimensions": [
    {
      "dimension_id": "d1",
      "name": "المحور الأول: ...",
      "hypothesis_linked": "${plan.hypotheses[0] || ""}",
      "items": [
        { "item_id": "q1", "question_text": "نص العبارة 1...", "is_reverse_coded": false },
        { "item_id": "q2", "question_text": "نص العبارة 2...", "is_reverse_coded": false }
      ]
    }
  ],
  "validity_and_reliability_guidance": {
    "face_validity": "عرض الاستمارة على محكمين من أساتذة التخصص في الجامعة.",
    "cronbach_alpha_guideline": "حساب معامل ألفا كرونباخ ويشترط أن يتجاوز 0.70 لقبول الثبات."
  },
  "ethical_disclaimer": "تنبيه أخلاقي: تُستخدم البيانات لأغراض البحث العلمي الصرف وتُعامل الإجابات بسرية تامة طبقاً للتشريع الجزائري."
}`;

    try {
      const aiResponse = await AIProviderRouter.run({
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
        schema: true,
        maxTokens: 3000,
        temperature: 0.2,
        timeoutMs: 45000,
        metadata: { skill: "questionnaire-designer", jobId: `quest_${project.id}` },
      });

      if (aiResponse && aiResponse.text) {
        let cleanText = aiResponse.text.trim();
        const firstBrace = cleanText.indexOf("{");
        const lastBrace = cleanText.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          cleanText = cleanText.substring(firstBrace, lastBrace + 1);
        }
        const parsed = JSON.parse(cleanText);
        if (parsed && Array.isArray(parsed.dimensions) && parsed.dimensions.length > 0) {
          return parsed as QuestionnaireTool;
        }
      }
    } catch (err: any) {
      console.warn("[QuestionnaireDesigner] AI fallback:", err?.message);
    }

    return this.buildGroundedFallback(project, plan);
  }

  private static buildGroundedFallback(
    project: ThesisProject,
    plan: ThesisPlan
  ): QuestionnaireTool {
    return {
      tool_type: "questionnaire",
      title: `استمارة استبيان دراسة ميدانية حول: ${project.title}`,
      target_population: plan.methodology.sample || `الموظفون والمهنيون في القطاع المعني (${project.specialty})`,
      sample_size_recommendation: {
        recommended_sample: 65,
        sampling_technique: "عينة عشوائية بسيطة ممثلة",
        rationale: "حجم عينة كافٍ إحصائياً لإجراء اختبارات t ومعاملات ألفا كرونباخ بدلالة معنوية (p < 0.05).",
      },
      measurement_scale: "likert_5",
      scale_labels: ["غير موافق تماماً", "غير موافق", "محايد", "موافق", "موافق تماماً"],
      dimensions: plan.hypotheses.map((h, idx) => ({
        dimension_id: `d${idx + 1}`,
        name: `المحور ${idx + 1}: قياس مؤشرات الفرضية ${idx + 1}`,
        hypothesis_linked: h,
        items: [
          { item_id: `q${idx + 1}_1`, question_text: `تتوفر المؤسسة على الآليات الكافية لتطبيق مبادئ ${project.clean_title || project.title}.`, is_reverse_coded: false },
          { item_id: `q${idx + 1}_2`, question_text: `يساهم التطبيق الفعلي في رفع كفاءة الأداء التشغيلي والمؤسسي.`, is_reverse_coded: false },
          { item_id: `q${idx + 1}_3`, question_text: `توجد تحديات تنظيمية تحول دون استثمار النتائج بالشكل الأمثل.`, is_reverse_coded: true },
        ],
      })),
      validity_and_reliability_guidance: {
        face_validity: "عرض الاستمارة على لجنة تحكيم تتكون من 3 أساتذة جامعيين في التخصص للتأكد من وضوح العبارات وصدق المحتوى.",
        cronbach_alpha_guideline: "إجراء دراسة استطلاعية أولية على 15 مفردة واحتساب معامل ألفا كرونباخ (يشترط > 0.70).",
      },
      ethical_disclaimer: "تنبيه أخلاقي: هذه الاستمارة أداة علمية لجمع المعطيات الواقعية، ولا يجوز اختلاق إجابات أو نسب إحصائية وهمية دون تفريغ فعلي للاستمارات المسترجعة.",
    };
  }
}
