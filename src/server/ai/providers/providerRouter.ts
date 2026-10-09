import { db } from "@/lib/db";
import { encryptKey, decryptKey, extractLast4, maskKey } from "./crypto";
import { validateBaseUrl } from "./ssrfProtection";
import { GeminiAdapter } from "./geminiAdapter";
import { AnthropicAdapter } from "./anthropicAdapter";
import { OpenAICompatAdapter } from "./openaiCompatAdapter";
import { getPresetById, AI_PROVIDER_PRESETS } from "./presets";
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
  AdvancedProviderConfig,
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

      // Safe schema migrations for new customization columns
      try {
        db.exec(`ALTER TABLE ai_providers ADD COLUMN custom_headers TEXT DEFAULT '{}';`);
      } catch {}
      try {
        db.exec(`ALTER TABLE ai_providers ADD COLUMN advanced_config TEXT DEFAULT '{}';`);
      } catch {}
      try {
        db.exec(`ALTER TABLE ai_providers ADD COLUMN preset_id TEXT;`);
      } catch {}
      try {
        db.exec(`ALTER TABLE ai_providers ADD COLUMN custom_models TEXT DEFAULT '[]';`);
      } catch {}

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
          preset_id?: string;
          capabilities: Capabilities;
        }> = [
          {
            id: "pv_gemini",
            kind: "gemini",
            name: "Google Gemini",
            base_url: "https://generativelanguage.googleapis.com",
            model: "gemini-flash-lite-latest",
            envKey: process.env.GEMINI_API_KEY,
            is_primary: 1,
            fallback_order: null,
            preset_id: "gemini",
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
            preset_id: "huggingface",
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
            preset_id: "anthropic",
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
            preset_id: "openai",
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
          {
            id: "pv_nvidia_nim",
            kind: "openai_compatible",
            name: "NVIDIA NIM",
            base_url: "https://integrate.api.nvidia.com/v1",
            model: "meta/llama-3.3-70b-instruct",
            envKey: process.env.NVIDIA_API_KEY || process.env.NVIDIA_NIM_API_KEY,
            is_primary: 0,
            fallback_order: 4,
            preset_id: "nvidia_nim",
            capabilities: {
              tool_use: true,
              json_mode: true,
              structured_output: "json_object",
              streaming: true,
              max_context: 128000,
              vision: false,
              languages_verified: ["ar", "fr", "en"],
              web_search: false,
              prompt_caching: true,
            },
          },
        ];

        for (const item of defaults) {
          const enc = item.envKey ? encryptKey(item.envKey) : "";
          const l4 = item.envKey ? extractLast4(item.envKey) : "";
          db.prepare(`
            INSERT INTO ai_providers (
              id, kind, name, base_url, model, key_encrypted, key_last4,
              capabilities, status, is_primary, fallback_order, enabled, preset_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
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
            item.fallback_order,
            item.preset_id || null
          );
        }

        // Default routing rules per specialized skill engine
        const defaultRules = [
          { skill: "section-writer", provider_id: "pv_openai", min: { json_mode: true } },
          { skill: "quality-reviewer", provider_id: "pv_gemini", min: { json_mode: true } },
          { skill: "math-science-solver", provider_id: "pv_anthropic", min: { tool_use: true } },
          { skill: "solution-drafter", provider_id: "pv_anthropic", min: { json_mode: true } },
          { skill: "web-researcher", provider_id: "pv_nvidia_nim", min: {} },
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

        let customHeaders: Record<string, string> = {};
        try {
          if (r.custom_headers) customHeaders = JSON.parse(r.custom_headers);
        } catch {}

        let advancedConfig: AdvancedProviderConfig = {};
        try {
          if (r.advanced_config) advancedConfig = JSON.parse(r.advanced_config);
        } catch {}

        let customModels: AIModelDefinition[] = [];
        try {
          if (r.custom_models) customModels = JSON.parse(r.custom_models);
        } catch {}

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
          preset_id: r.preset_id || undefined,
          custom_headers: customHeaders,
          advanced_config: advancedConfig,
          custom_models: customModels,
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

      let customHeaders: Record<string, string> = {};
      try {
        if (r.custom_headers) customHeaders = JSON.parse(r.custom_headers);
      } catch {}

      let advancedConfig: AdvancedProviderConfig = {};
      try {
        if (r.advanced_config) advancedConfig = JSON.parse(r.advanced_config);
      } catch {}

      let customModels: AIModelDefinition[] = [];
      try {
        if (r.custom_models) customModels = JSON.parse(r.custom_models);
      } catch {}

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
        preset_id: r.preset_id || undefined,
        custom_headers: customHeaders,
        advanced_config: advancedConfig,
        custom_models: customModels,
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
      preset_id?: string;
      custom_headers?: Record<string, string>;
      advanced_config?: AdvancedProviderConfig;
      custom_models?: AIModelDefinition[];
      capabilities?: Partial<Capabilities>;
    },
    actorId?: string,
    ip?: string
  ): { success: boolean; provider?: AIProviderRecord; error?: string } {
    this.initTables();

    if (!data.name || !data.model || !data.kind) {
      return { success: false, error: "الاسم والنموذج ونوع المزود حقول إلزامية" };
    }

    const isLocalAllowed =
      data.preset_id === "ollama" ||
      data.preset_id === "vllm" ||
      Boolean(data.advanced_config?.allow_local);

    // SSRF Validation on base_url per Section 4.1 & 7
    if (data.base_url) {
      const ssrfCheck = validateBaseUrl(data.base_url, { allowLocal: isLocalAllowed });
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
      ...(data.capabilities || {}),
    };

    try {
      db.prepare(`
        INSERT INTO ai_providers (
          id, kind, name, base_url, model, key_encrypted, key_last4,
          capabilities, status, is_primary, fallback_order, enabled,
          created_by, updated_by, preset_id, custom_headers, advanced_config, custom_models
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'unknown', 0, NULL, 1, ?, ?, ?, ?, ?, ?)
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
        actorId || null,
        data.preset_id || null,
        data.custom_headers ? JSON.stringify(data.custom_headers) : "{}",
        data.advanced_config ? JSON.stringify(data.advanced_config) : "{}",
        data.custom_models ? JSON.stringify(data.custom_models) : "[]"
      );

      // Audit Log
      this.logAudit({
        id: `aud_${Date.now()}`,
        actor_id: actorId,
        action: "create_provider",
        provider_id: id,
        after_json: { id, kind: data.kind, name: data.name, model: data.model, base_url: data.base_url, preset_id: data.preset_id },
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
      preset_id?: string;
      custom_headers?: Record<string, string>;
      advanced_config?: AdvancedProviderConfig;
      custom_models?: AIModelDefinition[];
      capabilities?: Partial<Capabilities>;
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

      let isLocalAllowed = Boolean(updates.advanced_config?.allow_local);
      if (!isLocalAllowed && current.advanced_config) {
        try {
          const cfg = JSON.parse(current.advanced_config);
          if (cfg.allow_local) isLocalAllowed = true;
        } catch {}
      }
      if (
        current.preset_id === "ollama" ||
        current.preset_id === "vllm" ||
        updates.preset_id === "ollama" ||
        updates.preset_id === "vllm"
      ) {
        isLocalAllowed = true;
      }

      let newBaseUrl = current.base_url;
      if (updates.base_url !== undefined) {
        if (updates.base_url) {
          const ssrfCheck = validateBaseUrl(updates.base_url, { allowLocal: isLocalAllowed });
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

      let newCapabilitiesStr = current.capabilities;
      if (updates.capabilities) {
        try {
          const curCaps = JSON.parse(current.capabilities || "{}");
          newCapabilitiesStr = JSON.stringify({ ...curCaps, ...updates.capabilities });
        } catch {}
      }

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
          preset_id = COALESCE(?, preset_id),
          custom_headers = CASE WHEN ? IS NOT NULL THEN ? ELSE custom_headers END,
          advanced_config = CASE WHEN ? IS NOT NULL THEN ? ELSE advanced_config END,
          custom_models = CASE WHEN ? IS NOT NULL THEN ? ELSE custom_models END,
          capabilities = COALESCE(?, capabilities),
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
        updates.preset_id || null,
        updates.custom_headers ? JSON.stringify(updates.custom_headers) : null,
        updates.custom_headers ? JSON.stringify(updates.custom_headers) : null,
        updates.advanced_config ? JSON.stringify(updates.advanced_config) : null,
        updates.advanced_config ? JSON.stringify(updates.advanced_config) : null,
        updates.custom_models ? JSON.stringify(updates.custom_models) : null,
        updates.custom_models ? JSON.stringify(updates.custom_models) : null,
        newCapabilitiesStr,
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

    let customHeaders: Record<string, string> = {};
    try {
      if (row.custom_headers) customHeaders = JSON.parse(row.custom_headers);
    } catch {}

    let advancedConfig: AdvancedProviderConfig = {};
    try {
      if (row.advanced_config) advancedConfig = JSON.parse(row.advanced_config);
    } catch {}

    const adapter = this.getAdapter(row.kind as AIProviderKind, row.id);
    const result = await adapter.ping(plainKey, modelToTest, row.base_url, {
      customHeaders,
      advancedConfig,
    });

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
          model = ?,
          last_ping_at = datetime('now'),
          last_ping_ms = ?,
          last_error = ?,
          capabilities = ?,
          updated_at = datetime('now')
        WHERE id = ?
      `).run(
        result.status,
        result.status === "ok" && result.model ? result.model : row.model,
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

    // Preset models if matched
    if (row.preset_id) {
      const preset = getPresetById(row.preset_id);
      if (preset && preset.available_models.length > 0) {
        models = preset.available_models;
      }
    } else if (row.kind === "gemini") {
      models = [
        { id: "gemini-flash-lite-latest", name: "Gemini Flash Lite", description_ar: "فائق السرعة واقتصادي مع استجابة فورية (افتراضي)", badge: "افتراضي وموصى به" },
        { id: "gemini-flash-latest", name: "Gemini Flash Latest", description_ar: "أحدث إصدار عالي السرعة مع ميزات التفكير المتقدمة", badge: "موصى به" },
        { id: "gemini-3.5-flash-lite", name: "Gemini 3.5 Flash Lite", description_ar: "خفيف وسريع جداً للمهام الإدارية والأكاديمية" },
        { id: "gemini-3.8-flash", name: "Gemini 3.8 Flash", description_ar: "الجيل المحدث مع استدلال منطقي وسرعة معالجة عالية" },
        { id: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro Preview", description_ar: "أعلى قدرة على الاستدلال المنطقي وحل المسائل (يتطلب رصيد مدفوع)", badge: "استدلال فائق" },
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

    // Include custom models configured on this provider
    if (row.custom_models) {
      try {
        const customList: AIModelDefinition[] = JSON.parse(row.custom_models);
        if (Array.isArray(customList) && customList.length > 0) {
          models = [...customList, ...models.filter((m) => !customList.some((c) => c.id === m.id))];
        }
      } catch {}
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
            if (fetched.length > 0) {
              models = [...models, ...fetched.filter((f: any) => !models.some((m) => m.id === f.id))];
            }
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
      WHERE is_primary = 0 AND enabled = 1
      ORDER BY CASE WHEN fallback_order IS NOT NULL THEN fallback_order ELSE 999 END ASC, created_at ASC
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
      if (!key) {
        if (row.kind === "gemini") key = process.env.GEMINI_API_KEY || "";
        else if (row.kind === "openai" || row.kind === "openai_compatible") key = process.env.OPENAI_API_KEY || "";
        else if (row.kind === "anthropic") key = process.env.ANTHROPIC_API_KEY || "";
      }
      const isLocal =
        row.preset_id === "ollama" ||
        row.preset_id === "vllm" ||
        row.base_url?.includes("localhost") ||
        row.base_url?.includes("127.0.0.1");
      if (!key && !isLocal) continue;

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

      let customHeaders: Record<string, string> = {};
      try {
        if (row.custom_headers) customHeaders = JSON.parse(row.custom_headers);
      } catch {}

      let advancedConfig: AdvancedProviderConfig = {};
      try {
        if (row.advanced_config) advancedConfig = JSON.parse(row.advanced_config);
      } catch {}

      const adapter = this.getAdapter(row.kind as AIProviderKind, row.id);

      try {
        const result = await adapter.generate(req, key, row.model, row.base_url, {
          customHeaders,
          advancedConfig,
        });

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
        console.error(`[AIProviderRouter] Provider ${row.id} (${row.name}) failed, falling back:`, err);
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
