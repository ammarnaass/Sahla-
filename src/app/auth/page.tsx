"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthModal } from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/Button";

export default function AuthPage() {
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-extrabold text-2xl shadow-xl shadow-emerald-700/25">
            سـ
          </div>
          <span className="text-2xl font-black text-white">سهلة · Sahla</span>
        </Link>

        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
          <h1 className="text-2xl font-extrabold text-white">تسجيل الدخول إلى حسابك</h1>
          <p className="text-sm text-slate-400">
            أدخل برقم هاتفك المسجل أو سجّل محلك الجديد في ثوانٍ معدودة.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => setModalOpen(true)}
          >
            فتح نافذة الدخول
          </Button>
        </div>

        <Link href="/" className="inline-block text-xs text-slate-400 hover:text-white transition-colors">
          ← العودة إلى الصفحة الرئيسية
        </Link>
      </div>

      <AuthModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
