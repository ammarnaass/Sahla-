"use client";

import React, { useState } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { useDashboardTab } from "@/contexts/DashboardTabContext";
import { SparklesIcon, CheckCircleIcon, BoltIcon } from "@/components/ui/Icons";

function formatRelativeTime(dateStr?: string | null): string {
  if (!dateStr) return "الآن";
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return "الآن";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `منذ ${diffMin} د`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `منذ ${diffHours} س`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "أمس";
    return `منذ ${diffDays} أيام`;
  } catch {
    return "سابقاً";
  }
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "UNREAD" | "AI" | "BALANCE">("ALL");
  const { setActiveTab } = useDashboardTab();

  const {
    notifications,
    unreadCount,
    activeToast,
    dismissToast,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === "UNREAD") return !item.read;
    if (activeFilter === "AI") return item.type.startsWith("AI_");
    if (activeFilter === "BALANCE") return item.type.includes("BALANCE") || item.type.includes("POINTS");
    return true;
  });

  return (
    <div className="relative">
      {/* 1. Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-xl bg-card border border-border text-foreground hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-center transition-colors relative cursor-pointer shadow-2xs"
        aria-label="الإشعارات"
        title="مركز الإشعارات والتنبيهات الحية"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white font-mono text-[10px] font-black flex items-center justify-center border-2 border-background animate-pulse shadow-sm">
            {unreadCount > 99 ? "+99" : unreadCount}
          </span>
        )}
      </button>

      {/* 2. Interactive Flyout Drawer */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div
            className="absolute top-12 left-0 sm:left-auto sm:right-0 w-84 sm:w-96 max-w-[92vw] bg-card border border-border rounded-2xl shadow-2xl p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150 text-right space-y-2.5"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-foreground">مركز الإشعارات</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-mono">
                    {unreadCount} غير مقروء
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllAsRead()}
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-bold cursor-pointer"
                >
                  تحديد الكل كمقروء
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10.5px]">
              {[
                { id: "ALL", label: "الكل" },
                { id: "UNREAD", label: "جديدة" },
                { id: "AI", label: "الذكاء الاصطناعي ⚡" },
                { id: "BALANCE", label: "الرصيد 💳" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeFilter === tab.id
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {filteredNotifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  <p>لا توجد إشعارات حالياً في هذا القسم.</p>
                </div>
              ) : (
                filteredNotifications.map((item) => {
                  const isAi = item.type.startsWith("AI_");
                  const isBalance = item.type.includes("BALANCE") || item.type.includes("POINTS");
                  const isUrgent = item.priority === "URGENT";

                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border text-xs transition-all relative group ${
                        item.read
                          ? "bg-muted/30 border-border text-muted-foreground"
                          : isUrgent
                          ? "bg-red-500/10 border-red-500/30 text-foreground"
                          : isAi
                          ? "bg-emerald-500/10 border-emerald-500/30 text-foreground"
                          : isBalance
                          ? "bg-amber-500/10 border-amber-500/30 text-foreground"
                          : "bg-card border-border text-foreground"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5 flex-1">
                          {isAi ? (
                            <SparklesIcon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          ) : isBalance ? (
                            <BoltIcon className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                          )}
                          <span className="font-bold text-foreground leading-snug">
                            {item.title}
                          </span>
                        </div>

                        <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                          {formatRelativeTime(item.created_at)}
                        </span>
                      </div>

                      <p className="text-[11px] leading-relaxed text-muted-foreground pr-4">
                        {item.body}
                      </p>

                      <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-border/40 text-[10.5px]">
                        {item.action_url ? (
                          <a
                            href={item.action_url}
                            onClick={() => {
                              markAsRead(item.id);
                              setIsOpen(false);
                            }}
                            className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                          >
                            {item.action_label || "عرض الإجراء ←"}
                          </a>
                        ) : (
                          <span />
                        )}

                        {!item.read && (
                          <button
                            type="button"
                            onClick={() => markAsRead(item.id)}
                            className="text-muted-foreground hover:text-foreground font-medium text-[10px] cursor-pointer"
                            title="تعليم كمقروء"
                          >
                            ✓ مقروء
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer: Full Archive Tab Link */}
            <div className="pt-2.5 mt-2 border-t border-border flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("notifications");
                  setIsOpen(false);
                }}
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>فتح مركز وسجل الإشعارات الكامل ←</span>
              </button>
              <span className="text-[10px] text-muted-foreground font-mono">
                {notifications.length} إشعار
              </span>
            </div>
          </div>
        </>
      )}

      {/* 3. Live Toast Alert on Incoming Event */}
      {activeToast && (
        <div className="fixed bottom-5 left-5 z-50 max-w-sm w-full bg-card border border-emerald-500/40 rounded-2xl p-3.5 shadow-2xl animate-fade-in text-right space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-foreground">{activeToast.title}</span>
            </div>
            <button
              type="button"
              onClick={dismissToast}
              className="text-muted-foreground hover:text-foreground text-xs px-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {activeToast.body}
          </p>
          {activeToast.action_url && (
            <div className="pt-1 text-left">
              <a
                href={activeToast.action_url}
                onClick={dismissToast}
                className="inline-block px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-xs"
              >
                {activeToast.action_label || "معاينة"}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
