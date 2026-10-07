import { db } from "@/lib/db";
import { encryptKey, decryptKey, extractLast4, maskKey } from "./crypto";
import { validateBaseUrl } from "./ssrfProtection";
import { GeminiAdapter } from "./geminiAdapter";
import { AnthropicAdapter } from "./anthropicAdapter";
import { OpenAICompatAdapter } from "./openaiCompatAdapter";
import type {
  AIProviderId,
  AIProviderKind,
  AIProviderRecord,
  Capabilities,
  GenerateRequest,
  GenerateResult,
  PingResult,
  LLMProvider,
  AIRoutingRule,
  AIAuditLog,
  AIUsageRecord,
  AIModelDefinition,
  ProviderGenerateOptions,
  ProviderGenerateResult,
} from "./types";

// In-memory 10-minute cache for models list
const modelsCache = new Map<string, { models: AIModelDefinition[]; expiresAt: number }>();

export class AIProviderRouter {
  private static adapters: Map<string, LLMProvider> = new Map<string, LLMProvider>([
    ["gemini", new GeminiAdapter()],
    ["anthropic", new AnthropicAdapter()],
    ["openai", new OpenAICompatAdapter("openai", "openai_compatible")],
    ["huggingface", new OpenAICompatAdapter("huggingface", "huggingface")],
    ["openai_compatible", new OpenAICompatAdapter("openai_compatible", "openai_compatible")],
  ]);

  /**
   * 1. Ensure SQLite Tables exist per Section 3 of Technical Spec
   */
  static initTables() {
    try {
      db.exec(`
        CREATE TABLE IF NOT EXISTS ai_providers (
          id TEXT PRIMARY KEY,
          kind TEXT NOT NULL,
          name TEXT NOT NULL,
          base_url TEXT,
          model TEXT NOT NULL,
          key_encrypted TEXT,
          key_last4 TEXT,
          capabilities TEXT NOT NULL DEFAULT '{}',
          status TEXT NOT NULL DEFAULT 'unknown',
          last_ping_at TEXT,
          last_ping_ms INTEGER,
          last_error TEXT,
          is_primary INTEGER NOT NULL DEFAULT 0,
          fallback_order INTEGER,
          enabled INTEGER NOT NULL DEFAULT 1,
          created_by TEXT,
          updated_by TEXT,
          created_at TEXT DEFAULT (datetime('now')),
          updated_at TEXT DEFAULT (datetime('now'))
        );

        CREATE UNIQUE INDEX IF NOT EXISTS one_primary ON ai_providers (is_primary) WHERE is_primary = 1;

        CREATE TABLE IF NOT EXISTS ai_routing_rules (
          skill TEXT PRIMARY KEY,
          provider_id TEXT NOT NULL,
          min_capabilities TEXT NOT NULL DEFAULT '{}',
          updated_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS ai_audit_log (
          id TEXT PRIMARY KEY,
          actor_id TEXT,
          action TEXT NOT NULL,
          provider_id TEXT,
          before_json TEXT,
          after_json TEXT,
          ip TEXT,
          at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS ai_usage (
          id TEXT PRIMARY KEY,
          provider_id TEXT NOT NULL,
          skill TEXT,
          job_id TEXT,
          input_tokens INTEGER DEFAULT 0,
          output_tokens INTEGER DEFAULT 0,
          latency_ms INTEGER,
          status TEXT,
          cost_estimate REAL DEFAULT 0,
          at TEXT DEFAULT (datetime('now'))
        );
      `);

      // Seed standard providers if empty
      const count = (db.prepare(`SELECT count(*) as c FROM ai_providers`).get() as any)?.c || 0;
      if (count === 0) {
        const defaults: Array<{
          id: string;
          kind: AIProviderKind;
          name: string;
          base_url: string;
          model: string;
          envKey?: string;
          is_primary: number;
          fallback_order: number | null;
          capabilities: Capabilities;
        }> = [
          {
            id: "pv_gemini",
            kind: "gemini",
            name: "Google Gemini",
            base_url: "https://generativelanguage.googleapis.com",
            model: "gemini-2.5-flash",
            envKey: process.env.GEMINI_API_KEY,
            is_primary: 1,
            fallback_order: null,
            capabilities: {
              tool_use: true,
              json_mode: true,
              structured_output: "json_object",
              streaming: true,
              max_context: 1000000,
              vision: true,
              languages_verified: ["ar", "fr", "en"],
              web_search: true,
              prompt_caching: true,
            },
          },
          {
            id: "pv_huggingface",
            kind: "huggingface",
            name: "Hugging Face (Open Source)",
            base_url: "https://router.huggingface.co/v1",
            model: "Qwen/Qwen2.5-72B-Instruct",
            envKey: process.env.HUGGINGFACE_API_KEY || process.env.HF_TOKEN,
            is_primary: 0,
            fallback_order: 1,
            capabilities: {
              tool_use: true,
              json_mode: true,
              structured_output: "json_object",
              streaming: true,
              max_context: 32768,
              vision: false,
              languages_verified: ["ar", "fr", "en"],
              web_search: false,
              prompt_caching: false,
            },
          },
          {
            id: "pv_anthropic",
            kind: "anthropic",
            name: "Anthropic Claude",
            base_url: "https://api.anthropic.com/v1",
            model: "claude-3-7-sonnet-20250219",
            envKey: process.env.ANTHROPIC_API_KEY,
            is_primary: 0,
            fallback_order: 2,
            capabilities: {
              tool_use: true,
              json_mode: true,
              structured_output: "tool",
              streaming: true,
              max_context: 200000,
              vision: true,
              languages_verified: ["ar", "fr", "en"],
              web_search: false,
              prompt_caching: true,
            },
          },
          {
            id: "pv_openai",
            kind: "openai_compatible",
            name: "OpenAI GPT",
            base_url: "https://api.openai.com/v1",
            model: "gpt-4o-mini",
            envKey: process.env.OPENAI_API_KEY,
            is_primary: 0,
            fallback_order: 3,
            capabilities: {
              tool_use: true,
              json_mode: true,
              structured_output: "json_object",
              streaming: true,
              max_context: 128000,
              vision: true,
              languages_verified: ["ar", "fr", "en"],
              web_search: false,
              prompt_caching: false,
            },
          },
        ];

        for (const item of defaults) {
          const enc = item.envKey ? encryptKey(item.envKey) : "";
          const l4 = item.envKey ? extractLast4(item.envKey) : "";
          db.prepare(`
            INSERT INTO ai_providers (
              id, kind, name, base_url, model, key_encrypted, key_last4,
              capabilities, status, is_primary, fallback_order, enabled
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
          `).run(
            item.id,
            item.kind,
            item.name,
            item.base_url,
            item.model,
            enc,
            l4,
            JSON.stringify(item.capabilities),
            item.envKey ? "ok" : "unknown",
            item.is_primary,
            item.fallback_order
          );
        }

        // Default routing rules from Section 6.4
        const defaultRules = [
          { skill: "section-writer", provider_id: "pv_huggingface", min: { json_mode: true } },
          { skill: "quality-reviewer", provider_id: "pv_gemini", min: { json_mode: true } },
          { skill: "math-science-solver", provider_id: "pv_anthropic", min: { tool_use: true } },
          { skill: "solution-drafter", provider_id: "pv_anthropic", min: { json_mode: true } },
          { skill: "web-researcher", provider_id: "pv_gemini", min: { web_search: true } },
        ];

        for (const r of defaultRules) {
          db.prepare(`
            INSERT OR IGNORE INTO ai_routing_rules (skill, provider_id, min_capabilities)
            VALUES (?, ?, ?)
          `).run(r.skill, r.provider_id, JSON.stringify(r.min));
        }
      }
    } catch (err) {
      console.error("[AIProviderRouter:initTables] DB initialization error:", err);
    }
  }

  /**
   * Helper: Get adapter instance by provider kind/id
   */
  private static getAdapter(kind: AIProviderKind, id: string): LLMProvider {
    if (this.adapters.has(id)) return this.adapters.get(id)!;
    if (this.adapters.has(kind)) return this.adapters.get(kind)!;
    return new OpenAICompatAdapter(id, kind);
  }

  /**
   * 2. List all providers (Keys are NEVER returned; only key_masked / key_last4)
   * Section 4: GET /v1/admin/ai-providers
   */
  static getProviders(): AIProviderRecord[] {
    this.initTables();
    try {
      const rows = db.prepare(`
        SELECT * FROM ai_providers
        ORDER BY is_primary DESC, fallback_order ASC, created_at ASC
      `).all() as any[];

      return rows.map((r) => {
        let caps: Capabilities;
        try {
          caps = JSON.parse(r.capabilities || "{}");
        } catch {
          caps = {
            tool_use: false,
            json_mode: true,
            structured_output: "none",
            streaming: true,
            max_context: 32768,
            vision: false,
            languages_verified: ["ar"],
            web_search: false,
            prompt_caching: false,
          };
        }

        return {
          id: r.id,
          kind: r.kind as AIProviderKind,
          name: r.name,
          base_url: r.base_url,
          model: r.model,
          key_last4: r.key_last4,
          key_masked: maskKey(r.key_last4 || ""),
          capabilities: caps,
          status: r.status,
          last_ping_at: r.last_ping_at,
          last_ping_ms: r.last_ping_ms,
          last_error: r.last_error,
          is_primary: Boolean(r.is_primary),
          fallback_order: r.fallback_order,
          enabled: Boolean(r.enabled),
          created_by: r.created_by,
          updated_by: r.updated_by,
          created_at: r.created_at,
          updated_at: r.updated_at,
        };
      });
    } catch (err) {
      console.error("[AIProviderRouter:getProviders] error:", err);
      return [];
    }
  }

  /**
   * 3. Get single provider by ID
   */
  static getProviderById(id: string): AIProviderRecord | null {
    this.initTables();
    try {
      const r = db.prepare(`SELECT * FROM ai_providers WHERE id = ?`).get(id) as any;
      if (!r) return null;

      let caps: Capabilities;
      try {
        caps = JSON.parse(r.capabilities || "{}");
      } catch {
        caps = {} as any;
      }

      return {
        id: r.id,
        kind: r.kind as AIProviderKind,
        name: r.name,
        base_url: r.base_url,
        model: r.model,
        key_last4: r.key_last4,
        key_masked: maskKey(r.key_last4 || ""),
        capabilities: caps,
        status: r.status,
        last_ping_at: r.last_ping_at,
        last_ping_ms: r.last_ping_ms,
        last_error: r.last_error,
        is_primary: Boolean(r.is_primary),
        fallback_order: r.fallback_order,
        enabled: Boolean(r.enabled),
        created_by: r.created_by,
        updated_by: r.updated_by,
        created_at: r.created_at,
        updated_at: r.updated_at,
      };
    } catch {
      return null;
    }
  }

  /**
   * 4. Add new provider with SSRF validation
   * Section 4.1: POST /v1/admin/ai-providers
   */
  static createProvider(
    data: {
      kind: AIProviderKind;
      name: string;
      base_url?: string;
      model: string;
      api_key?: string;
    },
    actorId?: string,
    ip?: string
  ): { success: boolean; provider?: AIProviderRecord; error?: string } {
    this.initTables();

    if (!data.name || !data.model || !data.kind) {
      return { success: false, error: "الاسم والنموذج ونوع المزود حقول إلزامية" };
    }

    // SSRF Validation on base_url per Section 4.1 & 7
    if (data.base_url) {
      const ssrfCheck = validateBaseUrl(data.base_url);
      if (!ssrfCheck.valid) {
        return { success: false, error: ssrfCheck.error || "عنوان base_url غير آمن" };
      }
      data.base_url = ssrfCheck.normalizedUrl;
    }

    const id = `pv_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const encKey = data.api_key ? encryptKey(data.api_key) : "";
    const last4 = data.api_key ? extractLast4(data.api_key) : "";

    const defaultCapabilities: Capabilities = {
      tool_use: data.kind === "anthropic" || data.kind === "openai_compatible",
      json_mode: true,
      structured_output: data.kind === "anthropic" ? "tool" : "json_object",
      streaming: true,
      max_context: 32768,
      vision: data.kind === "anthropic" || data.kind === "gemini",
      languages_verified: ["ar", "fr", "en"],
      web_search: data.kind === "gemini",
      prompt_caching: data.kind === "anthropic",
    };

    try {
      db.prepare(`
        INSERT INTO ai_providers (
          id, kind, name, base_url, model, key_encrypted, key_last4,
          capabilities, status, is_primary, fallback_order, enabled,
          created_by, updated_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'unknown', 0, NULL, 1, ?, ?)
      `).run(
        id,
        data.kind,
        data.name.trim(),
        data.base_url || null,
        data.model.trim(),
        encKey,
        last4,
        JSON.stringify(defaultCapabilities),
        actorId || null,
        actorId || null
      );

      // Audit Log
      this.logAudit({
        id: `aud_${Date.now()}`,
        actor_id: actorId,
        action: "create_provider",
        provider_id: id,
        after_json: { id, kind: data.kind, name: data.name, model: data.model, base_url: data.base_url },
        ip,
        at: new Date().toISOString(),
      });

      const created = this.getProviderById(id);
      return { success: true, provider: created! };
    } catch (err: any) {
      return { success: false, error: `فشل إنشاء المزود: ${err.message}` };
    }
  }

  /**
   * 5. Update provider
   * Section 4.3: PATCH /v1/admin/ai-providers/{id}
   * Changing key, model, or base_url resets status to 'unknown'
   */
  static updateProvider(
    id: string,
    updates: {
      name?: string;
      model?: string;
      base_url?: string;
      api_key?: string;
      enabled?: boolean;
    },
    actorId?: string,
    ip?: string
  ): { success: boolean; provider?: AIProviderRecord; error?: string } {
    this.initTables();
    try {
      const current = db.prepare(`SELECT * FROM ai_providers WHERE id = ?`).get(id) as any;
      if (!current) {
        return { success: false, error: "المزود غير موجود" };
      }

      let encKey = current.key_encrypted;
      let last4 = current.key_last4;
      let resetStatusToUnknown = false;

      if (updates.api_key !== undefined && updates.api_key.trim() !== "") {
        encKey = encryptKey(updates.api_key);
        last4 = extractLast4(updates.api_key);
        resetStatusToUnknown = true;
      }

      if (updates.model && updates.model !== current.model) {
        resetStatusToUnknown = true;
      }

      let newBaseUrl = current.base_url;
      if (updates.base_url !== undefined) {
        if (updates.base_url) {
          const ssrfCheck = validateBaseUrl(updates.base_url);
          if (!ssrfCheck.valid) {
            return { success: false, error: ssrfCheck.error || "عنوان base_url غير آمن" };
          }
          newBaseUrl = ssrfCheck.normalizedUrl;
        } else {
          newBaseUrl = null;
        }
        if (newBaseUrl !== current.base_url) {
          resetStatusToUnknown = true;
        }
      }

      const newStatus = resetStatusToUnknown ? "unknown" : current.status;

      db.prepare(`
        UPDATE ai_providers
        SET
          name = COALESCE(?, name),
          model = COALESCE(?, model),
          base_url = ?,
          key_encrypted = ?,
          key_last4 = ?,
          status = ?,
          enabled = COALESCE(?, enabled),
          updated_by = ?,
          updated_at = datetime('now')
        WHERE id = ?
      `).run(
        updates.name || null,
        updates.model || null,
        newBaseUrl,
        encKey,
        last4,
        newStatus,
        updates.enabled !== undefined ? (updates.enabled ? 1 : 0) : null,
        actorId || null,
        id
      );

      // Audit Log
      this.logAudit({
        id: `aud_${Date.now()}`,
        actor_id: actorId,
        action: "update_provider",
        provider_id: id,
        before_json: { name: current.name, model: current.model, base_url: current.base_url, status: current.status },
        after_json: { name: updates.name, model: updates.model, base_url: newBaseUrl, status: newStatus },
        ip,
        at: new Date().toISOString(),
      });

      const updated = this.getProviderById(id);
      return { success: true, provider: updated! };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  /**
   * 6. Delete provider (Forbidden for primary)
   * Section 4: DELETE /v1/admin/ai-providers/{id}
   */
  static deleteProvider(
    id: string,
    actorId?: string,
    ip?: string
  ): { success: boolean; error?: string } {
    this.initTables();
    try {
      const current = db.prepare(`SELECT * FROM ai_providers WHERE id = ?`).get(id) as any;
      if (!current) {
        return { success: false, error: "المزود غير موجود" };
      }

      if (current.is_primary) {
        return { success: false, error: "لا يمكن حذف المحرك الأساسي قبل تعيين بديل" };
      }

      db.prepare(`DELETE FROM ai_providers WHERE id = ?`).run(id);

      // Audit Log
      this.logAudit({
        id: `aud_${Date.now()}`,
        actor_id: actorId,
        action: "delete_provider",
        provider_id: id,
        before_json: { name: current.name, model: current.model },
        ip,
        at: new Date().toISOString(),
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  /**
   * 7. Multi-stage Ping Test
   * Section 4.2: POST /v1/admin/ai-providers/{id}/ping
   */
  static async pingProvider(
    id: string,
    overrideApiKey?: string,
    overrideModelId?: string
  ): Promise<PingResult> {
    this.initTables();
    const row = db.prepare(`SELECT * FROM ai_providers WHERE id = ?`).get(id) as any;
    if (!row) {
      return {
        status: "error",
        latency_ms: 0,
        model: overrideModelId || "",
        checks: { auth: "error", model_available: "error", json_output: "error", arabic_sample: "error" },
        capabilities: {},
        message_ar: "المزود المطلوب غير موجود",
        error: "Provider not found",
      };
    }

    let plainKey = overrideApiKey || "";
    if (!plainKey && row.key_encrypted) {
      plainKey = decryptKey(row.key_encrypted);
    }
    const modelToTest = overrideModelId || row.model;

    const adapter = this.getAdapter(row.kind as AIProviderKind, row.id);
    const result = await adapter.ping(plainKey, modelToTest, row.base_url);

    // Persist ping status & capabilities to database
    try {
      let mergedCapabilities = {};
      try {
        mergedCapabilities = { ...JSON.parse(row.capabilities || "{}"), ...result.capabilities };
      } catch {
        mergedCapabilities = result.capabilities;
      }

      db.prepare(`
        UPDATE ai_providers
        SET
          status = ?,
          last_ping_at = datetime('now'),
          last_ping_ms = ?,
          last_error = ?,
          capabilities = ?,
          updated_at = datetime('now')
        WHERE id = ?
      `).run(
        result.status,
        result.latency_ms,
        result.status === "error" ? result.message_ar : null,
        JSON.stringify(mergedCapabilities),
        id
      );
    } catch (err) {
      console.error("[AIProviderRouter:pingProvider] DB update error:", err);
    }

    return result;
  }

  /**
   * 8. Set as Primary Engine
   * Section 4.4: POST /v1/admin/ai-providers/{id}/set-primary
   * Condition: status == 'ok' within last 24h, enabled == true
   */
  static setPrimaryProvider(
    id: string,
    actorId?: string,
    ip?: string
  ): { success: boolean; error?: string } {
    this.initTables();
    try {
      const target = db.prepare(`SELECT * FROM ai_providers WHERE id = ?`).get(id) as any;
      if (!target) {
        return { success: false, error: "المزود غير موجود" };
      }

      if (!target.enabled) {
        return { success: false, error: "لا يمكن تعيين مزود معطل كمحرك أساسي" };
      }

      if (target.status !== "ok") {
        return { success: false, error: "يجب فحص الاتصال بالمزود بنجاح (Ping) أولاً قبل تعيينه كأساسي" };
      }

      // 24-hour validity check per Section 4.4
      if (target.last_ping_at) {
        const pingAgeMs = Date.now() - new Date(target.last_ping_at).getTime();
        const maxAgeMs = 24 * 60 * 60 * 1000;
        if (pingAgeMs > maxAgeMs) {
          return { success: false, error: "فحص الاتصال قديم (أكثر من 24 ساعة)، يرجى فحص الاتصال من جديد" };
        }
      }

      // Atomic switch in single transaction
      db.exec("BEGIN IMMEDIATE;");
      try {
        db.prepare(`UPDATE ai_providers SET is_primary = 0 WHERE is_primary = 1`).run();
        db.prepare(`UPDATE ai_providers SET is_primary = 1, fallback_order = NULL WHERE id = ?`).run(id);
        db.exec("COMMIT;");
      } catch (e) {
        db.exec("ROLLBACK;");
        throw e;
      }

      // Audit Log
      this.logAudit({
        id: `aud_${Date.now()}`,
        actor_id: actorId,
        action: "set_primary",
        provider_id: id,
        after_json: { id, name: target.name, model: target.model },
        ip,
        at: new Date().toISOString(),
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  /**
   * 9. Configure Fallbacks Order
   * Section 4.5: PUT /v1/admin/ai-providers/fallbacks
   */
  static setFallbackOrder(
    order: string[],
    actorId?: string,
    ip?: string
  ): { success: boolean; error?: string } {
    this.initTables();
    try {
      db.exec("BEGIN IMMEDIATE;");
      try {
        // Reset all fallbacks
        db.prepare(`UPDATE ai_providers SET fallback_order = NULL WHERE is_primary = 0`).run();

        let rank = 1;
        for (const provId of order) {
          const prov = db.prepare(`SELECT * FROM ai_providers WHERE id = ?`).get(provId) as any;
          if (prov && !prov.is_primary && prov.enabled) {
            db.prepare(`UPDATE ai_providers SET fallback_order = ? WHERE id = ?`).run(rank, provId);
            rank++;
          }
        }
        db.exec("COMMIT;");
      } catch (e) {
        db.exec("ROLLBACK;");
        throw e;
      }

      this.logAudit({
        id: `aud_${Date.now()}`,
        actor_id: actorId,
        action: "set_fallbacks",
        after_json: { order },
        ip,
        at: new Date().toISOString(),
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  /**
   * 10. Fetch dynamic models list with 10-minute cache
   * Section 4.6: GET /v1/admin/ai-providers/{id}/models
   */
  static async getModelsForProvider(id: string): Promise<AIModelDefinition[]> {
    this.initTables();
    const cacheKey = `models_${id}`;
    const cached = modelsCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.models;
    }

    const row = db.prepare(`SELECT * FROM ai_providers WHERE id = ?`).get(id) as any;
    if (!row) return [];

    let models: AIModelDefinition[] = [];

    // Fallback models if provider call is slow or unconfigured
    if (row.kind === "gemini") {
      models = [
        { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", description_ar: "فائق السرعة واقتصادي (الافتراضي)", badge: "افتراضي" },
        { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", description_ar: "استدلال منطقي عالي الدقة", badge: "متقدم" },
        { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", description_ar: "معالجة سريعة ومتوازنة" },
      ];
    } else if (row.kind === "anthropic") {
      models = [
        { id: "claude-3-7-sonnet-20250219", name: "Claude 3.7 Sonnet (Hybrid Reasoning)", description_ar: "أعلى قدرة على الاستدلال والحلول الدقيقة", badge: "الأقوى" },
        { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet", description_ar: "كتابة نصوص عربية فائقة الدقة", badge: "موصى به" },
        { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku", description_ar: "نموذج خفيف وفائق السرعة" },
      ];
    } else if (row.kind === "huggingface") {
      models = [
        { id: "Qwen/Qwen2.5-72B-Instruct", name: "Qwen 2.5 72B Instruct", description_ar: "أداء عربي متميز جداً للمهام الشاملة", badge: "ممتاز بالعربية" },
        { id: "deepseek-ai/DeepSeek-R1", name: "DeepSeek R1 (Reasoning)", description_ar: "نموذج التفكير المنطقي العميق", badge: "تفكير عميق" },
        { id: "meta-llama/Llama-3.3-70B-Instruct", name: "Llama 3.3 70B Instruct", description_ar: "نموذج ميتا الرائد والموثوق" },
        { id: "Qwen/Qwen2.5-Coder-32B-Instruct", name: "Qwen 2.5 Coder 32B", description_ar: "كود ومعادلات وحسابات دقيقة" },
      ];
    } else {
      models = [
        { id: "gpt-4o-mini", name: "GPT-4o Mini", description_ar: "سريع واقتصادي وممتاز بالعربية", badge: "افتراضي" },
        { id: "gpt-4o", name: "GPT-4o", description_ar: "النموذج متعدد الوسائط الأكثر ذكاءً" },
        { id: "o3-mini", name: "o3 Mini (Reasoning)", description_ar: "استدلال منطقي وعلمي متقدم" },
      ];
    }

    // Try dynamic fetch if key and endpoint exist
    let key = "";
    if (row.key_encrypted) key = decryptKey(row.key_encrypted);
    if (key && row.base_url) {
      try {
        const endpoint = `${row.base_url.replace(/\/+$/, "")}/models`;
        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${key.trim()}` },
          signal: AbortSignal.timeout(5000),
        });
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.data) && json.data.length > 0) {
            const fetched = json.data.slice(0, 20).map((m: any) => ({
              id: m.id,
              name: m.id,
              description_ar: "نموذج متاح عبر الخادم البعيد",
            }));
            if (fetched.length > 0) models = fetched;
          }
        }
      } catch {}
    }

    // Cache 10 minutes (600,000 ms)
    modelsCache.set(cacheKey, { models, expiresAt: Date.now() + 600000 });
    return models;
  }

  /**
   * 11. Skill Routing Rules
   * Section 4: GET / PUT /v1/admin/ai-providers/routing
   */
  static getRoutingRules(): AIRoutingRule[] {
    this.initTables();
    try {
      const rows = db.prepare(`SELECT * FROM ai_routing_rules`).all() as any[];
      return rows.map((r) => ({
        skill: r.skill,
        provider_id: r.provider_id,
        min_capabilities: JSON.parse(r.min_capabilities || "{}"),
        updated_at: r.updated_at,
      }));
    } catch {
      return [];
    }
  }

  static updateRoutingRule(
    skill: string,
    provider_id: string,
    min_capabilities: Partial<Capabilities> = {},
    actorId?: string
  ): boolean {
    this.initTables();
    try {
      db.prepare(`
        INSERT INTO ai_routing_rules (skill, provider_id, min_capabilities, updated_at)
        VALUES (?, ?, ?, datetime('now'))
        ON CONFLICT(skill) DO UPDATE SET
          provider_id = excluded.provider_id,
          min_capabilities = excluded.min_capabilities,
          updated_at = datetime('now')
      `).run(skill, provider_id, JSON.stringify(min_capabilities));

      this.logAudit({
        id: `aud_${Date.now()}`,
        actor_id: actorId,
        action: "update_routing_rule",
        provider_id,
        after_json: { skill, provider_id, min_capabilities },
        at: new Date().toISOString(),
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 12. Usage Ledger & Cost Stats
   * Section 4: GET /v1/admin/ai-providers/usage
   */
  static getUsageStats(): {
    totalTokens: number;
    totalRequests: number;
    byProvider: Record<string, { requests: number; tokens: number; errors: number }>;
    bySkill: Record<string, { requests: number; tokens: number }>;
  } {
    this.initTables();
    try {
      const rows = db.prepare(`SELECT * FROM ai_usage ORDER BY at DESC LIMIT 500`).all() as any[];
      let totalTokens = 0;
      const byProvider: Record<string, { requests: number; tokens: number; errors: number }> = {};
      const bySkill: Record<string, { requests: number; tokens: number }> = {};

      for (const r of rows) {
        const tokens = (r.input_tokens || 0) + (r.output_tokens || 0);
        totalTokens += tokens;

        if (!byProvider[r.provider_id]) {
          byProvider[r.provider_id] = { requests: 0, tokens: 0, errors: 0 };
        }
        byProvider[r.provider_id].requests++;
        byProvider[r.provider_id].tokens += tokens;
        if (r.status === "error") byProvider[r.provider_id].errors++;

        const skillName = r.skill || "general";
        if (!bySkill[skillName]) bySkill[skillName] = { requests: 0, tokens: 0 };
        bySkill[skillName].requests++;
        bySkill[skillName].tokens += tokens;
      }

      return {
        totalTokens,
        totalRequests: rows.length,
        byProvider,
        bySkill,
      };
    } catch {
      return { totalTokens: 0, totalRequests: 0, byProvider: {}, bySkill: {} };
    }
  }

  /**
   * 13. Audit Logging
   * Section 3.3 & 7
   */
  static logAudit(item: AIAuditLog) {
    try {
      this.initTables();
      db.prepare(`
        INSERT INTO ai_audit_log (id, actor_id, action, provider_id, before_json, after_json, ip, at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        item.id,
        item.actor_id || null,
        item.action,
        item.provider_id || null,
        item.before_json ? JSON.stringify(item.before_json) : null,
        item.after_json ? JSON.stringify(item.after_json) : null,
        item.ip || null,
        item.at || new Date().toISOString()
      );
    } catch (err) {
      console.error("[AIProviderRouter:logAudit] error:", err);
    }
  }

  /**
   * 14. Unified Execution Engine with Failover Chain
   * Section 6.4: run(req: GenerateRequest)
   */
  static async run(req: GenerateRequest): Promise<GenerateResult> {
    this.initTables();
    const skill = req.metadata?.skill || "general";

    // 1. Resolve Provider Chain: Skill rule -> Primary -> Fallbacks
    const chainIds: string[] = [];

    // Check routing rule
    if (skill) {
      const rule = db.prepare(`SELECT * FROM ai_routing_rules WHERE skill = ?`).get(skill) as any;
      if (rule && rule.provider_id) {
        chainIds.push(rule.provider_id);
      }
    }

    // Add Primary
    const primary = db.prepare(`SELECT id FROM ai_providers WHERE is_primary = 1 AND enabled = 1`).get() as any;
    if (primary && !chainIds.includes(primary.id)) {
      chainIds.push(primary.id);
    }

    // Add Fallbacks in order
    const fallbacks = db.prepare(`
      SELECT id FROM ai_providers
      WHERE is_primary = 0 AND enabled = 1 AND fallback_order IS NOT NULL
      ORDER BY fallback_order ASC
    `).all() as any[];

    for (const fb of fallbacks) {
      if (!chainIds.includes(fb.id)) {
        chainIds.push(fb.id);
      }
    }

    let lastError: Error | null = null;

    for (const provId of chainIds) {
      const row = db.prepare(`SELECT * FROM ai_providers WHERE id = ?`).get(provId) as any;
      if (!row || !row.enabled) continue;

      let key = "";
      if (row.key_encrypted) key = decryptKey(row.key_encrypted);
      if (!key) continue;

      // Check min capabilities if required
      if (req.schema) {
        let caps: any = {};
        try {
          caps = JSON.parse(row.capabilities || "{}");
        } catch {}
        if (!caps.json_mode && !caps.tool_use) {
          continue; // Skip provider lacking structured output capabilities
        }
      }

      const adapter = this.getAdapter(row.kind as AIProviderKind, row.id);

      try {
        const result = await adapter.generate(req, key, row.model, row.base_url);

        // Record successful usage
        db.prepare(`
          INSERT INTO ai_usage (id, provider_id, skill, job_id, input_tokens, output_tokens, latency_ms, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'ok')
        `).run(
          `usg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          row.id,
          skill,
          req.metadata?.jobId || null,
          result.usage.inputTokens,
          result.usage.outputTokens,
          result.latencyMs
        );

        return result;
      } catch (err: any) {
        console.warn(`[AIProviderRouter] Provider ${row.id} (${row.name}) failed, falling back:`, err.message);
        lastError = err;

        // Record failed attempt
        db.prepare(`
          INSERT INTO ai_usage (id, provider_id, skill, job_id, input_tokens, output_tokens, latency_ms, status)
          VALUES (?, ?, ?, ?, 0, 0, 0, 'error')
        `).run(
          `usg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          row.id,
          skill,
          req.metadata?.jobId || null
        );
      }
    }

    throw new Error(`[AIProviderRouter] فشلت جميع المحركات في سلسلة المعالجة: ${lastError?.message || "لا توجد محركات مهيأة"}`);
  }

  /**
   * 15. Orchestrator Compatibility Bridge: generate(messages, options)
   */
  static async generate(
    messages: Array<{ role: "user" | "assistant" | "system"; content: string }>,
    options: ProviderGenerateOptions = {}
  ): Promise<ProviderGenerateResult | null> {
    try {
      this.initTables();

      // If tools are explicitly supplied (e.g. Gemini function declarations), execute with Gemini if enabled
      if (options.tools && options.tools.length > 0) {
        const geminiRow = db.prepare(`SELECT * FROM ai_providers WHERE id = 'gemini' OR kind = 'gemini' LIMIT 1`).get() as any;
        if (geminiRow && geminiRow.enabled) {
          const key = geminiRow.key_encrypted ? decryptKey(geminiRow.key_encrypted) : "";
          if (key) {
            const geminiAdapter = new GeminiAdapter();
            return await geminiAdapter.legacyGenerate(messages, options, key, geminiRow.model);
          }
        }
      }

      // Convert to standard GenerateRequest and run with failover
      const userAndAssistantMsgs = messages.filter((m) => m.role !== "system");
      const systemMsgs = messages.filter((m) => m.role === "system").map((m) => m.content).join("\n");
      const systemInstruction = options.systemInstruction || systemMsgs || "أنت مساعد ذكي لمنصة سهلة الجزائرية.";

      const req: GenerateRequest = {
        system: systemInstruction,
        messages: userAndAssistantMsgs,
        maxTokens: options.maxTokens || 4096,
        temperature: options.temperature,
        schema: options.responseSchema,
        metadata: { skill: "orchestrator" },
      };

      const result = await this.run(req);
      return {
        text: result.text || "",
        providerId: result.providerId,
        modelId: result.modelId,
        durationMs: result.latencyMs,
        tokensUsed: {
          prompt: result.usage.inputTokens,
          completion: result.usage.outputTokens,
          total: result.usage.inputTokens + result.usage.outputTokens,
        },
      };
    } catch (err) {
      console.error("[AIProviderRouter:generate] error:", err);
      return null;
    }
  }
}
