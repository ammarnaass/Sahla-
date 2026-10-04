"use client";

import React from "react";
import { useOffline } from "@/hooks/useOffline";

export function OfflineBanner() {
  const { isOffline } = useOffline();

  if (!isOffline) return null;

  return (
    <div className="bg-amber-600/95 text-white px-4 py-2.5 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-md animate-in slide-in-from-top">
      <span>📡</span>
      <span>
        أنت في وضع «غير متصل» الآن. يمكنك استعراض بياناتك المحفوظة واستخدام الأدوات المحلية.
      </span>
      <span className="px-2 py-0.5 rounded bg-black/20 text-[10px]">وضع الأوفلاين</span>
    </div>
  );
}
