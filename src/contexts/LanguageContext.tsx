"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { SupportedLocale, LOCALES, translations, TranslationKeys } from "@/lib/i18n";

interface LanguageContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  dir: "rtl" | "ltr";
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = "sahla_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>("ar");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedLocale | null;
      if (saved && (saved === "ar" || saved === "fr" || saved === "en")) {
        setLocaleState(saved);
      } else {
        // Detect from browser or default ar
        const navLang = navigator.language?.toLowerCase() || "";
        if (navLang.startsWith("fr")) setLocaleState("fr");
        else if (navLang.startsWith("en")) setLocaleState("en");
        else setLocaleState("ar");
      }
    } catch {
      // Fallback
      setLocaleState("ar");
    }
  }, []);

  const setLocale = useCallback((newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
      document.documentElement.lang = newLocale;
      document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const dir: "rtl" | "ltr" = locale === "ar" ? "rtl" : "ltr";

  // Quick dot notation lookup e.g. t("landing.heroTitle") or t("common.points")
  const t = useCallback(
    (path: string): string => {
      const parts = path.split(".");
      if (parts.length !== 2) return path;
      const [section, key] = parts as [keyof TranslationKeys, string];

      const dict = translations[locale] || translations.ar;
      const sec = dict[section] as Record<string, string> | undefined;
      if (sec && sec[key]) return sec[key];

      const fallbackSec = translations.ar[section] as Record<string, string> | undefined;
      if (fallbackSec && fallbackSec[key]) return fallbackSec[key];

      return path;
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, dir, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
