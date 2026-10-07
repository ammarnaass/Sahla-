"use client";

import React from "react";
import { QrCode } from "lucide-react";
import { Button as MuiButton } from "@mui/material";

interface QrLoginScannerProps {
  onSimulateScan: () => void;
}

export function QrLoginScanner({ onSimulateScan }: QrLoginScannerProps) {
  return (
    <div className="py-6 text-center space-y-4">
      <div className="w-44 h-44 mx-auto rounded-2xl bg-muted/40 border-2 border-dashed border-emerald-500/40 p-4 flex flex-col items-center justify-center">
        <QrCode size={88} className="text-emerald-600 dark:text-emerald-400 mb-2 animate-pulse" />
        <span className="text-[11px] font-bold text-muted-foreground">
          كود جلسة الكاونتر المباشرة
        </span>
      </div>
      <p className="text-xs text-muted-foreground max-w-xs mx-auto font-cairo">
        افتح تطبيق سهلة على هاتفك واضغط على <strong>مسح QR</strong> للدخول المباشر إلى هذا الحاسوب بدون كلمة سر.
      </p>
      <MuiButton
        variant="outlined"
        size="small"
        onClick={onSimulateScan}
        sx={{ borderRadius: "10px", fontSize: "0.8rem", fontWeight: 700 }}
      >
        محاكاة المسح الناجح (تجربة)
      </MuiButton>
    </div>
  );
}
