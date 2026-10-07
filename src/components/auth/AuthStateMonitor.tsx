"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Crown, Store, UserCheck, LogOut, ArrowLeft, Shield, Eye } from "lucide-react";

export function AuthStateMonitor() {
  const { session, isLoggedIn, logout } = useAuth();

  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";
  const isShopOwner = session?.user?.role === "SHOP_ADMIN" || session?.user?.role === "OWNER";
  const isEmployee = session?.user?.role === "STAFF" || session?.user?.role === "EMPLOYEE";

  return (
    <div className="w-full mb-6 p-3.5 sm:p-4 rounded-2xl bg-muted/40 border border-border/80 shadow-2xs backdrop-blur-md text-right transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Info */}
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="relative flex h-3 w-3 mt-1 sm:mt-0 shrink-0">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isLoggedIn ? "bg-emerald-400" : "bg-slate-400"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                isLoggedIn ? "bg-emerald-500" : "bg-slate-400"
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-foreground font-cairo">
                {isLoggedIn ? "مراقب الجلسة: متصل بالنظام" : "مراقب الجلسة: وضع زائر غير مسجل"}
              </span>

              {isLoggedIn ? (
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    isSuperAdmin
                      ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                      : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                  }`}
                >
                  {isSuperAdmin ? (
                    <>
                      <Crown size={11} /> مدير النظام العام
                    </>
                  ) : isShopOwner ? (
                    <>
                      <Store size={11} /> صاحب كشك
                    </>
                  ) : (
                    <>
                      <UserCheck size={11} /> موظف كاونتر
                    </>
                  )}
                </span>
              ) : (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                  ضيف
                </span>
              )}
            </div>

            <p className="text-[11px] text-muted-foreground mt-0.5">
              {isLoggedIn ? (
                <>
                  الحساب النشط:{" "}
                  <span className="font-bold text-foreground">
                    {session?.user?.name || session?.shop?.name}
                  </span>{" "}
                  {session?.user?.email && `(${session.user.email})`}
                </>
              ) : (
                "لم يتم تسجيل الدخول بعد. يمكنك إدخال بياناتك أو التجول كزائر."
              )}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {isLoggedIn ? (
            <>
              {isSuperAdmin ? (
                <Link
                  href="/admin"
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs transition-all flex items-center gap-1 shadow-xs"
                >
                  <span>لوحة الإدارة</span>
                  <ArrowLeft size={12} />
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-1 shadow-xs"
                >
                  <span>لوحة المحل</span>
                  <ArrowLeft size={12} />
                </Link>
              )}

              <button
                type="button"
                onClick={() => logout()}
                className="px-2.5 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                title="تسجيل الخروج من الجلسة الحالية"
              >
                <LogOut size={12} />
                <span>خروج</span>
              </button>
            </>
          ) : (
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 border border-border text-foreground hover:text-emerald-600 dark:hover:text-emerald-400 font-bold text-xs transition-colors flex items-center gap-1.5"
              title="تصفح الكاونتر والخدمات بدون تسجيل"
            >
              <Eye size={13} />
              <span>معاينة كضيف</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
