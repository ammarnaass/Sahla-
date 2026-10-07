"use client";

import React from "react";
import { Sparkles, Store, Crown } from "lucide-react";

interface DemoCredentialsBarProps {
  onSelect: (email: string, pass: string, roleName: string) => void;
}

export function DemoCredentialsBar({ onSelect }: DemoCredentialsBarProps) {
  return (
    <div className="mt-8 pt-5 border-t border-border">
      <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-muted-foreground mb-3 font-cairo">
        <Sparkles size={14} className="text-amber-500" />
        حسابات تجريبية جاهزة للاختبار بنقرة واحدة:
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {/* Demo Kiosk */}
        <button
          type="button"
          onClick={() => onSelect("najah.kiosk@gmail.com", "Shop@2026!", "صاحب كشك")}
          className="p-2.5 rounded-xl bg-muted/30 border border-border hover:border-emerald-500/50 hover:bg-emerald-500/5 text-right transition-all group"
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-0.5">
            <Store size={14} /> صاحب كشك
          </div>
          <div className="text-[10px] text-muted-foreground font-mono truncate">
            najah.kiosk@gmail.com
          </div>
        </button>

        {/* Demo Super Admin */}
        <button
          type="button"
          onClick={() => onSelect("admin@sahla.dz", "Admin@2026!", "مدير النظام")}
          className="p-2.5 rounded-xl bg-muted/30 border border-border hover:border-amber-500/50 hover:bg-amber-500/5 text-right transition-all group"
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 mb-0.5">
            <Crown size={14} /> مدير النظام
          </div>
          <div className="text-[10px] text-muted-foreground font-mono truncate">
            admin@sahla.dz
          </div>
        </button>
      </div>
    </div>
  );
}
