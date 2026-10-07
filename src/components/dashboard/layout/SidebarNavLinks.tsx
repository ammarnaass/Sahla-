"use client";

import React from "react";
import {
  SchoolCapIcon,
  DocCvIcon,
  CardEpayIcon,
  CustomersIcon,
  CrownIcon,
  WirelessPrintIcon,
  SparklesIcon,
} from "@/components/ui/Icons";

interface SidebarNavLinksProps {
  activeTab: string;
  onSelectTab?: (tab: string) => void;
  isSuperAdmin: boolean;
  isEmployee: boolean;
  isCollapsed?: boolean;
}

interface NavItem {
  id: string;
  label: string;
  category: "core" | "finance" | "config";
  shortcut?: string;
  badge?: string;
  hideForEmployee?: boolean;
  superAdminOnly?: boolean;
  icon: React.ReactNode;
}

export function SidebarNavLinks({
  activeTab,
  onSelectTab,
  isSuperAdmin,
  isEmployee,
  isCollapsed = false,
}: SidebarNavLinksProps) {
  const allNavItems: NavItem[] = [
    {
      id: "overview",
      label: "الرئيسية والكاونتر",
      category: "core",
      shortcut: "⌘1",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      id: "exams",
      label: "امتحانات وفروض",
      category: "core",
      shortcut: "⌘E",
      badge: "ONEC",
      icon: <SchoolCapIcon size={16} className="text-blue-600 dark:text-blue-400" />,
    },
    {
      id: "services",
      label: "دليل الخدمات واستوديو v2.0",
      category: "core",
      shortcut: "⌘2",
      badge: "جديد",
      icon: <SparklesIcon size={16} className="text-emerald-600 dark:text-emerald-400" />,
    },
    {
      id: "documents",
      label: "سجل الوثائق والمستندات",
      category: "core",
      shortcut: "⌘3",
      icon: <DocCvIcon size={16} />,
    },
    {
      id: "wallet",
      label: "المحفظة والشحن",
      category: "finance",
      shortcut: "⌘4",
      hideForEmployee: true,
      icon: <CardEpayIcon size={16} />,
    },
    {
      id: "account",
      label: "الموظفون وتسيير المحل",
      category: "finance",
      shortcut: "⌘5",
      hideForEmployee: true,
      icon: <CustomersIcon size={16} />,
    },
    {
      id: "settings",
      label: "إعدادات الطباعة والربط",
      category: "config",
      icon: <WirelessPrintIcon size={16} />,
    },
    {
      id: "superadmin",
      label: "إدارة النظام (58 ولاية)",
      category: "config",
      superAdminOnly: true,
      badge: "أدمن",
      icon: <CrownIcon size={16} className="text-amber-400" />,
    },
  ];

  const visibleItems = allNavItems.filter((item) => {
    if (item.superAdminOnly && !isSuperAdmin) return false;
    if (item.hideForEmployee && isEmployee) return false;
    return true;
  });

  const categories = [
    { key: "core", label: "العمليات الأساسية" },
    { key: "finance", label: "المحفظة والإدارة" },
    { key: "config", label: "التهيئة والتحكم" },
  ];

  if (isCollapsed) {
    return (
      <nav className="space-y-1.5 flex flex-col items-center">
        {visibleItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab && onSelectTab(item.id)}
              title={`${item.label} (${item.shortcut || ""})`}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer relative group ${
                isActive
                  ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/35 shadow-sm shadow-emerald-950/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent"
              }`}
            >
              {item.icon}
              {item.badge && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              )}
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="space-y-4">
      {categories.map((cat) => {
        const catItems = visibleItems.filter((i) => i.category === cat.key);
        if (catItems.length === 0) return null;

        return (
          <div key={cat.key} className="space-y-1">
            <div className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
              {cat.label}
            </div>

            {catItems.map((item) => {
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab && onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-right cursor-pointer group ${
                    isActive
                      ? "sidebar-nav-active font-extrabold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/90 dark:hover:bg-slate-900/80 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`shrink-0 transition-transform group-hover:scale-110 ${
                        isActive
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                        {item.badge}
                      </span>
                    )}
                    {item.shortcut && (
                      <kbd className="hidden group-hover:inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        {item.shortcut}
                      </kbd>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}
