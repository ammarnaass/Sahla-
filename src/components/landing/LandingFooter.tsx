"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export function LandingFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 py-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Bio */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-extrabold text-lg">
                سـ
              </div>
              <span className="text-xl font-black text-white">سهلة · Sahla</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              المنصة الرقمية المتكاملة لتمكين أصحاب الكيوسكات، المكتبات ومقاهي الإنترنت في مختلف ولايات الجزائر من إنجاز وثائق احترافية لزبائنهم في دقائق معدودة.
            </p>
            <div className="flex items-center gap-3 text-xs text-emerald-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>الخدمة شغالة ومتاحة في 58 ولاية 🇩🇿</span>
              </span>
            </div>
          </div>

          {/* Col 2: Legal & Laws */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">الإطار القانوني</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-300 font-medium">قانون رقم 18-07:</span> حماية الأشخاص الطبيعيين في معالجة المعطيات ذات الطابع الشخصي.
              </li>
              <li>
                <span className="text-slate-300 font-medium">قانون رقم 18-05:</span> التجارة الإلكترونية والدفع الإلكتروني المعتمد.
              </li>
              <li>
                <a href="#terms" className="hover:text-emerald-400 transition-colors">
                  الشروط والأحكام
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-emerald-400 transition-colors">
                  سياسة الخصوصية
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Support & Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">المساعدة والدعم</h4>
            <div className="space-y-2.5 text-xs">
              <a
                href="https://wa.me/213555000000"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 font-bold hover:bg-emerald-600/20 transition-colors"
              >
                <span>💬</span>
                <span>تواصل معنا عبر واتساب</span>
              </a>
              <p className="text-slate-400">
                فريق الدعم الفني متواجد لمساعدتك طيلة أيام الأسبوع من 08:00 إلى 20:00.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} سهلة · Sahla. {t("landing.footerNotice")}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">صنع بكل فخر لأصحاب المحلات في الجزائر 🇩🇿</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
