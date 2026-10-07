/**
 * ═══════════════════════════════════════════════════════════
 * Sahla Design System · Core Color Palette & Semantic Tokens
 * ═══════════════════════════════════════════════════════════
 */

export const colors = {
  emerald: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981", // Brand Primary
    600: "#059669", // Darker Primary / Hover
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
  },
  teal: {
    400: "#2dd4bf",
    500: "#14b8a6",
    600: "#0d9488",
  },
  amber: {
    400: "#fbbf24",
    500: "#f59e0b", // Accent / Admin
    600: "#d97706",
  },
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617",
  },
  semantic: {
    dark: {
      background: "#020617",
      paper: "#0f172a",
      card: "#0f172a",
      border: "#1e293b",
      primary: "#10b981",
      primaryHover: "#059669",
      textPrimary: "#f8fafc",
      textSecondary: "#94a3b8",
    },
    light: {
      background: "#f8fafc",
      paper: "#ffffff",
      card: "#ffffff",
      border: "#e2e8f0",
      primary: "#059669",
      primaryHover: "#047857",
      textPrimary: "#0f172a",
      textSecondary: "#64748b",
    },
  },
} as const;
