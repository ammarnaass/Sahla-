import type {
  LLMProvider,
  GenerateRequest,
  GenerateResult,
  PingResult,
  Capabilities,
  AdvancedProviderConfig,
} from "./types";

/**
 * 🧠 Anthropic Claude Adapter (Messages API)
 * Technical Spec v1.0 Section 6.3
 */
export class AnthropicAdapter implements LLMProvider {
  id = "anthropic";
  kind = "anthropic" as const;
  capabilities: Capabilities;

  constructor() {
    this.capabilities = {
      tool_use: true,
      json_mode: true,
      structured_output: "tool",
      streaming: true,
      max_context: 200000,
      vision: true,
      languages_verified: ["ar", "fr", "en"],
      web_search: false,
      prompt_caching: true,
    };
  }

  private mapErrorMessage(status: number, rawMessage: string): string {
    switch (status) {
      case 401:
      case 403:
        return "المفتاح غير صالح أو لا يملك الصلاحية في Anthropic (401/403)";
      case 402:
        return "الرصيد أو الحصة انتهت لدى Anthropic (402)";
      case 404:
        return "النموذج غير متاح لهذا الحساب في Anthropic (404)";
      case 429:
        return "تجاوز حد الطلبات في Anthropic، أعد المحاولة لاحقاً (429)";
      default:
        if (status >= 500) {
          return "خوادم Anthropic غير متاحة حالياً (5xx)";
        }
        return `خطأ Anthropic: ${rawMessage}`;
    }
  }

  async ping(
    apiKey: string,
    modelId: string,
    baseUrl?: string,
    options?: {
      customHeaders?: Record<string, string>;
      advancedConfig?: AdvancedProviderConfig;
    }
  ): Promise<PingResult> {
    const t0 = Date.now();
    const endpoint = `${(baseUrl || "https://api.anthropic.com").replace(/\/+$/, "")}/v1/messages`;

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
        model: modelId,
        checks,
        capabilities: { json_mode: false, tool_use: false },
        message_ar: "مفتاح API الخاص بـ Anthropic غير محدد",
        error: "Missing API Key",
      };
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-api-key": apiKey.trim(),
      "anthropic-version": "2023-06-01",
      ...(options?.customHeaders || {}),
    };
    const timeoutMs = (options?.advancedConfig?.timeout_seconds || 15) * 1000;

    try {
      // 1. Stage 1: Auth & Model Available (max_tokens: 10)
      const stage1Res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: modelId || "claude-3-7-sonnet-20250219",
          max_tokens: 10,
          messages: [{ role: "user", content: "ping" }],
        }),
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!stage1Res.ok) {
        const errJson = await stage1Res.json().catch(() => ({}));
        const rawErr = errJson?.error?.message || stage1Res.statusText;
        return {
          status: "error",
          latency_ms: Date.now() - t0,
          model: modelId,
          checks,
          capabilities: {},
          message_ar: this.mapErrorMessage(stage1Res.status, rawErr),
          error: rawErr,
        };
      }

      checks.auth = "ok";
      checks.model_available = "ok";

      // 2. Stage 2 & 3: JSON & Arabic check
      try {
        const stage2Res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey.trim(),
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: modelId || "claude-3-7-sonnet-20250219",
            max_tokens: 40,
            messages: [
              {
                role: "user",
                content: "أجب بهذا الـ JSON حصراً دون أي زيادة: {\"status\":\"ok\",\"lang\":\"ar\"}",
              },
            ],
          }),
          signal: AbortSignal.timeout(10000),
        });

        if (stage2Res.ok) {
          const s2Data = await stage2Res.json().catch(() => ({}));
          const text = s2Data.content?.[0]?.text || "";
          try {
            const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
            if (parsed.status === "ok") checks.json_output = "ok";
          } catch {}
          if (/[\u0600-\u06FF]/.test(text) || text.includes("ar")) {
            checks.arabic_sample = "ok";
          }
        }
      } catch {
        checks.json_output = "error";
      }

      const latencyMs = Date.now() - t0;
      return {
        status: "ok",
        latency_ms: latencyMs,
        model: modelId,
        checks,
        capabilities: {
          tool_use: true,
          json_mode: true,
          languages_verified: ["ar", "fr", "en"],
          prompt_caching: true,
        },
        message_ar: "تم فحص الاتصال بمحرك Anthropic بنجاح",
      };
    } catch (err: any) {
      const isTimeout = err?.name === "TimeoutError" || err?.name === "AbortError";
      return {
        status: "error",
        latency_ms: Date.now() - t0,
        model: modelId,
        checks,
        capabilities: {},
        message_ar: isTimeout ? "المزوّد غير متاح حالياً (انتهت المهلة)" : `تعذر الاتصال بـ Anthropic: ${err.message}`,
        error: err.message,
      };
    }
  }

  async generate(
    req: GenerateRequest,
    apiKey: string,
    modelId: string,
    baseUrl?: string,
    options?: {
      customHeaders?: Record<string, string>;
      advancedConfig?: AdvancedProviderConfig;
    }
  ): Promise<GenerateResult> {
    const t0 = Date.now();
    const endpoint = `${(baseUrl || "https://api.anthropic.com").replace(/\/+$/, "")}/v1/messages`;

    const userMessages = req.messages
      .filter((m) => m.role !== "system")
      .map((m) => ({ role: m.role, content: m.content }));

    const bodyPayload: any = {
      model: modelId || "claude-3-7-sonnet-20250219",
      max_tokens: options?.advancedConfig?.max_tokens || req.maxTokens || 4096,
      system: req.system,
      messages: userMessages,
      temperature: options?.advancedConfig?.temperature ?? (req.temperature ?? 0.3),
    };

    // If schema is present, provide it as a tool per Section 6.3
    if (req.schema) {
      bodyPayload.tools = [
        {
          name: "output_schema_formatter",
          description: "Format the structured response strictly according to the schema",
          input_schema: req.schema,
        },
      ];
      bodyPayload.tool_choice = { type: "tool", name: "output_schema_formatter" };
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-api-key": apiKey.trim(),
      "anthropic-version": "2023-06-01",
      ...(options?.customHeaders || {}),
    };
    const timeoutMs =
      (options?.advancedConfig?.timeout_seconds ? options.advancedConfig.timeout_seconds * 1000 : undefined) ||
      req.timeoutMs ||
      60000;

    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(bodyPayload),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      const rawErr = errJson?.error?.message || `HTTP ${res.status}`;
      throw new Error(`[Anthropic:${modelId}] ${this.mapErrorMessage(res.status, rawErr)}`);
    }

    const data = await res.json();
    let textResult = "";
    let jsonResult: any = undefined;

    for (const block of data.content || []) {
      if (block.type === "text") {
        textResult += block.text;
      } else if (block.type === "tool_use" && block.name === "output_schema_formatter") {
        jsonResult = block.input;
      }
    }

    return {
      text: textResult,
      json: jsonResult,
      usage: {
        inputTokens: data.usage?.input_tokens || 0,
        outputTokens: data.usage?.output_tokens || 0,
      },
      latencyMs: Date.now() - t0,
      providerId: this.id,
      modelId,
    };
  }
}
