"use client";

import React from "react";
import { QuickSearch } from "@/components/dashboard/QuickSearch";
import { FrequentServices } from "@/components/dashboard/FrequentServices";
import { ServicesFullGrid } from "@/components/dashboard/ServicesFullGrid";
import { RecentDocuments } from "@/components/dashboard/RecentDocuments";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { DailySummary } from "@/components/dashboard/DailySummary";
import { StarterChecklist } from "@/components/dashboard/StarterChecklist";
import { SupportCard } from "@/components/dashboard/SupportCard";
import { SERVICES_CATALOG, type ServiceDefinition } from "@/lib/constants";
import type { DocumentRecord } from "@/hooks/dashboard/useDocumentsArchive";

interface DashboardOverviewTabProps {
  frequentServices: ServiceDefinition[];
  onSelectService: (svc: ServiceDefinition) => void;
  documents: DocumentRecord[];
  points: number;
  onRecharge: (pointsToAdd: number, desc?: string) => void;
  dailyStats: {
    docsCount: number;
    pointsUsed: number;
    estimatedProfitDZD: number;
  };
}

export function DashboardOverviewTab({
  frequentServices,
  onSelectService,
  documents,
  points,
  onRecharge,
  dailyStats,
}: DashboardOverviewTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
      {/* Main Content Column */}
      <div className="lg:col-span-2 space-y-6">
        <QuickSearch onSelectService={onSelectService} />

        <FrequentServices
          services={frequentServices}
          onSelectService={onSelectService}
        />

        <div id="services">
          <ServicesFullGrid onSelectService={onSelectService} />
        </div>

        <div id="recent-docs">
          <RecentDocuments
            documents={documents}
            onCreateNewDoc={() => onSelectService(SERVICES_CATALOG[0])}
          />
        </div>
      </div>

      {/* Side Overview Cards */}
      <div className="space-y-6">
        <BalanceCard points={points} onRecharge={onRecharge} />

        <DailySummary
          docsCount={dailyStats.docsCount}
          pointsUsed={dailyStats.pointsUsed}
          estimatedProfitDZD={dailyStats.estimatedProfitDZD}
        />

        <StarterChecklist />
        <SupportCard />
      </div>
    </div>
  );
}
