"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/components/ui/ThemeProvider";
import { SidebarShopProfile } from "./SidebarShopProfile";
import { SidebarNavLinks } from "./SidebarNavLinks";
import { SidebarWalletWidget } from "./SidebarWalletWidget";
import { ArrowLeftIcon, WirelessPrintIcon } from "@/components/ui/Icons";

export interface DesktopSidebarProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  walletPoints?: number;
}

export function DesktopSidebar({
  activeTab = "overview",
  onSelectTab,
  walletPoints,
}: DesktopSidebarProps) {
  const { session, logout } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? (resolvedTheme || theme || "dark") : "dark";

  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";
  const isEmployee = session?.user?.role === "EMPLOYEE" || session?.user?.role === "STAFF";

  const effectivePoints = walletPoints !== undefined ? walletPoints : session?.shop?.points || 1450;

  return (
    <aside
      className={`hidden md:flex flex-col glass-sidebar min-h-screen shrink-0 justify-between select-none transition-all duration-300 relative z-30 ${
        isCollapsed ? "w-20 p-3" : "w-64 p-4"
      }`}
    >
      {/* Top Section */}
      <div className="space-y-4">
        <SidebarShopProfile
          shopName={session?.shop?.name}
          userName={session?.user?.name}
          wilayaName={session?.shop?.wilaya || "الجزائر"}
          wilayaCode={session?.shop?.wilayaCode || "16"}
          isSuperAdmin={isSuperAdmin}
          isEmployee={isEmployee}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />

        {/* Live Wallet & Quick Top-Up Widget */}
        <SidebarWalletWidget
          points={effectivePoints}
          isCollapsed={isCollapsed}
          onOpenWallet={() => onSelectTab && onSelectTab("wallet")}
        />

        {/* Navigation items */}
        <SidebarNavLinks
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          isSuperAdmin={isSuperAdmin}
          isEmployee={isEmployee}
          isCollapsed={isCollapsed}
        />
      </div>

      {/* Bottom Section */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-2 mt-4">
        {/* Wireless Printer Status Card (Counter Ready) */}
        {!isCollapsed ? (
          <div
            onClick={() => onSelectTab && onSelectTab("settings")}
            className="p-2.5 rounded-xl bg-slate-100/90 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/70 hover:border-emerald-500/30 flex items-center justify-between transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                طابعة الكاونتر
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              <WirelessPrintIcon size={12} />
              <span>جاهزة ✓</span>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab("settings")}
            title="طابعة الكاونتر: جاهزة للطباعة الفورية"
            className="w-10 h-10 mx-auto rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:scale-105 transition-all cursor-pointer shadow-2xs"
          >
            <WirelessPrintIcon size={16} />
          </button>
        )}

        {/* Theme toggle & Logout */}
        <div className={`flex ${isCollapsed ? "flex-col items-center" : "flex-row"} gap-1.5`}>
          <button
            type="button"
            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            title="تبديل المظهر (ليلي / نهاري)"
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-900/80 transition-all cursor-pointer ${
              isCollapsed ? "w-10 h-10 justify-center p-0" : "flex-1"
            }`}
          >
            {isCollapsed ? (
              <span>{currentTheme === "dark" ? "🌙" : "☀️"}</span>
            ) : (
              <>
                <span className="flex items-center gap-1.5">
                  <span>{currentTheme === "dark" ? "🌙" : "☀️"}</span>
                  <span className="text-[11px]">المظهر</span>
                </span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                  {currentTheme === "dark" ? "ليلي" : "نهاري"}
                </span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={logout}
            title="تسجيل الخروج من المنصة"
            className={`flex items-center justify-center p-2 rounded-xl text-xs font-bold text-rose-600/80 dark:text-rose-400/80 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer ${
              isCollapsed ? "w-10 h-10" : "px-3"
            }`}
          >
            <ArrowLeftIcon size={14} className="text-rose-500 dark:text-rose-400/80" />
            {!isCollapsed && <span className="mr-1.5 text-[11px]">خروج</span>}
          </button>
        </div>

        {/* Algerian Version Tag */}
        {!isCollapsed && (
          <div className="text-center pt-1 text-[9px] text-slate-400 dark:text-slate-500 font-medium">
            سهلة · Sahla v2.0.4 · الجزائر 🇩🇿
          </div>
        )}
      </div>
    </aside>
  );
}
