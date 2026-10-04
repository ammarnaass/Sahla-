"use client";

import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export function FAQAccordion() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "كيف أشحن رصيدي من النقاط بعد انتهاء الرصيد المجاني؟",
      a: "يمكنك شحن رصيدك بكل سهولة عبر بطاقات الشحن المادية (Scratch Cards) المتوفرة لدى موزعينا، أو عبر بريدي موب (BaridiMob)، البطاقة الذهبية، أو بطاقة CIB البنكية.",
    },
    {
      q: "هل أحتاج إلى بطاقة بنكية للتسجيل والبدء؟",
      a: "لا إطلاقاً! التسجيل يتم برقم هاتفك فقط خلال 30 ثانية دون أي بطاقة أو اشتراك، وتتحصل فوراً على 50 نقطة تجريبية مجانية لتنجز بها أول وثائق لزبائنك.",
    },
    {
      q: "هل بيانات زبائني ومستنداتهم في أمان؟",
      a: "نعم تماماً. منصة سهلة مطابقة بنسبة 100% للقانون الجزائري 18-07 المتعلق بحماية المعطيات ذات الطابع الشخصي، ويتم حذف البيانات والملفات المؤقتة آلياً بعد 72 ساعة لضمان الخصوصية التامة.",
    },
    {
      q: "هل يعمل التطبيق بدون إنترنت سريع أو على هواتف بسيطة؟",
      a: "نعم، سهلة صُممت خصيصاً لتناسب هواتف الأندرويد الاقتصادية والإنترنت المتذبذب في الجزائر. حجم الصفحة خفيف جداً، وتعمل حتى على تغطية الجيل الثالث 3G بفضل تقنية PWA الذكية.",
    },
    {
      q: "كيف أطبع الوثائق من الهاتف إلى طابعة المحل؟",
      a: "توفر سهلة ميزة «جسر الطباعة اللاسلكي» التي تربط هاتفك بطابعة الحاسوب عبر شبكة المحل مباشرة بنقرة واحدة، كما يمكنك حفظ المستند كملف PDF عالي الدقة ومشاركته عبر واتساب أو بلوتوث.",
    },
  ];

  return (
    <section id="faq" className="py-16 sm:py-24 border-b border-slate-800/60 bg-slate-950/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            إجابات واضحة
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
            {t("landing.faqTitle")}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            كل ما يدور في ذهنك حول المنصة وطريقة عملها في محلك
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-right p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-slate-100 hover:text-emerald-400 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <span
                    className={`w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-slate-400 transition-transform ${
                      isOpen ? "rotate-180 text-emerald-400 bg-emerald-500/10" : ""
                    }`}
                  >
                    ↓
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-sm sm:text-base text-slate-300 leading-relaxed border-t border-slate-800/60 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
