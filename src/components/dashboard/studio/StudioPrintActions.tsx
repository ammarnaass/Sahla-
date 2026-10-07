"use client";

import React from "react";
import { Button } from "@/components/ui/button";
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
    <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3 w-full">
      <Button
        type="button"
        variant="ghost"
        onClick={onClose}
        disabled={isProcessing}
        className="text-xs sm:text-sm px-4 py-2.5 rounded-xl cursor-pointer min-h-[44px]"
      >
        إلغاء
      </Button>

      <Button
        type="submit"
        variant="primary"
        disabled={isProcessing || isInsufficient}
        className="text-xs sm:text-sm px-5 sm:px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-900/20 cursor-pointer active:scale-95 min-h-[44px] flex-1 sm:flex-initial"
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
