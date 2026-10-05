"use client";

import React from "react";
import Link from "next/link";
import { DesktopSidebar } from "@/components/dashboard/DesktopSidebar";
import { BottomNavBar } from "@/components/dashboard/BottomNavBar";
import { NotificationBell } from "@/components/dashboard/NotificationBell";
import { OfflineBanner } from "@/components/dashboard/OfflineBanner";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { DashboardTabProvider, useDashboardTab } from "@/contexts/DashboardTabContext";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const { locale, setLocale } = useLanguage();
  const { activeTab, setActiveTab } = useDashboardTab();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row selection:bg-emerald-500 selection:text-white">
      {/* Desktop Right Sidebar (RTL) with Tab sync */}
      <DesktopSidebar activeTab={activeTab} onSelectTab={(t) => setActiveTab(t as any)} />

      {/* Main Body */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Offline indicator banner */}
        <OfflineBanner />

        {/* Mobile & Top Header */}
        <header className="sticky top-0 z-30 backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80 px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Left: Mobile Brand & Shop Name */}
          <div className="flex items-center gap-3">
            <Link href="/" className="md:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-extrabold text-sm">
                سـ
              </div>
            </Link>

            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-white line-clamp-1">
                {session?.shop?.name || "مكتبة الأمل الرقمية"}
              </h2>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>
                  {session?.user?.role === "SUPER_ADMIN"
                    ? "👑 مدير النظام العام"
                    : session?.user?.role === "EMPLOYEE"
                    ? "👤 موظف كاونتر"
                    : "🛡️ متصل · رصيد النقاط نشط"}
                </span>
              </span>
            </div>
          </div>

          {/* Right: Notification bell + Language switch */}
          <div className="flex items-center gap-2.5">
            {/* Quick Lang Switch on Mobile */}
            <div className="md:hidden flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800 text-[11px] font-bold">
              <button
                onClick={() => setLocale(locale === "ar" ? "fr" : "ar")}
                className="text-slate-300 hover:text-white"
              >
                {locale === "ar" ? "FR" : "عربي"}
              </button>
            </div>

            {/* Notification Bell */}
            <NotificationBell />
          </div>
        </header>

        {/* Main Dashboard Pages */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar with Tab sync */}
      <BottomNavBar activeTab={activeTab} onSelectTab={(t) => setActiveTab(t as any)} />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardTabProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </DashboardTabProvider>
  );
}
