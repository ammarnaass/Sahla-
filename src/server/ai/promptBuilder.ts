/**
 * 📝 AI Admin Engine — Prompt Builder (بنّاء الأوامر الذكية)
 * Constructs layered prompts with system persona + live data context.
 */

import { AI_SYSTEM_PERSONA } from "./config";
import { ContextBuilder } from "./contextBuilder";
import type { AIMessage, AdminContextSnapshot } from "./types";

export class PromptBuilder {
  /**
   * Build the full system instruction with live platform data injected.
   */
  static buildSystemInstruction(contextOverride?: AdminContextSnapshot): string {
    const ctx = contextOverride || ContextBuilder.buildFullContext();
    const dataBlock = ContextBuilder.formatContextForPrompt(ctx);

    return `${AI_SYSTEM_PERSONA}

────────────────────────────
${dataBlock}
────────────────────────────

استخدم هذه البيانات الفعلية في تحليلاتك وإجاباتك. لا تختلق أرقاماً إضافية.`;
  }

  /**
   * Convert our AIMessage[] history to Gemini-compatible format.
   * Only includes user and assistant messages (system goes as instruction).
   */
  static buildChatHistory(messages: AIMessage[]): { role: "user" | "model"; parts: { text: string }[] }[] {
    return messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role === "assistant" ? ("model" as const) : ("user" as const),
        parts: [{ text: m.content }],
      }));
  }

  /**
   * Build a specialized prompt for generating insights.
   */
  static buildInsightsPrompt(ctx: AdminContextSnapshot): string {
    const dataBlock = ContextBuilder.formatContextForPrompt(ctx);

    return `بناءً على البيانات التالية لمنصة سهلة الوطنية، قم بتوليد 3 إلى 5 رؤى ذكية (insights) في شكل JSON.

${dataBlock}

لكل رؤية، حدد:
- type: "growth" | "risk" | "opportunity" | "anomaly"
- title_ar: عنوان مختصر بالعربية (أقل من 60 حرف)
- body_ar: شرح تفصيلي (50-150 كلمة)
- severity: "info" | "warning" | "critical"
- icon: إيموجي مناسب واحد
- data_points: كائن يحتوي على الأرقام المرجعية
- action_suggestion_ar: اقتراح عملي قابل للتنفيذ

أجب فقط بـ JSON صالح على شكل مصفوفة []. لا تضف أي نص قبل أو بعد JSON.`;
  }

  /**
   * Build a specialized prompt for generating forecasts.
   */
  static buildForecastPrompt(ctx: AdminContextSnapshot): string {
    const dataBlock = ContextBuilder.formatContextForPrompt(ctx);

    return `بناءً على البيانات التالية لمنصة سهلة الوطنية، قم بتوليد توقعات أعمال ذكية للشهر القادم.

${dataBlock}

وفّر توقعات لكل مؤشر:
1. MRR (الإيراد الشهري المتكرر)
2. عدد المحلات الجديدة
3. حجم الوثائق المنتجة
4. معدل النمو

لكل توقع، حدد:
- metric_ar: اسم المقياس بالعربية
- metric_key: مفتاح برمجي (مثل "mrr", "new_shops")
- current_value: القيمة الحالية (رقم)
- predicted_value: القيمة المتوقعة (رقم)
- confidence: نسبة الثقة (0-1)
- trend: "up" | "down" | "stable"
- period_ar: الفترة الزمنية بالعربية
- explanation_ar: تفسير مختصر

أجب فقط بـ JSON صالح على شكل مصفوفة []. لا تضف أي نص قبل أو بعد JSON.`;
  }
}
