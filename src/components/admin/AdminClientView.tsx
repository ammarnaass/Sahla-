"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "./AdminHeader";
import { AdminTabNav } from "./AdminTabNav";
import { AdminUnifiedSidebar, type UnifiedAdminTab } from "./layout/AdminUnifiedSidebar";
import { AdminAnalyticsTab } from "./tabs/AdminAnalyticsTab";
import { AdminShopsTab } from "./tabs/AdminShopsTab";
import { AdminInvoicesTab } from "./tabs/AdminInvoicesTab";
import { AdminWholesaleTab } from "./tabs/AdminWholesaleTab";
import { AdminTeamTab } from "./tabs/AdminTeamTab";
import { CreateInvoiceModal } from "./modals/CreateInvoiceModal";
import { InvoicePrintModal } from "./modals/InvoicePrintModal";
import { NationalBroadcastModal } from "./modals/NationalBroadcastModal";
import { AdminAIEngineTab } from "./ai/AdminAIEngineTab";
import { AdminAIChatPanel } from "./ai/AdminAIChatPanel";
import { Brain } from "lucide-react";

// Counter & Service Studio Components
import { DashboardOverviewTab } from "@/components/dashboard/home/DashboardOverviewTab";
import { ServicesFullGrid } from "@/components/dashboard/ServicesFullGrid";
import { DocumentsTab, type DocumentRecord } from "@/components/dashboard/documents/DocumentsTab";
import { WalletTab, type LedgerItem } from "@/components/dashboard/wallet/WalletTab";
import { SettingsTab } from "@/components/dashboard/settings/SettingsTab";
import { StudioModal } from "@/components/dashboard/studio/StudioModal";
import { SchoolResearchTab } from "@/components/dashboard/education/SchoolResearchTab";
import { SERVICES_CATALOG, type ServiceDefinition } from "@/lib/constants";
import type { GeneratedDocPayload } from "@/hooks/dashboard/useStudioState";
import { trackEvent } from "@/lib/analytics";
import { Badge } from "@/components/ui/badge";

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
  const [activeTab, setActiveTab] = useState<UnifiedAdminTab>("analytics");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // National Data
  const [data, setData] = useState<AdminOverviewData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsReport | null>(null);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [adminsList, setAdminsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Counter & Studio State
  const [points, setPoints] = useState(9999);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [ledger, setLedger] = useState<LedgerItem[]>([]);
  const [dailyStats, setDailyStats] = useState({
    docsCount: 0,
    pointsUsed: 0,
    estimatedProfitDZD: 0,
  });
  const [selectedService, setSelectedService] = useState<ServiceDefinition | null>(null);
  const [frequentServices, setFrequentServices] = useState<ServiceDefinition[]>([]);

  // Modals & Generation State
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [isGeneratingCards, setIsGeneratingCards] = useState(false);
  const [lastBatch, setLastBatch] = useState<any>(null);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);
  const [floatingChatInitialQuery, setFloatingChatInitialQuery] = useState<string | undefined>(undefined);

  // Auto-dismiss notices
  useEffect(() => {
    if (actionNotice) {
      const timer = setTimeout(() => setActionNotice(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [actionNotice]);

  // Read URL hash on initial load
  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as UnifiedAdminTab;
    const validTabs: UnifiedAdminTab[] = [
      "analytics",
      "shops",
      "invoices",
      "wholesale",
      "admins",
      "overview",
      "services",
      "school-research",
      "documents",
      "wallet",
      "settings",
    ];
    if (validTabs.includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  // Global shortcut for school research: ⌘R
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      if (
        activeEl &&
        (["INPUT", "TEXTAREA", "SELECT"].includes(activeEl.tagName) ||
          activeEl.isContentEditable)
      ) {
        return;
      }

      if ((e.metaKey || e.altKey) && (e.key === "r" || e.key === "R")) {
        e.preventDefault();
        handleSelectTab("school-research");
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  const handleSelectTab = (tab: UnifiedAdminTab) => {
    setActiveTab(tab);
    window.location.hash = tab === "analytics" ? "" : tab;
    setShowMobileSidebar(false);
  };

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
    setFrequentServices(SERVICES_CATALOG.slice(0, 4));
  }, []);

  // Handlers for National Operations
  const handleTopup = async (shopId: string, pts: number) => {
    try {
      const res = await fetch("/api/admin/shops/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopId, points: pts }),
      });
      const resData = await res.json();
      if (resData.success) {
        setActionNotice(`✓ تم شحن ${pts} نقطة بنجاح للمحل.`);
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
        setActionNotice(
          `✓ تم تحديث حالة الفاتورة (${invoiceId}) إلى ${
            nextStatus === "PAID" ? "مدفوعة" : "قيد الانتظار"
          }.`
        );
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

  // Handlers for Counter & Studio Operations
  const handleRecharge = (pointsToAdd: number, desc = "شحن رصيد تجريبي") => {
    setPoints((prev) => {
      const next = prev + pointsToAdd;
      const newLedgerItem: LedgerItem = {
        id: `tx_${Date.now()}`,
        description: desc,
        pointsDelta: pointsToAdd,
        balanceAfter: next,
        type: "CREDIT",
        createdAt: new Date().toISOString(),
      };
      setLedger((prevL) => [newLedgerItem, ...prevL]);
      trackEvent("points_recharged", { added: pointsToAdd, total: next });
      return next;
    });
  };

  const handleDocumentGenerated = (doc: GeneratedDocPayload) => {
    setPoints((prev) => {
      const next = Math.max(0, prev - doc.pointsCost);
      const newLedgerItem: LedgerItem = {
        id: `tx_${Date.now()}`,
        description: `${doc.title} (${doc.customerName})`,
        pointsDelta: -doc.pointsCost,
        balanceAfter: next,
        type: "DEBIT",
        createdAt: new Date().toISOString(),
      };
      setLedger((prevL) => [newLedgerItem, ...prevL]);
      return next;
    });

    const newDoc: DocumentRecord = {
      id: doc.id,
      title: doc.title,
      type: doc.type,
      customerName: doc.customerName,
      salePrice: doc.salePrice,
      createdAt: new Date().toISOString(),
    };

    setDocuments((prev) => [newDoc, ...prev]);

    setDailyStats((prev) => ({
      docsCount: prev.docsCount + 1,
      pointsUsed: prev.pointsUsed + doc.pointsCost,
      estimatedProfitDZD: prev.estimatedProfitDZD + doc.salePrice,
    }));

    trackEvent("document_generated", { title: doc.title });
    setActionNotice(`✓ تم توليد وثيقة (${doc.title}) بنجاح وإضافتها لسجل الوثائق!`);
  };

  const openServiceByCode = (code: string) => {
    const found = SERVICES_CATALOG.find((s) => s.code === code) || SERVICES_CATALOG[0];
    setSelectedService(found);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors antialiased selection:bg-emerald-500 selection:text-white">
      {/* 1. Unified Sovereign Command Header */}
      <AdminHeader
        onOpenBroadcast={() => setShowBroadcastModal(true)}
        onOpenNewService={() => setSelectedService(SERVICES_CATALOG[0])}
        onOpenCreateInvoice={() => setShowCreateInvoiceModal(true)}
        onToggleMobileMenu={() => setShowMobileSidebar(!showMobileSidebar)}
      />

      {/* 2. Feedback Notification Banner */}
      {actionNotice && (
        <div className="bg-emerald-500 text-white text-xs font-bold py-2.5 px-4 text-center shadow-md animate-fadeIn flex items-center justify-center gap-2">
          <span>{actionNotice}</span>
        </div>
      )}

      {/* 3. Mobile Sub-Navbar Tabs */}
      <div className="lg:hidden">
        <AdminTabNav
          activeTab={activeTab}
          setActiveTab={handleSelectTab}
          shopsCount={data?.shops?.length || 0}
          invoicesCount={invoices?.length || 0}
          docsCount={documents.length}
        />
      </div>

      {/* 4. Main Body: Sidebar + Dynamic Content Canvas */}
      <div className="flex-1 flex flex-row min-w-0">
        {/* Desktop Sovereign Unified Sidebar (RTL) */}
        <AdminUnifiedSidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          shopsCount={data?.shops?.length || 0}
          invoicesCount={invoices?.length || 0}
          docsCount={documents.length}
          onOpenBroadcast={() => setShowBroadcastModal(true)}
        />

        {/* Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {loading ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-muted-foreground font-cairo">
                جاري تحميل المنظومة المركزية لمتابعة الـ 58 ولاية والكاونتر...
              </p>
            </div>
          ) : (
            <>
              {/* === National Central Command (58 Wilayas) Tabs === */}
              {activeTab === "analytics" && (
                <AdminAnalyticsTab
                  stats={data?.stats}
                  analytics={analytics || undefined}
                  onOpenAIChat={(query) => {
                    setFloatingChatInitialQuery(query);
                    setIsFloatingChatOpen(true);
                  }}
                />
              )}

              {activeTab === "ai-engine" && <AdminAIEngineTab />}

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

              {/* === Field Counter Operations & Service Studio Tabs === */}
              {activeTab === "overview" && (
                <DashboardOverviewTab
                  frequentServices={frequentServices}
                  onSelectService={setSelectedService}
                  documents={documents}
                  points={points}
                  onRecharge={handleRecharge}
                  dailyStats={dailyStats}
                />
              )}

              {activeTab === "services" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-right">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-black text-foreground font-display">
                          دليل الخدمات واستوديو A4 المباشر
                        </h2>
                        <Badge variant="primary" className="text-[11px] font-bold">
                          وضع الإدارة الشامل ⚡
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        اختر أي خدمة رقمية لفتح استوديو التوليد وتعديل البيانات والطباعة الفورية على مقاس A4
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-300 text-xs font-black">
                        <span>رصيد المدير:</span>
                        <span className="font-mono text-sm">{points.toLocaleString()}</span>
                        <span className="text-[10px] font-normal">نقطة سيادية</span>
                      </div>
                    </div>
                  </div>

                  <ServicesFullGrid onSelectService={setSelectedService} />
                </div>
              )}

              {activeTab === "school-research" && (
                <SchoolResearchTab
                  points={points}
                  onDocumentGenerated={handleDocumentGenerated}
                />
              )}

              {activeTab === "documents" && (
                <DocumentsTab documents={documents} onOpenStudio={openServiceByCode} />
              )}

              {activeTab === "wallet" && (
                <WalletTab points={points} onRecharge={handleRecharge} ledger={ledger} />
              )}

              {/* === Hardware & Settings Tab === */}
              {activeTab === "settings" && <SettingsTab />}
            </>
          )}
        </main>
      </div>

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

      {/* Studio Modal for A4 Document Generation */}
      <StudioModal
        isOpen={Boolean(selectedService)}
        onClose={() => setSelectedService(null)}
        service={selectedService}
        points={points}
        onDocumentGenerated={handleDocumentGenerated}
      />

      {/* Floating AI Engine Chat Widget (Available across all tabs) */}
      {activeTab !== "ai-engine" && (
        <>
          <AdminAIChatPanel
            isOpen={isFloatingChatOpen}
            onClose={() => setIsFloatingChatOpen(false)}
            isFloating={true}
            initialQuery={floatingChatInitialQuery}
          />

          {!isFloatingChatOpen && (
            <button
              onClick={() => setIsFloatingChatOpen(true)}
              className="fixed bottom-6 left-6 z-40 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl shadow-emerald-500/25 flex items-center gap-2.5 font-bold text-xs transition-all duration-200 hover:scale-105 group"
              title="فتح المساعد الذكي للمنظومة المركزية"
            >
              <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                <Brain size={15} className="group-hover:animate-pulse" />
              </div>
              <span>المساعد الذكي 58 ولاية</span>
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            </button>
          )}
        </>
      )}
    </div>
  );
}
