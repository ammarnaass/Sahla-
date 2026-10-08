"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  Cpu,
  ShieldCheck,
  Zap,
  RefreshCw,
  Crown,
  CheckCircle2,
  AlertTriangle,
  Plus,
  GitBranch,
  X,
  Info,
  Server,
  Activity,
  Settings2,
  Globe,
  Sliders,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  HardDrive,
  SlidersHorizontal,
} from "lucide-react";
import { ProviderCard } from "./ProviderCard";
import type {
  AIProviderRecord,
  PingResult,
  AIProviderKind,
  AIRoutingRule,
  AdvancedProviderConfig,
  Capabilities,
  AIModelDefinition,
} from "@/server/ai/providers/types";
import { AI_PROVIDER_PRESETS, getPresetById, type AIProviderPreset } from "@/server/ai/providers/presets";

export function AdminAIProvidersManager() {
  const [providers, setProviders] = useState<AIProviderRecord[]>([]);
  const [routingRules, setRoutingRules] = useState<AIRoutingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // New Provider Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("groq");
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("all");
  const [newKind, setNewKind] = useState<AIProviderKind>("openai_compatible");
  const [newName, setNewName] = useState("جروك كلاود (Groq LPU)");
  const [newBaseUrl, setNewBaseUrl] = useState("https://api.groq.com/openai/v1");
  const [newModel, setNewModel] = useState("llama-3.3-70b-versatile");
  const [newApiKey, setNewApiKey] = useState("");
  const [isCustomModelInput, setIsCustomModelInput] = useState(false);
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);

  // Advanced customization state for modal
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);
  const [newCustomHeaders, setNewCustomHeaders] = useState<Array<{ key: string; value: string }>>([]);
  const [modalHeaderKey, setModalHeaderKey] = useState("");
  const [modalHeaderValue, setModalHeaderValue] = useState("");
  const [newAdvancedConfig, setNewAdvancedConfig] = useState<AdvancedProviderConfig>({
    timeout_seconds: 30,
    temperature: 0.2,
  });
  const [newCapabilities, setNewCapabilities] = useState<Capabilities>({
    tool_use: true,
    json_mode: true,
    structured_output: "json_object",
    streaming: true,
    max_context: 128000,
    vision: false,
    languages_verified: ["ar", "fr", "en"],
    web_search: false,
    prompt_caching: false,
  });

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/ai-providers");
      const data = await res.json();
      if (data.success && data.providers) {
        setProviders(data.providers);
      }
    } catch (err) {
      console.error("[AdminAIProvidersManager] fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRouting = async () => {
    try {
      const res = await fetch("/api/v1/admin/ai-providers/routing");
      const data = await res.json();
      if (data.success && Array.isArray(data.rules)) {
        setRoutingRules(data.rules);
      }
    } catch {}
  };

  useEffect(() => {
    fetchProviders();
    fetchRouting();
  }, []);

  const handleUpdate = async (
    id: string,
    updates: {
      api_key?: string;
      model?: string;
      name?: string;
      base_url?: string;
      enabled?: boolean;
      preset_id?: string;
      custom_headers?: Record<string, string>;
      advanced_config?: AdvancedProviderConfig;
      custom_models?: AIModelDefinition[];
      capabilities?: Partial<Capabilities>;
    }
  ) => {
    setErrorNotice(null);
    const res = await fetch(`/api/v1/admin/ai-providers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (data.success) {
      setNotice("تم حفظ تخصيص المزود بنجاح في قاعدة البيانات المشفرة ✅");
      fetchProviders();
      setTimeout(() => setNotice(null), 4000);
    } else {
      setErrorNotice(data.error || "فشل حفظ الإعدادات");
      setTimeout(() => setErrorNotice(null), 5000);
      throw new Error(data.error);
    }
  };

  const handleSwitchPrimary = async (id: string) => {
    setErrorNotice(null);
    const res = await fetch(`/api/v1/admin/ai-providers/${id}/set-primary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data.success) {
      setNotice("تم تعيين المحرك كمحرك أساسي للذكاء الاصطناعي بنجاح 👑");
      fetchProviders();
      setTimeout(() => setNotice(null), 4000);
    } else {
      setErrorNotice(data.error || "فشل تعيين المحرك الأساسي");
      setTimeout(() => setErrorNotice(null), 6000);
    }
  };

  const handlePing = async (
    id: string,
    apiKey?: string,
    modelId?: string
  ): Promise<PingResult> => {
    const res = await fetch(`/api/v1/admin/ai-providers/${id}/ping`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey, model: modelId }),
    });
    const data = await res.json();
    fetchProviders();
    return data;
  };

  const handleDelete = async (id: string) => {
    setErrorNotice(null);
    const res = await fetch(`/api/v1/admin/ai-providers/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success) {
      setNotice("تم حذف المزود بنجاح 🗑️");
      fetchProviders();
      setTimeout(() => setNotice(null), 4000);
    } else {
      setErrorNotice(data.error || "فشل حذف المزود");
      setTimeout(() => setErrorNotice(null), 5000);
    }
  };

  const handleMoveFallback = async (id: string, direction: "up" | "down") => {
    const fallbackList = providers.filter((p) => !p.is_primary && p.fallback_order);
    fallbackList.sort((a, b) => (a.fallback_order || 0) - (b.fallback_order || 0));

    const currentIndex = fallbackList.findIndex((p) => p.id === id);
    if (currentIndex === -1) return;

    if (direction === "up" && currentIndex > 0) {
      const temp = fallbackList[currentIndex];
      fallbackList[currentIndex] = fallbackList[currentIndex - 1];
      fallbackList[currentIndex - 1] = temp;
    } else if (direction === "down" && currentIndex < fallbackList.length - 1) {
      const temp = fallbackList[currentIndex];
      fallbackList[currentIndex] = fallbackList[currentIndex + 1];
      fallbackList[currentIndex + 1] = temp;
    } else {
      return;
    }

    const newOrder = fallbackList.map((p) => p.id);
    const res = await fetch("/api/v1/admin/ai-providers/fallbacks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: newOrder }),
    });
    const data = await res.json();
    if (data.success) {
      setNotice("تم تحديث ترتيب المحركات الاحتياطية بنجاح 🔄");
      fetchProviders();
      setTimeout(() => setNotice(null), 4000);
    }
  };

  const selectPreset = (preset: AIProviderPreset) => {
    setSelectedPresetId(preset.id);
    setNewKind(preset.kind);
    setNewName(preset.name_ar);
    setNewBaseUrl(preset.default_base_url);
    setNewModel(preset.default_model);
    setIsCustomModelInput(false);

    // Apply headers from preset
    if (preset.default_headers) {
      setNewCustomHeaders(
        Object.entries(preset.default_headers).map(([k, v]) => ({ key: k, value: v }))
      );
    } else {
      setNewCustomHeaders([]);
    }

    // Apply recommended config
    setNewAdvancedConfig(preset.recommended_config || {});

    // Apply capabilities
    setNewCapabilities((prev) => ({
      ...prev,
      ...preset.default_capabilities,
    }));
  };

  const openAddModalWithPreset = (presetId: string) => {
    const p = getPresetById(presetId);
    if (p) selectPreset(p);
    setIsAddModalOpen(true);
  };

  const handleCreateNewProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newModel.trim()) {
      setErrorNotice("يرجى ملء جميع الحقول الإلزامية");
      return;
    }

    setIsSubmittingNew(true);
    setErrorNotice(null);

    const headersObj: Record<string, string> = {};
    newCustomHeaders.forEach((h) => {
      if (h.key.trim() && h.value.trim()) {
        headersObj[h.key.trim()] = h.value.trim();
      }
    });

    try {
      const res = await fetch("/api/v1/admin/ai-providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: newKind,
          name: newName.trim(),
          base_url: newBaseUrl.trim() || undefined,
          model: newModel.trim(),
          api_key: newApiKey.trim() || undefined,
          preset_id: selectedPresetId,
          custom_headers: headersObj,
          advanced_config: newAdvancedConfig,
          capabilities: newCapabilities,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setNotice(`تمت إضافة المزود "${newName}" بنجاح ✨`);
        setIsAddModalOpen(false);
        setNewName("");
        setNewApiKey("");
        fetchProviders();
        setTimeout(() => setNotice(null), 4000);
      } else {
        setErrorNotice(data.error || "فشل إضافة المزود");
      }
    } catch (err: any) {
      setErrorNotice(err.message || "حدث خطأ غير متوقع");
    } finally {
      setIsSubmittingNew(false);
    }
  };

  const handleUpdateRouting = async (skill: string, provider_id: string) => {
    const res = await fetch("/api/v1/admin/ai-providers/routing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skill, provider_id }),
    });
    const data = await res.json();
    if (data.success) {
      setRoutingRules(data.rules);
      setNotice("تم تحديث قاعدة توجيه المهارة بنجاح 🎯");
      setTimeout(() => setNotice(null), 3000);
    }
  };

  const primaryProvider = providers.find((p) => p.is_primary) || providers[0];
  const okProvidersCount = providers.filter((p) => p.status === "ok").length;
  const currentActivePreset = getPresetById(selectedPresetId);

  const filteredPresets = AI_PROVIDER_PRESETS.filter((p) => {
    if (activeCategoryTab === "all") return true;
    return p.category === activeCategoryTab;
  });

  return (
    <div className="space-y-6" dir="rtl">
      {/* ── Top Header & Global Actions ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-foreground font-display">
              إدارة مزودي الذكاء الاصطناعي (AI Gateway)
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
              الإصدار 2.0 المخصص ⚡
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            بوابة متكاملة تدعم المصادر السحابية فائقة السرعة (Groq LPU)، البوابات المجمعة (OpenRouter)، النماذج المحلية دون إنترنت (Ollama On-Premise)، والتخصيص المتقدم للترويسات وميزانية التفكير.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={fetchProviders}
            disabled={loading}
            className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="تحديث البيانات"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>

          <button
            type="button"
            onClick={() => {
              const p = getPresetById("groq");
              if (p) selectPreset(p);
              setIsAddModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
          >
            <Plus size={15} />
            <span>إضافة مزوّد من الكتالوج</span>
          </button>
        </div>
      </div>

      {/* ── Notices / Alerts ── */}
      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {errorNotice && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-800 dark:text-red-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <AlertTriangle size={16} className="text-red-600" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* ── KPI & Health Ribbon ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-2xs">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground">المحرك الأساسي النشط:</span>
            <h4 className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
              <Crown size={14} className="text-amber-500" />
              <span>{primaryProvider?.name || "Google Gemini"}</span>
            </h4>
            <p className="text-[10px] font-mono text-muted-foreground truncate max-w-[150px]">
              {primaryProvider?.model}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Zap size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-2xs">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground">حالة الفشل الآمن (Failover):</span>
            <h4 className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck size={15} />
              <span>جاهز وتلقائي</span>
            </h4>
            <p className="text-[10px] text-muted-foreground">
              تبديل فوري عند انقطاع الأساسي
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <Activity size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-2xs">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground">المزودات المتصلة:</span>
            <h4 className="text-sm font-extrabold text-foreground">
              {okProvidersCount} من أصل {providers.length}
            </h4>
            <p className="text-[10px] text-muted-foreground">فحوصات Ping ناجحة وموثقة</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <Layers size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-2xs">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground">التشفير والأمان:</span>
            <h4 className="text-sm font-extrabold text-foreground flex items-center gap-1">
              <span>AES-256-GCM</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 font-mono">
                مشفر
              </span>
            </h4>
            <p className="text-[10px] text-muted-foreground">حماية SSRF مدمجة للخوادم</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
            <Server size={20} />
          </div>
        </div>
      </div>

      {/* ── Quick-Add External Sources & Presets Showcase Banner ── */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/5 via-primary/10 to-transparent border border-primary/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Globe size={15} className="text-primary" />
              <span>كتالوج المصادر الخارجية والمحلية المدعومة (Quick-Add External Sources):</span>
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              اضغط على أي مزود لإضافته فوراً مع كافة إعداداته القياسية وموديلاته الموصى بها:
            </p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 self-start md:self-auto">
            11 مزود مسبق الإعداد ⚡
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {AI_PROVIDER_PRESETS.map((pr) => (
            <button
              key={pr.id}
              type="button"
              onClick={() => openAddModalWithPreset(pr.id)}
              className="px-2.5 py-1.5 rounded-xl border border-border bg-card hover:bg-primary/10 hover:border-primary/40 text-xs font-bold text-foreground transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95 group"
            >
              <span>{pr.icon}</span>
              <span>{pr.name}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-muted group-hover:bg-primary/20 text-muted-foreground group-hover:text-primary">
                {pr.badge_ar}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Active Providers List ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
            <span>المحركات المهيأة في المنظومة</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {providers.length}
            </span>
          </h3>
          <span className="text-[11px] text-muted-foreground">
            المحركات الاحتياطية تعمل تلقائياً بترتيب الأولوية عند تعثر الأساسي
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {providers.map((p) => {
            let fallbackRank: number | null = null;
            if (!p.is_primary && p.fallback_order) {
              const activeFallbacks = providers
                .filter((item) => !item.is_primary && item.fallback_order)
                .sort((a, b) => (a.fallback_order || 0) - (b.fallback_order || 0));
              const idx = activeFallbacks.findIndex((item) => item.id === p.id);
              fallbackRank = idx !== -1 ? idx + 1 : p.fallback_order;
            }

            return (
              <ProviderCard
                key={p.id}
                provider={p}
                fallbackRank={fallbackRank}
                onUpdate={handleUpdate}
                onSwitchPrimary={handleSwitchPrimary}
                onPing={handlePing}
                onDelete={handleDelete}
                onMoveFallback={handleMoveFallback}
              />
            );
          })}
        </div>
      </div>

      {/* ── Skill Routing Configuration Table ── */}
      <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <GitBranch size={16} className="text-primary" />
            <span>قواعد التوجيه الذكي للمهام (Skill Routing Rules)</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            توجيه كل مهارة متخصصة داخل المنصة إلى المحرك الأنسب لطبيعتها (مثال: المسائل العلمية لـ Claude، الكتابة لـ Gemini، الصياغة العامة لـ Groq/DeepSeek).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { skill: "section-writer", label: "صياغة الأقسام والمقالات", desc: "يتطلب توليد نصوص غنية ودقة عربية" },
            { skill: "quality-reviewer", label: "مراجعة الجودة والتدقيق", desc: "يتطلب تقييم JSON دقيق" },
            { skill: "math-science-solver", label: "حل المسائل العلمية والرياضية", desc: "يتطلب استدلال هجين وتفكير منطقي" },
            { skill: "solution-drafter", label: "مسودات الحلول والامتحانات", desc: "يتطلب صياغة منظمة" },
            { skill: "web-researcher", label: "البحث الحي عبر الويب", desc: "يتطلب قدرات البحث المباشر" },
          ].map((item) => {
            const rule = routingRules.find((r) => r.skill === item.skill);
            const selectedProviderId = rule?.provider_id || primaryProvider?.id;

            return (
              <div
                key={item.skill}
                className="p-3.5 rounded-xl border border-border bg-background flex flex-col justify-between gap-3 shadow-2xs"
              >
                <div>
                  <h4 className="text-xs font-bold text-foreground">{item.label}</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
                </div>

                <div className="pt-2 border-t border-border/60">
                  <label className="block text-[10px] font-bold text-muted-foreground mb-1">
                    المزود المفضل لهذه المهارة:
                  </label>
                  <select
                    value={selectedProviderId}
                    onChange={(e) => handleUpdateRouting(item.skill, e.target.value)}
                    className="w-full text-xs font-bold py-1.5 px-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {providers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.is_primary ? "(الأساسي)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Modal: Add New AI Provider with Rich Presets & Customization ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-right my-8 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/40 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {currentActivePreset?.icon || "✨"}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    إضافة مزوّد ذكاء اصطناعي ومصادر خارجية
                  </h3>
                  <p className="text-[10px] text-muted-foreground">
                    اختر قالباً جاهزاً أو قم بتخصيص خادمك المحلي / السحابي بالكامل
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateNewProvider} className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* Category Filter Tabs */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  اختر مصدر المزود أو القالب الجاهز:
                </label>
                <div className="flex flex-wrap gap-1 mb-2.5">
                  {[
                    { id: "all", label: "الكل" },
                    { id: "cloud_fast", label: "⚡ فائق السرعة (LPU)" },
                    { id: "cloud_aggregator", label: "🌐 بوابات مجمعة" },
                    { id: "cloud_frontier", label: "💎 محركات رائدة" },
                    { id: "local_onprem", label: "🦙 محلي (On-Premise)" },
                    { id: "custom", label: "🛠️ مخصص" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveCategoryTab(tab.id)}
                      className={`px-2.5 py-1 text-[11px] rounded-lg font-bold transition-all cursor-pointer ${
                        activeCategoryTab === tab.id
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Preset Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 border border-border/60 rounded-xl bg-muted/20">
                  {filteredPresets.map((pr) => {
                    const isSelected = selectedPresetId === pr.id;
                    return (
                      <button
                        key={pr.id}
                        type="button"
                        onClick={() => selectPreset(pr)}
                        className={`p-2.5 rounded-xl text-right transition-all border cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "bg-primary/10 border-primary shadow-xs ring-1 ring-primary/40"
                            : "bg-card border-border hover:bg-muted/60"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-base">{pr.icon}</span>
                          <span className="text-xs font-bold text-foreground truncate">{pr.name}</span>
                        </div>
                        <span className="text-[9px] text-muted-foreground line-clamp-1">{pr.badge_ar}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preset Description & Doc link if available */}
              {currentActivePreset && (
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <h5 className="font-bold text-foreground flex items-center gap-1.5">
                      <span>{currentActivePreset.icon}</span>
                      <span>{currentActivePreset.name_ar}</span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-primary/10 text-primary font-bold">
                        {currentActivePreset.badge_ar}
                      </span>
                    </h5>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {currentActivePreset.description_ar}
                    </p>
                  </div>
                  {currentActivePreset.key_docs_url && (
                    <a
                      href={currentActivePreset.key_docs_url}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 text-[10px] font-bold text-primary hover:underline flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg"
                    >
                      <span>{currentActivePreset.key_docs_label_ar || "رابط المفتاح"}</span>
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              )}

              {/* Provider Name */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  الاسم الظاهر في المنصة:
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="مثال: Groq Llama 3.3 أو Ollama Local"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* Base URL */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  عنوان الـ API الأساسي (Base URL):
                </label>
                <input
                  type="text"
                  required
                  value={newBaseUrl}
                  onChange={(e) => setNewBaseUrl(e.target.value)}
                  placeholder="https://api.groq.com/openai/v1 أو http://localhost:11434/v1"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 text-left"
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  {newAdvancedConfig.allow_local || selectedPresetId === "ollama" || selectedPresetId === "vllm"
                    ? "الخادم المحلي مفعل: يُسمح بروابط localhost و الشبكة المحلية LAN."
                    : "حماية SSRF: يجب أن يبدأ بـ https://، وتُحظر عناوين الشبكات الداخلية والمحلية للسحابة."}
                </p>
              </div>

              {/* Model Identifier */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-foreground">
                    النموذج المعتمد (Model Identifier):
                  </label>
                  {currentActivePreset && currentActivePreset.available_models.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsCustomModelInput(!isCustomModelInput)}
                      className="text-[11px] text-primary hover:underline cursor-pointer"
                    >
                      {isCustomModelInput ? "اختر من النماذج المقترحة" : "إدخال نموذج يدوي مخصص..."}
                    </button>
                  )}
                </div>

                {!isCustomModelInput && currentActivePreset && currentActivePreset.available_models.length > 0 ? (
                  <select
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    {currentActivePreset.available_models.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} {m.badge ? `(${m.badge})` : ""} - {m.description_ar}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    placeholder="مثال: llama-3.3-70b-versatile أو qwen2.5:72b"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 text-left"
                  />
                )}
              </div>

              {/* API Key */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  مفتاح الـ API (API Key):
                </label>
                <input
                  type="password"
                  value={newApiKey}
                  onChange={(e) => setNewApiKey(e.target.value)}
                  placeholder={
                    currentActivePreset?.key_placeholder_ar ||
                    "أدخل مفتاح الـ API (يُشفّر تلقائياً عبر AES-256)..."
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                {!currentActivePreset?.key_required && (
                  <p className="text-[10px] text-emerald-600 font-bold mt-1">
                    ℹ️ هذا المزود محلي أو لا يتطلب مفتاح API إلزامي (يمكنك تركه فارغاً).
                  </p>
                )}
              </div>

              {/* ── Expandable: Advanced Customization In Modal ── */}
              <div className="border border-border/80 rounded-xl bg-card/60 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsAdvancedModalOpen(!isAdvancedModalOpen)}
                  className="w-full p-3 flex items-center justify-between text-xs font-bold text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 text-primary">
                    <SlidersHorizontal size={14} />
                    <span>خيارات التخصيص المتقدمة والترويسات (Advanced Customization)</span>
                  </div>
                  {isAdvancedModalOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {isAdvancedModalOpen && (
                  <div className="p-3.5 space-y-3.5 border-t border-border/60 text-xs animate-fade-in bg-background/50">
                    {/* Allow Local / On-premise toggle */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border">
                      <div>
                        <span className="font-bold text-foreground block">
                          السماح بالخوادم المحلية (Localhost / LAN):
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          تجاوز حظر SSRF للسماح بخوادم Ollama و vLLM المحلية على الشبكة الداخلية
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setNewAdvancedConfig((prev) => ({
                            ...prev,
                            allow_local: !prev.allow_local,
                          }))
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          newAdvancedConfig.allow_local
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-muted border border-border text-muted-foreground"
                        }`}
                      >
                        {newAdvancedConfig.allow_local ? "مسموح ✅" : "محظور"}
                      </button>
                    </div>

                    {/* Thinking Budget Slider for Gemini or reasoning */}
                    {newKind === "gemini" && (
                      <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-900 dark:text-blue-200">
                            ميزانية التفكير العميق (Thinking Budget):
                          </span>
                          <span className="font-mono font-bold text-blue-700 dark:text-blue-300">
                            {newAdvancedConfig.thinking_budget ?? 2048} tokens
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="8192"
                          step="512"
                          value={newAdvancedConfig.thinking_budget ?? 2048}
                          onChange={(e) =>
                            setNewAdvancedConfig((prev) => ({
                              ...prev,
                              thinking_budget: parseInt(e.target.value),
                            }))
                          }
                          className="w-full cursor-pointer accent-blue-600"
                        />
                      </div>
                    )}

                    {/* Google Search Grounding for Gemini */}
                    {newKind === "gemini" && (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border">
                        <div>
                          <span className="font-bold text-foreground block">
                            البحث الحي عبر جوجل (Google Search Grounding)
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            ربط الإجابات بأحدث نتائج محرك بحث جوجل لحظياً
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setNewAdvancedConfig((prev) => ({
                              ...prev,
                              enable_search_grounding: !prev.enable_search_grounding,
                            }))
                          }
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            newAdvancedConfig.enable_search_grounding
                              ? "bg-blue-600 text-white shadow-xs"
                              : "bg-muted border border-border text-muted-foreground"
                          }`}
                        >
                          {newAdvancedConfig.enable_search_grounding ? "مفعل ✅" : "معطل"}
                        </button>
                      </div>
                    )}

                    {/* Request Timeout */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border">
                      <div>
                        <span className="font-bold text-foreground block">مهلة الطلب (Timeout):</span>
                        <span className="text-[10px] text-muted-foreground">بالثواني</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="10"
                          max="180"
                          value={newAdvancedConfig.timeout_seconds ?? 45}
                          onChange={(e) =>
                            setNewAdvancedConfig((prev) => ({
                              ...prev,
                              timeout_seconds: parseInt(e.target.value) || 45,
                            }))
                          }
                          className="w-16 px-2 py-1 text-center font-mono rounded border border-border bg-background text-foreground"
                        />
                        <span className="text-[11px] text-muted-foreground font-bold">ثانية</span>
                      </div>
                    </div>

                    {/* Custom Headers */}
                    <div className="space-y-2">
                      <span className="font-bold text-foreground block">
                        ترويسات HTTP الإضافية (Custom Headers):
                      </span>
                      {newCustomHeaders.length > 0 && (
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                          {newCustomHeaders.map((h, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-1.5 rounded-lg bg-card border border-border text-[11px] font-mono"
                            >
                              <span className="font-bold text-primary">{h.key}:</span>
                              <span className="text-muted-foreground truncate max-w-[150px]">{h.value}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  setNewCustomHeaders((prev) => prev.filter((_, idx) => idx !== i))
                                }
                                className="text-red-500 hover:text-red-700 cursor-pointer"
                              >
                                <X size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={modalHeaderKey}
                          onChange={(e) => setModalHeaderKey(e.target.value)}
                          placeholder="Key (e.g. HTTP-Referer)"
                          className="w-1/2 px-2.5 py-1 text-[11px] rounded-lg border border-border bg-background text-foreground font-mono text-left"
                        />
                        <input
                          type="text"
                          value={modalHeaderValue}
                          onChange={(e) => setModalHeaderValue(e.target.value)}
                          placeholder="Value"
                          className="w-1/2 px-2.5 py-1 text-[11px] rounded-lg border border-border bg-background text-foreground font-mono text-left"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!modalHeaderKey.trim()) return;
                            setNewCustomHeaders((prev) => [
                              ...prev,
                              { key: modalHeaderKey.trim(), value: modalHeaderValue.trim() },
                            ]);
                            setModalHeaderKey("");
                            setModalHeaderValue("");
                          }}
                          className="p-1 rounded-lg bg-primary text-primary-foreground cursor-pointer"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {errorNotice && (
                <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs font-bold">
                  {errorNotice}
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-foreground cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNew}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingNew ? "جاري الإضافة والتشغيل..." : "إضافة المزود المخصص"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
