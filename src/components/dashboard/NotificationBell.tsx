"use client";

import React, { useState } from "react";

export interface NotificationItem {
  id: string;
  type: "LOW_BALANCE" | "DOC_READY" | "NEW_SERVICE" | "LEGAL_UPDATE";
  title: string;
  body: string;
  date: string;
  read: boolean;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_1",
    type: "DOC_READY",
    title: "تم تجهيز أول سيرة ذاتية",
    body: "يمكنك الآن طباعتها أو حفظها في سجل الوثائق الدائم.",
    date: "منذ 5 دقائق",
    read: false,
  },
  {
    id: "notif_2",
    type: "NEW_SERVICE",
    title: "ميزة جديدة: صور الهوية الرسمية",
    body: "أصبح بإمكانك تجهيز 8 صور هوية في ورقة 10×15 مجاناً لزبائنك.",
    date: "أمس",
    read: false,
  },
  {
    id: "notif_3",
    type: "LEGAL_UPDATE",
    title: "مطابقة القانون 18-07",
    body: "تطبيق التشفير الكامل وحذف الملفات المؤقتة بعد 72 ساعة.",
    date: "منذ يومين",
    read: true,
  },
];

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEFAULT_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markOneRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors relative"
        aria-label="الإشعارات"
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
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white font-mono text-[10px] font-black flex items-center justify-center border-2 border-slate-950 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute top-12 left-0 sm:left-auto sm:right-0 w-80 max-w-[90vw] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100 text-right"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2 px-1">
            <h4 className="text-xs font-bold text-white">مركز الإشعارات</h4>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] text-emerald-400 hover:underline font-semibold"
              >
                تحديد الكل كمقروء
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markOneRead(item.id)}
                className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                  item.read
                    ? "bg-slate-950/40 border-slate-800/60 text-slate-400"
                    : "bg-emerald-950/20 border-emerald-500/30 text-slate-200"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-bold text-white">{item.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{item.date}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
