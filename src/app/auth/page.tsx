"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm font-bold">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
        <span>جارٍ التحويل إلى بوابة الدخول...</span>
      </div>
    </div>
  );
}
