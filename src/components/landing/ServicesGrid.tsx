"use client";

import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SERVICES_CATALOG, ServiceDefinition } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { getServiceIcon, ArrowLeftIcon } from "@/components/ui/Icons";

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
    <section id="services" className="py-20 sm:py-28 border-b border-slate-200 dark:border-slate-800/60 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
            <span>دليل الخدمات الشامل والمطابق للتشريع الجزائري 🇩🇿</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {t("landing.servicesTitle")}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-4 leading-relaxed font-medium">
            {t("landing.servicesSubtitle")}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-12 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id as typeof activeTab)}
                className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-900/20 ring-2 ring-emerald-400/30 scale-105"
                    : "bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/90 border border-slate-200 dark:border-slate-800 shadow-2xs"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Services Cards Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const name = locale === "ar" ? service.nameAr : service.nameFr;
            return (
              <div
                key={service.code}
                onClick={() => onSelectService?.(service)}
                className="group relative p-6 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-950/90 border border-slate-200 dark:border-slate-800/90 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-900/95 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-xl hover:shadow-emerald-950/15 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500/20 group-hover:scale-105 transition-all">
                      {getServiceIcon(service.code, 24, "text-emerald-600 dark:text-emerald-400")}
                    </div>
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

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                    {name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {service.code === "CV_GEN" && "سيرة ذاتية متوافقة مع متطلبات العمل ومطابقة لنظام ATS وتصدير فوري PDF."}
                    {service.code === "INVOICE" && "فاتورة تجارية قانونية برقم جبائي NIF وحساب آلي للـ TVA والتمبر المالي."}
                    {service.code === "ID_PHOTO" && "تعديل وقص وتكرار 8 صور هوية في ورقة 10×15 بنقرة واحدة بجودة فائقة."}
                    {service.code === "TAX_G50" && "حساب وطباعة استمارات التصريح الجبائي G50 بكل دقة للمحلات والمهنيين."}
                    {service.code === "FORM_OCR" && "قراءة بطاقة التعريف والبطاقة الرمادية وتعبئة الاستمارات آلياً بالذكاء الاصطناعي."}
                    {service.code === "CUSTOMERS" && "سجل ديون الزبائن والكريدي مع كشف حساب وتنبيهات فورية."}
                    {service.code === "SCHOOL_RESEARCH" && "قوالب بحوث مدرسية وعروض تقديمية جامعية جاهزة للطباعة والتسليم."}
                    {service.code === "EPAY" && "توليد وصولات الدفع الإلكتروني بالبطاقة الذهبية وCIB فورياً."}
                    {service.code === "PRINT_BRIDGE" && "طباعة لاسلكية فورية من هاتف الزبون أو الهاتف المحمول لأي طابعة متصلة."}
                    {service.code === "BARCODE" && "توليد كود بار و QR Code لمنتجات الزبائن وطباعة ملصقات الباركود."}
                    {service.code === "PDF_TOOLS" && "دمج، ضغط، وتقسيم ملفات PDF للزبائن بسرعة فائقة وبدون برامج خارجية."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                  <span>{service.isActive ? "تجربة الخدمة والطباعة" : "تفعيل التنبيه"}</span>
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <ArrowLeftIcon size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
