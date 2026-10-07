"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container, Slider, Button as MuiButton } from "@mui/material";

export function RoiCalculator() {
  const [pagesPerDay, setPagesPerDay] = useState<number>(120);

  // Calculations
  const averagePricePerPage = 15; // DZD
  const monthlyRevenue = pagesPerDay * averagePricePerPage * 30;
  const platformCost = 2000; // estimated plan cost
  const netProfit = monthlyRevenue - platformCost;

  const formatDZD = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <section id="calculator" className="py-20 sm:py-28 border-b border-border">
      <Container maxWidth="md">
        <div className="p-8 sm:p-12 rounded-3xl bg-card border border-border shadow-xl">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
              آلة حاسبة تفاعلية
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-foreground mt-1 font-cairo">
              كم ستجني شهرياً مع منظومة سهلة؟
            </h3>
            <p className="text-sm text-muted-foreground mt-2 font-cairo">
              حرّك المؤشر بحسب متوسط عدد الصفحات التي يطبعها محلك يومياً لرؤية العائد التقريبي:
            </p>
          </div>

          {/* Slider Controller */}
          <div className="mb-10 px-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-foreground">
                معدل الصفحات اليومية:
              </span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {pagesPerDay} صفحة / يوم
              </span>
            </div>
            <Slider
              value={pagesPerDay}
              onChange={(_, val) => setPagesPerDay(val as number)}
              min={20}
              max={500}
              step={10}
              sx={{
                color: "#10b981",
                height: 8,
                "& .MuiSlider-thumb": {
                  width: 24,
                  height: 24,
                  backgroundColor: "#fff",
                  border: "3px solid #10b981",
                },
              }}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>20 صفحة (محل هادئ)</span>
              <span>250 صفحة (متوسط)</span>
              <span>500+ صفحة (مكتبة جامعية)</span>
            </div>
          </div>

          {/* Results Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
            <div className="p-5 rounded-2xl bg-muted/40 border border-border">
              <div className="text-xs font-bold text-muted-foreground mb-1">
                الدخل الشهري المتوقع من الطباعة
              </div>
              <div className="text-3xl font-black text-foreground font-mono">
                {formatDZD(monthlyRevenue)} دج
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                صافي الربح الإضافي التقديري
              </div>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {formatDZD(netProfit)} دج
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/register">
              <MuiButton
                variant="contained"
                size="large"
                disableElevation
                sx={{
                  borderRadius: "12px",
                  px: 5,
                  py: 1.4,
                  fontWeight: 800,
                  bgcolor: "#10b981",
                  "&:hover": { bgcolor: "#059669" },
                }}
              >
                ابدأ في زيادة مداخيلك اليوم
              </MuiButton>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
