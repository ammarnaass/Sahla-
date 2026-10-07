"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { IconButton, Button as MuiButton } from "@mui/material";
import { Sun, Moon, Crown, ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site";

export function AdminHeader() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-background/85 border-b border-border px-4 sm:px-6 h-16 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-md group-hover:scale-105 transition-transform">
            <Crown size={20} className="text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm sm:text-base text-foreground font-cairo">
                لوحة تحكم مدير النظام الوطني
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <ShieldCheck size={12} /> SUPER ADMIN
              </span>
            </div>
            <span className="block text-[10px] text-muted-foreground font-medium">
              المنظومة المركزية لمتابعة 58 ولاية · {siteConfig.name} {siteConfig.version}
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-2.5">
        <IconButton
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="تبديل المظهر"
          sx={{
            color: "text.primary",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "10px",
            p: 1,
          }}
        >
          {theme === "dark" ? (
            <Sun size={17} className="text-amber-400" />
          ) : (
            <Moon size={17} className="text-slate-600" />
          )}
        </IconButton>

        <Link href="/dashboard">
          <MuiButton
            variant="outlined"
            size="small"
            startIcon={<ExternalLink size={14} />}
            sx={{
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "0.8rem",
              borderColor: "divider",
              color: "text.primary",
              "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
            }}
          >
            كاونتر المحل
          </MuiButton>
        </Link>

        <Link href="/">
          <MuiButton
            variant="contained"
            size="small"
            disableElevation
            startIcon={<ArrowLeft size={14} />}
            sx={{
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "0.8rem",
              bgcolor: "#10b981",
              "&:hover": { bgcolor: "#059669" },
            }}
          >
            الرئيسية
          </MuiButton>
        </Link>
      </div>
    </header>
  );
}
