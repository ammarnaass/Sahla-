"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";

interface ThemeContextType {
  theme?: string;
  resolvedTheme?: string;
  setTheme: (theme: string) => void;
  themes: string[];
  systemTheme?: string;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  resolvedTheme: "dark",
  setTheme: () => {},
  themes: ["light", "dark"],
});

function applyThemeToDOM(theme: string) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const isDark = theme === "dark";

  if (isDark) {
    root.classList.add("dark");
    root.classList.remove("light");
    root.setAttribute("data-theme", "dark");
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    root.classList.add("light");
    root.setAttribute("data-theme", "light");
    root.style.colorScheme = "light";
  }
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "theme",
}: {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}) {
  const [theme, setThemeState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored === "light" || stored === "dark") return stored;
      } catch (e) {}
    }
    return defaultTheme;
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(storageKey);
      const active = stored === "light" || stored === "dark" ? stored : defaultTheme;
      setThemeState(active);
      applyThemeToDOM(active);
    } catch (e) {
      applyThemeToDOM(defaultTheme);
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        setThemeState(e.newValue);
        applyThemeToDOM(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [defaultTheme, storageKey]);

  const setTheme = useCallback(
    (newTheme: string) => {
      setThemeState(newTheme);
      applyThemeToDOM(newTheme);
      try {
        localStorage.setItem(storageKey, newTheme);
        localStorage.setItem("sahla_theme", newTheme);
      } catch (e) {}
    },
    [storageKey]
  );

  const value = useMemo(
    () => ({
      theme: mounted ? theme : defaultTheme,
      resolvedTheme: mounted ? theme : defaultTheme,
      setTheme,
      themes: ["light", "dark"],
    }),
    [theme, mounted, defaultTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
