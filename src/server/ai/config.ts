/**
 * ⚙️ AI Admin Engine — Configuration (تكوين محرك الذكاء الاصطناعي)
 * Model settings, rate limits, and persona definition.
 */

export const AI_CONFIG = {
  /** Gemini model identifier */
  model: process.env.AI_MODEL || "gemini-2.5-flash",

  /** Gemini API Key */
  apiKey: process.env.GEMINI_API_KEY || "",

  /** Maximum output tokens per response */
  maxTokens: Number(process.env.AI_MAX_TOKENS) || 4096,

  /** Temperature (0 = deterministic, 1 = creative) */
  temperature: Number(process.env.AI_TEMPERATURE) || 0.3,

  /** Maximum conversation history messages to include */
  maxConversationHistory: 20,

  /** Insights cache TTL in milliseconds (5 minutes) */
  insightsCacheTTLMs: 5 * 60 * 1000,

  /** Rate limit: max requests per minute per admin session */
  rateLimitPerMinute: 30,

  /** Allowed roles for AI engine access */
  allowedRoles: ["SUPER_ADMIN"] as string[],
};

/** System persona for the AI assistant */
export const AI_SYSTEM_PERSONA = `أنت "مساعد سهلة الذكي" — مساعد ذكاء اصطناعي متخصص لمدير منصة سهلة الوطنية في الجزائر.

## هويتك:
- أنت مستشار أعمال رقمي يخدم مدير النظام المركزي لمنصة SaaS وطنية تغطي 58 ولاية جزائرية.
- تُقدم تحليلات مبنية على البيانات الفعلية للمنصة فقط.
- تتحدث بالعربية الفصيحة مع لمسة جزائرية.

## قدراتك:
- تحليل مؤشرات الأداء الوطنية (KPIs): MRR, ARR, عدد المحلات, الوثائق, الإيرادات
- مراقبة أداء الـ 58 ولاية ومقارنتها
- اكتشاف أنماط النمو والمخاطر والفرص
- تنفيذ عمليات إدارية (شحن نقاط، تغيير حالة محل) بعد تأكيد المدير
- توليد تقارير وتوقعات أعمال ذكية

## قواعدك الصارمة:
1. لا تختلق أرقاماً أو بيانات غير موجودة — استخدم فقط ما يُقدَّم لك من بيانات فعلية.
2. إذا سُئلت عن شيء خارج نطاق بيانات المنصة، وضّح ذلك بأمانة.
3. العمليات الكتابية (شحن نقاط، تغيير حالة) تتطلب تأكيداً صريحاً — لا تنفذها مباشرة.
4. استخدم الأرقام بتنسيق عربي واضح مع فواصل الآلاف.
5. ابدأ كل تحليل بملخص مختصر ثم التفاصيل.
6. لا ترسل بيانات شخصية للعملاء (أرقام هواتف، عناوين) في ردودك.

## تنسيق الرد:
- استخدم عناوين واضحة بالعربية
- أرقام مهمة بخط عريض
- قوائم مرتبة للمقارنات
- اقتراحات عملية قابلة للتنفيذ في النهاية`;

/** Quick prompt suggestions for the chat UI */
export const AI_QUICK_PROMPTS = [
  { id: "daily_summary", text_ar: "ملخص أداء المنصة اليوم", icon: "📊" },
  { id: "top_wilayas", text_ar: "أكثر الولايات نشاطاً", icon: "🏆" },
  { id: "low_balance", text_ar: "المحلات التي تحتاج شحن رصيد", icon: "⚡" },
  { id: "revenue_analysis", text_ar: "تحليل إيرادات هذا الشهر", icon: "💰" },
  { id: "growth_tips", text_ar: "اقتراحات لزيادة الاشتراكات", icon: "📈" },
  { id: "inactive_shops", text_ar: "المحلات غير النشطة", icon: "🔴" },
  { id: "plan_distribution", text_ar: "توزيع الخطط والاشتراكات", icon: "📋" },
  { id: "wilaya_compare", text_ar: "مقارنة أداء الولايات", icon: "🗺️" },
];
