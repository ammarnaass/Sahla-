"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import { SidebarShopProfile } from "./SidebarShopProfile";
import { SidebarNavLinks } from "./SidebarNavLinks";

export interface DesktopSidebarProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

import { ArrowLeftIcon } from "@/components/ui/Icons";

export function DesktopSidebar({
  activeTab = "overview",
  onSelectTab,
}: DesktopSidebarProps) {
  const { session, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";
  const isEmployee = session?.user?.role === "EMPLOYEE";

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-l border-slate-800/80 min-h-screen p-5 shrink-0 justify-between select-none">
      <div className="space-y-6">
        <SidebarShopProfile
          shopName={session?.shop?.name}
          userName={session?.user?.name}
          isSuperAdmin={isSuperAdmin}
          isEmployee={isEmployee}
        />

        <SidebarNavLinks
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          isSuperAdmin={isSuperAdmin}
          isEmployee={isEmployee}
        />
      </div>

      {/* Footer controls: theme toggle and logout */}
      <div className="pt-4 border-t border-slate-800/80 space-y-2">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
        >
          <span>نمط المظهر</span>
          <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
            {theme === "dark" ? "الوضع الداكن" : "الوضع الفاتح"}
          </span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
        >
          <span>تسجيل الخروج</span>
          <ArrowLeftIcon size={14} className="text-rose-400/80" />
        </button>
      </div>
    </aside>
  );
}
