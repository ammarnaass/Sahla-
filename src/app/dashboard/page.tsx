"use client";

import React, { useState, useEffect } from "react";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { QuickSearch } from "@/components/dashboard/QuickSearch";
import { FrequentServices } from "@/components/dashboard/FrequentServices";
import { ServicesFullGrid } from "@/components/dashboard/ServicesFullGrid";
import { RecentDocuments, DocumentItem } from "@/components/dashboard/RecentDocuments";
import { DailySummary } from "@/components/dashboard/DailySummary";
import { StarterChecklist } from "@/components/dashboard/StarterChecklist";
import { SupportCard } from "@/components/dashboard/SupportCard";
import { ZeroBalanceBanner } from "@/components/dashboard/ZeroBalanceBanner";
import { SERVICES_CATALOG, ServiceDefinition } from "@/lib/constants";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";

const INITIAL_DOCS: DocumentItem[] = [
  {
    id: "doc_1",
    title: "سيرة ذاتية — نموذج احترافي",
    type: "CV",
    customerName: "سفيان بلقاسم",
    createdAt: new Date().toISOString(),
    salePrice: 250,
  },
];

export default function DashboardPage() {
  const [points, setPoints] = useState(50);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCS);
  const [dailyStats, setDailyStats] = useState({
    docsCount: 1,
    pointsUsed: 10,
    estimatedProfitDZD: 220,
  });

  // Active document generator modal
  const [selectedService, setSelectedService] = useState<ServiceDefinition | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [genSuccessMessage, setGenSuccessMessage] = useState("");

  // Frequent services customized by onboarding preferences
  const [frequentServices, setFrequentServices] = useState<ServiceDefinition[]>([]);

  useEffect(() => {
    // Load onboarding preferences if any
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
    // Default top 4
    setFrequentServices(SERVICES_CATALOG.slice(0, 4));
  }, []);

  const handleRecharge = (pointsToAdd: number) => {
    setPoints((prev) => {
      const next = prev + pointsToAdd;
      trackEvent("points_recharged", { added: pointsToAdd, total: next });
      return next;
    });
  };

  const handleGenerateDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    if (points < selectedService.pointsCost && !selectedService.isFree) {
      alert("رصيد نقاطك غير كافٍ لإنجاز هذه الخدمة. يُرجى شحن الرصيد أولاً.");
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);

      const cost = selectedService.pointsCost;
      const salePrice = selectedService.code === "CV_GEN" ? 250 : selectedService.code === "INVOICE" ? 300 : 150;
      const profit = salePrice - cost * 3;

      // Deduct points
      setPoints((prev) => Math.max(0, prev - cost));

      // Add to recent docs
      const newDoc: DocumentItem = {
        id: `doc_${Date.now()}`,
        title: `${selectedService.nameAr}`,
        type: selectedService.code === "CV_GEN" ? "CV" : selectedService.code === "INVOICE" ? "INVOICE" : "DOC",
        customerName: customerName.trim() || "زبون المحل",
        createdAt: new Date().toISOString(),
        salePrice,
      };

      setDocuments((prev) => [newDoc, ...prev]);

      // Update daily summary
      setDailyStats((prev) => ({
        docsCount: prev.docsCount + 1,
        pointsUsed: prev.pointsUsed + cost,
        estimatedProfitDZD: prev.estimatedProfitDZD + profit,
      }));

      trackEvent("document_generated", { code: selectedService.code });
      setGenSuccessMessage(`تم إنشاء ${selectedService.nameAr} بنجاح وتحميل ملف الـ PDF!`);

      setTimeout(() => {
        setSelectedService(null);
        setCustomerName("");
        setGenSuccessMessage("");
      }, 1500);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Zero balance banner at top if points === 0 */}
      {points <= 0 && <ZeroBalanceBanner onTopUp={() => handleRecharge(100)} />}

      {/* Main Grid: Responsive 2-column layout on Desktop, Single-column on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Main Column (2 spans on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Search Input */}
          <QuickSearch onSelectService={(svc) => setSelectedService(svc)} />

          {/* Frequent Services Row */}
          <FrequentServices
            services={frequentServices}
            onSelectService={(svc) => setSelectedService(svc)}
          />

          {/* Full Services Grid */}
          <div id="services">
            <ServicesFullGrid onSelectService={(svc) => setSelectedService(svc)} />
          </div>

          {/* Recent Documents */}
          <div id="recent-docs">
            <RecentDocuments
              documents={documents}
              onCreateNewDoc={() => setSelectedService(SERVICES_CATALOG[0])}
            />
          </div>
        </div>

        {/* Right / Sidebar Column (Desktop side column per PRD 7.4) */}
        <div className="space-y-6">
          {/* Balance Card */}
          <div id="wallet">
            <BalanceCard points={points} onRecharge={handleRecharge} />
          </div>

          {/* Daily Activity Summary */}
          <DailySummary
            docsCount={dailyStats.docsCount}
            pointsUsed={dailyStats.pointsUsed}
            estimatedProfitDZD={dailyStats.estimatedProfitDZD}
          />

          {/* Starter Checklist for shop owner */}
          <StarterChecklist />

          {/* WhatsApp Support Card */}
          <SupportCard />
        </div>
      </div>

      {/* Document Generation Modal */}
      {selectedService && (
        <Modal
          isOpen={Boolean(selectedService)}
          onClose={() => {
            if (!isGenerating) {
              setSelectedService(null);
              setGenSuccessMessage("");
            }
          }}
          title={`إنشاء: ${selectedService.nameAr}`}
          description={`تكلفة الخدمة: ${selectedService.isFree ? "مجاني" : `${selectedService.pointsCost} نقطة`} · جاهزة في ثوانٍ`}
        >
          {genSuccessMessage ? (
            <div className="text-center py-6 space-y-3">
              <span className="text-4xl block">🎉</span>
              <h4 className="text-base font-bold text-white">{genSuccessMessage}</h4>
              <p className="text-xs text-emerald-400">تم حفظ الوثيقة في سجل محلك وجاهزة للطباعة أو الإرسال.</p>
            </div>
          ) : (
            <form onSubmit={handleGenerateDoc} className="space-y-4 text-right">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  اسم ولقب الزبون:
                </label>
                <input
                  type="text"
                  placeholder="مثال: كريم بن يحيى"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">رصيدك الحالي:</span>
                  <span className="font-bold text-white font-mono">{points} نقطة</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">تكلفة هذه الوثيقة:</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    {selectedService.isFree ? "0 نقطة" : `-${selectedService.pointsCost} نقطة`}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-1 text-[11px]">
                  <span className="text-slate-400">الرصيد المتبقي:</span>
                  <span className="font-mono text-slate-200">
                    {Math.max(0, points - selectedService.pointsCost)} نقطة
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setSelectedService(null)}
                  disabled={isGenerating}
                  className="w-1/3"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isGenerating}
                  disabled={!selectedService.isFree && points < selectedService.pointsCost}
                  className="w-2/3 font-bold"
                >
                  <span>توليد المستند والطباعة ⚡</span>
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
