"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface PWAInstallPromptProps {
  onDismiss: () => void;
}

export function PWAInstallPrompt({ onDismiss }: PWAInstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        console.log("User installed PWA");
      }
      setDeferredPrompt(null);
    }
    onDismiss();
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-right">
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-2xl shadow-lg shrink-0">
          📲
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">ثبّت «سهلة» على شاشة هاتفك الرئيسية</h4>
          <p className="text-xs text-slate-300">
            لتصل إلى خدمات محلك بسرعة بنقرة واحدة مثل أي تطبيق رسمي وبدون كتابة الرابط مجدداً.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
        <Button
          variant="primary"
          size="sm"
          onClick={handleInstall}
          className="flex-1 sm:flex-none font-bold"
        >
          تثبيت التطبيق الآن
        </Button>
        <button
          onClick={onDismiss}
          className="text-xs text-slate-400 hover:text-white px-3 py-2"
        >
          لاحقاً
        </button>
      </div>
    </div>
  );
}
