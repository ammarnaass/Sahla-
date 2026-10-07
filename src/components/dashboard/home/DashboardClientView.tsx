"use client";

import React, { useState, useEffect } from "react";
import { useDashboardTab } from "@/contexts/DashboardTabContext";
import { useAuth } from "@/contexts/AuthContext";
import { SERVICES_CATALOG, type ServiceDefinition } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { Badge } from "@/components/ui/badge";

// Domain Micro-Components
import { ZeroBalanceBanner } from "@/components/dashboard/ZeroBalanceBanner";
import { DashboardOverviewTab } from "@/components/dashboard/home/DashboardOverviewTab";
import { ServicesFullGrid } from "@/components/dashboard/ServicesFullGrid";
import { DocumentsTab, type DocumentRecord } from "@/components/dashboard/documents/DocumentsTab";
import { WalletTab, type LedgerItem } from "@/components/dashboard/wallet/WalletTab";
import { StaffAccountTab } from "@/components/dashboard/staff/StaffAccountTab";
import { SettingsTab } from "@/components/dashboard/settings/SettingsTab";
import { SuperAdminTab } from "@/components/dashboard/admin/SuperAdminTab";
import { StudioModal } from "@/components/dashboard/studio/StudioModal";
import { SchoolResearchTab } from "@/components/dashboard/education/SchoolResearchTab";
import { NotificationsTab } from "@/components/dashboard/notifications/NotificationsTab";
import type { GeneratedDocPayload } from "@/hooks/dashboard/useStudioState";

const INITIAL_DOCS: DocumentRecord[] = [
  {
    id: "doc_1",
    title: "سيرة ذاتية — نموذج احترافي",
    type: "CV",
    customerName: "سفيان بلقاسم",
    salePrice: 250,
    createdAt: new Date().toISOString(),
  },
  {
    id: "doc_2",
    title: "صور هوية بيومترية (35×45 مم)",
    type: "ID_PHOTO",
    customerName: "فاطمة الزهراء عمار",
    salePrice: 200,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

const INITIAL_LEDGER: LedgerItem[] = [
  {
    id: "tx_0",
    description: "رصيد تجريبي ترحيبي عند فتح الحساب",
    pointsDelta: 50,
    balanceAfter: 50,
    type: "CREDIT",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "tx_1",
    description: "توليد سيرة ذاتية احترافية (سفيان بلقاسم)",
    pointsDelta: -15,
    balanceAfter: 35,
    type: "DEBIT",
    createdAt: new Date().toISOString(),
  },
];

export function DashboardClientView() {
  const { session } = useAuth();
  const { activeTab, setActiveTab } = useDashboardTab();

  const [points, setPoints] = useState(session?.user?.role === "SUPER_ADMIN" ? 9999 : 50);
  const [documents, setDocuments] = useState<DocumentRecord[]>(INITIAL_DOCS);
  const [ledger, setLedger] = useState<LedgerItem[]>(INITIAL_LEDGER);
  const [dailyStats, setDailyStats] = useState({
    docsCount: 2,
    pointsUsed: 15,
    estimatedProfitDZD: 450,
  });

  // Direct keyboard shortcuts: ⌘R for research, ⌘E for exams
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
        setActiveTab("school-research");
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [setActiveTab]);

  const [selectedService, setSelectedService] = useState<ServiceDefinition | null>(null);
  const [frequentServices, setFrequentServices] = useState<ServiceDefinition[]>([]);

  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem("sahla_user_preferences");
      if (savedPrefs) {
        const { selectedServices } = JSON.parse(savedPrefs);
        if (Array.isArray(selectedServices) && selectedServices.length > 0) {
          const matched = SERVICES_CATALOG.filter((s) => selectedServices.includes(s.code));
          if (matched.length > 0) {
            setFrequentServices(matched.slice(0, 4));
            return;
          }
        }
      }
    } catch {
      // Ignore
    }
    setFrequentServices(SERVICES_CATALOG.slice(0, 4));
  }, []);

  const handleRecharge = (pointsToAdd: number, desc = "شحن رصيد المحل") => {
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
  };

  const openServiceByCode = (code: string) => {
    const found = SERVICES_CATALOG.find((s) => s.code === code) || SERVICES_CATALOG[0];
    setSelectedService(found);
  };

  return (
    <div className="space-y-6">
      {points <= 0 && <ZeroBalanceBanner onTopUp={() => handleRecharge(100, "شحن طوارئ")} />}

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
                  دليل الخدمات والأدوات الرقمية
                </h2>
                <Badge variant="primary" className="text-[11px] font-bold">
                  الكاونتر الرقمي ⚡
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                اختر الخدمة المطلوبة لفتح استوديو التوليد وتعديل البيانات والطباعة الفورية على مقاس A4
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/60 border border-border text-[11px] text-muted-foreground font-medium">
                <span>اختصار البحث:</span>
                <kbd className="px-1.5 py-0.2 bg-card border border-border rounded font-mono font-bold text-[10px] text-foreground">
                  /
                </kbd>
              </span>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-xs font-black">
                <span>رصيدك:</span>
                <span className="font-mono text-sm">{points.toLocaleString()}</span>
                <span className="text-[10px] font-normal">نقطة</span>
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

      {activeTab === "account" && <StaffAccountTab />}

      {activeTab === "settings" && <SettingsTab />}

      {activeTab === "notifications" && <NotificationsTab />}

      {activeTab === "superadmin" && <SuperAdminTab />}

      <StudioModal
        isOpen={Boolean(selectedService)}
        onClose={() => setSelectedService(null)}
        service={selectedService}
        points={points}
        onDocumentGenerated={handleDocumentGenerated}
      />
    </div>
  );
}
