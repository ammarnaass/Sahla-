"use client";

import React from "react";
import { Printer, ShieldCheck, CreditCard } from "lucide-react";
import { siteConfig } from "@/config/site";

export function AuthTrustSidebar() {
  return (
    <div className="hidden lg:flex flex-col justify-center flex-1 max-w-lg mr-12 p-6">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-6 border border-emerald-500/20 w-fit">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        شبكة سحابية وطنية متصلة على مدار الساعة
      </div>

      <h2 className="text-3xl font-black text-foreground font-cairo mb-4 leading-tight">
        المحطة الرقمية الشاملة لكافة خدمات المواطنين في محلك 🇩🇿
      </h2>

      <p className="text-muted-foreground text-sm font-cairo leading-relaxed mb-8">
        صُممت سهلة لتمنح الأكشاك والمكتبات ومراكز الطباعة أسرع تجربة خدمة زبائن، مع التزام تام بحماية المعطيات الشخصية وفق {siteConfig.complianceLaw}.
      </p>

      <div className="space-y-4">
        <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-card border border-border shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Printer size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground font-cairo">
              جسر طباعة لاسلكي وحراري فوري
            </h4>
            <p className="text-xs text-muted-foreground font-cairo mt-0.5">
              طباعة المستندات الصادرة من هواتف الزبائن دون فلاش ديسك ودون تثبيت تعريفات معقدة.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-card border border-border shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground font-cairo">
              مطابقة {siteConfig.complianceLaw}
            </h4>
            <p className="text-xs text-muted-foreground font-cairo mt-0.5">
              حذف تلقائي للملفات بعد الطباعة مع تشفير شامل يحمي خصوصية الزبون ومسؤوليتك.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-card border border-border shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <CreditCard size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground font-cairo">
              شحن رصيد سهل عبر الذهبية و CIB
            </h4>
            <p className="text-xs text-muted-foreground font-cairo mt-0.5">
              شحن فوري لنقاط الطباعة والمبيعات ببطاقتك البنكية أو بكروت الخدش المعتمدة.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-cairo">
        <span className="flex items-center gap-1.5 font-bold text-foreground">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          {siteConfig.activeShopsCount} محل تجاري مسجل عبر {siteConfig.wilayasCoverage} ولاية
        </span>
        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
          متاح 24/7
        </span>
      </div>
    </div>
  );
}
