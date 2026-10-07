"use client";

import React from "react";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Button as MuiButton,
} from "@mui/material";
import { headerNavLinks } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { UserNavDropdown } from "@/components/navigation/UserNavDropdown";

export function LandingNavbar({ mounted }: { mounted?: boolean }) {
  const { isLoggedIn } = useAuth();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.default",
        borderBottom: "1px solid",
        borderColor: "divider",
        backdropFilter: "blur(16px)",
        backgroundColor: "var(--color-surface-header, rgba(2, 6, 23, 0.85))",
        zIndex: 50,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: "space-between", py: 1, px: { xs: 0, sm: 2 } }}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-900/25 group-hover:scale-105 transition-transform">
              سـ
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg text-foreground tracking-tight flex items-center gap-1.5 font-cairo">
                {siteConfig.name}
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {siteConfig.version}
                </span>
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                {siteConfig.description}
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            {headerNavLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-foreground ${
                  link.highlight
                    ? "text-emerald-600 dark:text-emerald-400 font-bold"
                    : ""
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <ThemeToggle variant="icon" />

            {isLoggedIn ? (
              <UserNavDropdown />
            ) : (
              <>
                <Link href="/login">
                  <MuiButton
                    variant="outlined"
                    sx={{
                      borderRadius: "10px",
                      fontWeight: 700,
                      px: 2.5,
                      py: 0.8,
                      fontSize: "0.875rem",
                      borderColor: "divider",
                      color: "text.primary",
                      "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
                    }}
                  >
                    دخول المحل
                  </MuiButton>
                </Link>

                <Link href="/register" className="hidden sm:inline-block">
                  <MuiButton
                    variant="contained"
                    disableElevation
                    sx={{
                      borderRadius: "10px",
                      fontWeight: 700,
                      px: 2.5,
                      py: 0.8,
                      fontSize: "0.875rem",
                      bgcolor: "primary.main",
                      "&:hover": { bgcolor: "primary.dark" },
                    }}
                  >
                    افتح حساباً مجاناً
                  </MuiButton>
                </Link>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
