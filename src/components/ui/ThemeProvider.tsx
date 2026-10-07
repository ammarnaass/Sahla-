"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute={["class", "data-theme"]}
      defaultTheme="dark"
      enableSystem={false}
      storageKey="theme"
      disableTransitionOnChange={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

export function useTheme() {
  const { theme, setTheme: setNextTheme, resolvedTheme, systemTheme } = useNextTheme();
  const [mounted, setMounted] = React.useState(false);

  // Directly and synchronously enforce DOM classes and data-theme attribute
  const applyDOMTheme = React.useCallback((targetTheme: string) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (targetTheme === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
      root.setAttribute("data-theme", "light");
      root.style.colorScheme = "light";
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
      root.style.colorScheme = "dark";
    }
  }, []);

  React.useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme") || resolvedTheme || theme || "dark";
    applyDOMTheme(saved);
  }, [resolvedTheme, theme, applyDOMTheme]);

  const currentTheme = mounted ? (resolvedTheme || theme || "dark") : "dark";

  const setTheme = React.useCallback(
    (newTheme: string) => {
      setNextTheme(newTheme);
      applyDOMTheme(newTheme);
      try {
        localStorage.setItem("theme", newTheme);
      } catch {
        // Ignore
      }
    },
    [setNextTheme, applyDOMTheme]
  );

  const toggleTheme = React.useCallback(() => {
    const nextTheme = (resolvedTheme || theme || currentTheme) === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  }, [resolvedTheme, theme, currentTheme, setTheme]);

  return {
    theme: currentTheme,
    resolvedTheme: currentTheme,
    setTheme,
    toggleTheme,
    isDark: currentTheme === "dark",
    isLight: currentTheme === "light",
    mounted,
    systemTheme,
  };
}
