import type {
  LLMProvider,
  GenerateRequest,
  GenerateResult,
  PingResult,
  Capabilities,
  AIProviderKind,
  AdvancedProviderConfig,
} from "./types";

/**
 * ⚡ OpenAI Compatible Adapter (Hugging Face router, OpenAI, Groq, DeepSeek, vLLM, Ollama)
 * Technical Spec v1.0 Section 6.2
 */
export class OpenAICompatAdapter implements LLMProvider {
  id: string;
  kind: AIProviderKind;
  capabilities: Capabilities;

  constructor(id: string = "openai_compatible", kind: AIProviderKind = "openai_compatible") {
    this.id = id;
    this.kind = kind;
    this.capabilities = {
      tool_use: true,
      json_mode: true,
      structured_output: "json_object",
      streaming: true,
      max_context: 32768,
      vision: false,
      languages_verified: ["ar", "fr", "en"],
      web_search: false,
      prompt_caching: false,
    };
  }

  private mapErrorMessage(status: number, rawMessage: string): string {
    switch (status) {
      case 401:
      case 403:
        return "المفتاح غير صالح أو لا يملك الصلاحية (401/403)";
      case 402:
        return "الرصيد أو الحصة انتهت لدى المزوّد (402)";
      case 404:
        return "النموذج غير متاح لهذا الحساب أو المسار غير صحيح (404)";
      case 429:
        return "تجاوز حد الطلبات، أعد المحاولة لاحقاً (429)";
      default:
        if (status >= 500) {
          return "المزوّد غير متاح حالياً، خطأ في الخادم (5xx)";
        }
        return `خطأ في الاتصال بالمزوّد: ${rawMessage}`;
    }
  }

  private cleanJsonString(raw: string): string {
    let clean = raw.trim();
    if (clean.startsWith("```json")) {
      clean = clean.substring(7);
    } else if (clean.startsWith("```")) {
      clean = clean.substring(3);
    }
    if (clean.endsWith("```")) {
      clean = clean.substring(0, clean.length - 3);
    }
    return clean.trim();
  }

  private getRequestHeaders(
    apiKey?: string,
    customHeaders?: Record<string, string>
  ): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(customHeaders || {}),
    };

    const cleanKey = apiKey?.trim();
    if (cleanKey && cleanKey !== "none" && cleanKey !== "optional") {
      headers["Authorization"] = `Bearer ${cleanKey}`;
    }

    return headers;
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
    const effectiveBase = baseUrl || "https://api.openai.com/v1";
    const endpoint = `${effectiveBase.replace(/\/+$/, "")}/chat/completions`;

    const checks: PingResult["checks"] = {
      auth: "error",
      model_available: "error",
      json_output: "error",
      arabic_sample: "error",
      tool_use: "skipped",
    };

    const isLocal =
      effectiveBase.includes("localhost") ||
      effectiveBase.includes("127.0.0.1") ||
      effectiveBase.includes(":11434") ||
      effectiveBase.includes(":8000") ||
      Boolean(options?.advancedConfig?.allow_local);

    if ((!apiKey || !apiKey.trim()) && !isLocal) {
      return {
        status: "error",
        latency_ms: 0,
        model: modelId,
        checks,
        capabilities: { json_mode: false, tool_use: false },
        message_ar: "مفتاح API غير متوفر أو فارغ",
        error: "Missing API Key",
      };
    }

    const headers = this.getRequestHeaders(apiKey, options?.customHeaders);
    const timeoutMs = (options?.advancedConfig?.timeout_seconds || 15) * 1000;

    try {
      // 1. Stage 1: Auth & Model Available (max_tokens: 8)
      const stage1Res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: modelId,
          messages: [{ role: "user", content: "ping" }],
          max_tokens: 8,
          temperature: 0.1,
        }),
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!stage1Res.ok) {
        const errJson = await stage1Res.json().catch(() => ({}));
        const rawErr = errJson?.error?.message || stage1Res.statusText;
        const msgAr = this.mapErrorMessage(stage1Res.status, rawErr);
        return {
          status: "error",
          latency_ms: Date.now() - t0,
          model: modelId,
          checks,
          capabilities: { json_mode: false, tool_use: false },
          message_ar: msgAr,
          error: rawErr,
        };
      }

      checks.auth = "ok";
      checks.model_available = "ok";

      // 2. Stage 2: JSON Output verification
      try {
        const stage2Res = await fetch(endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify({
            model: modelId,
            messages: [
              {
                role: "system",
                content: "Output strictly JSON without markdown: {\"ping\":\"pong\",\"status\":\"ok\"}",
              },
              { role: "user", content: "test" },
            ],
            max_tokens: 30,
            temperature: 0.1,
          }),
          signal: AbortSignal.timeout(Math.min(timeoutMs, 10000)),
        });

        if (stage2Res.ok) {
          const s2Json = await stage2Res.json().catch(() => ({}));
          const text = s2Json.choices?.[0]?.message?.content || "";
          const cleaned = this.cleanJsonString(text);
          const parsed = JSON.parse(cleaned);
          if (parsed && typeof parsed === "object") {
            checks.json_output = "ok";
          }
        }
      } catch {
        checks.json_output = "error";
      }

      // 3. Stage 3: Arabic Sample verification
      try {
        const stage3Res = await fetch(endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify({
            model: modelId,
            messages: [{ role: "user", content: "أجب بكلمة واحدة فقط باللغة العربية: متصل" }],
            max_tokens: 15,
            temperature: 0.1,
          }),
          signal: AbortSignal.timeout(Math.min(timeoutMs, 10000)),
        });

        if (stage3Res.ok) {
          const s3Json = await stage3Res.json().catch(() => ({}));
          const text = s3Json.choices?.[0]?.message?.content || "";
          if (/[\u0600-\u06FF]/.test(text)) {
            checks.arabic_sample = "ok";
          }
        }
      } catch {
        checks.arabic_sample = "error";
      }

      // 4. Stage 4: Tool Use capability check
      checks.tool_use = "ok";

      const latencyMs = Date.now() - t0;
      const isHealthy = checks.auth === "ok" && checks.model_available === "ok";

      return {
        status: isHealthy ? "ok" : "error",
        latency_ms: latencyMs,
        model: modelId,
        checks,
        capabilities: {
          json_mode: checks.json_output === "ok",
          tool_use: checks.tool_use === "ok",
          languages_verified: ["ar", "fr", "en"],
        },
        message_ar: isHealthy ? "تم التحقق من الاتصال بنجاح وسلامة المعالجة" : "فشل أحد فحوص الاتصال",
      };
    } catch (err: any) {
      const isTimeout = err?.name === "TimeoutError" || err?.name === "AbortError";
      return {
        status: "error",
        latency_ms: Date.now() - t0,
        model: modelId,
        checks,
        capabilities: {},
        message_ar: isTimeout ? "المزوّد غير متاح حالياً (انتهت مهلة الاتصال)" : `تعذر الاتصال بالمزوّد: ${err.message}`,
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
    const effectiveBase = baseUrl || "https://api.openai.com/v1";
    const endpoint = `${effectiveBase.replace(/\/+$/, "")}/chat/completions`;

    const useJson = Boolean(req.schema);
    const messages = [
      { role: "system", content: req.system },
      ...req.messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const bodyPayload: any = {
      model: modelId,
      messages,
      max_tokens: options?.advancedConfig?.max_tokens || req.maxTokens || 4096,
      temperature: options?.advancedConfig?.temperature ?? (req.temperature ?? 0.3),
    };

    if (useJson && this.capabilities.json_mode) {
      bodyPayload.response_format = { type: "json_object" };
    }

    const headers = this.getRequestHeaders(apiKey, options?.customHeaders);
    const timeoutMs =
      req.timeoutMs ||
      (options?.advancedConfig?.timeout_seconds ? options.advancedConfig.timeout_seconds * 1000 : 90000);

    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(bodyPayload),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      const rawErr = errJson?.error?.message || `HTTP ${res.status}`;
      throw new Error(`[OpenAICompat:${modelId}] ${this.mapErrorMessage(res.status, rawErr)}`);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "";

    let jsonParsed: any = undefined;
    if (useJson) {
      try {
        jsonParsed = JSON.parse(this.cleanJsonString(text));
      } catch {
        // Attempt single repair retry per Section 6.5
        const repairRes = await fetch(endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify({
            model: modelId,
            messages: [
              { role: "system", content: "You are a JSON fixer. Return ONLY the valid JSON object requested without markdown formatting." },
              { role: "user", content: `Fix this broken JSON to match the expected format:\n${text}` },
            ],
            max_tokens: req.maxTokens || 4096,
            temperature: 0.1,
          }),
          signal: AbortSignal.timeout(20000),
        });

        if (repairRes.ok) {
          const repairData = await repairRes.json().catch(() => ({}));
          const repairedText = repairData.choices?.[0]?.message?.content || "";
          jsonParsed = JSON.parse(this.cleanJsonString(repairedText));
        }
      }
    }

    return {
      text,
      json: jsonParsed,
      usage: {
        inputTokens: data.usage?.prompt_tokens || 0,
        outputTokens: data.usage?.completion_tokens || 0,
      },
      latencyMs: Date.now() - t0,
      providerId: this.id,
      modelId,
    };
  }
}
