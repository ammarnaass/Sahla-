"use client";

import React, { useState } from "react";
import { SERVICES_CATALOG, ServiceDefinition } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface ServicesFullGridProps {
  onSelectService: (service: ServiceDefinition) => void;
}

export function ServicesFullGrid({ onSelectService }: ServicesFullGridProps) {
  const [selectedSoonService, setSelectedSoonService] = useState<ServiceDefinition | null>(null);
  const [notifySuccess, setNotifySuccess] = useState(false);

  const groups = [
    { id: "documents", name: "الوثائق الإدارية والمهنية", icon: "📑" },
    { id: "commerce", name: "التجارة والضرائب والمحاسبة", icon: "🧾" },
    { id: "school", name: "التعليم والبحوث المدرسية", icon: "🎓" },
    { id: "tools", name: "الأدوات المجانية المساعدة", icon: "🛠️" },
  ] as const;

  const handleClick = (svc: ServiceDefinition) => {
    if (!svc.isActive) {
      setSelectedSoonService(svc);
      setNotifySuccess(false);
      return;
    }
    onSelectService(svc);
  };

  return (
    <>
      <div className="space-y-8 text-right">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <span>📚</span>
            <span>دليل الخدمات الكامل</span>
          </h3>
          <span className="text-xs text-slate-400">
            {SERVICES_CATALOG.length} خدمة متوفرة
          </span>
        </div>

        {groups.map((grp) => {
          const groupServices = SERVICES_CATALOG.filter((s) => s.category === grp.id);
          if (groupServices.length === 0) return null;

          return (
            <div key={grp.id} className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>{grp.icon}</span>
                <span>{grp.name}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {groupServices.map((svc) => (
                  <div
                    key={svc.code}
                    onClick={() => handleClick(svc)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                      !svc.isActive
                        ? "bg-slate-900/40 border-slate-800/60 opacity-70 hover:opacity-100"
                        : "bg-slate-900 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/40 shadow-xs"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2.5 rounded-xl bg-slate-800 border border-slate-700/60 group-hover:scale-105 transition-transform">
                        {svc.icon}
                      </span>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {svc.nameAr}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {svc.nameFr}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {svc.isFree ? (
                        <Badge variant="free" size="sm">
                          مجاني
                        </Badge>
                      ) : !svc.isActive ? (
                        <Badge variant="soon" size="sm">
                          قريباً
                        </Badge>
                      ) : (
                        <Badge variant="primary" size="sm">
                          {svc.pointsCost} ن
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Unavailable Service "Notify Me" Modal per PRD Section 7.3 */}
      {selectedSoonService && (
        <Modal
          isOpen={Boolean(selectedSoonService)}
          onClose={() => setSelectedSoonService(null)}
          title={`خدمة «${selectedSoonService.nameAr}» قادمة قريباً`}
          description="نحن بصدد إطلاق هذه الخدمة بالتعاون مع الهيئات الجزائرية"
        >
          <div className="space-y-4 text-center py-2">
            <span className="text-4xl block">⏳</span>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              هذه الخدمة قيد التطوير النهائي لضمان أعلى درجات الجودة ومطابقة النماذج الرسمية في الجزائر.
            </p>

            {notifySuccess ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                ✓ شكراً لك! سيصلك إشعار فوري في التطبيق عند إتاحة الخدمة.
              </div>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => setNotifySuccess(true)}
                className="w-full font-bold"
              >
                أخبرني عند التوفر (تفعيل التنبيه) 🔔
              </Button>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
