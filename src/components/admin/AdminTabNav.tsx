"use client";

import React from "react";
import {
  BarChart3,
  Store,
  Receipt,
  CreditCard,
  Shield,
  LayoutDashboard,
  Sparkles,
  FileText,
  Wallet,
  Printer,
  Brain,
  BookOpenCheck,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { UnifiedAdminTab } from "./layout/AdminUnifiedSidebar";

interface AdminTabNavProps {
  activeTab: UnifiedAdminTab;
  setActiveTab: (tab: UnifiedAdminTab) => void;
  shopsCount?: number;
  invoicesCount?: number;
  docsCount?: number;
}

export function AdminTabNav({
  activeTab,
  setActiveTab,
  shopsCount = 0,
  invoicesCount = 0,
  docsCount = 0,
}: AdminTabNavProps) {
  const { logout } = useAuth();

  const tabs = [
    {
      id: "analytics" as UnifiedAdminTab,
      label: "رادار الـ 58 ولاية",
      icon: BarChart3,
      badge: "مباشر",
    },
    {
      id: "ai-engine" as UnifiedAdminTab,
      label: "مزودو الذكاء الاصطناعي (Gateway)",
      icon: Brain,
      badge: "v2.0 ⚡",
    },
    {
      id: "shops" as UnifiedAdminTab,
      label: "شبكة الأكشاك",
      icon: Store,
      badge: shopsCount > 0 ? shopsCount : undefined,
    },
    {
      id: "invoices" as UnifiedAdminTab,
      label: "الفوترة B2B",
      icon: Receipt,
      badge: invoicesCount > 0 ? invoicesCount : undefined,
    },
    {
      id: "wholesale" as UnifiedAdminTab,
      label: "كروت الشحن",
      icon: CreditCard,
    },
    {
      id: "admins" as UnifiedAdminTab,
      label: "فريق الإشراف",
      icon: Shield,
    },

    {
      id: "services" as UnifiedAdminTab,
      label: "استوديو الخدمات A4",
      icon: Sparkles,
      badge: "v2.0",
    },
    {
      id: "overview" as UnifiedAdminTab,
      label: "كاونتر الكشك",
      icon: LayoutDashboard,
    },
    {
      id: "documents" as UnifiedAdminTab,
      label: "سجل الوثائق",
      icon: FileText,
      badge: docsCount > 0 ? docsCount : undefined,
    },
    {
      id: "wallet" as UnifiedAdminTab,
      label: "المحفظة والشحن",
      icon: Wallet,
    },
    {
      id: "settings" as UnifiedAdminTab,
      label: "الطباعة والربط",
      icon: Printer,
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
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black ${
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Mobile Quick Logout */}
        <button
          type="button"
          onClick={() => logout()}
          title="تسجيل الخروج من لوحة التحكم"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 transition-all shrink-0 cursor-pointer"
        >
          <LogOut size={14} className="text-rose-500" />
          <span>خروج</span>
        </button>
      </div>
    </div>
  );
}
