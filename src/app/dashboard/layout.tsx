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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      {/* Desktop Right Sidebar (RTL) with Tab sync */}
      <DesktopSidebar activeTab={activeTab} onSelectTab={(t) => setActiveTab(t as any)} />

      {/* Main Body */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Offline indicator banner */}
        <OfflineBanner />

        {/* Mobile & Top Header */}
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/90 dark:bg-slate-950/85 border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-6 h-16 flex items-center justify-between transition-colors">
          {/* Left: Mobile Brand & Shop Name */}
          <div className="flex items-center gap-3">
            <Link href="/" className="md:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-emerald-800/30">
                سـ
              </div>
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white line-clamp-1">
                  {session?.shop?.name || "كشك النجاح للخدمات الرقمية"}
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                  {session?.shop?.wilaya || "ولاية الجزائر (16)"}
                </span>
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
                <span>
                  {session?.user?.role === "SUPER_ADMIN"
                    ? "👑 مدير النظام العام"
                    : session?.user?.role === "EMPLOYEE"
                    ? "👤 موظف كاونتر"
                    : "🟢 متصل بالسحابة · نظام الكاونتر نشط"}
                </span>
              </span>
            </div>
          </div>

          {/* Right: Quick Launch Button + Notification bell + Language switch */}
          <div className="flex items-center gap-2.5">
            {/* Algerian Date Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>موسم 2026 / 2027</span>
            </div>

            {/* Quick Points Pill */}
            <button
              type="button"
              onClick={() => setActiveTab("wallet")}
              title="رصيد المحفظة المتاح - اضغط للشحن"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-slate-900 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-black hover:border-emerald-500/50 hover:scale-[1.02] transition-all cursor-pointer shadow-xs"
            >
              <span>💎</span>
              <span>{(session?.shop?.points || 1250).toLocaleString()}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">نقطة</span>
            </button>

            {/* High-Velocity Service Launcher */}
            <button
              type="button"
              onClick={() => setActiveTab("services")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-black shadow-md shadow-emerald-950/40 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>⚡</span>
              <span className="hidden xs:inline">خدمة جديدة</span>
            </button>

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
