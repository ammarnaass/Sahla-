"use client";

import React from "react";
import Link from "next/link";
import {
  BarChart3,
  Store,
  Receipt,
  CreditCard,
  ShieldCheck,
  LayoutDashboard,
  Sparkles,
  FileText,
  Wallet,
  Printer,
  ChevronRight,
  ChevronLeft,
  Crown,
  Radio,
  ExternalLink,
  Brain,
  BookOpenCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

export type UnifiedAdminTab =
  | "analytics"
  | "ai-engine"
  | "shops"
  | "invoices"
  | "wholesale"
  | "admins"
  | "school-research"
  | "services"
  | "overview"
  | "documents"
  | "wallet"
  | "settings";

interface AdminUnifiedSidebarProps {
  activeTab: UnifiedAdminTab;
  onSelectTab: (tab: UnifiedAdminTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  shopsCount?: number;
  invoicesCount?: number;
  docsCount?: number;
  onOpenBroadcast?: () => void;
}

interface NavItemConfig {
  id: UnifiedAdminTab;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string | number;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline" | "primary" | "warning";
  shortcut?: string;
}

interface NavGroupConfig {
  title: string;
  items: NavItemConfig[];
}

export function AdminUnifiedSidebar({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  shopsCount = 0,
  invoicesCount = 0,
  docsCount = 0,
  onOpenBroadcast,
}: AdminUnifiedSidebarProps) {
  const { session } = useAuth();

  const groups: NavGroupConfig[] = [
    {
      title: "القيادة الوطنية المركزية (58 ولاية)",
      items: [
        {
          id: "analytics",
          label: "رادار الـ 58 ولاية والمؤشرات",
          icon: BarChart3,
          badge: "مباشر",
          badgeVariant: "primary",
          shortcut: "⌘1",
        },
        {
          id: "ai-engine",
          label: "محرك الذكاء الاصطناعي",
          icon: Brain,
          badge: "جديد",
          badgeVariant: "primary",
          shortcut: "⌘0",
        },
        {
          id: "shops",
          label: "شبكة الأكشاك والمحلات",
          icon: Store,
          badge: shopsCount > 0 ? shopsCount : undefined,
          shortcut: "⌘2",
        },
        {
          id: "invoices",
          label: "الفوترة وعقود B2B",
          icon: Receipt,
          badge: invoicesCount > 0 ? invoicesCount : undefined,
          shortcut: "⌘3",
        },
        {
          id: "wholesale",
          label: "كروت الشحن والموزعين",
          icon: CreditCard,
          shortcut: "⌘4",
        },
        {
          id: "admins",
          label: "فريق الإشراف والأمان",
          icon: ShieldCheck,
          shortcut: "⌘5",
        },
      ],
    },
    {
      title: "الخدمات والتعليم",
      items: [
        {
          id: "services",
          label: "دليل الخدمات واستوديو A4",
          icon: Sparkles,
          badge: "v2.0",
          badgeVariant: "warning",
          shortcut: "⌘7",
        },
        {
          id: "overview",
          label: "كاونتر الكشك والعمليات",
          icon: LayoutDashboard,
          shortcut: "⌘6",
        },
        {
          id: "documents",
          label: "سجل الوثائق والمستندات",
          icon: FileText,
          badge: docsCount > 0 ? docsCount : undefined,
          shortcut: "⌘8",
        },
        {
          id: "wallet",
          label: "محفظة الرصيد والشحن",
          icon: Wallet,
          shortcut: "⌘9",
        },
      ],
    },
    {
      title: "العتاد والربط",
      items: [
        {
          id: "settings",
          label: "إعدادات الطباعة والربط",
          icon: Printer,
        },
      ],
    },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col border-l border-border bg-card/70 backdrop-blur-xl shrink-0 select-none transition-all duration-300 relative z-30 ${
        isCollapsed ? "w-20 p-3" : "w-72 p-4"
      }`}
    >
      {/* 1. Header Profile & Collapse Button */}
      <div className="pb-4 border-b border-border/70 flex items-center justify-between gap-2">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-950/20 shrink-0">
              <Crown size={20} className="text-slate-950" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs text-foreground font-cairo truncate">
                  {session?.user?.name || "مدير النظام العام"}
                </span>
                <Badge variant="primary" className="text-[9px] px-1.5 py-0 font-mono">
                  سيادي
                </Badge>
              </div>
              <span className="block text-[10px] text-muted-foreground truncate font-sans">
                المنظومة المركزية · 58 ولاية
              </span>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-md">
            <Crown size={18} />
          </div>
        )}

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          title={isCollapsed ? "توسيع القائمة الجانبية" : "طي القائمة الجانبية"}
          className={`w-7 h-7 rounded-lg border border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer ${
            isCollapsed ? "mx-auto mt-2" : ""
          }`}
        >
          {isCollapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>

      {/* 2. Sovereign Broadcast Quick Action */}
      {!isCollapsed && onOpenBroadcast && (
        <div className="my-3">
          <button
            type="button"
            onClick={onOpenBroadcast}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/25 text-amber-700 dark:text-amber-400 text-xs font-bold transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span>بث وطني عاجل للولايات</span>
            </div>
            <Radio size={14} className="text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )}

      {/* 3. Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-2 space-y-5 no-scrollbar">
        {groups.map((grp) => (
          <div key={grp.title} className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 text-[10px] font-extrabold text-muted-foreground/80 uppercase tracking-wider mb-1 font-cairo">
                {grp.title}
              </div>
            )}

            <div className="space-y-1">
              {grp.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                if (isCollapsed) {
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectTab(item.id)}
                      title={`${item.label} ${item.shortcut ? `(${item.shortcut})` : ""}`}
                      className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center transition-all cursor-pointer relative group ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      }`}
                    >
                      <Icon size={18} />
                      {item.badge !== undefined && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
                      )}
                    </button>
                  );
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-right cursor-pointer group ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        size={16}
                        className={`shrink-0 transition-transform group-hover:scale-110 ${
                          isActive
                            ? "text-primary-foreground"
                            : "text-muted-foreground group-hover:text-foreground"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.badge !== undefined && (
                        <Badge
                          variant={isActive ? "outline" : (item.badgeVariant as any) || "secondary"}
                          className={`text-[9px] px-1.5 py-0 font-mono ${
                            isActive ? "border-primary-foreground/40 text-primary-foreground" : ""
                          }`}
                        >
                          {item.badge}
                        </Badge>
                      )}
                      {item.shortcut && (
                        <kbd
                          className={`hidden group-hover:inline-block text-[9px] font-mono px-1 py-0.5 rounded border ${
                            isActive
                              ? "bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground"
                              : "bg-muted border-border text-muted-foreground"
                          }`}
                        >
                          {item.shortcut}
                        </kbd>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 4. Bottom Footer Diagnostics */}
      <div className="pt-3 border-t border-border space-y-2 mt-auto">
        {!isCollapsed ? (
          <div className="p-2.5 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-[11px] font-bold text-foreground">السحابة المركزية</div>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
              99.9% جاهزة
            </span>
          </div>
        ) : (
          <div
            title="السحابة المركزية: 99.9% جاهزة"
            className="w-10 h-10 mx-auto rounded-xl bg-muted/40 border border-border flex items-center justify-center text-emerald-500"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
}
