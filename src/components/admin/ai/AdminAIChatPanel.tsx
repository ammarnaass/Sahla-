"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Brain,
  Send,
  Sparkles,
  Bot,
  User,
  X,
  Minimize2,
  Maximize2,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Loader2,
  HelpCircle,
} from "lucide-react";
import { useAdminAI } from "@/hooks/dashboard/useAdminAI";
import { AI_QUICK_PROMPTS } from "@/server/ai/config";
import type { AIMessage } from "@/server/ai/types";

interface AdminAIChatPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  isFloating?: boolean;
  initialQuery?: string;
  className?: string;
}

export function AdminAIChatPanel({
  isOpen = true,
  onClose,
  isFloating = true,
  initialQuery,
  className = "",
}: AdminAIChatPanelProps) {
  const {
    messages,
    isLoading,
    pendingAction,
    sendMessage,
    confirmPendingAction,
    cancelPendingAction,
    clearChat,
  } = useAdminAI();

  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, pendingAction]);

  // Handle initial query if passed
  useEffect(() => {
    if (initialQuery) {
      sendMessage(initialQuery);
    }
  }, [initialQuery]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  // Format message content with markdown-like styling
  const renderMessageContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} className="font-bold text-sm text-foreground mt-2 mb-1">
            {line.replace("### ", "")}
          </h4>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h3 key={idx} className="font-bold text-base text-emerald-700 dark:text-emerald-400 mt-2 mb-1">
            {line.replace("## ", "")}
          </h3>
        );
      }
      if (line.startsWith("# ")) {
        return (
          <h2 key={idx} className="font-bold text-lg text-foreground mt-2 mb-1">
            {line.replace("# ", "")}
          </h2>
        );
      }

      // Bullets
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const text = line.trim().substring(2);
        return (
          <li key={idx} className="mr-3 list-disc text-xs leading-relaxed my-0.5">
            {renderInlineMarkdown(text)}
          </li>
        );
      }

      // Normal line
      return line.trim() === "" ? (
        <div key={idx} className="h-1.5" />
      ) : (
        <p key={idx} className="text-xs leading-relaxed my-0.5">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  // Helper for inline bold / highlights
  const renderInlineMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const containerClasses = isFloating
    ? `fixed bottom-6 left-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] rounded-2xl border border-emerald-500/30 bg-background/95 backdrop-blur-xl shadow-2xl transition-all duration-300 flex flex-col ${
        isMinimized ? "h-14" : "h-[620px] max-h-[85vh]"
      } ${className}`
    : `rounded-2xl border border-border bg-card shadow-sm flex flex-col h-[700px] w-full ${className}`;

  return (
    <div className={containerClasses} dir="rtl">
      {/* ── Header ── */}
      <div className="p-3.5 border-b border-border/80 bg-gradient-to-l from-emerald-600/10 via-card to-card flex items-center justify-between rounded-t-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/30">
            <Brain size={18} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-foreground">
                المساعد الإداري الذكي
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10px] text-muted-foreground">
              المنظومة المركزية لـ 58 ولاية · Gemini 2.5
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-muted-foreground">
          <button
            onClick={clearChat}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors hover:text-foreground"
            title="مسح المحادثة"
          >
            <Trash2 size={15} />
          </button>

          {isFloating && (
            <>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors hover:text-foreground"
                title={isMinimized ? "تكبير" : "تصغير"}
              >
                {isMinimized ? <Maximize2 size={15} /> : <Minimize2 size={15} />}
              </button>

              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-600 transition-colors"
                  title="إغلاق"
                >
                  <X size={16} />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Minimized Bar Content ── */}
      {isMinimized && (
        <div className="flex-1 flex items-center px-4 text-xs text-muted-foreground justify-between">
          <span>انقر لتوسيع المحادثة مع المساعد...</span>
          <span className="text-[10px] bg-emerald-500/15 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
            جاهز
          </span>
        </div>
      )}

      {/* ── Main Chat Area (Visible when not minimized) ── */}
      {!isMinimized && (
        <>
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
            {messages.map((msg) => {
              const isUser = msg.role === "user";

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs shadow-xs ${
                      isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {isUser ? <User size={14} /> : <Bot size={14} />}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                      isUser
                        ? "bg-primary text-primary-foreground rounded-tl-xs"
                        : "bg-muted/60 text-foreground border border-border/80 rounded-tr-xs"
                    }`}
                  >
                    {renderMessageContent(msg.content)}

                    {/* Metadata tags */}
                    {msg.metadata?.tools_used && msg.metadata.tools_used.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-border/40 flex flex-wrap items-center gap-1">
                        <span className="text-[10px] text-muted-foreground">أدوات:</span>
                        {msg.metadata.tools_used.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] px-1.5 py-0.2 rounded bg-background/60 border border-border text-muted-foreground font-mono"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Pending Action Card */}
            {pendingAction && (
              <div className="p-3.5 rounded-xl border border-amber-500/40 bg-amber-500/10 animate-pulse-subtle">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs mb-1.5">
                  <ShieldAlert size={16} />
                  <span>تأكيد تنفيذ عملية حساسة</span>
                </div>
                <p className="text-xs text-foreground mb-3">
                  {pendingAction.description_ar}
                </p>
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={cancelPendingAction}
                    className="px-3 py-1 rounded-lg text-xs border border-border bg-background hover:bg-muted transition-colors text-muted-foreground"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={confirmPendingAction}
                    className="px-3 py-1 rounded-lg text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-sm transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 size={13} />
                    <span>تأكيد وتنفيذ الآن</span>
                  </button>
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 items-center text-muted-foreground text-xs p-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600/15 flex items-center justify-center text-emerald-600">
                  <Loader2 size={15} className="animate-spin" />
                </div>
                <div className="flex items-center gap-1 text-[11px]">
                  <span>المساعد يحلل بيانات المنصة...</span>
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce delay-100">●</span>
                  <span className="animate-bounce delay-200">●</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Quick Prompts Pills ── */}
          <div className="px-3 py-2 border-t border-border/60 bg-muted/20 overflow-x-auto scrollbar-none flex items-center gap-1.5">
            {AI_QUICK_PROMPTS.slice(0, 4).map((qp, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(qp.text_ar)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg text-[11px] font-medium bg-card hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300 border border-border/80 transition-all text-muted-foreground hover:border-emerald-500/30 flex items-center gap-1 shrink-0"
              >
                <span>{qp.icon}</span>
                <span>{qp.text_ar}</span>
              </button>
            ))}
          </div>

          {/* ── Input Box ── */}
          <div className="p-3 border-t border-border/80 bg-card rounded-b-2xl">
            <div className="relative flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="اطلب تحليلاً، استعلاماً عن ولاية، أو إجراءً إدارياً..."
                disabled={isLoading}
                className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-border/90 bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-foreground placeholder:text-muted-foreground"
              />

              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 transition-all shrink-0"
                title="إرسال"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={15} className="rotate-180" />
                )}
              </button>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground px-1">
              <span>مدعوم بـ Gemini 2.5 Flash · بيانات حية</span>
              <span>اضغط Enter للإرسال</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
