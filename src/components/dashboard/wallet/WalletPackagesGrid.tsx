"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

interface WalletPackagesGridProps {
  onSelectPackage: (pkg: { points: number; dzd: number }) => void;
}

const PACKAGES = [
  {
    points: 100,
    dzd: 1000,
    title: "باقة البداية 🥉",
    desc: "100 نقطة لتجربة كافة وثائق المنصة",
    badge: "10 دج / نقطة",
    popular: false,
  },
  {
    points: 300,
    dzd: 2500,
    title: "الباقة الشائعة 🥈",
    desc: "300 نقطة مناسبة للنشاط الأسبوعي للمحل",
    badge: "توفير 500 دج ⭐",
    popular: true,
  },
  {
    points: 1000,
    dzd: 7000,
    title: "باقة الكيوسك المحترف 🥇",
    desc: "1000 نقطة لأصحاب مقاهي الإنترنت والمكتبات الكبرى",
    badge: "أقصى توفير (7 دج / نقطة) 🔥",
    popular: false,
  },
];

export function WalletPackagesGrid({ onSelectPackage }: WalletPackagesGridProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-extrabold text-white">
          شحن فوري بالبطاقة الذهبية أو بريدي موب 💳
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          دفع آمن وفوري 100% عبر الموزع الوطني المعتمد لبريد الجزائر وبنك الجزائر
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PACKAGES.map((pkg) => (
          <div
            key={pkg.points}
            className={`p-6 rounded-3xl border flex flex-col justify-between transition-all relative ${
              pkg.popular
                ? "bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/40 border-emerald-500/60 shadow-xl shadow-emerald-950/20"
                : "bg-slate-900 border-slate-800 hover:border-slate-700"
            }`}
          >
            {pkg.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold shadow-md">
                الأكثر طلباً بالمحلات
              </span>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">{pkg.title}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                  {pkg.badge}
                </span>
              </div>

              <div>
                <div className="text-3xl font-black text-white font-mono">
                  {pkg.points}{" "}
                  <span className="text-xs font-normal text-slate-400">نقطة</span>
                </div>
                <div className="text-lg font-extrabold text-emerald-400 font-mono mt-1">
                  {pkg.dzd.toLocaleString()} دج
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{pkg.desc}</p>
            </div>

            <Button
              variant={pkg.popular ? "primary" : "secondary"}
              onClick={() => onSelectPackage({ points: pkg.points, dzd: pkg.dzd })}
              className="mt-6 w-full text-xs py-2.5 font-bold"
            >
              شحن الآن بالذهبية 💳
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
