"use client";

import React from "react";
import Link from "next/link";
import {
  Crown,
  ArrowLeft,
  ShieldCheck,
  Radio,
  Sparkles,
  Receipt,
  Menu,
  LogOut,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

interface AdminHeaderProps {
  onOpenBroadcast?: () => void;
  onOpenNewService?: () => void;
  onOpenCreateInvoice?: () => void;
  onToggleMobileMenu?: () => void;
}

export function AdminHeader({
  onOpenBroadcast,
  onOpenNewService,
  onOpenCreateInvoice,
  onToggleMobileMenu,
}: AdminHeaderProps) {
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-background/90 border-b border-border px-4 sm:px-6 h-16 flex items-center justify-between transition-colors">
      {/* Right / Brand: Logo & Title (RTL: right side) */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            title="فتح القائمة"
          >
            <Menu size={18} />
          </button>
        )}

        <Link href="/admin" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-600 to-emerald-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-md group-hover:scale-105 transition-transform">
            <Crown size={20} className="text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm sm:text-base text-foreground font-cairo">
                لوحة تحكم مدير النظام الشاملة
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <ShieldCheck size={12} /> SUPER ADMIN
              </span>
            </div>
            <span className="block text-[10px] text-muted-foreground font-medium">
              المنظومة المركزية لمتابعة 58 ولاية والكاونتر الرقمي · {siteConfig.name} {siteConfig.version}
            </span>
          </div>
        </Link>
      </div>

      {/* Left: Quick Launch Action Buttons & Toggles (RTL: left side) */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Cloud Health Live Pill */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/50 border border-border text-[11px] font-bold text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>السحابة المركزية متصلة · 58 ولاية</span>
        </div>

        {/* 1. Quick Emergency Broadcast */}
        {onOpenBroadcast && (
          <button
            type="button"
            onClick={onOpenBroadcast}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-400 border border-amber-500/30 transition-all cursor-pointer font-cairo shadow-xs active:scale-95"
            title="بث تنبيه عاجل لجميع الأكشاك في الـ 58 ولاية"
          >
            <Radio size={14} className="animate-pulse text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">بث وطني</span>
          </button>
        )}

        {/* 2. Quick Service Studio Launcher */}
        {onOpenNewService && (
          <button
            type="button"
            onClick={onOpenNewService}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer font-cairo shadow-xs active:scale-95"
            title="فتح استوديو توليد وثائق A4 (سيرة ذاتية، صور، بطاقة رمادية...)"
          >
            <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">خدمة جديدة</span>
          </button>
        )}

        {/* 3. Quick B2B Invoice Creator */}
        {onOpenCreateInvoice && (
          <button
            type="button"
            onClick={onOpenCreateInvoice}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-muted/60 hover:bg-muted text-foreground border border-border transition-all cursor-pointer font-cairo shadow-xs active:scale-95"
            title="إصدار فاتورة رسمية B2B لمحل أو موزع"
          >
            <Receipt size={14} className="text-muted-foreground" />
            <span>فاتورة جديدة</span>
          </button>
        )}

        {/* Theme Toggle */}
        <ThemeToggle variant="icon" />

        {/* Back to Home / Public site */}
        <Link
          href="/"
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs active:scale-95"
          title="الرجوع إلى الصفحة الرئيسية"
        >
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">الرئيسية</span>
        </Link>

        {/* Quick Logout Button */}
        <button
          type="button"
          onClick={() => logout()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 transition-all shadow-xs active:scale-95 cursor-pointer font-cairo"
          title="تسجيل الخروج من لوحة تحكم مدير النظام"
        >
          <LogOut size={14} className="text-rose-500 shrink-0" />
          <span className="hidden sm:inline">خروج</span>
        </button>
      </div>
    </header>
  );
}
