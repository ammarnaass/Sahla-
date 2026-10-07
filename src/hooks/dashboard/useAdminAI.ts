"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type {
  AIMessage,
  AIInsight,
  AIForecast,
  PendingAction,
  AdminAITool,
  AIChatResponse,
  AIInsightsResponse,
  AIForecastResponse,
  AIActionResponse,
} from "@/server/ai/types";

export function useAdminAI() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);

  const [forecasts, setForecasts] = useState<AIForecast[]>([]);
  const [forecastsLoading, setForecastsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome_msg",
          role: "assistant",
          content:
            "مرحباً بك حضرة المدير العام 👑\nأنا **محرك الذكاء الاصطناعي للمنظومة المركزية لـ 58 ولاية**. يمكنني تحليل المؤشرات الوطنية، مراقبة أداء الأكشاك، توقع الإيرادات، وتنفيذ الإجراءات الإدارية مباشرة.\n\nكيف يمكنني مساعدتك اليوم؟",
          timestamp: new Date().toISOString(),
          metadata: {
            confidence: 1,
          },
        },
      ]);
    }
  }, [messages.length]);

  /**
   * Send a chat message to the AI
   */
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: AIMessage = {
        id: `user_${Date.now()}`,
        role: "user",
        content: text.trim(),
        timestamp: new Date().toISOString(),
      };

      const updatedHistory = [...messages, userMsg];
      setMessages(updatedHistory);
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/v1/admin/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedHistory.map((m) => ({
              role: m.role === "assistant" ? "assistant" : "user",
              content: m.content,
            })),
            conversation_id: conversationId || undefined,
          }),
        });

        const data: AIChatResponse = await res.json();

        if (data.success && data.message) {
          setMessages((prev) => [...prev, data.message]);
          if (data.conversation_id) {
            setConversationId(data.conversation_id);
          }
          if (data.message.metadata?.pending_action) {
            setPendingAction(data.message.metadata.pending_action);
          }
        } else {
          throw new Error((data as any).error || "فشل تلقي الرد من المساعد");
        }
      } catch (err: any) {
        console.error("[useAdminAI:chat] error:", err);
        setError(err.message || "حدث خطأ في الاتصال بالمساعد");
        // Add error message in chat
        setMessages((prev) => [
          ...prev,
          {
            id: `err_${Date.now()}`,
            role: "assistant",
            content: `⚠️ عذراً، حدث خطأ: ${err.message || "تعذر الاتصال بالمحرك"}. يرجى المحاولة مرة أخرى.`,
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, conversationId]
  );

  /**
   * Load AI Insights
   */
  const fetchInsights = useCallback(async (refresh: boolean = false) => {
    setInsightsLoading(true);
    try {
      const url = `/api/v1/admin/ai/insights${refresh ? "?refresh=true" : ""}`;
      const res = await fetch(url);
      const data: AIInsightsResponse = await res.json();
      if (data.success && data.insights) {
        setInsights(data.insights);
      }
    } catch (err: any) {
      console.error("[useAdminAI:insights] error:", err);
    } finally {
      setInsightsLoading(false);
    }
  }, []);

  /**
   * Load Business Forecasts
   */
  const fetchForecasts = useCallback(async () => {
    setForecastsLoading(true);
    try {
      const res = await fetch("/api/v1/admin/ai/forecast");
      const data: AIForecastResponse = await res.json();
      if (data.success && data.forecasts) {
        setForecasts(data.forecasts);
      }
    } catch (err: any) {
      console.error("[useAdminAI:forecasts] error:", err);
    } finally {
      setForecastsLoading(false);
    }
  }, []);

  /**
   * Execute Administrative Action via AI
   */
  const executeAction = useCallback(
    async (tool: AdminAITool, params: Record<string, any>, confirmed: boolean = false) => {
      try {
        const res = await fetch("/api/v1/admin/ai/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: tool,
            params,
            confirmed,
          }),
        });

        const data: AIActionResponse = await res.json();

        // Inject execution result into chat
        if (data.result) {
          const resultMsg: AIMessage = {
            id: `action_${Date.now()}`,
            role: "assistant",
            content: data.result.executed
              ? `✅ **تم تنفيذ الإجراء:** ${data.result.summary_ar}`
              : `⚠️ **الإجراء لم ينفذ:** ${data.result.summary_ar}`,
            timestamp: new Date().toISOString(),
            metadata: {
              tools_used: [tool],
              data_refs: data.result.data ? [JSON.stringify(data.result.data)] : undefined,
            },
          };
          setMessages((prev) => [...prev, resultMsg]);
        }

        setPendingAction(null);
        return data;
      } catch (err: any) {
        console.error("[useAdminAI:actions] error:", err);
        return { success: false, error: err.message };
      }
    },
    []
  );

  /**
   * Confirm pending write action
   */
  const confirmPendingAction = useCallback(async () => {
    if (!pendingAction) return;
    await executeAction(pendingAction.tool, pendingAction.params, true);
  }, [pendingAction, executeAction]);

  /**
   * Cancel pending write action
   */
  const cancelPendingAction = useCallback(() => {
    setPendingAction(null);
  }, []);

  /**
   * Clear Chat History
   */
  const clearChat = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setPendingAction(null);
  }, []);

  return {
    messages,
    isLoading,
    conversationId,
    pendingAction,
    insights,
    insightsLoading,
    forecasts,
    forecastsLoading,
    error,
    sendMessage,
    fetchInsights,
    fetchForecasts,
    executeAction,
    confirmPendingAction,
    cancelPendingAction,
    clearChat,
  };
}
