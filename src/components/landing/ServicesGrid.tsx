"use client";

import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SERVICES_CATALOG, ServiceDefinition } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

interface ServicesGridProps {
  onSelectService?: (service: ServiceDefinition) => void;
}

export function ServicesGrid({ onSelectService }: ServicesGridProps) {
  const { t, locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<"all" | "documents" | "commerce" | "school" | "tools">("all");

  const categories = [
    { id: "all", name: locale === "ar" ? "كل الخدمات" : locale === "fr" ? "Tous les services" : "All Services" },
    { id: "documents", name: locale === "ar" ? "الوثائق الإدارية" : locale === "fr" ? "Documents" : "Documents" },
    { id: "commerce", name: locale === "ar" ? "التجارة والضرائب" : locale === "fr" ? "Commerce & Fiscalité" : "Commerce & Tax" },
    { id: "school", name: locale === "ar" ? "التعليم والبحوث" : locale === "fr" ? "Scolaire" : "Education" },
    { id: "tools", name: locale === "ar" ? "الأدوات المجانية" : locale === "fr" ? "Outils Gratuits" : "Free Tools" },
  ] as const;

  const filteredServices = activeTab === "all"
    ? SERVICES_CATALOG
    : SERVICES_CATALOG.filter((s) => s.category === activeTab);

  return (
    <section id="services" className="py-16 sm:py-24 border-b border-slate-800/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            دليل الخدمات الشامل
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
            {t("landing.servicesTitle")}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            {t("landing.servicesSubtitle")}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id as typeof activeTab)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                activeTab === cat.id
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30"
                  : "bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((service) => {
            const name = locale === "ar" ? service.nameAr : service.nameFr;
            return (
              <div
                key={service.code}
                onClick={() => onSelectService?.(service)}
                className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-800/40 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl p-3 rounded-xl bg-slate-800 border border-slate-700/60 group-hover:scale-105 transition-transform">
                      {service.icon}
                    </span>
                    {service.isFree ? (
                      <Badge variant="free" size="sm">
                        {t("common.free")}
                      </Badge>
                    ) : !service.isActive ? (
                      <Badge variant="soon" size="sm">
                        {t("common.soon")}
                      </Badge>
                    ) : (
                      <Badge variant="primary" size="sm">
                        {service.pointsCost} {t("common.points")}
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {service.code === "CV_GEN" && "سيرة ذاتية متوافقة مع متطلبات العمل ومطابقة لنظام ATS."}
                    {service.code === "INVOICE" && "فاتورة تجارية قانونية برقم جبائي NIF وحساب آلي للـ TVA والتمبر."}
                    {service.code === "ID_PHOTO" && "تعديل وقص وتكرار 8 صور هوية في ورقة 10×15 بنقرة واحدة."}
                    {service.code === "TAX_G50" && "حساب وطباعة استمارات التصريح الجبائي G50 بكل دقة وسهولة."}
                    {service.code === "FORM_OCR" && "قراءة بطاقة التعريف والبطاقة الرمادية وتعبئة الاستمارات آلياً."}
                    {service.code === "CUSTOMERS" && "سجل ديون الزبائن والكريدي مع كشف حساب وتنبيهات واتساب."}
                    {service.code === "SCHOOL_RESEARCH" && "قوالب بحوث مدرسية وعروض تقديمية جامعية جاهزة للطباعة."}
                    {service.code === "EPAY" && "توليد وصولات الدفع الإلكتروني بالبطاقة الذهبية وCIB."}
                    {service.code === "PRINT_BRIDGE" && "طباعة لاسلكية مباشرة من الهاتف لأي طابعة متصلة بالحاسوب."}
                    {service.code === "BARCODE" && "توليد كود بار و QR Code لمنتجات الزبائن وطباعة ملصقات."}
                    {service.code === "PDF_TOOLS" && "دمج، ضغط، وتقسيم ملفات PDF للزبائن بسرعة فائقة."}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400">
                  <span>{service.isActive ? "تجربة الخدمة" : "تفعيل التنبيه"}</span>
                  <span className="rtl:rotate-180 group-hover:translate-x-1 transition-transform">←</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
