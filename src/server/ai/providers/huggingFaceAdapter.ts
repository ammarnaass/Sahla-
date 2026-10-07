import type {
  IAIProviderAdapter,
  ProviderHealthCheck,
  ProviderGenerateOptions,
  ProviderGenerateResult,
} from "./types";

export class HuggingFaceAdapter implements IAIProviderAdapter {
  id = "huggingface" as const;

  async testConnection(apiKey: string, modelId: string): Promise<ProviderHealthCheck> {
    const startTime = Date.now();
    try {
      if (!apiKey || !apiKey.trim()) {
        return {
          success: false,
          latencyMs: 0,
          providerId: this.id,
          modelId,
          message_ar: "مفتاح Hugging Face Access Token غير محدد",
          error: "API key is required",
        };
      }

      const targetModel = modelId || "Qwen/Qwen2.5-72B-Instruct";

      // Test using HF Inference API
      const res = await fetch(
        `https://api-inference.huggingface.co/models/${targetModel}/v1/chat/completions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey.trim()}`,
          },
          body: JSON.stringify({
            model: targetModel,
            messages: [{ role: "user", content: "قل: متصل" }],
            max_tokens: 15,
            temperature: 0.1,
          }),
        }
      );

      const latencyMs = Date.now() - startTime;
      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data?.error || `HTTP ${res.status} ${res.statusText}`;
        return {
          success: false,
          latencyMs,
          providerId: this.id,
          modelId: targetModel,
          message_ar: `فشل الاتصال بـ Hugging Face: ${errorMsg}`,
          error: errorMsg,
        };
      }

      const answer = data.choices?.[0]?.message?.content?.trim() || "";

      return {
        success: true,
        latencyMs,
        providerId: this.id,
        modelId: targetModel,
        message_ar: `تم الاتصال بنجاح بـ Hugging Face (${latencyMs}ms) — الاستجابة: "${answer.slice(0, 30)}"`,
      };
    } catch (err: any) {
      return {
        success: false,
        latencyMs: Date.now() - startTime,
        providerId: this.id,
        modelId,
        message_ar: `خطأ في الاتصال بـ Hugging Face: ${err.message || "خطأ غير معروف"}`,
        error: err.message,
      };
    }
  }

  async generate(
    messages: { role: "user" | "assistant" | "system"; content: string }[],
    options: ProviderGenerateOptions,
    apiKey: string,
    modelId: string
  ): Promise<ProviderGenerateResult> {
    const startTime = Date.now();
    const targetModel = modelId || "Qwen/Qwen2.5-72B-Instruct";

    const formattedMessages: { role: string; content: string }[] = [];

    if (options.systemInstruction) {
      formattedMessages.push({ role: "system", content: options.systemInstruction });
    }

    for (const msg of messages) {
      formattedMessages.push({
        role: msg.role === "system" ? "system" : msg.role === "assistant" ? "assistant" : "user",
        content: msg.content,
      });
    }

    const payload: any = {
      model: targetModel,
      messages: formattedMessages,
      temperature: options.temperature ?? 0.3,
      max_tokens: options.maxTokens || 4096,
    };

    const res = await fetch(
      `https://api-inference.huggingface.co/models/${targetModel}/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const durationMs = Date.now() - startTime;
    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data?.error || `Hugging Face API Error ${res.status}: ${res.statusText}`
      );
    }

    const text = data.choices?.[0]?.message?.content || "";

    return {
      text: text.trim(),
      providerId: this.id,
      modelId: targetModel,
      durationMs,
      tokensUsed: {
        prompt: data.usage?.prompt_tokens,
        completion: data.usage?.completion_tokens,
        total: data.usage?.total_tokens,
      },
    };
  }
}
