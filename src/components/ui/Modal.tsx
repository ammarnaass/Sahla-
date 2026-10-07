"use client";

import React, { useEffect } from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full" | string;
  layout?: "default" | "workspace";
  className?: string;
  contentClassName?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "md",
  layout = "default",
  className,
  contentClassName,
}: ModalProps) {
  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidths: Record<string, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    full: "max-w-[98vw]",
    "max-w-sm": "max-w-sm",
    "max-w-md": "max-w-md",
    "max-w-lg": "max-w-lg",
    "max-w-xl": "max-w-xl",
    "max-w-2xl": "max-w-2xl",
    "max-w-3xl": "max-w-3xl",
    "max-w-4xl": "max-w-4xl",
    "max-w-5xl": "max-w-5xl",
    "max-w-6xl": "max-w-6xl",
    "max-w-7xl": "max-w-7xl",
  };

  const resolvedMaxWidth = maxWidths[maxWidth] || maxWidth;
  const isWorkspace = layout === "workspace";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isWorkspace
          ? "p-0 sm:p-4 md:p-6 overflow-hidden"
          : "p-4 sm:p-6 overflow-y-auto"
      }`}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${resolvedMaxWidth} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-10 transition-colors duration-200 ${
          isWorkspace
            ? "h-[100dvh] sm:h-[92dvh] max-h-[100dvh] sm:max-h-[92dvh] flex flex-col rounded-none sm:rounded-2xl overflow-hidden my-0"
            : "rounded-2xl overflow-hidden my-8"
        } ${className || ""}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        {(title || description) && (
          <div
            className={`border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4 ${
              isWorkspace
                ? "p-4 sm:p-5 shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md"
                : "p-6"
            }`}
          >
            <div className="min-w-0 flex-1">
              {title && (
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight truncate">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5 truncate">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              aria-label="إغلاق"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div
          className={
            contentClassName ||
            (isWorkspace ? "p-4 sm:p-6 flex-1 min-h-0 overflow-y-auto" : "p-6")
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}
