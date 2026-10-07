"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "./AdminHeader";
import { AdminTabNav, AdminTabType } from "./AdminTabNav";
import { AdminAnalyticsTab } from "./tabs/AdminAnalyticsTab";
import { AdminShopsTab } from "./tabs/AdminShopsTab";
import { AdminInvoicesTab } from "./tabs/AdminInvoicesTab";
import { AdminWholesaleTab } from "./tabs/AdminWholesaleTab";
import { AdminTeamTab } from "./tabs/AdminTeamTab";
import { CreateInvoiceModal } from "./modals/CreateInvoiceModal";
import { InvoicePrintModal } from "./modals/InvoicePrintModal";
import { NationalBroadcastModal } from "./modals/NationalBroadcastModal";
import type { ShopRecord } from "@/server/repositories/shopRepository";
import type { InvoiceRecord } from "@/server/repositories/invoiceRepository";

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

export default function AdminClientView() {
  const [activeTab, setActiveTab] = useState<AdminTabType>("analytics");
  const [data, setData] = useState<AdminOverviewData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsReport | null>(null);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [adminsList, setAdminsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Modals & Generation State
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [isGeneratingCards, setIsGeneratingCards] = useState(false);
  const [lastBatch, setLastBatch] = useState<any>(null);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  // Auto-dismiss notices
  useEffect(() => {
    if (actionNotice) {
      const timer = setTimeout(() => setActionNotice(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [actionNotice]);

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/admin/admins");
      const json = await res.json();
      if (json.success) setAdminsList(json.admins);
    } catch {
      // Silent
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
      if (jsonOverview.success) setData(jsonOverview);

      const jsonAnalytics = await resAnalytics.json();
      if (jsonAnalytics.success) setAnalytics(jsonAnalytics.analytics);

      const jsonInvoices = await resInvoices.json();
      if (jsonInvoices.success) setInvoices(jsonInvoices.invoices);

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

  // Handlers
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

  const handleToggleShop = async (shopId: string) => {
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

  const handleCreateInvoice = async (formData: {
    shopId: string;
    description: string;
    price: number;
    quantity: number;
    paymentMethod: "EDAHABIA_CIB" | "BARIDIMOB" | "CASH_WHOLESALE" | "BANK_TRANSFER";
  }) => {
    setIsCreatingInvoice(true);
    const targetShop = data?.shops.find((s) => s.id === formData.shopId);

    try {
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId: formData.shopId,
          shopName: targetShop?.name || "محل تجاري",
          ownerName: targetShop?.owner || "المسير",
          wilaya: targetShop?.wilaya || "16 - الجزائر",
          wilayaCode: targetShop?.wilayaCode || 16,
          paymentMethod: formData.paymentMethod,
          items: [
            {
              description: formData.description,
              quantity: formData.quantity,
              unitPriceDZD: formData.price,
              totalDZD: formData.quantity * formData.price,
            },
          ],
        }),
      });

      const json = await res.json();
      if (json.success) {
        setActionNotice(`✓ تم إصدار الفاتورة الرسمية بنجاح برقم (${json.invoice.invoiceNumber})!`);
        setShowCreateInvoiceModal(false);
        fetchData();
      }
    } catch {
      setActionNotice("تعذر إصدار الفاتورة حالياً.");
    } finally {
      setIsCreatingInvoice(false);
    }
  };

  const handleGenerateBatch = async (batchData: { points: number; count: number; priceDZD: number }) => {
    setIsGeneratingCards(true);
    setActionNotice(null);
    try {
      const res = await fetch("/api/cards/wholesale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(batchData),
      });
      const json = await res.json();
      if (json.success) {
        setLastBatch(json.batch);
        setActionNotice(`✓ تم توليد دفعة بطاقات جديدة بنجاح (${json.batch.batchNumber})!`);
      }
    } catch {
      setActionNotice("فشل توليد دفعة البطاقات.");
    } finally {
      setIsGeneratingCards(false);
    }
  };

  const handleCreateAdmin = async (adminData: { name: string; email: string; pass: string; phone?: string }) => {
    setIsCreatingAdmin(true);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: adminData.name.trim(),
          email: adminData.email.trim(),
          password: adminData.pass,
          phone: adminData.phone?.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setActionNotice("✓ تم إنشاء وتفعيل حساب مدير النظام بنجاح 🛡️!");
        fetchAdmins();
      } else {
        setActionNotice(json.error || "فشل إنشاء حساب المدير");
      }
    } catch {
      setActionNotice("حدث خطأ في الاتصال بالخادم.");
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors antialiased selection:bg-emerald-500 selection:text-white">
      {/* 1. Header */}
      <AdminHeader onOpenBroadcast={() => setShowBroadcastModal(true)} />

      {/* 2. Feedback Notification Banner */}
      {actionNotice && (
        <div className="bg-emerald-500 text-white text-xs font-bold py-2.5 px-4 text-center shadow-md animate-fadeIn flex items-center justify-center gap-2">
          <span>{actionNotice}</span>
        </div>
      )}

      {/* 3. Sub-Navbar Tabs */}
      <AdminTabNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        shopsCount={data?.shops?.length || 0}
        invoicesCount={invoices?.length || 0}
      />

      {/* 4. Active Tab Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-muted-foreground font-cairo">جاري تحميل المؤشرات والبيانات الوطنية...</p>
          </div>
        ) : (
          <>
            {activeTab === "analytics" && (
              <AdminAnalyticsTab stats={data?.stats} analytics={analytics || undefined} />
            )}

            {activeTab === "shops" && (
              <AdminShopsTab
                shops={data?.shops || []}
                onTopup={handleTopup}
                onToggle={handleToggleShop}
              />
            )}

            {activeTab === "invoices" && (
              <AdminInvoicesTab
                invoices={invoices}
                onOpenCreateModal={() => setShowCreateInvoiceModal(true)}
                onSelectInvoice={setSelectedInvoice}
                onToggleStatus={handleToggleInvoiceStatus}
              />
            )}

            {activeTab === "wholesale" && (
              <AdminWholesaleTab
                onGenerateBatch={handleGenerateBatch}
                isGenerating={isGeneratingCards}
                lastBatch={lastBatch}
              />
            )}

            {activeTab === "admins" && (
              <AdminTeamTab
                adminsList={adminsList}
                onCreateAdmin={handleCreateAdmin}
                isCreating={isCreatingAdmin}
              />
            )}
          </>
        )}
      </main>

      {/* 5. Modals */}
      <CreateInvoiceModal
        isOpen={showCreateInvoiceModal}
        onClose={() => setShowCreateInvoiceModal(false)}
        shops={data?.shops || []}
        onSubmit={handleCreateInvoice}
        isSubmitting={isCreatingInvoice}
      />

      <InvoicePrintModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onToggleStatus={handleToggleInvoiceStatus}
      />

      <NationalBroadcastModal
        isOpen={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
        onBroadcastSent={(msg) => setActionNotice(msg)}
      />
    </div>
  );
}
