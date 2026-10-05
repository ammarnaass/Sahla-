"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { WirelessPrintIcon, BoltIcon } from "@/components/ui/Icons";

interface StudioPrintActionsProps {
  onClose: () => void;
  isProcessing: boolean;
  isInsufficient: boolean;
}

export function StudioPrintActions({
  onClose,
  isProcessing,
  isInsufficient,
}: StudioPrintActionsProps) {
  return (
    <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
      <Button
        type="button"
        variant="ghost"
        onClick={onClose}
        disabled={isProcessing}
        className="text-xs cursor-pointer"
      >
        إلغاء
      </Button>

      <Button
        type="submit"
        variant="primary"
        disabled={isProcessing || isInsufficient}
        className="text-xs px-6 py-2.5 flex items-center gap-2 shadow-lg shadow-emerald-900/30 cursor-pointer active:scale-95"
      >
        {isProcessing ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span>جاري التوليد بدقة A4 وإرسال الأمر...</span>
          </>
        ) : (
          <>
            <WirelessPrintIcon className="w-4 h-4" />
            <span>توليد وطباعة فورية</span>
          </>
        )}
      </Button>
    </div>
  );
}
