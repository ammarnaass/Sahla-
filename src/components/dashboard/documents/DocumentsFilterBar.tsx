"use client";

import React from "react";

interface DocumentsFilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  filterType: string;
  onFilterChange: (type: string) => void;
}

const FILTER_BUTTONS = [
  { id: "ALL", label: "الكل" },
  { id: "CV", label: "سير ذاتية" },
  { id: "INVOICE", label: "فواتير" },
  { id: "ID_PHOTO", label: "صور هوية" },
  { id: "FORM", label: "استمارات" },
];

export function DocumentsFilterBar({
  search,
  onSearchChange,
  filterType,
  onFilterChange,
}: DocumentsFilterBarProps) {
  return (
    <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-lg transition-colors">
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="w-full sm:max-w-xs relative">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="بحث باسم الزبون أو نوع الوثيقة..."
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {FILTER_BUTTONS.map((btn) => (
            <button
              key={btn.id}
              onClick={() => onFilterChange(btn.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                filterType === btn.id
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                  : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
