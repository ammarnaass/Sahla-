"use client";

import React from "react";
import Link from "next/link";
import { CrownIcon, StoreIcon, ShieldCheckIcon } from "@/components/ui/Icons";

interface SidebarShopProfileProps {
  shopName?: string;
  userName?: string;
  isSuperAdmin: boolean;
  isEmployee: boolean;
}

export function SidebarShopProfile({
  shopName,
  userName,
  isSuperAdmin,
  isEmployee,
}: SidebarShopProfileProps) {
  return (
    <div className="space-y-6">
      {/* Brand Header */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-emerald-700/25 group-hover:scale-105 transition-transform">
          سـ
        </div>
        <div>
          <div className="font-extrabold text-white text-base">سهلة · Sahla</div>
          <div className="text-[10px] text-slate-400 font-medium">نظام كاونتر المستندات</div>
        </div>
      </Link>

      {/* Shop Info Card with RBAC Badge */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-right space-y-1.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
              isSuperAdmin
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                : isEmployee
                ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
            }`}
          >
            {isSuperAdmin ? (
              <>
                <CrownIcon className="w-3 h-3 text-amber-400" />
                <span>مدير النظام</span>
              </>
            ) : isEmployee ? (
              <span>موظف كاونتر</span>
            ) : (
              <>
                <ShieldCheckIcon className="w-3 h-3 text-emerald-400" />
                <span>مالك المحل</span>
              </>
            )}
          </span>
          <StoreIcon className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="text-xs font-bold text-white truncate">
          {shopName || "مكتبة الأمل الرقمية"}
        </div>
        <div className="text-[10px] text-slate-400 truncate">
          المسؤول: {userName || "أحمد بوعزيز"}
        </div>
      </div>
    </div>
  );
}
