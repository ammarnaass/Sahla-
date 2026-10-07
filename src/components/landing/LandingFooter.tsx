"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@mui/material";
import { siteConfig } from "@/config/site";
import { footerQuickLinks, footerLegalLinks } from "@/config/navigation";

export function LandingFooter() {
  return (
    <footer className="py-12 border-t border-border bg-card text-muted-foreground text-sm font-cairo">
      <Container maxWidth="lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black">
                سـ
              </div>
              <span className="font-black text-foreground text-lg">{siteConfig.name}</span>
            </div>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              المنصة الوطنية الرائدة لرقمنة الأكشاك ومراكز الطباعة في الجزائر. نربط أصحاب المحلات بحلول سحابية ذكية ترفع الإنتاجية وتحمي البيانات.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-foreground text-sm mb-3">روابط سريعة</h4>
            <ul className="space-y-2 text-xs">
              {footerQuickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="font-bold text-foreground text-sm mb-3">الدعم القانوني</h4>
            <ul className="space-y-2 text-xs">
              {footerLegalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  هاتف الدعم: {siteConfig.supportPhone}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. جميع الحقوق محفوظة لجمهورية الجزائر الديمقراطية الشعبية 🇩🇿
          </p>
          <p className="flex items-center gap-1">
            صُنع بكل فخر لدعم أصحاب المشاريع الصغيرة في الجزائر 🇩🇿
          </p>
        </div>
      </Container>
    </footer>
  );
}
