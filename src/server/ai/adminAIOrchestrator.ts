/**
 * 🧠 AI Admin Engine — Orchestrator (المنسق الرئيسي لمحرك الذكاء الاصطناعي)
 * Coordinates chat, insights, forecasts, and tool execution via Gemini 2.5 Flash.
 */

import { GoogleGenAI } from "@google/genai";
import { db } from "@/lib/db";
import { AI_CONFIG } from "./config";
import { PromptBuilder } from "./promptBuilder";
import { ContextBuilder } from "./contextBuilder";
import { executeTool, getGeminiFunctionDeclarations } from "./toolRouter";
import { AIProviderRouter } from "./providers/providerRouter";
import type {
  AIMessage,
  AIInsight,
  AIForecast,
  AdminContextSnapshot,
  AdminAITool,
  ToolExecutionResult,
  AIConversation,
} from "./types";

// Initialize database tables for AI engine
function initAITables() {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS ai_conversations (
        id TEXT PRIMARY KEY,
        admin_user_id TEXT NOT NULL,
        messages_json TEXT NOT NULL DEFAULT '[]',
        context_snapshot_json TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS ai_audit_log (
        id TEXT PRIMARY KEY,
        admin_user_id TEXT NOT NULL,
        action TEXT NOT NULL,
        input_summary TEXT,
        output_summary TEXT,
        tools_used TEXT,
        duration_ms INTEGER,
        created_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS ai_insights_cache (
        id TEXT PRIMARY KEY,
        insights_json TEXT NOT NULL,
        forecasts_json TEXT,
        generated_at TEXT DEFAULT (datetime('now')),
        expires_at TEXT NOT NULL
      );
    `);
  } catch {
    // Tables may already exist
  }
}

// Ensure tables exist on module load
initAITables();

/**
 * Get or create the Gemini client singleton.
 * Returns null if API key is not configured (graceful degradation).
 */
function getGeminiClient(): GoogleGenAI | null {
  if (!AI_CONFIG.apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey: AI_CONFIG.apiKey });
}

export class AdminAIOrchestrator {
  /**
   * 1. Smart Chat — محادثة ذكية مع بيانات المنصة
   *
   * Handles a conversational turn with the admin, injecting live platform data
   * and supporting function calling for tool execution.
   */
  static async chat(
    userMessages: { role: "user" | "assistant"; content: string }[],
    conversationId?: string,
    adminUserId: string = "user_super_admin"
  ): Promise<{ message: AIMessage; conversationId: string }> {
    const startTime = Date.now();
    const convId = conversationId || `conv_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

    // Build context
    const ctx = ContextBuilder.buildFullContext();
    const systemInstruction = PromptBuilder.buildSystemInstruction(ctx);

    // Try multi-provider gateway first (Gemini -> OpenAI -> Hugging Face with failover)
    let responseText: string;
    let toolsUsed: string[] = [];
    let providerUsed: string = "local";
    let modelUsed: string = "deterministic";

    const lastUserMsg = userMessages[userMessages.length - 1]?.content || "";

    const aiResult = await AIProviderRouter.generate(
      [
        ...userMessages.slice(0, -1).map((m) => ({ role: m.role as any, content: m.content })),
        { role: "user" as const, content: lastUserMsg },
      ],
      {
        systemInstruction,
        temperature: AI_CONFIG.temperature,
        maxTokens: AI_CONFIG.maxTokens,
        tools: [{ functionDeclarations: getGeminiFunctionDeclarations() as any }],
      }
    );

    if (aiResult) {
      providerUsed = aiResult.providerId;
      modelUsed = aiResult.modelId;

      if (aiResult.functionCalls && aiResult.functionCalls.length > 0) {
        for (const fc of aiResult.functionCalls) {
          const toolName = fc.name as AdminAITool;
          const toolParams = fc.args || {};
          toolsUsed.push(toolName);

          const toolResult = executeTool(toolName, toolParams, false);
          responseText = toolResult.summary_ar;
          break;
        }
      } else {
        responseText = aiResult.text || "عذراً، لم أتمكن من معالجة طلبك.";
      }
    } else {
      // ── Local Fallback (Deterministic engine) ──
      responseText = this.generateLocalResponse(userMessages, ctx);
      toolsUsed.push("local_analysis");
    }

    const assistantMessage: AIMessage = {
      id: `msg_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      role: "assistant",
      content: responseText!,
      timestamp: new Date().toISOString(),
      metadata: {
        tools_used: toolsUsed,
        confidence: providerUsed === "local" ? 0.7 : 0.95,
      },
    };

    // Persist conversation
    this.saveConversation(convId, adminUserId, userMessages, assistantMessage, ctx);

    // Audit log
    this.logAudit(adminUserId, `chat:${providerUsed}:${modelUsed}`, userMessages[userMessages.length - 1]?.content, responseText!, toolsUsed, Date.now() - startTime);

    return { message: assistantMessage, conversationId: convId };
  }

  /**
   * 2. Generate Insights — توليد رؤى ذكية
   */
  static async generateInsights(): Promise<{ insights: AIInsight[]; cached: boolean }> {
    // Check cache first
    const cached = this.getCachedInsights();
    if (cached) return { insights: cached, cached: true };

    const ctx = ContextBuilder.buildFullContext();
    let insights: AIInsight[];

    try {
      const prompt = PromptBuilder.buildInsightsPrompt(ctx);
      const aiResult = await AIProviderRouter.generate(
        [{ role: "user", content: prompt }],
        { temperature: 0.4 }
      );

      if (aiResult && aiResult.text) {
        const jsonMatch = aiResult.text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          insights = parsed.map((item: any, idx: number) => ({
            id: `ins_${Date.now()}_${idx}`,
            type: item.type || "growth",
            title_ar: item.title_ar || "رؤية ذكية",
            body_ar: item.body_ar || "",
            severity: item.severity || "info",
            icon: item.icon || "📊",
            data_points: item.data_points || {},
            action_suggestion_ar: item.action_suggestion_ar,
            created_at: new Date().toISOString(),
          }));
        } else {
          insights = this.generateLocalInsights(ctx);
        }
      } else {
        insights = this.generateLocalInsights(ctx);
      }
    } catch (err) {
      console.error("[AdminAI] Insights generation error:", err);
      insights = this.generateLocalInsights(ctx);
    }

    // Cache results
    this.cacheInsights(insights);

    return { insights, cached: false };
  }

  /**
   * 3. Generate Forecasts — توقعات الأعمال
   */
  static async generateForecasts(): Promise<AIForecast[]> {
    const ctx = ContextBuilder.buildFullContext();

    try {
      const prompt = PromptBuilder.buildForecastPrompt(ctx);
      const aiResult = await AIProviderRouter.generate(
        [{ role: "user", content: prompt }],
        { temperature: 0.3 }
      );

      if (aiResult && aiResult.text) {
        const jsonMatch = aiResult.text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return parsed.map((item: any, idx: number) => ({
            id: `fcst_${Date.now()}_${idx}`,
            ...item,
          }));
        }
      }
    } catch (err) {
      console.error("[AdminAI] Forecast generation error:", err);
    }

    // Local fallback forecasts
    return this.generateLocalForecasts(ctx);
  }

  /**
   * 4. Execute Admin Action — تنفيذ أمر إداري عبر AI
   */
  static executeAction(
    tool: AdminAITool,
    params: Record<string, any>,
    confirmed: boolean = false,
    adminUserId: string = "user_super_admin"
  ): ToolExecutionResult {
    const startTime = Date.now();
    const result = executeTool(tool, params, confirmed);

    this.logAudit(
      adminUserId,
      `action:${tool}`,
      JSON.stringify(params),
      result.summary_ar,
      [tool],
      Date.now() - startTime
    );

    return result;
  }

  /**
   * 5. Get conversation by ID
   */
  static getConversation(convId: string): AIConversation | null {
    try {
      const row = db.prepare(`SELECT * FROM ai_conversations WHERE id = ?`).get(convId) as any;
      if (!row) return null;
      return {
        id: row.id,
        admin_user_id: row.admin_user_id,
        messages: JSON.parse(row.messages_json || "[]"),
        context_snapshot: row.context_snapshot_json ? JSON.parse(row.context_snapshot_json) : undefined,
        created_at: row.created_at,
        updated_at: row.updated_at,
      };
    } catch {
      return null;
    }
  }

  /**
   * 6. List recent conversations
   */
  static listConversations(
    adminUserId: string = "user_super_admin",
    limit: number = 20
  ): { id: string; lastMessage?: string; updated_at: string; messageCount: number }[] {
    try {
      const rows = db.prepare(`
        SELECT id, messages_json, updated_at
        FROM ai_conversations
        WHERE admin_user_id = ?
        ORDER BY updated_at DESC
        LIMIT ?
      `).all(adminUserId, limit) as any[];

      return rows.map((r) => {
        let msgs = [];
        try {
          msgs = JSON.parse(r.messages_json || "[]");
        } catch {}
        const lastMsg = msgs[msgs.length - 1]?.content || "";
        return {
          id: r.id,
          lastMessage: lastMsg.length > 80 ? lastMsg.substring(0, 80) + "..." : lastMsg,
          updated_at: r.updated_at,
          messageCount: msgs.length,
        };
      });
    } catch {
      return [];
    }
  }

  // ─── Local Fallback Methods (work without API key) ───

  private static generateLocalResponse(
    messages: { role: string; content: string }[],
    ctx: AdminContextSnapshot
  ): string {
    const lastMsg = (messages[messages.length - 1]?.content || "").toLowerCase();

    // Pattern-match common queries
    if (lastMsg.includes("ملخص") || lastMsg.includes("أداء") || lastMsg.includes("اليوم")) {
      return `## 📊 ملخص أداء منصة سهلة

**المؤشرات الرئيسية:**
- 🏪 إجمالي المحلات: **${ctx.totalShops}** (${ctx.activeShops} نشط)
- 💰 الإيراد الشهري (MRR): **${ctx.mrrDZD.toLocaleString()} د.ج**
- 📄 الوثائق المنتجة: **${ctx.totalDocs.toLocaleString()}** وثيقة
- ⚡ النقاط المتداولة: **${ctx.totalPoints.toLocaleString()}** نقطة
- 📊 الاشتراكات النشطة: **${ctx.activeSubscriptions}**

**توزيع الخطط:**
${ctx.planBreakdown.map((p) => `- ${p.planNameAr}: ${p.count} محل`).join("\n")}

${ctx.recentAlerts.length > 0 ? `\n**تنبيهات:**\n${ctx.recentAlerts.join("\n")}` : "✅ لا توجد تنبيهات حالياً"}`;
    }

    if (lastMsg.includes("ولاي") || lastMsg.includes("نشاط")) {
      return `## 🗺️ أبرز الولايات نشاطاً

${ctx.topWilayas.map((w, i) => `${i + 1}. **${w.name}** (${w.code}): ${w.count} محل — ${w.active} نشط`).join("\n")}

**توزيع النشاطات:**
${Object.entries(ctx.activityBreakdown).map(([act, count]) => `- ${act}: ${count} محل`).join("\n")}`;
    }

    if (lastMsg.includes("شحن") || lastMsg.includes("رصيد") || lastMsg.includes("نقط")) {
      return `## ⚡ حالة الأرصدة والنقاط

- إجمالي النقاط المتداولة: **${ctx.totalPoints.toLocaleString()}** نقطة
- متوسط النقاط لكل محل: **${ctx.totalShops > 0 ? Math.round(ctx.totalPoints / ctx.totalShops) : 0}** نقطة

${ctx.recentAlerts.filter((a) => a.includes("رصيد") || a.includes("صفر")).length > 0
  ? `**⚠️ تنبيه:** ${ctx.recentAlerts.filter((a) => a.includes("رصيد") || a.includes("صفر")).join("\n")}`
  : "✅ جميع المحلات لديها رصيد كافٍ"}

> 💡 يمكنك شحن أي محل بالنقاط من خلال طلب "شحن محل [اسم المحل] بـ [عدد] نقطة"`;
    }

    if (lastMsg.includes("إيراد") || lastMsg.includes("revenue") || lastMsg.includes("ربح")) {
      return `## 💰 تحليل الإيرادات

- **MRR** (الإيراد الشهري المتكرر): **${ctx.mrrDZD.toLocaleString()} د.ج**
- **ARR** (الإيراد السنوي المتكرر): **${ctx.arrDZD.toLocaleString()} د.ج**
- فواتير مدفوعة: **${ctx.paidInvoicesDZD.toLocaleString()} د.ج**
- فواتير معلقة: **${ctx.pendingInvoicesDZD.toLocaleString()} د.ج**

**توزيع الإيرادات حسب الخطة:**
${ctx.planBreakdown.map((p) => `- ${p.planNameAr}: ${p.count} محل × ${p.revenueDZD > 0 ? (p.revenueDZD / Math.max(p.count, 1)).toLocaleString() : "0"} د.ج = **${p.revenueDZD.toLocaleString()} د.ج/شهر**`).join("\n")}`;
    }

    if (lastMsg.includes("اشتراك") || lastMsg.includes("خطط") || lastMsg.includes("plan")) {
      return `## 📋 توزيع الخطط والاشتراكات

${ctx.planBreakdown.map((p) => `- **${p.planNameAr}**: ${p.count} محل (${p.revenueDZD.toLocaleString()} د.ج/شهر)`).join("\n")}

- الاشتراكات النشطة: **${ctx.activeSubscriptions}**
- معدل التحويل من المجاني: **${ctx.totalShops > 0 ? Math.round((ctx.activeSubscriptions / ctx.totalShops) * 100) : 0}%**

> 💡 **اقتراح:** ركّز على تحويل المحلات المجانية في الولايات الأكثر نشاطاً إلى خطة PRO_KIOSK`;
    }

    // Default response
    return `## 🧠 مساعد سهلة الذكي

مرحباً بك في محرك الذكاء الاصطناعي لمنصة سهلة! 🇩🇿

يمكنني مساعدتك في:
1. 📊 **تحليل الأداء** — "ملخص أداء المنصة"
2. 🗺️ **تحليل الولايات** — "أكثر الولايات نشاطاً"
3. 💰 **تحليل الإيرادات** — "تحليل إيرادات هذا الشهر"
4. ⚡ **إدارة الأرصدة** — "المحلات التي تحتاج شحن"
5. 📋 **الاشتراكات** — "توزيع الخطط والاشتراكات"
6. 🔧 **عمليات إدارية** — "شحن محل X بـ 50 نقطة"

**البيانات الحالية:**
- ${ctx.totalShops} محل | ${ctx.activeShops} نشط | MRR: ${ctx.mrrDZD.toLocaleString()} د.ج

اسألني أي سؤال عن المنصة! 🚀`;
  }

  private static generateLocalInsights(ctx: AdminContextSnapshot): AIInsight[] {
    const insights: AIInsight[] = [];
    const now = new Date().toISOString();

    // Growth insight
    if (ctx.activeShops > 0) {
      const activationRate = Math.round((ctx.activeShops / ctx.totalShops) * 100);
      insights.push({
        id: `ins_local_1`,
        type: activationRate > 80 ? "growth" : "risk",
        title_ar: activationRate > 80 ? "📈 معدل تفعيل مرتفع" : "⚠️ معدل تفعيل يحتاج تحسين",
        body_ar: `${activationRate}% من المحلات المسجلة نشطة حالياً (${ctx.activeShops} من ${ctx.totalShops}). ${activationRate > 80 ? "هذا مؤشر إيجابي على صحة المنصة." : "يُنصح بالتواصل مع المحلات غير النشطة لفهم أسباب التوقف."}`,
        severity: activationRate > 80 ? "info" : "warning",
        icon: activationRate > 80 ? "📈" : "⚠️",
        data_points: { activation_rate: activationRate, active: ctx.activeShops, total: ctx.totalShops },
        action_suggestion_ar: activationRate <= 80 ? "تواصل مع أصحاب المحلات غير النشطة عبر بث وطني" : undefined,
        created_at: now,
      });
    }

    // Revenue insight
    insights.push({
      id: `ins_local_2`,
      type: "opportunity",
      title_ar: "💰 فرصة نمو الإيرادات",
      body_ar: `الإيراد الشهري المتكرر الحالي هو ${ctx.mrrDZD.toLocaleString()} د.ج مع ${ctx.activeSubscriptions} اشتراك مدفوع. تحويل المحلات المجانية يمكن أن يرفع MRR بنسبة ${ctx.totalShops > ctx.activeSubscriptions ? Math.round(((ctx.totalShops - ctx.activeSubscriptions) / Math.max(ctx.totalShops, 1)) * 100) : 0}%.`,
      severity: "info",
      icon: "💰",
      data_points: { mrr: ctx.mrrDZD, arr: ctx.arrDZD, paid_subs: ctx.activeSubscriptions },
      action_suggestion_ar: "أطلق حملة ترويجية للترقية من الخطة المجانية إلى PRO_KIOSK",
      created_at: now,
    });

    // Wilaya concentration insight
    if (ctx.topWilayas.length > 0) {
      const topWilaya = ctx.topWilayas[0];
      const concentration = Math.round((topWilaya.count / Math.max(ctx.totalShops, 1)) * 100);
      insights.push({
        id: `ins_local_3`,
        type: concentration > 60 ? "risk" : "growth",
        title_ar: concentration > 60 ? "📍 تركيز جغرافي عالي" : "🗺️ توزيع جغرافي جيد",
        body_ar: `ولاية ${topWilaya.name} تستحوذ على ${concentration}% من المحلات. ${concentration > 60 ? "التنويع الجغرافي سيقلل المخاطر ويزيد الانتشار." : "التوزيع الحالي متوازن عبر الولايات."}`,
        severity: concentration > 60 ? "warning" : "info",
        icon: concentration > 60 ? "📍" : "🗺️",
        data_points: { top_wilaya: topWilaya.name, concentration, shops_count: topWilaya.count },
        action_suggestion_ar: concentration > 60 ? "استهدف ولايات جديدة بعروض تسجيل خاصة" : undefined,
        created_at: now,
      });
    }

    // Alerts insight
    if (ctx.recentAlerts.length > 0) {
      insights.push({
        id: `ins_local_4`,
        type: "anomaly",
        title_ar: "🚨 تنبيهات تتطلب انتباه",
        body_ar: ctx.recentAlerts.join(" | "),
        severity: "warning",
        icon: "🚨",
        data_points: { alerts_count: ctx.recentAlerts.length },
        action_suggestion_ar: "راجع كل تنبيه واتخذ الإجراء المناسب",
        created_at: now,
      });
    }

    return insights;
  }

  private static generateLocalForecasts(ctx: AdminContextSnapshot): AIForecast[] {
    return [
      {
        id: "fcst_local_1",
        metric_ar: "الإيراد الشهري المتكرر (MRR)",
        metric_key: "mrr",
        current_value: ctx.mrrDZD,
        predicted_value: Math.round(ctx.mrrDZD * 1.15),
        confidence: 0.65,
        trend: "up",
        period_ar: "الشهر القادم",
        explanation_ar: "تقدير مبني على معدل النمو الحالي وعدد الاشتراكات النشطة",
      },
      {
        id: "fcst_local_2",
        metric_ar: "عدد المحلات",
        metric_key: "total_shops",
        current_value: ctx.totalShops,
        predicted_value: ctx.totalShops + Math.max(1, Math.round(ctx.totalShops * 0.1)),
        confidence: 0.6,
        trend: "up",
        period_ar: "الشهر القادم",
        explanation_ar: "تقدير مبني على معدل التسجيل الحالي",
      },
      {
        id: "fcst_local_3",
        metric_ar: "حجم الوثائق المنتجة",
        metric_key: "total_docs",
        current_value: ctx.totalDocs,
        predicted_value: Math.round(ctx.totalDocs * 1.2),
        confidence: 0.7,
        trend: "up",
        period_ar: "الشهر القادم",
        explanation_ar: "ارتفاع متوقع مع موسم البحوث المدرسية",
      },
    ];
  }

  // ─── Persistence Helpers ───

  private static saveConversation(
    convId: string,
    adminUserId: string,
    userMessages: { role: string; content: string }[],
    assistantMsg: AIMessage,
    ctx: AdminContextSnapshot
  ) {
    try {
      const allMessages = [
        ...userMessages.map((m, i) => ({
          id: `msg_hist_${i}`,
          role: m.role,
          content: m.content,
          timestamp: new Date().toISOString(),
        })),
        assistantMsg,
      ];

      db.prepare(`
        INSERT OR REPLACE INTO ai_conversations (id, admin_user_id, messages_json, context_snapshot_json, updated_at)
        VALUES (?, ?, ?, ?, datetime('now'))
      `).run(
        convId,
        adminUserId,
        JSON.stringify(allMessages),
        JSON.stringify(ctx)
      );
    } catch {
      // Non-blocking
    }
  }

  private static logAudit(
    adminUserId: string,
    action: string,
    input: string | undefined,
    output: string,
    toolsUsed: string[],
    durationMs: number
  ) {
    try {
      const logId = `audit_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
      db.prepare(`
        INSERT INTO ai_audit_log (id, admin_user_id, action, input_summary, output_summary, tools_used, duration_ms)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        logId,
        adminUserId,
        action,
        (input || "").substring(0, 500),
        output.substring(0, 500),
        JSON.stringify(toolsUsed),
        durationMs
      );
    } catch {
      // Non-blocking
    }
  }

  private static getCachedInsights(): AIInsight[] | null {
    try {
      const row = db.prepare(
        `SELECT insights_json, expires_at FROM ai_insights_cache WHERE id = 'latest' AND expires_at > datetime('now')`
      ).get() as any;

      if (row) {
        return JSON.parse(row.insights_json);
      }
    } catch {
      // No cache
    }
    return null;
  }

  private static cacheInsights(insights: AIInsight[]) {
    try {
      const expiresAt = new Date(Date.now() + AI_CONFIG.insightsCacheTTLMs).toISOString();
      db.prepare(`
        INSERT OR REPLACE INTO ai_insights_cache (id, insights_json, expires_at)
        VALUES ('latest', ?, ?)
      `).run(JSON.stringify(insights), expiresAt);
    } catch {
      // Non-blocking
    }
  }
}
