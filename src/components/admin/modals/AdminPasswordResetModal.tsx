"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Key, Copy, Check, RefreshCw, X } from "lucide-react";

interface AdminPasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin: any | null;
  onConfirmReset: (newPassword?: string) => Promise<string>;
}

export function AdminPasswordResetModal({
  isOpen,
  onClose,
  admin,
  onConfirmReset,
}: AdminPasswordResetModalProps) {
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultPass, setResultPass] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen || !admin) return null;

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let res = "";
    for (let i = 0; i < 10; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(res);
  };

  const handleCopy = () => {
    const textToCopy = resultPass || password;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const generated = await onConfirmReset(password || undefined);
      setResultPass(generated);
    } catch (err: any) {
      setErrorMsg(err.message || "فشل إعادة تعيين كلمة المرور");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPassword("");
    setResultPass(null);
    setCopied(false);
    setErrorMsg("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 text-right font-sans"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
              <Key size={20} />
            </div>
            <div>
              <h3 className="text-base font-black font-cairo text-foreground">
                إعادة تعيين كلمة المرور
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                للمشرف: <strong className="text-foreground">{admin.name}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold">
            ⚠️ {errorMsg}
          </div>
        )}

        {resultPass ? (
          <div className="space-y-4 pt-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 space-y-2 text-center">
              <div className="text-xs font-bold">✓ تم تحديث كلمة المرور بنجاح في قاعدة البيانات</div>
              <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-card border border-border">
                <span className="font-mono text-base font-bold text-foreground tracking-wider select-all">
                  {resultPass}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  className="rounded-lg h-8 px-2 text-xs flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  <span>{copied ? "تم النسخ" : "نسخ"}</span>
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                يرجى مشاركة كلمة المرور مع المشرف عبر قناة آمنة. لن تظهر هذه الكلمة مرة أخرى.
              </p>
            </div>

            <div className="pt-2">
              <Button onClick={handleClose} className="w-full rounded-xl text-xs font-bold font-cairo cursor-pointer">
                إغلاق النافذة ✓
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5 font-cairo">
                كلمة المرور الجديدة (أو اضغط لتوليد تلقائي):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="كلمة مرور مؤقتة..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  dir="ltr"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-muted/40 border border-border focus:outline-none focus:border-amber-500 text-xs font-mono text-foreground"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateRandomPassword}
                  className="rounded-xl text-xs shrink-0 flex items-center gap-1 cursor-pointer"
                  title="توليد كلمة مرور عشوائية قوية"
                >
                  <RefreshCw size={13} />
                  <span>توليد</span>
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="rounded-xl text-xs"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white font-cairo cursor-pointer"
              >
                {isSubmitting ? "جاري التحديث..." : "تأكيد تغيير كلمة المرور"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
