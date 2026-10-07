"use client";

import React, { useEffect, useState } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { useDashboardTab } from "@/contexts/DashboardTabContext";
import {
  Sparkles,
  Zap,
  ShieldAlert,
  BellRing,
  Volume2,
  VolumeX,
  X,
  ExternalLink,
  Check,
} from "lucide-react";

export function NotificationModalToast() {
  const { activeToast, dismissToast, markAsRead, isMuted, toggleMute, playChime } =
    useNotifications();
  const { setActiveTab } = useDashboardTab();

  const [progress, setProgress] = useState<number>(100);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto-dismiss countdown with pause on hover
  useEffect(() => {
    if (!activeToast) {
      setProgress(100);
      setIsPaused(false);
      return;
    }

    const durationMs = 10000; // 10 seconds auto-dismiss
    const intervalMs = 100;
    const step = (intervalMs / durationMs) * 100;

    const timer = setInterval(() => {
      if (!isPaused) {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            dismissToast();
            return 0;
          }
          return Math.max(0, prev - step);
        });
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [activeToast, isPaused, dismissToast]);

  // Reset progress whenever a new toast arrives
  useEffect(() => {
    if (activeToast) {
      setProgress(100);
    }
  }, [activeToast?.id]);

  if (!activeToast) return null;

  const isAi = activeToast.type.startsWith("AI_");
  const isWallet =
    activeToast.type.includes("BALANCE") || activeToast.type.includes("POINTS");
  const isUrgent = activeToast.priority === "URGENT";
  const isLegal =
    activeToast.type.includes("LEGAL") || activeToast.type.includes("DATA");

  const handleActionClick = () => {
    if (activeToast) {
      markAsRead(activeToast.id);
      const url = activeToast.action_url || "";
      if (url.includes("research")) {
        setActiveTab("school-research");
      } else if (url.includes("document")) {
        setActiveTab("documents");
      } else if (url.includes("wallet") || url.includes("overview")) {
        setActiveTab("wallet");
      } else if (url.includes("services")) {
        setActiveTab("services");
      } else if (url.includes("settings")) {
        setActiveTab("settings");
      }
      dismissToast();
    }
  };

  const handleMarkAsReadOnly = () => {
    if (activeToast) {
      markAsRead(activeToast.id);
      dismissToast();
    }
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="fixed bottom-5 left-5 z-[9999] max-w-sm sm:max-w-md w-[calc(100vw-2.5rem)] sm:w-[420px] transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
    >
      <div
        className={`relative overflow-hidden rounded-2xl border backdrop-blur-2xl p-4 sm:p-5 shadow-2xl text-right transition-all select-none ${
          isUrgent
            ? "bg-card/95 border-red-500/50 shadow-red-950/20 ring-1 ring-red-500/30"
            : isAi
            ? "bg-card/95 border-emerald-500/50 shadow-emerald-950/25 ring-1 ring-emerald-500/30"
            : isWallet
            ? "bg-card/95 border-amber-500/50 shadow-amber-950/25 ring-1 ring-amber-500/30"
            : "bg-card/95 border-border shadow-2xl"
        }`}
      >
        {/* Glow ambient highlight */}
        <div
          className={`absolute -top-12 -left-12 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-40 ${
            isAi
              ? "bg-emerald-500"
              : isWallet
              ? "bg-amber-500"
              : isUrgent
              ? "bg-red-500"
              : "bg-primary"
          }`}
        />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-border/60 relative z-10">
          {/* Badge & Live indicator */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isUrgent
                    ? "bg-red-400"
                    : isAi
                    ? "bg-emerald-400"
                    : isWallet
                    ? "bg-amber-400"
                    : "bg-blue-400"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isUrgent
                    ? "bg-red-500"
                    : isAi
                    ? "bg-emerald-500"
                    : isWallet
                    ? "bg-amber-500"
                    : "bg-blue-500"
                }`}
              />
            </span>
            <span
              className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                isAi
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25"
                  : isWallet
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25"
                  : isUrgent
                  ? "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/25"
                  : "bg-muted text-muted-foreground border border-border"
              }`}
            >
              {isAi
                ? "ذكاء اصطناعي ⚡"
                : isWallet
                ? "رصيد ومحفظة 💳"
                : isUrgent
                ? "تنبيه عاجل ⚠️"
                : "إشعار الكاونتر"}
            </span>
          </div>

          {/* Sound Tools & Close Button */}
          <div className="flex items-center gap-1">
            {/* Replay Sound Button */}
            <button
              type="button"
              onClick={() => playChime(isAi ? "ai_ready" : isWallet ? "wallet" : "chime")}
              title="إعادة تشغيل صوت التنبيه"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            >
              <Volume2 size={14} />
            </button>

            {/* Mute/Unmute Toggle */}
            <button
              type="button"
              onClick={toggleMute}
              title={isMuted ? "تشغيل صوت التنبيهات" : "كتم صوت التنبيهات"}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isMuted
                  ? "text-red-500 bg-red-500/10 hover:bg-red-500/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {isMuted ? <VolumeX size={14} /> : <BellRing size={14} />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={dismissToast}
              title="إغلاق التنبيه"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer mr-0.5"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex items-start gap-3 pt-1 relative z-10">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold shadow-xs ${
              isAi
                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                : isWallet
                ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                : isUrgent
                ? "bg-red-500/20 text-red-600 dark:text-red-400"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {isAi ? (
              <Sparkles size={18} />
            ) : isWallet ? (
              <Zap size={18} />
            ) : isLegal ? (
              <ShieldAlert size={18} />
            ) : (
              <BellRing size={18} />
            )}
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <h4 className="text-xs sm:text-sm font-black text-foreground leading-snug">
              {activeToast.title}
            </h4>
            <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-3">
              {activeToast.body}
            </p>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50 relative z-10 text-xs">
          <div className="flex items-center gap-1.5">
            {activeToast.action_url && (
              <button
                type="button"
                onClick={handleActionClick}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                  isAi
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                    : isWallet
                    ? "bg-amber-600 hover:bg-amber-500 text-white"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground"
                }`}
              >
                <span>{activeToast.action_label || "الانتقال للنتيجة"}</span>
                <ExternalLink size={12} />
              </button>
            )}

            <button
              type="button"
              onClick={handleMarkAsReadOnly}
              className="px-2.5 py-1.5 rounded-xl bg-muted/60 hover:bg-muted text-foreground font-medium flex items-center gap-1 transition-colors cursor-pointer text-[11px]"
            >
              <Check size={12} />
              <span>مقروء</span>
            </button>
          </div>

          <button
            type="button"
            onClick={dismissToast}
            className="text-[11px] text-muted-foreground hover:text-foreground font-medium transition-colors cursor-pointer px-1"
          >
            تأجيل
          </button>
        </div>

        {/* Smooth Countdown Timer Line */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-muted/40 overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ease-linear ${
              isUrgent
                ? "bg-red-500"
                : isAi
                ? "bg-emerald-500"
                : isWallet
                ? "bg-amber-500"
                : "bg-blue-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
