"use client";

import React, { useState } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { useDashboardTab } from "@/contexts/DashboardTabContext";
import { Badge } from "@/components/ui/badge";
import {
  SparklesIcon,
  BoltIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
} from "@/components/ui/Icons";

function formatFullDate(dateStr?: string | null): string {
  if (!dateStr) return "الآن";
  try {
    const d = new Date(dateStr);
    return d.toLocaleString("ar-DZ", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return dateStr;
  }
}

export function NotificationsTab() {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    refetch,
  } = useNotifications();

  const { setActiveTab } = useDashboardTab();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "UNREAD" | "AI" | "BALANCE" | "LEGAL">("ALL");

  // Filtering
  const filteredList = notifications.filter((item) => {
    if (filterType === "UNREAD" && item.read) return false;
    if (filterType === "AI" && !item.type.startsWith("AI_")) return false;
    if (filterType === "BALANCE" && !item.type.includes("BALANCE") && !item.type.includes("POINTS"))
      return false;
    if (filterType === "LEGAL" && !item.type.includes("LEGAL") && !item.type.includes("DATA"))
      return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchBody = item.body.toLowerCase().includes(q);
      return matchTitle || matchBody;
    }
    return true;
  });

  return (
    <div className="space-y-6 text-right animate-fade-in">
      {/* 1. Header Banner */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shadow-xs">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-foreground font-display">
                مركز وسجل الإشعارات
              </h1>
              <Badge variant="primary" className="text-xs font-bold gap-1">
                <span>⚡ بث مباشر لحظي</span>
              </Badge>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 font-mono">
                  {unreadCount} غير مقروء
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              تتبع كافة التنبيهات الآنية، واكتمال توليد بحوث الذكاء الاصطناعي، وعمليات شحن النقاط، وتنبيهات حذف الوثائق المؤقتة وفق القانون 18-07.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllAsRead()}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
              >
                ✓ تحديد الكل كمقروء
              </button>
            )}

            <button
              type="button"
              onClick={() => refetch()}
              className="px-3 py-2 rounded-xl bg-muted/60 hover:bg-muted border border-border text-foreground text-xs font-bold transition-all cursor-pointer"
              title="تحديث قائمة الإشعارات"
            >
              🔄 تحديث
            </button>
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-card border border-border rounded-2xl p-3 sm:p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في الإشعارات والتنبيهات..."
              className="w-full pl-3 pr-9 py-2 bg-muted/40 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs pointer-events-none">
              🔍
            </span>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            {[
              { id: "ALL", label: "الكل" },
              { id: "UNREAD", label: `غير مقروءة (${unreadCount})` },
              { id: "AI", label: "الذكاء الاصطناعي ⚡" },
              { id: "BALANCE", label: "الرصيد والمالية 💳" },
              { id: "LEGAL", label: "القانون 18-07 ⚖️" },
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setFilterType(chip.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap text-xs ${
                  filterType === chip.id
                    ? "bg-emerald-600 text-white shadow-2xs"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground border border-border/50"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Notifications List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="py-12 text-center text-xs text-muted-foreground">
            <span className="inline-block w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2" />
            <p>جاري تحميل الإشعارات...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center text-xs text-muted-foreground space-y-2">
            <span className="text-3xl block">🔔</span>
            <p className="font-bold text-foreground">لا توجد إشعارات مطابقة</p>
            <p className="text-[11px]">ستظهر التنبيهات فور حدوث أي نشاط جديد في المحل.</p>
          </div>
        ) : (
          filteredList.map((item) => {
            const isAi = item.type.startsWith("AI_");
            const isBalance = item.type.includes("BALANCE") || item.type.includes("POINTS");
            const isLegal = item.type.includes("LEGAL") || item.type.includes("DATA");
            const isUrgent = item.priority === "URGENT";

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all shadow-2xs relative ${
                  item.read
                    ? "bg-card border-border text-muted-foreground"
                    : isUrgent
                    ? "bg-red-500/10 border-red-500/30 text-foreground"
                    : isAi
                    ? "bg-emerald-500/10 border-emerald-500/30 text-foreground"
                    : isBalance
                    ? "bg-amber-500/10 border-amber-500/30 text-foreground"
                    : isLegal
                    ? "bg-blue-500/10 border-blue-500/30 text-foreground"
                    : "bg-card border-border text-foreground"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                        isAi
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : isBalance
                          ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                          : isLegal
                          ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isAi ? (
                        <SparklesIcon size={18} />
                      ) : isBalance ? (
                        <BoltIcon size={18} />
                      ) : isLegal ? (
                        <ShieldCheckIcon size={18} />
                      ) : (
                        <CheckCircleIcon size={18} />
                      )}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-sm text-foreground leading-snug">
                          {item.title}
                        </h3>

                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        )}

                        {isUrgent && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white">
                            عاجل
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.body}
                      </p>

                      <div className="text-[10px] text-muted-foreground font-mono pt-1">
                        {formatFullDate(item.created_at)}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {item.action_url && (
                      <button
                        type="button"
                        onClick={() => {
                          markAsRead(item.id);
                          if (item.action_url?.includes("research")) {
                            setActiveTab("school-research");
                          } else if (item.action_url?.includes("document")) {
                            setActiveTab("documents");
                          } else if (item.action_url?.includes("overview") || item.action_url?.includes("wallet")) {
                            setActiveTab("wallet");
                          } else {
                            setActiveTab("services");
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                      >
                        {item.action_label || "الانتقال للإجراء ←"}
                      </button>
                    )}

                    {!item.read && (
                      <button
                        type="button"
                        onClick={() => markAsRead(item.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-muted/60 hover:bg-muted text-foreground text-xs font-medium cursor-pointer"
                        title="تعليم كمقروء"
                      >
                        ✓ مقروء
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
