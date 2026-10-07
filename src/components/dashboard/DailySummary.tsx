"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3, FileText, Zap, TrendingUp, Calendar } from "lucide-react";

interface DailySummaryProps {
  docsCount: number;
  pointsUsed: number;
  estimatedProfitDZD: number;
}

export function DailySummary({
  docsCount,
  pointsUsed,
  estimatedProfitDZD,
}: DailySummaryProps) {
  return (
    <Card className="text-right shadow-sm border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border space-y-0">
        <CardTitle className="text-sm font-bold flex items-center gap-2 font-cairo">
          <BarChart3 className="w-4 h-4 text-primary" />
          <span>ملخص النشاط اليومي</span>
        </CardTitle>
        <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
          <span>
            {new Date().toLocaleDateString("ar-DZ", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </span>
        </span>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {/* Metric 1: Today Docs */}
          <div className="p-2.5 sm:p-3 rounded-2xl bg-muted/40 hover:bg-muted/70 border border-border text-center transition-colors">
            <span className="text-[10px] sm:text-[11px] text-muted-foreground flex items-center justify-center gap-1 mb-1 truncate">
              <FileText className="w-3 h-3 text-muted-foreground/70 shrink-0" />
              <span>الوثائق</span>
            </span>
            <span className="text-lg sm:text-2xl font-black text-foreground font-mono">
              {docsCount}
            </span>
          </div>

          {/* Metric 2: Points Used */}
          <div className="p-2.5 sm:p-3 rounded-2xl bg-muted/40 hover:bg-muted/70 border border-border text-center transition-colors">
            <span className="text-[10px] sm:text-[11px] text-muted-foreground flex items-center justify-center gap-1 mb-1 truncate">
              <Zap className="w-3 h-3 text-amber-500 shrink-0" />
              <span>النقاط</span>
            </span>
            <span className="text-lg sm:text-2xl font-black text-primary font-mono">
              {pointsUsed}
            </span>
          </div>

          {/* Metric 3: Estimated Profit */}
          <div className="p-2.5 sm:p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-center">
            <span className="text-[10px] sm:text-[11px] text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center gap-1 mb-1 truncate">
              <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>الربح</span>
            </span>
            <span className="text-base sm:text-xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
              +{estimatedProfitDZD.toLocaleString()}
            </span>
            <span className="block text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">دج</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
