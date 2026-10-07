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
} from "lucide-react";
import { ProviderCard } from "./ProviderCard";
import type {
  AIProviderRecord,
  PingResult,
  AIProviderKind,
  AIRoutingRule,
} from "@/server/ai/providers/types";

export function AdminAIProvidersManager() {
  const [providers, setProviders] = useState<AIProviderRecord[]>([]);
  const [routingRules, setRoutingRules] = useState<AIRoutingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // New Provider Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newKind, setNewKind] = useState<AIProviderKind>("huggingface");
  const [newName, setNewName] = useState("");
  const [newBaseUrl, setNewBaseUrl] = useState("https://router.huggingface.co/v1");
  const [newModel, setNewModel] = useState("Qwen/Qwen2.5-72B-Instruct");
  const [newApiKey, setNewApiKey] = useState("");
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);

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
    updates: { api_key?: string; model?: string; name?: string; base_url?: string; enabled?: boolean }
  ) => {
    setErrorNotice(null);
    const res = await fetch(`/api/v1/admin/ai-providers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (data.success) {
      setNotice("تم حفظ إعدادات المزود بنجاح في قاعدة البيانات المشفرة ✅");
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

  const handleCreateNewProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newModel.trim()) {
      setErrorNotice("يرجى ملء جميع الحقول الإلزامية");
      return;
    }

    setIsSubmittingNew(true);
    setErrorNotice(null);
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

  const handleKindChange = (kind: AIProviderKind) => {
    setNewKind(kind);
    switch (kind) {
      case "huggingface":
        setNewName("Hugging Face (Open Source)");
        setNewBaseUrl("https://router.huggingface.co/v1");
        setNewModel("Qwen/Qwen2.5-72B-Instruct");
        break;
      case "anthropic":
        setNewName("Anthropic Claude 3.7");
        setNewBaseUrl("https://api.anthropic.com/v1");
        setNewModel("claude-3-7-sonnet-20250219");
        break;
      case "gemini":
        setNewName("Google Gemini Pro");
        setNewBaseUrl("https://generativelanguage.googleapis.com");
        setNewModel("gemini-2.5-pro");
        break;
      case "openai_compatible":
        setNewName("OpenAI GPT / Custom Endpoint");
        setNewBaseUrl("https://api.openai.com/v1");
        setNewModel("gpt-4o-mini");
        break;
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
              الإصدار الموحد 1.0 ⚡
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            الطبقة الموحدة لإدارة المفاتيح المشفرة (AES-256-GCM)، فحص الاتصال متعدد المراحل، تعيين المحرك الأساسي، والتنقل الآلي للاحتياطي (Failover Engine).
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
              handleKindChange("huggingface");
              setIsAddModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
          >
            <Plus size={15} />
            <span>إضافة مزوّد جديد</span>
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
            <span className="text-[11px] font-bold text-muted-foreground">المحركات المتصلة بنجاح:</span>
            <h4 className="text-sm font-extrabold text-foreground">
              {okProvidersCount} من {providers.length} مزودين
            </h4>
            <p className="text-[10px] text-muted-foreground">
              تم التحقق منها عبر فحص Ping
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <Server size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-2xs">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground">تشفير المفاتيح والبيانات:</span>
            <h4 className="text-sm font-extrabold text-foreground flex items-center gap-1">
              <span>AES-256-GCM</span>
              <CheckCircle2 size={13} className="text-emerald-600" />
            </h4>
            <p className="text-[10px] text-muted-foreground">
              المفاتيح لا تعود للمتصفح نهائياً
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
            <Cpu size={20} />
          </div>
        </div>
      </div>

      {/* ── Providers Cards Grid ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span>مصفوفة المزودين المعتمدين</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted font-mono">
              {providers.length}
            </span>
          </h3>
          <span className="text-xs text-muted-foreground">
            المحرك الأساسي يتصدر القائمة يليه الاحتياطيون بالترتيب
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 rounded-2xl border border-border bg-card/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {providers.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                fallbackRank={provider.fallback_order}
                onUpdate={handleUpdate}
                onSwitchPrimary={handleSwitchPrimary}
                onPing={handlePing}
                onDelete={handleDelete}
                onMoveFallback={handleMoveFallback}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Skill Routing Rules Matrix (Technical Spec v1.0 Section 3.2 & 6.4) ── */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <GitBranch size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                توجيه المهارات الذكية (Skill Routing Rules)
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                تخصيص المزود الأنسب لكل مهارة بما يلائم قدراتها اللغوية والمنطقية والحسابية
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-xl">
            تجاوز المحرك الأساسي اختيارياً
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {[
            {
              skill: "section-writer",
              name_ar: "صياغة فصول ومباحث البحوث",
              desc: "تحتاج نصاً عربياً سلساً مطابقاً للمنهاج",
              defaultProvider: "pv_huggingface",
            },
            {
              skill: "quality-reviewer",
              name_ar: "مراجعة الجودة والمطابقة (Schemas)",
              desc: "تحتاج سرعة ودقة في إرجاع JSON",
              defaultProvider: "pv_gemini",
            },
            {
              skill: "math-science-solver",
              name_ar: "حل المسائل العلمية والرياضيات",
              desc: "تحتاج منطقاً استدلالياً فائق الدقة وأدوات",
              defaultProvider: "pv_anthropic",
            },
            {
              skill: "solution-drafter",
              name_ar: "إعداد الحلول النموذجية للامتحانات",
              desc: "تحتاج مطابقة تامة لسلم التنقيط الوزاري",
              defaultProvider: "pv_anthropic",
            },
            {
              skill: "web-researcher",
              name_ar: "البحث السحابي وقراءة المصادر",
              desc: "تحتاج محرك بحث حي ومعالجة سريعة",
              defaultProvider: "pv_gemini",
            },
          ].map((item) => {
            const currentRule = routingRules.find((r) => r.skill === item.skill);
            const selectedProviderId = currentRule?.provider_id || item.defaultProvider;

            return (
              <div
                key={item.skill}
                className="p-3.5 rounded-xl border border-border bg-muted/30 flex flex-col justify-between space-y-2.5"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-xs text-foreground">
                      {item.name_ar}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground bg-card px-1.5 py-0.5 rounded border border-border">
                      {item.skill}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/50">
                  <label className="text-[10px] font-bold text-muted-foreground block mb-1">
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

      {/* ── Modal: Add New AI Provider with SSRF Protection ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-right">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/40">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Plus size={16} />
                </div>
                <h3 className="text-sm font-bold text-foreground">
                  إضافة مزوّد ذكاء اصطناعي جديد
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateNewProvider} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  نوع المزود (Kind):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "huggingface" as AIProviderKind, label: "Hugging Face (Open Source)" },
                    { id: "anthropic" as AIProviderKind, label: "Anthropic Claude" },
                    { id: "openai_compatible" as AIProviderKind, label: "OpenAI Compatible / vLLM" },
                    { id: "gemini" as AIProviderKind, label: "Google Gemini" },
                  ].map((k) => (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => handleKindChange(k.id)}
                      className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                        newKind === k.id
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "bg-card border-border text-foreground hover:bg-muted"
                      }`}
                    >
                      {k.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  الاسم الظاهر في الشاشة:
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="مثال: Hugging Face (Qwen 72B)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  عنوان الـ API الأساسي (Base URL):
                </label>
                <input
                  type="url"
                  value={newBaseUrl}
                  onChange={(e) => setNewBaseUrl(e.target.value)}
                  placeholder="https://router.huggingface.co/v1"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 text-left"
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  حماية SSRF: يجب أن يبدأ بـ https://، وتُحظر عناوين الشبكات الداخلية والمحلية.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  النموذج المعتمد (Model Identifier):
                </label>
                <input
                  type="text"
                  required
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  placeholder="مثال: Qwen/Qwen2.5-72B-Instruct أو claude-3-7-sonnet"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 text-left"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  مفتاح الـ API (API Key):
                </label>
                <input
                  type="password"
                  value={newApiKey}
                  onChange={(e) => setNewApiKey(e.target.value)}
                  placeholder="أدخل مفتاح الـ API (يُشفّر تلقائياً عبر AES-256)..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {errorNotice && (
                <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs font-bold">
                  {errorNotice}
                </div>
              )}

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
                  {isSubmittingNew ? "جاري الإضافة والتشغيل..." : "إضافة المزود"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
