"use client";

import React from "react";
import { BarChart3, Store, Receipt, CreditCard, Shield } from "lucide-react";

export type AdminTabType = "analytics" | "shops" | "invoices" | "wholesale" | "admins";

interface AdminTabNavProps {
  activeTab: AdminTabType;
  setActiveTab: (tab: AdminTabType) => void;
  shopsCount?: number;
  invoicesCount?: number;
}

export function AdminTabNav({
  activeTab,
  setActiveTab,
  shopsCount = 0,
  invoicesCount = 0,
}: AdminTabNavProps) {
  const tabs = [
    {
      id: "analytics" as AdminTabType,
      label: "المؤشرات والتحليلات",
      icon: BarChart3,
    },
    {
      id: "shops" as AdminTabType,
      label: "شبكة المحلات والأكشاك",
      icon: Store,
      badge: shopsCount > 0 ? shopsCount : undefined,
    },
    {
      id: "invoices" as AdminTabType,
      label: "الفوترة والاشتراكات",
      icon: Receipt,
      badge: invoicesCount > 0 ? invoicesCount : undefined,
    },
    {
      id: "wholesale" as AdminTabType,
      label: "كروت الشحن والموزعين",
      icon: CreditCard,
    },
    {
      id: "admins" as AdminTabType,
      label: "فريق إدارة النظام",
      icon: Shield,
    },
  ];

  return (
    <div className="border-b border-border bg-card/60 px-4 sm:px-6">
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                isActive
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black ${
                    isActive
                      ? "bg-background text-foreground"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
