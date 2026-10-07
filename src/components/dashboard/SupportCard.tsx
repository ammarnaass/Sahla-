"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, ExternalLink } from "lucide-react";

export function SupportCard() {
  return (
    <Card className="shadow-sm border-emerald-500/25 dark:border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 via-card to-card">
      <CardContent className="p-4 text-right flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/25 flex items-center justify-center text-primary shrink-0">
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground">هل تواجه أي صعوبة أو استفسار؟</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">فريق الدعم الفني جاهز لمساعدتك عبر واتساب</p>
          </div>
        </div>

        <a
          href="https://wa.me/213555000000"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-colors shrink-0 shadow-sm select-none"
        >
          <span>محادثة واتساب</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </CardContent>
    </Card>
  );
}

