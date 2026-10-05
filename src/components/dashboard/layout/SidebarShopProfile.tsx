"use client";

import React from "react";
import Link from "next/link";
import { CrownIcon, StoreIcon, ShieldCheckIcon, SchoolCapIcon } from "@/components/ui/Icons";

interface SidebarShopProfileProps {
  shopName?: string;
  userName?: string;
  wilayaName?: string;
  wilayaCode?: number | string;
  isSuperAdmin: boolean;
  isEmployee: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function SidebarShopProfile({
  shopName,
  userName,
  wilayaName = "الجزائر",
  wilayaCode = "16",
  isSuperAdmin,
  isEmployee,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarShopProfileProps) {
  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center gap-3">
        {/* Brand Icon */}
        <Link
          href="/"
          title="سهلة · الرئيسية"
          className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-emerald-700/25 hover:scale-105 transition-transform"
        >
          سـ
        </Link>

        {/* Mini Shop Beacon Avatar */}
        <div
          title={`${shopName || "مكتبة الأمل"} (${wilayaName})`}
          className="relative w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-xs"
        >
          <StoreIcon size={16} className="text-emerald-500 dark:text-emerald-400" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950 beacon-pulse" />
        </div>

        {/* Expand toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          title="توسيع القائمة الجانبية"
          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Brand Header + Collapse Button */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-emerald-700/30 group-hover:scale-105 transition-transform">
            سـ
          </div>
          <div>
            <div className="font-black text-slate-900 dark:text-white text-base tracking-tight flex items-center gap-1.5">
              <span>سهلة</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/25">
                v2.0
              </span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">نظام كاونتر المستندات</div>
          </div>
        </Link>

        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            title="طي القائمة الجانبية"
            className="w-7 h-7 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-center transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Shop Info Card with Live Online Beacon */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800/90 text-right space-y-2 shadow-xs dark:shadow-sm relative overflow-hidden">
        {/* Subtle accent corner */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between">
          {/* Live Online Badge */}
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
              {wilayaName} ({wilayaCode})
            </span>
          </div>

          {/* RBAC Role Tag */}
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
              isSuperAdmin
                ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                : isEmployee
                ? "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/30"
                : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
            }`}
          >
            {isSuperAdmin ? (
              <>
                <CrownIcon size={11} className="text-amber-600 dark:text-amber-400" />
                <span>مدير النظام</span>
              </>
            ) : isEmployee ? (
              <span>موظف كاونتر</span>
            ) : (
              <>
                <ShieldCheckIcon size={11} className="text-emerald-600 dark:text-emerald-400" />
                <span>مالك المحل</span>
              </>
            )}
          </span>
        </div>

        <div>
          <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
            {shopName || "كشك النجاح للخدمات الرقمية"}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
            المشغل: <span className="text-slate-800 dark:text-slate-300 font-medium">{userName || "المسؤول"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
