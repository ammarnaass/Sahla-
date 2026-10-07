"use client";

import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SERVICES_CATALOG, ServiceDefinition } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getServiceIcon } from "@/components/ui/Icons";
import { ArrowLeft } from "lucide-react";

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
    <section id="services" className="py-20 sm:py-28 border-b border-border relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="primary" className="py-1 px-3.5 gap-2 uppercase tracking-wider mb-4 shadow-2xs font-bold text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>دليل الخدمات الشامل والمطابق للتشريع الجزائري 🇩🇿</span>
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight font-display">
            {t("landing.servicesTitle")}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mt-4 leading-relaxed font-medium">
            {t("landing.servicesSubtitle")}
          </p>
        </div>

        {/* Category Filter Pills (Material 3 Tonal Filter Chips) */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-12 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id as typeof activeTab)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/30 scale-105"
                    : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-border shadow-2xs"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Services Cards Bento Grid (Material 3 Elevated Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const name = locale === "ar" ? service.nameAr : service.nameFr;
            return (
              <Card
                key={service.code}
                onClick={() => onSelectService?.(service)}
                className="group p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:-translate-y-1 text-right"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/20 group-hover:scale-105 transition-all">
                      {getServiceIcon(service.code, 24, "text-primary")}
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

                  <h3 className="text-base font-bold text-foreground mb-2.5 group-hover:text-primary transition-colors font-display">
                    {name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-normal">
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

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-bold text-primary transition-colors">
                  <span>{service.isActive ? "تجربة الخدمة والطباعة" : "تفعيل التنبيه"}</span>
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

