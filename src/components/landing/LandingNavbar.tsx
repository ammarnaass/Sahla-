"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";

interface LandingNavbarProps {
  onOpenAuth: (mode?: "login" | "register") => void;
}

export function LandingNavbar({ onOpenAuth }: LandingNavbarProps) {
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();
  const { isLoggedIn, session, logout } = useAuth();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-slate-950/85 border-b border-slate-200 dark:border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-emerald-600/25 group-hover:scale-105 transition-transform">
            سـ
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
              <span>سهلة</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-500/30">
                Sahla
              </span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              المنصة الرقمية للكيوسكات والمكتبات 🇩🇿
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link href="/pricing" className="text-emerald-700 dark:text-emerald-400 font-bold hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">
            باقات الاشتراك SaaS
          </Link>
          <a href="#how-it-works" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
            {t("landing.howItWorksTitle")}
          </a>
          <a href="#services" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
            {t("nav.services")}
          </a>
          <a href="#calculator" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
            {t("landing.calcTitle")}
          </a>
          <a href="#faq" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
            {t("landing.faqTitle")}
          </a>
        </nav>

        {/* Right Actions: Lang Switcher, Theme Toggle, Auth CTA */}
        <div className="flex items-center gap-2.5">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              aria-label="تبديل اللغة"
            >
              <span>{locale === "ar" ? "عربي" : locale === "fr" ? "FR" : "EN"}</span>
              <svg className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {langMenuOpen && (
              <div
                className="absolute top-12 left-0 sm:right-0 sm:left-auto w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setLangMenuOpen(false)}
              >
                <button
                  onClick={() => setLocale("ar")}
                  className={`w-full text-right px-3.5 py-1.5 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                    locale === "ar" ? "text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-500/10" : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  العربية (RTL)
                </button>
                <button
                  onClick={() => setLocale("fr")}
                  className={`w-full text-right px-3.5 py-1.5 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                    locale === "fr" ? "text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-500/10" : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  Français (FR)
                </button>
                <button
                  onClick={() => setLocale("en")}
                  className={`w-full text-right px-3.5 py-1.5 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                    locale === "en" ? "text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-500/10" : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  English (EN)
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="تبديل الوضع الليلي والنهاري"
          >
            {theme === "light" ? (
              <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* User Auth Buttons or Go to Dashboard */}
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button size="sm" variant="primary">
                <span>{session?.shop?.name || t("nav.home")}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenAuth("login")}
                className="hidden sm:inline-flex text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                {t("common.login")}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onOpenAuth("register")}
                className="shadow-sm"
              >
                {t("common.startFree")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
