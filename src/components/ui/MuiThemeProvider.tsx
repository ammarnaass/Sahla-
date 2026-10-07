"use client";

import React, { useMemo, useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useTheme } from "next-themes";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

import { colors } from "@/lib/theme/colors";

// Create rtl cache
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

export function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  const theme = useMemo(
    () =>
      createTheme({
        direction: "rtl",
        palette: {
          mode: isDark ? "dark" : "light",
          primary: {
            main: isDark ? colors.semantic.dark.primary : colors.semantic.light.primary,
          },
          background: {
            default: isDark ? colors.semantic.dark.background : colors.semantic.light.background,
            paper: isDark ? colors.semantic.dark.paper : colors.semantic.light.paper,
          },
        },
        typography: {
          fontFamily: "inherit",
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "none",
                },
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                "& .MuiOutlinedInput-root": {
                  borderRadius: 12,
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: resolvedTheme === "dark" 
                  ? "0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)" 
                  : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                border: resolvedTheme === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.1)",
              },
            },
          },
        },
      }),
    [resolvedTheme]
  );

  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CacheProvider>
  );
}
