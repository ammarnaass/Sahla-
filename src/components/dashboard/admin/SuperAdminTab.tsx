"use client";

import React from "react";
import { useSuperAdminMetrics } from "@/hooks/dashboard/useSuperAdminMetrics";
import { AdminHeaderStats } from "./AdminHeaderStats";
import { AdminShopsTable } from "./AdminShopsTable";

export function SuperAdminTab() {
  const admin = useSuperAdminMetrics();

  return (
    <div className="space-y-8 text-right animate-in fade-in duration-200">
      <AdminHeaderStats
        totalShops={admin.shops.length}
        activeCount={admin.activeCount}
        totalPoints={admin.totalPoints}
        totalDocs={admin.totalDocs}
      />

      {admin.notice && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/40 rounded-2xl text-xs text-amber-800 dark:text-amber-300 font-bold animate-in fade-in transition-colors">
          {admin.notice}
        </div>
      )}

      <AdminShopsTable
        shops={admin.filteredShops}
        search={admin.search}
        onSearchChange={admin.setSearch}
        onTopup={admin.topupShop}
        onToggleStatus={admin.toggleShopStatus}
      />
    </div>
  );
}
