"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  Crown,
  Store,
  UserCheck,
  LogOut,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export function UserNavDropdown() {
  const { session, isLoggedIn, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isLoggedIn || !session) return null;

  const isSuperAdmin = session.user?.role === "SUPER_ADMIN";
  const isShopOwner = session.user?.role === "SHOP_ADMIN" || session.user?.role === "OWNER";
  const isEmployee = session.user?.role === "STAFF" || session.user?.role === "EMPLOYEE";

  // Initials or short label
  const initial = (session.user?.name || (isSuperAdmin ? "م" : "ك"))[0];

  return (
    <div className="relative inline-block text-right" ref={dropdownRef}>
      {/* Circular Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="قائمة المستخدم والجلسة"
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 relative cursor-pointer group shadow-sm select-none ${
          isSuperAdmin
            ? "bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-400 text-slate-950 ring-2 ring-amber-500/40 hover:ring-amber-500 shadow-amber-950/20"
            : isShopOwner
            ? "bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-white ring-2 ring-emerald-500/40 hover:ring-emerald-500 shadow-emerald-950/20"
            : "bg-gradient-to-tr from-blue-600 to-cyan-500 text-white ring-2 ring-blue-500/40 hover:ring-blue-500"
        } hover:scale-105 active:scale-95`}
        title={`مراقب الجلسة: ${session.user?.name || "متصل"} (${isSuperAdmin ? "مدير النظام" : "صاحب كشك"})`}
      >
        {isSuperAdmin ? (
          <Crown size={19} className="text-slate-950" />
        ) : isShopOwner ? (
          <Store size={18} className="text-white" />
        ) : (
          <UserCheck size={18} className="text-white" />
        )}

        {/* Live Active Ping Dot */}
        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
        </span>
      </button>

      {/* Flyout Dropdown Menu */}
      {isOpen && (
        <>
          <div
            dir="rtl"
            className="
              fixed inset-x-3 top-18 z-50 
              sm:absolute sm:top-13 sm:inset-x-auto sm:left-0 sm:right-auto 
              w-auto sm:w-[330px] max-w-[calc(100vw-1.5rem)]
              bg-card/95 backdrop-blur-2xl border border-border 
              rounded-2xl shadow-2xl p-4 text-right 
              animate-in fade-in zoom-in-95 duration-150 
              flex flex-col space-y-3.5 ring-1 ring-border/50
            "
          >
            {/* Caret pointing to circular trigger */}
            <div className="hidden sm:block absolute -top-1.5 left-4.5 w-3 h-3 bg-card border-t border-l border-border rotate-45 pointer-events-none z-10" />

            {/* Header: Session Monitor & Role Badge */}
            <div className="pb-3 border-b border-border/70 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-foreground">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span>مراقب الجلسة: متصل بالنظام</span>
                </div>

                <span
                  className={`text-[10.5px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    isSuperAdmin
                      ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                      : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                  }`}
                >
                  {isSuperAdmin ? (
                    <>
                      <Crown size={12} /> مدير النظام العام
                    </>
                  ) : isShopOwner ? (
                    <>
                      <Store size={12} /> صاحب كشك
                    </>
                  ) : (
                    <>
                      <UserCheck size={12} /> موظف كاونتر
                    </>
                  )}
                </span>
              </div>

              {/* Active Account Info */}
              <div className="p-2.5 rounded-xl bg-muted/50 border border-border/60 text-xs space-y-1">
                <div className="text-[11px] text-muted-foreground font-medium">الحساب النشط:</div>
                <div className="font-bold text-foreground text-xs leading-snug">
                  {session.user?.name || (isSuperAdmin ? "مدير منصة سهلة المركزي" : "صاحب كشك النجاح")}{" "}
                  <span className="font-mono text-[10.5px] text-muted-foreground font-normal" dir="ltr">
                    ({session.user?.email || (isSuperAdmin ? "admin@sahla.dz" : "najah.kiosk@gmail.com")})
                  </span>
                </div>
                {session.shop?.name && !isSuperAdmin && (
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold pt-0.5">
                    🏢 {session.shop.name}
                  </div>
                )}
              </div>
            </div>

            {/* Main Action Links */}
            <div className="space-y-2">
              {isSuperAdmin ? (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center justify-between transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  <div className="flex items-center gap-2">
                    <Crown size={15} />
                    <span>لوحة الإدارة</span>
                  </div>
                  <ArrowLeft size={14} />
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs flex items-center justify-between transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  <div className="flex items-center gap-2">
                    <Store size={15} />
                    <span>لوحة المحل والكاونتر</span>
                  </div>
                  <ArrowLeft size={14} />
                </Link>
              )}
            </div>

            {/* Logout Button */}
            <div className="pt-2 border-t border-border/70">
              <button
                type="button"
                onClick={async () => {
                  setIsOpen(false);
                  await logout();
                }}
                className="w-full py-2 px-3 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <LogOut size={14} />
                  <span>خروج</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-normal">إنهاء الجلسة</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
