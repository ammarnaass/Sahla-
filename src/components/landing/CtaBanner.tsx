"use client";

import React from "react";
import Link from "next/link";
import { Container, Button as MuiButton } from "@mui/material";

export function CtaBanner() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 via-teal-500/10 to-transparent pointer-events-none" />
      <Container maxWidth="md" sx={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <h2 className="text-3xl sm:text-5xl font-black text-foreground font-cairo mb-4 leading-tight">
          جاهز لتحويل كاونترك إلى محطة ذكية وسريعة؟
        </h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto font-cairo">
          انضم إلى أكثر من 1,200 كشك ومكتبة في الجزائر وابدأ في خدمة زبائنك باحترافية تامة خلال دقائق.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register" className="w-full sm:w-auto">
            <MuiButton
              variant="contained"
              size="large"
              disableElevation
              sx={{
                borderRadius: "12px",
                px: 5,
                py: 1.6,
                fontSize: "1.1rem",
                fontWeight: 800,
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "primary.dark" },
                boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)",
              }}
            >
              افتح حساب محلك مجاناً الآن
            </MuiButton>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <MuiButton
              variant="outlined"
              size="large"
              sx={{
                borderRadius: "12px",
                px: 4,
                py: 1.6,
                fontSize: "1.1rem",
                fontWeight: 700,
                borderColor: "divider",
                color: "text.primary",
                "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
              }}
            >
              تسجيل الدخول للمحل
            </MuiButton>
          </Link>
        </div>
      </Container>
    </section>
  );
}
