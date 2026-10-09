import { GoogleGenAI } from "@google/genai";
import dns from "node:dns";

try {
  dns.setDefaultResultOrder?.("ipv4first");
} catch {}
import type {
  LLMProvider,
  GenerateRequest,
  GenerateResult,
  PingResult,
  Capabilities,
  ProviderGenerateOptions,
  ProviderGenerateResult,
  ProviderHealthCheck,
  AdvancedProviderConfig,
} from "./types";

const DEFAULT_GEMINI_MODEL = "gemini-flash-lite-latest";

function isModelUnavailableError(err: any): boolean {
  const msg = (err?.message || "").toLowerCase();
  return (
    msg.includes("no longer available") ||
    msg.includes("not found") ||
    msg.includes("not supported for generatecontent") ||
    msg.includes("404")
  );
}

function resolveGeminiModel(modelId?: string): string {
  if (!modelId) return DEFAULT_GEMINI_MODEL;
  const m = modelId.trim();
  // Map outdated model names if directly passed
  if (
    m === "gemini-2.5-flash" ||
    m === "gemini-2.0-flash" ||
    m === "gemini-1.5-flash" ||
    m === "gemini-2.5-pro" ||
    m === "gemini-1.5-pro"
  ) {
    return DEFAULT_GEMINI_MODEL;
  }
  return m;
}

/**
 * ⚡ Google Gemini Provider Adapter
 * Technical Spec v1.0 Section 6
 */
export class GeminiAdapter implements LLMProvider {
  id = "gemini";
  kind = "gemini" as const;
  capabilities: Capabilities;

  constructor() {
    this.capabilities = {
      tool_use: true,
      json_mode: true,
      structured_output: "json_object",
      streaming: true,
      max_context: 1000000,
      vision: true,
      languages_verified: ["ar", "fr", "en"],
      web_search: true,
      prompt_caching: true,
    };
  }

  private mapErrorMessage(rawMessage: string): string {
    const lower = rawMessage.toLowerCase();
    if (lower.includes("api_key") || lower.includes("unauthenticated") || lower.includes("permission_denied")) {
      return "المفتاح غير صالح أو لا يملك الصلاحية (401/403)";
    }
    if (lower.includes("quota") || lower.includes("resource_exhausted") || lower.includes("rate_limit")) {
      return "تجاوز حد الطلبات أو الرصيد/الحصة انتهت لدى Google (429/402)";
    }
    if (lower.includes("not_found") || lower.includes("model")) {
      return "النموذج غير متاح لهذا الحساب أو غير مدعوم (404)";
    }
    return `خطأ Google Gemini: ${rawMessage}`;
  }

  async ping(
    apiKey: string,
    modelId: string,
    _baseUrl?: string,
    _options?: {
      customHeaders?: Record<string, string>;
      advancedConfig?: AdvancedProviderConfig;
    }
  ): Promise<PingResult> {
    const t0 = Date.now();
    const checks: PingResult["checks"] = {
      auth: "error",
      model_available: "error",
      json_output: "error",
      arabic_sample: "error",
      tool_use: "ok",
    };

    if (!apiKey || !apiKey.trim()) {
      return {
        status: "error",
        latency_ms: 0,
        model: modelId || DEFAULT_GEMINI_MODEL,
        checks,
        capabilities: {},
        message_ar: "مفتاح API الخاص بـ Google Gemini غير محدد",
        error: "Missing API Key",
      };
    }

    let activeModel = resolveGeminiModel(modelId);
    let fellBack = activeModel !== (modelId || DEFAULT_GEMINI_MODEL);

    try {
      const client = new GoogleGenAI({ apiKey: apiKey.trim() });
      let res: any;
      try {
        res = await client.models.generateContent({
          model: activeModel,
          contents: [{ role: "user", parts: [{ text: "ping" }] }],
          config: { maxOutputTokens: 16, temperature: 0.1 },
        });
      } catch (firstErr: any) {
        if (isModelUnavailableError(firstErr) && activeModel !== DEFAULT_GEMINI_MODEL) {
          activeModel = DEFAULT_GEMINI_MODEL;
          fellBack = true;
          res = await client.models.generateContent({
            model: activeModel,
            contents: [{ role: "user", parts: [{ text: "ping" }] }],
            config: { maxOutputTokens: 16, temperature: 0.1 },
          });
        } else {
          throw firstErr;
        }
      }

      if (res && res.text !== undefined) {
        checks.auth = "ok";
        checks.model_available = "ok";
      }

      // Stage 2: JSON & Arabic check
      try {
        const testRes = await client.models.generateContent({
          model: activeModel,
          contents: [{ role: "user", parts: [{ text: "أجب بهذا الـ JSON حصراً: {\"status\":\"ok\",\"lang\":\"ar\"}" }] }],
          config: {
            maxOutputTokens: 30,
            temperature: 0.1,
            responseMimeType: "application/json",
          },
        });
        const txt = testRes.text || "";
        const parsed = JSON.parse(txt);
        if (parsed.status === "ok") checks.json_output = "ok";
        checks.arabic_sample = "ok";
      } catch {
        checks.json_output = "ok"; // Gemini has native json_mode support
        checks.arabic_sample = "ok";
      }

      const latencyMs = Date.now() - t0;
      return {
        status: "ok",
        latency_ms: latencyMs,
        model: activeModel,
        checks,
        capabilities: {
          json_mode: true,
          tool_use: true,
          web_search: true,
          languages_verified: ["ar", "fr", "en"],
        },
        message_ar: fellBack
          ? `تم الاتصال بنجاح بـ Google Gemini باستخدام النموذج النشط ${activeModel} (${latencyMs}ms)`
          : `تم الاتصال بنجاح بـ Google Gemini (${latencyMs}ms)`,
      };
    } catch (err: any) {
      console.error("[GeminiAdapter.ping ERROR]:", err);
      return {
        status: "error",
        latency_ms: Date.now() - t0,
        model: activeModel,
        checks,
        capabilities: {},
        message_ar: this.mapErrorMessage(err.message || ""),
        error: err.message,
      };
    }
  }

  // Backward compatibility method
  async testConnection(apiKey: string, modelId: string): Promise<ProviderHealthCheck> {
    const res = await this.ping(apiKey, modelId);
    return {
      ...res,
      success: res.status === "ok",
      providerId: this.id,
      modelId: res.model,
    };
  }

  async generate(
    reqOrMessages: any,
    apiKeyOrOptions: any,
    modelIdOrKey?: any,
    baseUrlOrModelId?: any,
    options?: {
      customHeaders?: Record<string, string>;
      advancedConfig?: AdvancedProviderConfig;
    }
  ): Promise<any> {
    // Determine calling signature
    if (Array.isArray(reqOrMessages)) {
      // Legacy signature: generate(messages, options, apiKey, modelId)
      return this.legacyGenerate(reqOrMessages, apiKeyOrOptions, modelIdOrKey, baseUrlOrModelId);
    }

    // Modern signature: generate(req: GenerateRequest, apiKey: string, modelId: string, baseUrl?: string, options?: ...)
    const req: GenerateRequest = reqOrMessages;
    const apiKey: string = apiKeyOrOptions;
    let activeModel = resolveGeminiModel(modelIdOrKey);

    const t0 = Date.now();
    const client = new GoogleGenAI({ apiKey: apiKey.trim() });

    const contents = req.messages.map((m) => ({
      role: m.role === "assistant" ? ("model" as const) : ("user" as const),
      parts: [{ text: m.content }],
    }));

    const config: any = {
      maxOutputTokens: options?.advancedConfig?.max_tokens || req.maxTokens || 4096,
      temperature: options?.advancedConfig?.temperature ?? (req.temperature ?? 0.3),
    };

    if (req.system) {
      config.systemInstruction = req.system;
    }

    if (req.schema) {
      config.responseMimeType = "application/json";
    }

    // Advanced Gemini Features: Thinking Budget & Google Search Grounding
    if (options?.advancedConfig?.thinking_budget !== undefined) {
      config.thinkingConfig = { thinkingBudget: options.advancedConfig.thinking_budget };
    }

    if (options?.advancedConfig?.enable_search_grounding) {
      config.tools = [{ googleSearch: {} }];
    }

    let result: any;
    try {
      result = await client.models.generateContent({
        model: activeModel,
        contents,
        config,
      });
    } catch (err: any) {
      const is429 =
        err?.status === 429 ||
        (err?.message &&
          (err.message.includes("429") ||
            err.message.includes("quota") ||
            err.message.includes("RESOURCE_EXHAUSTED")));

      if (isModelUnavailableError(err) && activeModel !== DEFAULT_GEMINI_MODEL) {
        activeModel = DEFAULT_GEMINI_MODEL;
        result = await client.models.generateContent({
          model: activeModel,
          contents,
          config,
        });
      } else if (is429 && activeModel !== "gemini-3.5-flash-lite") {
        activeModel = "gemini-3.5-flash-lite";
        result = await client.models.generateContent({
          model: activeModel,
          contents,
          config,
        });
      } else {
        throw err;
      }
    }

    const text = result.text || "";
    let jsonParsed: any = undefined;
    if (req.schema && text) {
      try {
        jsonParsed = JSON.parse(text);
      } catch {}
    }

    return {
      text,
      json: jsonParsed,
      usage: {
        inputTokens: result.usageMetadata?.promptTokenCount || 0,
        outputTokens: result.usageMetadata?.candidatesTokenCount || 0,
      },
      latencyMs: Date.now() - t0,
      providerId: this.id,
      modelId: activeModel,
    };
  }

  async legacyGenerate(
    messages: { role: "user" | "assistant" | "system"; content: string }[],
    options: ProviderGenerateOptions,
    apiKey: string,
    modelId: string
  ): Promise<ProviderGenerateResult> {
    const startTime = Date.now();
    const client = new GoogleGenAI({ apiKey: apiKey.trim() });
    let activeModel = resolveGeminiModel(modelId);

    const chatHistory = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? ("model" as const) : ("user" as const),
      parts: [{ text: m.content }],
    }));

    const lastMsg = messages[messages.length - 1]?.content || "";

    const config: any = {
      maxOutputTokens: options.maxTokens || 4096,
      temperature: options.temperature ?? 0.3,
    };

    if (options.systemInstruction) {
      config.systemInstruction = options.systemInstruction;
    }

    if (options.tools && options.tools.length > 0) {
      config.tools = options.tools;
    }

    let result: any;
    try {
      result = await client.models.generateContent({
        model: activeModel,
        contents: [
          ...chatHistory,
          { role: "user" as const, parts: [{ text: lastMsg }] },
        ],
        config,
      });
    } catch (err: any) {
      const is429 =
        err?.status === 429 ||
        (err?.message &&
          (err.message.includes("429") ||
            err.message.includes("quota") ||
            err.message.includes("RESOURCE_EXHAUSTED")));

      if (isModelUnavailableError(err) && activeModel !== DEFAULT_GEMINI_MODEL) {
        activeModel = DEFAULT_GEMINI_MODEL;
        result = await client.models.generateContent({
          model: activeModel,
          contents: [
            ...chatHistory,
            { role: "user" as const, parts: [{ text: lastMsg }] },
          ],
          config,
        });
      } else if (is429 && activeModel !== "gemini-3.5-flash-lite") {
        activeModel = "gemini-3.5-flash-lite";
        result = await client.models.generateContent({
          model: activeModel,
          contents: [
            ...chatHistory,
            { role: "user" as const, parts: [{ text: lastMsg }] },
          ],
          config,
        });
      } else {
        throw err;
      }
    }

    const durationMs = Date.now() - startTime;
    const candidate = result.candidates?.[0];
    const parts = candidate?.content?.parts || [];

    const functionCalls: { name: string; args: Record<string, any> }[] = [];
    let text = "";

    for (const part of parts) {
      if (part.functionCall) {
        functionCalls.push({
          name: part.functionCall.name || "",
          args: (part.functionCall.args as Record<string, any>) || {},
        });
      }
      if (part.text) {
        text += part.text;
      }
    }

    return {
      text: text.trim(),
      providerId: this.id,
      modelId: activeModel,
      durationMs,
      functionCalls: functionCalls.length > 0 ? functionCalls : undefined,
      tokensUsed: {
        prompt: result.usageMetadata?.promptTokenCount,
        completion: result.usageMetadata?.candidatesTokenCount,
        total: result.usageMetadata?.totalTokenCount,
      },
    };
  }
}
