"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Zap,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Cpu,
  Crown,
  ExternalLink,
  Shield,
  Trash2,
  ArrowUp,
  ArrowDown,
  Check,
  X,
} from "lucide-react";
import type { AIProviderRecord, PingResult, AIModelDefinition } from "@/server/ai/providers/types";

interface ProviderCardProps {
  provider: AIProviderRecord;
  fallbackRank?: number | null;
  onUpdate: (id: string, updates: { api_key?: string; model?: string; name?: string; base_url?: string; enabled?: boolean }) => Promise<void>;
  onSwitchPrimary: (id: string) => Promise<void>;
  onPing: (id: string, apiKey?: string, modelId?: string) => Promise<PingResult>;
  onDelete?: (id: string) => Promise<void>;
  onMoveFallback?: (id: string, direction: "up" | "down") => Promise<void>;
}

export function ProviderCard({
  provider,
  fallbackRank,
  onUpdate,
  onSwitchPrimary,
  onPing,
  onDelete,
  onMoveFallback,
}: ProviderCardProps) {
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState(provider.model);
  const [availableModels, setAvailableModels] = useState<AIModelDefinition[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [pingResult, setPingResult] = useState<PingResult | null>(null);

  // Load models dynamically from GET /{id}/models per Section 4.6
  useEffect(() => {
    let isMounted = true;
    const fetchModels = async () => {
      setLoadingModels(true);
      try {
        const res = await fetch(`/api/v1/admin/ai-providers/${provider.id}/models`);
        const data = await res.json();
        if (data.success && Array.isArray(data.models) && isMounted) {
          setAvailableModels(data.models);
          // If current selectedModel is not in list, add it
          if (!data.models.some((m: AIModelDefinition) => m.id === provider.model)) {
            setAvailableModels((prev) => [
              { id: provider.model, name: provider.model, description_ar: "النموذج المعتمد حالياً" },
              ...prev,
            ]);
          }
        }
      } catch {
        // Fallback to default models
        if (isMounted) {
          setAvailableModels([
            { id: provider.model, name: provider.model, description_ar: "النموذج المعتمد" },
          ]);
        }
      } finally {
        if (isMounted) setLoadingModels(false);
      }
    };

    fetchModels();
    return () => {
      isMounted = false;
    };
  }, [provider.id, provider.model]);

  const getProviderBrand = () => {
    switch (provider.kind) {
      case "gemini":
        return {
          gradient: "from-blue-600/10 via-indigo-500/5 to-card",
          border: provider.is_primary ? "border-amber-500/60 ring-1 ring-amber-500/30" : "border-blue-500/30",
          iconBg: "bg-blue-600 text-white shadow-blue-500/20",
          icon: "💎",
          docUrl: "https://aistudio.google.com/app/apikey",
          docText: "الحصول على مفتاح Google AI Studio",
        };
      case "anthropic":
        return {
          gradient: "from-amber-700/10 via-orange-600/5 to-card",
          border: provider.is_primary ? "border-amber-500/60 ring-1 ring-amber-500/30" : "border-orange-500/30",
          iconBg: "bg-amber-700 text-white shadow-amber-700/20",
          icon: "🧠",
          docUrl: "https://console.anthropic.com/settings/keys",
          docText: "الحصول على مفتاح Anthropic Console",
        };
      case "huggingface":
        return {
          gradient: "from-amber-600/10 via-yellow-500/5 to-card",
          border: provider.is_primary ? "border-amber-500/60 ring-1 ring-amber-500/30" : "border-amber-500/30",
          iconBg: "bg-amber-600 text-white shadow-amber-500/20",
          icon: "🤗",
          docUrl: "https://huggingface.co/settings/tokens",
          docText: "الحصول على Hugging Face Access Token",
        };
      default:
        return {
          gradient: "from-emerald-600/10 via-teal-500/5 to-card",
          border: provider.is_primary ? "border-amber-500/60 ring-1 ring-amber-500/30" : "border-emerald-500/30",
          iconBg: "bg-emerald-600 text-white shadow-emerald-500/20",
          icon: "⚡",
          docUrl: "https://platform.openai.com/api-keys",
          docText: "الحصول على مفتاح OpenAI Platform",
        };
    }
  };

  const brand = getProviderBrand();

  const handlePing = async () => {
    setIsTesting(true);
    setPingResult(null);
    try {
      const res = await onPing(
        provider.id,
        apiKeyInput.trim() || undefined,
        selectedModel
      );
      setPingResult(res);
    } catch (err: any) {
      setPingResult({
        status: "error",
        latency_ms: 0,
        model: selectedModel,
        checks: { auth: "error", model_available: "error", json_output: "error", arabic_sample: "error" },
        capabilities: {},
        message_ar: err.message || "فشل الاتصال",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(provider.id, {
        api_key: apiKeyInput.trim() || undefined,
        model: selectedModel,
      });
      setApiKeyInput("");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSwitchPrimary = async () => {
    if (provider.status !== "ok") {
      alert("لا يمكن تعيين المحرك كأساسي دون نجاح فحص الاتصال (Ping) أولاً وفق المعايير الأمنية.");
      return;
    }
    const confirmed = window.confirm(`هل أنت متأكد من تعيين "${provider.name}" كمحرك أساسي للذكاء الاصطناعي لكافة عمليات المنصة؟`);
    if (!confirmed) return;

    setIsSwitching(true);
    try {
      await onSwitchPrimary(provider.id);
    } finally {
      setIsSwitching(false);
    }
  };

  const isPingSuccess = provider.status === "ok";

  return (
    <div
      className={`rounded-2xl border ${brand.border} bg-gradient-to-br ${brand.gradient} p-5 shadow-xs flex flex-col justify-between transition-all duration-200 hover:shadow-md relative overflow-hidden`}
      dir="rtl"
    >
      <div>
        {/* ── Top Header & Role Badges ── */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl ${brand.iconBg} flex items-center justify-center font-bold text-lg shadow-md shrink-0`}
            >
              {brand.icon}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-base text-foreground">
                  {provider.name}
                </h3>

                {provider.is_primary ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow-2xs">
                    <Crown size={12} className="text-amber-500" />
                    المحرك الأساسي 👑
                  </span>
                ) : fallbackRank ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30 flex items-center gap-1">
                    <Shield size={11} />
                    احتياطي #{fallbackRank}
                  </span>
                ) : null}
              </div>

              {provider.base_url && (
                <p className="text-[11px] text-muted-foreground font-mono mt-0.5 truncate max-w-xs">
                  {provider.base_url}
                </p>
              )}
            </div>
          </div>

          {/* Delete Provider Button (Forbidden for primary) */}
          {!provider.is_primary && onDelete && (
            <button
              type="button"
              onClick={() => {
                if (confirm(`هل أنت متأكد من حذف المزود "${provider.name}"؟`)) {
                  onDelete(provider.id);
                }
              }}
              title="حذف المزود"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>

        {/* ── Status Indicator & Latency Bar ── */}
        <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-card/60 border border-border/70 mb-3.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground">حالة المزود:</span>
            {provider.status === "ok" ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={13} />
                متصل وجاهز
              </span>
            ) : provider.status === "error" ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400 truncate max-w-[200px]" title={provider.last_error || "خطأ"}>
                <AlertCircle size={13} />
                {provider.last_error || "خطأ في الاتصال"}
              </span>
            ) : (
              <span className="text-[11px] text-muted-foreground font-medium">لم يتم الفحص بعد ⏳</span>
            )}
          </div>

          {provider.last_ping_ms !== null && provider.last_ping_ms !== undefined && (
            <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              {provider.last_ping_ms} ms
            </span>
          )}
        </div>

        {/* ── API Key Input (Masked per Section 3.1 & 7) ── */}
        <div className="space-y-1.5 mb-3.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground flex items-center gap-1">
              <Key size={13} className="text-muted-foreground" />
              <span>مفتاح الـ API (مشفر بواسطة AES-256):</span>
            </label>
            <a
              href={brand.docUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
            >
              <span>{brand.docText}</span>
              <ExternalLink size={10} />
            </a>
          </div>

          <div className="relative flex items-center">
            <input
              type={showKey ? "text" : "password"}
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder={provider.key_masked || "أدخل مفتاح الـ API الجديد..."}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-foreground font-mono"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute left-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground">
            المفتاح الحالي: <span className="font-mono font-bold">{provider.key_masked || "••••••••"}</span> (لا يعود للمتصفح أبداً بعد الحفظ)
          </p>
        </div>

        {/* ── Model Selector (Dynamic from GET /{id}/models) ── */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground flex items-center gap-1">
              <Cpu size={13} className="text-muted-foreground" />
              <span>النموذج المعتمد (Model):</span>
            </label>
            {loadingModels && (
              <span className="text-[10px] text-muted-foreground animate-pulse">جاري جلب النماذج...</span>
            )}
          </div>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-foreground font-mono"
          >
            {availableModels.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} {m.badge ? `(${m.badge})` : ""}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-muted-foreground px-1">
            {availableModels.find((m) => m.id === selectedModel)?.description_ar || "النموذج المعتمد لتوليد وتحليل البيانات"}
          </p>
        </div>

        {/* ── Multi-Stage Ping Results Checklist (Technical Spec v1.0 Section 4.2) ── */}
        {pingResult && (
          <div
            className={`p-3 rounded-xl mb-3 text-xs border ${
              pingResult.status === "ok"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                : "bg-red-500/10 border-red-500/30 text-red-900 dark:text-red-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold">{pingResult.message_ar}</span>
              <span className="font-mono text-[10px]">{pingResult.latency_ms} ms</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1 border-t border-border/40">
              <div className="flex items-center gap-1">
                {pingResult.checks.auth === "ok" ? (
                  <Check size={12} className="text-emerald-600" />
                ) : (
                  <X size={12} className="text-red-600" />
                )}
                <span>المصادقة والاعتماد</span>
              </div>

              <div className="flex items-center gap-1">
                {pingResult.checks.model_available === "ok" ? (
                  <Check size={12} className="text-emerald-600" />
                ) : (
                  <X size={12} className="text-red-600" />
                )}
                <span>توفر النموذج المطلوب</span>
              </div>

              <div className="flex items-center gap-1">
                {pingResult.checks.json_output === "ok" ? (
                  <Check size={12} className="text-emerald-600" />
                ) : (
                  <X size={12} className="text-red-600" />
                )}
                <span>مخرجات JSON المنظمة</span>
              </div>

              <div className="flex items-center gap-1">
                {pingResult.checks.arabic_sample === "ok" ? (
                  <Check size={12} className="text-emerald-600" />
                ) : (
                  <X size={12} className="text-red-600" />
                )}
                <span>سلامة العينة العربية</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Actions Footer (Technical Spec v1.0 Section 8) ── */}
      <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Test Ping Button */}
          <button
            type="button"
            onClick={handlePing}
            disabled={isTesting}
            className="px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-foreground transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
          >
            <RefreshCw
              size={13}
              className={isTesting ? "animate-spin text-emerald-600" : ""}
            />
            <span>فحص الاتصال (Ping)</span>
          </button>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            {isSaving ? "جاري الحفظ..." : "حفظ الإعدادات"}
          </button>
        </div>

        {/* Set as Primary Switch */}
        <div className="flex items-center gap-1.5">
          {!provider.is_primary ? (
            <button
              type="button"
              onClick={handleSwitchPrimary}
              disabled={!isPingSuccess || isSwitching}
              title={!isPingSuccess ? "يتطلب نجاح فحص الاتصال (Ping) أولاً" : "تعيين كمحرك أساسي للمنظومة"}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
                isPingSuccess
                  ? "border border-amber-500/50 bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-200 shadow-xs"
                  : "border border-border bg-muted/50 text-muted-foreground opacity-50 cursor-not-allowed"
              }`}
            >
              <Zap size={12} className={isPingSuccess ? "text-amber-500" : ""} />
              <span>{isSwitching ? "جاري التعيين..." : "تعيين كمحرك أساسي"}</span>
            </button>
          ) : (
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-xl">
              <CheckCircle2 size={13} />
              المحرك النشط حالياً
            </span>
          )}

          {/* Fallback Rank Ordering Arrows */}
          {!provider.is_primary && onMoveFallback && (
            <div className="flex items-center border border-border rounded-lg overflow-hidden bg-card">
              <button
                type="button"
                onClick={() => onMoveFallback(provider.id, "up")}
                title="رفع ترتيب الاحتياطي"
                className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <ArrowUp size={12} />
              </button>
              <button
                type="button"
                onClick={() => onMoveFallback(provider.id, "down")}
                title="خفض ترتيب الاحتياطي"
                className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground border-r border-border cursor-pointer"
              >
                <ArrowDown size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
