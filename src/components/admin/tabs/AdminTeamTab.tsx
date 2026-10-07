"use client";

import React, { useState } from "react";
import { Shield, Plus, Crown, UserCheck, Phone, Mail, Key } from "lucide-react";
import { Button as MuiButton } from "@mui/material";

interface AdminTeamTabProps {
  adminsList: any[];
  onCreateAdmin: (data: { name: string; email: string; pass: string; phone?: string }) => void;
  isCreating: boolean;
}

export function AdminTeamTab({ adminsList, onCreateAdmin, isCreating }: AdminTeamTabProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    onCreateAdmin({ name, email, pass: password, phone });
    setName("");
    setEmail("");
    setPassword("");
    setPhone("");
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form: Add New Admin */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Plus size={18} />
            </div>
            <h3 className="text-base font-bold text-foreground font-cairo">
              إضافة مشرف أو مدير نظام جديد
            </h3>
          </div>
          <p className="text-xs text-muted-foreground font-cairo mb-6">
            منح صلاحيات إدارة الشبكة الوطنية ومتابعة العمليات لمسؤول جديد.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-right text-xs">
            <div>
              <label className="block font-bold text-foreground mb-1 font-cairo">
                الاسم واللقب:
              </label>
              <input
                type="text"
                placeholder="أمين بن علي"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full py-2 px-3 rounded-xl bg-muted/40 border border-border focus:outline-none focus:border-emerald-500 text-foreground"
              />
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1 font-cairo">
                البريد الإلكتروني:
              </label>
              <input
                type="email"
                placeholder="admin@sahla.dz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                dir="ltr"
                className="w-full py-2 px-3 rounded-xl bg-muted/40 border border-border focus:outline-none focus:border-emerald-500 text-foreground"
              />
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1 font-cairo">
                كلمة المرور:
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                dir="ltr"
                className="w-full py-2 px-3 rounded-xl bg-muted/40 border border-border focus:outline-none focus:border-emerald-500 text-foreground"
              />
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1 font-cairo">
                رقم الهاتف (اختياري):
              </label>
              <input
                type="tel"
                placeholder="0550-00-00-00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                dir="ltr"
                className="w-full py-2 px-3 rounded-xl bg-muted/40 border border-border focus:outline-none focus:border-emerald-500 text-foreground"
              />
            </div>

            <MuiButton
              fullWidth
              type="submit"
              variant="contained"
              disabled={isCreating}
              disableElevation
              sx={{
                mt: 1,
                borderRadius: "12px",
                py: 1.4,
                fontWeight: 800,
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              {isCreating ? "جاري الإنشاء..." : "إنشاء حساب المشرف ✓"}
            </MuiButton>
          </form>
        </div>

        {/* Existing Admins List */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-emerald-500" />
              <h3 className="text-base font-bold text-foreground font-cairo">
                طاقم الإدارة المصرح لهم
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-muted-foreground">
              {adminsList.length} مسؤول نشط
            </span>
          </div>

          <div className="space-y-3">
            {adminsList.map((adm, idx) => (
              <div
                key={adm.id || idx}
                className="p-4 rounded-xl bg-muted/30 border border-border flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
                    <Crown size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-sm">{adm.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                        {adm.role || "SUPER_ADMIN"}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono block mt-0.5">
                      {adm.email}
                    </span>
                  </div>
                </div>

                <div className="text-left text-xs font-mono text-muted-foreground">
                  {adm.phone && <span className="block">{adm.phone}</span>}
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    نشط ومصرح 🛡️
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
