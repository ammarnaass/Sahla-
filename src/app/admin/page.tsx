"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShopRecord } from "@/server/repositories/shopRepository";
import { InvoiceRecord } from "@/server/repositories/invoiceRepository";

interface AdminOverviewData {
  success: boolean;
  stats: {
    totalShops: number;
    activeShops: number;
    totalPointsInCirculation: number;
    nationalDocumentsCount: number;
    estimatedRevenueDZD: number;
    activeSubscriptionsCount: number;
    mrrDZD: number;
    arrDZD: number;
    invoicesCount: number;
    paidInvoicesDZD: number;
    pendingInvoicesDZD: number;
  };
  saasMetrics?: {
    mrrDZD: number;
    arrDZD: number;
    totalSubscribers: number;
    planBreakdown: Record<string, number>;
  };
  shops: ShopRecord[];
}

interface AnalyticsReport {
  wilayasDistribution: {
    wilayaCode: number;
    wilayaName: string;
    shopsCount: number;
    activeShopsCount: number;
    totalPoints: number;
    percentage: number;
  }[];
  planBreakdown: {
    planId: string;
    planNameAr: string;
    count: number;
    monthlyPriceDZD: number;
    totalRevenueDZD: number;
  }[];
  activityBreakdown: Record<string, number>;
}

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState<"analytics" | "invoices" | "shops" | "wholesale" | "admins">("analytics");
  const [data, setData] = useState<AdminOverviewData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsReport | null>(null);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [adminsList, setAdminsList] = useState<any[]>([]);
  const [invoiceFilter, setInvoiceFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // New Admin Form State
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  // Invoice Modal & Print States
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);

  // New Invoice Form State
  const [newInvShopId, setNewInvShopId] = useState("");
  const [newInvDesc, setNewInvDesc] = useState("اشتراك شهري في باقة المكتبة الاحترافية PRO KIOSK");
  const [newInvPrice, setNewInvPrice] = useState(2500);
  const [newInvQty, setNewInvQty] = useState(1);
  const [newInvMethod, setNewInvMethod] = useState<"EDAHABIA_CIB" | "BARIDIMOB" | "CASH_WHOLESALE" | "BANK_TRANSFER">("EDAHABIA_CIB");
  const [creatingInvoice, setCreatingInvoice] = useState(false);

  // Batch Card Generation state
  const [genPoints, setGenPoints] = useState(100);
  const [genCount, setGenCount] = useState(20);
  const [genPrice, setGenPrice] = useState(1000);
  const [generating, setGenerating] = useState(false);
  const [lastBatch, setLastBatch] = useState<any>(null);

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/admin/admins");
      const json = await res.json();
      if (json.success) setAdminsList(json.admins);
    } catch {
      // Silent
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName.trim() || !adminEmail.trim() || !adminPassword) {
      setActionNotice("يرجى ملء جميع الحقول المطلوبة لإنشاء حساب المدير.");
      return;
    }
    setCreatingAdmin(true);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: adminName.trim(),
          email: adminEmail.trim(),
          password: adminPassword,
          phone: adminPhone.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setActionNotice("✓ تم إنشاء وتفعيل حساب مدير النظام بنجاح 🛡️!");
        setAdminName("");
        setAdminEmail("");
        setAdminPassword("");
        setAdminPhone("");
        fetchAdmins();
      } else {
        setActionNotice(json.error || "فشل إنشاء حساب المدير");
      }
    } catch {
      setActionNotice("حدث خطأ في الاتصال بالخادم.");
    } finally {
      setCreatingAdmin(false);
    }
  };

  const fetchData = async () => {
    try {
      const [resOverview, resAnalytics, resInvoices] = await Promise.all([
        fetch("/api/admin/overview"),
        fetch("/api/admin/analytics"),
        fetch("/api/admin/invoices"),
      ]);

      const jsonOverview = await resOverview.json();
      if (jsonOverview.success) {
        setData(jsonOverview);
        if (jsonOverview.shops?.length > 0 && !newInvShopId) {
          setNewInvShopId(jsonOverview.shops[0].id);
        }
      }

      const jsonAnalytics = await resAnalytics.json();
      if (jsonAnalytics.success) {
        setAnalytics(jsonAnalytics.analytics);
      }

      const jsonInvoices = await resInvoices.json();
      if (jsonInvoices.success) {
        setInvoices(jsonInvoices.invoices);
      }

      await fetchAdmins();
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTopup = async (shopId: string, points: number) => {
    try {
      const res = await fetch("/api/admin/shops/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopId, points }),
      });
      const resData = await res.json();
      if (resData.success) {
        setActionNotice(`✓ تم شحن ${points} نقطة بنجاح للمحل.`);
        fetchData();
      }
    } catch {
      setActionNotice("فشل شحن الرصيد للمحل.");
    }
  };

  const handleToggle = async (shopId: string) => {
    try {
      const res = await fetch("/api/admin/shops/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopId }),
      });
      const resData = await res.json();
      if (resData.success) {
        setActionNotice("✓ تم تغيير حالة المحل بنجاح.");
        fetchData();
      }
    } catch {
      setActionNotice("فشل تغيير حالة المحل.");
    }
  };

  const handleToggleInvoiceStatus = async (invoiceId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "PAID" ? "PENDING" : "PAID";
    try {
      const res = await fetch(`/api/admin/invoices/${invoiceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const resData = await res.json();
      if (resData.success) {
        setActionNotice(`✓ تم تحديث حالة الفاتورة (${invoiceId}) إلى ${nextStatus === "PAID" ? "مدفوعة" : "قيد الانتظار"}.`);
        fetchData();
        if (selectedInvoice && selectedInvoice.id === invoiceId) {
          setSelectedInvoice(resData.invoice);
        }
      }
    } catch {
      setActionNotice("فشل تحديث حالة الفاتورة.");
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvShopId) return;
    setCreatingInvoice(true);

    const targetShop = data?.shops.find((s) => s.id === newInvShopId);

    try {
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId: newInvShopId,
          shopName: targetShop?.name || "محل تجاري",
          ownerName: targetShop?.owner || "المسير",
          wilaya: targetShop?.wilaya || "16 - الجزائر",
          wilayaCode: targetShop?.wilayaCode || 16,
          paymentMethod: newInvMethod,
          items: [
            {
              description: newInvDesc,
              quantity: Number(newInvQty),
              unitPriceDZD: Number(newInvPrice),
              totalDZD: Number(newInvQty) * Number(newInvPrice),
            },
          ],
        }),
      });

      const json = await res.json();
      if (json.success) {
        setActionNotice(`✓ تم إنشاء الفاتورة الرسمية بنجاح برقم (${json.invoice.invoiceNumber})!`);
        setShowCreateInvoiceModal(false);
        fetchData();
      }
    } catch {
      setActionNotice("تعذر إصدار الفاتورة حالياً.");
    } finally {
      setCreatingInvoice(false);
    }
  };

  const handleGenerateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setActionNotice(null);
    try {
      const res = await fetch("/api/cards/wholesale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          points: genPoints,
          count: genCount,
          priceDZD: genPrice,
        }),
      });
      const batchData = await res.json();
      if (batchData.success) {
        setLastBatch(batchData.batch);
        setActionNotice(`✓ تم توليد دفعة بطاقات جديدة بنجاح (${batchData.batch.batchNumber})! جاهزة للطباعة والقص.`);
      }
    } catch {
      setActionNotice("فشل توليد دفعة البطاقات.");
    } finally {
      setGenerating(false);
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (invoiceFilter === "ALL") return true;
    return inv.status === invoiceFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80 px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-slate-950 font-black text-lg">
              👑
            </div>
            <div>
              <span className="font-black text-sm sm:text-base text-white">لوحة تحكم SaaS المركزية</span>
              <span className="block text-[10px] text-amber-400 font-bold">إحصائيات المنصة ونظام الفوترة الوطني 🇩🇿</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition border border-slate-700"
          >
            كاونتر المحل ➔
          </Link>
          <Link
            href="/pricing"
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-md"
          >
            الخطط والأسعار
          </Link>
        </div>
      </header>

      {/* Main Cockpit */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Banner Alert */}
        {actionNotice && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-xs sm:text-sm text-emerald-300 font-bold animate-in fade-in">
            <span>{actionNotice}</span>
            <button onClick={() => setActionNotice(null)} className="text-slate-400 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "analytics"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>📊</span>
            <span>التحليلات والمؤشرات الوطنية</span>
          </button>

          <button
            onClick={() => setActiveTab("invoices")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "invoices"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>🧾</span>
            <span>نظام الفواتير السحابية B2B</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-emerald-400 text-[10px]">
              {invoices.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("shops")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "shops"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>🏪</span>
            <span>إدارة المحلات والمشتركين</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-emerald-400 text-[10px]">
              {data?.shops.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("wholesale")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "wholesale"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>🎟️</span>
            <span>كروت الشحن بالجملة للطباعة</span>
          </button>

          <button
            onClick={() => setActiveTab("admins")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "admins"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>🛡️</span>
            <span>مسؤولو النظام (Admins)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-emerald-400 text-[10px]">
              {adminsList.length}
            </span>
          </button>
        </div>

        {loading ? (
          <div className="py-24 text-center text-slate-500 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span>جارٍ تحميل بيانات المنظومة...</span>
          </div>
        ) : (
          <>
            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* TAB 1: ANALYTICS & GEOGRAPHIC DISTRIBUTION                         */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            {activeTab === "analytics" && (
              <div className="space-y-8 animate-in fade-in">
                {/* 6 Top Metric Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80">
                    <span className="text-xs text-slate-400 font-bold block mb-1">الإيراد الشهري (MRR)</span>
                    <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                      {(data?.stats.mrrDZD || 0).toLocaleString()} <span className="text-xs">د.ج</span>
                    </span>
                    <span className="text-[10px] text-emerald-500 block mt-1">عائد الاشتراكات النشطة</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80">
                    <span className="text-xs text-slate-400 font-bold block mb-1">الإيراد السنوي المتوقع (ARR)</span>
                    <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">
                      {(data?.stats.arrDZD || 0).toLocaleString()} <span className="text-xs">د.ج</span>
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">توقعات الـ 12 شهراً</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80">
                    <span className="text-xs text-slate-400 font-bold block mb-1">المحلات النشطة</span>
                    <span className="text-xl sm:text-2xl font-black text-white font-mono">
                      {data?.stats.activeShops}{" "}
                      <span className="text-xs text-slate-500 font-normal">/ {data?.stats.totalShops}</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 block mt-1">
                      {Math.round(((data?.stats.activeShops || 1) / (data?.stats.totalShops || 1)) * 100)}% معدل النشاط
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80">
                    <span className="text-xs text-slate-400 font-bold block mb-1">النقاط المتداولة</span>
                    <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                      {(data?.stats.totalPointsInCirculation || 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-amber-500/80 block mt-1">جاهزة لمهام الطباعة</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80">
                    <span className="text-xs text-slate-400 font-bold block mb-1">إجمالي الفواتير المحصلة</span>
                    <span className="text-xl sm:text-2xl font-black text-indigo-400 font-mono">
                      {(data?.stats.paidInvoicesDZD || 0).toLocaleString()} <span className="text-xs">د.ج</span>
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">مدفوعات مؤكدة B2B</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80">
                    <span className="text-xs text-slate-400 font-bold block mb-1">وثائق طُبعت وطنياً</span>
                    <span className="text-xl sm:text-2xl font-black text-purple-400 font-mono">
                      {(data?.stats.nationalDocumentsCount || 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-purple-400/80 block mt-1">عبر جسر الطباعة</span>
                  </div>
                </div>

                {/* 2-Column: Wilayas Geographic Distribution + Plans Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Wilayas Geographic Heatmap / List (2 cols) */}
                  <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-extrabold text-white">
                          📍 التوزيع الجغرافي للمحلات عبر الـ 58 ولاية
                        </h3>
                        <p className="text-xs text-slate-400">
                          ترتيب الولايات حسب كثافة الأكشاك المشتركة، وحجم النقاط المستهلكة
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                        تغطية وطنية
                      </span>
                    </div>

                    <div className="space-y-3 pt-2">
                      {analytics?.wilayasDistribution && analytics.wilayasDistribution.length > 0 ? (
                        analytics.wilayasDistribution.map((w) => (
                          <div key={w.wilayaCode} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-white flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono flex items-center justify-center">
                                  {String(w.wilayaCode).padStart(2, "0")}
                                </span>
                                <span>{w.wilayaName}</span>
                              </span>
                              <div className="flex items-center gap-3">
                                <span className="text-slate-400 font-mono">{w.totalPoints} نقطة</span>
                                <span className="font-mono text-emerald-400 font-bold">
                                  {w.shopsCount} محلات ({w.percentage}%)
                                </span>
                              </div>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-l from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                                style={{ width: `${Math.max(10, w.percentage)}%` }}
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-slate-500 text-xs">
                          لا توجد بيانات ولايات كافية حالياً.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Plan Breakdown & Activity */}
                  <div className="space-y-6">
                    {/* Subscription Tiers */}
                    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                      <h3 className="text-base font-extrabold text-white border-b border-slate-800 pb-3">
                        ⚡ توزيع باقات الاشتراك السحابي
                      </h3>

                      <div className="space-y-3">
                        {analytics?.planBreakdown.map((p) => (
                          <div
                            key={p.planId}
                            className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between"
                          >
                            <div>
                              <div className="text-xs font-bold text-white">{p.planNameAr}</div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                {p.monthlyPriceDZD > 0 ? `${p.monthlyPriceDZD.toLocaleString()} د.ج / شهر` : "مجاناً"}
                              </div>
                            </div>
                            <div className="text-left">
                              <div className="text-sm font-black text-emerald-400 font-mono">{p.count} مشترك</div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                {p.totalRevenueDZD.toLocaleString()} د.ج
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Activity Breakdown */}
                    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                      <h3 className="text-base font-extrabold text-white border-b border-slate-800 pb-3">
                        🏢 قطاعات النشاط التجاري
                      </h3>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">أكشاك ومكتبات</span>
                          <span className="text-lg font-black text-white font-mono">
                            {analytics?.activityBreakdown["KIOSK"] || 0}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">مقاهي إنترنت</span>
                          <span className="text-lg font-black text-white font-mono">
                            {analytics?.activityBreakdown["CYBER"] || 0}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">مراكز طباعة</span>
                          <span className="text-lg font-black text-white font-mono">
                            {analytics?.activityBreakdown["PRINT_SHOP"] || 0}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">مكاتب خدمات</span>
                          <span className="text-lg font-black text-white font-mono">
                            {analytics?.activityBreakdown["BUREAU"] || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* TAB 2: B2B INVOICES & BILLING SYSTEM                               */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            {activeTab === "invoices" && (
              <div className="space-y-6 animate-in fade-in">
                {/* Invoicing KPI Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400 font-bold block mb-1">إجمالي الفواتير الصادرة</span>
                    <span className="text-2xl font-black text-white font-mono">{invoices.length}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400 font-bold block mb-1">المبالغ المدفوعة</span>
                    <span className="text-2xl font-black text-emerald-400 font-mono">
                      {(data?.stats.paidInvoicesDZD || 0).toLocaleString()} <span className="text-xs">د.ج</span>
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400 font-bold block mb-1">الفواتير قيد التحصيل</span>
                    <span className="text-2xl font-black text-amber-400 font-mono">
                      {(data?.stats.pendingInvoicesDZD || 0).toLocaleString()} <span className="text-xs">د.ج</span>
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 font-bold block mb-1">إجراء سريع</span>
                      <span className="text-xs text-slate-300">إصدار فاتورة رسمية</span>
                    </div>
                    <button
                      onClick={() => setShowCreateInvoiceModal(true)}
                      className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition shadow-md"
                    >
                      + إنشاء فاتورة
                    </button>
                  </div>
                </div>

                {/* Filters and Search Bar */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">تصفية الحالة:</span>
                    <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
                      {["ALL", "PAID", "PENDING"].map((f) => (
                        <button
                          key={f}
                          onClick={() => setInvoiceFilter(f)}
                          className={`px-3 py-1 rounded-lg font-bold transition-all ${
                            invoiceFilter === f
                              ? "bg-emerald-500 text-slate-950"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {f === "ALL" ? "جميع الفواتير" : f === "PAID" ? "مدفوعة" : "قيد الانتظار"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <span className="text-xs text-slate-400">
                    عرض {filteredInvoices.length} من أصل {invoices.length} فاتورة
                  </span>
                </div>

                {/* Invoices Table */}
                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900">
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                        <tr>
                          <th className="p-4">رقم الفاتورة</th>
                          <th className="p-4">المحل التجاري والولاية</th>
                          <th className="p-4">تاريخ الإصدار</th>
                          <th className="p-4">المبلغ الإجمالي</th>
                          <th className="p-4">طريقة الدفع</th>
                          <th className="p-4">الحالة</th>
                          <th className="p-4 text-center">الإجراءات والطباعة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-medium">
                        {filteredInvoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-slate-850 transition">
                            <td className="p-4 font-mono font-bold text-emerald-400">
                              {inv.invoiceNumber}
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-white">{inv.shopName}</div>
                              <div className="text-[10px] text-slate-400">{inv.wilaya} · {inv.ownerName}</div>
                            </td>
                            <td className="p-4 font-mono text-slate-400">
                              {inv.date}
                            </td>
                            <td className="p-4 font-mono font-black text-white">
                              {inv.totalDZD.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">د.ج</span>
                            </td>
                            <td className="p-4">
                              <span className="text-[11px] text-slate-300">
                                {inv.paymentMethod === "EDAHABIA_CIB"
                                  ? "💳 الذهبية / CIB"
                                  : inv.paymentMethod === "BARIDIMOB"
                                  ? "📱 بريدي موب"
                                  : inv.paymentMethod === "CASH_WHOLESALE"
                                  ? "💵 نقداً (موزع)"
                                  : "🏦 تحويل بنكي"}
                              </span>
                            </td>
                            <td className="p-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
                                  inv.status === "PAID"
                                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                    : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                }`}
                              >
                                {inv.status === "PAID" ? "✓ مدفوعة" : "⏳ قيد الانتظار"}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => setSelectedInvoice(inv)}
                                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] transition flex items-center gap-1"
                                >
                                  <span>🖨️ معاينة وطباعة</span>
                                </button>
                                <button
                                  onClick={() => handleToggleInvoiceStatus(inv.id, inv.status)}
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white text-[11px] transition"
                                  title="تبديل حالة الدفع"
                                >
                                  ⇄
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* TAB 3: TENANT SHOPS MANAGEMENT                                     */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            {activeTab === "shops" && (
              <div className="space-y-6 animate-in fade-in">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-white">🏪 قائمة المتاجر والمشتركين</h3>
                    <p className="text-xs text-slate-400">إدارة الاشتراكات، شحن الرصيد المباشر، وضبط صلاحيات الأكشاك</p>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold text-sm">
                    {data?.shops.length} محل مسجل
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900">
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                        <tr>
                          <th className="p-4">اسم المحل والمسير</th>
                          <th className="p-4">الولاية</th>
                          <th className="p-4">نوع النشاط</th>
                          <th className="p-4">الباقة السحابية</th>
                          <th className="p-4">رصيد النقاط</th>
                          <th className="p-4">الحالة</th>
                          <th className="p-4 text-center">إجراءات المدير</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-medium">
                        {data?.shops.map((shop) => (
                          <tr key={shop.id} className="hover:bg-slate-850 transition">
                            <td className="p-4">
                              <div className="font-bold text-white">{shop.name}</div>
                              <div className="text-[10px] text-slate-400">{shop.owner} · {shop.phone}</div>
                            </td>
                            <td className="p-4 text-slate-300 font-bold">{shop.wilaya}</td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                                {shop.activity}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                                shop.plan === "PRO_KIOSK"
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : shop.plan === "ENTERPRISE"
                                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                  : "bg-slate-800 text-slate-400"
                              }`}>
                                {shop.plan || "STARTER"}
                              </span>
                            </td>
                            <td className="p-4 font-mono font-bold text-emerald-400">
                              {shop.points} نقطة
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                shop.status === "ACTIVE"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${shop.status === "ACTIVE" ? "bg-emerald-400" : "bg-rose-400"}`} />
                                {shop.status === "ACTIVE" ? "نشط" : "معطل"}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => handleTopup(shop.id, 50)}
                                  className="px-2 py-1 rounded bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-400 font-bold text-[10px] transition"
                                  title="شحن 50 نقطة"
                                >
                                  +50
                                </button>
                                <button
                                  onClick={() => handleTopup(shop.id, 200)}
                                  className="px-2 py-1 rounded bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-400 font-bold text-[10px] transition"
                                  title="شحن 200 نقطة"
                                >
                                  +200
                                </button>
                                <button
                                  onClick={() => handleToggle(shop.id)}
                                  className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                                    shop.status === "ACTIVE"
                                      ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white"
                                      : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white"
                                  }`}
                                >
                                  {shop.status === "ACTIVE" ? "إيقاف" : "تفعيل"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* TAB 4: WHOLESALE CARDS BATCH GENERATOR                             */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            {activeTab === "wholesale" && (
              <div className="space-y-8 animate-in fade-in">
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                    <div>
                      <h3 className="text-lg font-black text-white">🎟️ مولد بطاقات شحن الرصيد بالجملة (A4 Print Grid)</h3>
                      <p className="text-xs text-slate-400">
                        توليد حزم بطاقات الخدش برمز سري وأرقام تسلسلية مشفرة قابلة للطباعة والقص والتوزيع على أصحاب الأكشاك
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                      أمان مضاد للتزوير
                    </span>
                  </div>

                  <form onSubmit={handleGenerateBatch} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">فئة الرصيد (نقطة)</label>
                      <select
                        value={genPoints}
                        onChange={(e) => setGenPoints(Number(e.target.value))}
                        className="w-full h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:border-emerald-500"
                      >
                        <option value={50}>50 نقطة (تجريبية)</option>
                        <option value={100}>100 نقطة (شائعة)</option>
                        <option value={250}>250 نقطة (احترافية)</option>
                        <option value={500}>500 نقطة (باقة كبرى)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">عدد البطاقات في الدفعة</label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={genCount}
                        onChange={(e) => setGenCount(Number(e.target.value))}
                        className="w-full h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">سعر البيع للجملة (د.ج)</label>
                      <input
                        type="number"
                        min={100}
                        step={100}
                        value={genPrice}
                        onChange={(e) => setGenPrice(Number(e.target.value))}
                        className="w-full h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:border-emerald-500"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="submit"
                        disabled={generating}
                        className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition shadow-lg shadow-emerald-500/20 disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {generating ? "جارٍ التوليد..." : "⚡ توليد الدفعة فوراً"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Printable Batch Grid if available */}
                {lastBatch && (
                  <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 space-y-6 animate-in fade-in">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div>
                        <h4 className="text-base font-black text-white">
                          دفعة رقم: <span className="text-emerald-400 font-mono">{lastBatch.batchNumber}</span>
                        </h4>
                        <p className="text-xs text-slate-400">
                          {lastBatch.cardsCount} بطاقة · فئة {lastBatch.pointsPerCard} نقطة · إجمالي {lastBatch.totalPoints} نقطة
                        </p>
                      </div>

                      <button
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-2 border border-slate-700"
                      >
                        <span>🖨️ طباعة الدفعة على ورق A4</span>
                      </button>
                    </div>

                    {/* Scratch Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-3 print:gap-2">
                      {lastBatch.cards?.map((card: any) => (
                        <div
                          key={card.id}
                          className="p-4 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-800 relative overflow-hidden flex flex-col justify-between h-40 print:h-36 print:border-black print:text-black"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-emerald-400 font-mono">SAHLA KIOSK</span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-[11px]">
                              {card.points} نقطة
                            </span>
                          </div>

                          <div className="text-center my-2">
                            <span className="block text-[10px] text-slate-500 font-bold mb-1">رمز الشحن السري</span>
                            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 font-mono font-black text-base tracking-widest text-amber-400 select-all print:bg-white print:border-black print:text-black">
                              {card.pin}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono border-t border-slate-800/60 pt-1.5">
                            <span>SN: {card.serialNumber}</span>
                            <span>صالحة لجميع الأكشاك 🇩🇿</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* TAB 5: SYSTEM ADMINISTRATORS MANAGEMENT                             */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            {activeTab === "admins" && (
              <div className="space-y-8 animate-in fade-in">
                {/* Form to create a new Super Admin */}
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                    <div>
                      <h3 className="text-lg font-black text-white">🛡️ إنشاء وتعيين مدير نظام جديد (Super Admin)</h3>
                      <p className="text-xs text-slate-400">
                        منح الصلاحيات المركزية الكاملة لإدارة المنصة، متابعة الإحصائيات، فوترة المتاجر، وتوليد بطاقات الشحن
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
                      صلاحيات سيادية كاملة
                    </span>
                  </div>

                  <form onSubmit={handleCreateAdmin} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">
                          الاسم الكامل للمدير <span className="text-emerald-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={adminName}
                          onChange={(e) => setAdminName(e.target.value)}
                          placeholder="مثال: حسام الدين بوقرة"
                          className="w-full h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">
                          البريد الإلكتروني (جيميل) <span className="text-emerald-400">*</span>
                        </label>
                        <input
                          type="email"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          placeholder="admin.houssem@gmail.com"
                          dir="ltr"
                          className="w-full h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-emerald-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">
                          كلمة المرور (6 خانات فأكثر) <span className="text-emerald-400">*</span>
                        </label>
                        <input
                          type="password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          placeholder="••••••••••••"
                          dir="ltr"
                          className="w-full h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-emerald-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">
                          رقم الهاتف الجزائري
                        </label>
                        <input
                          type="tel"
                          value={adminPhone}
                          onChange={(e) => setAdminPhone(e.target.value)}
                          placeholder="0550 11 22 33"
                          dir="ltr"
                          className="w-full h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={creatingAdmin}
                        className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition shadow-lg shadow-emerald-500/20 disabled:opacity-60 flex items-center gap-2"
                      >
                        {creatingAdmin ? "جارٍ الإنشاء..." : "✓ تأكيد وإنشاء حساب المدير 🛡️"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Admins Table */}
                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900">
                  <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">قائمة مديري النظام النشطين</h4>
                    <span className="font-mono text-xs text-emerald-400 font-bold">{adminsList.length} مدير معتمد</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                        <tr>
                          <th className="p-4">اسم المدير</th>
                          <th className="p-4">البريد الإلكتروني (جيميل)</th>
                          <th className="p-4">رقم الهاتف</th>
                          <th className="p-4">الرتبة</th>
                          <th className="p-4">تاريخ التعيين</th>
                          <th className="p-4 text-center">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-medium">
                        {adminsList.map((adm) => (
                          <tr key={adm.id} className="hover:bg-slate-850 transition">
                            <td className="p-4 font-bold text-white flex items-center gap-2">
                              <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black">
                                👑
                              </span>
                              <span>{adm.name}</span>
                            </td>
                            <td className="p-4 font-mono text-emerald-400">
                              {adm.email}
                              {adm.secondaryEmail && (
                                <span className="block text-[10px] text-slate-400">{adm.secondaryEmail}</span>
                              )}
                            </td>
                            <td className="p-4 font-mono text-slate-300">
                              {adm.phone || "—"}
                            </td>
                            <td className="p-4">
                              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-black text-[10px]">
                                SUPER_ADMIN
                              </span>
                            </td>
                            <td className="p-4 font-mono text-slate-400 text-[11px]">
                              {adm.createdAt ? adm.createdAt.split("T")[0] : "2026-01-01"}
                            </td>
                            <td className="p-4 text-center">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                نشط ومعتمد
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 1: CREATE NEW INVOICE                                           */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {showCreateInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">إصدار فاتورة رسمية جديدة 🧾</h3>
              <button onClick={() => setShowCreateInvoiceModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">اختيار المحل التجاري / العميل</label>
                <select
                  value={newInvShopId}
                  onChange={(e) => setNewInvShopId(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium focus:border-emerald-500"
                  required
                >
                  {data?.shops.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.wilaya}) - {s.owner}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">وصف الخدمة أو المنتج</label>
                <input
                  type="text"
                  value={newInvDesc}
                  onChange={(e) => setNewInvDesc(e.target.value)}
                  placeholder="وصف البند"
                  className="w-full h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">سعر الوحدة (د.ج)</label>
                  <input
                    type="number"
                    min={100}
                    step={100}
                    value={newInvPrice}
                    onChange={(e) => setNewInvPrice(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">الكمية</label>
                  <input
                    type="number"
                    min={1}
                    value={newInvQty}
                    onChange={(e) => setNewInvQty(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">طريقة الدفع المحددة</label>
                <select
                  value={newInvMethod}
                  onChange={(e) => setNewInvMethod(e.target.value as any)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500"
                >
                  <option value="EDAHABIA_CIB">💳 البطاقة الذهبية / CIB</option>
                  <option value="BARIDIMOB">📱 تطبيق بريدي موب BaridiMob</option>
                  <option value="CASH_WHOLESALE">💵 نقداً عبر موزع معتمد</option>
                  <option value="BANK_TRANSFER">🏦 تحويل بنكي رسمي</option>
                </select>
              </div>

              {/* Live Tax Summary */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-slate-400 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span>المبلغ الصافي (HT):</span>
                  <span className="text-white">{(newInvPrice * newInvQty).toLocaleString()} د.ج</span>
                </div>
                <div className="flex justify-between">
                  <span>الرسم الجبائي (Timbre 1%):</span>
                  <span className="text-white">{Math.min(2500, Math.round(newInvPrice * newInvQty * 0.01)).toLocaleString()} د.ج</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-400 pt-1 border-t border-slate-800 text-xs">
                  <span>المجموع النهائي (TTC):</span>
                  <span>{(newInvPrice * newInvQty + Math.min(2500, Math.round(newInvPrice * newInvQty * 0.01))).toLocaleString()} د.ج</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateInvoiceModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={creatingInvoice}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition shadow-md disabled:opacity-60"
                >
                  {creatingInvoice ? "جارٍ الإصدار..." : "تأكيد وإصدار الفاتورة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 2: PRINTABLE OFFICIAL ALGERIAN A4 INVOICE VIEW                   */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-3xl bg-white text-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl relative my-8 print:p-0 print:m-0 print:shadow-none print:w-full print:max-w-none">
            {/* Header controls (hidden in print) */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6 print:hidden">
              <span className="text-xs font-bold text-slate-500">معاينة الفاتورة الرسمية (A4 Print Preview)</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs transition flex items-center gap-2 shadow-md"
                >
                  <span>🖨️ طباعة الفاتورة أو حفظ كـ PDF</span>
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Official Algerian Invoice Document Layout */}
            <div className="space-y-6 text-sm">
              {/* Document Header */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-black text-emerald-700">سهلة · Sahla SaaS</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-tight">
                    المنظومة السحابية الوطنية للأكشاك والمكتبات<br />
                    الجزائر العاصمة · الجزائر 🇩🇿<br />
                    السجل التجاري (RC): 16/00-1234567B26<br />
                    رقم التعريف الجبائي (NIF): 002616012345678
                  </p>
                </div>

                <div className="text-left font-mono">
                  <div className="text-xl font-black text-slate-900">{selectedInvoice.invoiceNumber}</div>
                  <div className="text-xs text-slate-600 mt-1">تاريخ الإصدار: {selectedInvoice.date}</div>
                  <div className="text-xs text-slate-600">تاريخ الاستحقاق: {selectedInvoice.dueDate}</div>
                  <div className="mt-2 inline-block px-3 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                    {selectedInvoice.status === "PAID" ? "ACQUITTÉE · مدفوعة" : "EN ATTENTE · قيد الانتظار"}
                  </div>
                </div>
              </div>

              {/* Client Shop Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block">العميل / المحل التجاري (Client):</span>
                  <div className="text-base font-black text-slate-900">{selectedInvoice.shopName}</div>
                  <div className="text-xs text-slate-700">المسير: {selectedInvoice.ownerName}</div>
                  <div className="text-xs text-slate-700">الولاية: {selectedInvoice.wilaya}</div>
                </div>
                <div className="text-left text-xs text-slate-600 font-mono">
                  <span className="block font-bold">طريقة الدفع المعتمدة:</span>
                  <span>{selectedInvoice.paymentMethod}</span>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-right text-xs border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 font-black border-b border-slate-200">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">البيان وتعيين الخدمة (Désignation)</th>
                    <th className="p-3 text-center">الكمية</th>
                    <th className="p-3 text-left">سعر الوحدة (HT)</th>
                    <th className="p-3 text-left">المجموع (HT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {selectedInvoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-mono text-slate-500">{idx + 1}</td>
                      <td className="p-3 font-bold text-slate-800">{item.description}</td>
                      <td className="p-3 text-center font-mono">{item.quantity}</td>
                      <td className="p-3 text-left font-mono">{item.unitPriceDZD.toLocaleString()} د.ج</td>
                      <td className="p-3 text-left font-mono font-bold">{item.totalDZD.toLocaleString()} د.ج</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals Section */}
              <div className="flex justify-between items-start pt-2">
                <div className="max-w-md text-xs text-slate-600">
                  <p className="font-bold text-slate-800 mb-1">ملاحظات وشروط:</p>
                  <p>{selectedInvoice.notes || "تعتبر هذه الفاتورة سنداً رسمياً معتمداً."}</p>
                  <p className="mt-2 text-[10px] text-slate-500">
                    أوقفت هذه الفاتورة عند المبلغ الإجمالي قدره: 
                    <strong className="text-slate-800 mr-1 font-sans">
                      {selectedInvoice.totalDZD.toLocaleString()} دينار جزائري.
                    </strong>
                  </p>
                </div>

                <div className="w-64 space-y-1.5 font-mono text-xs text-right">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">المجموع الصافي (HT):</span>
                    <span className="font-bold">{selectedInvoice.subtotalDZD.toLocaleString()} د.ج</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">الرسم على القيمة المضافة (TVA 0%):</span>
                    <span>0 د.ج</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">رسم الطابع الجبائي (Timbre):</span>
                    <span>{selectedInvoice.stampDutyDZD.toLocaleString()} د.ج</span>
                  </div>
                  <div className="flex justify-between py-2 border-t-2 border-slate-900 text-sm font-black text-emerald-800">
                    <span>المجموع الإجمالي (TTC):</span>
                    <span>{selectedInvoice.totalDZD.toLocaleString()} د.ج</span>
                  </div>
                </div>
              </div>

              {/* Stamp and Signature Area */}
              <div className="pt-8 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500">
                <div className="text-center w-48">
                  <div className="h-16 flex items-center justify-center border border-dashed border-slate-300 rounded-xl mb-1 text-[10px] text-slate-400">
                    رمز QR للتحقق الجبائي
                  </div>
                  <span>منظومة سهلة المعتمدة</span>
                </div>

                <div className="text-center w-48">
                  <div className="h-16 flex items-center justify-center border border-dashed border-slate-300 rounded-xl mb-1 text-[10px] text-emerald-800 font-bold">
                    [خاتم وإمضاء الإدارة المركزية]
                  </div>
                  <span>المديرية العامة للمنصة</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
