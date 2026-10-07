"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/ui/ThemeProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon, Globe, ChevronDown, ArrowLeft } from "lucide-react";

interface LandingNavbarProps {
  onOpenAuth: (mode?: "login" | "register") => void;
}

export function LandingNavbar({ onOpenAuth }: LandingNavbarProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();
  const { isLoggedIn, session } = useAuth();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? (resolvedTheme || theme || "dark") : "dark";

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/85 border-b border-border transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-emerald-950/20 group-hover:scale-105 transition-transform">
            سـ
          </div>
          <div className="flex flex-col text-right">
            <span className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-1.5 font-display">
              <span>سهلة</span>
              <Badge variant="primary" className="text-[10px] font-bold px-1.5 py-0">
                Sahla
              </Badge>
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              المنصة الرقمية للكيوسكات والمكتبات 🇩🇿
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link
            href="/pricing"
            className="text-primary font-bold hover:text-primary/80 transition-colors"
          >
            باقات الاشتراك SaaS
          </Link>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">
            {t("landing.howItWorksTitle")}
          </a>
          <a href="#services" className="hover:text-foreground transition-colors">
            {t("nav.services")}
          </a>
          <a href="#calculator" className="hover:text-foreground transition-colors">
            {t("landing.calcTitle")}
          </a>
          <a href="#faq" className="hover:text-foreground transition-colors">
            {t("landing.faqTitle")}
          </a>
        </nav>

        {/* Right Actions: Lang Switcher, Theme Toggle, Auth CTA */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="h-9 px-2.5 text-xs font-bold gap-1 cursor-pointer"
              aria-label="تبديل اللغة"
            >
              <Globe className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{locale === "ar" ? "عربي" : locale === "fr" ? "FR" : "EN"}</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground opacity-70" />
            </Button>

            {langMenuOpen && (
              <div
                className="absolute top-11 left-0 sm:right-0 sm:left-auto w-32 bg-popover text-popover-foreground border border-border rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setLangMenuOpen(false)}
              >
                <button
                  onClick={() => setLocale("ar")}
                  className={`w-full text-right px-3.5 py-1.5 text-xs font-semibold hover:bg-muted transition-colors cursor-pointer ${
                    locale === "ar" ? "text-primary font-bold bg-primary/10" : ""
                  }`}
                >
                  العربية (RTL)
                </button>
                <button
                  onClick={() => setLocale("fr")}
                  className={`w-full text-right px-3.5 py-1.5 text-xs font-semibold hover:bg-muted transition-colors cursor-pointer ${
                    locale === "fr" ? "text-primary font-bold bg-primary/10" : ""
                  }`}
                >
                  Français (FR)
                </button>
                <button
                  onClick={() => setLocale("en")}
                  className={`w-full text-right px-3.5 py-1.5 text-xs font-semibold hover:bg-muted transition-colors cursor-pointer ${
                    locale === "en" ? "text-primary font-bold bg-primary/10" : ""
                  }`}
                >
                  English (EN)
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-xl cursor-pointer"
            aria-label="تبديل الوضع الليلي والنهاري"
          >
            {currentTheme === "light" ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-muted-foreground" />
            )}
          </Button>

          {/* User Auth Buttons or Go to Dashboard */}
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button size="sm" variant="primary" className="gap-1.5">
                <span>{session?.shop?.name || t("nav.home")}</span>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:inline-flex text-xs font-bold text-muted-foreground hover:text-foreground"
                >
                  {t("common.login")}
                </Button>
              </Link>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onOpenAuth("register")}
                className="shadow-sm text-xs font-bold"
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

