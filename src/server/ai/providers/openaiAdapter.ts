import type {
  IAIProviderAdapter,
  ProviderHealthCheck,
  ProviderGenerateOptions,
  ProviderGenerateResult,
} from "./types";

export class OpenAIAdapter implements IAIProviderAdapter {
  id = "openai" as const;

  async testConnection(apiKey: string, modelId: string): Promise<ProviderHealthCheck> {
    const startTime = Date.now();
    try {
      if (!apiKey || !apiKey.trim()) {
        return {
          success: false,
          latencyMs: 0,
          providerId: this.id,
          modelId,
          message_ar: "مفتاح API الخاص بـ OpenAI غير محدد",
          error: "API key is required",
        };
      }

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model: modelId || "gpt-4o-mini",
          messages: [{ role: "user", content: "أجب بكلمة واحدة: متصل" }],
          max_tokens: 10,
          temperature: 0.1,
        }),
      });

      const latencyMs = Date.now() - startTime;
      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data?.error?.message || `HTTP ${res.status} ${res.statusText}`;
        return {
          success: false,
          latencyMs,
          providerId: this.id,
          modelId,
          message_ar: `فشل الاتصال بـ OpenAI: ${errorMsg}`,
          error: errorMsg,
        };
      }

      const answer = data.choices?.[0]?.message?.content?.trim() || "";

      return {
        success: true,
        latencyMs,
        providerId: this.id,
        modelId,
        message_ar: `تم الاتصال بنجاح بـ OpenAI (${latencyMs}ms) — الاستجابة: "${answer}"`,
      };
    } catch (err: any) {
      return {
        success: false,
        latencyMs: Date.now() - startTime,
        providerId: this.id,
        modelId,
        message_ar: `خطأ في الاتصال بـ OpenAI: ${err.message || "خطأ غير معروف"}`,
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
      model: modelId || "gpt-4o-mini",
      messages: formattedMessages,
      temperature: options.temperature ?? 0.3,
      max_tokens: options.maxTokens || 4096,
    };

    // Convert function declarations to OpenAI tools if provided
    if (options.tools && options.tools.length > 0) {
      const toolDeclList = options.tools[0]?.functionDeclarations || [];
      if (toolDeclList.length > 0) {
        payload.tools = toolDeclList.map((tool: any) => ({
          type: "function",
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters,
          },
        }));
      }
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify(payload),
    });

    const durationMs = Date.now() - startTime;
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error?.message || `OpenAI API Error ${res.status}: ${res.statusText}`);
    }

    const choice = data.choices?.[0];
    const message = choice?.message;
    const text = message?.content || "";

    const functionCalls: { name: string; args: Record<string, any> }[] = [];
    if (message?.tool_calls && Array.isArray(message.tool_calls)) {
      for (const tc of message.tool_calls) {
        if (tc.type === "function") {
          let args = {};
          try {
            args = JSON.parse(tc.function?.arguments || "{}");
          } catch {}
          functionCalls.push({
            name: tc.function?.name,
            args,
          });
        }
      }
    }

    return {
      text: text.trim(),
      providerId: this.id,
      modelId: modelId || "gpt-4o-mini",
      durationMs,
      functionCalls: functionCalls.length > 0 ? functionCalls : undefined,
      tokensUsed: {
        prompt: data.usage?.prompt_tokens,
        completion: data.usage?.completion_tokens,
        total: data.usage?.total_tokens,
      },
    };
  }
}
